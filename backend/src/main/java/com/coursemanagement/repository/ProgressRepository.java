package com.coursemanagement.repository;

import com.coursemanagement.entity.Progress;
import com.coursemanagement.entity.User;
import com.coursemanagement.entity.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProgressRepository extends JpaRepository<Progress, Long> {
    Optional<Progress> findByStudentAndLesson(User student, Lesson lesson);
    List<Progress> findByStudent(User student);
    
    @Query("SELECT p FROM Progress p WHERE p.student.id = :studentId AND p.lesson.course.id = :courseId")
    List<Progress> findByStudentIdAndCourseId(@Param("studentId") Long studentId, @Param("courseId") Long courseId);
    
    @Query("SELECT COUNT(p) FROM Progress p WHERE p.student.id = :studentId AND p.lesson.course.id = :courseId AND p.completed = true")
    Long countCompletedLessonsByStudentAndCourse(@Param("studentId") Long studentId, @Param("courseId") Long courseId);
}
