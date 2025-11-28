package com.flexisaf.admissions.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "exams", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"course_id", "exam_type"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Exam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "course_id", nullable = false)
    private Long courseId;

    @Enumerated(EnumType.STRING)
    @Column(name = "exam_type", nullable = false, length = 20)
    private ExamType examType;

    @Column(nullable = false)
    private Boolean published = false;

    @Column(name = "exam_date")
    private LocalDateTime examDate;

    @Column(name = "duration_minutes")
    private Integer durationMinutes;

    @Column(columnDefinition = "TEXT")
    private String instructions;

    @Column(name = "total_marks")
    private Integer totalMarks = 100;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "published_at")
    private LocalDateTime publishedAt;

    @Column(name = "published_by")
    private Long publishedBy;

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
