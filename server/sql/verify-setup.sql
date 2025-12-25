-- ============================================
-- التحقق من إعداد قاعدة البيانات
-- ============================================

USE construction_management;
GO

-- 1. التحقق من الجداول
PRINT '=== الجداول الموجودة ===';
SELECT 
    TABLE_NAME AS 'اسم الجدول',
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = t.TABLE_NAME) AS 'عدد الأعمدة'
FROM INFORMATION_SCHEMA.TABLES t
WHERE TABLE_TYPE = 'BASE TABLE'
ORDER BY TABLE_NAME;
GO

-- 2. التحقق من العلاقات (Foreign Keys)
PRINT '';
PRINT '=== العلاقات (Foreign Keys) ===';
SELECT 
    fk.name AS 'اسم العلاقة',
    OBJECT_NAME(fk.parent_object_id) AS 'الجدول',
    COL_NAME(fc.parent_object_id, fc.parent_column_id) AS 'العمود',
    OBJECT_NAME(fk.referenced_object_id) AS 'الجدول المرجعي',
    COL_NAME(fc.referenced_object_id, fc.referenced_column_id) AS 'العمود المرجعي',
    CASE 
        WHEN fk.delete_referential_action = 0 THEN 'NO ACTION'
        WHEN fk.delete_referential_action = 1 THEN 'CASCADE'
        WHEN fk.delete_referential_action = 2 THEN 'SET NULL'
        WHEN fk.delete_referential_action = 3 THEN 'SET DEFAULT'
    END AS 'حذف'
FROM sys.foreign_keys AS fk
INNER JOIN sys.foreign_key_columns AS fc 
    ON fk.object_id = fc.constraint_object_id
ORDER BY OBJECT_NAME(fk.parent_object_id), fk.name;
GO

-- 3. عدد العلاقات
PRINT '';
PRINT '=== ملخص ===';
SELECT 
    COUNT(DISTINCT TABLE_NAME) AS 'عدد الجداول',
    (SELECT COUNT(*) FROM sys.foreign_keys) AS 'عدد العلاقات'
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_TYPE = 'BASE TABLE';
GO

PRINT '';
PRINT '✅ تم التحقق من قاعدة البيانات بنجاح!';
PRINT 'يمكنك الآن إنشاء Database Diagram لرؤية العلاقات';
GO










