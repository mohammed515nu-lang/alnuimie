@echo off
chcp 65001 >nul
echo ========================================
echo 🔧 إعداد Git
echo ========================================
echo.

echo [1/3] التحقق من Git...
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git غير مثبت!
    echo.
    echo 📥 قم بتحميل Git من:
    echo https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)
echo ✅ Git مثبت
echo.

echo [2/3] تهيئة Git...
if not exist .git (
    call git init
    echo ✅ تم تهيئة Git
) else (
    echo ℹ️  Git موجود بالفعل
)
echo.

echo [3/3] إضافة الملفات...
call git add .
echo ✅ تم إضافة الملفات
echo.

echo ========================================
echo ✅ تم إعداد Git بنجاح!
echo ========================================
echo.
echo 📝 الخطوات التالية:
echo 1. قم بعمل Commit:
echo    git commit -m "Initial commit"
echo.
echo 2. اربط مع GitHub (اختياري):
echo    git remote add origin https://github.com/username/repo.git
echo    git push -u origin main
echo.
pause

























































