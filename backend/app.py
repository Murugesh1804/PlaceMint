from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError
import bcrypt
import os
from datetime import datetime, timedelta, timezone
from email_validator import validate_email, EmailNotValidError
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-key-change-in-production')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)

# Initialize extensions
jwt = JWTManager(app)
CORS(app, origins=['http://localhost:3000', 'http://127.0.0.1:3000'])

# MongoDB connection and fallback
MONGO_URI = os.environ.get('MONGO_URI', 'mongodb://localhost:27017/')
USE_MONGODB = True

# Handle MongoDB Atlas SSL connection
if 'mongodb.net' in MONGO_URI:
    # For MongoDB Atlas, add SSL parameters
    try:
        client = MongoClient(MONGO_URI, 
                            tls=True, 
                            tlsAllowInvalidCertificates=True,
                            serverSelectionTimeoutMS=5000)
        # Test the connection
        client.admin.command('ping')
        print("✅ MongoDB Atlas connected successfully!")
        USE_MONGODB = True
    except Exception as e:
        print(f"❌ MongoDB Atlas connection failed: {e}")
        print("⚠️  Falling back to in-memory storage for development")
        USE_MONGODB = False
        client = None
else:
    # For local MongoDB
    try:
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
        client.admin.command('ping')
        print("✅ Local MongoDB connected successfully!")
        USE_MONGODB = True
    except Exception as e:
        print(f"❌ Local MongoDB connection failed: {e}")
        print("⚠️  Falling back to in-memory storage for development")
        USE_MONGODB = False
        client = None

# Initialize database
if USE_MONGODB:
    db = client['placement_tracker']
    users_collection = db['users']
    
    # Create indexes (only if connection is successful)
    try:
        users_collection.create_index('email', unique=True)
        print("✅ Database indexes created successfully!")
    except Exception as e:
        print(f"⚠️  Could not create indexes: {e}")
else:
    # In-memory storage fallback
    print("📝 Using in-memory storage (data will be lost on restart)")
    users_collection = None

# In-memory storage for development fallback
in_memory_users = {}
user_id_counter = 1

