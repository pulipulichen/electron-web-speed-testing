cd %~dp0
cd ../dist

del "..\www\webapp-wrapper-win32-x64\resources\app\cache\local_storage_loading_test_config.json"
del ".\electron-loading-test-dist.7z"

echo Copy webapp-wrapper-win32-x64
xcopy /s/y/D ..\www\webapp-wrapper-win32-x64\* ..\dist\electron-loading-test\webapp-wrapper-win32-x64\*

echo Copy loading test.exe
copy "..\autoit\electron-loading-test.exe" .\electron-loading-test\

echo Build package
cd ../bin/7-Zip64/
7z.exe a -mx9 -t7z ../../dist/electron-loading-test-dist.7z "../../dist/electron-loading-test"
cd ../../dist

echo Delete files
rmdir /S /Q .\electron-loading-test

start "" https://drive.google.com/open?id=1w_fEdw5w5etIYKPDI4PcGn3tYEHipr9e