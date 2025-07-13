# Online Course Management System

A comprehensive full-stack web application for managing online courses, built with Spring Boot backend and React frontend.

## 🚀 Features

### Core Functionality
- **User Management**: Registration and authentication with JWT tokens
- **Role-based Access Control**: Three user roles (Admin, Instructor, Student)
- **Course Management**: Create, edit, delete, and browse courses
- **Lesson Management**: Add multimedia lessons with video content
- **Enrollment System**: Students can enroll/unenroll in courses
- **Progress Tracking**: Track lesson completion and learning progress
- **Admin Dashboard**: Comprehensive user and platform management

### Technical Features
- **RESTful API**: Well-structured backend APIs
- **JWT Authentication**: Secure token-based authentication
- **CORS Support**: Configured for frontend-backend communication
- **Responsive Design**: Mobile-friendly user interface
- **Error Handling**: Comprehensive error handling and validation
- **Database Integration**: MySQL with JPA/Hibernate

## 🛠️ Technology Stack

### Backend
- **Framework**: Spring Boot 3.2.0
- **Security**: Spring Security 6 with JWT
- **Database**: MySQL 8.0+ with JPA/Hibernate
- **Build Tool**: Maven
- **Java Version**: 17+

### Frontend
- **Framework**: React 18.2.0
- **Routing**: React Router DOM 6.8.0
- **UI Library**: React Bootstrap 2.9.0 + Bootstrap 5.3.0
- **HTTP Client**: Axios 1.6.0
- **Build Tool**: Create React App

## 📋 Prerequisites

Before running this application, make sure you have the following installed:
- **Java 17** or higher
- **Node.js 16+** and npm
- **MySQL 8.0+**
- **Maven 3.6+**

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/OnlineCourseManagement.git
cd OnlineCourseManagement
```

### 2. Database Setup
1. Install MySQL and start the MySQL service
2. Create a database named `coursemanagement`:
```sql
CREATE DATABASE coursemanagement;
```
3. Update database credentials in `backend/src/main/resources/application.properties`:
```properties
spring.datasource.username=your_mysql_username
spring.datasource.password=your_mysql_password
```

### 3. Backend Setup
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
The backend will start on **http://localhost:8080**

### 4. Frontend Setup
Open a new terminal and run:
```bash
cd frontend
npm install
npm start
```
The frontend will start on **http://localhost:3000**

## 🔑 Test Credentials

The application automatically creates sample data on first run:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@example.com | password123 |
| **Instructor** | instructor@example.com | password123 |
| **Student** | student@example.com | password123 |

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/signin` - User login
- `POST /api/auth/signup` - User registration

### Course Management
- `GET /api/courses` - Get all courses
- `POST /api/courses` - Create course (Instructor/Admin)
- `PUT /api/courses/{id}` - Update course (Instructor/Admin)
- `DELETE /api/courses/{id}` - Delete course (Instructor/Admin)
- `POST /api/courses/{id}/enroll` - Enroll in course (Student)
- `POST /api/courses/{id}/unenroll` - Unenroll from course (Student)

### Lesson Management
- `GET /api/lessons/course/{courseId}` - Get course lessons
- `POST /api/lessons/course/{courseId}` - Create lesson (Instructor/Admin)
- `PUT /api/lessons/{id}` - Update lesson (Instructor/Admin)
- `DELETE /api/lessons/{id}` - Delete lesson (Instructor/Admin)
- `POST /api/lessons/{id}/complete` - Mark lesson complete (Student)

### Admin Endpoints
- `GET /api/admin/users` - Get all users (Admin)
- `PUT /api/admin/users/{id}/toggle` - Toggle user status (Admin)

## 🎯 User Workflows

### For Students
1. Register as a student or login
2. Browse available courses
3. Enroll in courses of interest
4. Access course content and lessons
5. Track learning progress
6. Mark lessons as completed

### For Instructors
1. Register as an instructor or login
2. Create new courses with descriptions
3. Add lessons with content and videos
4. Manage course materials
5. View enrolled students

### For Admins
1. Login with admin credentials
2. Access admin dashboard
3. Manage all users (view, enable/disable)
4. Monitor platform statistics
5. Oversee all courses and content

## 🏗️ Project Structure

```
OnlineCourseManagement/
├── backend/                    # Spring Boot application
│   ├── src/main/java/com/coursemanagement/
│   │   ├── config/            # Configuration classes
│   │   ├── controller/        # REST controllers
│   │   ├── dto/              # Data Transfer Objects
│   │   ├── entity/           # JPA entities
│   │   ├── exception/        # Exception handlers
│   │   ├── repository/       # Data repositories
│   │   ├── security/         # Security configuration
│   │   └── service/          # Business logic services
│   ├── src/main/resources/   # Application properties
│   └── pom.xml              # Maven dependencies
│
├── frontend/                  # React application
│   ├── public/               # Static files
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── contexts/         # React contexts
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   └── App.js           # Main app component
│   └── package.json         # NPM dependencies
│
└── README.md                 # This file
```

## 🔧 Configuration

### Backend Configuration
Key configuration files:
- `application.properties` - Database and JWT settings
- `WebSecurityConfig.java` - Security and CORS configuration
- `DataInitializer.java` - Sample data creation

### Frontend Configuration
- `package.json` - Proxy configuration for backend API
- `AuthContext.js` - Authentication state management
- `api.js` - Axios configuration and API endpoints

## 🚀 Deployment

### Backend Deployment
1. Update `application.properties` for production database
2. Build the application: `mvn clean package`
3. Run the JAR file: `java -jar target/online-course-management-0.0.1-SNAPSHOT.jar`

### Frontend Deployment
1. Update API base URL in `src/services/api.js`
2. Build the application: `npm run build`
3. Deploy the `build` folder to your web server

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support or questions, please open an issue on GitHub or contact the development team.

---

**Happy Learning! 🎓**
