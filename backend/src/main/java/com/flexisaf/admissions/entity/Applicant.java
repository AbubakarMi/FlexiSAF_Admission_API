package com.flexisaf.admissions.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "applicants", indexes = {
    @Index(name = "idx_email", columnList = "email"),
    @Index(name = "idx_program", columnList = "program"),
    @Index(name = "idx_status", columnList = "status"),
    @Index(name = "idx_deleted", columnList = "deleted")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Applicant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String firstName;

    @Column(nullable = false, length = 100)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, length = 200)
    private String program;

    @Column(nullable = false, precision = 3, scale = 2)
    private BigDecimal gpa;

    @Column(nullable = false)
    private Integer testScore;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ApplicationStatus status;

    @Column(length = 50)
    private String aiHint;

    @Column(precision = 5, scale = 2)
    private BigDecimal aiScore;

    @Column(nullable = false)
    @Builder.Default
    private Boolean deleted = false;

    @Version
    private Integer version;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public enum ApplicationStatus {
        PENDING,
        IN_REVIEW,
        ACCEPTED,
        REJECTED
    }
}
