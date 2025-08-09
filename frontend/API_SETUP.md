# Frontend API Setup Guide

## Environment Configuration

Create a `.env.local` file in the frontend directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## API Structure

The frontend is now configured to use axios with the following structure:

### Base Configuration
- **Base URL**: `http://localhost:5000/api`
- **Timeout**: 10 seconds
- **Headers**: `Content-Type: application/json`

### Authentication Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user
- `POST /auth/logout` - User logout

### Features
- **Automatic Token Management**: JWT tokens are automatically added to requests
- **Error Handling**: Centralized error handling with user-friendly messages
- **401 Redirect**: Automatic redirect to login on unauthorized access
- **Request/Response Interceptors**: For consistent API handling

## Testing the Connection

1. **Start the backend:**
   ```bash
   cd backend
   python app.py
   ```

2. **Start the frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Test the API connection:**
   - Visit: `http://localhost:3000/test-api`
   - This page will test all API endpoints

## Usage Examples

### Login
```typescript
import { authAPI } from '@/lib/api'

const response = await authAPI.login({
  email: 'admin@example.com',
  password: 'admin123'
})
```

### Register
```typescript
import { authAPI } from '@/lib/api'

const response = await authAPI.register({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123'
})
```

### Error Handling
```typescript
import { handleApiError } from '@/lib/api'

try {
  const response = await authAPI.login(data)
} catch (error) {
  const errorMessage = handleApiError(error)
  // Show error message to user
}
```

## Default Test Credentials

- **Email**: `admin@example.com`
- **Password**: `admin123`

## Troubleshooting

### CORS Issues
If you get CORS errors, ensure your backend has CORS configured for `http://localhost:3000`

### Connection Refused
- Make sure the backend is running on port 5000
- Check if the backend URL is correct in `.env.local`

### 401 Errors
- Check if the JWT token is valid
- Ensure the backend JWT secret matches

### 500 Errors
- Check the backend console for error logs
- Verify the API endpoints match between frontend and backend
