-- ============================================
-- إعداد كامل لقاعدة البيانات
-- هذا السكريبت يتحقق من الجداول وينشئها إذا لم تكن موجودة
-- ============================================

USE construction_management;
GO

-- التحقق من وجود الجداول
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'users')
BEGIN
    PRINT '⚠️ الجداول غير موجودة!';
    PRINT 'يرجى تنفيذ schema.sql أولاً لإنشاء الجداول.';
    PRINT '';
    PRINT 'الخطوات:';
    PRINT '1. افتح schema.sql في SSMS';
    PRINT '2. اضغط F5 (Execute)';
    PRINT '3. ثم شغّل add-relationships-only.sql';
    RETURN;
END
ELSE
BEGIN
    PRINT '✅ الجداول موجودة!';
    PRINT 'يمكنك الآن إضافة العلاقات باستخدام add-relationships-only.sql';
END
GO

-- عرض الجداول الموجودة
SELECT 
    TABLE_NAME AS 'اسم الجدول',
    CASE 
        WHEN TABLE_NAME IN ('users', 'projects', 'materials', 'suppliers') THEN '✅ موجود'
        ELSE '❌ غير موجود'
    END AS 'الحالة'
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_TYPE = 'BASE TABLE'
ORDER BY TABLE_NAME;
GO










