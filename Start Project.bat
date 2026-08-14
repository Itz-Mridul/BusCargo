@echo off
echo ===================================================
echo Starting BusCargo Project...
echo ===================================================

echo [1/4] Installing/Verifying Backend Dependencies...
cd backend
call npm install
cd ..

echo [2/4] Installing/Verifying Frontend Dependencies...
cd frontend
call npm install
cd ..

echo [3/4] Starting Servers...
echo Both frontend and backend logs will appear in THIS window.
start /b cmd /c "cd backend && npm run dev"
start /b cmd /c "cd frontend && npm run dev"

echo Waiting for servers to initialize (10 seconds)...
timeout /t 10 /nobreak >nul

echo Opening BusCargo in your default web browser...
start http://localhost:5173

echo.
echo ===================================================
echo BusCargo is now successfully running! 
echo - Frontend: http://localhost:5173
echo - Backend: http://localhost:3001
echo ===================================================
echo To stop the servers, simply close this command prompt window.
echo (Press Ctrl+C if you want to stop the processes)
echo.
pause
