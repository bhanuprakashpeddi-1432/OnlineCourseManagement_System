package com.coursemanagement.dto;

import com.coursemanagement.entity.Course;
import com.coursemanagement.entity.User;

import java.time.LocalDateTime;

public class CourseResponse {
    private Long id;
    private String title;
    private String description;
    private InstructorInfo instructor;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean active;
    private int lessonsCount;
    private int enrollmentsCount;

    public CourseResponse() {}

    public CourseResponse(Course course) {
        this.id = course.getId();
        this.title = course.getTitle();
        this.description = course.getDescription();
        this.instructor = new InstructorInfo(course.getInstructor());
        this.createdAt = course.getCreatedAt();
        this.updatedAt = course.getUpdatedAt();
        this.active = course.isActive();
        // Avoid lazy loading collections by not accessing them unless needed
        this.lessonsCount = 0; // Can be set separately if needed
        this.enrollmentsCount = 0; // Can be set separately if needed
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public InstructorInfo getInstructor() {
        return instructor;
    }

    public void setInstructor(InstructorInfo instructor) {
        this.instructor = instructor;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public int getLessonsCount() {
        return lessonsCount;
    }

    public void setLessonsCount(int lessonsCount) {
        this.lessonsCount = lessonsCount;
    }

    public int getEnrollmentsCount() {
        return enrollmentsCount;
    }

    public void setEnrollmentsCount(int enrollmentsCount) {
        this.enrollmentsCount = enrollmentsCount;
    }

    // Inner class for instructor information
    public static class InstructorInfo {
        private Long id;
        private String firstName;
        private String lastName;
        private String email;

        public InstructorInfo() {}

        public InstructorInfo(User instructor) {
            this.id = instructor.getId();
            this.firstName = instructor.getFirstName();
            this.lastName = instructor.getLastName();
            this.email = instructor.getEmail();
        }

        // Getters and setters
        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getFirstName() {
            return firstName;
        }

        public void setFirstName(String firstName) {
            this.firstName = firstName;
        }

        public String getLastName() {
            return lastName;
        }

        public void setLastName(String lastName) {
            this.lastName = lastName;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }
    }
}
