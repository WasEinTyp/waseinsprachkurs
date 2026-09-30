@echo off
chcp 65001 >nul
title ¡Qué Curso! – veröffentlichen
cd /d "%~dp0"

echo.
echo  Bereitet die App für das Handy vor und lädt sie zu GitHub hoch.
echo  (Voraussetzung: einmalig eingerichtet laut Anleitung in README.md, Abschnitt "Aufs iPhone".)
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js wurde nicht gefunden. Installiere es von https://nodejs.org und starte die Datei nochmal.
  pause
  exit /b 1
)
where git >nul 2>nul
if errorlevel 1 (
  echo Git wurde nicht gefunden. Installiere es von https://git-scm.com und starte die Datei nochmal.
  pause
  exit /b 1
)

echo [1/3] Offline-Dateiliste und Version aktualisieren ...
node tools\build-pwa.js
if errorlevel 1 ( echo Fehler beim Aktualisieren. & pause & exit /b 1 )

echo [2/3] Änderungen sichern ...
git add -A
git commit -m "Update %DATE% %TIME%" >nul 2>nul
if errorlevel 1 echo      (keine neuen Änderungen)

echo [3/3] Zu GitHub hochladen ...
git push
if errorlevel 1 (
  echo.
  echo Hochladen hat nicht geklappt. Ist das Repository verbunden ^(git remote -v^) und bist du bei GitHub angemeldet?
  pause
  exit /b 1
)

echo.
echo  Fertig! In etwa einer Minute ist die neue Version online.
echo  Auf dem iPhone: App öffnen, schließen und nochmal öffnen – dann ist das Update da.
echo.
pause
