# Quick Setup Guide

## MongoDB Connection Issue Fix

The error shows that your backend can't connect to MongoDB Atlas because your IP isn't whitelisted. Here's how to fix it:

### Option 1: Use Local MongoDB (Recommended for Development)

1. **Install MongoDB locally:**
   - Download MongoDB Community Server from https://www.mongodb.com/try/download/community
   - Or use Docker: `docker run -d -p 27017:27017 --name mongodb mongo:latest`

2. **Update your backend `.env` file:**
   ```bash
   cd backend
   cp env.example .env
   ```

3. **Edit `.env` file:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/placement-tracker
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   PORT=5000
   NODE_ENV=development
   ```

### Option 2: Use MongoDB Atlas (For Production)

1. **Go to MongoDB Atlas:**
   - Visit https://cloud.mongodb.com
   - Create a free cluster

2. **Whitelist your IP:**
   - In Atlas dashboard, go to Network Access
   - Click "Add IP Address"
   - Add your current IP or use "0.0.0.0/0" for all IPs (less secure)

3. **Get your connection string:**
   - Go to Database Access
   - Create a database user
   - Click "Connect" on your cluster
   - Copy the connection string

4. **Update your `.env` file:**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/placement-tracker
   ```

### Option 3: Use MongoDB Compass (GUI)

1. **Download MongoDB Compass:**
   - https://www.mongodb.com/try/download/compass

2. **Connect to local MongoDB:**
   - Use connection string: `mongodb://localhost:27017`

## Quick Test

After setting up MongoDB:

1. **Start the backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **You should see:**
   ```
   Server running in development mode on port 5000
   MongoDB Connected: localhost
   ```

3. **Test registration:**
   - Go to http://localhost:3000/register
   - Try creating a new account

## Troubleshooting

### If you still get connection errors:

1. **Check if MongoDB is running:**
   ```bash
   # On Windows
   net start MongoDB
   
   # On Mac/Linux
   sudo systemctl start mongod
   ```

2. **Check MongoDB port:**
   ```bash
   # Should show MongoDB listening on 27017
   netstat -an | grep 27017
   ```

3. **Test connection manually:**
   ```bash
   # Install MongoDB shell
   mongosh mongodb://localhost:27017
   ```

### For Docker users:

```bash
# Start MongoDB with Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Check if it's running
docker ps

# View logs
docker logs mongodb
```

## Environment Variables Summary

**Frontend (.env.local):**
```env
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Backend (.env):**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/placement-tracker
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
``` 