# Helper functions
def hash_password(password):
    """Hash a password using bcrypt"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def check_password(password, hashed):
    """Check if password matches hash"""
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def validate_user_data(data):
    """Validate user registration data"""
    errors = {}
    
    # Validate name
    if not data.get('name') or len(data['name'].strip()) < 2:
        errors['name'] = 'Name must be at least 2 characters long'
    
    # Validate email
    if not data.get('email'):
        errors['email'] = 'Email is required'
    else:
        try:
            validate_email(data['email'])
        except EmailNotValidError:
            errors['email'] = 'Invalid email format'
    
    # Validate password
    if not data.get('password') or len(data['password']) < 6:
        errors['password'] = 'Password must be at least 6 characters long'
    
    return errors

def create_user_response(user):
    """Create user response object"""
    return {
        '_id': str(user['_id']),
        'name': user['name'],
        'email': user['email'],
        'role': user.get('role', 'user'),
        'is_active': user.get('is_active', True),
        'created_at': user.get('created_at', datetime.now(timezone.utc)).isoformat(),
        'updated_at': user.get('updated_at', datetime.now(timezone.utc)).isoformat()
    }

# In-memory storage helpers
def find_user_by_email(email):
    """Find user by email (works with both MongoDB and in-memory)"""
    if USE_MONGODB:
        return users_collection.find_one({'email': email})
    else:
        for user in in_memory_users.values():
            if user['email'] == email:
                return user
        return None

def insert_user(user_data):
    """Insert user (works with both MongoDB and in-memory)"""
    global user_id_counter
    if USE_MONGODB:
        result = users_collection.insert_one(user_data)
        user_data['_id'] = result.inserted_id
        return user_data
    else:
        user_data['_id'] = user_id_counter
        in_memory_users[user_id_counter] = user_data
        user_id_counter += 1
        return user_data

def find_user_by_id(user_id):
    """Find user by ID (works with both MongoDB and in-memory)"""
    if USE_MONGODB:
        from bson import ObjectId
        try:
            # Convert string to ObjectId for MongoDB
            object_id = ObjectId(user_id)
            return users_collection.find_one({'_id': object_id})
        except:
            return None
    else:
        return in_memory_users.get(int(user_id))

def count_users():
    """Count users (works with both MongoDB and in-memory)"""
    if USE_MONGODB:
        return users_collection.count_documents({})
    else:
        return len(in_memory_users)

# Routes
@app.route('/api/auth/register', methods=['POST'])
def register():
    """User registration endpoint"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'message': 'No data provided'
            }), 400
        
        # Validate input data
        errors = validate_user_data(data)
        if errors:
            return jsonify({
                'success': False,
                'message': 'Validation failed',
                'errors': errors
            }), 400
        
        # Check if user already exists
        existing_user = find_user_by_email(data['email'])
        if existing_user:
            return jsonify({
                'success': False,
                'message': 'User with this email already exists'
            }), 409
        
        # Create new user
        user_data = {
            'name': data['name'].strip(),
            'email': data['email'].lower().strip(),
            'password_hash': hash_password(data['password']),
            'role': data.get('role', 'user'),
            'is_active': True,
            'created_at': datetime.now(timezone.utc),
            'updated_at': datetime.now(timezone.utc)
        }
        
        user_data = insert_user(user_data)
        
        # Create JWT token
        access_token = create_access_token(identity=str(user_data['_id']))
        
        return jsonify({
            'success': True,
            'message': 'User registered successfully',
            'data': create_user_response(user_data),
            'token': access_token
        }), 201
        
    except DuplicateKeyError:
        return jsonify({
            'success': False,
            'message': 'User with this email already exists'
        }), 409
    except Exception as e:
        print(f"Registration error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Internal server error'
        }), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    """User login endpoint"""
    try:
        data = request.get_json()
        print(f"Login attempt for email: {data.get('email') if data else 'No data'}")
        
        if not data:
            return jsonify({
                'success': False,
                'message': 'No data provided'
            }), 400
        
        email = data.get('email', '').lower().strip()
        password = data.get('password', '')
        
        if not email or not password:
            return jsonify({
                'success': False,
                'message': 'Email and password are required'
            }), 400
        
        # Find user by email
        user = find_user_by_email(email)
        print(f"User found: {user is not None}")
        
        if not user:
            return jsonify({
                'success': False,
                'message': 'Invalid email or password'
            }), 401
        
        # Check if user is active
        if not user.get('is_active', True):
            return jsonify({
                'success': False,
                'message': 'Account is deactivated'
            }), 401
        
        # Verify password
        password_valid = check_password(password, user['password_hash'])
        print(f"Password valid: {password_valid}")
        
        if not password_valid:
            return jsonify({
                'success': False,
                'message': 'Invalid email or password'
            }), 401
        
        # Create JWT token
        access_token = create_access_token(identity=str(user['_id']))
        print(f"Login successful for user: {user['email']}")
        
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'data': create_user_response(user),
            'token': access_token
        }), 200
        
    except Exception as e:
        print(f"Login error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Internal server error'
        }), 500

@app.route('/api/auth/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """Get current user information"""
    try:
        user_id = get_jwt_identity()
        user = find_user_by_id(user_id)
        
        if not user:
            return jsonify({
                'success': False,
                'message': 'User not found'
            }), 404
        
        return jsonify({
            'success': True,
            'data': create_user_response(user)
        }), 200
        
    except Exception as e:
        print(f"Get user error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Internal server error'
        }), 500

@app.route('/api/auth/logout', methods=['POST'])
@jwt_required()
def logout():
    """User logout endpoint (client-side token removal)"""
    return jsonify({
        'success': True,
        'message': 'Logout successful'
    }), 200

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'success': True,
        'message': 'Backend is running',
        'timestamp': datetime.now(timezone.utc).isoformat()
    }), 200

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'success': False,
        'message': 'Endpoint not found'
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'success': False,
        'message': 'Internal server error'
    }), 500

if __name__ == '__main__':
    # Create a default admin user if no users exist
    try:
        if count_users() == 0:
            admin_user = {
                'name': 'Admin User',
                'email': 'admin@example.com',
                'password_hash': hash_password('admin123'),
                'role': 'admin',
                'is_active': True,
                'created_at': datetime.now(timezone.utc),
                'updated_at': datetime.now(timezone.utc)
            }
            insert_user(admin_user)
            print("✅ Default admin user created: admin@example.com / admin123")
        else:
            print("ℹ️  Database already has users, skipping admin creation")
    except Exception as e:
        print(f"⚠️  Could not create admin user: {e}")
        print("ℹ️  You can create users through the API once connected")
    
    print("🚀 Starting Flask server on http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)
