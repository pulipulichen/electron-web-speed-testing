cd %~dp0
copy ..\config\startup-webapp.bat ..\www\webapp-wrapper-win32-x64\
copy ..\webapp-config.json ..\www\webapp-wrapper-win32-x64\
copy ..\autoit\startup-webapp.exe ..\www\webapp-wrapper-win32-x64\
ren ..\www\webapp-wrapper-win32-x64\startup-webapp.exe electron-loading-test.exe 
cd ..\www\webapp-wrapper-win32-x64\
start /B electron-loading-test.exe 