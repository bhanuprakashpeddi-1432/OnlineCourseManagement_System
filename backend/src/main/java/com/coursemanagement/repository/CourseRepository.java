package com.coursemanagement.repository;

import com.coursemanagement.entity.Course;
import com.coursemanagement.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByInstructor(User instructor);
    List<Course> findByActiveTrue();
    
    @Query("SELECT c FROM Course c JOIN c.enrollments e WHERE e.student.id = :studentId AND e.active = true")
    List<Course> findEnrolledCoursesByStudentId(@Param("studentId") Long studentId);
    
    @Query("SELECT c FROM Course c WHERE c.active = true AND c.id NOT IN " +
           "(SELECT e.course.id FROM Enrollment e WHERE e.student.id = :studentId AND e.active = true)")
    List<Course> findAvailableCoursesForStudent(@Param("studentId") Long studentId);
}
