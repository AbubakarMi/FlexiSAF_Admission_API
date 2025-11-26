# FlexiSAF Admissions System

A comprehensive fullstack admissions management system with AI-powered applicant evaluation and complete authentication.

## Features

### Backend (Spring Boot 3)
- RESTful API for managing student applicants
- **Complete authentication system with student registration**
- **Role-based access control (STUDENT, REVIEWER, ADMIN)**
- Multi-step workflow: PENDING → IN_REVIEW → ACCEPTED/REJECTED
- AI-powered scoring and status hints based on GPA and test scores
- Reviewer notes system
- JWT authentication (24-hour tokens)
- Search, pagination, and sorting
- Optimistic locking for concurrent updates
- PostgreSQL database with Flyway migrations
- OpenAPI/Swagger documentation
- Comprehensive unit and integration tests

### Frontend (React)
- **Beautiful landing page with call-to-actions**
- **Student registration with validation**
- **Role-based login and routing**
- **Authenticated application submission (students only)**
- Reviewer dashboard with search and filtering
- Detailed applicant view with AI hints
- Status management and reviewer notes
- JWT-based authentication with auto-redirect
- World-class UI design (no gradients, clean and modern)
- Responsive design with professional color scheme
- Clean, user-friendly interface

## Color Scheme

- **Primary (Deep Blue)**: #1E3A8A - Headers, buttons, trust elements
- **Success (Emerald Green)**: #10B981 - Accepted status, positive actions
- **Warning (Amber)**: #F59E0B - Pending status, attention items
- **Error (Red)**: #EF4444 - Rejected status, error messages
- **Background (Light Gray)**: #F3F4F6 - Neutral backgrounds
- **Text (Almost Black)**: #111827 - High readability text

## Tech Stack

### Backend
- Java 17+
- Spring Boot 3.2.0
- Spring Security + JWT
- Spring Data JPA
- PostgreSQL 14+
- Flyway
- Maven
- JUnit 5 + Mockito
- Springdoc OpenAPI

### Frontend
- React 18
- React Router 6
- Axios
- Tailwind CSS
- Vite

## Prerequisites

- Java 17 or higher
- Node.js 18 or higher
- PostgreSQL 14 or higher
- Maven 3.8+ (or use included wrapper)

## Database Setup

1. Install PostgreSQL and create a database:
```sql
CREATE DATABASE "Admission_Db";
```

**Note**: The project is configured to use:
- Database name: `Admission_Db`
- Username: `postgres` (default PostgreSQL user)
- Password: `root`

If your PostgreSQL setup is different, update the credentials in `backend/src/main/resources/application.yml`

2. Flyway will automatically run migrations on application startup.

## Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Update database configuration in `src/main/resources/application.yml` if needed.

3. Run the application:
```bash
./mvnw spring-boot:run
```

Or on Windows:
```bash
mvnw.cmd spring-boot:run
```

4. The backend will start on `http://localhost:8080`

5. Access Swagger UI: `http://localhost:8080/swagger-ui.html`

## Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

5. The frontend will start on `http://localhost:3000`

## Quick Access

Once both backend and frontend are running:

- **Landing Page**: http://localhost:3000
- **Student Registration**: http://localhost:3000/register
- **Login (All Users)**: http://localhost:3000/login
- **Submit Application (Students)**: http://localhost:3000/submit-application (requires login)
- **Dashboard (Reviewers)**: http://localhost:3000/dashboard (requires login)
- **Swagger API Docs**: http://localhost:8080/swagger-ui.html

## User Accounts

### Default Admin (Pre-created)
- **Email**: admin@flexisaf.com
- **Password**: admin123
- **Role**: ADMIN
- **Access**: Full dashboard and management

### Student Accounts
- **Register at**: http://localhost:3000/register
- **Role**: STUDENT (auto-assigned)
- **Access**: Application submission only

**Note**: Change admin password in production!

## Authentication System

The system now includes complete authentication with three user roles:

1. **STUDENT** - Can register and submit applications
2. **REVIEWER** - Can access dashboard and review applications
3. **ADMIN** - Full system access

### Student Flow
1. Register at `/register`
2. Login at `/login`
3. Submit application at `/submit-application`

### Reviewer Flow
1. Login at `/login` with provided credentials
2. Access dashboard at `/dashboard`
3. Review applicants

**📖 See [AUTHENTICATION_GUIDE.md](AUTHENTICATION_GUIDE.md) for complete authentication documentation**

