# 🛠️ أدوات ERD و Schema - نظام إدارة المقاولات

## 📊 نظرة عامة

المشروع يستخدم **MongoDB (NoSQL)** وليس SQL. هذه الأدوات تساعدك في:
- إنشاء ERD Diagrams
- تصور Schema
- توثيق قاعدة البيانات

---

## 🎯 أدوات موصى بها

### 1. **dbdiagram.io** ⭐ (الأفضل)
**الموقع:** https://dbdiagram.io

**المميزات:**
- ✅ مجاني
- ✅ سهل الاستخدام
- ✅ يدعم MongoDB و SQL
- ✅ Export إلى PDF/PNG
- ✅ Online (لا يحتاج تثبيت)
- ✅ يمكن مشاركة المخططات

**كيفية الاستخدام:**
1. اذهب إلى https://dbdiagram.io
2. سجل حساب مجاني
3. ابدأ بإنشاء ERD
4. Export المخطط

---

### 2. **MongoDB Compass** ⭐ (موصى به للمشروع)
**الموقع:** https://www.mongodb.com/products/compass

**المميزات:**
- ✅ مجاني من MongoDB
- ✅ يتصل مباشرة مع MongoDB
- ✅ يعرض Schema تلقائياً
- ✅ Visual Query Builder
- ✅ يدعم MongoDB Atlas

**كيفية الاستخدام:**
1. حمّل من: https://www.mongodb.com/products/compass
2. ثبت البرنامج
3. اربط مع MongoDB (محلي أو Atlas)
4. شاهد Schema تلقائياً

---

### 3. **Draw.io (diagrams.net)**
**الموقع:** https://app.diagrams.net

**المميزات:**
- ✅ مجاني تماماً
- ✅ Online و Desktop
- ✅ يدعم ERD Templates
- ✅ Export إلى PNG/PDF/SVG
- ✅ لا يحتاج حساب

**كيفية الاستخدام:**
1. اذهب إلى https://app.diagrams.net
2. اختر "Create New Diagram"
3. اختر "Entity Relation" template
4. ابدأ الرسم

---

### 4. **Lucidchart**
**الموقع:** https://www.lucidchart.com

**المميزات:**
- ✅ مجاني (محدود)
- ✅ احترافي
- ✅ ERD Templates جاهزة
- ✅ Collaboration
- ⚠️ يحتاج حساب

---

### 5. **NoSQLBooster for MongoDB**
**الموقع:** https://www.nosqlbooster.com

**المميزات:**
- ✅ مجاني (Free Edition)
- ✅ Visual Query Builder
- ✅ Schema Analyzer
- ✅ ERD Generator
- ✅ يدعم MongoDB فقط

**ملاحظة:** هذا مخصص لـ MongoDB فقط، ليس SQL

---

## 🎨 أدوات أخرى

### 6. **ERDPlus**
**الموقع:** https://erdplus.com

**المميزات:**
- ✅ مجاني
- ✅ Online
- ✅ ERD و Relational Schema

---

### 7. **dbForge Studio for MongoDB**
**الموقع:** https://www.devart.com/dbforge/mongodb/studio/

**المميزات:**
- ✅ Visual Schema Designer
- ✅ ERD Generator
- ⚠️ مدفوع (Free Trial)

---

## 📋 مقارنة سريعة

| الأداة | المجانية | سهولة الاستخدام | MongoDB | Export | ملاحظات |
|--------|----------|------------------|---------|--------|---------|
| dbdiagram.io | ✅ | ⭐⭐⭐⭐⭐ | ✅ | ✅ | يدعم NoSQL |
| MongoDB Compass | ✅ | ⭐⭐⭐⭐ | ✅ | ✅ | رسمي من MongoDB |
| Draw.io | ✅ | ⭐⭐⭐⭐ | ✅ | ✅ | عام (يدعم NoSQL) |
| Lucidchart | ⚠️ | ⭐⭐⭐⭐⭐ | ✅ | ✅ | مدفوع (Free محدود) |
| ERDPlus | ✅ | ⭐⭐⭐ | ✅ | ✅ | يدعم NoSQL |
| NoSQLBooster | ✅ | ⭐⭐⭐⭐ | ✅ | ✅ | مخصص MongoDB |

