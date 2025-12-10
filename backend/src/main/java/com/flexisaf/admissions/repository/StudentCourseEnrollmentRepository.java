package com.flexisaf.admissions.repository;

import com.flexisaf.admissions.entity.StudentCourseEnrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentCourseEnrollmentRepository extends JpaRepository<StudentCourseEnrollment, Long> {

    List<StudentCourseEnrollment> findByStudentId(Long studentId);

    List<StudentCourseEnrollment> findByCourseId(Long courseId);

    Optional<StudentCourseEnrollment> findByStudentIdAndCourseId(Long studentId, Long courseId);

    List<StudentCourseEnrollment> findByStudentIdAndStatus(Long studentId, StudentCourseEnrollment.EnrollmentStatus status);

    @Query("SELECT COUNT(e) FROM StudentCourseEnrollment e WHERE e.courseId = :courseId AND e.status = 'ENROLLED'")
    long countEnrolledStudentsByCourse(@Param("courseId") Long courseId);

    @Query("SELECT e FROM StudentCourseEnrollment e WHERE e.studentId = :studentId AND e.status = 'ENROLLED'")
    List<StudentCourseEnrollment> findActiveEnrollmentsByStudent(@Param("studentId") Long studentId);

    boolean existsByStudentIdAndCourseId(Long studentId, Long courseId);
}
