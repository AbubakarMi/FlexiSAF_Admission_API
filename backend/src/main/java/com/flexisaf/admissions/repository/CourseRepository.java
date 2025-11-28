package com.flexisaf.admissions.repository;

import com.flexisaf.admissions.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    @Query("SELECT c FROM Course c WHERE c.program = :program")
    List<Course> findByProgram(@Param("program") String program);

    @Query("SELECT c FROM Course c WHERE c.code = :code")
    Optional<Course> findByCode(@Param("code") String code);

    @Query("SELECT c FROM Course c WHERE c.active = true")
    List<Course> findByActiveTrue();
}
