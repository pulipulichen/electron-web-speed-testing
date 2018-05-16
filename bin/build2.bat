cd %~dp0
copy ..\config\startup-webapp.bat ..\src\webapp-wrapper-win32-x64\
copy ..\webapp-config.json ..\src\webapp-wrapper-win32-x64\
copy ..\autoit\startup-webapp.exe ..\src\webapp-wrapper-win32-x64\
ren ..\src\webapp-wrapper-win32-x64\startup-webapp.exe electron-loading-test.exe 
cd ..\src\webapp-wrapper-win32-x64\
start /B electron-loading-test.exe 