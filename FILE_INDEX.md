# FlexiSAF Admissions System - Complete File Index

This document provides a complete index of all files in the project with descriptions.

## Root Directory Files

| File | Purpose |
|------|---------|
| `README.md` | Main project documentation with setup instructions and API examples |
| `SETUP_GUIDE.md` | Quick start guide for getting the system running |
| `PROJECT_SUMMARY.md` | Comprehensive overview of features, architecture, and design |
| `COLOR_SCHEME_GUIDE.md` | Detailed color palette and usage guidelines |
| `FILE_INDEX.md` | This file - complete project file listing |
| `.gitignore` | Git ignore rules for backend and frontend |

## Backend Directory Structure

### Configuration & Build Files

```
backend/
├── pom.xml                                    # Maven dependencies and build configuration
├── Dockerfile                                 # Docker container configuration
└── .mvn/wrapper/maven-wrapper.properties      # Maven wrapper configuration
```

### Source Code - Main Application

```
backend/src/main/java/com/flexisaf/admissions/
├── AdmissionsApplication.java                 # Spring Boot main application entry point
│
├── config/                                    # Configuration Classes
│   ├── SecurityConfig.java                    # Spring Security & JWT configuration
│   ├── CorsConfig.java                        # CORS policy configuration
│   └── OpenAPIConfig.java                     # Swagger/OpenAPI documentation setup
│
├── controller/                                # REST API Controllers
│   ├── ApplicantController.java              # Applicant CRUD endpoints
│   ├── ReviewerNoteController.java           # Reviewer notes endpoints
│   └── AuthController.java                   # Authentication endpoints
│
├── service/                                   # Business Logic Layer
│   ├── ApplicantService.java                 # Applicant business logic
│   ├── ReviewerNoteService.java              # Reviewer notes logic
│   ├── AIService.java                        # AI scoring and hints
│   ├── AuthService.java                      # Authentication logic
│   └── CustomUserDetailsService.java         # User details for Spring Security
│
├── repository/                                # Data Access Layer
│   ├── ApplicantRepository.java              # Applicant database queries
│   ├── ReviewerNoteRepository.java           # Reviewer notes queries
│   └── UserRepository.java                   # User/reviewer queries
│
├── entity/                                    # JPA Database Entities
│   ├── Applicant.java                        # Applicant entity (main data model)
│   ├── ReviewerNote.java                     # Reviewer note entity
│   └── User.java                             # User/reviewer entity
│
├── dto/                                       # Data Transfer Objects
│   ├── ApplicantDTO.java                     # Full applicant data transfer
│   ├── ApplicantCreateDTO.java               # Create applicant request
│   ├── ApplicantUpdateDTO.java               # Update applicant request
│   ├── ReviewerNoteDTO.java                  # Reviewer note transfer
│   ├── AIHintDTO.java                        # AI evaluation response
│   ├── LoginRequest.java                     # Login request
│   └── LoginResponse.java                    # Login response with JWT
│
├── mapper/                                    # Entity-DTO Mappers (MapStruct)
│   ├── ApplicantMapper.java                  # Applicant mapping logic
│   └── ReviewerNoteMapper.java               # Reviewer note mapping
│
├── security/                                  # Security Components
│   ├── JwtTokenProvider.java                 # JWT token generation/validation
│   └── JwtAuthenticationFilter.java          # JWT authentication filter
│
└── exception/                                 # Exception Handling
    ├── GlobalExceptionHandler.java            # Global exception handler (RFC 7807)
    ├── ResourceNotFoundException.java         # Custom not found exception
    └── ErrorResponse.java                     # Error response DTO
```

### Resources - Configuration & Migrations

```
backend/src/main/resources/
├── application.yml                            # Main application configuration
├── application-dev.yml                        # Development profile configuration
│
└── db/migration/                              # Flyway Database Migrations
    ├── V1__create_users_table.sql            # Create users table + default admin
    ├── V2__create_applicants_table.sql       # Create applicants table with indexes
    └── V3__create_reviewer_notes_table.sql   # Create reviewer notes table
```

### Test Files

```
backend/src/test/java/com/flexisaf/admissions/
├── service/
│   ├── AIServiceTest.java                     # AI algorithm unit tests
│   └── ApplicantServiceTest.java             # Applicant service unit tests
│
└── backend/src/test/resources/
    └── application-test.yml                   # Test configuration (H2 database)
```

## Frontend Directory Structure

### Configuration Files

```
frontend/
├── package.json                               # NPM dependencies and scripts
├── vite.config.js                            # Vite build configuration
├── tailwind.config.js                        # Tailwind CSS theme configuration
├── postcss.config.js                         # PostCSS configuration
├── .eslintrc.cjs                             # ESLint configuration
├── .env                                      # Environment variables (API URL)
├── .env.example                              # Environment template
└── index.html                                # HTML entry point
```

### Source Code

