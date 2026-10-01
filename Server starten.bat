@echo off
setlocal
title Que Curso - lokaler Server
cd /d "%~dp0"

where python >nul 2>nul
if not errorlevel 1 goto haspython
where py >nul 2>nul
if not errorlevel 1 goto haspy
echo Python wurde nicht gefunden. Installiere es von https://www.python.org und starte die Datei nochmal.
echo Oder oeffne einfach index.html per Doppelklick - das funktioniert auch ohne Server.
pause
exit /b 1

:haspython
echo.
echo  Que Curso laeuft auf http://localhost:5173
echo  Zum Beenden dieses Fenster schliessen.
echo.
start "" http://localhost:5173
python -m http.server 5173 --bind 127.0.0.1
exit /b 0

:haspy
echo.
echo  Que Curso laeuft auf http://localhost:5173
echo  Zum Beenden dieses Fenster schliessen.
echo.
start "" http://localhost:5173
py -m http.server 5173 --bind 127.0.0.1
exit /b 0
