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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/lessons")
public class LessonController {

    private final LessonService lessonService;
    private final CourseService courseService;
    private final ProgressService progressService;

    public LessonController(LessonService lessonService, CourseService courseService, ProgressService progressService) {
        this.lessonService = lessonService;
        this.courseService = courseService;
        this.progressService = progressService;
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<LessonResponse>> getLessonsByCourse(@PathVariable Long courseId) {
        List<LessonResponse> lessonResponses = lessonService.getLessonsByCourseId(courseId).stream()
                .map(LessonResponse::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(lessonResponses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LessonResponse> getLessonById(@PathVariable Long id, Authentication authentication) {
        Lesson lesson = lessonService.getLessonByIdOrThrow(id);
        User user = (User) authentication.getPrincipal();

        if (user.getRole() == User.Role.STUDENT) {
            progressService.updateLastAccessed(user, lesson);
        }

        return ResponseEntity.ok(new LessonResponse(lesson));
    }

    @PostMapping("/course/{courseId}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<LessonResponse> createLesson(@PathVariable Long courseId,
                                                       @Valid @RequestBody LessonRequest lessonRequest,
                                                       Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Course course = courseService.getCourseByIdOrThrow(courseId);

        if (!course.getInstructor().getId().equals(user.getId()) && user.getRole() != User.Role.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Lesson lesson = new Lesson(lessonRequest.getTitle(), lessonRequest.getContent(), course);
        lesson.setVideoUrl(lessonRequest.getVideoUrl());
        lesson.setOrder(lessonRequest.getOrder());

        Lesson savedLesson = lessonService.createLesson(lesson);
        return ResponseEntity.status(HttpStatus.CREATED).body(new LessonResponse(savedLesson));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<LessonResponse> updateLesson(@PathVariable Long id,
                                                       @Valid @RequestBody LessonRequest lessonRequest,
                                                       Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Lesson lesson = lessonService.getLessonByIdOrThrow(id);

        if (!lesson.getCourse().getInstructor().getId().equals(user.getId()) && user.getRole() != User.Role.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        lesson.setTitle(lessonRequest.getTitle());
        lesson.setContent(lessonRequest.getContent());
        lesson.setVideoUrl(lessonRequest.getVideoUrl());
        lesson.setOrder(lessonRequest.getOrder());

        Lesson updatedLesson = lessonService.updateLesson(lesson);
        return ResponseEntity.ok(new LessonResponse(updatedLesson));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<Void> deleteLesson(@PathVariable Long id, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Lesson lesson = lessonService.getLessonByIdOrThrow(id);

        if (!lesson.getCourse().getInstructor().getId().equals(user.getId()) && user.getRole() != User.Role.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        lessonService.deleteLesson(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{lessonId}/complete")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Void> markLessonAsCompleted(@PathVariable Long lessonId, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Lesson lesson = lessonService.getLessonByIdOrThrow(lessonId);
        progressService.markLessonAsCompleted(user, lesson);
        return ResponseEntity.ok().build();
    }
}