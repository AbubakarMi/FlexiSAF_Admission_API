package com.flexisaf.admissions.service;

import com.flexisaf.admissions.entity.Result;
import com.flexisaf.admissions.exception.ResourceNotFoundException;
import com.flexisaf.admissions.repository.ResultRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ResultService {

    private final ResultRepository resultRepository;

    @Transactional(readOnly = true)
    public List<Result> getResultsByCourseId(Long courseId) {
        log.info("Fetching results for course ID: {}", courseId);
        return resultRepository.findByCourseId(courseId);
    }

    @Transactional(readOnly = true)
    public List<Result> getResultsByStudentId(Long studentId) {
        log.info("Fetching results for student ID: {}", studentId);
        return resultRepository.findByStudentId(studentId);
    }

    @Transactional(readOnly = true)
    public List<Result> getResultsByStudentAndCourse(Long studentId, Long courseId) {
        log.info("Fetching results for student ID: {} and course ID: {}", studentId, courseId);
        return resultRepository.findByStudentIdAndCourseId(studentId, courseId);
    }

    @Transactional(readOnly = true)
    public Result getResultById(Long id) {
        log.info("Fetching result with ID: {}", id);
        return resultRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Result", "id", id));
    }

    @Transactional
    public List<Result> publishResultsForCourse(Long courseId, Long publishedBy) {
        log.info("Publishing results for course ID: {}", courseId);

        List<Result> results = resultRepository.findByCourseIdAndPublished(courseId, false);

        if (results.isEmpty()) {
            log.warn("No unpublished results found for course ID: {}", courseId);
            throw new IllegalStateException("No unpublished results found for this course");
        }

        results.forEach(result -> {
            result.setPublished(true);
            result.setPublishedAt(LocalDateTime.now());
            result.setPublishedBy(publishedBy);
        });

        List<Result> savedResults = resultRepository.saveAll(results);
        log.info("Successfully published {} results for course ID: {}", savedResults.size(), courseId);
        return savedResults;
    }

    @Transactional
    public List<Result> unpublishResultsForCourse(Long courseId) {
        log.info("Unpublishing results for course ID: {}", courseId);

        List<Result> results = resultRepository.findByCourseIdAndPublished(courseId, true);

        if (results.isEmpty()) {
            log.warn("No published results found for course ID: {}", courseId);
            throw new IllegalStateException("No published results found for this course");
        }

        results.forEach(result -> {
            result.setPublished(false);
            result.setPublishedAt(null);
            result.setPublishedBy(null);
        });

        List<Result> savedResults = resultRepository.saveAll(results);
        log.info("Successfully unpublished {} results for course ID: {}", savedResults.size(), courseId);
        return savedResults;
    }

    @Transactional
    public Result createResult(Result result) {
        log.info("Creating new result for student ID: {} and course ID: {}",
            result.getStudentId(), result.getCourseId());

        // Calculate overall score if not provided
        if (result.getOverallScore() == null) {
            result.setOverallScore(calculateOverallScore(result));
        }

        // Set grade based on overall score
        if (result.getGrade() == null) {
            result.setGrade(calculateGrade(result.getOverallScore()));
        }

        Result savedResult = resultRepository.save(result);
        log.info("Successfully created result with ID: {}", savedResult.getId());
        return savedResult;
    }

    @Transactional
    public Result updateResult(Long id, Result updatedResult) {
        log.info("Updating result with ID: {}", id);

        Result existingResult = resultRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Result", "id", id));

        // Update fields
        existingResult.setAssignmentsScore(updatedResult.getAssignmentsScore());
        existingResult.setTestsScore(updatedResult.getTestsScore());
        existingResult.setExamScore(updatedResult.getExamScore());

        // Recalculate overall score
        existingResult.setOverallScore(calculateOverallScore(existingResult));

        // Recalculate grade
        existingResult.setGrade(calculateGrade(existingResult.getOverallScore()));

        existingResult.setComments(updatedResult.getComments());
        existingResult.setGradedBy(updatedResult.getGradedBy());
        existingResult.setGradedAt(LocalDateTime.now());

        Result saved = resultRepository.save(existingResult);
        log.info("Successfully updated result with ID: {}", id);
        return saved;
    }

    @Transactional
    public void deleteResult(Long id) {
        log.info("Deleting result with ID: {}", id);

        Result result = resultRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Result", "id", id));

        resultRepository.delete(result);
        log.info("Successfully deleted result with ID: {}", id);
    }

    private Double calculateOverallScore(Result result) {
        double total = 0.0;
        int count = 0;

        if (result.getAssignmentsScore() != null) {
            total += result.getAssignmentsScore();
            count++;
        }
        if (result.getTestsScore() != null) {
            total += result.getTestsScore();
            count++;
        }
        if (result.getExamScore() != null) {
            total += result.getExamScore();
            count++;
        }

        return count > 0 ? total / count : 0.0;
    }

    private String calculateGrade(Double score) {
        if (score == null) return "F";
        if (score >= 90) return "A";
        if (score >= 80) return "B";
        if (score >= 70) return "C";
        if (score >= 60) return "D";
        return "F";
    }
}
