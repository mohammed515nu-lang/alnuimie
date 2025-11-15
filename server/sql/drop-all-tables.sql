-- ============================================
-- حذف جميع الجداول والكائنات الموجودة
-- استخدم هذا السكريبت لإعادة بناء قاعدة البيانات من الصفر
-- ============================================

USE construction_management;
GO

-- تعطيل جميع Foreign Keys مؤقتاً
EXEC sp_MSforeachtable "ALTER TABLE ? NOCHECK CONSTRAINT ALL";
GO

-- حذف جميع الجداول
EXEC sp_MSforeachtable "DROP TABLE ?";
GO

PRINT 'تم حذف جميع الجداول بنجاح!';
PRINT 'يمكنك الآن تنفيذ schema.sql لإعادة إنشاء الجداول';
GO










