@echo off
echo ========================================
echo Fixing Lombok and Maven Dependencies
echo ========================================
echo.

echo Step 1: Cleaning Maven project...
call mvnw.cmd clean

echo.
echo Step 2: Installing dependencies (this may take a few minutes)...
call mvnw.cmd install -U -DskipTests

echo.
echo ========================================
echo Done!
echo ========================================
echo.
echo Next steps:
echo 1. In your IDE, refresh/reload the project
echo 2. If using Eclipse: Right-click project ^> Maven ^> Update Project
echo 3. If using IntelliJ: Right-click pom.xml ^> Maven ^> Reload Project
echo 4. If using VS Code: Reload window (Ctrl+Shift+P ^> Reload Window)
echo.
echo The Lombok errors should now be fixed.
echo.

pause
