# 🔗 إضافة العلاقات يدوياً في SQL Server Management Studio

## 📋 الخطوات:

### الطريقة 1: استخدام Table Designer (الأسهل)

1. **افتح جدول يحتوي على Foreign Key:**
   - في Object Explorer، انقر بزر الماوس الأيمن على `projects` → **Design**

2. **افتح Foreign Key Relationships:**
   - في شريط الأدوات، انقر على أيقونة **"Relationships"** (🔗)
   - أو من القائمة: **Table Designer** → **Relationships**

3. **إضافة علاقة جديدة:**
   - انقر على **"Add"**
   - في **"Tables and Columns Specification"**، انقر على **"..."** بجانبها

4. **تحديد العلاقة:**
   - **Primary Key Table:** اختر `users`
   - **Primary Key Column:** اختر `id`
   - **Foreign Key Table:** اختر `projects`
   - **Foreign Key Column:** اختر `client_id`
   - انقر **OK**

5. **تسمية العلاقة:**
   - في **"Name"**، اكتب: `FK_projects_client_id`

6. **تحديد خيارات الحذف:**
   - **Delete Rule:** اختر `Set Null` (لأن `client_id` يمكن أن يكون NULL)

7. **حفظ:**
   - اضغط **Ctrl+S** أو **File** → **Save**
   - انقر **Yes** عند السؤال عن حفظ التغييرات

---

### الطريقة 2: استخدام SQL Script (الأسرع)

**شغّل هذا السكريبت في SSMS:**

```sql
USE construction_management;
GO

-- إضافة العلاقات الأساسية
ALTER TABLE projects
ADD CONSTRAINT FK_projects_client_id 
FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE SET NULL;
GO

ALTER TABLE projects
ADD CONSTRAINT FK_projects_contractor_id 
FOREIGN KEY (contractor_id) REFERENCES users(id) ON DELETE SET NULL;
GO

ALTER TABLE projects
ADD CONSTRAINT FK_projects_created_by 
FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL;
GO

ALTER TABLE materials
ADD CONSTRAINT FK_materials_project_id 
FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;
GO

ALTER TABLE materials
ADD CONSTRAINT FK_materials_supplier_id 
FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL;
GO
```

---

## ✅ بعد إضافة العلاقات:

1. **أغلق Database Diagram الحالي**
2. **أنشئ مخطط جديد:**
   - انقر بزر الماوس الأيمن على **"Database Diagrams"** → **"New Database Diagram"**
3. **أضف الجداول:**
   - اختر جميع الجداول أو الجداول المطلوبة
4. **ستظهر الأسهم تلقائياً!** 🎯

---

## 🔍 التحقق من العلاقات:

شغّل هذا السكريبت للتحقق:

```sql
USE construction_management;
GO

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
```

---

## ⚠️ ملاحظات مهمة:

1. **ترتيب الجداول مهم:**
   - يجب إنشاء الجدول المرجعي (مثل `users`) قبل الجدول الذي يحتوي على Foreign Key (مثل `projects`)

2. **إذا ظهر خطأ "Cannot add foreign key constraint":**
   - تأكد من أن الجدول المرجعي موجود
   - تأكد من أن نوع البيانات متطابق
   - تأكد من أن القيم الموجودة في Foreign Key موجودة في الجدول المرجعي

3. **لرؤية العلاقات في المخطط:**
   - تأكد من أن المخطط محدث (Refresh)
   - جرب إغلاق وفتح المخطط مرة أخرى










