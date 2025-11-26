# FlexiSAF Admissions System - Quick Setup Guide

This guide will help you get the FlexiSAF Admissions System up and running in minutes.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Java 17 or higher** - [Download](https://adoptium.net/)
- **Node.js 18 or higher** - [Download](https://nodejs.org/)
- **PostgreSQL 14 or higher** - [Download](https://www.postgresql.org/download/)
- **Maven 3.8+** (or use the included wrapper)

## Quick Start

### 1. Database Setup (5 minutes)

1. Start PostgreSQL and open a SQL client (pgAdmin, psql, etc.)

2. Create the database and user:

```sql
CREATE DATABASE admissions_db;
CREATE USER admissions_user WITH PASSWORD 'admissions_pass';
GRANT ALL PRIVILEGES ON DATABASE admissions_db TO admissions_user;

-- If using PostgreSQL 15+, also grant schema privileges:
\c admissions_db
GRANT ALL ON SCHEMA public TO admissions_user;
```

3. Verify the connection:
```bash
psql -U admissions_user -d admissions_db -h localhost
```

### 2. Backend Setup (2 minutes)

1. Navigate to the backend directory:
```bash
cd backend
```

2. **OPTIONAL**: If your PostgreSQL settings differ from defaults, update `src/main/resources/application.yml`:
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/admissions_db
    username: admissions_user
    password: admissions_pass
```

3. Start the backend (migrations will run automatically):

**On macOS/Linux:**
```bash
chmod +x mvnw
./mvnw spring-boot:run
```

**On Windows:**
```bash
mvnw.cmd spring-boot:run
```

4. Wait for the message: `Started AdmissionsApplication in X seconds`

5. Verify the backend is running:
   - API: http://localhost:8080/api/auth/login
   - Swagger UI: http://localhost:8080/swagger-ui.html

### 3. Frontend Setup (2 minutes)

1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend:
```bash
npm run dev
```

4. Open your browser to: http://localhost:5173

## Default Login Credentials

The system comes with a pre-configured admin account:

- **Email:** admin@flexisaf.com
- **Password:** admin123

**⚠️ Important:** Change this password in production!

## Testing the System

### Test 1: Submit an Application (Public)

1. Go to http://localhost:5173
2. Fill out the application form with:
   - Name: John Doe
   - Email: john.doe@test.com
   - Program: Computer Science
   - GPA: 3.75
   - Test Score: 85
3. Click "Submit Application"
4. You should see a success message

### Test 2: Reviewer Dashboard

1. Click "Reviewer Login" or go to http://localhost:5173/login
2. Login with the default credentials
3. You should see the dashboard with your submitted application
4. Click "View Details" on any applicant
5. Explore:
   - AI-powered evaluation score and recommendation
   - Status management (change from PENDING to IN_REVIEW, etc.)
   - Add reviewer notes

### Test 3: AI Features

1. In the applicant details page, observe the AI Evaluation panel showing:
   - AI Score (calculated from GPA and test score)
   - Recommendation (Accept/Review/Reject)
   - Score breakdown explanation
   - Auto-generated reviewer note template

## API Testing with curl

### Login and Get Token

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@flexisaf.com",
    "password": "admin123"
  }'
```

Save the returned token for authenticated requests.

### Create Applicant

```bash
curl -X POST http://localhost:8080/api/applicants \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@test.com",
    "program": "Engineering",
    "gpa": 3.9,
    "testScore": 92
  }'
```

### Get Applicants (Protected)

```bash
curl -X GET http://localhost:8080/api/applicants \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get AI Hint

```bash
curl -X GET http://localhost:8080/api/applicants/1/ai-hint \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Troubleshooting

### Port Already in Use

**Backend (Port 8080):**
- Windows: `netstat -ano | findstr :8080`
- macOS/Linux: `lsof -i :8080`
- Kill the process or change the port in `application.yml`

**Frontend (Port 5173):**
- Kill any process using port 5173
- Or edit `vite.config.js` to use a different port

### Database Connection Failed

1. Ensure PostgreSQL is running:
   ```bash
   # macOS/Linux
   sudo service postgresql status

   # Windows
   # Check Services app for "PostgreSQL" service
   ```

2. Verify credentials in `application.yml` match your database setup

3. Check database exists:
   ```bash
   psql -U postgres -c "\l" | grep admissions_db
   ```

### Flyway Migration Errors

If migrations fail, you can manually reset:

```sql
-- Connect to the database
\c admissions_db

-- Drop all tables
DROP TABLE IF EXISTS reviewer_notes CASCADE;
DROP TABLE IF EXISTS applicants CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS flyway_schema_history CASCADE;
```

Then restart the backend to re-run migrations.

### CORS Errors

If you see CORS errors in the browser console:

1. Verify the frontend URL in `backend/src/main/java/com/flexisaf/admissions/config/CorsConfig.java` includes your frontend URL
2. Restart the backend after changes

### JWT Token Issues

If you get 401 errors after login:

1. Check browser DevTools → Application → Local Storage
2. Verify `token` and `user` are stored
3. Try logging out and back in
4. Check JWT secret length (must be at least 256 bits)

## Project Structure

```
.
├── backend/                    # Spring Boot application
│   ├── src/main/
│   │   ├── java/              # Java source files
│   │   └── resources/         # Configuration and migrations
│   ├── src/test/              # Test files
│   └── pom.xml               # Maven dependencies
│
├── frontend/                  # React application
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── context/         # React context
│   │   └── utils/           # Utilities
│   └── package.json         # NPM dependencies
│
└── README.md                 # Main documentation
```

## Next Steps

1. **Explore the API**: Visit http://localhost:8080/swagger-ui.html
2. **Review the Code**: Check out the clean architecture with services, controllers, and repositories
3. **Customize**: Modify the color scheme in `tailwind.config.js`
4. **Add Features**: Extend the AI scoring algorithm in `AIService.java`
5. **Deploy**: See README.md for production deployment instructions

## Performance Tips

- Backend startup: ~15-30 seconds (first time may download dependencies)
- Frontend build: ~10-20 seconds
- Page load: Instant with hot reload during development

## Support

For issues or questions:
- Check the main README.md for detailed documentation
- Review the Swagger API documentation
- Examine browser console and backend logs for errors

## Color Scheme Reference

The UI uses a professional color palette:

- **Primary (Deep Blue):** #1E3A8A - Trust, professionalism
- **Success (Emerald):** #10B981 - Acceptance, growth
- **Warning (Amber):** #F59E0B - Pending actions
- **Danger (Red):** #EF4444 - Rejections, errors
- **Background:** #F3F4F6 - Neutral, clean

These colors are optimized for accessibility and user experience.

---

**Congratulations!** Your FlexiSAF Admissions System is now running. 🎉
