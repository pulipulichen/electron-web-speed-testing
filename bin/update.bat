cd %~dp0
xcopy /s/y ..\www\loading-test ..\www\webapp-wrapper-win32-x64\resources\app\loading-test
xcopy /s/y ..\webapp-config.json ..\www\webapp-wrapper-win32-x64\webapp-config.json
cd ..\www\webapp-wrapper-win32-x64
start /B electron-loading-test.exe