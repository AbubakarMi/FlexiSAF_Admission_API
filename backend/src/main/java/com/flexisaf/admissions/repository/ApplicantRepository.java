package com.flexisaf.admissions.repository;

import com.flexisaf.admissions.entity.Applicant;
import com.flexisaf.admissions.entity.Applicant.ApplicationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ApplicantRepository extends JpaRepository<Applicant, Long> {

    @Query("SELECT a FROM Applicant a WHERE a.deleted = false AND a.id = :id")
    Optional<Applicant> findByIdAndNotDeleted(@Param("id") Long id);

    @Query("SELECT a FROM Applicant a WHERE a.deleted = false")
    Page<Applicant> findAllNotDeleted(Pageable pageable);

    @Query("SELECT a FROM Applicant a WHERE a.deleted = false " +
           "AND (:email IS NULL OR LOWER(a.email) LIKE LOWER(CONCAT('%', :email, '%'))) " +
           "AND (:program IS NULL OR LOWER(a.program) LIKE LOWER(CONCAT('%', :program, '%'))) " +
           "AND (:status IS NULL OR a.status = :status)")
    Page<Applicant> searchApplicants(
        @Param("email") String email,
        @Param("program") String program,
        @Param("status") ApplicationStatus status,
        Pageable pageable
    );

    boolean existsByEmail(String email);

    @Query("SELECT COUNT(a) > 0 FROM Applicant a WHERE a.email = :email AND a.id != :id")
    boolean existsByEmailAndIdNot(@Param("email") String email, @Param("id") Long id);

    @Query("SELECT a FROM Applicant a WHERE a.deleted = false AND a.email = :email")
    Applicant findByEmail(@Param("email") String email);

    @Query("SELECT a FROM Applicant a WHERE a.deleted = false AND a.email = :email")
    Optional<Applicant> findByEmailAndNotDeleted(@Param("email") String email);
}