**⚠️ ملاحظة:** MySQL Workbench و SQL Server Management Studio لا يدعمان MongoDB (NoSQL)

---

## 🚀 التوصية للمشروع

### للـ ERD Diagram:
**dbdiagram.io** أو **Draw.io** (كلاهما يدعم MongoDB/NoSQL)

### لتصور Schema من MongoDB:
**MongoDB Compass** (رسمي من MongoDB)

### لتحليل متقدم:
**NoSQLBooster for MongoDB** (مخصص MongoDB فقط)

---

## ⚠️ أدوات لا تدعم MongoDB

هذه الأدوات مخصصة لـ SQL فقط ولا تدعم MongoDB:
- ❌ MySQL Workbench
- ❌ SQL Server Management Studio
- ❌ PostgreSQL pgAdmin
- ❌ Oracle SQL Developer

**استخدم الأدوات المذكورة أعلاه بدلاً منها**

---

## 📝 مثال: استخدام dbdiagram.io

### 1. اذهب إلى https://dbdiagram.io

### 2. استخدم هذا الكود كمثال:

```dbml
// User Model
Table users {
  _id ObjectId [pk]
  name String
  email String [unique]
  password String
  role String // 'client' or 'contractor'
  createdAt DateTime
  updatedAt DateTime
}

// Project Model
Table projects {
  _id ObjectId [pk]
  name String
  client ObjectId [ref: > users._id]
  contractor ObjectId [ref: > users._id]
  budget Number
  status String
  createdAt DateTime
}

// Material Model
Table materials {
  _id ObjectId [pk]
  name String
  quantity Number
  unit String
  cost Number
  project ObjectId [ref: > projects._id]
}

// Request Model
Table requests {
  _id ObjectId [pk]
  title String
  client ObjectId [ref: > users._id]
  contractor ObjectId [ref: > users._id]
  status String
  budget Number
  createdAt DateTime
}
```

### 3. Export إلى PNG/PDF

---

## 🔧 استخدام MongoDB Compass

### 1. حمّل MongoDB Compass:
https://www.mongodb.com/products/compass

### 2. اربط مع MongoDB:
```
mongodb://localhost:27017
# أو
mongodb+srv://username:password@cluster.mongodb.net
```

### 3. شاهد Schema تلقائياً:
- Compass يعرض Schema تلقائياً
- يمكنك تصدير Schema كـ JSON

---

## 📚 الملفات الموجودة في المشروع

### Schema Documentation:
- `server/SCHEMA-COMPLETE.md` - Schema كامل موثق

### ERD:
- يمكنك استخدام أي أداة من الأعلى لإنشاء ERD

---

## 🎯 الخطوات الموصى بها

### 1. استخدم MongoDB Compass:
- لتصور Schema الحالي
- لرؤية البيانات

### 2. استخدم dbdiagram.io:
- لإنشاء ERD Diagram احترافي
- لتصدير المخططات

### 3. استخدم Draw.io:
- إذا كنت تفضل الرسم اليدوي
- لإنشاء مخططات تفصيلية

---

## 📥 روابط التحميل

- **dbdiagram.io**: https://dbdiagram.io
- **MongoDB Compass**: https://www.mongodb.com/products/compass
- **Draw.io**: https://app.diagrams.net
- **Lucidchart**: https://www.lucidchart.com
- **ERDPlus**: https://erdplus.com

---

## 💡 نصيحة

للمشروع الحالي، أنصح بـ:
1. **MongoDB Compass** - لتصور Schema الحالي
2. **dbdiagram.io** - لإنشاء ERD Diagram احترافي

---

**تم التحديث:** [التاريخ الحالي]

