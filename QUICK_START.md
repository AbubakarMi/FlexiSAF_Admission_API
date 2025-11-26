# Quick Start Guide - FlexiSAF Admissions System

## Your Configuration
- Database: `Admission_Db`
- Username: `postgres`
- Password: `root`

---

## Step 1: Create Database (1 minute)

### Option A: Double-click the batch file
```
Double-click: create-database.bat
```

### Option B: Use psql
```bash
psql -U postgres -c "CREATE DATABASE \"Admission_Db\";"
```

### Option C: Use pgAdmin
1. Open pgAdmin
2. Right-click Databases → Create → Database
3. Name: `Admission_Db`
4. Save

---

## Step 2: Fix Maven in Eclipse (2 minutes)

**This is IMPORTANT to fix the Lombok errors!**

1. In Eclipse, **right-click** on the `backend` folder
2. Select **Maven** → **Update Project** (or press `Alt+F5`)
3. ✅ Check **"Force Update of Snapshots/Releases"**
4. Click **OK**
5. Wait for Maven to download dependencies (watch bottom-right progress bar)

**Alternative using command line:**
```bash
cd backend
mvnw.cmd clean install -U
```

---

## Step 3: Start Backend (30 seconds)

### In Eclipse:
1. Open: `backend/src/main/java/com/flexisaf/admissions/AdmissionsApplication.java`
2. Right-click → **Run As** → **Java Application**

### Or in Terminal:
```bash
cd backend
mvnw.cmd spring-boot:run
```

**Wait for:**
```
Started AdmissionsApplication in X.XXX seconds
```

---

## Step 4: Start Frontend (1 minute)

Open a **new terminal**:

```bash
cd frontend
npm install
npm run dev
```

**Wait for:**
```
Local: http://localhost:5173/
```

---

## Step 5: Test the Application

### Open in Browser:
- **Frontend**: http://localhost:5173
- **Login**: http://localhost:5173/login
- **Swagger API**: http://localhost:8080/swagger-ui.html

### Login Credentials:
- Email: `admin@flexisaf.com`
- Password: `admin123`

---

## Verification Checklist

✅ Database `Admission_Db` created
✅ Maven dependencies downloaded (no red squiggly lines in Eclipse)
✅ Backend running on port 8080
✅ Frontend running on port 5173
✅ Can access Swagger UI
✅ Can login to the system

---

## Troubleshooting

### Problem: Lombok errors still showing

**Solution:**
```bash
# In terminal:
cd backend
mvnw.cmd clean install -U

# Then in Eclipse:
Right-click backend → Maven → Update Project
```

### Problem: "Port 8080 already in use"

**Solution:**
```bash
# Find what's using port 8080
netstat -ano | findstr :8080

# Kill that process (replace XXXX with actual PID)
taskkill /PID XXXX /F
```

### Problem: Cannot connect to database

**Solution:**
1. Check PostgreSQL is running (Services → PostgreSQL)
2. Verify database exists:
   ```bash
   psql -U postgres -c "\l" | findstr Admission_Db
   ```

---

## Need More Help?

📖 See **TROUBLESHOOTING.md** for detailed solutions
📖 See **FIXES_APPLIED.md** for what was changed
📖 See **README.md** for complete documentation

---

**That's it! You should now have a running admissions system.** 🎉

**Test it:**
1. Go to http://localhost:5173
2. Fill out an application
3. Login at http://localhost:5173/login
4. View the application in the dashboard
5. Click "View Details" to see AI scoring!
