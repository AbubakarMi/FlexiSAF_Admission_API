package com.flexisaf.admissions.controller;

import com.flexisaf.admissions.dto.EnrollmentDTO;
import com.flexisaf.admissions.service.EnrollmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/enrollments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Enrollment", description = "Student course enrollment management")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    @PostMapping("/student/{studentId}/course/{courseId}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Enroll student in a course")
    public ResponseEntity<EnrollmentDTO> enrollInCourse(
            @PathVariable Long studentId,
            @PathVariable Long courseId) {
        EnrollmentDTO enrollment = enrollmentService.enrollStudentInCourse(studentId, courseId);
        return ResponseEntity.status(HttpStatus.CREATED).body(enrollment);
    }

    @PostMapping("/student/{studentId}/courses")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Enroll student in multiple courses")
    public ResponseEntity<List<EnrollmentDTO>> enrollInMultipleCourses(
            @PathVariable Long studentId,
            @RequestBody Map<String, List<Long>> request) {
        List<Long> courseIds = request.get("courseIds");
        List<EnrollmentDTO> enrollments = enrollmentService.enrollStudentInMultipleCourses(studentId, courseIds);
        return ResponseEntity.status(HttpStatus.CREATED).body(enrollments);
    }

    @GetMapping("/student/{studentId}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get all enrollments for a student")
    public ResponseEntity<List<EnrollmentDTO>> getStudentEnrollments(@PathVariable Long studentId) {
        List<EnrollmentDTO> enrollments = enrollmentService.getStudentEnrollments(studentId);
        return ResponseEntity.ok(enrollments);
    }

    @GetMapping("/student/{studentId}/active")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get active enrollments for a student")
    public ResponseEntity<List<EnrollmentDTO>> getActiveEnrollments(@PathVariable Long studentId) {
        List<EnrollmentDTO> enrollments = enrollmentService.getActiveEnrollments(studentId);
        return ResponseEntity.ok(enrollments);
    }

    @DeleteMapping("/student/{studentId}/course/{courseId}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Drop a course")
    public ResponseEntity<Map<String, String>> dropCourse(
            @PathVariable Long studentId,
            @PathVariable Long courseId) {
        enrollmentService.dropCourse(studentId, courseId);
        return ResponseEntity.ok(Map.of("message", "Course dropped successfully"));
    }

    @GetMapping("/student/{studentId}/course/{courseId}/check")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Check if student is enrolled in course")
    public ResponseEntity<Map<String, Boolean>> checkEnrollment(
            @PathVariable Long studentId,
            @PathVariable Long courseId) {
        boolean isEnrolled = enrollmentService.isStudentEnrolledInCourse(studentId, courseId);
        return ResponseEntity.ok(Map.of("enrolled", isEnrolled));
    }
}
