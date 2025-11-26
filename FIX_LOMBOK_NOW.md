# Fix Lombok Errors - Step by Step Guide

## The Problem

You're seeing errors like:
```
package lombok does not exist
cannot find symbol: class Data
cannot find symbol: class NoArgsConstructor
```

This happens because Maven hasn't downloaded the Lombok dependency yet.

---

## Solution 1: Using the Fix Script (EASIEST) ⚡

1. Open Command Prompt or PowerShell
2. Navigate to the backend folder:
   ```cmd
   cd "c:\Users\lenovo\Documents\DevFlux\FlexiSAF Admission API\backend"
   ```
3. Run the fix script:
   ```cmd
   fix-lombok.bat
   ```
4. Wait for it to complete (may take 2-3 minutes)
5. Reload your IDE/editor

---

## Solution 2: Manual Command Line Fix

1. Open Command Prompt
2. Navigate to backend:
   ```cmd
   cd "c:\Users\lenovo\Documents\DevFlux\FlexiSAF Admission API\backend"
   ```
3. Run these commands:
   ```cmd
   mvnw.cmd clean
   mvnw.cmd install -U -DskipTests
   ```
4. Reload your IDE

---

## Solution 3: Using Your IDE

### If using VS Code:

1. Open Command Palette (`Ctrl+Shift+P`)
2. Type: "Java: Clean Java Language Server Workspace"
3. Select it and restart VS Code
4. Open Command Palette again
5. Type: "Java: Force Java Compilation - Full"
6. Wait for it to complete

### If using Eclipse:

1. Right-click on the `backend` project
2. Select **Maven** → **Update Project** (or press `Alt+F5`)
3. Check ✅ **"Force Update of Snapshots/Releases"**
4. Click **OK**
5. Wait for Maven to download dependencies

### If using IntelliJ IDEA:

1. Right-click on `pom.xml`
2. Select **Maven** → **Reload Project**
3. Wait for indexing to complete

---

## Solution 4: Install Maven Globally (Alternative)

If you have Maven installed globally:

```cmd
cd "c:\Users\lenovo\Documents\DevFlux\FlexiSAF Admission API\backend"
mvn clean install -U -DskipTests
```

---

## How to Verify It's Fixed

### Method 1: Check in IDE
- Open any DTO file (like `AIHintDTO.java`)
- The `@Data`, `@NoArgsConstructor`, etc. should NOT have red underlines
- No errors in the Problems/Errors panel

### Method 2: Try to Run
```cmd
cd backend
mvnw.cmd spring-boot:run
```

If it starts successfully, Lombok is working!

---

## Common Issues

### Issue 1: "mvnw.cmd not found"

**Solution:**
The `mvnw.cmd` file has been created for you. Make sure you're in the `backend` folder:
```cmd
cd "c:\Users\lenovo\Documents\DevFlux\FlexiSAF Admission API\backend"
dir mvnw.cmd
```

If not found, download Maven wrapper:
```cmd
mvn wrapper:wrapper
```

### Issue 2: "JAVA_HOME not set"

**Solution:**
Set JAVA_HOME environment variable:

1. Find your Java installation (usually `C:\Program Files\Java\jdk-17` or similar)
2. Open System Properties → Environment Variables
3. Add new System Variable:
   - Name: `JAVA_HOME`
   - Value: `C:\Program Files\Java\jdk-17` (your Java path)
4. Restart Command Prompt

**Or set temporarily:**
```cmd
set JAVA_HOME=C:\Program Files\Java\jdk-17
set PATH=%JAVA_HOME%\bin;%PATH%
```

### Issue 3: Dependencies download failed

**Solution:**
Check your internet connection and try again with:
```cmd
mvnw.cmd clean install -U
```

The `-U` flag forces Maven to check for updates.

### Issue 4: Still seeing Lombok errors after running fix

**Solution:**
1. Close your IDE completely
2. Delete these folders if they exist:
   - `backend/target`
   - `backend/.settings`
3. Run the fix script again
4. Open your IDE and reload the project

---

## What the Fix Does

When you run `mvnw.cmd install -U`:

1. ✅ Downloads all Maven dependencies (including Lombok)
2. ✅ Compiles the project
3. ✅ Configures annotation processors
4. ✅ Creates necessary metadata for your IDE

After this, your IDE will recognize:
- `@Data` - Auto-generates getters, setters, toString, equals, hashCode
- `@NoArgsConstructor` - Creates no-argument constructor
- `@AllArgsConstructor` - Creates constructor with all fields
- `@Builder` - Enables builder pattern

---

## Expected Output

When running the fix script, you should see:

```
[INFO] Scanning for projects...
[INFO]
[INFO] ----< com.flexisaf:admissions-system >----
[INFO] Building FlexiSAF Admissions System 1.0.0
[INFO] --------------------------------[ jar ]---------------------------------
...
[INFO] Downloaded from central: https://repo.maven.apache.org/...
...
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
```

---

## Quick Test

After fixing, test with this command:

```cmd
cd backend
mvnw.cmd compile
```

Should see:
```
[INFO] BUILD SUCCESS
```

---

## Still Having Issues?

If Lombok errors persist:

1. **Check Java version:**
   ```cmd
   java -version
   ```
   Should be Java 17 or higher

2. **Check Maven wrapper exists:**
   ```cmd
   dir mvnw.cmd
   ```

3. **Try manual dependency download:**
   ```cmd
   mvnw.cmd dependency:resolve
   ```

4. **Check if Lombok was downloaded:**
   Look for file in:
   ```
   %USERPROFILE%\.m2\repository\org\projectlombok\lombok
   ```

5. **Nuclear option (clean everything):**
   ```cmd
   rmdir /s /q target
   rmdir /s /q %USERPROFILE%\.m2\repository\com\flexisaf
   mvnw.cmd clean install -U
   ```

---

## After Fix is Complete

✅ Lombok errors should be gone
✅ No red underlines in DTO files
✅ Backend should compile and run successfully
✅ You can now start the application

**Next step:** Run the application!

```cmd
mvnw.cmd spring-boot:run
```

---

## Port Change Summary

✅ **Frontend port changed from 5173 to 3000**
✅ **New URL:** http://localhost:3000
✅ **CORS already configured for port 3000**

Start frontend with:
```cmd
cd frontend
npm install
npm run dev
```

Access at: http://localhost:3000

---

**The fixes are ready! Just run the fix-lombok.bat script and you're good to go!** 🚀
