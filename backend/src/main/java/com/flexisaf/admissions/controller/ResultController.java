package com.flexisaf.admissions.controller;

import com.flexisaf.admissions.entity.Result;
import com.flexisaf.admissions.service.ResultService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/results")
@RequiredArgsConstructor
@Tag(name = "Results", description = "Result management endpoints")
public class ResultController {

    private final ResultService resultService;

    @GetMapping("/course/{courseId}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get results by course", description = "Retrieve all results for a specific course")
    public ResponseEntity<List<Result>> getResultsByCourse(
            @Parameter(description = "Course ID") @PathVariable Long courseId) {
        List<Result> results = resultService.getResultsByCourseId(courseId);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/student/{studentId}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get student results", description = "Retrieve all results for a specific student")
    public ResponseEntity<List<Result>> getResultsByStudent(
            @Parameter(description = "Student ID") @PathVariable Long studentId) {
        List<Result> results = resultService.getResultsByStudentId(studentId);
        return ResponseEntity.ok(results);
    }

    @PostMapping("/{courseId}/publish")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Publish results for course", description = "Publish all results for a specific course")
    public ResponseEntity<List<Result>> publishResultsForCourse(
            @Parameter(description = "Course ID") @PathVariable Long courseId,
            Authentication authentication) {
        // In a real application, you would extract the user ID from the authentication
        // For now, we'll use a placeholder value
        Long publishedBy = 1L; // This should be extracted from authentication
        List<Result> publishedResults = resultService.publishResultsForCourse(courseId, publishedBy);
        return ResponseEntity.ok(publishedResults);
    }

    @PostMapping("/{courseId}/unpublish")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Unpublish results for course", description = "Unpublish all results for a specific course")
    public ResponseEntity<List<Result>> unpublishResultsForCourse(
            @Parameter(description = "Course ID") @PathVariable Long courseId) {
        List<Result> unpublishedResults = resultService.unpublishResultsForCourse(courseId);
        return ResponseEntity.ok(unpublishedResults);
    }
}
