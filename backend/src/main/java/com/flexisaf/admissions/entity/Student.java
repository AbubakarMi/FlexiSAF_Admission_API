package com.flexisaf.admissions.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "students")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    @Column(name = "applicant_id")
    private Long applicantId;

    @Column(name = "student_id", unique = true, length = 50)
    private String studentId;

    @Column(nullable = false, length = 100)
    private String program;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Status status = Status.ACTIVE;

    @Column(name = "enrollment_date", nullable = false)
    private LocalDateTime enrollmentDate;

    @Column(name = "graduation_date")
    private LocalDateTime graduationDate;

    @Column(nullable = false)
    private Double gpa = 0.0;

    @Column(name = "credits_earned")
    private Integer creditsEarned = 0;

    @Column(name = "credits_required")
    private Integer creditsRequired = 120;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (enrollmentDate == null) {
            enrollmentDate = LocalDateTime.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum Status {
        ACTIVE,
        SUSPENDED,
        GRADUATED,
        WITHDRAWN
    }
}
