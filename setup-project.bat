@echo off
chcp 65001 >nul
echo ========================================
echo 🚀 إعداد المشروع من الصفر
echo ========================================
echo.

echo [1/4] تثبيت Frontend Dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ فشل تثبيت Frontend Dependencies
    pause
    exit /b 1
)
echo ✅ تم تثبيت Frontend Dependencies
echo.

echo [2/4] تثبيت Backend Dependencies...
cd server
call npm install
if %errorlevel% neq 0 (
    echo ❌ فشل تثبيت Backend Dependencies
    cd ..
    pause
    exit /b 1
)
cd ..
echo ✅ تم تثبيت Backend Dependencies
echo.

echo [3/4] إنشاء ملف .gitignore...
if not exist .gitignore (
    (
        echo # Dependencies
        echo node_modules/
        echo server/node_modules/
        echo.
        echo # Build
        echo build/
        echo dist/
        echo.
        echo # Environment
        echo .env
        echo server/.env
        echo.
        echo # Logs
        echo *.log
        echo npm-debug.log*
        echo.
        echo # OS
        echo .DS_Store
        echo Thumbs.db
        echo.
        echo # IDE
        echo .vscode/
        echo .idea/
        echo *.swp
        echo *.swo
        echo.
        echo # Temporary
        echo *.tmp
        echo *.temp
    ) > .gitignore
    echo ✅ تم إنشاء .gitignore
) else (
    echo ℹ️  ملف .gitignore موجود بالفعل
)
echo.

echo [4/4] تهيئة Git...
if not exist .git (
    call git init
    echo ✅ تم تهيئة Git
) else (
    echo ℹ️  Git موجود بالفعل
)
echo.

echo ========================================
echo ✅ تم إعداد المشروع بنجاح!
echo ========================================
echo.
echo 📝 الخطوات التالية:
echo 1. أنشئ ملف .env في المجلد الرئيسي
echo 2. أنشئ ملف .env في مجلد server/
echo 3. قم بعمل Build: npm run build
echo 4. اربط مع GitHub (اختياري)
echo.
pause

























































