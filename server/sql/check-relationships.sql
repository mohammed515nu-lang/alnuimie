-- ============================================
-- فحص العلاقات (Foreign Keys) في قاعدة البيانات
-- ============================================

USE construction_management;
GO

-- عرض جميع العلاقات الموجودة
SELECT 
    fk.name AS ForeignKeyName,
    OBJECT_NAME(fk.parent_object_id) AS TableName,
    COL_NAME(fc.parent_object_id, fc.parent_column_id) AS ColumnName,
    OBJECT_NAME(fk.referenced_object_id) AS ReferencedTableName,
    COL_NAME(fc.referenced_object_id, fc.referenced_column_id) AS ReferencedColumnName
FROM sys.foreign_keys AS fk
INNER JOIN sys.foreign_key_columns AS fc 
    ON fk.object_id = fc.constraint_object_id
ORDER BY TableName, ForeignKeyName;
GO

-- عرض عدد العلاقات لكل جدول
SELECT 
    OBJECT_NAME(fk.parent_object_id) AS TableName,
    COUNT(*) AS ForeignKeyCount
FROM sys.foreign_keys AS fk
GROUP BY OBJECT_NAME(fk.parent_object_id)
ORDER BY ForeignKeyCount DESC;
GO










