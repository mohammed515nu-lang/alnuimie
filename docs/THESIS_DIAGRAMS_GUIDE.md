# 📊 دليل إضافة الرسوم البيانية للأطروحة

## 🎯 الرسوم البيانية المطلوبة

1. **ERD (Entity Relationship Diagram)**
2. **Architecture Diagram**
3. **Use Case Diagram**
4. **System Flow Diagram**
5. **Data Flow Diagram**
6. **Sequence Diagrams**

---

## 1️⃣ ERD (Entity Relationship Diagram)

### الأدوات الموصى بها:
- **dbdiagram.io** (مجاني، سهل الاستخدام) ⭐ **موصى به**
- **Draw.io** (مجاني)
- **Lucidchart** (مدفوع)
- **MySQL Workbench** (لـ SQL)

### الخطوات:

#### الطريقة 1: استخدام dbdiagram.io

1. **اذهب إلى**: https://dbdiagram.io/
2. **سجل حساب** مجاني
3. **افتح ملف**: `server/sql/erd.dbml`
4. **انسخ المحتوى** والصقه في dbdiagram.io
5. **اضغط** "Generate" لإنشاء الرسم
6. **احفظ** كـ PNG أو PDF عالي الجودة
7. **أضف** الرسم في الأطروحة

#### الطريقة 2: استخدام Draw.io

1. **اذهب إلى**: https://app.diagrams.net/
2. **أنشئ رسم جديد**
3. **استخدم** قالب "Entity Relationship"
4. **ارسم** الجداول والعلاقات حسب `server/sql/erd.dbml`
5. **احفظ** كـ PNG عالي الجودة

### العلاقات الرئيسية:

```
User (1) ──< Projects (N)
User (1) ──< Payments (N)
User (1) ──< Requests (N)
Project (1) ──< Materials (N)
Project (1) ──< Contracts (N)
Project (1) ──< Issues (N)
Supplier (1) ──< Materials (N)
Supplier (1) ──< Purchases (N)
Supplier (1) ──< Payments (N)
```

### الملف الجاهز:
- `server/sql/erd.dbml` - جاهز للاستخدام في dbdiagram.io

---

## 2️⃣ Architecture Diagram (مخطط البنية المعمارية)

### الأدوات:
- **Draw.io** ⭐ **موصى به**
- **Lucidchart**
- **Microsoft Visio**

### المكونات المطلوبة:

```
┌─────────────────────────────────────┐
│   Frontend Layer (React.js)         │
│   - React Components                │
│   - React Router                    │
│   - State Management                │
│   Deployed on: Vercel               │
└──────────────┬──────────────────────┘
               │
               │ HTTPS/REST API
               │ (JSON)
               │
┌──────────────▼──────────────────────┐
│   Backend Layer (Node.js/Express)  │
│   - Express Routes                 │
│   - Middleware (Auth, CORS)        │
│   - Controllers                    │
│   Deployed on: Render              │
└──────────────┬──────────────────────┘
               │
               │ MongoDB Connection
               │ (Mongoose ODM)
               │
┌──────────────▼──────────────────────┐
│   Database Layer (MongoDB Atlas)    │
│   - Collections (Users, Projects)  │
│   - Indexes                         │
│   - Relationships                   │
└─────────────────────────────────────┘
```

### الخطوات:

1. **افتح** Draw.io
2. **أنشئ** 3 مستطيلات (Frontend, Backend, Database)
3. **أضف** الأسهم بينها
4. **أضف** التفاصيل لكل طبقة
5. **احفظ** كـ PNG عالي الجودة

### ملف قالب:
- أنشئ ملف `docs/diagrams/architecture-template.drawio`

---

## 3️⃣ Use Case Diagram (مخطط حالات الاستخدام)

### الأدوات:
- **Draw.io** ⭐ **موصى به**
- **Lucidchart**
- **StarUML**

### Actors (الممثلون):
1. **العميل (Client)**
2. **المقاول (Contractor)**
3. **النظام (System)**

### Use Cases (حالات الاستخدام):

#### للعميل:
- UC-1: تسجيل الدخول
- UC-2: إنشاء طلب مشروع
- UC-3: عرض المشاريع
- UC-4: متابعة تقدم المشروع
- UC-5: إضافة مراجعة
- UC-6: إدارة الملف الشخصي

#### للمقاول:
- UC-7: تسجيل الدخول
- UC-8: إضافة مشروع
- UC-9: إدارة المواد
- UC-10: إدارة المشتريات
- UC-11: إدارة المدفوعات
- UC-12: إنشاء تقرير
- UC-13: قبول/رفض طلب
- UC-14: إدارة الموردين

