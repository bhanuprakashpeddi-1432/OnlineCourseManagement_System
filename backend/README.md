# Online Course Management System - Backend

## Overview
This is the backend service for the Online Course Management System built with Spring Boot, Spring Security, and JWT authentication.

## Features
- User authentication and authorization with JWT
- Role-based access control (Admin, Instructor, Student)
- Course management (CRUD operations)
- Lesson management
- Student enrollment and progress tracking
- RESTful API endpoints
- MySQL database integration
- CORS configuration for frontend integration

## Technologies Used
- Spring Boot 3.2.0
- Spring Security 6
- Spring Data JPA
- JWT (JSON Web Tokens)
- MySQL Database
- Maven
- Java 17

## Prerequisites
- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+

## Setup Instructions

### 1. Database Setup
1. Install MySQL and create a database named `coursemanagement`
2. Update the database credentials in `src/main/resources/application.properties`:
   ```properties
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

### 2. Build and Run
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies and build:
   ```bash
   mvn clean install
   ```

3. Run the application:
   ```bash
   mvn spring-boot:run
   ```

The backend will start on http://localhost:8080

## API Endpoints

### Authentication
- `POST /api/auth/signin` - User login
- `POST /api/auth/signup` - User registration

### Courses
- `GET /api/courses` - Get all active courses
- `GET /api/courses/{id}` - Get course by ID
- `GET /api/courses/my-courses` - Get user's courses (enrolled or taught)
- `GET /api/courses/available` - Get available courses for students
- `POST /api/courses` - Create new course (Instructor/Admin)
- `PUT /api/courses/{id}` - Update course (Instructor/Admin)
- `DELETE /api/courses/{id}` - Delete course (Instructor/Admin)
- `POST /api/courses/{courseId}/enroll` - Enroll in course (Student)
- `POST /api/courses/{courseId}/unenroll` - Unenroll from course (Student)

### Lessons
- `GET /api/lessons/course/{courseId}` - Get lessons for a course
- `GET /api/lessons/{id}` - Get lesson by ID
- `POST /api/lessons/course/{courseId}` - Create lesson (Instructor/Admin)
- `PUT /api/lessons/{id}` - Update lesson (Instructor/Admin)
- `DELETE /api/lessons/{id}` - Delete lesson (Instructor/Admin)
- `POST /api/lessons/{lessonId}/complete` - Mark lesson as completed (Student)

### Admin
- `GET /api/admin/users` - Get all users (Admin)
- `GET /api/admin/users/{role}` - Get users by role (Admin)
- `PUT /api/admin/users/{id}/toggle` - Toggle user status (Admin)

## Test Credentials
The application automatically creates sample data on first run:

- **Admin**: admin@example.com / password123
- **Instructor**: instructor@example.com / password123
- **Student**: student@example.com / password123

## JWT Configuration
- Secret key is configured in `application.properties`
- Token expiration: 24 hours (86400000 ms)
- Tokens should be included in requests as: `Authorization: Bearer <token>`

## CORS Configuration
The backend is configured to accept requests from any origin during development. For production, update the CORS configuration in `WebSecurityConfig.java`.

## Database Schema
The application uses JPA/Hibernate to automatically create the following tables:
- users
- courses
- lessons
- enrollments
- progress
- course_materials

## Development Notes
- The application uses BCrypt for password encoding
- All timestamps are stored in UTC
- Soft deletion is implemented for courses (active flag)
- File upload functionality is prepared but not fully implemented
- API documentation can be added using SpringDoc/Swagger in future versions
