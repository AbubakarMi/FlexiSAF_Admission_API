package com.flexisaf.admissions.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "results", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"student_id", "course_id", "exam_type"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Result {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "course_id", nullable = false)
    private Long courseId;

    @Enumerated(EnumType.STRING)
    @Column(name = "exam_type", nullable = false, length = 20)
    private ExamType examType;

    @Column(name = "assignments_score")
    private Double assignmentsScore;

    @Column(name = "tests_score")
    private Double testsScore;

    @Column(name = "exam_score")
    private Double examScore;

    @Column(name = "overall_score")
    private Double overallScore;

    @Column(length = 5)
    private String grade;

    @Column(nullable = false)
    private Boolean published = false;

    @Column(columnDefinition = "TEXT")
    private String comments;

    @Column(name = "graded_by")
    private Long gradedBy;

    @Column(name = "graded_at")
    private LocalDateTime gradedAt;

    @Column(name = "published_at")
    private LocalDateTime publishedAt;

    @Column(name = "published_by")
    private Long publishedBy;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum ExamType {
        MIDTERM,
        FINAL
    }
}
