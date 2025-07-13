package com.coursemanagement.service;

import com.coursemanagement.entity.Lesson;
import com.coursemanagement.entity.Course;
import com.coursemanagement.repository.LessonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class LessonService {
    @Autowired
    private LessonRepository lessonRepository;

    public List<Lesson> getLessonsByCourse(Course course) {
        return lessonRepository.findByCourseOrderByOrderAsc(course);
    }

    public List<Lesson> getLessonsByCourseId(Long courseId) {
        return lessonRepository.findByCourseId(courseId);
    }

    public Optional<Lesson> getLessonById(Long id) {
        return lessonRepository.findById(id);
    }

    public Lesson createLesson(Lesson lesson) {
        return lessonRepository.save(lesson);
    }

    public Lesson updateLesson(Lesson lesson) {
        return lessonRepository.save(lesson);
    }

    public void deleteLesson(Long id) {
        lessonRepository.deleteById(id);
    }

    public boolean existsById(Long id) {
        return lessonRepository.existsById(id);
    }
}
