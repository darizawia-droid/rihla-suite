@echo off
echo 🛠️ INSTALLATION AUTOMATIQUE DE RIHLA ENTERPRISE...
echo.

echo 📦 1/2 Installation du Frontend (Node.js)...
cd /d "%~dp0frontend"
call npm install
if %errorlevel% neq 0 (
    echo ❌ Erreur lors de l'installation du Frontend. Verifiez que Node.js est installe.
    pause
    exit /b
)

echo.
echo 🐍 2/2 Installation du Backend (Python)...
cd /d "%~dp0backend"
python -m pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ❌ Erreur lors de l'installation du Backend. Verifiez que Python est installe.
    pause
    exit /b
)

echo.
echo ✅ TOUT EST INSTALLE !
echo 🚀 Vous pouvez maintenant fermer cette fenetre et lancer START.bat
pause
