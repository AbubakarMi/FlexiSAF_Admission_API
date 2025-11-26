# FlexiSAF Admissions System - Quick Reference Card

## Essential Commands

### Backend (Spring Boot)

```bash
# Start backend
cd backend
./mvnw spring-boot:run              # macOS/Linux
mvnw.cmd spring-boot:run            # Windows

# Run tests
./mvnw test

# Build JAR
./mvnw clean package

# Run with specific profile
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

### Frontend (React)

```bash
# Install dependencies
cd frontend
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Database (PostgreSQL)

```bash
# Connect to database
psql -U admissions_user -d admissions_db

# Create database
CREATE DATABASE admissions_db;

# List tables
\dt

# Describe table
\d applicants

# Check Flyway migration history
SELECT * FROM flyway_schema_history;
```

## Essential URLs

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:5173 | React application |
| Backend API | http://localhost:8080/api | REST API base |
| Swagger UI | http://localhost:8080/swagger-ui.html | API documentation |
| API Docs JSON | http://localhost:8080/v3/api-docs | OpenAPI spec |

## Default Credentials

```
Email: admin@flexisaf.com
Password: admin123
```

## API Quick Reference

### Public Endpoints

```bash
# Submit application
curl -X POST http://localhost:8080/api/applicants \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "program": "Computer Science",
    "gpa": 3.75,
    "testScore": 85
  }'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@flexisaf.com",
    "password": "admin123"
  }'
```

### Protected Endpoints (Requires JWT)

```bash
# Get applicants
curl -X GET "http://localhost:8080/api/applicants?page=0&size=10" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get applicant details
curl -X GET http://localhost:8080/api/applicants/1 \
  -H "Authorization: Bearer YOUR_TOKEN"

# Update applicant status
curl -X PUT http://localhost:8080/api/applicants/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "ACCEPTED", "version": 0}'

# Get AI hint
curl -X GET http://localhost:8080/api/applicants/1/ai-hint \
  -H "Authorization: Bearer YOUR_TOKEN"

# Add reviewer note
curl -X POST http://localhost:8080/api/applicants/1/notes \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content": "Strong candidate. Recommend acceptance."}'

# Get notes
curl -X GET http://localhost:8080/api/applicants/1/notes \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Project Structure Quick View

```
.
├── backend/                 # Spring Boot API
│   ├── src/main/java/      # Java source code
│   ├── src/main/resources/ # Config & migrations
│   └── src/test/           # Tests
│
├── frontend/               # React UI
│   ├── src/components/    # Reusable components
│   ├── src/pages/         # Page components
│   ├── src/services/      # API integration
│   └── src/context/       # React context
│
└── docs/                  # Documentation
```

## Status Values

```
PENDING      → Initial status
IN_REVIEW    → Under review
ACCEPTED     → Approved
REJECTED     → Denied
```

## AI Recommendation Values

```
RECOMMENDED_ACCEPT  → Score ≥ 75
RECOMMENDED_REVIEW  → Score 60-74
RECOMMENDED_REJECT  → Score < 60
```

## AI Scoring Formula

```
AI Score = (GPA / 4.0 × 40) + (Test Score / 100 × 60)

Example:
GPA: 3.5, Test Score: 80
Score = (3.5/4.0 × 40) + (80/100 × 60)
      = 35 + 48 = 83
Recommendation: ACCEPT (≥ 75)
```

## Color Scheme

```css
Primary (Blue):    #1E3A8A
Success (Green):   #10B981
Warning (Amber):   #F59E0B
Danger (Red):      #EF4444
Background (Gray): #F3F4F6
Text (Black):      #111827
```

## Common Issues & Solutions

### Port in use
```bash
# Find process using port
lsof -i :8080          # macOS/Linux
netstat -ano | findstr :8080  # Windows

# Kill process
kill -9 <PID>          # macOS/Linux
taskkill /PID <PID> /F # Windows
```

### Database connection failed
```bash
# Check PostgreSQL status
sudo service postgresql status  # Linux
brew services list             # macOS (if using Homebrew)

# Start PostgreSQL
sudo service postgresql start  # Linux
brew services start postgresql # macOS
```

### Flyway migration failed
```sql
-- Reset migrations (CAUTION: Deletes all data)
DROP TABLE IF EXISTS reviewer_notes CASCADE;
DROP TABLE IF EXISTS applicants CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS flyway_schema_history CASCADE;
-- Restart backend to re-run migrations
```

### JWT token invalid
```javascript
// Clear browser storage
localStorage.clear();
// Refresh page and login again
```

### CORS errors
```yaml
# Check CorsConfig.java includes your frontend URL
# Default: http://localhost:5173
# Add your URL if different
```

## Testing Checklist

- [ ] Backend starts without errors
- [ ] Frontend starts and loads
- [ ] Can submit application form
- [ ] Can login with default credentials
- [ ] Dashboard shows applicants
- [ ] Can view applicant details
- [ ] AI score displays correctly
- [ ] Can change applicant status
- [ ] Can add reviewer notes
- [ ] Search and pagination work

## Production Deployment Checklist

### Backend
- [ ] Change JWT secret in application.yml
- [ ] Update database credentials
- [ ] Set production profile
- [ ] Configure CORS for production domain
- [ ] Enable SSL/HTTPS
- [ ] Configure logging
- [ ] Set up database backups

### Frontend
- [ ] Update .env with production API URL
- [ ] Build production bundle
- [ ] Configure web server (nginx, Apache)
- [ ] Enable HTTPS
- [ ] Set up CDN (optional)

### Security
- [ ] Change default admin password
- [ ] Review and update JWT expiration
- [ ] Enable rate limiting
- [ ] Set up firewall rules
- [ ] Configure CORS properly
- [ ] Review error messages (no sensitive data)

## File Locations

### Configuration
```
Backend:  backend/src/main/resources/application.yml
Frontend: frontend/.env
Database: backend/src/main/resources/db/migration/
```

### Important Files
```
Main App:        backend/src/main/java/.../AdmissionsApplication.java
Security:        backend/src/main/java/.../config/SecurityConfig.java
AI Algorithm:    backend/src/main/java/.../service/AIService.java
React Router:    frontend/src/App.jsx
API Integration: frontend/src/services/api.js
```

## Logs Location

```bash
# Backend logs
# Printed to console by default
# To file: Update application.yml logging.file.name

# Frontend logs
# Browser DevTools → Console
```

## Environment Variables

### Backend (application.yml)
```yaml
spring.datasource.url      # Database URL
spring.datasource.username # Database user
spring.datasource.password # Database password
jwt.secret                 # JWT signing key
jwt.expiration            # Token expiration (ms)
```

### Frontend (.env)
```
VITE_API_BASE_URL    # Backend API URL
```

## Performance Tips

1. **Database**: Add indexes for frequently queried fields
2. **Backend**: Enable caching for static data
3. **Frontend**: Use pagination (already implemented)
4. **Network**: Enable gzip compression
5. **Images**: Optimize and use CDN

## Keyboard Shortcuts (Browser)

```
Ctrl/Cmd + K     → Focus search bar
Ctrl/Cmd + Enter → Submit form
Esc              → Close modal
```

## Version Info

- **Spring Boot**: 3.2.0
- **Java**: 17+
- **React**: 18.2.0
- **Node**: 18+
- **PostgreSQL**: 14+

---

**Keep this reference handy for quick access to common commands and information!** 🚀
