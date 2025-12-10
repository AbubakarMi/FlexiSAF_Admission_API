# Render Deployment Guide - FlexiSAF Admission System

## 📋 Prerequisites

✅ Render.com account created
✅ PostgreSQL database created on Render
✅ Database credentials received (already have them)

---

## 🚀 Deployment Steps

### Step 1: Prepare Your Repository

1. **Initialize Git (if not already done):**
```bash
cd "C:\Users\lenovo\Documents\DevFlux\FlexiSAF Admission API"
git init
git add .
git commit -m "Initial commit - Production ready"
```

2. **Create GitHub Repository:**
   - Go to https://github.com/new
   - Create a new repository (e.g., `flexisaf-admission-api`)
   - Don't initialize with README (we already have code)

3. **Push to GitHub:**
```bash
git remote add origin https://github.com/YOUR_USERNAME/flexisaf-admission-api.git
git branch -M main
git push -u origin main
```

---

### Step 2: Deploy on Render

#### Option A: Using Render Dashboard (Recommended)

1. **Go to Render Dashboard:**
   - Visit https://dashboard.render.com

2. **Create New Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `flexisaf-admission-api` repository

3. **Configure Service:**
   ```
   Name: flexisaf-admission-api
   Region: Oregon (US West) or closest to you
   Branch: main
   Runtime: Java
   Build Command: cd backend && ./mvnw clean package -DskipTests
   Start Command: cd backend && java -Dserver.port=$PORT -jar target/admissions-system-1.0.0.jar
   ```

4. **Set Environment Variables:**
   Click "Environment" tab and add:
   ```
   SPRING_PROFILES_ACTIVE=prod
   DATABASE_URL=postgresql://flexisaf_admission_db_user:AKlpO5WuD1WkYfIoKf90nzoWMizsd62n@dpg-d4sl2pfgi27c73bp47h0-a.virginia-postgres.render.com/flexisaf_admission_db
   JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
   RESEND_API_KEY=re_LirnJa75_QD7UDc7zG6VYekut8TVzKdtg
   PORT=8080
   ```

5. **Advanced Settings:**
   ```
   Health Check Path: /actuator/health
   Auto-Deploy: Yes
   ```

6. **Click "Create Web Service"**
   - Render will start building and deploying
   - First deployment takes 5-10 minutes

#### Option B: Using render.yaml (Automated)

1. **The `render.yaml` file is already created in your project root**

2. **Create New Blueprint:**
   - Go to Render Dashboard
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect `render.yaml`
   - Click "Apply"

---

### Step 3: Verify Deployment

1. **Check Build Logs:**
   - Watch the deployment logs in Render dashboard
   - Look for: "Started AdmissionsApplication in X seconds"

2. **Test Health Endpoint:**
   ```
   https://your-app-name.onrender.com/actuator/health
   ```
   Should return: `{"status":"UP"}`

3. **Test API Endpoints:**
   ```
   https://your-app-name.onrender.com/api-docs
   https://your-app-name.onrender.com/swagger-ui.html
   ```

4. **Test Authentication:**
   ```bash
   curl -X POST https://your-app-name.onrender.com/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "password": "Test123!",
       "firstName": "Test",
       "lastName": "User"
     }'
   ```

---

## 🔧 Configuration Details

### Database Connection

Your Render PostgreSQL database is already configured:
- **External URL:** `postgresql://flexisaf_admission_db_user:AKlpO5WuD1WkYfIoKf90nzoWMizsd62n@dpg-d4sl2pfgi27c73bp47h0-a.virginia-postgres.render.com/flexisaf_admission_db`
- **Database:** `flexisaf_admission_db`
- **User:** `flexisaf_admission_db_user`

### Environment Variables

| Variable | Purpose | Value |
|----------|---------|-------|
| `SPRING_PROFILES_ACTIVE` | Activate production profile | `prod` |
| `DATABASE_URL` | PostgreSQL connection | (Your Render DB URL) |
| `JWT_SECRET` | JWT token signing | (Generated secret) |
| `RESEND_API_KEY` | Email service | (Your Resend key) |
| `PORT` | Server port | `8080` |

---

## 🎯 Post-Deployment Tasks

### 1. Update Frontend Configuration

Update your frontend to point to the deployed backend:

**File:** `frontend/src/services/api.js` (or wherever you define API_URL)

```javascript
// Before (development)
const API_URL = 'http://localhost:8080/api';

// After (production)
const API_URL = process.env.REACT_APP_API_URL || 'https://your-app-name.onrender.com/api';
```

**Create `.env.production` in frontend:**
```
REACT_APP_API_URL=https://your-app-name.onrender.com/api
```

### 2. Update CORS Configuration

Your backend needs to allow requests from your frontend domain.

