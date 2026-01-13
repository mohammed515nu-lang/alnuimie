# 🔍 تشخيص مشكلة الدفع

## ❌ المشكلة الحالية
الدفع لا يعمل حتى بعد رفع التحديثات.

## 🔍 خطوات التشخيص

### 1️⃣ التحقق من Backend على Render

افتح في المتصفح:
```
https://construction-backend-nw0g.onrender.com/api/health
```

**النتيجة المتوقعة:**
```json
{
  "status": "healthy",
  "database": "connected"
}
```

**إذا رأيت خطأ:**
- Backend غير متاح
- تحقق من Render Dashboard

---

### 2️⃣ التحقق من Stripe Route

افتح في المتصفح:
```
https://construction-backend-nw0g.onrender.com/api/stripe/create-payment-intent
```

**النتيجة المتوقعة:**
- خطأ 400 أو 401 (وليس 404) = الـ route يعمل ✅
- خطأ 404 = الـ route غير موجود ❌

---

### 3️⃣ التحقق من Environment Variables في Render

في Render Dashboard → Backend Service → Environment:

**تأكد من وجود:**
- [ ] `STRIPE_SECRET_KEY` موجود
- [ ] يبدأ بـ `sk_test_` (وليس `pk_test_`)
- [ ] `MONGODB_URI` موجود
- [ ] `JWT_SECRET` موجود
- [ ] `NODE_ENV=production`
- [ ] `PORT=10000`

---

### 4️⃣ التحقق من Logs في Render

في Render Dashboard → Backend Service → Logs:

**ابحث عن:**
- `STRIPE_SECRET_KEY is not set` ← المفتاح غير موجود
- `Stripe is not configured` ← Stripe غير مضبوط
- `Cannot find module` ← مشكلة في الملفات
- `404` ← Route غير موجود

---

### 5️⃣ التحقق من Frontend في Vercel

في Vercel Dashboard → Frontend Project → Environment:

**تأكد من وجود:**
- [ ] `REACT_APP_API_URL` = `https://construction-backend-nw0g.onrender.com/api`
- [ ] `REACT_APP_STRIPE_PUBLISHABLE_KEY` موجود (يبدأ بـ `pk_test_`)

---

### 6️⃣ اختبار الدفع مع Console

1. افتح Frontend في المتصفح
2. اضغط F12 → Console
3. حاول الدفع
4. ابحث عن أخطاء:
   - `404 Not Found` ← Route غير موجود
   - `500 Internal Server Error` ← مشكلة في Backend
   - `Network Error` ← مشكلة في الاتصال

---

## 🔧 الحلول الشائعة

### المشكلة 1: 404 Not Found

**السبب:** Route غير موجود في Backend

**الحل:**
1. تحقق من أن `server/routes/stripe.js` موجود
2. تحقق من أن `server/server.js` يحتوي على:
   ```javascript
   const stripeRoutes = require('./routes/stripe');
   app.use('/api/stripe', stripeRoutes);
   ```
3. أعد نشر Backend على Render

---

### المشكلة 2: 500 Internal Server Error

**السبب:** Stripe غير مضبوط أو MongoDB غير متصل

**الحل:**
1. تحقق من `STRIPE_SECRET_KEY` في Render
2. تحقق من `MONGODB_URI` في Render
3. راجع Logs في Render

---

### المشكلة 3: Payment Intent Created لكن Payment لا يظهر

**السبب:** `confirmPayment` لا يعمل بشكل صحيح

**الحل:**
1. تحقق من Logs في Render
2. تأكد من أن `confirmPayment` يتم استدعاؤه
3. تحقق من أن Payment تم إنشاؤه في `create-payment-intent`

---

## 📋 قائمة التحقق الكاملة

### Backend (Render):
- [ ] Backend يعمل (`/api/health` يعمل)
- [ ] Stripe route موجود (`/api/stripe/create-payment-intent` لا يعطي 404)
- [ ] `STRIPE_SECRET_KEY` موجود ويبدأ بـ `sk_test_`
- [ ] `MONGODB_URI` موجود وصحيح
- [ ] `JWT_SECRET` موجود
- [ ] Logs لا تظهر أخطاء

### Frontend (Vercel):
- [ ] `REACT_APP_API_URL` مضبوط على Render URL
- [ ] `REACT_APP_STRIPE_PUBLISHABLE_KEY` موجود
- [ ] Frontend تم نشره بعد آخر تحديث

### الاختبار:
- [ ] حاول الدفع
- [ ] راجع Console للأخطاء
- [ ] راجع Network tab للطلبات الفاشلة

---

## 🚀 بعد التحقق

إذا كانت كل شيء مضبوط لكن الدفع ما زال لا يعمل:

1. **راجع Logs في Render:**
   - Render Dashboard → Backend → Logs
   - ابحث عن أخطاء Stripe

2. **راجع Console في المتصفح:**
   - F12 → Console
   - ابحث عن أخطاء API

3. **اختبر Payment Intent مباشرة:**
   - استخدم Postman أو curl
   - POST إلى `/api/stripe/create-payment-intent`

---

**⏱️ الوقت المتوقع: 10-15 دقيقة**
