Project Type:
Personal Placement Management Platform (Job Application Tracker)

Tech Stack:
Frontend: Next.js (React framework), TypeScript, Tailwind CSS
Backend: Flask (Python microframework), MongoDB (NoSQL database), Flask-JWT-Extended (JWT authentication), Flask-CORS, python-dotenv, bcrypt
AI (Future): Groq API (not implemented in the provided code)

Architecture:
The application follows a typical client-server architecture with a Next.js frontend and a Flask backend. The backend exposes REST APIs for user authentication and data management. The frontend consumes these APIs to provide a user interface. The architecture includes separation of concerns between the frontend and backend, allowing for independent development and scaling.

Key Features:
1. User Authentication (Registration, Login)
2. Job Application Tracking (basic CRUD operations)
3. Dashboard (simple overview of application data)
4. Settings (user profile management)

Complexity Level:
Medium

MVP Guidance:

The goal is to create a functional, albeit simplified, version of PlaceMint focusing on the core job application tracking functionality and user authentication.

Phase 1: Backend (Flask API)

1.  User Authentication:
    *   Implement user registration and login endpoints using Flask-JWT-Extended for authentication.
    *   Use MongoDB for storing user credentials (email, password hash, name).
    *   Implement password hashing using bcrypt.
    *   API endpoints: `/register` (POST), `/login` (POST).
    *   Code Directive: "Implement Flask API endpoints for user registration and login, storing user data in MongoDB and using bcrypt for password hashing. Generate JWT tokens upon successful login."

2.  Job Application Tracking:
    *   Create a MongoDB collection for storing job applications.
    *   Implement CRUD (Create, Read, Update, Delete) API endpoints for managing job applications.
    *   Each application should have fields like: company name, job title, application date, status (e.g., Applied, Interviewing, Offer, Rejected).
    *   API endpoints: `/applications` (GET, POST), `/applications/<id>` (GET, PUT, DELETE).
    *   Code Directive: "Implement Flask API endpoints for CRUD operations on job applications, storing data in MongoDB. Ensure that only authenticated users can access these endpoints using JWT authentication."

3.  Database Setup:
    *   Ensure the backend can connect to MongoDB, either locally or via MongoDB Atlas.
    *   Implement error handling for database connection failures.
    *   Code Directive: "Configure the Flask app to connect to MongoDB, handling potential connection errors gracefully. Use environment variables for database credentials."

Phase 2: Frontend (Next.js)

1.  User Authentication:
    *   Create login and registration pages using Next.js.
    *   Implement form handling to send requests to the backend authentication API endpoints.
    *   Store the JWT token in local storage or cookies after successful login.
    *   Implement a protected route component to restrict access to authenticated users only.
    *   Code Directive: "Create Next.js pages for login and registration, handling form submissions and storing the JWT token upon successful authentication. Implement a protected route component to restrict access to authenticated pages."

2.  Job Application List:
    *   Create a page to display a list of job applications fetched from the backend API.
    *   Implement basic UI for displaying application details (company name, job title, status).
    *   Code Directive: "Create a Next.js page to display a list of job applications fetched from the backend API. Use a simple table or card layout to display application details."

3.  Add/Edit Application Form:
    *   Create a form to add new job applications or edit existing ones.
    *   Implement form handling to send requests to the backend application API endpoints.
    *   Code Directive: "Create a Next.js form to add new job applications or edit existing ones. Handle form submissions and send requests to the backend application API endpoints."

Phase 3: Deployment

1.  Deploy the backend to a platform like Heroku or Render.
2.  Deploy the frontend to a platform like Vercel or Netlify.
3.  Configure environment variables for both frontend and backend.

Implementation Notes:

*   Prioritize functionality over aesthetics. Use basic HTML and CSS for the initial UI.
*   Focus on error handling and user feedback (e.g., display error messages, success notifications).
*   Implement basic validation on both frontend and backend to prevent invalid data.
*   Avoid complex features like AI integration or advanced analytics for the MVP.
*   Use environment variables for sensitive information like API keys and database credentials.
*   The provided code includes a lot of UI components. For the MVP, focus on using only the essential components like Button, Input, Form, and Table.

Directive for AI Coding Assistant: "Follow the MVP Guidance steps. Prioritize backend implementation first, then frontend. Focus on core functionality and error handling. Use environment variables for sensitive information. Keep the UI simple and functional."
