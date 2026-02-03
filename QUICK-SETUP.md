# ⚡ إعداد سريع - Google OAuth

## 🎯 الخطوات السريعة (5 دقائق)

### 1️⃣ افتح Google Cloud Console
**الرابط المباشر:** https://console.cloud.google.com/apis/credentials

### 2️⃣ أنشئ OAuth Client ID
1. اضغط **"+ CREATE CREDENTIALS"**
2. اختر **"OAuth client ID"**
3. إذا طُلب منك، أكمل OAuth consent screen:
   - App name: `نظام إدارة المقاولات`
   - User support email: بريدك
   - اضغط "Save and Continue" حتى النهاية

4. في صفحة Create OAuth client:
   - **Application type**: `Web application`
   - **Name**: `Construction Management`
   - **Authorized JavaScript origins**: أضف `http://localhost:3000`
   - **Authorized redirect URIs**: أضف `http://localhost:3000/auth/google/callback`
   - اضغط **"Create"**

### 3️⃣ انسخ القيم
- **Client ID**: انسخه (مثل: `123456789-abc.apps.googleusercontent.com`)
- **Client Secret**: انسخه (مثل: `GOCSPX-abc123...`)

### 4️⃣ حدث ملف `.env`
افتح `server/.env` واستبدل:

```env
GOOGLE_CLIENT_ID=الصق_Client_ID_هنا
GOOGLE_CLIENT_SECRET=الصق_Client_Secret_هنا
```

### 5️⃣ تحقق من الإعداد
شغّل:
```bash
cd server
npm run check-oauth
```

### 6️⃣ أعد تشغيل السيرفر
```bash
npm start
```

---

## ✅ جاهز!

الآن جرب تسجيل الدخول عبر Google في التطبيق!

---

## 🔍 إذا واجهت مشاكل

شغّل:
```bash
cd server
npm run check-oauth
```

سيعرض لك ما هو مفقود أو غير صحيح.
