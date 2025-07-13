package com.coursemanagement.controller;

import com.coursemanagement.dto.LessonRequest;
import com.coursemanagement.dto.LessonResponse;
import com.coursemanagement.entity.Course;
import com.coursemanagement.entity.Lesson;
import com.coursemanagement.entity.User;
import com.coursemanagement.service.CourseService;
import com.coursemanagement.service.LessonService;
import com.coursemanagement.service.ProgressService;
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
@RequestMapping("/api/lessons")
public class LessonController {
    @Autowired
    private LessonService lessonService;

    @Autowired
    private CourseService courseService;

    @Autowired
    private ProgressService progressService;

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<LessonResponse>> getLessonsByCourse(@PathVariable Long courseId) {
        List<Lesson> lessons = lessonService.getLessonsByCourseId(courseId);
        List<LessonResponse> lessonResponses = lessons.stream()
                .map(LessonResponse::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(lessonResponses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LessonResponse> getLessonById(@PathVariable Long id, Authentication authentication) {
        Optional<Lesson> lessonOpt = lessonService.getLessonById(id);
        if (lessonOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Lesson lesson = lessonOpt.get();
        User user = (User) authentication.getPrincipal();
        
        // Update last accessed for students
        if (user.getRole() == User.Role.STUDENT) {
            progressService.updateLastAccessed(user, lesson);
        }
        
        LessonResponse lessonResponse = new LessonResponse(lesson);
        return ResponseEntity.ok(lessonResponse);
    }

    @PostMapping("/course/{courseId}")
    public ResponseEntity<LessonResponse> createLesson(@PathVariable Long courseId, 
                                              @Valid @RequestBody LessonRequest lessonRequest,
                                              Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Optional<Course> courseOpt = courseService.getCourseById(courseId);
        
        if (courseOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Course course = courseOpt.get();
        
        // Check if user is the instructor or admin
        if (!course.getInstructor().getId().equals(user.getId()) && user.getRole() != User.Role.ADMIN) {
            return ResponseEntity.badRequest().build();
        }
        
        Lesson lesson = new Lesson(lessonRequest.getTitle(), lessonRequest.getContent(), course);
        lesson.setVideoUrl(lessonRequest.getVideoUrl());
        lesson.setOrder(lessonRequest.getOrder());
        
        Lesson savedLesson = lessonService.createLesson(lesson);
        LessonResponse lessonResponse = new LessonResponse(savedLesson);
        return ResponseEntity.ok(lessonResponse);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LessonResponse> updateLesson(@PathVariable Long id, 
                                              @Valid @RequestBody LessonRequest lessonRequest,
                                              Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Optional<Lesson> lessonOpt = lessonService.getLessonById(id);
        
        if (lessonOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Lesson lesson = lessonOpt.get();
        
        // Check if user is the instructor or admin
        if (!lesson.getCourse().getInstructor().getId().equals(user.getId()) && user.getRole() != User.Role.ADMIN) {
            return ResponseEntity.badRequest().build();
        }
        
        lesson.setTitle(lessonRequest.getTitle());
        lesson.setContent(lessonRequest.getContent());
        lesson.setVideoUrl(lessonRequest.getVideoUrl());
        lesson.setOrder(lessonRequest.getOrder());
        
        Lesson updatedLesson = lessonService.updateLesson(lesson);
        LessonResponse lessonResponse = new LessonResponse(updatedLesson);
        return ResponseEntity.ok(lessonResponse);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLesson(@PathVariable Long id, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Optional<Lesson> lessonOpt = lessonService.getLessonById(id);
        
        if (lessonOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Lesson lesson = lessonOpt.get();
        
        // Check if user is the instructor or admin
        if (!lesson.getCourse().getInstructor().getId().equals(user.getId()) && user.getRole() != User.Role.ADMIN) {
            return ResponseEntity.badRequest().build();
        }
        
        lessonService.deleteLesson(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{lessonId}/complete")
    public ResponseEntity<?> markLessonAsCompleted(@PathVariable Long lessonId, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        
        if (user.getRole() != User.Role.STUDENT) {
            return ResponseEntity.badRequest().body("Only students can mark lessons as completed");
        }
        
        Optional<Lesson> lessonOpt = lessonService.getLessonById(lessonId);
        if (lessonOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        progressService.markLessonAsCompleted(user, lessonOpt.get());
        return ResponseEntity.ok().build();
    }
}
