package com.flexisaf.admissions.controller;

import com.flexisaf.admissions.dto.StudentDTO;
import com.flexisaf.admissions.entity.Student;
import com.flexisaf.admissions.service.StudentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class StudentController {

    private final StudentService studentService;

    @GetMapping
    public ResponseEntity<Page<StudentDTO>> getAllStudents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sort,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        log.info("GET /api/students - page: {}, size: {}, sort: {}, direction: {}", page, size, sort, direction);

        Sort.Direction sortDirection = "asc".equalsIgnoreCase(direction) ?
                Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sort));

        Page<StudentDTO> students = studentService.getAllStudentsWithUserInfo(pageable);
        return ResponseEntity.ok(students);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentDTO> getStudentById(@PathVariable Long id) {
        log.info("GET /api/students/{}", id);
        StudentDTO student = studentService.getStudentByIdWithUserInfo(id);
        return ResponseEntity.ok(student);
    }

    @GetMapping("/program/{program}")
    public ResponseEntity<List<StudentDTO>> getStudentsByProgram(@PathVariable String program) {
        log.info("GET /api/students/program/{}", program);
        List<StudentDTO> students = studentService.getStudentsByProgramWithUserInfo(program);
        return ResponseEntity.ok(students);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<StudentDTO>> getStudentsByStatus(@PathVariable String status) {
        log.info("GET /api/students/status/{}", status);
        Student.Status studentStatus = Student.Status.valueOf(status.toUpperCase());
        List<StudentDTO> students = studentService.getStudentsByStatusWithUserInfo(studentStatus);
        return ResponseEntity.ok(students);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Student> updateStudent(
            @PathVariable Long id,
            @RequestBody Student student
    ) {
        log.info("PUT /api/students/{}", id);
        Student updated = studentService.updateStudent(id, student);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{id}/suspend")
    public ResponseEntity<Student> suspendStudent(@PathVariable Long id) {
        log.info("POST /api/students/{}/suspend", id);
        Student student = studentService.getStudentById(id);
        student.setStatus(Student.Status.SUSPENDED);
        Student updated = studentService.updateStudent(id, student);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{id}/reactivate")
    public ResponseEntity<Student> reactivateStudent(@PathVariable Long id) {
        log.info("POST /api/students/{}/reactivate", id);
        Student student = studentService.getStudentById(id);
        student.setStatus(Student.Status.ACTIVE);
        Student updated = studentService.updateStudent(id, student);
        return ResponseEntity.ok(updated);
    }
}
