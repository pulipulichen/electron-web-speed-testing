cd %~dp0
cd ..\www
rmdir /S /Q webapp-wrapper-win32-x64
npm run build
