package com.flexisaf.admissions.service;

import com.flexisaf.admissions.entity.Student;
import com.flexisaf.admissions.exception.ResourceNotFoundException;
import com.flexisaf.admissions.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class StudentService {

    private final StudentRepository studentRepository;

    @Transactional(readOnly = true)
    public List<Student> getAllStudents() {
        log.info("Fetching all students");
        return studentRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Student getStudentById(Long id) {
        log.info("Fetching student with ID: {}", id);
        return studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", id));
    }

    @Transactional(readOnly = true)
    public Student getStudentByUserId(Long userId) {
        log.info("Fetching student with user ID: {}", userId);
        return studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "userId", userId));
    }

    @Transactional(readOnly = true)
    public List<Student> getStudentsByProgram(String program) {
        log.info("Fetching students for program: {}", program);
        return studentRepository.findByProgram(program);
    }

    @Transactional(readOnly = true)
    public List<Student> getStudentsByStatus(Student.Status status) {
        log.info("Fetching students with status: {}", status);
        return studentRepository.findByStatus(status);
    }

    @Transactional
    public Student createStudent(Student student) {
        log.info("Creating new student for user ID: {}", student.getUserId());

        // Check if student already exists for this user
        studentRepository.findByUserId(student.getUserId()).ifPresent(existing -> {
            throw new IllegalArgumentException("Student record already exists for user ID " + student.getUserId());
        });

        Student savedStudent = studentRepository.save(student);
        log.info("Successfully created student with ID: {}", savedStudent.getId());
        return savedStudent;
    }

    @Transactional
    public Student updateStudent(Long id, Student updatedStudent) {
        log.info("Updating student with ID: {}", id);

        Student existingStudent = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", id));

        // Update fields
        existingStudent.setProgram(updatedStudent.getProgram());
        existingStudent.setStatus(updatedStudent.getStatus());
        existingStudent.setGpa(updatedStudent.getGpa());
        existingStudent.setCreditsEarned(updatedStudent.getCreditsEarned());
        existingStudent.setCreditsRequired(updatedStudent.getCreditsRequired());
        existingStudent.setGraduationDate(updatedStudent.getGraduationDate());

        Student saved = studentRepository.save(existingStudent);
        log.info("Successfully updated student with ID: {}", id);
        return saved;
    }

    @Transactional
    public void deleteStudent(Long id) {
        log.info("Deleting student with ID: {}", id);

        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", id));

        studentRepository.delete(student);
        log.info("Successfully deleted student with ID: {}", id);
    }
}
