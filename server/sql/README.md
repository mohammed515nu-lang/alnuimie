# 🗄️ قاعدة بيانات SQL Server - نظام إدارة المقاولات

## 📋 نظرة عامة

هذا المجلد يحتوي على ملفات SQL لإنشاء قاعدة بيانات SQL Server للمشروع.

**ملاحظة:** المشروع الحالي يستخدم MongoDB (NoSQL)، لكن يمكنك استخدام SQL Server أيضاً.

---

## 🚀 الإعداد السريع

### 1. تثبيت SQL Server Express:
- تحميل من: https://www.microsoft.com/en-us/sql-server/sql-server-downloads
- أو استخدام `winget install Microsoft.SQLServer.Express`

### 2. تثبيت SQL Server Management Studio (SSMS):
- تحميل من: https://docs.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms
- أو استخدام `winget install Microsoft.SQLServerManagementStudio`

### 3. إنشاء قاعدة البيانات:

#### الطريقة 1: استخدام SSMS
1. افتح SQL Server Management Studio
2. اتصل بـ SQL Server (LocalDB أو Express)
3. File → Open → File
4. اختر `schema.sql`
5. اضغط F5 أو Execute
6. كرر نفس الخطوات لـ `sample-data.sql`

#### الطريقة 2: استخدام sqlcmd
```bash
sqlcmd -S localhost -i schema.sql
sqlcmd -S localhost -i sample-data.sql
```

---

## 📁 الملفات

- `schema.sql` - Schema كامل لقاعدة البيانات (SQL Server T-SQL)
- `sample-data.sql` - بيانات تجريبية (اختياري)
- `README.md` - هذا الملف

---

## 🗂️ الجداول

### الجداول الرئيسية (10):
1. **users** - المستخدمون
2. **projects** - المشاريع
3. **materials** - المواد
4. **suppliers** - الموردون
5. **purchases** - المشتريات
6. **payments** - المدفوعات
7. **issues** - إصدار المواد
8. **contracts** - العقود
9. **requests** - الطلبات
10. **reports** - التقارير

### جداول إضافية (3):
11. **project_engineers** - المهندسين
12. **project_crews** - فرق العمل
13. **project_images** - صور المشاريع

---

## 🔗 العلاقات (Relationships)

### Foreign Keys:
- `projects.client_id` → `users.id`
- `projects.contractor_id` → `users.id`
- `materials.project_id` → `projects.id`
- `materials.supplier_id` → `suppliers.id`
- `purchases.supplier_id` → `suppliers.id`
- `purchases.material_id` → `materials.id`
- `payments.project_id` → `projects.id`
- `payments.supplier_id` → `suppliers.id`
- `issues.material_id` → `materials.id`
- `issues.project_id` → `projects.id`
- `contracts.project_id` → `projects.id`
- `contracts.client_id` → `users.id`
- `contracts.contractor_id` → `users.id`
- `requests.client_id` → `users.id`
- `requests.contractor_id` → `users.id`
- `reports.project_id` → `projects.id`

---

## 📊 Views

- `project_summary` - ملخص المشاريع

---

## ⚙️ Stored Procedures

- `CalculateProjectTotalCost` - حساب إجمالي تكلفة المشروع

**مثال الاستخدام:**
```sql
EXEC CalculateProjectTotalCost @project_id = 1;
```

---

## 🔔 Triggers

- `update_project_cost_after_purchase` - تحديث تكلفة المشروع تلقائياً عند إضافة مشتريات
- `trg_*_updated_at` - تحديث `updated_at` تلقائياً عند تحديث السجلات

---

## 🔧 استخدام مع Node.js

### تثبيت SQL Server Driver:
```bash
npm install mssql
```

### مثال الاتصال:
```javascript
const sql = require('mssql');

const config = {
  server: 'localhost',
  database: 'construction_management',
  user: 'sa',
  password: 'YourPassword123',
  options: {
    encrypt: false, // Use true for Azure
    trustServerCertificate: true
  }
};

async function connect() {
  try {
    await sql.connect(config);
    console.log('Connected to SQL Server!');
  } catch (err) {
    console.error('Connection error:', err);
  }
}

connect();
```

### مثال Query:
```javascript
const result = await sql.query`SELECT * FROM users WHERE role = 'contractor'`;
console.log(result.recordset);
```

---

## 🔄 الفروقات بين MySQL و SQL Server

### التغييرات الرئيسية:
1. **IDENTITY بدلاً من AUTO_INCREMENT:**
   - MySQL: `id INT AUTO_INCREMENT`
   - SQL Server: `id INT IDENTITY(1,1)`

2. **NVARCHAR بدلاً من VARCHAR للعربية:**
   - SQL Server: `name NVARCHAR(255)`
   - استخدام `N'نص عربي'` للنصوص العربية

3. **DATETIME بدلاً من TIMESTAMP:**
   - SQL Server: `created_at DATETIME DEFAULT GETDATE()`

4. **CHECK Constraints بدلاً من ENUM:**
   - MySQL: `role ENUM('client', 'contractor')`
   - SQL Server: `role NVARCHAR(20) CHECK (role IN ('client', 'contractor'))`

5. **Triggers لتحديث updated_at:**
   - SQL Server يستخدم Triggers بدلاً من `ON UPDATE CURRENT_TIMESTAMP`

6. **GO Statement:**
   - SQL Server يستخدم `GO` لفصل الأوامر

---

## 📝 ملاحظات

- جميع الجداول تستخدم `NVARCHAR` للدعم الكامل للعربية
- Foreign Keys مع `ON DELETE CASCADE` أو `ON DELETE SET NULL`
- Indexes على الحقول المستخدمة في البحث
- Timestamps تلقائية (`created_at`, `updated_at`) باستخدام Triggers
- استخدام `GO` لفصل الأوامر في SQL Server

---

## 🔄 التحويل من MongoDB إلى SQL Server

إذا كنت تريد تحويل البيانات من MongoDB إلى SQL Server:

1. Export البيانات من MongoDB
2. Convert إلى SQL format (T-SQL)
3. Import إلى SQL Server

---

## 📚 مراجع

- [SQL Server Documentation](https://docs.microsoft.com/en-us/sql/)
- [SQL Server Management Studio](https://docs.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms)
- [mssql npm package](https://www.npmjs.com/package/mssql)

---

## ⚠️ ملاحظات مهمة

1. **ترتيب تنفيذ الملفات:**
   - قم بتنفيذ `schema.sql` أولاً
   - ثم `sample-data.sql`

2. **الأخطاء الشائعة:**
   - تأكد من أن SQL Server يعمل
   - تأكد من استخدام `GO` بين الأوامر
   - تأكد من استخدام `N'...'` للنصوص العربية

3. **الأمان:**
   - استخدم كلمات مرور قوية
   - قم بتفعيل Windows Authentication إذا أمكن
   - قم بتحديث SQL Server بانتظام

---

**تم الإنشاء:** 2024
**آخر تحديث:** 2024




































