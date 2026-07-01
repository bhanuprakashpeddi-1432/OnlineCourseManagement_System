# Online Course Management System

A comprehensive full-stack web application for managing online courses, built with Spring Boot backend and React frontend. This system provides a complete learning management solution with role-based access control, course creation, lesson management, and progress tracking.

## 🚀 Features

### Core Functionality
- **User Management**: Registration and authentication with JWT tokens
- **Role-based Access Control**: Three user roles (Admin, Instructor, Student)
- **Course Management**: Create, edit, delete, and browse courses with detailed information
- **Lesson Management**: Complete CRUD operations for lessons with multimedia support
- **Enrollment System**: Students can enroll/unenroll in courses with real-time updates
- **Progress Tracking**: Track lesson completion and learning progress with detailed analytics
- **Admin Dashboard**: Comprehensive user and platform management with statistics

### Advanced Features
- **DTO Pattern Implementation**: Prevents Hibernate lazy loading issues with proper data serialization
- **Real-time UI Updates**: Dynamic content updates without page refresh
- **Course Material Management**: Upload and manage course resources
- **Lesson Completion Tracking**: Mark lessons as complete with progress persistence
- **User Profile Management**: Comprehensive user account management
- **Search and Filter**: Advanced course and lesson filtering capabilities

### Technical Features
- **RESTful API**: Well-structured backend APIs with proper HTTP status codes
- **JWT Authentication**: Secure token-based authentication with refresh mechanism
- **CORS Support**: Configured for frontend-backend communication
- **Responsive Design**: Mobile-first responsive UI with Bootstrap integration
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Database Integration**: MySQL with JPA/Hibernate and optimized queries
- **Input Validation**: Frontend and backend validation with real-time feedback
- **Security**: Protected routes with role-based access control

## 🛠️ Technology Stack

### Backend
- **Framework**: Spring Boot 3.3.0
- **Security**: Spring Security 6 with JWT
- **Database**: MySQL 8.0+ with JPA/Hibernate
- **Build Tool**: Maven 3.6+
- **Java Version**: 17+
- **Architecture**: RESTful API with DTO pattern
- **ORM**: Hibernate with lazy loading optimization

### Frontend
- **Framework**: React 18.2.0
- **Routing**: React Router DOM 6.8.0
- **UI Library**: React Bootstrap 2.9.0 + Bootstrap 5.3.0
- **HTTP Client**: Axios 1.6.0
- **Build Tool**: Create React App
- **State Management**: React Context API with Hooks
- **Styling**: CSS3 with Bootstrap responsive design

## 📋 Prerequisites

Before running this application, make sure you have the following installed:
- **Java 17** or higher
- **Node.js 16+** and npm
- **MySQL 8.0+**
- **Maven 3.6+**

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/bhanuprakashpeddi-1432/OnlineCourseManagement_System.git
cd OnlineCourseManagement_System
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
- `GET /api/lessons/{id}` - Get specific lesson details
- `POST /api/lessons/course/{courseId}` - Create lesson (Instructor/Admin)
- `PUT /api/lessons/{id}` - Update lesson (Instructor/Admin)
- `DELETE /api/lessons/{id}` - Delete lesson (Instructor/Admin)
- `POST /api/lessons/{id}/complete` - Mark lesson complete (Student)

