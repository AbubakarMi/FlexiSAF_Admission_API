package com.flexisaf.admissions.service;

import com.flexisaf.admissions.dto.AIHintDTO;
import com.flexisaf.admissions.entity.Applicant;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class AIService {

    private static final BigDecimal GPA_WEIGHT = new BigDecimal("40");
    private static final BigDecimal TEST_WEIGHT = new BigDecimal("60");
    private static final BigDecimal MAX_GPA = new BigDecimal("4.0");
    private static final BigDecimal MAX_TEST_SCORE = new BigDecimal("100");

    private static final BigDecimal ACCEPT_THRESHOLD = new BigDecimal("75");
    private static final BigDecimal REVIEW_THRESHOLD = new BigDecimal("60");

    /**
     * Generates AI-powered hint for an applicant based on GPA and test score.
     * Formula: (GPA / 4.0 * 40) + (testScore / 100 * 60)
     */
    public AIHintDTO generateHint(Applicant applicant) {
        BigDecimal aiScore = calculateScore(applicant.getGpa(), applicant.getTestScore());
        String recommendedStatus = determineRecommendedStatus(aiScore);
        String generatedNote = generateNote(aiScore, applicant);
        String reasoning = generateReasoning(applicant.getGpa(), applicant.getTestScore(), aiScore);

        return AIHintDTO.builder()
                .applicantId(applicant.getId())
                .aiScore(aiScore)
                .recommendedStatus(recommendedStatus)
                .generatedNote(generatedNote)
                .reasoning(reasoning)
                .build();
    }

    /**
     * Calculate weighted score from GPA and test score
     */
    public BigDecimal calculateScore(BigDecimal gpa, Integer testScore) {
        BigDecimal gpaScore = gpa.divide(MAX_GPA, 4, RoundingMode.HALF_UP)
                .multiply(GPA_WEIGHT);

        BigDecimal testScoreBD = new BigDecimal(testScore);
        BigDecimal testScoreWeighted = testScoreBD.divide(MAX_TEST_SCORE, 4, RoundingMode.HALF_UP)
                .multiply(TEST_WEIGHT);

        return gpaScore.add(testScoreWeighted)
                .setScale(2, RoundingMode.HALF_UP);
    }

    /**
     * Determine recommended status based on score
     */
    private String determineRecommendedStatus(BigDecimal score) {
        if (score.compareTo(ACCEPT_THRESHOLD) >= 0) {
            return "RECOMMENDED_ACCEPT";
        } else if (score.compareTo(REVIEW_THRESHOLD) >= 0) {
            return "RECOMMENDED_REVIEW";
        } else {
            return "RECOMMENDED_REJECT";
        }
    }

    /**
     * Generate template note based on score and applicant data with enhanced recommendations
     */
    private String generateNote(BigDecimal score, Applicant applicant) {
        if (score.compareTo(ACCEPT_THRESHOLD) >= 0) {
            return String.format(
                "Strongly recommend acceptance. Applicant demonstrates excellent academic performance " +
                "with a GPA of %.2f and test score of %d, indicating strong potential for success. " +
                "Strong candidate for admission to %s program. " +
                "Demonstrates consistent academic excellence.",
                applicant.getGpa(), applicant.getTestScore(), applicant.getProgram()
            );
        } else if (score.compareTo(REVIEW_THRESHOLD) >= 0) {
            return String.format(
                "Recommend further review. Applicant shows good academic standing with GPA of %.2f " +
                "and test score of %d. Consider additional factors such as extracurriculars, essays, " +
                "or interviews for final decision regarding %s program admission. " +
                "Holistic evaluation recommended.",
                applicant.getGpa(), applicant.getTestScore(), applicant.getProgram()
            );
        } else {
            return String.format(
                "Application may require additional review. While current metrics (GPA: %.2f, Test Score: %d) " +
                "are below threshold, consider holistic review of applicant's potential and circumstances " +
                "for %s program. May benefit from conditional admission, preparatory courses, " +
                "or reapplication after academic improvement.",
                applicant.getGpa(), applicant.getTestScore(), applicant.getProgram()
            );
        }
    }

    /**
     * Generate detailed reasoning for the score
     */
    private String generateReasoning(BigDecimal gpa, Integer testScore, BigDecimal finalScore) {
        BigDecimal gpaContribution = gpa.divide(MAX_GPA, 4, RoundingMode.HALF_UP)
                .multiply(GPA_WEIGHT)
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal testContribution = new BigDecimal(testScore)
                .divide(MAX_TEST_SCORE, 4, RoundingMode.HALF_UP)
                .multiply(TEST_WEIGHT)
                .setScale(2, RoundingMode.HALF_UP);

        return String.format(
            "Score Breakdown: GPA (%.2f/4.0) contributes %.2f points (40%% weight), " +
            "Test Score (%d/100) contributes %.2f points (60%% weight). " +
            "Total AI Score: %.2f/100",
            gpa, gpaContribution, testScore, testContribution, finalScore
        );
    }

    /**
     * Update applicant with AI hint (called internally by ApplicantService)
     */
    public void updateApplicantWithAIHint(Applicant applicant) {
        BigDecimal aiScore = calculateScore(applicant.getGpa(), applicant.getTestScore());
        String aiHint = determineRecommendedStatus(aiScore);

        applicant.setAiScore(aiScore);
        applicant.setAiHint(aiHint);
    }
}
