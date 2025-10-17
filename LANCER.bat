@echo off
echo ========================================
echo   LANCEMENT DE L'APPLICATION
echo   Entretiens Pharmaceutiques
echo ========================================
echo.

REM Essayer d'ouvrir avec Python
where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Python detecte
    echo.
    echo Serveur demarre sur http://localhost:8000
    echo Appuyez sur Ctrl+C pour arreter
    echo.
    start http://localhost:8000
    python -m http.server 8000
    goto :end
)

REM Si Python n'est pas disponible, ouvrir directement le fichier HTML
echo [INFO] Python non detecte, ouverture directe du fichier...
echo.
start index.html

:end
pause
