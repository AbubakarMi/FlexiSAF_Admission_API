package com.flexisaf.admissions.controller;

import com.flexisaf.admissions.entity.Course;
import com.flexisaf.admissions.service.CourseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
@Tag(name = "Courses", description = "Course management endpoints")
public class CourseController {

    private final CourseService courseService;

    @GetMapping
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get all courses", description = "Retrieve a list of all courses")
    public ResponseEntity<List<Course>> getAllCourses() {
        List<Course> courses = courseService.getAllCourses();
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get course by ID", description = "Retrieve a specific course by its ID")
    public ResponseEntity<Course> getCourseById(
            @Parameter(description = "Course ID") @PathVariable Long id) {
        Course course = courseService.getCourseById(id);
        return ResponseEntity.ok(course);
    }

    @GetMapping("/program/{program}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get courses by program", description = "Retrieve all courses for a specific program")
    public ResponseEntity<List<Course>> getCoursesByProgram(
            @Parameter(description = "Program name") @PathVariable String program) {
        List<Course> courses = courseService.getCoursesByProgram(program);
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/active")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get active courses", description = "Retrieve all active courses")
    public ResponseEntity<List<Course>> getActiveCourses() {
        List<Course> courses = courseService.getActiveCourses();
        return ResponseEntity.ok(courses);
    }

    @PostMapping
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Create course", description = "Create a new course")
    public ResponseEntity<Course> createCourse(@Valid @RequestBody Course course) {
        Course createdCourse = courseService.createCourse(course);
        return new ResponseEntity<>(createdCourse, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Update course", description = "Update an existing course")
    public ResponseEntity<Course> updateCourse(
            @Parameter(description = "Course ID") @PathVariable Long id,
            @Valid @RequestBody Course course) {
        Course updatedCourse = courseService.updateCourse(id, course);
        return ResponseEntity.ok(updatedCourse);
    }

    @DeleteMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Delete course", description = "Delete a course by ID")
    public ResponseEntity<Void> deleteCourse(
            @Parameter(description = "Course ID") @PathVariable Long id) {
        courseService.deleteCourse(id);
        return ResponseEntity.noContent().build();
    }
}
