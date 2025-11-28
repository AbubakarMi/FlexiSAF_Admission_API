package com.flexisaf.admissions.service;

import com.flexisaf.admissions.dto.StudentDTO;
import com.flexisaf.admissions.entity.Student;
import com.flexisaf.admissions.entity.User;
import com.flexisaf.admissions.exception.ResourceNotFoundException;
import com.flexisaf.admissions.repository.StudentRepository;
import com.flexisaf.admissions.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class StudentService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;

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

    // DTO Methods
    @Transactional(readOnly = true)
    public Page<StudentDTO> getAllStudentsWithUserInfo(Pageable pageable) {
        log.info("Fetching all students with user info (paginated)");
        Page<Student> studentPage = studentRepository.findAll(pageable);
        List<StudentDTO> dtoList = studentPage.getContent().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return new PageImpl<>(dtoList, pageable, studentPage.getTotalElements());
    }

    @Transactional(readOnly = true)
    public List<StudentDTO> getStudentsByStatusWithUserInfo(Student.Status status) {
        log.info("Fetching students with status {} and user info", status);
        List<Student> students = studentRepository.findByStatus(status);
        return students.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<StudentDTO> getStudentsByProgramWithUserInfo(String program) {
        log.info("Fetching students for program {} with user info", program);
        List<Student> students = studentRepository.findByProgram(program);
        return students.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public StudentDTO getStudentByIdWithUserInfo(Long id) {
        log.info("Fetching student with ID {} and user info", id);
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", id));
        return convertToDTO(student);
    }

    private StudentDTO convertToDTO(Student student) {
        User user = userRepository.findById(student.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", student.getUserId()));

        return StudentDTO.builder()
                .id(student.getId())
                .userId(student.getUserId())
                .studentId(student.getStudentId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .program(student.getProgram())
                .status(student.getStatus())
                .enrollmentDate(student.getEnrollmentDate())
                .graduationDate(student.getGraduationDate())
                .gpa(student.getGpa())
                .creditsEarned(student.getCreditsEarned())
                .creditsRequired(student.getCreditsRequired())
                .createdAt(student.getCreatedAt())
                .updatedAt(student.getUpdatedAt())
                .build();
    }
}
