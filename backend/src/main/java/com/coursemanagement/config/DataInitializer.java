package com.coursemanagement.config;

import com.coursemanagement.entity.Course;
import com.coursemanagement.entity.Lesson;
import com.coursemanagement.entity.User;
import com.coursemanagement.repository.CourseRepository;
import com.coursemanagement.repository.LessonRepository;
import com.coursemanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Check if data already exists
        if (userRepository.count() > 0) {
            return;
        }

        // Create Admin User
        User admin = new User(
                "John",
                "Admin",
                "admin@example.com",
                passwordEncoder.encode("password123"),
                User.Role.ADMIN
        );
        userRepository.save(admin);

        // Create Instructor User
        User instructor = new User(
                "Jane",
                "Smith",
                "instructor@example.com",
                passwordEncoder.encode("password123"),
                User.Role.INSTRUCTOR
        );
        userRepository.save(instructor);

        // Create Student User
        User student = new User(
                "Bob",
                "Johnson",
                "student@example.com",
                passwordEncoder.encode("password123"),
                User.Role.STUDENT
        );
        userRepository.save(student);

        // Create Sample Courses
        Course javaCourse = new Course(
                "Java Programming Fundamentals",
                "Learn the basics of Java programming including OOP concepts, data structures, and more.",
                instructor
        );
        courseRepository.save(javaCourse);

        Course webDevCourse = new Course(
                "Web Development with React",
                "Build modern web applications using React, HTML, CSS, and JavaScript.",
                instructor
        );
        courseRepository.save(webDevCourse);

        // Create Sample Lessons for Java Course
        Lesson javaLesson1 = new Lesson(
                "Introduction to Java",
                "This lesson covers the basics of Java programming language, its history, and setup.",
                javaCourse
        );
        javaLesson1.setOrder(1);
        lessonRepository.save(javaLesson1);

        Lesson javaLesson2 = new Lesson(
                "Variables and Data Types",
                "Learn about different data types in Java and how to declare variables.",
                javaCourse
        );
        javaLesson2.setOrder(2);
        lessonRepository.save(javaLesson2);

        Lesson javaLesson3 = new Lesson(
                "Control Structures",
                "Understand if-else statements, loops, and other control structures in Java.",
                javaCourse
        );
        javaLesson3.setOrder(3);
        lessonRepository.save(javaLesson3);

        // Create Sample Lessons for Web Dev Course
        Lesson webLesson1 = new Lesson(
                "Introduction to React",
                "Learn the fundamentals of React and component-based architecture.",
                webDevCourse
        );
        webLesson1.setOrder(1);
        lessonRepository.save(webLesson1);

        Lesson webLesson2 = new Lesson(
                "JSX and Components",
                "Understanding JSX syntax and creating reusable components.",
                webDevCourse
        );
        webLesson2.setOrder(2);
        lessonRepository.save(webLesson2);

        System.out.println("Sample data initialized successfully!");
        System.out.println("Test Credentials:");
        System.out.println("Admin: admin@example.com / password123");
        System.out.println("Instructor: instructor@example.com / password123");
        System.out.println("Student: student@example.com / password123");
    }
}
