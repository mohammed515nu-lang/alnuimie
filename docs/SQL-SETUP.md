# 🗄️ إعداد قاعدة بيانات SQL - دليل شامل

## 📋 نظرة عامة

تم إنشاء قاعدة بيانات SQL كاملة للمشروع. يمكنك استخدامها بدلاً من MongoDB أو بجانبها.

---

## 🚀 الإعداد السريع

### 1. تثبيت MySQL:

#### Windows:
- تحميل من: https://dev.mysql.com/downloads/mysql/
- أو استخدام **XAMPP**: https://www.apachefriends.org/
- أو استخدام **WAMP**: https://www.wampserver.com/

#### Mac:
```bash
brew install mysql
```

#### Linux:
```bash
sudo apt-get install mysql-server
```

---

### 2. إنشاء قاعدة البيانات:

#### طريقة 1: Command Line
```bash
mysql -u root -p < server/sql/schema.sql
```

#### طريقة 2: MySQL Workbench
1. افتح MySQL Workbench
2. File → Open SQL Script
3. اختر `server/sql/schema.sql`
4. Execute (⚡)

#### طريقة 3: phpMyAdmin
1. افتح phpMyAdmin
2. Import → Choose File
3. اختر `server/sql/schema.sql`
4. Go

---

### 3. إدراج بيانات تجريبية (اختياري):
```bash
mysql -u root -p construction_management < server/sql/sample-data.sql
```

---

## 📁 الملفات

- `server/sql/schema.sql` - Schema كامل
- `server/sql/sample-data.sql` - بيانات تجريبية
- `server/sql/README.md` - توثيق SQL

---

## 🔧 استخدام مع Node.js

### 1. تثبيت MySQL Driver:
```bash
npm install mysql2
```

### 2. إنشاء ملف اتصال:
```javascript
// server/config/database.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'construction_management'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('✅ Connected to MySQL!');
});

module.exports = connection;
```

### 3. استخدام في Routes:
```javascript
// server/routes/projects.js
const db = require('../config/database');

router.get('/', (req, res) => {
  db.query('SELECT * FROM projects', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});
```

---

## 📊 الجداول

### الجداول الرئيسية:
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

### جداول إضافية:
11. **project_engineers** - المهندسين
12. **project_crews** - فرق العمل
13. **project_images** - صور المشاريع

---

## 🔗 العلاقات

جميع الجداول مرتبطة بـ Foreign Keys:
- `projects` → `users` (client, contractor)
- `materials` → `projects`, `suppliers`
- `purchases` → `suppliers`, `materials`
- `payments` → `projects`, `suppliers`
- `issues` → `materials`, `projects`
- `contracts` → `projects`, `users`
- `requests` → `users`
- `reports` → `projects`

---

## 📝 Environment Variables

أضف إلى `server/.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=construction_management
```

---

## 🎯 مقارنة MongoDB vs SQL

| الميزة | MongoDB | SQL |
|--------|---------|-----|
| النوع | NoSQL | SQL |
| المرونة | ✅ عالية | ⚠️ محدودة |
| العلاقات | ⚠️ يدوياً | ✅ تلقائية |
| الأداء | ✅ سريع | ✅ سريع |
| التعقيد | ✅ بسيط | ⚠️ معقد |

---

## 🔄 التحويل من MongoDB إلى SQL

إذا كنت تريد تحويل البيانات:

1. Export من MongoDB:
```bash
mongoexport --db construction-management --collection users --out users.json
```

2. Convert إلى SQL format
3. Import إلى MySQL

---

## 📚 مراجع

- [MySQL Documentation](https://dev.mysql.com/doc/)
- [MySQL Workbench](https://dev.mysql.com/downloads/workbench/)
- [mysql2 npm](https://www.npmjs.com/package/mysql2)

---

**تم الإنشاء:** [التاريخ الحالي]
















































