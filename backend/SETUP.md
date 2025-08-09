# Backend Setup Guide

## Quick Setup

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Create `.env` file in the backend directory:**
   ```env
   SECRET_KEY=your-super-secret-key-change-this-in-production
   JWT_SECRET_KEY=your-jwt-secret-key-change-this-in-production
   
   # For local MongoDB:
   MONGO_URI=mongodb://localhost:27017/
   
   # For MongoDB Atlas (replace with your connection string):
   # MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
   ```

3. **Run the backend:**
   ```bash
   python app.py
   ```

## MongoDB Options

### Option 1: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use: `MONGO_URI=mongodb://localhost:27017/`

### Option 2: MongoDB Atlas (Cloud)
1. Create free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a cluster
3. Get your connection string
4. Use: `MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority`

### Option 3: No MongoDB (Development)
- If MongoDB connection fails, the app will automatically use in-memory storage
- Data will be lost on restart, but you can test the API

## Testing the API

Once running, test with:

```bash
# Health check
curl http://localhost:5000/api/health

# Register a user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Default Admin User

If no users exist, a default admin is created:
- Email: `admin@example.com`
- Password: `admin123`
