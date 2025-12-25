# 🎯 أدوات MongoDB فقط - ERD و Schema

## ⚠️ مهم جداً

**المشروع يستخدم MongoDB (NoSQL) وليس SQL!**

أدوات SQL مثل MySQL Workbench **لا تدعم MongoDB**.

---

## ✅ الأدوات الموصى بها (تدعم MongoDB)

### 1. **dbdiagram.io** ⭐⭐⭐⭐⭐
**الموقع:** https://dbdiagram.io

**لماذا:**
- ✅ يدعم MongoDB/NoSQL
- ✅ مجاني
- ✅ سهل جداً
- ✅ Export PNG/PDF

**كيفية الاستخدام:**
1. اذهب إلى https://dbdiagram.io
2. سجل حساب مجاني
3. ابدأ بإنشاء ERD
4. استخدم صيغة DBML (تدعم NoSQL)

---

### 2. **MongoDB Compass** ⭐⭐⭐⭐⭐
**الموقع:** https://www.mongodb.com/products/compass

**لماذا:**
- ✅ رسمي من MongoDB
- ✅ مجاني
- ✅ يعرض Schema تلقائياً
- ✅ يتصل مباشرة مع قاعدة البيانات

**كيفية الاستخدام:**
1. حمّل من: https://www.mongodb.com/products/compass
2. ثبت البرنامج
3. اربط مع MongoDB
4. شاهد Schema تلقائياً

---

### 3. **Draw.io (diagrams.net)** ⭐⭐⭐⭐
**الموقع:** https://app.diagrams.net

**لماذا:**
- ✅ مجاني تماماً
- ✅ يدعم NoSQL ERD
- ✅ Online و Desktop
- ✅ Export متعدد

---

### 4. **NoSQLBooster for MongoDB** ⭐⭐⭐⭐
**الموقع:** https://www.nosqlbooster.com

**لماذا:**
- ✅ مخصص MongoDB فقط
- ✅ مجاني (Free Edition)
- ✅ Visual Query Builder
- ✅ Schema Analyzer

---

## ❌ أدوات لا تستخدمها (SQL فقط)

هذه الأدوات **لا تدعم MongoDB**:

- ❌ MySQL Workbench
- ❌ SQL Server Management Studio
- ❌ PostgreSQL pgAdmin
- ❌ Oracle SQL Developer
- ❌ phpMyAdmin
- ❌ DBeaver (يدعم SQL فقط)

---

## 🚀 التوصية النهائية

### للـ ERD Diagram:
**dbdiagram.io** - الأسهل والأفضل

### لتصور Schema:
**MongoDB Compass** - رسمي من MongoDB

### للتحليل المتقدم:
**NoSQLBooster** - مخصص MongoDB

---

## 📝 مثال: dbdiagram.io مع MongoDB

استخدم هذا الكود في dbdiagram.io:

```dbml
// User Collection (MongoDB)
Table users {
  _id ObjectId [pk]
  name String
  email String [unique]
  password String
  role String
  createdAt DateTime
}

// Project Collection (MongoDB)
Table projects {
  _id ObjectId [pk]
  name String
  client ObjectId [ref: > users._id]
  contractor ObjectId [ref: > users._id]
  budget Number
  status String
}
```

---

## 📥 روابط مباشرة

- **dbdiagram.io**: https://dbdiagram.io
- **MongoDB Compass**: https://www.mongodb.com/products/compass
- **Draw.io**: https://app.diagrams.net
- **NoSQLBooster**: https://www.nosqlbooster.com

---

**تذكر:** استخدم أدوات MongoDB/NoSQL فقط! 🎯

























































