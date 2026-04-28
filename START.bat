@echo off
echo 🚀 Lancement ABSOLU de RIHLA Enterprise Platform...

:: Se positionner dans le dossier du script
cd /d "%~dp0"

:: Nettoyage des processus fantômes
taskkill /F /IM node.exe /T >nul 2>&1
taskkill /F /IM python.exe /T >nul 2>&1

:: Lancement Backend
echo 🔍 Verification du dossier Backend...
if exist "backend" (
    start "RIHLA BACKEND" cmd /k "cd /d "%~dp0backend" && (python -m uvicorn app.main:app --reload --port 8000 || python3 -m uvicorn app.main:app --reload --port 8000 || echo ❌ ERREUR: Python ou Uvicorn non trouve)"
) else (
    echo ❌ ERREUR: Le dossier 'backend' est introuvable ici.
)

:: Lancement Frontend
echo 🔍 Verification du dossier Frontend...
if exist "frontend" (
    start "RIHLA FRONTEND" cmd /k "cd /d "%~dp0frontend" && (npm run dev || npx vite --port 5173 || echo ❌ ERREUR: Node.js/NPM non trouve)"
) else (
    echo ❌ ERREUR: Le dossier 'frontend' est introuvable ici.
)

echo.
echo ✅ Tentative de lancement terminee. Verifiez les nouvelles fenetres.
pause
