package com.coursemanagement.repository;

import com.coursemanagement.entity.Course;
import com.coursemanagement.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    /**
     * Fetches all active courses with their instructor in a single JOIN FETCH query.
     * Eliminates the N+1 query problem when mapping CourseResponse DTOs.
     */
    @Query("SELECT c FROM Course c JOIN FETCH c.instructor WHERE c.active = true ORDER BY c.createdAt DESC")
    List<Course> findAllActiveCourses();

    /**
     * Fetches all courses by a specific instructor with instructor data eagerly loaded.
     */
    @Query("SELECT c FROM Course c JOIN FETCH c.instructor WHERE c.instructor = :instructor ORDER BY c.createdAt DESC")
    List<Course> findByInstructor(@Param("instructor") User instructor);

    /**
     * Fetches all courses a student is actively enrolled in.
     */
    @Query("SELECT c FROM Course c JOIN FETCH c.instructor JOIN c.enrollments e WHERE e.student.id = :studentId AND e.active = true ORDER BY c.createdAt DESC")
    List<Course> findEnrolledCoursesByStudentId(@Param("studentId") Long studentId);

    /**
     * Fetches all active courses a student has NOT yet enrolled in.
     */
    @Query("SELECT c FROM Course c JOIN FETCH c.instructor WHERE c.active = true AND c.id NOT IN " +
           "(SELECT e.course.id FROM Enrollment e WHERE e.student.id = :studentId AND e.active = true) ORDER BY c.createdAt DESC")
    List<Course> findAvailableCoursesForStudent(@Param("studentId") Long studentId);

    /**
     * Find a course by ID with instructor eagerly loaded.
     */
    @Query("SELECT c FROM Course c JOIN FETCH c.instructor WHERE c.id = :id")
    Optional<Course> findByIdWithInstructor(@Param("id") Long id);
}

