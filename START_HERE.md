# 🚀 START HERE - Quick Fix & Launch

## Current Issues Fixed:

✅ **Port changed:** 5173 → 3000
✅ **Database configured:** Admission_Db with postgres/root
✅ **Lombok fix script created**

---

## ⚡ 3-Step Quick Start

### Step 1: Fix Lombok Errors (2 minutes)

Open Command Prompt and run:

```cmd
cd "c:\Users\lenovo\Documents\DevFlux\FlexiSAF Admission API\backend"
fix-lombok.bat
```

**Wait for "BUILD SUCCESS"**

### Step 2: Create Database (30 seconds)

**Option A - Using the script:**
```cmd
cd ..
create-database.bat
```

**Option B - Using psql:**
```cmd
psql -U postgres -c "CREATE DATABASE \"Admission_Db\";"
```

**Option C - Using pgAdmin:**
- Open pgAdmin
- Right-click Databases → Create
- Name: `Admission_Db`

### Step 3: Start Everything (1 minute)

**Terminal 1 - Backend:**
```cmd
cd "c:\Users\lenovo\Documents\DevFlux\FlexiSAF Admission API\backend"
mvnw.cmd spring-boot:run
```

**Terminal 2 - Frontend:**
```cmd
cd "c:\Users\lenovo\Documents\DevFlux\FlexiSAF Admission API\frontend"
npm install
npm run dev
```

---

## 🌐 Access URLs

- **Frontend:** http://localhost:3000 ⬅️ NEW PORT!
- **Login:** http://localhost:3000/login
- **Backend API:** http://localhost:8080/api
- **Swagger Docs:** http://localhost:8080/swagger-ui.html

---

## 🔑 Login Credentials

```
Email: admin@flexisaf.com
Password: admin123
```

---

## ✅ Verification Checklist

After completing the steps above:

- [ ] Lombok errors gone (no red underlines in DTO files)
- [ ] Database `Admission_Db` created
- [ ] Backend running (see "Started AdmissionsApplication")
- [ ] Frontend running (see "Local: http://localhost:3000")
- [ ] Can access http://localhost:3000
- [ ] Can login with credentials above

---

## 🔧 If Something Doesn't Work

### Lombok Still Showing Errors?

Try this:
```cmd
cd backend
mvnw.cmd clean install -U
```

Then **reload your IDE/editor** (close and reopen, or use Reload Window command).

### Database Connection Failed?

Make sure PostgreSQL is running:
1. Open Services (Windows + R, type `services.msc`)
2. Look for "PostgreSQL" service
3. Make sure it's "Running"

### Port Already in Use?

**For port 8080 (backend):**
```cmd
netstat -ano | findstr :8080
taskkill /PID [PID_NUMBER] /F
```

**For port 3000 (frontend):**
```cmd
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F
```

---

## 📚 More Help

| Issue | Check This File |
|-------|----------------|
| Lombok errors | [FIX_LOMBOK_NOW.md](FIX_LOMBOK_NOW.md) |
| General issues | [TROUBLESHOOTING.md](TROUBLESHOOTING.md) |
| Quick commands | [QUICK_START.md](QUICK_START.md) |
| What was changed | [FIXES_APPLIED.md](FIXES_APPLIED.md) |
| Complete docs | [README.md](README.md) |

---

## 🎯 What To Do After It's Running

1. **Test Application Submission**
   - Go to http://localhost:3000
   - Fill out the form
   - Submit an application

2. **Test Reviewer Dashboard**
   - Go to http://localhost:3000/login
   - Login with admin credentials
   - View the submitted application
   - See the AI score!

3. **Explore Features**
   - Change application status
   - Add reviewer notes
   - Search and filter applicants
   - Check out the AI recommendations

---

## 🎨 Color Scheme (Port 3000)

The new port is **3000** and the UI uses:
- Primary Blue (#1E3A8A) - Headers, buttons
- Success Green (#10B981) - Accepted status
- Warning Amber (#F59E0B) - Pending status
- Danger Red (#EF4444) - Rejected status

---

## ⚡ TL;DR (Too Long; Didn't Read)

```cmd
# 1. Fix Lombok
cd "c:\Users\lenovo\Documents\DevFlux\FlexiSAF Admission API\backend"
fix-lombok.bat

# 2. Create DB (if needed)
cd ..
create-database.bat

# 3. Start backend (new terminal)
cd backend
mvnw.cmd spring-boot:run

# 4. Start frontend (another new terminal)
cd frontend
npm install
npm run dev
```

**Access:** http://localhost:3000 🎉

---

**You're all set! Just follow the 3 steps above and you'll have a fully functional admissions system!** 🚀
