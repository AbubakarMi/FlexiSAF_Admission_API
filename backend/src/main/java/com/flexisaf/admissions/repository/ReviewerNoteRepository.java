package com.flexisaf.admissions.repository;

import com.flexisaf.admissions.entity.ReviewerNote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewerNoteRepository extends JpaRepository<ReviewerNote, Long> {

    @Query("SELECT rn FROM ReviewerNote rn " +
           "JOIN FETCH rn.reviewer " +
           "WHERE rn.applicant.id = :applicantId " +
           "ORDER BY rn.createdAt DESC")
    List<ReviewerNote> findByApplicantIdOrderByCreatedAtDesc(@Param("applicantId") Long applicantId);

    @Query("SELECT COUNT(rn) FROM ReviewerNote rn WHERE rn.applicant.id = :applicantId")
    long countByApplicantId(@Param("applicantId") Long applicantId);
}
