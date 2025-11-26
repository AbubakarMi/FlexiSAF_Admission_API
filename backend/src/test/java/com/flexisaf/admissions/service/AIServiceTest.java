package com.flexisaf.admissions.service;

import com.flexisaf.admissions.dto.AIHintDTO;
import com.flexisaf.admissions.entity.Applicant;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;

class AIServiceTest {

    private AIService aiService;

    @BeforeEach
    void setUp() {
        aiService = new AIService();
    }

    @Test
    void calculateScore_withPerfectGPAAndTestScore_returns100() {
        // Arrange
        BigDecimal gpa = new BigDecimal("4.0");
        Integer testScore = 100;

        // Act
        BigDecimal score = aiService.calculateScore(gpa, testScore);

        // Assert
        assertThat(score).isEqualByComparingTo(new BigDecimal("100.00"));
    }

    @Test
    void calculateScore_withAverageGPAAndTestScore_returnsCorrectScore() {
        // Arrange
        BigDecimal gpa = new BigDecimal("3.0");
        Integer testScore = 75;

        // Act
        BigDecimal score = aiService.calculateScore(gpa, testScore);

        // Assert
        // (3.0/4.0 * 40) + (75/100 * 60) = 30 + 45 = 75
        assertThat(score).isEqualByComparingTo(new BigDecimal("75.00"));
    }

    @Test
    void generateHint_withHighScore_recommendsAccept() {
        // Arrange
        Applicant applicant = Applicant.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .email("john@example.com")
                .program("Computer Science")
                .gpa(new BigDecimal("3.8"))
                .testScore(90)
                .build();

        // Act
        AIHintDTO hint = aiService.generateHint(applicant);

        // Assert
        assertThat(hint.getRecommendedStatus()).isEqualTo("RECOMMENDED_ACCEPT");
        assertThat(hint.getAiScore()).isGreaterThanOrEqualTo(new BigDecimal("75"));
        assertThat(hint.getGeneratedNote()).contains("Excellent academic performance");
    }

    @Test
    void generateHint_withMediumScore_recommendsReview() {
        // Arrange
        Applicant applicant = Applicant.builder()
                .id(1L)
                .firstName("Jane")
                .lastName("Smith")
                .email("jane@example.com")
                .program("Engineering")
                .gpa(new BigDecimal("3.0"))
                .testScore(70)
                .build();

        // Act
        AIHintDTO hint = aiService.generateHint(applicant);

        // Assert
        assertThat(hint.getRecommendedStatus()).isEqualTo("RECOMMENDED_REVIEW");
        assertThat(hint.getAiScore()).isBetween(new BigDecimal("60"), new BigDecimal("74.99"));
        assertThat(hint.getGeneratedNote()).contains("further review");
    }

    @Test
    void generateHint_withLowScore_recommendsReject() {
        // Arrange
        Applicant applicant = Applicant.builder()
                .id(1L)
                .firstName("Bob")
                .lastName("Johnson")
                .email("bob@example.com")
                .program("Mathematics")
                .gpa(new BigDecimal("2.0"))
                .testScore(50)
                .build();

        // Act
        AIHintDTO hint = aiService.generateHint(applicant);

        // Assert
        assertThat(hint.getRecommendedStatus()).isEqualTo("RECOMMENDED_REJECT");
        assertThat(hint.getAiScore()).isLessThan(new BigDecimal("60"));
        assertThat(hint.getGeneratedNote()).contains("below typical admission standards");
    }

    @Test
    void updateApplicantWithAIHint_updatesApplicantFields() {
        // Arrange
        Applicant applicant = Applicant.builder()
                .gpa(new BigDecimal("3.5"))
                .testScore(85)
                .build();

        // Act
        aiService.updateApplicantWithAIHint(applicant);

        // Assert
        assertThat(applicant.getAiScore()).isNotNull();
        assertThat(applicant.getAiHint()).isNotNull();
        assertThat(applicant.getAiHint()).isEqualTo("RECOMMENDED_ACCEPT");
    }
}
