package com.coursemanagement.service;

import com.coursemanagement.entity.Progress;
import com.coursemanagement.entity.User;
import com.coursemanagement.entity.Lesson;
import com.coursemanagement.repository.ProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ProgressService {
    @Autowired
    private ProgressRepository progressRepository;

    public List<Progress> getProgressByStudent(User student) {
        return progressRepository.findByStudent(student);
    }

    public List<Progress> getProgressByStudentAndCourse(Long studentId, Long courseId) {
        return progressRepository.findByStudentIdAndCourseId(studentId, courseId);
    }

    public Progress markLessonAsCompleted(User student, Lesson lesson) {
        Optional<Progress> existingProgress = progressRepository.findByStudentAndLesson(student, lesson);
        
        Progress progress;
        if (existingProgress.isPresent()) {
            progress = existingProgress.get();
        } else {
            progress = new Progress(student, lesson);
        }
        
        progress.setCompleted(true);
        progress.setLastAccessed(LocalDateTime.now());
        
        return progressRepository.save(progress);
    }

    public Progress updateLastAccessed(User student, Lesson lesson) {
        Optional<Progress> existingProgress = progressRepository.findByStudentAndLesson(student, lesson);
        
        Progress progress;
        if (existingProgress.isPresent()) {
            progress = existingProgress.get();
        } else {
            progress = new Progress(student, lesson);
        }
        
        progress.setLastAccessed(LocalDateTime.now());
        
        return progressRepository.save(progress);
    }

    public Long getCompletedLessonsCount(Long studentId, Long courseId) {
        return progressRepository.countCompletedLessonsByStudentAndCourse(studentId, courseId);
    }
}