---

## API Endpoints

### Authentication Endpoints

#### Register Student
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john.doe@example.com",
    "password": "securepass123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

#### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "securepass123"
  }'
```

### Public Endpoints

#### Submit Application (Now Requires Authentication)
```bash
curl -X POST http://localhost:8080/api/applicants \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "program": "Computer Science",
    "gpa": 3.75,
    "testScore": 85
  }'
```

#### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@flexisaf.com",
    "password": "admin123"
  }'
```

### Protected Endpoints (Require JWT Token)

#### List Applicants
```bash
curl -X GET "http://localhost:8080/api/applicants?page=0&size=10&sort=createdAt,desc" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Search Applicants
```bash
curl -X GET "http://localhost:8080/api/applicants?email=john&program=Computer&page=0&size=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Get Applicant Details
```bash
curl -X GET http://localhost:8080/api/applicants/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Update Applicant Status
```bash
curl -X PUT http://localhost:8080/api/applicants/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "ACCEPTED",
    "version": 0
  }'
```

#### Get AI Hint
```bash
curl -X GET http://localhost:8080/api/applicants/1/ai-hint \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Add Reviewer Note
```bash
curl -X POST http://localhost:8080/api/applicants/1/notes \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Strong candidate with excellent academic record."
  }'
```

#### Get Reviewer Notes
```bash
curl -X GET http://localhost:8080/api/applicants/1/notes \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Soft Delete Applicant
```bash
curl -X DELETE http://localhost:8080/api/applicants/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## AI Scoring System

The system uses a rule-based AI scoring algorithm:

### Score Calculation
- **GPA Weight**: 40%
- **Test Score Weight**: 60%
- **Formula**: `(GPA / 4.0 × 40) + (testScore / 100 × 60)`

### Status Hints
- **Score ≥ 75**: "RECOMMENDED_ACCEPT"
- **Score 60-74**: "RECOMMENDED_REVIEW"
- **Score < 60**: "RECOMMENDED_REJECT"

### Auto-Generated Notes
Based on the score, the system generates template notes:
- High score: "Excellent academic performance. Strong candidate for admission."
- Medium score: "Solid academic background. Requires further review."
- Low score: "Below admission standards. Consider rejection or conditional admission."

## Running Tests

### Backend Tests
```bash
cd backend
./mvnw test
```

### Integration Tests
```bash
./mvnw verify
```

## Building for Production

### Backend
```bash
cd backend
./mvnw clean package
java -jar target/admissions-system-1.0.0.jar
```

### Frontend
```bash
cd frontend
npm run build
# Serve the dist folder with your preferred web server
```

## Docker Support

Build and run the backend with Docker:
```bash
cd backend
docker build -t admissions-backend .
docker run -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://host.docker.internal:5432/admissions_db \
  -e SPRING_DATASOURCE_USERNAME=admissions_user \
  -e SPRING_DATASOURCE_PASSWORD=admissions_pass \
  admissions-backend
```

## Project Structure

```
.
├── backend/
│   ├── src/main/java/com/flexisaf/admissions/
│   │   ├── config/          # Configuration classes
│   │   ├── controller/      # REST controllers
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── entity/          # JPA entities
│   │   ├── exception/       # Exception handling
│   │   ├── mapper/          # Entity-DTO mappers
│   │   ├── repository/      # Data repositories
│   │   ├── security/        # JWT & security
│   │   ├── service/         # Business logic
│   │   └── validation/      # Custom validators
│   ├── src/main/resources/
│   │   ├── application.yml
│   │   └── db/migration/    # Flyway migrations
│   └── src/test/            # Tests
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── context/         # React context
│   │   └── utils/           # Utility functions
│   └── public/
└── README.md
```

## Troubleshooting

### Backend Issues

**Port 8080 already in use**:
```bash
# Change port in application.yml
server:
  port: 8081
```

**Database connection issues**:
- Verify PostgreSQL is running
- Check database credentials in application.yml
- Ensure database exists

**JWT token expired**:
- Login again to get a new token
- Token validity is 24 hours by default

### Frontend Issues

**API connection refused**:
- Ensure backend is running on port 8080
- Check VITE_API_BASE_URL in .env file

**CORS errors**:
- Backend CORS is configured for http://localhost:5173
- Update CorsConfig.java if using different ports

## License

MIT License - feel free to use this project for educational or commercial purposes.

## Support

For issues and questions, please create an issue in the project repository.
