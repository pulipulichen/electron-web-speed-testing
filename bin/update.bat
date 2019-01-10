cd %~dp0
xcopy /s/y ..\www\loading-test ..\dist\electron-loading-test\webapp-wrapper-win32-x64\resources\app\loading-test
xcopy /s/y ..\webapp-config.json ..\dist\electron-loading-test\webapp-wrapper-win32-x64\webapp-config.json
cd ..\dist\electron-loading-test
start /B electron-loading-test.exe