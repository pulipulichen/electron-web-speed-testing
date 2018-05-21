cd %~dp0
cd ../dist

echo Copy webapp-wrapper-win32-x64
xcopy /s/y ..\src\webapp-wrapper-win32-x64 .\webapp-wrapper-win32-x64

echo Copy loading test.exe
xcopy /s/y "..\autoit\loading test.exe" ".\loading test.exe"

echo Build package

echo Delete files
rmdir /S /Q .\webapp-wrapper-win32-x64
del ".\loading test.exe"

pause
