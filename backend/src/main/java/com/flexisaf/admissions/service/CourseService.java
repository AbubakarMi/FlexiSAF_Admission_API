package com.flexisaf.admissions.service;

import com.flexisaf.admissions.entity.Course;
import com.flexisaf.admissions.exception.ResourceNotFoundException;
import com.flexisaf.admissions.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CourseService {

    private final CourseRepository courseRepository;

    @Transactional(readOnly = true)
    public List<Course> getAllCourses() {
        log.info("Fetching all courses");
        return courseRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Course getCourseById(Long id) {
        log.info("Fetching course with ID: {}", id);
        return courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", id));
    }

    @Transactional(readOnly = true)
    public List<Course> getCoursesByProgram(String program) {
        log.info("Fetching courses for program: {}", program);
        return courseRepository.findByProgram(program);
    }

    @Transactional(readOnly = true)
    public Course getCourseByCode(String code) {
        log.info("Fetching course with code: {}", code);
        return courseRepository.findByCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "code", code));
    }

    @Transactional(readOnly = true)
    public List<Course> getActiveCourses() {
        log.info("Fetching all active courses");
        return courseRepository.findByActiveTrue();
    }

    @Transactional
    public Course createCourse(Course course) {
        log.info("Creating new course: {}", course.getName());

        // Check if course code already exists
        courseRepository.findByCode(course.getCode()).ifPresent(existing -> {
            throw new IllegalArgumentException("Course with code " + course.getCode() + " already exists");
        });

        Course savedCourse = courseRepository.save(course);
        log.info("Successfully created course with ID: {}", savedCourse.getId());
        return savedCourse;
    }

    @Transactional
    public Course updateCourse(Long id, Course updatedCourse) {
        log.info("Updating course with ID: {}", id);

        Course existingCourse = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", id));

        // Check if course code is being changed and if new code already exists
        if (!existingCourse.getCode().equals(updatedCourse.getCode())) {
            courseRepository.findByCode(updatedCourse.getCode()).ifPresent(existing -> {
                throw new IllegalArgumentException("Course with code " + updatedCourse.getCode() + " already exists");
            });
        }

        // Update fields
        existingCourse.setCode(updatedCourse.getCode());
        existingCourse.setName(updatedCourse.getName());
        existingCourse.setCredits(updatedCourse.getCredits());
        existingCourse.setInstructor(updatedCourse.getInstructor());
        existingCourse.setSchedule(updatedCourse.getSchedule());
        existingCourse.setProgram(updatedCourse.getProgram());
        existingCourse.setDescription(updatedCourse.getDescription());
        existingCourse.setCapacity(updatedCourse.getCapacity());
        existingCourse.setEnrolled(updatedCourse.getEnrolled());
        existingCourse.setActive(updatedCourse.getActive());

        Course saved = courseRepository.save(existingCourse);
        log.info("Successfully updated course with ID: {}", id);
        return saved;
    }

    @Transactional
    public void deleteCourse(Long id) {
        log.info("Deleting course with ID: {}", id);

        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", id));

        courseRepository.delete(course);
        log.info("Successfully deleted course with ID: {}", id);
    }
}
