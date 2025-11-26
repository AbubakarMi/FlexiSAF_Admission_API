package com.flexisaf.admissions.controller;

import com.flexisaf.admissions.dto.ReviewerNoteDTO;
import com.flexisaf.admissions.service.ReviewerNoteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applicants/{applicantId}/notes")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Reviewer Notes", description = "Reviewer notes management endpoints")
public class ReviewerNoteController {

    private final ReviewerNoteService reviewerNoteService;

    @PostMapping
    @Operation(summary = "Add note", description = "Add a reviewer note to an applicant")
    public ResponseEntity<ReviewerNoteDTO> addNote(
            @PathVariable Long applicantId,
            @Valid @RequestBody ReviewerNoteDTO noteDTO,
            Authentication authentication) {

        String reviewerEmail = authentication.getName();
        ReviewerNoteDTO created = reviewerNoteService.addNote(applicantId, noteDTO, reviewerEmail);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get notes", description = "Get all reviewer notes for an applicant")
    public ResponseEntity<List<ReviewerNoteDTO>> getNotes(@PathVariable Long applicantId) {
        List<ReviewerNoteDTO> notes = reviewerNoteService.getNotesForApplicant(applicantId);
        return ResponseEntity.ok(notes);
    }
}
