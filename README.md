# FlexiSAF Admission System

A comprehensive full-stack web application for managing student admissions, enrollment, and academic lifecycle in educational institutions.

## 📋 Project Documentation

**Detailed Project Specification**: [View on Google Docs](https://docs.google.com/document/d/17uneXsLTv2uuFnLsxdZpuwHZ6XkP9fI1BX3k6qYk9AA/edit?usp=sharing)

## 🎯 Project Overview

FlexiSAF Admission System is an enterprise-grade application that streamlines the entire student lifecycle from initial application to graduation. The system features role-based access control, automated enrollment workflows, AI-assisted application review, and comprehensive student management capabilities.

### Key Capabilities

- **Student Self-Service**: Registration, application submission, and status tracking
- **Administrative Review**: Multi-criteria evaluation system with AI recommendations
- **Enrollment Management**: Automated student creation upon acceptance
- **Academic Tracking**: Course enrollment, grades, payments, and examinations
- **Analytics & Reporting**: Comprehensive dashboards and data export

## 🏗️ Architecture

### Technology Stack

#### Backend
- **Java 17** with **Spring Boot 3.2.0**
- **Spring Security** + **JWT** for authentication
- **Spring Data JPA** + **Hibernate** for ORM
- **PostgreSQL** for data persistence
- **Maven** for build management
- **Lombok** for code generation
- **SpringDoc OpenAPI** for API documentation

#### Frontend
- **React 18** with **Vite**
- **React Router DOM** for routing
- **Context API** for state management
- **Axios** for HTTP requests

#### DevOps
- **Docker** with multi-stage builds
- **Render.com** for cloud hosting
- **Git** for version control

## 📊 Database Schema & Entity Relationships

### Entity Relationship Diagram

```
┌─────────────┐
│    User     │
│─────────────│
│ id (PK)     │──────┐
│ email       │      │
│ password    │      │
│ firstName   │      │
│ lastName    │      │
│ role        │      │ One-to-One
│ createdAt   │      │
│ updatedAt   │      │
└─────────────┘      │
                     │
                     ▼
              ┌─────────────┐
              │  Applicant  │
              │─────────────│
              │ id (PK)     │──────┐
              │ firstName   │      │
              │ lastName    │      │
              │ email       │      │
              │ program     │      │ One-to-One
              │ gpa         │      │ (on ACCEPTED)
              │ testScore   │      │
              │ status      │      │
              │ aiHint      │      │
              │ aiScore     │      │
              │ deleted     │      │
              │ createdAt   │      │
              │ updatedAt   │      │
              └─────────────┘      │
                                   │
                                   ▼
                            ┌─────────────┐
                            │   Student   │
                            │─────────────│
                            │ id (PK)     │──────┐
                            │ userId (FK) │      │
                            │ applicantId │      │
                            │ studentId   │      │
                            │ program     │      │ One-to-Many
                            │ status      │      │
                            │ gpa         │      │
                            │ enrollDate  │      │
                            │ gradDate    │      │
                            │ credits     │      │
                            │ createdAt   │      │
                            └─────────────┘      │
                                                 │
                                                 ▼
                                    ┌──────────────────────────┐
                                    │ StudentCourseEnrollment  │
                                    │──────────────────────────│
                                    │ id (PK)                  │
                                    │ studentId (FK)           │
                                    │ courseId (FK)            │
                                    │ status                   │
                                    │ enrolledDate             │
                                    │ droppedDate              │
                                    │ createdAt                │
                                    │ updatedAt                │
                                    └──────────────────────────┘
```

### Entity Details

#### 1. **User** Entity
**Purpose**: Authentication and user management

**Fields**:
- `id` (PK): Unique identifier
- `email`: Unique login credential
- `password`: BCrypt hashed password
- `firstName`, `lastName`: User names
- `role`: Enum (STUDENT, REVIEWER, ADMIN)
- `createdAt`, `updatedAt`: Audit timestamps

**Relationships**:
- One-to-One with `Student` (via userId)
- Users with STUDENT role can become Students after acceptance

**Business Rules**:
- Email must be unique across all users
- Password is BCrypt encrypted with strength 10
- Role determines system access permissions

---

#### 2. **Applicant** Entity
**Purpose**: Application submissions and review workflow

**Fields**:
- `id` (PK): Unique identifier
- `firstName`, `lastName`, `email`: Applicant details
- `program`: Desired program of study
- `gpa`: Academic GPA (0.00-5.00, weighted 40%)
- `testScore`: Entrance test score (0-100, weighted 60%)
- `status`: Enum (PENDING, IN_REVIEW, ACCEPTED, REJECTED)
- `aiHint`: AI-generated recommendation
- `aiScore`: Calculated admission score
- `deleted`: Soft delete flag
- `version`: Optimistic locking version
- `createdAt`, `updatedAt`: Audit timestamps

**Indexes**:
- `idx_email`: Fast email lookups
- `idx_program`: Program-based filtering
- `idx_status`: Status-based queries
- `idx_deleted`: Soft delete filtering

**Relationships**:
- Created when User submits application
- One-to-One with `Student` when status = ACCEPTED

**Business Rules**:
- Admission Score = (GPA × 0.4) + (Test Score × 0.6)
- AI Hint Logic:
  - Score ≥ 75: "RECOMMENDED_ACCEPT"
  - Score 60-74: "RECOMMENDED_REVIEW"
  - Score < 60: "RECOMMENDED_REJECT"
- Soft delete prevents hard deletion of records
- Email must be unique across all applicants
- Optimistic locking prevents concurrent update conflicts

---

#### 3. **Student** Entity
**Purpose**: Enrolled student records and academic tracking

**Fields**:
- `id` (PK): Unique identifier
- `userId` (FK): References User.id (mandatory)
- `applicantId`: References original Applicant (optional)
- `studentId`: Institution student ID (auto-generated)
- `program`: Enrolled program
- `status`: Enum (ACTIVE, SUSPENDED, GRADUATED, WITHDRAWN)
- `gpa`: Current cumulative GPA
- `enrollmentDate`: Date of enrollment
- `graduationDate`: Expected/actual graduation date
- `creditsEarned`: Total credits completed
- `creditsRequired`: Credits needed for graduation (default: 120)
- `createdAt`, `updatedAt`: Audit timestamps

**Relationships**:
- One-to-One with `User` (mandatory, via userId)
- One-to-One with `Applicant` (optional, via applicantId)
- One-to-Many with `StudentCourseEnrollment`

**Business Rules**:
- Created automatically when Applicant status changes to ACCEPTED
- StudentId format: `YEAR-PROGRAM-SEQUENCE` (e.g., 2025-CS-001)
- Initial GPA is copied from Applicant.gpa
- Default status is ACTIVE
- Default credits required is 120
- Cannot have multiple Student records for same userId

---

#### 4. **StudentCourseEnrollment** Entity
**Purpose**: Track individual course registrations and progress

**Fields**:
- `id` (PK): Unique identifier
- `studentId` (FK): References Student.id
- `courseId` (FK): References Course.id
- `status`: Enum (ENROLLED, DROPPED, COMPLETED, FAILED)
- `enrolledDate`: Course enrollment date
- `droppedDate`: Course drop date (if applicable)
- `createdAt`, `updatedAt`: Audit timestamps

**Constraints**:
- Unique constraint on (studentId, courseId)
- Prevents duplicate course enrollments

**Relationships**:
- Many-to-One with `Student`
- Many-to-One with `Course` (not fully implemented)

**Business Rules**:
- Students cannot enroll in same course twice (unless dropped/failed)
- Default status is ENROLLED
- Drop date is null until course is dropped
- Completed status contributes to student's credits earned

---

### Data Flow Diagram

```
1. REGISTRATION PHASE
   User registers → User record created (role=STUDENT) → Can login

2. APPLICATION PHASE
   Student logs in → Submits application → Applicant record created (status=PENDING)

3. REVIEW PHASE
   Reviewer logs in → Views applications → AI score calculated
   → Updates status (PENDING → IN_REVIEW → ACCEPTED/REJECTED)

4. ENROLLMENT PHASE (Automatic)
   Applicant status → ACCEPTED
   → StudentService triggered
   → Student record created (userId, applicantId, program, gpa)
   → Student ID generated
   → User can access Student Portal

5. COURSE REGISTRATION PHASE
   Student logs in → Views available courses
   → Enrolls in courses
   → StudentCourseEnrollment records created

6. ACADEMIC TRACKING
   Courses completed → Credits earned updated
   → GPA recalculated
   → Progress toward graduation tracked
```

## 🔐 Authentication & Authorization

### Authentication Flow

1. **Student Registration**:
   ```
   POST /api/auth/register
   → Validates email uniqueness
   → Creates User with role=STUDENT
   → Returns success message
   → User can now login
   ```

2. **Login**:
   ```
   POST /api/auth/login
   → Validates credentials against BCrypt hash
   → Generates JWT token (24-hour expiry)
   → Returns token + user details (email, role, firstName, lastName)
   ```

3. **Protected Requests**:
   ```
   Authorization: Bearer <JWT_TOKEN>
   → Token validated by JwtAuthenticationFilter
   → User details extracted from token claims
   → Role-based access control applied via SecurityFilterChain
   → Request processed if authorized
   ```

### User Roles & Permissions

#### STUDENT
**Can**:
- Register and login
- Submit applications
- View own application status
- Access student portal (after enrollment)
- Enroll in courses
- View grades and payments
- View academic calendar

**Cannot**:
- View other students' data
- Access reviewer dashboard
- Modify system settings

#### REVIEWER
**Can**:
- Login with provided credentials
- View all applications
- Review and evaluate applications
- Update application status
- Add reviewer notes
- Generate reports
- Use application comparison tool

**Cannot**:
- Register (must be created by admin)
- Modify system settings
- Create other reviewer accounts

#### ADMIN
**Can**:
- All REVIEWER permissions
- Create reviewer accounts via API
- Manage system settings
- Access analytics dashboard
- Perform database maintenance
- View system logs
- Export comprehensive reports

## 🚀 Getting Started

### Prerequisites

- **Java 17** or higher
- **Maven 3.8+**
- **Node.js 18+** and npm
- **PostgreSQL 14+**
- **Docker** (optional, for containerized deployment)

### Local Development Setup

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd "FlexiSAF Admission API"
```

#### 2. Database Setup

```sql
-- Create database
CREATE DATABASE flexisaf_admission_db;

-- Create user (if needed)
CREATE USER flexisaf_user WITH PASSWORD 'your_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE flexisaf_admission_db TO flexisaf_user;
```

#### 3. Backend Setup

```bash
cd backend

# Configure database in application.yml
# spring.datasource.url=jdbc:postgresql://localhost:5432/flexisaf_admission_db
# spring.datasource.username=flexisaf_user
# spring.datasource.password=your_password

# Build the application
mvn clean install

# Run the application
mvn spring-boot:run
```

Backend will start on `http://localhost:8080`

API Documentation: `http://localhost:8080/swagger-ui.html`

#### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure API URL in .env
VITE_API_BASE_URL=http://localhost:8080/api

# Start development server
npm run dev
```

Frontend will start on `http://localhost:5173`

### Environment Variables

#### Backend (application.yml / application-prod.yml)

```yaml
spring:
  datasource:
    url: ${DATABASE_URL:jdbc:postgresql://localhost:5432/flexisaf_admission_db}
    username: ${DATABASE_USERNAME:flexisaf_user}
    password: ${DATABASE_PASSWORD:your_password}
  jpa:
    hibernate:
      ddl-auto: update
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
jwt:
  secret: ${JWT_SECRET:your-secret-key-min-256-bits}
  expiration: 86400000  # 24 hours
```

#### Frontend (.env)

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## 🐳 Docker Deployment

### Build Docker Image

```bash
docker build -t flexisaf-admission-api .
```

### Run Container

```bash
docker run -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=prod \
  -e DATABASE_URL=jdbc:postgresql://host/db \
  -e DATABASE_USERNAME=user \
  -e DATABASE_PASSWORD=pass \
  -e JWT_SECRET=your-secret-key \
  flexisaf-admission-api
```

### Docker Compose

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: flexisaf_admission_db
      POSTGRES_USER: flexisaf_user
      POSTGRES_PASSWORD: your_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: .
    ports:
      - "8080:8080"
    environment:
      SPRING_PROFILES_ACTIVE: prod
      DATABASE_URL: jdbc:postgresql://postgres:5432/flexisaf_admission_db
      DATABASE_USERNAME: flexisaf_user
      DATABASE_PASSWORD: your_password
    depends_on:
      - postgres

volumes:
  postgres_data:
```

## ☁️ Production Deployment (Render.com)

### Current Deployment

- **Backend URL**: https://flexisaf-admission-api-backend.onrender.com
- **Database**: PostgreSQL on Render
- **Deployment**: Automatic on git push to main branch

### Setup Instructions

1. **Create PostgreSQL Database on Render**
   - Go to Render Dashboard
   - Create new PostgreSQL database
   - Copy connection credentials

2. **Create Web Service**
   - Connect GitHub repository
   - Set build command: Maven build via Docker
   - Set start command: Java with Spring profiles

3. **Configure Environment Variables**
   ```
   SPRING_PROFILES_ACTIVE=prod
   DATABASE_URL=jdbc:postgresql://host:port/database
   DATABASE_USERNAME=username
   DATABASE_PASSWORD=password
   JWT_SECRET=production-secret-key
   PORT=8080
   ```

4. **Deploy**
   - Push to main branch
   - Render automatically builds and deploys
   - Monitor logs for deployment status

## 📡 API Endpoints

### Public Endpoints

```
POST   /api/auth/register                        # Student registration
POST   /api/auth/login                           # User login
POST   /api/admin/create-reviewer                # Create reviewer account
POST   /api/admin/cleanup-empty-applicants       # Database maintenance
GET    /swagger-ui.html                          # API documentation
GET    /v3/api-docs                              # OpenAPI spec
```

### Protected Endpoints (Requires JWT)

#### Student Endpoints
```
POST   /api/applicants                           # Submit application
GET    /api/applicants/me                        # Get my application
GET    /enrolled/courses                         # View enrolled courses
POST   /enrolled/courses                         # Enroll in course
GET    /enrolled/grades                          # View grades
GET    /enrolled/payments                        # View payments
GET    /enrolled/calendar                        # View academic calendar
GET    /enrolled/exams                           # View exams
```

#### Reviewer/Admin Endpoints
```
GET    /api/applicants                           # List all applications
GET    /api/applicants/{id}                      # View application details
PUT    /api/applicants/{id}/status               # Update application status
GET    /api/applicants/compare                   # Compare applications
POST   /api/students                             # Manual student creation
GET    /api/students                             # List all students
GET    /dashboard/analytics                      # View analytics
POST   /dashboard/export                         # Export reports
GET    /dashboard/exams                          # Exam control
POST   /dashboard/results                        # Publish results
```

## 🔄 Application Workflow

### Complete User Journey

#### 1. Student Registration & Application

```
Student visits website
  ↓
Clicks "Register" → Fills registration form
  ↓
POST /api/auth/register
  → Validates: email uniqueness, password strength
  → Creates User (role=STUDENT, password=BCrypt(password))
  → Returns success message
  ↓
Student clicks "Login" → Enters credentials
  ↓
POST /api/auth/login
  → Validates: email exists, password matches
  → Generates JWT token (24h expiry)
  → Returns: {token, email, role, firstName, lastName}
  ↓
Student navigates to "Submit Application"
  ↓
Fills application form: program, GPA, test score
  ↓
POST /api/applicants (Authorization: Bearer TOKEN)
  → Validates: token, required fields
  → Extracts email from JWT token
  → Creates Applicant (status=PENDING, aiScore calculated)
  → Returns: Application submitted successfully
  ↓
Student can view application status anytime
```

#### 2. Administrative Review Process

```
Reviewer logs in
  ↓
POST /api/auth/login (admin@flexisaf.com)
  → Validates credentials
  → Returns JWT token with role=REVIEWER
  ↓
GET /api/applicants (Authorization: Bearer TOKEN)
  → Returns list of all applications
  → Shows: name, program, GPA, test score, aiScore, status
  ↓
Reviewer clicks on applicant to view details
  ↓
GET /api/applicants/{id}
  → Returns full applicant details
  → Shows AI recommendation (aiHint)
  → Displays calculated aiScore
  ↓
Reviewer makes decision
  ↓
PUT /api/applicants/{id}/status (status=ACCEPTED)
  → Validates: token has REVIEWER/ADMIN role
  → Updates Applicant.status = ACCEPTED
  → TRIGGERS StudentService.createStudentFromApplicant()
    ↓
    Creates Student record:
      - userId = from Applicant.email → User.id
      - applicantId = Applicant.id
      - studentId = generateStudentId() (e.g., 2025-CS-001)
      - program = Applicant.program
      - gpa = Applicant.gpa.doubleValue()
      - status = ACTIVE
      - enrollmentDate = now()
      - creditsRequired = 120
    ↓
  → Returns: Application accepted, student created
```

#### 3. Student Enrollment & Course Registration

```
Student logs in again
  ↓
System checks: User has corresponding Student record?
  ↓
YES → Redirect to Student Portal
  ↓
Student views available courses
  ↓
GET /enrolled/courses (Authorization: Bearer TOKEN)
  → Returns list of available courses
  ↓
Student clicks "Enroll" on desired course
  ↓
POST /enrolled/courses (courseId=123)
  → Validates: student not already enrolled
  → Creates StudentCourseEnrollment:
      - studentId = from JWT token → Student.id
      - courseId = 123
      - status = ENROLLED
      - enrolledDate = now()
  → Returns: Enrolled successfully
  ↓
Student can view enrolled courses anytime
```

## 🛠️ Database Maintenance

### Clean Up Empty Applicants

If empty applicant records exist from registration bug:

```bash
# After deploying latest code with fix
curl -X POST https://flexisaf-admission-api-backend.onrender.com/api/admin/cleanup-empty-applicants
```

### Create Reviewer Account

```bash
curl -X POST https://flexisaf-admission-api-backend.onrender.com/api/admin/create-reviewer \
  -H "Content-Type: application/json" \
  -d '{
    "email":"reviewer@institution.edu",
    "password":"SecurePass123!"
  }'