**File:** `backend/src/main/java/com/flexisaf/admissions/config/SecurityConfig.java`

Find the CORS configuration and update:
```java
.cors(cors -> cors.configurationSource(request -> {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOrigins(Arrays.asList(
        "http://localhost:5173",
        "http://localhost:3000",
        "https://your-frontend-domain.vercel.app",  // Add your frontend URL
        "https://your-app-name.onrender.com"
    ));
    // ... rest of config
}))
```

### 3. Initialize Database (First Time Only)

The application will automatically create tables on first run (ddl-auto: update).

**To load initial data (courses, announcements):**
- DataLoader will run automatically on first startup
- It will create courses and announcements
- Sample students/payments are disabled (as configured)

### 4. Test Complete Workflow

1. **Register a new user** → Should create User + Applicant
2. **Submit application** → AI should evaluate
3. **Login as reviewer** → Accept applicant
4. **Verify student created** → Check Students page
5. **Test course enrollment** → Should save to database
6. **Test payment** → Should create payment record

---

## 📊 Monitoring & Logs

### View Logs
- Go to Render Dashboard → Your Service → Logs
- Real-time logs show application startup and requests

### Health Checks
Render automatically checks `/actuator/health` every 60 seconds

### Database Management
1. **Connect via psql:**
```bash
PGPASSWORD=AKlpO5WuD1WkYfIoKf90nzoWMizsd62n psql -h dpg-d4sl2pfgi27c73bp47h0-a.virginia-postgres.render.com -U flexisaf_admission_db_user flexisaf_admission_db
```

2. **View tables:**
```sql
\dt
SELECT * FROM users LIMIT 5;
SELECT * FROM students;
SELECT * FROM student_course_enrollments;
```

---

## 🚨 Troubleshooting

### Build Fails

**Error:** "Could not find mvnw"
- Make sure `mvnw` and `mvnw.cmd` are in `backend/` folder
- Make sure they're executable: `git update-index --chmod=+x backend/mvnw`

**Error:** "Tests failed"
- Build command uses `-DskipTests` to skip tests during build
- Fix tests locally before deploying

### Application Won't Start

**Check logs for:**
- Database connection errors → Verify DATABASE_URL
- Port binding errors → Render sets PORT automatically
- Missing dependencies → Check pom.xml

**Common fixes:**
```bash
# In Render environment variables, ensure:
PORT=8080
SPRING_PROFILES_ACTIVE=prod
```

### Database Connection Issues

**Error:** "Could not connect to database"
1. Verify database is running in Render
2. Check DATABASE_URL is correct
3. Ensure database allows external connections

**Test connection locally:**
```bash
psql "postgresql://flexisaf_admission_db_user:AKlpO5WuD1WkYfIoKf90nzoWMizsd62n@dpg-d4sl2pfgi27c73bp47h0-a.virginia-postgres.render.com/flexisaf_admission_db"
```

### CORS Errors

**Error:** "Access blocked by CORS policy"
1. Update CORS configuration to include your frontend URL
2. Redeploy backend
3. Clear browser cache

---

## 🔐 Security Recommendations

### Before Going Live:

1. **Generate New JWT Secret:**
```bash
# Generate secure random string
openssl rand -base64 64
```
Add to Render environment variables

2. **Use Secret Environment Variables:**
   - In Render, mark sensitive vars as "Secret"
   - Don't commit secrets to Git

3. **Enable HTTPS Only:**
   - Render provides HTTPS by default
   - Ensure frontend only calls HTTPS endpoints

4. **Review CORS Settings:**
   - Only allow your actual frontend domain
   - Remove `*` wildcards in production

5. **Database Backups:**
   - Enable automatic backups in Render
   - Export important data regularly

---

## 📝 Deployment Checklist

- [ ] Git repository created and pushed to GitHub
- [ ] Render web service created and configured
- [ ] Environment variables set correctly
- [ ] Database connection tested
- [ ] Health endpoint returns 200 OK
- [ ] Swagger UI accessible
- [ ] Test user registration works
- [ ] Test application submission works
- [ ] Frontend updated to use production API URL
- [ ] CORS configured for frontend domain
- [ ] JWT secret generated and set
- [ ] Email service tested
- [ ] Monitoring and alerts configured

---

## 🎉 Success!

Once deployed, your API will be available at:
```
https://your-app-name.onrender.com
```

### API Documentation:
```
https://your-app-name.onrender.com/swagger-ui.html
```

### Health Check:
```
https://your-app-name.onrender.com/actuator/health
```

---

## 📞 Support

- **Render Documentation:** https://render.com/docs
- **Spring Boot on Render:** https://render.com/docs/deploy-spring-boot
- **Database Issues:** Check Render dashboard → Database → Logs

---

Generated: 2025-01-10
