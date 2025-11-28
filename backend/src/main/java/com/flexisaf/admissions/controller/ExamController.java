package com.flexisaf.admissions.controller;

import com.flexisaf.admissions.entity.Exam;
import com.flexisaf.admissions.service.ExamService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/exams")
@RequiredArgsConstructor
@Tag(name = "Exams", description = "Exam management endpoints")
public class ExamController {

    private final ExamService examService;

    @GetMapping("/course/{courseId}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get exams by course", description = "Retrieve all exams for a specific course")
    public ResponseEntity<List<Exam>> getExamsByCourse(
            @Parameter(description = "Course ID") @PathVariable Long courseId) {
        List<Exam> exams = examService.getExamsByCourseId(courseId);
        return ResponseEntity.ok(exams);
    }

    @PostMapping("/{examId}/publish")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Publish exam", description = "Publish an exam to make it visible to students")
    public ResponseEntity<Exam> publishExam(
            @Parameter(description = "Exam ID") @PathVariable Long examId,
            Authentication authentication) {
        // In a real application, you would extract the user ID from the authentication
        // For now, we'll use a placeholder value
        Long publishedBy = 1L; // This should be extracted from authentication
        Exam publishedExam = examService.publishExam(examId, publishedBy);
        return ResponseEntity.ok(publishedExam);
    }

    @PostMapping("/{examId}/unpublish")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Unpublish exam", description = "Unpublish an exam to hide it from students")
    public ResponseEntity<Exam> unpublishExam(
            @Parameter(description = "Exam ID") @PathVariable Long examId) {
        Exam unpublishedExam = examService.unpublishExam(examId);
        return ResponseEntity.ok(unpublishedExam);
    }

    @GetMapping("/{courseId}/status")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get exam publication status", description = "Get the publication status of exams for a course")
    public ResponseEntity<Map<String, Object>> getExamPublicationStatus(
            @Parameter(description = "Course ID") @PathVariable Long courseId) {
        Map<String, Object> status = examService.getExamPublicationStatus(courseId);
        return ResponseEntity.ok(status);
    }
}
