# PlacementTracker Pro

A comprehensive placement tracking platform with traditional email/password authentication.

## Features

- **Traditional Authentication**: Email/password registration and login
- **User Management**: Student, admin, and recruiter roles
- **Application Tracking**: Track job applications and their status
- **Modern UI**: Built with Next.js 14, TypeScript, and Tailwind CSS
- **Secure Backend**: Node.js with Express and MongoDB

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Shadcn/ui Components
- NextAuth.js

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

## Setup Instructions

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- npm or pnpm

### 1. Clone and Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
```

### 2. Environment Setup

#### Frontend (.env.local)
```bash
# Copy the example file
cp env.local.example .env.local

# Edit .env.local with your values
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000
```

#### Backend (.env)
```bash
# Copy the example file
cd backend
cp env.example .env

# Edit .env with your values
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/placement-tracker
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
```

### 3. Database Setup

Make sure MongoDB is running locally or update the `MONGODB_URI` in your backend `.env` file to point to your MongoDB instance.

### 4. Start the Application

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

#### Terminal 2 - Frontend
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Authentication Flow

### Registration
1. User visits `/register`
2. Fills in name, email, and password
3. Frontend validates input
4. Backend creates user with hashed password
5. User is redirected to login

### Login
1. User visits `/login`
2. Enters email and password
3. NextAuth.js validates credentials with backend
4. User is authenticated and redirected to dashboard

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/profile` - Update user profile (protected)
- `PUT /api/auth/password` - Change password (protected)

### Applications
- `GET /api/applications` - Get user's applications (protected)
- `POST /api/applications` - Create new application (protected)
- `PUT /api/applications/:id` - Update application (protected)
- `DELETE /api/applications/:id` - Delete application (protected)

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   │   ├── login/         # Login page
│   │   └── register/      # Registration page
│   ├── api/               # API routes
│   │   └── auth/          # Authentication API
│   └── dashboard/         # Dashboard pages
├── backend/               # Express.js backend
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Custom middleware
│   │   └── utils/         # Utility functions
│   └── package.json
├── components/            # Reusable components
└── lib/                  # Utility libraries
```

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Input validation and sanitization
- Rate limiting
- CORS protection
- Helmet.js security headers

## Development

### Adding New Features
1. Create backend API endpoints in `backend/src/routes/`
2. Create frontend pages in `app/`
3. Add components in `components/`
4. Update types and interfaces as needed

### Database Changes
1. Update Mongoose models in `backend/src/models/`
2. Run database migrations if needed
3. Update API endpoints to handle new data

## Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Railway/Render)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy with Node.js buildpack

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details 