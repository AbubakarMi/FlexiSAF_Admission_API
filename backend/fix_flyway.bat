@echo off
SET PGPASSWORD=root
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d Admission_Db -c "DELETE FROM flyway_schema_history WHERE version = '4';"
echo.
echo Migration record deleted successfully!
echo Now starting the backend server...
echo.
pause
