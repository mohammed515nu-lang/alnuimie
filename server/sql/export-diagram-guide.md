# 📸 كيفية تصدير Database Diagram في SQL Server

## الطريقة 1: Copy as Image (الأسهل) ⭐

1. **افتح Database Diagram** في SSMS
2. **انقر بزر الماوس الأيمن** على المخطط (في مساحة فارغة)
3. اختر **"Copy Diagram to Clipboard"**
4. افتح أي برنامج (Paint, Word, PowerPoint)
5. اضغط **Ctrl+V** للصق
6. احفظ الصورة

---

## الطريقة 2: Print to PDF

1. **افتح Database Diagram**
2. اضغط **Ctrl+P** (أو File → Print)
3. اختر **"Microsoft Print to PDF"** كطابعة
4. اختر المكان واسم الملف
5. احفظ

---

## الطريقة 3: Screenshot (أسرع)

1. **افتح Database Diagram**
2. اضغط **Windows + Shift + S** (أو استخدم Snipping Tool)
3. اختر المنطقة المراد تصويرها
4. الصق في Paint أو أي برنامج
5. احفظ كـ PNG أو JPG

---

## الطريقة 4: Export باستخدام أدوات خارجية

### أ. dbdiagram.io

1. اذهب إلى https://dbdiagram.io
2. سجل حساب مجاني
3. استخدم ملف `erd.dbml` الموجود في `server/sql/erd.dbml`
4. أو أنشئ المخطط يدوياً
5. Export كـ PNG أو PDF

### ب. Draw.io (diagrams.net)

1. اذهب إلى https://app.diagrams.net
2. اختر "Create New Diagram"
3. اختر "Entity Relation" template
4. ارسم المخطط يدوياً بناءً على الجداول
5. Export كـ PNG, PDF, أو SVG

---

## الطريقة 5: SQL Script لإنشاء ERD

يمكنك استخدام SQL Script لإنشاء ERD تلقائياً باستخدام أدوات مثل:
- **dbdiagram.io** (يدعم DBML)
- **Mermaid** (يدعم SQL)
- **PlantUML** (يدعم SQL)

---

## 💡 نصيحة:

**الأسهل والأسرع:**
1. Copy Diagram to Clipboard (الطريقة 1)
2. الصق في Paint
3. احفظ كـ PNG

---

## 📁 الملفات المتوفرة:

- `server/sql/erd.dbml` - ملف ERD بصيغة DBML (لـ dbdiagram.io)
- `server/sql/schema.sql` - Schema كامل
- `server/sql/verify-setup.sql` - للتحقق من العلاقات

---

## 🎯 الخطوات السريعة:

```
1. افتح Database Diagram في SSMS
2. انقر بزر الماوس الأيمن → "Copy Diagram to Clipboard"
3. افتح Paint → Ctrl+V
4. File → Save As → PNG
5. تم! ✅
```










