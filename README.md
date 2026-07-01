# LearnHub - Online Course Management System

A premium, production-grade Online Course Management System built using a **Spring Boot** backend and a **React (Vite/SPA)** frontend. The application features a state-of-the-art dark mode design system, comprehensive security controls, constructor-based dependency injection, and performance-optimized database queries to eliminate common architectural bottlenecks (such as the JPA N+1 query problem).

---

## Key Features & Enhancements

### 🔒 Security Hardening
- **Externalized Secrets**: All database URLs, credentials, server ports, and JWT signature keys are externalized into environment variables via `application.properties` with safe fallback defaults.
- **Strict CORS Policy**: Replaced wildcard configurations with an environment-configurable origin checklist (`http://localhost:3000` by default).
- **Declarative Access Control**: Uses Spring Security's `@PreAuthorize` annotations on resource controllers to secure operations at the method level.

### ⚡ Performance Optimization
- **Eager Fetching (N+1 Query Fix)**: Employs JPQL `JOIN FETCH` queries in `CourseRepository` to eagerly load instructors and related entities, reducing multiple sequential database hits into single, optimized queries.
- **Connection Pooling**: Configured HikariCP connection pool settings to scale under load.

### 🏗️ Clean Architecture
- **Constructor Injection**: Eliminated `@Autowired` field injection in all Spring component controllers and services in favor of constructor injection, facilitating clean unit testing.
- **Decoupled Controller Layer**: Introduced `UserService` to manage user lifecycle modifications, removing direct dependencies on raw repositories from the web layer.
- **Global Error Modeling**: Standardized API exceptions with detailed error structures (including status, timestamp, and field-level validation maps) using `@RestControllerAdvice`.

### 🎨 Premium UI/UX Design System
- **Dark Mode First**: Tailored modern color palette utilizing deep slate/navy backgrounds and vivid violet/cyan gradients.
- **Glassmorphism Theme**: Translucent overlays, card components, and navbars featuring `backdrop-filter: blur(16px)` and subtle glowing borders.
- **Fluid Micro-Animations**: Smooth transitions for hover-lifts, status change animations, and page entries (`fadeInUp`, `scaleIn`).
- **SPA Routing Fix**: Resolved hard browser page reloads during token expiry (401 errors) by dispatching custom DOM events handled via React Router's SPA navigation hook (`useNavigate`).

---

## Tech Stack

- **Backend**: Java 17+, Spring Boot 3.3+, Spring Security, Spring Data JPA, Hibernate, MySQL, JWT Authentication.
- **Frontend**: React 18+, React Router 6, Axios, Custom CSS Variables, Google Fonts (Inter).

---

## Directory Structure

```
OnlineCourseManagement_System/
├── backend/                       # Spring Boot Application
│   ├── src/main/java/             # Source code
│   └── src/main/resources/        # Configurations (application.properties)
├── frontend/                      # React Application
│   ├── public/                    # Static Assets
│   └── src/                       # Component/Page Sources
│       ├── components/            # Layout elements (Navbar, ProtectedRoute)
│       ├── contexts/              # Global state providers (AuthContext)
│       ├── pages/                 # Routing views (Dashboard, Courses, Login)
│       └── services/              # API interfaces (api.js)
```

---

## Setup & Running Locally

### Prerequisites
- **Java JDK 17** or higher
- **Node.js** (v18+) & **npm**
- **MySQL Database Server**

### 1. Database Setup
Create a MySQL database named `coursemanagement`:
```sql
CREATE DATABASE coursemanagement;
```

### 2. Run Backend
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Configure your environment variables (optional) or modify the defaults in `src/main/resources/application.properties`.
3. Run the Spring Boot application using the Maven wrapper:
   ```bash
   ./mvnw spring-boot:run
   ```
   *The backend server will spin up on `http://localhost:8080`.*

### 3. Run Frontend
1. Navigate to the frontend folder:
   ```bash
   cd ../frontend
   ```
2. Install the node modules:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
   *The frontend application will start on `http://localhost:3000`.*

---

## Default Roles & Credentials

To test the role-based dashboard redirection, you can register new accounts using the premium **Register Card Selector** (Student, Instructor, or Admin) or seed your database accordingly.
