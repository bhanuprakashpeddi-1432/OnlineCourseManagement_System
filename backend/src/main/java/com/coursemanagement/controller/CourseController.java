package com.coursemanagement.controller;

import com.coursemanagement.dto.CourseRequest;
import com.coursemanagement.dto.CourseResponse;
import com.coursemanagement.entity.Course;
import com.coursemanagement.entity.User;
import com.coursemanagement.service.CourseService;
import com.coursemanagement.service.EnrollmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService courseService;
    private final EnrollmentService enrollmentService;

    public CourseController(CourseService courseService, EnrollmentService enrollmentService) {
        this.courseService = courseService;
        this.enrollmentService = enrollmentService;
    }

    @GetMapping
    public ResponseEntity<List<CourseResponse>> getAllCourses() {
        List<CourseResponse> courseResponses = courseService.getAllCourses().stream()
                .map(CourseResponse::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(courseResponses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseResponse> getCourseById(@PathVariable Long id) {
        Course course = courseService.getCourseByIdOrThrow(id);
        return ResponseEntity.ok(new CourseResponse(course));
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
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<CourseResponse>> getAvailableCourses(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        List<CourseResponse> courseResponses = courseService.getAvailableCoursesForStudent(user.getId()).stream()
                .map(CourseResponse::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(courseResponses);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<CourseResponse> createCourse(@Valid @RequestBody CourseRequest courseRequest,
                                                       Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Course course = new Course(courseRequest.getTitle(), courseRequest.getDescription(), user);
        Course savedCourse = courseService.createCourse(course);
        return ResponseEntity.status(HttpStatus.CREATED).body(new CourseResponse(savedCourse));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<CourseResponse> updateCourse(@PathVariable Long id,
                                                       @Valid @RequestBody CourseRequest courseRequest,
                                                       Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Course course = courseService.getCourseByIdOrThrow(id);

        if (!course.getInstructor().getId().equals(user.getId()) && user.getRole() != User.Role.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        course.setTitle(courseRequest.getTitle());
        course.setDescription(courseRequest.getDescription());

        Course updatedCourse = courseService.updateCourse(course);
        return ResponseEntity.ok(new CourseResponse(updatedCourse));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Course course = courseService.getCourseByIdOrThrow(id);

        if (!course.getInstructor().getId().equals(user.getId()) && user.getRole() != User.Role.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        courseService.deleteCourse(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{courseId}/enroll")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> enrollInCourse(@PathVariable Long courseId, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Course course = courseService.getCourseByIdOrThrow(courseId);

        try {
            enrollmentService.enrollStudent(user, course);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{courseId}/unenroll")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Void> unenrollFromCourse(@PathVariable Long courseId, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Course course = courseService.getCourseByIdOrThrow(courseId);
        enrollmentService.unenrollStudent(user, course);
        return ResponseEntity.ok().build();
    }
}