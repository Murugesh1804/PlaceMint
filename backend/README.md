# Placement Tracker Backend

A Flask-based backend API for the Placement Tracker application with MongoDB integration.

## Features

- **Authentication System**
  - User registration with email validation
  - User login with JWT tokens
  - Password hashing with bcrypt
  - Protected routes with JWT authentication

- **Database**
  - MongoDB integration with PyMongo
  - User collection with email uniqueness
  - Automatic admin user creation

## Setup Instructions

### Prerequisites

1. **Python 3.8+**
2. **MongoDB** (local or cloud)
3. **pip** (Python package manager)

### Installation

1. **Clone the repository and navigate to backend:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables:**
   Create a `.env` file in the backend directory:
   ```env
   SECRET_KEY=your-super-secret-key-change-this-in-production
   JWT_SECRET_KEY=your-jwt-secret-key-change-this-in-production
   MONGO_URI=mongodb://localhost:27017/
   ```

4. **Start MongoDB:**
   - **Local MongoDB:** Start your local MongoDB service
   - **MongoDB Atlas:** Use your cloud MongoDB connection string

5. **Run the application:**
   ```bash
   python app.py
   ```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info (requires JWT)
- `POST /api/auth/logout` - Logout user (requires JWT)

### Health Check

- `GET /api/health` - Check if backend is running

## API Usage Examples

### Register a new user
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get current user (with JWT token)
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Default Admin User

On first run, a default admin user is created:
- **Email:** admin@example.com
- **Password:** admin123
- **Role:** admin

**Important:** Change these credentials in production!

## Database Schema

### Users Collection
```json
{
  "_id": "ObjectId",
  "name": "string",
  "email": "string (unique)",
  "password_hash": "string",
  "role": "string (user/admin)",
  "is_active": "boolean",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SECRET_KEY` | Flask secret key | `dev-secret-key-change-in-production` |
| `JWT_SECRET_KEY` | JWT signing key | `jwt-secret-key-change-in-production` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/` |

## Development

### Running in Development Mode
```bash
python app.py
```

### Testing the API
You can test the API using tools like:
- **Postman**
- **cURL**
- **Thunder Client (VS Code extension)**

## Security Features

- **Password Hashing:** All passwords are hashed using bcrypt
- **JWT Authentication:** Secure token-based authentication
- **Input Validation:** Email and password validation
- **CORS Protection:** Configured for frontend origins
- **Error Handling:** Comprehensive error responses

## Next Steps

This backend provides the foundation for the Placement Tracker. Future features can include:

1. **Applications Management**
   - CRUD operations for job applications
   - Status tracking
   - Company information

2. **Analytics**
   - Application statistics
   - Success rate tracking
   - Dashboard data

3. **AI Integration**
   - Resume analysis
   - Interview preparation tools
   - Application optimization

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error:**
   - Ensure MongoDB is running
   - Check your `MONGO_URI` in `.env`

2. **Port Already in Use:**
   - Change the port in `app.py` or kill the process using port 5000

3. **Import Errors:**
   - Ensure all dependencies are installed: `pip install -r requirements.txt`

### Logs

The application logs errors to the console. Check the terminal output for debugging information.
