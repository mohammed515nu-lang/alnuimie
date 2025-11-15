# ⚙️ Backend - نظام إدارة المقاولات

## 🎯 نظرة عامة

هذا هو جزء **Backend** من المشروع، مبني باستخدام **Node.js** و **Express.js**.

## 📁 هيكل المشروع

```
server/
├── server.js             # الخادم الرئيسي
├── models/               # نماذج قاعدة البيانات (MongoDB)
│   ├── User.js
│   ├── Project.js
│   ├── Material.js
│   ├── Supplier.js
│   ├── Purchase.js
│   ├── Payment.js
│   ├── Issue.js
│   ├── Contract.js
│   ├── Request.js
│   └── Report.js
├── routes/               # مسارات API
│   ├── auth.js          # المصادقة
│   ├── users.js
│   ├── projects.js
│   ├── materials.js
│   ├── suppliers.js
│   ├── purchases.js
│   ├── payments.js
│   ├── issues.js
│   ├── contracts.js
│   ├── requests.js
│   └── reports.js
└── middleware/           # Middleware
    └── auth.js          # التحقق من المصادقة
```

## 🛠️ التقنيات المستخدمة

- **Node.js** - بيئة تشغيل JavaScript
- **Express.js** - إطار عمل للخادم
- **MongoDB** - قاعدة بيانات NoSQL
- **Mongoose** - ODM لـ MongoDB
- **JWT** - المصادقة والتفويض
- **bcryptjs** - تشفير كلمات المرور

## 🚀 التشغيل

### 1. تثبيت Dependencies:
```bash
cd server
npm install
```

### 2. إعداد ملف `.env`:
أنشئ ملف `.env` في مجلد `server/`:
```
MONGODB_URI=mongodb://localhost:27017/construction-management
# أو
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/construction-management

PORT=4000
JWT_SECRET=your-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FRONTEND_URL=http://localhost:3000
```

### 3. تشغيل الخادم:
```bash
npm run dev
```

الخادم يعمل على: `http://localhost:4000`

## 🌐 API Endpoints

### Authentication:
- `POST /api/auth/register` - تسجيل مستخدم جديد
- `POST /api/auth/login` - تسجيل الدخول
- `GET /api/auth/google/url` - الحصول على رابط Google OAuth
- `GET /api/auth/google/callback` - معالجة Google OAuth callback

### Projects:
- `GET /api/projects` - قائمة المشاريع
- `GET /api/projects/:id` - تفاصيل مشروع
- `POST /api/projects` - إنشاء مشروع
- `PUT /api/projects/:id` - تحديث مشروع
- `DELETE /api/projects/:id` - حذف مشروع

### Users:
- `GET /api/users` - قائمة المستخدمين
- `GET /api/users/:id` - تفاصيل مستخدم
- `PUT /api/users/:id` - تحديث مستخدم

### Materials, Suppliers, Purchases, Payments, Issues, Contracts, Requests, Reports:
- CRUD operations متاحة لكل Model

## 📊 قاعدة البيانات

### Models (10):
1. **User** - المستخدمون (عميل/مقاول)
2. **Project** - المشاريع
3. **Material** - المواد
4. **Supplier** - الموردون
5. **Purchase** - المشتريات
6. **Payment** - المدفوعات
7. **Issue** - إصدار المواد
8. **Contract** - العقود
9. **Request** - الطلبات
10. **Report** - التقارير

راجع: `SCHEMA-COMPLETE.md` للتفاصيل الكاملة

## 🌐 النشر

### Render (موصى به):
1. اربط المشروع مع GitHub
2. أنشئ Web Service جديد في Render
3. أضف Environment Variables
4. Render سينشر تلقائياً

راجع: `../deployment/render-deployment.md`

## 📚 التوثيق الإضافي

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)

























































