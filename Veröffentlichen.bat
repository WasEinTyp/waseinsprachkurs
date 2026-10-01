@echo off
setlocal
title Que Curso - veroeffentlichen
cd /d "%~dp0"

echo.
echo  Bereitet die App fuers Handy vor und laedt sie zu GitHub hoch.
echo  Voraussetzung: Node.js und Git sind installiert und GitHub ist verbunden.
echo.

where node >nul 2>nul
if errorlevel 1 goto nonode
where git >nul 2>nul
if errorlevel 1 goto nogit

echo [1/3] Offline-Dateiliste und Version aktualisieren ...
call node tools\build-pwa.js
if errorlevel 1 goto fail

echo [2/3] Aenderungen sichern ...
call git add -A
call git commit -m "Update %DATE% %TIME%" >nul 2>nul
if errorlevel 1 echo      keine neuen Aenderungen

echo [3/3] Zu GitHub hochladen ...
call git push -u origin main
if errorlevel 1 goto pushfail

echo.
echo  Fertig! In etwa einer Minute ist die neue Version online.
echo  Auf dem iPhone: App oeffnen, komplett schliessen und nochmal oeffnen - dann ist das Update da.
echo.
pause
exit /b 0

:nonode
echo Node.js wurde nicht gefunden. Installiere es von https://nodejs.org und starte die Datei nochmal.
pause
exit /b 1

:nogit
echo Git wurde nicht gefunden. Installiere es von https://git-scm.com und starte die Datei nochmal.
pause
exit /b 1

:fail
echo Fehler beim Aktualisieren der Offline-Version.
pause
exit /b 1

:pushfail
echo.
echo Hochladen hat nicht geklappt. Ist das Repository verbunden? Pruefe mit: git remote -v
echo Und bist du bei GitHub angemeldet?
pause
exit /b 1
