@echo off
setlocal
title Que Curso - Hoerprobe erstellen
cd /d "%~dp0"

echo.
echo  Erzeugt Hoerproben mit Azure und/oder Google (offizielle Schnittstellen).
echo  Du kannst jede Frage mit Enter ueberspringen. Die Schluessel gelten nur fuer dieses
echo  Fenster und werden nirgends gespeichert. Die Hoerproben verbrauchen etwa 5.000 Zeichen
echo  und liegen damit weit unter den Gratis-Kontingenten.
echo.

where node >nul 2>nul
if errorlevel 1 goto nonode

set /p AZURE_SPEECH_KEY=Azure Speech Key (oder Enter):
if "%AZURE_SPEECH_KEY%"=="" goto google
set /p AZURE_SPEECH_REGION=Azure Region, zum Beispiel westeurope:
:google
set /p GOOGLE_TTS_API_KEY=Google API-Key (oder Enter):
echo.

ver >nul
call node tools\make-samples.js
if errorlevel 1 goto fail

echo.
echo  Fertig. Die Hoerprobe-Seite wird geoeffnet.
start "" msedge "%~dp0tools\hoerprobe.html"
if errorlevel 1 start "" "%~dp0tools\hoerprobe.html"
echo.
pause
exit /b 0

:nonode
echo Node.js wurde nicht gefunden. Installiere es von https://nodejs.org und starte die Datei nochmal.
pause
exit /b 1

:fail
echo.
echo Das hat nicht geklappt. Lies die Meldung oben (oft ein falscher Schluessel oder eine falsche Region).
pause
exit /b 1
