@echo off
title Push PLC Textbook to GitHub
cd /d "C:\Users\hoang\.gemini\antigravity\scratch\plc-textbook"
echo ========================================================
echo DANG PUSH CODE LEN GITHUB: hoangnguyen123cp5-glitch/plc-textbook
echo ========================================================
git push -u origin master:main --force
echo.
echo ========================================================
echo HOAN TAT! Nhan phim bat ky de dong cua so nay...
pause