```
frontend/src/
├── main.jsx                                  # React application entry point
├── App.jsx                                   # Main app component with routing
├── index.css                                 # Global styles and Tailwind directives
│
├── components/                               # Reusable Components
│   ├── ApplicantTable.jsx                    # Applicants data table
│   ├── ReviewerNoteList.jsx                  # Notes list display
│   ├── StatusBadge.jsx                       # Status badge component
│   ├── SearchBar.jsx                         # Search/filter form
│   ├── Pagination.jsx                        # Pagination controls
│   └── PrivateRoute.jsx                      # Protected route wrapper
│
├── pages/                                    # Page Components
│   ├── ApplicantForm.jsx                     # Public application form
│   ├── Login.jsx                             # Reviewer login page
│   ├── Dashboard.jsx                         # Reviewer dashboard
│   └── ApplicantDetails.jsx                  # Applicant details view
│
├── services/                                 # API Integration Layer
│   ├── api.js                                # Axios instance with interceptors
│   ├── applicantService.js                   # Applicant API calls
│   ├── reviewerNoteService.js                # Reviewer notes API calls
│   └── authService.js                        # Authentication API calls
│
├── context/                                  # React Context
│   └── AuthContext.jsx                       # Authentication context provider
│
└── utils/                                    # Utility Functions
    ├── constants.js                          # Application constants
    └── formatters.js                         # Date/number formatting utilities
```

## File Count Summary

### Backend
- **Java Source Files:** 32
- **Configuration Files:** 4
- **Migration Scripts:** 3
- **Test Files:** 3
- **Total Backend:** 42 files

### Frontend
- **React Components:** 6
- **Pages:** 4
- **Services:** 4
- **Configuration Files:** 7
- **Utilities:** 3
- **Total Frontend:** 24 files

### Documentation
- **Guides & Documentation:** 5 files

### Grand Total
**71 files** of production-ready, documented code

## Quick Navigation Guide

### Starting Points

**To understand the project:**
1. Start with `README.md`
2. Read `SETUP_GUIDE.md` to get it running
3. Review `PROJECT_SUMMARY.md` for architecture

**To explore the backend:**
1. Start with `AdmissionsApplication.java`
2. Check `controller/` for API endpoints
3. Review `service/` for business logic
4. Look at `entity/` for data models

**To explore the frontend:**
1. Start with `App.jsx` for routing
2. Check `pages/` for main screens
3. Review `services/` for API integration
4. Look at `components/` for reusable parts

**To understand the AI:**
1. Read `service/AIService.java` for the algorithm
2. Check `dto/AIHintDTO.java` for response format
3. Review `ApplicantDetails.jsx` for UI integration

**To understand security:**
1. Start with `config/SecurityConfig.java`
2. Review `security/JwtTokenProvider.java`
3. Check `AuthService.java` for login logic
4. Look at `context/AuthContext.jsx` for frontend

**To understand the database:**
1. Review migration files in `db/migration/`
2. Check entity classes in `entity/`
3. Look at repository interfaces in `repository/`

## File Dependencies

### High-Level Flow

```
Frontend (React)
    ↓ HTTP/Axios
Backend Controllers
    ↓ Service Layer
Business Logic (Services)
    ↓ Repository Layer
Database (PostgreSQL via JPA)
```

### Key Dependency Chains

**User Login:**
```
Login.jsx → authService.js → AuthController.java
    → AuthService.java → UserRepository → Database
    → JwtTokenProvider → JWT Token
```

**Create Applicant:**
```
ApplicantForm.jsx → applicantService.js → ApplicantController.java
    → ApplicantService.java → AIService.java (calculate score)
    → ApplicantRepository → Database
```

**View Applicant Details:**
```
ApplicantDetails.jsx
    → applicantService.js → ApplicantController.java → ApplicantService.java
    → reviewerNoteService.js → ReviewerNoteController.java → ReviewerNoteService.java
    → Multiple database queries
```

## Configuration Dependencies

### Backend Configuration Chain
```
application.yml (base config)
    ├── Database connection
    ├── JWT settings
    └── Logging levels

application-dev.yml (dev overrides)
    └── Enhanced logging

pom.xml
    ├── Spring Boot dependencies
    ├── Database drivers
    ├── Security libraries
    └── Testing frameworks
```

### Frontend Configuration Chain
```
package.json
    ├── React & dependencies
    └── Build scripts

vite.config.js
    ├── Development server
    └── Proxy to backend

tailwind.config.js
    └── Custom color palette

.env
    └── API base URL
```

## Modified vs Generated Files

### Files You Should Modify

**Backend:**
- `application.yml` - Database credentials, JWT secret
- `migration/V*.sql` - Only for schema changes
- Service files - Business logic customization
- `AIService.java` - Algorithm tuning

**Frontend:**
- `.env` - API URL configuration
- `tailwind.config.js` - Color scheme
- Page components - UI customization
- `constants.js` - Application constants

### Files You Shouldn't Modify

**Backend:**
- `pom.xml` (unless adding dependencies)
- Mapper interfaces (auto-generated)
- `AdmissionsApplication.java`

**Frontend:**
- `vite.config.js` (unless necessary)
- `postcss.config.js`
- `.eslintrc.cjs`

## Finding Specific Features

| Feature | Backend File | Frontend File |
|---------|--------------|---------------|
| AI Scoring | `service/AIService.java` | `pages/ApplicantDetails.jsx` |
| Login | `controller/AuthController.java` | `pages/Login.jsx` |
| Search | `controller/ApplicantController.java` | `components/SearchBar.jsx` |
| Pagination | `repository/ApplicantRepository.java` | `components/Pagination.jsx` |
| Status Change | `service/ApplicantService.java` | `pages/ApplicantDetails.jsx` |
| Add Notes | `controller/ReviewerNoteController.java` | `pages/ApplicantDetails.jsx` |
| Validation | DTOs in `dto/` | Form components in `pages/` |
| Error Handling | `exception/GlobalExceptionHandler.java` | `services/api.js` |

---

**Use this index to quickly navigate the codebase and understand the project structure!** 📂
