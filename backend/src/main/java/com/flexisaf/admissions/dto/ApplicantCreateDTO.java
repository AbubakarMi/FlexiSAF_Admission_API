package com.flexisaf.admissions.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicantCreateDTO {

    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 100, message = "First name must be between 2 and 100 characters")
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(min = 2, max = 100, message = "Last name must be between 2 and 100 characters")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Program is required")
    @Size(min = 2, max = 200, message = "Program must be between 2 and 200 characters")
    private String program;

    @NotNull(message = "GPA is required")
    @DecimalMin(value = "0.0", message = "GPA must be at least 0.0")
    @DecimalMax(value = "5.0", message = "GPA must not exceed 5.0")
    @Digits(integer = 1, fraction = 2, message = "GPA must have at most 1 integer digit and 2 decimal places")
    private BigDecimal gpa;

    @NotNull(message = "Test score is required")
    @Min(value = 0, message = "Test score must be at least 0")
    @Max(value = 100, message = "Test score must not exceed 100")
    private Integer testScore;
}
