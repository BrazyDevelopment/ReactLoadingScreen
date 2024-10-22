@echo off
npm run build
if not exist "..\tmf-loadingscreen\web" mkdir "..\tmf-loadingscreen\web"
xcopy /s /y "dist\*" "..\tmf-loadingscreen\web\dist\"
xcopy /s /y "public\assets\*" "..\tmf-loadingscreen\web\assets\"