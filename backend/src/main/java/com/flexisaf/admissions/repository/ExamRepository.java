package com.flexisaf.admissions.repository;

import com.flexisaf.admissions.entity.Exam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExamRepository extends JpaRepository<Exam, Long> {

    @Query("SELECT e FROM Exam e WHERE e.courseId = :courseId")
    List<Exam> findByCourseId(@Param("courseId") Long courseId);

    @Query("SELECT e FROM Exam e WHERE e.courseId = :courseId AND e.examType = :examType")
    Optional<Exam> findByCourseIdAndExamType(@Param("courseId") Long courseId, @Param("examType") Exam.ExamType examType);
}
