@echo off
echo Running Indoor Parameter Setup Fix...
echo.

echo Step 1: Running SQL script to fix database table...
mysql -u root -p lordop < fix-parameter-table.sql
echo.

echo Step 2: Testing parameter API...
echo Starting test server on port 5001...
echo Visit: http://localhost:5001/test-parameters
echo.
node test-parameter-api.js

pause