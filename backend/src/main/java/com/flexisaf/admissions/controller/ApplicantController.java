package com.flexisaf.admissions.controller;

import com.flexisaf.admissions.dto.AIHintDTO;
import com.flexisaf.admissions.dto.ApplicantCreateDTO;
import com.flexisaf.admissions.dto.ApplicantDTO;
import com.flexisaf.admissions.dto.ApplicantUpdateDTO;
import com.flexisaf.admissions.entity.Applicant.ApplicationStatus;
import com.flexisaf.admissions.service.ApplicantService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/applicants")
@RequiredArgsConstructor
@Tag(name = "Applicants", description = "Applicant management endpoints")
public class ApplicantController {

    private final ApplicantService applicantService;

    @PostMapping
    @Operation(summary = "Submit application", description = "Public endpoint for applicants to submit their application")
    public ResponseEntity<ApplicantDTO> createApplicant(@Valid @RequestBody ApplicantCreateDTO createDTO) {
        ApplicantDTO created = applicantService.createApplicant(createDTO);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "List applicants", description = "Get paginated list of applicants with optional search filters")
    public ResponseEntity<Page<ApplicantDTO>> getAllApplicants(
            @Parameter(description = "Filter by email (partial match)")
            @RequestParam(required = false) String email,

            @Parameter(description = "Filter by program (partial match)")
            @RequestParam(required = false) String program,

            @Parameter(description = "Filter by status")
            @RequestParam(required = false) ApplicationStatus status,

            @Parameter(description = "Page number (0-indexed)")
            @RequestParam(defaultValue = "0") int page,

            @Parameter(description = "Page size")
            @RequestParam(defaultValue = "10") int size,

            @Parameter(description = "Sort field")
            @RequestParam(defaultValue = "createdAt") String sort,

            @Parameter(description = "Sort direction (asc/desc)")
            @RequestParam(defaultValue = "desc") String direction) {

        Sort.Direction sortDirection = direction.equalsIgnoreCase("asc") ?
                Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sort));

        Page<ApplicantDTO> applicants;
        if (email != null || program != null || status != null) {
            applicants = applicantService.searchApplicants(email, program, status, pageable);
        } else {
            applicants = applicantService.getAllApplicants(pageable);
        }

        return ResponseEntity.ok(applicants);
    }

    @GetMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get applicant", description = "Get applicant details by ID")
    public ResponseEntity<ApplicantDTO> getApplicantById(@PathVariable Long id) {
        ApplicantDTO applicant = applicantService.getApplicantById(id);
        return ResponseEntity.ok(applicant);
    }

    @PutMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Update applicant", description = "Update applicant information (requires version for optimistic locking)")
    public ResponseEntity<ApplicantDTO> updateApplicant(
            @PathVariable Long id,
            @Valid @RequestBody ApplicantUpdateDTO updateDTO) {
        ApplicantDTO updated = applicantService.updateApplicant(id, updateDTO);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Delete applicant", description = "Soft delete an applicant")
    public ResponseEntity<Void> deleteApplicant(@PathVariable Long id) {
        applicantService.deleteApplicant(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/ai-hint")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get AI hint", description = "Get AI-powered evaluation hint for an applicant")
    public ResponseEntity<AIHintDTO> getAIHint(@PathVariable Long id) {
        AIHintDTO hint = applicantService.getAIHint(id);
        return ResponseEntity.ok(hint);
    }

    @GetMapping("/my-application")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get my application", description = "Get the current authenticated student's application")
    public ResponseEntity<ApplicantDTO> getMyApplication(Authentication authentication) {
        String email = authentication.getName();
        ApplicantDTO applicant = applicantService.getApplicantByEmail(email);
        return ResponseEntity.ok(applicant);
    }
}
