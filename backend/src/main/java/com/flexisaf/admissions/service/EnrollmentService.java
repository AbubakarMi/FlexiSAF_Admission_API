package com.flexisaf.admissions.service;

import com.flexisaf.admissions.dto.EnrollmentDTO;
import com.flexisaf.admissions.entity.Course;
import com.flexisaf.admissions.entity.Student;
import com.flexisaf.admissions.entity.StudentCourseEnrollment;
import com.flexisaf.admissions.exception.ResourceNotFoundException;
import com.flexisaf.admissions.repository.CourseRepository;
import com.flexisaf.admissions.repository.StudentCourseEnrollmentRepository;
import com.flexisaf.admissions.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class EnrollmentService {

    private final StudentCourseEnrollmentRepository enrollmentRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;

    @Transactional
    public EnrollmentDTO enrollStudentInCourse(Long studentId, Long courseId) {
        log.info("Enrolling student {} in course {}", studentId, courseId);

        // Validate student exists
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", studentId));

        // Validate course exists
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", courseId));

        // Check if already enrolled
        if (enrollmentRepository.existsByStudentIdAndCourseId(studentId, courseId)) {
            throw new IllegalStateException("Student is already enrolled in this course");
        }

        // Check if student's program matches course program
        if (student.getProgram() != null && course.getProgram() != null &&
            !student.getProgram().equals(course.getProgram())) {
            throw new IllegalStateException("Student cannot enroll in course from different program");
        }

        // Check course capacity
        long currentEnrolled = enrollmentRepository.countEnrolledStudentsByCourse(courseId);
        if (currentEnrolled >= course.getCapacity()) {
            throw new IllegalStateException("Course is at full capacity");
        }

        // Create enrollment
        StudentCourseEnrollment enrollment = StudentCourseEnrollment.builder()
                .studentId(studentId)
                .courseId(courseId)
                .status(StudentCourseEnrollment.EnrollmentStatus.ENROLLED)
                .enrolledDate(LocalDateTime.now())
                .build();

        StudentCourseEnrollment saved = enrollmentRepository.save(enrollment);

        // Update course enrolled count
        course.setEnrolled(course.getEnrolled() + 1);
        courseRepository.save(course);

        log.info("Successfully enrolled student {} in course {}", studentId, courseId);
        return convertToDTO(saved, course);
    }

    @Transactional
    public List<EnrollmentDTO> enrollStudentInMultipleCourses(Long studentId, List<Long> courseIds) {
        log.info("Enrolling student {} in {} courses", studentId, courseIds.size());

        return courseIds.stream()
                .map(courseId -> {
                    try {
                        return enrollStudentInCourse(studentId, courseId);
                    } catch (Exception e) {
                        log.error("Failed to enroll student {} in course {}: {}", studentId, courseId, e.getMessage());
                        throw new RuntimeException("Failed to enroll in course " + courseId + ": " + e.getMessage());
                    }
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EnrollmentDTO> getStudentEnrollments(Long studentId) {
        log.info("Fetching enrollments for student {}", studentId);

        // Validate student exists
        if (!studentRepository.existsById(studentId)) {
            throw new ResourceNotFoundException("Student", "id", studentId);
        }

        List<StudentCourseEnrollment> enrollments = enrollmentRepository.findByStudentId(studentId);

        return enrollments.stream()
                .map(enrollment -> {
                    Course course = courseRepository.findById(enrollment.getCourseId())
                            .orElse(null);
                    return convertToDTO(enrollment, course);
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EnrollmentDTO> getActiveEnrollments(Long studentId) {
        log.info("Fetching active enrollments for student {}", studentId);

        if (!studentRepository.existsById(studentId)) {
            throw new ResourceNotFoundException("Student", "id", studentId);
        }

        List<StudentCourseEnrollment> enrollments = enrollmentRepository
                .findActiveEnrollmentsByStudent(studentId);

        return enrollments.stream()
                .map(enrollment -> {
                    Course course = courseRepository.findById(enrollment.getCourseId())
                            .orElse(null);
                    return convertToDTO(enrollment, course);
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public void dropCourse(Long studentId, Long courseId) {
        log.info("Student {} dropping course {}", studentId, courseId);

        StudentCourseEnrollment enrollment = enrollmentRepository
                .findByStudentIdAndCourseId(studentId, courseId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Enrollment not found for student " + studentId + " and course " + courseId));

        if (enrollment.getStatus() == StudentCourseEnrollment.EnrollmentStatus.DROPPED) {
            throw new IllegalStateException("Course is already dropped");
        }

        // Update enrollment status
        enrollment.setStatus(StudentCourseEnrollment.EnrollmentStatus.DROPPED);
        enrollment.setDroppedDate(LocalDateTime.now());
        enrollmentRepository.save(enrollment);

        // Update course enrolled count
        Course course = courseRepository.findById(courseId).orElse(null);
        if (course != null && course.getEnrolled() > 0) {
            course.setEnrolled(course.getEnrolled() - 1);
            courseRepository.save(course);
        }

        log.info("Student {} successfully dropped course {}", studentId, courseId);
    }

    @Transactional(readOnly = true)
    public boolean isStudentEnrolledInCourse(Long studentId, Long courseId) {
        return enrollmentRepository.findByStudentIdAndCourseId(studentId, courseId)
                .map(e -> e.getStatus() == StudentCourseEnrollment.EnrollmentStatus.ENROLLED)
                .orElse(false);
    }

    private EnrollmentDTO convertToDTO(StudentCourseEnrollment enrollment, Course course) {
        EnrollmentDTO dto = EnrollmentDTO.builder()
                .id(enrollment.getId())
                .studentId(enrollment.getStudentId())
                .courseId(enrollment.getCourseId())
                .status(enrollment.getStatus())
                .enrolledDate(enrollment.getEnrolledDate())
                .droppedDate(enrollment.getDroppedDate())
                .build();

        if (course != null) {
            dto.setCourseCode(course.getCode());
            dto.setCourseName(course.getName());
            dto.setCredits(course.getCredits());
            dto.setInstructor(course.getInstructor());
            dto.setProgram(course.getProgram());
        }

        return dto;
    }
}
