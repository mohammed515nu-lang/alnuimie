@echo off
echo ========================================
echo إعداد المشروع لـ GitHub الجديد
echo ========================================
echo.

REM إعداد Git
git config --global user.email "mohammed515nu@gmail.com"
echo تم إعداد البريد الإلكتروني
echo.

REM إزالة الـ remote القديم
git remote remove origin
echo تم إزالة الـ remote القديم
echo.

echo ========================================
echo الآن تحتاج إلى:
echo 1. إنشاء Repository جديد على GitHub
echo 2. نسخ رابط الـ Repository
echo 3. تشغيل الأمر التالي:
echo.
echo git remote add origin https://github.com/YOUR_USERNAME/construction-client.git
echo git push -u origin main
echo.
echo ========================================
pause


























































