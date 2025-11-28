package com.flexisaf.admissions.repository;

import com.flexisaf.admissions.entity.Result;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResultRepository extends JpaRepository<Result, Long> {

    @Query("SELECT r FROM Result r WHERE r.studentId = :studentId")
    List<Result> findByStudentId(@Param("studentId") Long studentId);

    @Query("SELECT r FROM Result r WHERE r.courseId = :courseId")
    List<Result> findByCourseId(@Param("courseId") Long courseId);

    @Query("SELECT r FROM Result r WHERE r.studentId = :studentId AND r.courseId = :courseId")
    List<Result> findByStudentIdAndCourseId(@Param("studentId") Long studentId, @Param("courseId") Long courseId);

    @Query("SELECT r FROM Result r WHERE r.courseId = :courseId AND r.published = :published")
    List<Result> findByCourseIdAndPublished(@Param("courseId") Long courseId, @Param("published") Boolean published);
}
