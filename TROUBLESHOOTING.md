# Troubleshooting Guide

## Fixed Issues

### 1. Maven Dependency Error (Flyway)

**Error Message:**
```
For artifact {org.flywaydb:flyway-database-postgresql:null:jar}: The version cannot be empty.
```

**Solution:** ✅ FIXED
- Removed the `flyway-database-postgresql` dependency from `pom.xml`
- Spring Boot 3.2.0 already includes the necessary Flyway PostgreSQL support through `flyway-core`

### 2. Lombok Errors

**Error Messages:**
```
package lombok does not exist
cannot find symbol: class Data
cannot find symbol: class NoArgsConstructor
```

**Solution:**
You need to update your Maven project in Eclipse:

1. Right-click on the `backend` folder (or `pom.xml`)
2. Select **Maven** → **Update Project** (or press `Alt+F5`)
3. Check the box "Force Update of Snapshots/Releases"
4. Click **OK**

This will download Lombok and other dependencies, then your IDE will recognize the annotations.

### 3. Database Configuration

**Your Setup:**
- Database: `Admission_Db`
- Username: `postgres`
- Password: `root`

**Solution:** ✅ FIXED
- Updated `application.yml` with your database credentials

## Setting Up the Database

### Option 1: Using the SQL Script (Recommended)

1. Open PostgreSQL command line (psql) or pgAdmin
2. Connect as the `postgres` user
3. Run the setup script:
   ```bash
   psql -U postgres -f setup-database.sql
   ```

### Option 2: Manual Setup

1. Open pgAdmin or psql
2. Create the database:
   ```sql
   CREATE DATABASE "Admission_Db";
   ```
3. That's it! The app will create tables automatically.

## Common Issues & Solutions

### Issue: "Cannot connect to database"

**Check:**
1. Is PostgreSQL running?
   ```bash
   # Windows - Check Services
   # Look for "PostgreSQL" service

   # Or use psql
   psql -U postgres -d postgres
   ```

2. Is the database created?
   ```sql
   -- In psql
   \l
   -- Look for "Admission_Db"
   ```

3. Are credentials correct in `application.yml`?
   - Database: `Admission_Db`
   - Username: `postgres`
   - Password: `root`

### Issue: "Lombok annotations not recognized"

**Solution:**
1. Update Maven project (Alt+F5)
2. Clean and rebuild:
   ```bash
   ./mvnw clean install
   ```
3. If still not working, restart Eclipse

### Issue: "Cannot find symbol" errors for validation annotations

**Solution:**
Maven needs to download dependencies. Run:
```bash
cd backend
./mvnw clean install -U
```

The `-U` flag forces Maven to check for updated dependencies.

### Issue: Port 8080 already in use

**Solution:**
```bash
# Windows - Find process using port 8080
netstat -ano | findstr :8080

# Kill the process
taskkill /PID [PID_NUMBER] /F

# Or change the port in application.yml:
server:
  port: 8081
```

### Issue: Flyway migration errors

**Error:** "Flyway validation failed"

**Solution:**
If you need to reset the database:

```sql
-- Connect to Admission_Db
\c "Admission_Db"

-- Drop all tables
DROP TABLE IF EXISTS reviewer_notes CASCADE;
DROP TABLE IF EXISTS applicants CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS flyway_schema_history CASCADE;
```

Then restart the Spring Boot application.

## Verifying the Setup

### 1. Check Maven Dependencies

In Eclipse:
1. Expand `backend` project
2. Look for `Maven Dependencies` folder
3. You should see:
   - lombok-xxx.jar
   - spring-boot-starter-xxx.jar
   - postgresql-xxx.jar
   - flyway-core-xxx.jar

### 2. Check Database Connection

Run this in psql:
```sql
-- Connect to the database
\c "Admission_Db"

-- After running the app once, check tables
\dt

-- Should show:
-- users
-- applicants
-- reviewer_notes
-- flyway_schema_history
```

### 3. Test the Application

1. Start the backend:
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```

2. Look for this message:
   ```
   Started AdmissionsApplication in X.XXX seconds
   ```

3. Test the API:
   ```bash
   curl http://localhost:8080/swagger-ui.html
   ```

## Eclipse-Specific Issues

### Lombok Not Working in Eclipse

If Eclipse still doesn't recognize Lombok after Maven update:

1. Download the Lombok JAR:
   - Find it in `backend/.m2/repository/org/projectlombok/lombok/[version]/`
   - Or download from https://projectlombok.org/

2. Install Lombok in Eclipse:
   ```bash
   java -jar lombok.jar
   ```

3. Select your Eclipse installation
4. Click "Install/Update"
5. Restart Eclipse

### Clean Eclipse Workspace

If you're still having issues:

1. Close Eclipse
2. Delete `.metadata` folder in your workspace (CAUTION: This removes workspace settings)
3. Restart Eclipse
4. Import the project again

## Next Steps After Fixing

Once you've fixed the Maven and database issues:

1. **Reload Maven Project** (Alt+F5)
2. **Start PostgreSQL** and create the database
3. **Run the Backend:**
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```
4. **Check Swagger UI:** http://localhost:8080/swagger-ui.html
5. **Setup Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
6. **Access App:** http://localhost:5173

## Getting Help

If you encounter other issues:

1. Check the error message carefully
2. Look in the console output for stack traces
3. Verify all steps in SETUP_GUIDE.md
4. Check that Java 17+ is installed: `java -version`
5. Check that PostgreSQL is running
6. Ensure port 8080 and 5173 are available

## Quick Command Reference

```bash
# Check Java version
java -version

# Check Maven
./mvnw -version

# Check PostgreSQL
psql --version

# Connect to PostgreSQL
psql -U postgres -d "Admission_Db"

# List databases
psql -U postgres -c "\l"

# Maven clean and install
./mvnw clean install

# Run Spring Boot app
./mvnw spring-boot:run

# Run frontend
npm run dev
```

---

**Your current configuration is now set up correctly!**

Just make sure to:
1. Update Maven project in Eclipse (Alt+F5)
2. Create the database using the setup-database.sql script
3. Start the application

The errors you encountered have been fixed! 🎉
