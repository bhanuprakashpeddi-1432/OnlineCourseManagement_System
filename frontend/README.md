# Online Course Management System - Frontend

## Overview
This is the frontend application for the Online Course Management System built with React. It provides a user-friendly interface for students, instructors, and administrators to interact with the course management platform.

## Features
- **User Authentication**: Login and registration with JWT-based authentication
- **Role-based Navigation**: Different interfaces for Admin, Instructor, and Student roles
- **Course Management**: Browse, create, edit, and delete courses
- **Lesson Management**: View lessons, create and edit lesson content
- **Student Enrollment**: Enroll/unenroll in courses and track progress
- **Admin Dashboard**: Manage users and monitor platform activity
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Technologies Used
- React 18.2.0
- React Router DOM 6.8.0
- React Bootstrap 2.9.0
- Bootstrap 5.3.0
- Axios 1.6.0
- JavaScript (ES6+)

## Prerequisites
- Node.js 16+ and npm

## Setup Instructions

### 1. Install Dependencies
Navigate to the frontend directory and install dependencies:
```bash
cd frontend
npm install
```

### 2. Configure Backend Connection
The frontend is configured to proxy API requests to `http://localhost:8080` (backend). Make sure the backend is running on port 8080.

If you need to change the backend URL, update the `proxy` field in `package.json` or modify the API base URL in `src/services/api.js`.

### 3. Start Development Server
```bash
npm start
```

The application will start on http://localhost:3000

### 4. Build for Production
```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Project Structure
```
src/
├── components/           # Reusable UI components
│   ├── Navigation.js     # Main navigation bar
│   └── ProtectedRoute.js # Route protection component
├── contexts/             # React contexts
│   └── AuthContext.js    # Authentication context
├── pages/                # Page components
│   ├── Home.js           # Landing page
│   ├── Login.js          # Login page
│   ├── Register.js       # Registration page
│   ├── Dashboard.js      # User dashboard
│   ├── Courses.js        # Course listing
│   ├── CourseDetail.js   # Course details
│   ├── LessonDetail.js   # Lesson details
│   ├── CreateCourse.js   # Course creation
│   ├── EditCourse.js     # Course editing
│   ├── CreateLesson.js   # Lesson creation
│   ├── EditLesson.js     # Lesson editing
│   └── AdminDashboard.js # Admin panel
├── services/             # API services
│   └── api.js            # Axios configuration and API calls
├── App.js                # Main app component with routing
├── index.js              # React entry point
└── index.css             # Global styles
```

## Available Routes

### Public Routes
- `/` - Home page
- `/login` - User login
- `/register` - User registration
- `/courses` - Browse all courses

### Protected Routes (Authenticated users)
- `/dashboard` - User dashboard
- `/course/:id` - Course details
- `/lesson/:id` - Lesson details

### Instructor/Admin Routes
- `/create-course` - Create new course
- `/edit-course/:id` - Edit course
- `/course/:courseId/create-lesson` - Create lesson
- `/edit-lesson/:id` - Edit lesson

### Admin Only Routes
- `/admin` - Admin dashboard

## Key Features by Role

### Student
- Browse and search available courses
- Enroll/unenroll in courses
- View course content and lessons
- Track learning progress
- Mark lessons as completed

### Instructor
- Create and manage courses
- Add/edit/delete lessons
- View enrolled students
- Upload course materials

### Admin
- Access admin dashboard
- Manage all users (view, enable/disable)
- View platform statistics
- Manage all courses and content

## API Integration
The frontend communicates with the backend through REST APIs:
- Authentication endpoints (`/api/auth/*`)
- Course management (`/api/courses/*`)
- Lesson management (`/api/lessons/*`)
- Admin functions (`/api/admin/*`)

## Authentication Flow
1. User logs in with email/password
2. Backend returns JWT token and user data
3. Token is stored in localStorage
4. Token is automatically included in subsequent API requests
5. Protected routes check for valid authentication
6. Role-based access control restricts certain features

## Test Credentials
The application works with the sample data created by the backend:
- **Admin**: admin@example.com / password123
- **Instructor**: instructor@example.com / password123
- **Student**: student@example.com / password123

## Development Notes
- The app uses React functional components with hooks
- State management is handled through React Context (AuthContext)
- Bootstrap is used for responsive UI components
- Axios interceptors handle authentication headers automatically
- Error handling is implemented for API failures
- Loading states provide user feedback during API calls

## Build and Deployment
For production deployment:
1. Update API base URL in `src/services/api.js` if needed
2. Run `npm run build` to create production build
3. Deploy the `build` folder to your web server
4. Configure your web server to serve the React app for all routes (for client-side routing)

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
