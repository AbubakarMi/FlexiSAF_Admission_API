package com.flexisaf.admissions.service;

import com.flexisaf.admissions.dto.ReviewerNoteDTO;
import com.flexisaf.admissions.entity.Applicant;
import com.flexisaf.admissions.entity.ReviewerNote;
import com.flexisaf.admissions.entity.User;
import com.flexisaf.admissions.exception.ResourceNotFoundException;
import com.flexisaf.admissions.mapper.ReviewerNoteMapper;
import com.flexisaf.admissions.repository.ApplicantRepository;
import com.flexisaf.admissions.repository.ReviewerNoteRepository;
import com.flexisaf.admissions.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReviewerNoteService {

    private final ReviewerNoteRepository reviewerNoteRepository;
    private final ApplicantRepository applicantRepository;
    private final UserRepository userRepository;
    private final ReviewerNoteMapper reviewerNoteMapper;

    @Transactional
    public ReviewerNoteDTO addNote(Long applicantId, ReviewerNoteDTO noteDTO, String reviewerEmail) {
        log.info("Adding note to applicant {} by reviewer {}", applicantId, reviewerEmail);

        // Find applicant
        Applicant applicant = applicantRepository.findByIdAndNotDeleted(applicantId)
                .orElseThrow(() -> new ResourceNotFoundException("Applicant", "id", applicantId));

        // Find reviewer
        User reviewer = userRepository.findByEmail(reviewerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", reviewerEmail));

        // Create note
        ReviewerNote note = ReviewerNote.builder()
                .applicant(applicant)
                .reviewer(reviewer)
                .content(noteDTO.getContent())
                .build();

        ReviewerNote savedNote = reviewerNoteRepository.save(note);

        log.info("Successfully added note with ID: {}", savedNote.getId());
        return reviewerNoteMapper.toDTO(savedNote);
    }

    @Transactional(readOnly = true)
    public List<ReviewerNoteDTO> getNotesForApplicant(Long applicantId) {
        log.info("Fetching notes for applicant with ID: {}", applicantId);

        // Verify applicant exists
        if (!applicantRepository.existsById(applicantId)) {
            throw new ResourceNotFoundException("Applicant", "id", applicantId);
        }

        List<ReviewerNote> notes = reviewerNoteRepository.findByApplicantIdOrderByCreatedAtDesc(applicantId);

        return notes.stream()
                .map(reviewerNoteMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public long countNotesForApplicant(Long applicantId) {
        return reviewerNoteRepository.countByApplicantId(applicantId);
    }
}