```

## 👥 Default Accounts

### Admin/Reviewer Account
- **Email**: admin@flexisaf.com
- **Password**: admin123
- **Role**: REVIEWER
- **Access**: Full dashboard and review capabilities

⚠️ **IMPORTANT**: Change password immediately after first login in production!

## 🧪 Testing

### Run Backend Tests

```bash
cd backend

# Run unit tests
mvn test

# Run integration tests
mvn verify

# Run with coverage
mvn test jacoco:report
```

### Test Coverage

- Controller tests: REST endpoint validation
- Service tests: Business logic verification
- Repository tests: Database operations
- Integration tests: End-to-end workflows

### Manual Testing with Swagger

Visit `http://localhost:8080/swagger-ui.html` for interactive API testing.

## 📈 Features

### Implemented Features

- ✅ User registration with email validation
- ✅ JWT-based authentication
- ✅ Role-based access control (STUDENT, REVIEWER, ADMIN)
- ✅ Application submission and tracking
- ✅ AI-powered admission scoring
- ✅ Administrative review dashboard
- ✅ Automated student creation on acceptance
- ✅ Course enrollment system
- ✅ Payment tracking
- ✅ Grade management
- ✅ Examination system
- ✅ Analytics and reporting
- ✅ Export functionality
- ✅ Announcement system
- ✅ Database optimization with indexes
- ✅ Soft delete for data retention
- ✅ Optimistic locking for concurrency
- ✅ Docker containerization
- ✅ Production deployment on Render.com

