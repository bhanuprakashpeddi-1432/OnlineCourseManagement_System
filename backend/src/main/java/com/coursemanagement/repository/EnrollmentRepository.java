package com.coursemanagement.repository;

import com.coursemanagement.entity.Enrollment;
import com.coursemanagement.entity.User;
import com.coursemanagement.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    Optional<Enrollment> findByStudentAndCourse(User student, Course course);
    List<Enrollment> findByStudentAndActiveTrue(User student);
    List<Enrollment> findByCourseAndActiveTrue(Course course);
    boolean existsByStudentAndCourseAndActiveTrue(User student, Course course);
}