#### للنظام:
- UC-15: إرسال إشعارات
- UC-16: توليد تقارير
- UC-17: إدارة المصادقة

### الخطوات:

1. **ارسم** 3 أشخاص (Actors) في الأعلى
2. **ارسم** مستطيل (System boundary)
3. **ارسم** دوائر (Use Cases) داخل المستطيل
4. **اربط** Actors بـ Use Cases بخطوط
5. **أضف** علاقات (include, extend) إذا لزم الأمر

---

## 4️⃣ System Flow Diagram (مخطط تدفق النظام)

### الأدوات:
- **Draw.io** ⭐ **موصى به**
- **Lucidchart**

### مثال: تدفق تسجيل الدخول

```
[المستخدم] 
    │
    ▼
[صفحة تسجيل الدخول]
    │
    ▼
[إدخال البيانات]
    │
    ▼
[إرسال إلى Backend]
    │
    ▼
[التحقق من البيانات]
    │
    ├─ [صحيحة] ──► [إنشاء Token] ──► [توجيه إلى Dashboard]
    │
    └─ [خاطئة] ──► [عرض رسالة خطأ] ──► [العودة إلى صفحة تسجيل الدخول]
```


- تدفق إضافة مشروع
- تدفق عملية الدفع
- تدفق إنشاء تقرير

---

## 5️⃣ Data Flow Diagram (DFD) (مخطط تدفق البيانات)



### المستويات:

#### Level 0 (Context Diagram):
```
[العميل] ──► [النظام] ──► [المقاول]
              │
              ▼
         [قاعدة البيانات]
```

#### Level 1:
```
[العميل] ──► [واجهة المستخدم] ──► [API] ──► [قاعدة البيانات]
              │                    │
              ▼                    ▼
         [المقاول]            [المعالجة]
```

### الرموز:
- **الدائرة**: Process (عملية)
- **السهم**: Data Flow (تدفق البيانات)
- **المستطيل**: External Entity (كيان خارجي)
- **المستطيل المفتوح**: Data Store (مخزن البيانات)

---

## 6️⃣ Sequence Diagrams (مخططات التسلسل)

### الأدوات:
- **Draw.io** ⭐ **موصى به**
- **Lucidchart**
- **PlantUML**

### أمثلة:

#### مثال 1: تسجيل الدخول
```
User          Frontend          Backend          Database
 │                │                │                │
 │──Login───────►│                │                │
 │                │──POST /auth───►│                │
 │                │                │──Find User───►│
 │                │                │◄──User───────│
 │                │                │──Verify──────│
 │                │                │──Generate───►│
 │                │◄──Token───────│                │
 │◄──Redirect─────│                │                │
```

#### مثال 2: إضافة مشروع
```
Contractor    Frontend          Backend          Database
 │                │                │                │
 │──Add Project─►│                │                │
 │                │──POST /api───►│                │
 │                │                │──Validate───►│
 │                │                │──Create─────►│
 │                │                │◄──Saved───────│
 │                │◄──Success─────│                │
 │◄──Confirmation─│                │                │
```

### الخطوات:

1. **ارسم** خطوط حياة (Lifelines) لكل مكون
2. **ارسم** رسائل (Messages) بين المكونات
3. **أضف** Activation boxes (مربعات التنشيط)
4. **أضف** Return messages (رسائل الإرجاع)

---

## 📝 نصائح عامة

### الجودة:
- **الدقة**: 300 DPI على الأقل
- **الحجم**: واضح عند الطباعة
- **الألوان**: استخدم ألوان متباينة
- **النصوص**: واضحة ومقروءة

### التنسيق:
- **العنوان**: فوق كل رسم
- **التعليقات**: أسفل الرسم
- **الترقيم**: الشكل 4-1، الشكل 4-2، إلخ

### الأدوات المجانية الموصى بها:
1. **dbdiagram.io** - للـ ERD
2. **Draw.io** - لجميع الرسوم الأخرى
3. **PlantUML** - للـ Sequence Diagrams (نصي)

---

## 📁 الملفات الجاهزة

- ✅ `server/sql/erd.dbml` - ERD جاهز
- ⚠️ باقي الرسوم تحتاج إنشاء

---

## 🎯 الخطوات التالية

1. ✅ أنشئ ERD من `server/sql/erd.dbml`
2. ⏳ أنشئ Architecture Diagram
3. ⏳ أنشئ Use Case Diagram
4. ⏳ أنشئ System Flow Diagrams
5. ⏳ أنشئ Data Flow Diagram
6. ⏳ أنشئ Sequence Diagrams
7. ✅ أضف الرسوم في الأطروحة

---

**بالتوفيق! 🎉**