### Roadmap

- ⬜ Email notifications on status changes
- ⬜ Document upload (transcripts, certificates)
- ⬜ Advanced AI/ML recommendations
- ⬜ Mobile application (React Native)
- ⬜ Bulk import/export functionality
- ⬜ Financial aid integration
- ⬜ Alumni tracking system

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Standards

- Follow Spring Boot best practices
- Write tests for new features
- Use Lombok for boilerplate reduction
- Document public APIs with JavaDoc
- Use meaningful commit messages

## 📝 License

This project is proprietary software developed for FlexiSAF Educational Solutions.

## 📞 Support

For issues and questions:
- Create an issue in the repository
- Contact the developer
- Refer to the [project documentation](https://docs.google.com/document/d/17uneXsLTv2uuFnLsxdZpuwHZ6XkP9fI1BX3k6qYk9AA/edit?usp=sharing)

## 🔧 Troubleshooting

### Common Issues

1. **403 Forbidden on root URL**: Expected behavior, use `/api/auth/login` instead
2. **Database connection refused**: Check DATABASE_URL format (must start with `jdbc:postgresql://`)
3. **JWT token expired**: Login again to get new token (24h validity)
4. **Empty application after registration**: Run cleanup endpoint after deploying fix
5. **Port 8080 in use**: Change `server.port` in application.yml
6. **CORS errors**: Update `CorsConfig.java` with frontend URL

### Debug Mode

Enable debug logging in `application.yml`:

```yaml
logging:
  level:
    com.flexisaf.admissions: DEBUG
    org.springframework.security: DEBUG
    org.hibernate.SQL: DEBUG
```

### Health Check

```bash
curl https://flexisaf-admission-api-backend.onrender.com/api/auth/login
```

If you get a response (even 401), the backend is running correctly.

---

**Built with ❤️ by the FlexiSAF Development Team**

**Version**: 1.0.0
**Last Updated**: December 2025
