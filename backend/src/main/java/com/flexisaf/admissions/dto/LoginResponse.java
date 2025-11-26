package com.flexisaf.admissions.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {
    private String token;
    private String type = "Bearer";
    private String email;
    private String role;
    private String firstName;
    private String lastName;
}
