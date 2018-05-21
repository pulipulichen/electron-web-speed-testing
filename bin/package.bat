cd %~dp0
cd ../dist

echo Copy webapp-wrapper-win32-x64
xcopy /s/y/D ..\src\webapp-wrapper-win32-x64\* ..\dist\webapp-wrapper-win32-x64\*

echo Copy loading test.exe
copy "..\autoit\loading test.exe" .\

echo Build package

echo Delete files
rmdir /S /Q .\webapp-wrapper-win32-x64
del ".\loading test.exe"

pause
