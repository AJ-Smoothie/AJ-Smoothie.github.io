@echo off

echo.
echo Stopping Zensical / freeing port 8000...
echo.

REM Kill zensical by name if it is still running.
taskkill /F /IM zensical.exe >nul 2>&1

REM Kill whatever process owns port 8000 (if any).
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8000" ^| findstr "LISTENING"') do (
  echo Trying to kill PID %%a ...
  taskkill /F /PID %%a >nul 2>&1
)

timeout /t 2 /nobreak >nul

netstat -ano | findstr ":8000" | findstr "LISTENING" >nul
if %errorlevel%==0 (
  echo.
  echo Port 8000 is STILL stuck.
  echo.
  echo The old Zensical server is already dead, but Windows has not released the port yet.
  echo taskkill cannot fix that - there is no process left to kill.
  echo.
  echo Try this:
  echo   1. Close every browser tab on http://localhost:8000
  echo   2. Wait 30 seconds, then double-click this file again
  echo   3. If it is still stuck, restart your PC
  echo   4. Or use "Start Website (8001).bat" as a temporary workaround
  echo.
) else (
  echo Port 8000 is free. You can run Start Website.bat now.
  echo.
)

pause
