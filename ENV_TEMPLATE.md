# 📝 قوالب Environment Variables

## Frontend (.env)

انسخ هذا المحتوى إلى ملف `.env` في المجلد الرئيسي:

```env
# API URL - رابط Backend
# للتطوير المحلي: http://localhost:4000/api
# للإنتاج: https://your-backend-url.onrender.com/api
REACT_APP_API_URL=https://construction-backend-nw0g.onrender.com/api

# Stripe Publishable Key (اختياري - للدفع)
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## Backend (server/.env)

انسخ هذا المحتوى إلى ملف `server/.env`:

```env
# MongoDB Connection String
# للتطوير المحلي: mongodb://localhost:27017/construction-management
# للإنتاج: mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
MONGODB_URI=mongodb://localhost:27017/construction-management

# JWT Secret Key - استخدم مفتاح عشوائي قوي
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Port
PORT=4000

# Node Environment
NODE_ENV=development

# Frontend URL (لـ CORS)
FRONTEND_URL=http://localhost:3000

# Stripe Keys (اختياري - للدفع)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Google OAuth (اختياري - لتسجيل الدخول عبر Google)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email Configuration (اختياري - لإرسال الإيميلات)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
```

---

## ⚠️ ملاحظات مهمة

1. **لا ترفع ملفات `.env` إلى GitHub** - موجودة في `.gitignore`
2. استخدم هذه القوالب كمرجع فقط
3. في Production (Vercel/Render)، أضف Environment Variables من Dashboard
