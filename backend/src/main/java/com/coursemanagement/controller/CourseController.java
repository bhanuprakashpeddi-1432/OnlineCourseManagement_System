package com.coursemanagement.controller;

import com.coursemanagement.dto.CourseRequest;
import com.coursemanagement.dto.CourseResponse;
import com.coursemanagement.entity.Course;
import com.coursemanagement.entity.User;
import com.coursemanagement.service.CourseService;
import com.coursemanagement.service.EnrollmentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/courses")
public class CourseController {
    @Autowired
    private CourseService courseService;

    @Autowired
    private EnrollmentService enrollmentService;

    @GetMapping
    public ResponseEntity<List<CourseResponse>> getAllCourses() {
        List<Course> courses = courseService.getAllCourses();
        List<CourseResponse> courseResponses = courses.stream()
                .map(CourseResponse::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(courseResponses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseResponse> getCourseById(@PathVariable Long id) {
        Optional<Course> course = courseService.getCourseById(id);
        return course.map(c -> ResponseEntity.ok(new CourseResponse(c)))
                    .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/my-courses")
    public ResponseEntity<List<CourseResponse>> getMyCourses(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        List<Course> courses;
        
        if (user.getRole() == User.Role.INSTRUCTOR || user.getRole() == User.Role.ADMIN) {
            courses = courseService.getCoursesByInstructor(user);
        } else {
            courses = courseService.getEnrolledCourses(user.getId());
        }
        
        List<CourseResponse> courseResponses = courses.stream()
                .map(CourseResponse::new)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(courseResponses);
    }

    @GetMapping("/available")
    public ResponseEntity<List<CourseResponse>> getAvailableCourses(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        if (user.getRole() == User.Role.STUDENT) {
            List<Course> courses = courseService.getAvailableCoursesForStudent(user.getId());
            List<CourseResponse> courseResponses = courses.stream()
                    .map(CourseResponse::new)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(courseResponses);
        }
        return ResponseEntity.badRequest().build();
    }

    @PostMapping
    public ResponseEntity<CourseResponse> createCourse(@Valid @RequestBody CourseRequest courseRequest, 
                                              Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        
        if (user.getRole() != User.Role.INSTRUCTOR && user.getRole() != User.Role.ADMIN) {
            return ResponseEntity.badRequest().build();
        }
        
        Course course = new Course(courseRequest.getTitle(), courseRequest.getDescription(), user);
        Course savedCourse = courseService.createCourse(course);
        CourseResponse courseResponse = new CourseResponse(savedCourse);
        return ResponseEntity.ok(courseResponse);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CourseResponse> updateCourse(@PathVariable Long id, 
                                              @Valid @RequestBody CourseRequest courseRequest,
                                              Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Optional<Course> courseOpt = courseService.getCourseById(id);
        
        if (courseOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Course course = courseOpt.get();
        
        // Check if user is the instructor or admin
        if (!course.getInstructor().getId().equals(user.getId()) && user.getRole() != User.Role.ADMIN) {
            return ResponseEntity.badRequest().build();
        }
        
        course.setTitle(courseRequest.getTitle());
        course.setDescription(courseRequest.getDescription());
        
        Course updatedCourse = courseService.updateCourse(course);
        CourseResponse courseResponse = new CourseResponse(updatedCourse);
        return ResponseEntity.ok(courseResponse);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCourse(@PathVariable Long id, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Optional<Course> courseOpt = courseService.getCourseById(id);
        
        if (courseOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Course course = courseOpt.get();
        
        // Check if user is the instructor or admin
        if (!course.getInstructor().getId().equals(user.getId()) && user.getRole() != User.Role.ADMIN) {
            return ResponseEntity.badRequest().build();
        }
        
        courseService.deleteCourse(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{courseId}/enroll")
    public ResponseEntity<?> enrollInCourse(@PathVariable Long courseId, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        
        if (user.getRole() != User.Role.STUDENT) {
            return ResponseEntity.badRequest().body("Only students can enroll in courses");
        }
        
        Optional<Course> courseOpt = courseService.getCourseById(courseId);
        if (courseOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        try {
            enrollmentService.enrollStudent(user, courseOpt.get());
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{courseId}/unenroll")
    public ResponseEntity<?> unenrollFromCourse(@PathVariable Long courseId, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        
        if (user.getRole() != User.Role.STUDENT) {
            return ResponseEntity.badRequest().body("Only students can unenroll from courses");
        }
        
        Optional<Course> courseOpt = courseService.getCourseById(courseId);
        if (courseOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        enrollmentService.unenrollStudent(user, courseOpt.get());
        return ResponseEntity.ok().build();
    }
}
