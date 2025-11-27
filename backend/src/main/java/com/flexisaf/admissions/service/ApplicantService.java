package com.flexisaf.admissions.service;

import com.flexisaf.admissions.dto.AIHintDTO;
import com.flexisaf.admissions.dto.ApplicantCreateDTO;
import com.flexisaf.admissions.dto.ApplicantDTO;
import com.flexisaf.admissions.dto.ApplicantUpdateDTO;
import com.flexisaf.admissions.entity.Applicant;
import com.flexisaf.admissions.entity.Applicant.ApplicationStatus;
import com.flexisaf.admissions.exception.ResourceNotFoundException;
import com.flexisaf.admissions.mapper.ApplicantMapper;
import com.flexisaf.admissions.repository.ApplicantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ApplicantService {

    private final ApplicantRepository applicantRepository;
    private final ApplicantMapper applicantMapper;
    private final AIService aiService;
    private final EmailService emailService;

    @Transactional
    public ApplicantDTO createApplicant(ApplicantCreateDTO createDTO) {
        log.info("Creating new applicant with email: {}", createDTO.getEmail());

        // Check if applicant already exists (from registration)
        Applicant applicant = applicantRepository.findByEmail(createDTO.getEmail());

        if (applicant != null) {
            // Update existing applicant record with application data
            log.info("Updating existing applicant record for email: {}", createDTO.getEmail());
            applicant.setProgram(createDTO.getProgram());
            applicant.setGpa(createDTO.getGpa());
            applicant.setTestScore(createDTO.getTestScore());
            applicant.setStatus(Applicant.ApplicationStatus.PENDING);

            // Generate AI hint
            aiService.updateApplicantWithAIHint(applicant);
        } else {
            // Map DTO to new entity
            applicant = applicantMapper.toEntity(createDTO);

            // Generate AI hint
            aiService.updateApplicantWithAIHint(applicant);
        }

        // Save applicant
        Applicant savedApplicant = applicantRepository.save(applicant);

        // Send application received email
        try {
            emailService.sendApplicationReceivedEmail(savedApplicant);
        } catch (Exception e) {
            log.error("Failed to send application received email", e);
            // Don't fail the entire operation if email fails
        }

        log.info("Successfully saved applicant with ID: {}", savedApplicant.getId());
        return applicantMapper.toDTO(savedApplicant);
    }

    @Transactional(readOnly = true)
    public ApplicantDTO getApplicantById(Long id) {
        log.info("Fetching applicant with ID: {}", id);

        Applicant applicant = applicantRepository.findByIdAndNotDeleted(id)
                .orElseThrow(() -> new ResourceNotFoundException("Applicant", "id", id));

        return applicantMapper.toDTO(applicant);
    }

    @Transactional(readOnly = true)
    public Page<ApplicantDTO> getAllApplicants(Pageable pageable) {
        log.info("Fetching all applicants - page: {}, size: {}", pageable.getPageNumber(), pageable.getPageSize());

        return applicantRepository.findAllNotDeleted(pageable)
                .map(applicantMapper::toDTO);
    }

    @Transactional(readOnly = true)
    public Page<ApplicantDTO> searchApplicants(String email, String program, ApplicationStatus status, Pageable pageable) {
        log.info("Searching applicants - email: {}, program: {}, status: {}", email, program, status);

        return applicantRepository.searchApplicants(email, program, status, pageable)
                .map(applicantMapper::toDTO);
    }

    @Transactional
    public ApplicantDTO updateApplicant(Long id, ApplicantUpdateDTO updateDTO) {
        log.info("Updating applicant with ID: {}", id);

        Applicant applicant = applicantRepository.findByIdAndNotDeleted(id)
                .orElseThrow(() -> new ResourceNotFoundException("Applicant", "id", id));

        // Check version for optimistic locking
        if (!applicant.getVersion().equals(updateDTO.getVersion())) {
            throw new IllegalArgumentException("Applicant was modified by another user. Please refresh and try again.");
        }

        // Check if email is being changed and if it's already taken
        if (updateDTO.getEmail() != null && !updateDTO.getEmail().equals(applicant.getEmail())) {
            if (applicantRepository.existsByEmailAndIdNot(updateDTO.getEmail(), id)) {
                throw new IllegalArgumentException("An applicant with this email already exists");
            }
        }

        // Track old status for email notification
        ApplicationStatus oldStatus = applicant.getStatus();

        // Update entity from DTO
        applicantMapper.updateEntityFromDTO(updateDTO, applicant);

        // Recalculate AI hint if GPA or test score changed
        if (updateDTO.getGpa() != null || updateDTO.getTestScore() != null) {
            aiService.updateApplicantWithAIHint(applicant);
        }

        Applicant updatedApplicant = applicantRepository.save(applicant);

        // Send email notification if status changed
        if (updateDTO.getStatus() != null && !updateDTO.getStatus().equals(oldStatus)) {
            try {
                if (updateDTO.getStatus() == ApplicationStatus.ACCEPTED) {
                    emailService.sendAcceptanceEmail(updatedApplicant);
                } else if (updateDTO.getStatus() == ApplicationStatus.REJECTED) {
                    emailService.sendRejectionEmail(updatedApplicant);
                } else {
                    emailService.sendStatusChangeEmail(updatedApplicant, updateDTO.getStatus().toString());
                }
            } catch (Exception e) {
                log.error("Failed to send status change email", e);
                // Don't fail the entire operation if email fails
            }
        }

        log.info("Successfully updated applicant with ID: {}", id);
        return applicantMapper.toDTO(updatedApplicant);
    }

    @Transactional
    public void deleteApplicant(Long id) {
        log.info("Soft deleting applicant with ID: {}", id);

        Applicant applicant = applicantRepository.findByIdAndNotDeleted(id)
                .orElseThrow(() -> new ResourceNotFoundException("Applicant", "id", id));

        applicant.setDeleted(true);
        applicantRepository.save(applicant);

        log.info("Successfully soft deleted applicant with ID: {}", id);
    }

    @Transactional(readOnly = true)
    public AIHintDTO getAIHint(Long id) {
        log.info("Generating AI hint for applicant with ID: {}", id);

        Applicant applicant = applicantRepository.findByIdAndNotDeleted(id)
                .orElseThrow(() -> new ResourceNotFoundException("Applicant", "id", id));

        return aiService.generateHint(applicant);
    }

    @Transactional(readOnly = true)
    public ApplicantDTO getApplicantByEmail(String email) {
        log.info("Fetching applicant with email: {}", email);

        Applicant applicant = applicantRepository.findByEmailAndNotDeleted(email)
                .orElseThrow(() -> new ResourceNotFoundException("Applicant", "email", email));

        return applicantMapper.toDTO(applicant);
    }
}
