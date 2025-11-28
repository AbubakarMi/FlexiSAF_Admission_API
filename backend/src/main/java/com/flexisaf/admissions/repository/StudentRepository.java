package com.flexisaf.admissions.repository;

import com.flexisaf.admissions.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    @Query("SELECT s FROM Student s WHERE s.userId = :userId")
    Optional<Student> findByUserId(@Param("userId") Long userId);

    @Query("SELECT s FROM Student s WHERE s.program = :program")
    List<Student> findByProgram(@Param("program") String program);

    @Query("SELECT s FROM Student s WHERE s.status = :status")
    List<Student> findByStatus(@Param("status") Student.Status status);
}
