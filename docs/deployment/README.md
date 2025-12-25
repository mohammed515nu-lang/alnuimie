# 🚀 دليل النشر - نظام إدارة المقاولات

## 📋 نظرة عامة

هذا الدليل يشرح كيفية نشر Frontend و Backend على منصات الاستضافة.

---

## 🌐 Frontend - Vercel

### الخطوات:
1. اربط المشروع مع GitHub
2. اربط مع Vercel
3. Vercel سينشر تلقائياً

### الملفات المهمة:
- `vercel.json` - إعدادات Vercel
- `.env` - Environment Variables

### التوثيق:
- [إعداد مشروع جديد لـ Vercel](إعداد-مشروع-جديد-لـ-Vercel.md)
- [نشر على Vercel خطوة بخطوة](نشر-على-VERCEL-خطوة-بخطوة.md)
- [نشر على Vercel أوتوماتيكي](نشر-على-Vercel-أوتوماتيكي.md)

---

## ⚙️ Backend - Render

### الخطوات:
1. اربط المشروع مع GitHub
2. أنشئ Web Service جديد في Render
3. أضف Environment Variables
4. Render سينشر تلقائياً

### الملفات المهمة:
- `render.yaml` - إعدادات Render
- `.env` - Environment Variables

### التوثيق:
- [DEPLOY Backend Step by Step](DEPLOY-BACKEND-STEP-BY-STEP.md)
- [RENDER Quick Start](RENDER-QUICK-START.md)
- [RENDER Setup Guide](RENDER-SETUP-GUIDE.md)

---

## 🔐 Google OAuth

### الإعداد:
1. إنشاء OAuth 2.0 Client ID في Google Cloud Console
2. إضافة Redirect URIs
3. إضافة Environment Variables

### التوثيق:
- [إعداد Google OAuth - الرابط الصحيح](إعداد-Google-OAuth-الرابط-الصحيح.md)
- [إعداد Google OAuth - النهائي مع الرابط](إعداد-Google-OAuth-النهائي-مع-الرابط.md)
- [إعداد Google OAuth للـ Production فقط](إعداد-Google-OAuth-للـ-Production-فقط.md)
- [حل مشكلة Google OAuth](حل-مشكلة-Google-OAuth.md)
- [حل مشكلة Google OAuth Access Blocked](حل-مشكلة-Google-OAuth-Access-Blocked.md)

---

## 📊 MongoDB

### الإعداد:
1. إنشاء حساب على MongoDB Atlas
2. إنشاء Cluster
3. نسخ Connection String

### التوثيق:
- [MongoDB Connection String - الجديد](MongoDB-Connection-String-الجديد.md)
- [MongoDB Connection String - الصحيح](MongoDB-Connection-String-الصحيح.md)
- [تحديث MONGODB_URI في Render الآن](تحديث-MONGODB_URI-في-Render-الآن.md)

---

## 🔧 Environment Variables

### Frontend (Vercel):
```
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

### Backend (Render):
```
MONGODB_URI=mongodb+srv://...
PORT=4000
JWT_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
FRONTEND_URL=https://your-frontend-url.vercel.app
```

---

## 📝 ملاحظات مهمة

- تأكد من إضافة جميع Environment Variables
- انتظر 5-10 دقائق بعد التحديثات
- تحقق من Logs في حالة وجود مشاكل

---

## 🆘 حل المشاكل

### مشاكل شائعة:
- **Build Failed**: تحقق من Logs
- **API Not Working**: تحقق من Environment Variables
- **OAuth Error**: تحقق من Redirect URIs

راجع الملفات المحددة في كل قسم للحلول التفصيلية.

























































