package com.flexisaf.admissions.service;

import com.flexisaf.admissions.entity.Exam;
import com.flexisaf.admissions.exception.ResourceNotFoundException;
import com.flexisaf.admissions.repository.ExamRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class ExamService {

    private final ExamRepository examRepository;

    @Transactional(readOnly = true)
    public List<Exam> getExamsByCourseId(Long courseId) {
        log.info("Fetching exams for course ID: {}", courseId);
        return examRepository.findByCourseId(courseId);
    }

    @Transactional(readOnly = true)
    public Exam getExamById(Long id) {
        log.info("Fetching exam with ID: {}", id);
        return examRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exam", "id", id));
    }

    @Transactional
    public Exam publishExam(Long examId, Long publishedBy) {
        log.info("Publishing exam with ID: {}", examId);

        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new ResourceNotFoundException("Exam", "id", examId));

        if (exam.getPublished()) {
            throw new IllegalStateException("Exam is already published");
        }

        exam.setPublished(true);
        exam.setPublishedAt(LocalDateTime.now());
        exam.setPublishedBy(publishedBy);

        Exam savedExam = examRepository.save(exam);
        log.info("Successfully published exam with ID: {}", examId);
        return savedExam;
    }

    @Transactional
    public Exam unpublishExam(Long examId) {
        log.info("Unpublishing exam with ID: {}", examId);

        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new ResourceNotFoundException("Exam", "id", examId));

        if (!exam.getPublished()) {
            throw new IllegalStateException("Exam is not published");
        }

        exam.setPublished(false);
        exam.setPublishedAt(null);
        exam.setPublishedBy(null);

        Exam savedExam = examRepository.save(exam);
        log.info("Successfully unpublished exam with ID: {}", examId);
        return savedExam;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getExamPublicationStatus(Long courseId) {
        log.info("Fetching exam publication status for course ID: {}", courseId);

        List<Exam> exams = examRepository.findByCourseId(courseId);

        boolean midtermPublished = false;
        boolean finalPublished = false;

        for (Exam exam : exams) {
            if (exam.getExamType() == Exam.ExamType.MIDTERM) {
                midtermPublished = exam.getPublished();
            } else if (exam.getExamType() == Exam.ExamType.FINAL) {
                finalPublished = exam.getPublished();
            }
        }

        return Map.of(
            "courseId", courseId,
            "midtermPublished", midtermPublished,
            "finalPublished", finalPublished
        );
    }

    @Transactional
    public Exam createExam(Exam exam) {
        log.info("Creating new exam for course ID: {}", exam.getCourseId());

        // Check if exam already exists for this course and exam type
        examRepository.findByCourseIdAndExamType(exam.getCourseId(), exam.getExamType()).ifPresent(existing -> {
            throw new IllegalArgumentException("Exam of type " + exam.getExamType() +
                " already exists for course ID " + exam.getCourseId());
        });

        Exam savedExam = examRepository.save(exam);
        log.info("Successfully created exam with ID: {}", savedExam.getId());
        return savedExam;
    }

    @Transactional
    public Exam updateExam(Long id, Exam updatedExam) {
        log.info("Updating exam with ID: {}", id);

        Exam existingExam = examRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exam", "id", id));

        // Update fields
        existingExam.setExamType(updatedExam.getExamType());
        existingExam.setExamDate(updatedExam.getExamDate());
        existingExam.setDurationMinutes(updatedExam.getDurationMinutes());
        existingExam.setInstructions(updatedExam.getInstructions());
        existingExam.setTotalMarks(updatedExam.getTotalMarks());

        Exam saved = examRepository.save(existingExam);
        log.info("Successfully updated exam with ID: {}", id);
        return saved;
    }
}
