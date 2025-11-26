package com.flexisaf.admissions.service;

import com.flexisaf.admissions.dto.ApplicantCreateDTO;
import com.flexisaf.admissions.dto.ApplicantDTO;
import com.flexisaf.admissions.entity.Applicant;
import com.flexisaf.admissions.exception.ResourceNotFoundException;
import com.flexisaf.admissions.mapper.ApplicantMapper;
import com.flexisaf.admissions.repository.ApplicantRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ApplicantServiceTest {

    @Mock
    private ApplicantRepository applicantRepository;

    @Mock
    private ApplicantMapper applicantMapper;

    @Mock
    private AIService aiService;

    @InjectMocks
    private ApplicantService applicantService;

    private ApplicantCreateDTO createDTO;
    private Applicant applicant;
    private ApplicantDTO applicantDTO;

    @BeforeEach
    void setUp() {
        createDTO = ApplicantCreateDTO.builder()
                .firstName("John")
                .lastName("Doe")
                .email("john@example.com")
                .program("Computer Science")
                .gpa(new BigDecimal("3.5"))
                .testScore(85)
                .build();

        applicant = Applicant.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .email("john@example.com")
                .program("Computer Science")
                .gpa(new BigDecimal("3.5"))
                .testScore(85)
                .status(Applicant.ApplicationStatus.PENDING)
                .build();

        applicantDTO = ApplicantDTO.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .email("john@example.com")
                .program("Computer Science")
                .gpa(new BigDecimal("3.5"))
                .testScore(85)
                .status(Applicant.ApplicationStatus.PENDING)
                .build();
    }

    @Test
    void createApplicant_withValidData_returnsApplicantDTO() {
        // Arrange
        when(applicantRepository.existsByEmail(createDTO.getEmail())).thenReturn(false);
        when(applicantMapper.toEntity(createDTO)).thenReturn(applicant);
        when(applicantRepository.save(any(Applicant.class))).thenReturn(applicant);
        when(applicantMapper.toDTO(applicant)).thenReturn(applicantDTO);

        // Act
        ApplicantDTO result = applicantService.createApplicant(createDTO);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getEmail()).isEqualTo("john@example.com");
        verify(aiService).updateApplicantWithAIHint(any(Applicant.class));
        verify(applicantRepository).save(any(Applicant.class));
    }

    @Test
    void createApplicant_withDuplicateEmail_throwsException() {
        // Arrange
        when(applicantRepository.existsByEmail(createDTO.getEmail())).thenReturn(true);

        // Act & Assert
        assertThatThrownBy(() -> applicantService.createApplicant(createDTO))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("already exists");

        verify(applicantRepository, never()).save(any());
    }

    @Test
    void getApplicantById_withExistingId_returnsApplicantDTO() {
        // Arrange
        when(applicantRepository.findByIdAndNotDeleted(1L)).thenReturn(Optional.of(applicant));
        when(applicantMapper.toDTO(applicant)).thenReturn(applicantDTO);

        // Act
        ApplicantDTO result = applicantService.getApplicantById(1L);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
    }

    @Test
    void getApplicantById_withNonExistingId_throwsResourceNotFoundException() {
        // Arrange
        when(applicantRepository.findByIdAndNotDeleted(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> applicantService.getApplicantById(999L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("not found");
    }

    @Test
    void deleteApplicant_withExistingId_softDeletesApplicant() {
        // Arrange
        when(applicantRepository.findByIdAndNotDeleted(1L)).thenReturn(Optional.of(applicant));
        when(applicantRepository.save(any(Applicant.class))).thenReturn(applicant);

        // Act
        applicantService.deleteApplicant(1L);

        // Assert
        verify(applicantRepository).save(argThat(a -> a.getDeleted()));
    }
}
