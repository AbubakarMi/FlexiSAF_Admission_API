# Fixes Applied to FlexiSAF Admissions System

## Date: 2025-11-26

## Issues Encountered

### 1. Maven Build Error - Flyway PostgreSQL Dependency
**Error:**
```
For artifact {org.flywaydb:flyway-database-postgresql:null:jar}:
The version cannot be empty.
```

**Root Cause:**
- The `flyway-database-postgresql` dependency in `pom.xml` was missing a version number
- This dependency is actually not needed when using Spring Boot 3.2.0, as it already includes PostgreSQL support through `flyway-core`

**Fix Applied:**
- ✅ Removed the `flyway-database-postgresql` dependency from `backend/pom.xml` (lines 62-65)
- Kept only `flyway-core` which is sufficient for PostgreSQL migrations

**File Modified:**
- `backend/pom.xml`

---

### 2. Database Configuration Mismatch
**Issue:**
- Application was configured for database: `admissions_db`
- Your actual database is: `Admission_Db`
- Your credentials: username=`postgres`, password=`root`

**Fix Applied:**
- ✅ Updated `backend/src/main/resources/application.yml` with correct database credentials:
  ```yaml
  datasource:
    url: jdbc:postgresql://localhost:5432/Admission_Db
    username: postgres
    password: root
  ```

**Files Modified:**
- `backend/src/main/resources/application.yml`
- `README.md` (updated database setup instructions)

---

### 3. Lombok Annotations Not Recognized
**Error:**
```
package lombok does not exist
cannot find symbol: class Data
cannot find symbol: class NoArgsConstructor
```

**Root Cause:**
- Maven dependencies were not downloaded/recognized by Eclipse
- Lombok annotation processor was not configured in the IDE

**Fix Required (Action Needed):**
You need to update the Maven project in Eclipse:

1. **Right-click** on the `backend` folder (or `pom.xml`)
2. Select **Maven** → **Update Project** (or press `Alt+F5`)
3. Check ✅ "Force Update of Snapshots/Releases"
4. Click **OK**

This will:
- Download all Maven dependencies including Lombok
- Configure the annotation processors
- Resolve all "cannot find symbol" errors

**Alternative:** Run from command line:
```bash
cd backend
./mvnw clean install -U
```

---

## New Files Created

### 1. `setup-database.sql`
- SQL script to create the `Admission_Db` database
- Can be run with: `psql -U postgres -f setup-database.sql`

### 2. `create-database.bat`
- Windows batch script to create the database automatically
- Just double-click to run

### 3. `TROUBLESHOOTING.md`
- Comprehensive troubleshooting guide
- Solutions for common issues
- Step-by-step fixes

### 4. `FIXES_APPLIED.md`
- This document
- Documents all changes made to fix the issues

---

## Current Configuration

### Database
- **Name:** `Admission_Db`
- **Host:** `localhost:5432`
- **Username:** `postgres`
- **Password:** `root`

### Application
- **Backend Port:** 8080
- **Frontend Port:** 5173
- **API Base:** http://localhost:8080/api
- **Swagger UI:** http://localhost:8080/swagger-ui.html

---

## Steps to Get Running

### 1. Create the Database

**Option A - Using the batch script (easiest):**
```bash
# Double-click on:
create-database.bat
```

**Option B - Using psql:**
```bash
psql -U postgres -c "CREATE DATABASE \"Admission_Db\";"
```

**Option C - Using pgAdmin:**
1. Open pgAdmin
2. Right-click "Databases"
3. Create → Database
4. Name: `Admission_Db`
5. Owner: `postgres`
6. Save

### 2. Update Maven Project (Eclipse)

1. **Right-click** on `backend` project
2. **Maven** → **Update Project** (`Alt+F5`)
3. Check ✅ **Force Update of Snapshots/Releases**
4. Click **OK**
5. Wait for Maven to download dependencies

### 3. Verify Dependencies Downloaded

In Eclipse, expand the `backend` project:
- Look for **Maven Dependencies** folder
- You should see jars like:
  - `lombok-1.18.xx.jar`
  - `spring-boot-starter-web-3.2.0.jar`
  - `postgresql-42.x.x.jar`
  - `flyway-core-9.x.x.jar`

### 4. Start the Backend

**Option A - In Eclipse:**
1. Right-click `AdmissionsApplication.java`
2. Run As → Java Application

**Option B - Command Line:**
```bash
cd backend
./mvnw spring-boot:run
```

**Expected Output:**
```
Started AdmissionsApplication in X.XXX seconds
```

### 5. Verify Backend is Running

Open in browser:
- Swagger UI: http://localhost:8080/swagger-ui.html
- Should see the API documentation

### 6. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

Open browser:
- http://localhost:5173

---

## Verification Checklist

After applying fixes:

- [ ] Maven dependencies downloaded (check Maven Dependencies folder)
- [ ] No Lombok errors in Eclipse
- [ ] Database `Admission_Db` created
- [ ] Backend starts without errors
- [ ] Swagger UI accessible
- [ ] Tables created in database (users, applicants, reviewer_notes)
- [ ] Frontend starts successfully
- [ ] Can access login page at http://localhost:5173/login

---

## Testing the Application

### 1. Check Database Tables

```sql
-- Connect to database
\c "Admission_Db"

-- List tables (run after backend starts once)
\dt

-- Should show:
-- flyway_schema_history
-- users
-- applicants
-- reviewer_notes
```

### 2. Test Login

1. Go to http://localhost:5173/login
2. Email: `admin@flexisaf.com`
3. Password: `admin123`
4. Should redirect to dashboard

### 3. Test Application Submission

1. Go to http://localhost:5173
2. Fill out the form
3. Submit
4. Should see success message

---

## What Changed

### Modified Files
1. ✅ `backend/pom.xml` - Removed problematic Flyway dependency
2. ✅ `backend/src/main/resources/application.yml` - Updated database credentials
3. ✅ `README.md` - Updated database setup instructions

### New Files
1. ✅ `setup-database.sql` - Database creation script
2. ✅ `create-database.bat` - Windows batch script
3. ✅ `TROUBLESHOOTING.md` - Troubleshooting guide
4. ✅ `FIXES_APPLIED.md` - This document

---

## Common Issues After Fixes

### Issue: "Still seeing Lombok errors"

**Solution:**
1. Update Maven project (Alt+F5)
2. Clean and rebuild:
   ```bash
   ./mvnw clean install
   ```
3. Restart Eclipse

### Issue: "Cannot connect to database"

**Solution:**
1. Verify PostgreSQL is running
2. Check database exists:
   ```bash
   psql -U postgres -c "\l" | grep Admission_Db
   ```
3. Verify credentials in `application.yml`

### Issue: "Tables not created"

**Solution:**
Tables are created automatically when the app starts. Make sure:
1. Database exists
2. Flyway is enabled in `application.yml`
3. Check backend logs for migration errors

---

## Contact & Support

If you encounter other issues:
1. Check `TROUBLESHOOTING.md` for solutions
2. Review backend console output for error messages
3. Verify all prerequisites are installed (Java 17+, PostgreSQL 14+, Node 18+)

---

**Status: All fixes have been applied successfully!** ✅

**Next Step:** Update Maven project in Eclipse (Alt+F5), then start the application.
