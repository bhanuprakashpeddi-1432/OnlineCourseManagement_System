package com.coursemanagement.service;

import com.coursemanagement.entity.Course;
import com.coursemanagement.entity.User;
import com.coursemanagement.exception.ResourceNotFoundException;
import com.coursemanagement.repository.CourseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CourseService {

    private final CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    @Transactional(readOnly = true)
    public List<Course> getAllCourses() {
        return courseRepository.findAllActiveCourses();
    }

    @Transactional(readOnly = true)
    public Optional<Course> getCourseById(Long id) {
        return courseRepository.findByIdWithInstructor(id);
    }

    @Transactional(readOnly = true)
    public Course getCourseByIdOrThrow(Long id) {
        return courseRepository.findByIdWithInstructor(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", id));
    }

    @Transactional(readOnly = true)
    public List<Course> getCoursesByInstructor(User instructor) {
        return courseRepository.findByInstructor(instructor);
    }

    @Transactional(readOnly = true)
    public List<Course> getEnrolledCourses(Long studentId) {
        return courseRepository.findEnrolledCoursesByStudentId(studentId);
    }

    @Transactional(readOnly = true)
    public List<Course> getAvailableCoursesForStudent(Long studentId) {
        return courseRepository.findAvailableCoursesForStudent(studentId);
    }

    public Course createCourse(Course course) {
        return courseRepository.save(course);
    }

    public Course updateCourse(Course course) {
        return courseRepository.save(course);
    }

    public void deleteCourse(Long id) {
        Course course = getCourseByIdOrThrow(id);
        course.setActive(false);
        courseRepository.save(course);
    }

    public boolean existsById(Long id) {
        return courseRepository.existsById(id);
    }
}

