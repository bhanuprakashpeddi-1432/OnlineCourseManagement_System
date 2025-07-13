package com.coursemanagement.service;

import com.coursemanagement.entity.Enrollment;
import com.coursemanagement.entity.User;
import com.coursemanagement.entity.Course;
import com.coursemanagement.repository.EnrollmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class EnrollmentService {
    @Autowired
    private EnrollmentRepository enrollmentRepository;

    public List<Enrollment> getEnrollmentsByStudent(User student) {
        return enrollmentRepository.findByStudentAndActiveTrue(student);
    }

    public List<Enrollment> getEnrollmentsByCourse(Course course) {
        return enrollmentRepository.findByCourseAndActiveTrue(course);
    }

    public Enrollment enrollStudent(User student, Course course) {
        // Check if already enrolled
        if (enrollmentRepository.existsByStudentAndCourseAndActiveTrue(student, course)) {
            throw new RuntimeException("Student is already enrolled in this course");
        }
        
        Enrollment enrollment = new Enrollment(student, course);
        return enrollmentRepository.save(enrollment);
    }

    public void unenrollStudent(User student, Course course) {
        Optional<Enrollment> enrollment = enrollmentRepository.findByStudentAndCourse(student, course);
        if (enrollment.isPresent()) {
            Enrollment enrollmentEntity = enrollment.get();
            enrollmentEntity.setActive(false);
            enrollmentRepository.save(enrollmentEntity);
        }
    }

    public boolean isStudentEnrolled(User student, Course course) {
        return enrollmentRepository.existsByStudentAndCourseAndActiveTrue(student, course);
    }
}
