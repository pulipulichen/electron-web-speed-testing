cd %~dp0
xcopy /s/y ..\src\loading-test ..\src\webapp-wrapper-win32-x64\resources\app\loading-test
cd ..\src\webapp-wrapper-win32-x64
start /B electron-loading-test.exe