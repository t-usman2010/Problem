@echo off
setlocal

set "ROOT=%~dp0"
set "BACKEND=%ROOT%backend"
set "FRONTEND=%ROOT%frontend"

if not exist "%BACKEND%\package.json" (
    echo Backend folder or package.json was not found.
    pause
    exit /b 1
)

if not exist "%FRONTEND%\package.json" (
    echo Frontend folder or package.json was not found.
    pause
    exit /b 1
)

where npm >nul 2>&1
if errorlevel 1 (
    echo npm was not found. Install Node.js and try again.
    pause
    exit /b 1
)

echo Starting MongoDB...
sc query MongoDB >nul 2>&1
if errorlevel 1 (
    echo MongoDB Windows service was not found.
    echo Install MongoDB Community Edition, then run this file again.
    pause
    exit /b 1
)

sc query MongoDB | findstr /I "RUNNING" >nul
if errorlevel 1 (
    net start MongoDB
    if errorlevel 1 (
        echo Could not start the MongoDB service.
        echo Try running this file as Administrator.
        pause
        exit /b 1
    )
) else (
    echo MongoDB is already running.
)

echo Starting backend...
start "Civic Issue Reporter - Backend" cmd /k "cd /d ""%BACKEND%"" && npm start"

echo Starting frontend...
start "Civic Issue Reporter - Frontend" cmd /k "cd /d ""%FRONTEND%"" && npm start"

echo.
echo Project processes have been started.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Keep the Backend and Frontend windows open while using the project.
timeout /t 3 /nobreak >nul
start "" "http://localhost:3000"

endlocal
