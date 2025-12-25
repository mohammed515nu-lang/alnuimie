@echo off
chcp 65001 >nul
echo ========================================
echo 🗄️  تثبيت MySQL من Terminal
echo ========================================
echo.

echo [1/3] التحقق من Chocolatey...
choco --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Chocolatey غير مثبت!
    echo.
    echo 📥 تثبيت Chocolatey أولاً...
    echo.
    echo قم بتشغيل PowerShell كـ Administrator ثم نفذ:
    echo Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
    echo.
    pause
    exit /b 1
)
echo ✅ Chocolatey مثبت
echo.

echo [2/3] تثبيت MySQL...
choco install mysql -y
if %errorlevel% neq 0 (
    echo ❌ فشل تثبيت MySQL
    pause
    exit /b 1
)
echo ✅ تم تثبيت MySQL
echo.

echo [3/3] إعداد MySQL...
echo.
echo 📝 الخطوات التالية:
echo 1. قم بتشغيل MySQL Service:
echo    net start mysql
echo.
echo 2. قم بتسجيل الدخول:
echo    mysql -u root -p
echo.
echo 3. قم بإنشاء قاعدة البيانات:
echo    mysql -u root -p ^< server\sql\schema.sql
echo.

pause

























































