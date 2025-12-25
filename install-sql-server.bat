@echo off
chcp 65001 >nul
echo ========================================
echo 🗄️  تثبيت SQL Server من Terminal
echo ========================================
echo.

echo [1/2] تثبيت SQL Server 2022 Express (مجاني)...
winget install Microsoft.SQLServer.2022.Express --accept-package-agreements --accept-source-agreements
if %errorlevel% neq 0 (
    echo ❌ فشل تثبيت SQL Server
    pause
    exit /b 1
)
echo ✅ تم تثبيت SQL Server Express
echo.

echo [2/2] تثبيت SQL Server Management Studio (SSMS)...
winget install Microsoft.SQLServerManagementStudio --accept-package-agreements --accept-source-agreements
if %errorlevel% neq 0 (
    echo ⚠️  فشل تثبيت SSMS (اختياري)
) else (
    echo ✅ تم تثبيت SSMS
)
echo.

echo ========================================
echo ✅ تم التثبيت بنجاح!
echo ========================================
echo.
echo 📝 ملاحظات:
echo - SQL Server Express مجاني لكن محدود
echo - SSMS هو واجهة رسومية لإدارة SQL Server
echo - بعد التثبيت، قم بإعادة تشغيل الكمبيوتر
echo.

pause

























