### Progress Tracking
- `GET /api/progress/course/{courseId}` - Get course progress (Student)
- `POST /api/progress/lesson/{lessonId}/complete` - Complete lesson (Student)
- `GET /api/progress/student/{studentId}` - Get student progress (Admin/Instructor)

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
OnlineCourseManagement_System/
├── backend/                    # Spring Boot application
│   ├── src/main/java/com/coursemanagement/
│   │   ├── config/            # Configuration classes
│   │   │   ├── DataInitializer.java    # Sample data setup
│   │   │   └── WebSecurityConfig.java  # Security configuration
│   │   ├── controller/        # REST controllers
│   │   │   ├── AdminController.java    # Admin management
│   │   │   ├── AuthController.java     # Authentication
│   │   │   ├── CourseController.java   # Course operations
│   │   │   └── LessonController.java   # Lesson management
│   │   ├── dto/              # Data Transfer Objects
│   │   │   ├── CourseResponse.java     # Course DTOs
│   │   │   ├── LessonResponse.java     # Lesson DTOs
│   │   │   └── JwtResponse.java        # Auth DTOs
│   │   ├── entity/           # JPA entities
│   │   │   ├── User.java              # User entity
│   │   │   ├── Course.java            # Course entity
│   │   │   ├── Lesson.java            # Lesson entity
│   │   │   ├── Enrollment.java        # Enrollment entity
│   │   │   └── Progress.java          # Progress tracking
│   │   ├── exception/        # Exception handlers
│   │   │   └── GlobalExceptionHandler.java
│   │   ├── repository/       # Data repositories
│   │   ├── security/         # Security configuration
│   │   │   ├── AuthEntryPointJwt.java
│   │   │   ├── AuthTokenFilter.java
│   │   │   └── JwtUtils.java
│   │   └── service/          # Business logic services
│   ├── src/main/resources/   # Application properties
│   │   └── application.properties
│   └── pom.xml              # Maven dependencies
│
├── frontend/                  # React application
│   ├── public/               # Static files
│   │   └── index.html        # Main HTML template
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   ├── Navigation.js         # Navigation bar
│   │   │   └── ProtectedRoute.js     # Route protection
│   │   ├── contexts/         # React contexts
│   │   │   └── AuthContext.js        # Authentication state
│   │   ├── pages/           # Page components
│   │   │   ├── Dashboard.js          # Main dashboard
│   │   │   ├── Courses.js            # Course listing
│   │   │   ├── CourseDetail.js       # Course details
│   │   │   ├── CreateCourse.js       # Course creation
│   │   │   ├── CreateLesson.js       # Lesson creation
│   │   │   ├── LessonDetail.js       # Lesson details
│   │   │   ├── AdminDashboard.js     # Admin panel
│   │   │   ├── Login.js              # Login page
│   │   │   └── Register.js           # Registration
│   │   ├── services/        # API services
│   │   │   └── api.js               # Axios configuration
│   │   ├── App.js           # Main app component
│   │   ├── index.js         # React entry point
│   │   └── index.css        # Global styles
│   └── package.json         # NPM dependencies
│
└── README.md                 # This documentation
```

## 🔧 Configuration

### Backend Configuration
Key configuration files:
- `application.properties` - Database and JWT settings
- `WebSecurityConfig.java` - Security and CORS configuration
- `DataInitializer.java` - Sample data creation
- `GlobalExceptionHandler.java` - Centralized error handling

### Frontend Configuration
- `package.json` - Proxy configuration for backend API
- `AuthContext.js` - Authentication state management
- `api.js` - Axios configuration and API endpoints
- `ProtectedRoute.js` - Route-level security

### Environment Variables
You can configure the following environment variables for production:

#### Backend
```properties
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=coursemanagement
DB_USERNAME=your_username
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=86400
```

#### Frontend
```env
REACT_APP_API_BASE_URL=http://localhost:8080/api
REACT_APP_FRONTEND_URL=http://localhost:3000
```

## 🚀 Deployment

### Backend Deployment

#### Local Production Build
1. Update `application.properties` for production database:
```properties
spring.datasource.url=jdbc:mysql://your-production-db:3306/coursemanagement
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.jpa.hibernate.ddl-auto=validate
```

2. Build the application:
```bash
cd backend
mvn clean package -DskipTests
```

3. Run the JAR file:
```bash
java -jar target/online-course-management-0.0.1-SNAPSHOT.jar
```

#### Docker Deployment
```dockerfile
# Create Dockerfile in backend directory
FROM openjdk:17-jdk-slim
COPY target/online-course-management-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app.jar"]
```

### Frontend Deployment

#### Build for Production
1. Update API base URL in `src/services/api.js`:
```javascript
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://your-backend-domain.com/api';
```

2. Build the application:
```bash
cd frontend
npm run build
```

3. Deploy the `build` folder to your web server (nginx, Apache, or hosting service)

#### Nginx Configuration Example
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        root /path/to/your/build;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://your-backend-server:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🔍 Troubleshooting

### Common Issues and Solutions

#### Backend Issues

**1. Database Connection Error**
```
Error: java.sql.SQLException: Access denied for user
```
**Solution:** Check MySQL credentials in `application.properties` and ensure MySQL service is running.

**2. Port Already in Use**
```
Error: Web server failed to start. Port 8080 was already in use.
```
**Solution:** Kill the process using port 8080 or change the port in `application.properties`:
```properties
server.port=8081
```

**3. JWT Token Issues**
```
Error: JWT signature does not match locally computed signature
```
**Solution:** Ensure consistent JWT secret across all instances and check token expiration.

#### Frontend Issues

**1. CORS Error**
```
Error: Access to XMLHttpRequest blocked by CORS policy
```
**Solution:** Verify CORS configuration in `WebSecurityConfig.java` and check proxy settings in `package.json`.

**2. Build Failures**
```
Error: npm ERR! code ELIFECYCLE
```
**Solution:** 
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version compatibility

**3. API Connection Issues**
```
Error: Network Error / Request failed with status code 500
```
**Solution:** 
- Ensure backend is running on correct port
- Check API base URL in `api.js`
- Verify network connectivity between frontend and backend

#### Development Issues

**1. Hot Reload Not Working**
**Solution:** Check if `FAST_REFRESH=true` is set in your environment or restart the development server.

**2. Database Schema Issues**
**Solution:** Reset database with:
```sql
DROP DATABASE coursemanagement;
CREATE DATABASE coursemanagement;
```
Then restart the backend to auto-create tables.

### Performance Optimization

1. **Backend Optimization:**
   - Enable database connection pooling
   - Implement caching for frequently accessed data
   - Use pagination for large data sets

2. **Frontend Optimization:**
   - Implement lazy loading for components
   - Use React.memo for expensive components
   - Optimize bundle size with code splitting

## 🤝 Contributing

We welcome contributions to the Online Course Management System! Please follow these guidelines:

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Set up your development environment as described in the Quick Start section
4. Make your changes following the coding standards below

### Coding Standards

#### Backend (Java/Spring Boot)
- Follow Java naming conventions (camelCase for variables, PascalCase for classes)
- Use proper annotations (@Service, @Repository, @Controller)
- Implement proper error handling with custom exceptions
- Write comprehensive JavaDoc comments
- Use DTOs for API responses to prevent lazy loading issues
- Follow RESTful API design principles

#### Frontend (React)
- Use functional components with hooks
- Implement proper error boundaries
- Follow React naming conventions (PascalCase for components)
- Use PropTypes or TypeScript for type checking
- Implement responsive design with Bootstrap
- Use semantic HTML elements

### Pull Request Process
1. Ensure your code follows the established patterns
2. Add tests for new functionality
3. Update documentation if needed
4. Commit your changes: `git commit -am 'Add feature: description'`
5. Push to the branch: `git push origin feature/your-feature-name`
6. Submit a pull request with a clear description of changes

### Reporting Issues
When reporting bugs, please include:
- Browser and version (for frontend issues)
- Java version and OS (for backend issues)
- Steps to reproduce the issue
- Expected vs actual behavior
- Console logs or error messages

## 🧪 Testing

### Running Tests

#### Backend Tests
```bash
cd backend
mvn test
```

#### Frontend Tests
```bash
cd frontend
npm test
```

### Test Coverage
- Backend: JUnit 5 for unit and integration tests
- Frontend: Jest and React Testing Library
- API Testing: Can be done with Postman or similar tools

## 🛡️ Security Considerations

- **Authentication**: JWT-based authentication with secure token storage
- **Authorization**: Role-based access control (RBAC)
- **Input Validation**: Both frontend and backend validation
- **SQL Injection Prevention**: JPA/Hibernate with parameterized queries
- **XSS Prevention**: React's built-in XSS protection
- **CORS**: Properly configured for production use

## 📊 Features in Development

### Planned Features
- [ ] Email notifications for course enrollment
- [ ] Video streaming integration
- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] Course certificates generation
- [ ] Payment integration for premium courses
- [ ] Discussion forums for courses
- [ ] Live streaming capabilities

### Recent Updates
- ✅ DTO pattern implementation for better performance
- ✅ Enhanced lesson management with full CRUD operations
- ✅ Improved error handling and user feedback
- ✅ Responsive design improvements
- ✅ Advanced course filtering and search

## 📈 Performance Metrics

### Backend Performance
- Average API response time: < 200ms
- Database query optimization with JPA
- Connection pooling for better resource management

### Frontend Performance
- First contentful paint: < 2s
- React component optimization with memo and useCallback
- Bundle size optimization with code splitting

## 📱 Browser Support

### Supported Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Mobile Support
- iOS Safari 14+
- Chrome Mobile 90+
- Samsung Internet 14+

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support or questions, please open an issue on GitHub or contact the development team.

---

**Happy Learning! 🎓**
