@echo off
cd /d "%~dp0"
start "" msedge "%~dp0tools\hoerprobe.html"
if errorlevel 1 start "" "%~dp0tools\hoerprobe.html"
