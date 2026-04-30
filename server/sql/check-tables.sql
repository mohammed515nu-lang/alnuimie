-- ============================================
-- التحقق من الجداول الموجودة في قاعدة البيانات
-- ============================================

USE construction_management;
GO

-- عرض جميع الجداول الموجودة
SELECT 
    TABLE_SCHEMA,
    TABLE_NAME,
    TABLE_TYPE
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_TYPE = 'BASE TABLE'
ORDER BY TABLE_NAME;
GO

-- عدد الجداول
SELECT COUNT(*) AS TotalTables
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_TYPE = 'BASE TABLE';
GO










