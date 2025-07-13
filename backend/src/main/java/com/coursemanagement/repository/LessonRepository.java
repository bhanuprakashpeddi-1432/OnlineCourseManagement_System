package com.coursemanagement.repository;

import com.coursemanagement.entity.Lesson;
import com.coursemanagement.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {
    List<Lesson> findByCourseOrderByOrderAsc(Course course);
    List<Lesson> findByCourseId(Long courseId);
}
