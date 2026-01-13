# 🔧 إصلاح مشكلة الدفع عبر Stripe

## ❌ المشكلة
عند محاولة الدفع عبر Stripe، يظهر خطأ:
```
404 Not Found - Request not found
POST https://construction-backend-nw0g.onrender.com/api/stripe/create-payment-intent
```

## ✅ الحلول

### 1️⃣ التأكد من رفع الكود إلى GitHub

```bash
# تحقق من أن ملف server/routes/stripe.js موجود
git status
git add server/routes/stripe.js
git commit -m "إضافة Stripe routes"
git push origin main
```

### 2️⃣ إضافة Environment Variables في Render

اذهب إلى Render Dashboard → Backend Service → Environment:

**أضف هذه المتغيرات:**

```
STRIPE_SECRET_KEY=sk_test_...your_stripe_secret_key_here
```

**⚠️ مهم:** 
- احصل على مفتاح Stripe من [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
- استخدم Test Keys للاختبار (تبدأ بـ `sk_test_`)
- للحصول على Live Keys، اذهب إلى Stripe Dashboard → API Keys → Live keys

### 3️⃣ إعادة نشر Backend على Render

بعد إضافة Environment Variables:
1. اضغط **"Save Changes"** في Render
2. Render سيعيد تشغيل الخدمة تلقائياً
3. انتظر حتى يكتمل النشر (2-5 دقائق)

### 4️⃣ التحقق من أن الـ Route يعمل

افتح في المتصفح:
```
https://construction-backend-nw0g.onrender.com/api/health
```

يجب أن ترى:
```json
{
  "status": "healthy",
  "database": "connected"
}
```

### 5️⃣ اختبار Stripe Route مباشرة

افتح في المتصفح (يجب أن يعطي خطأ 401 أو 400، وليس 404):
```
https://construction-backend-nw0g.onrender.com/api/stripe/create-payment-intent
```

**إذا رأيت 404:**
- الـ route غير موجود في Backend
- تأكد من أن `server/routes/stripe.js` موجود
- تأكد من أن `server/server.js` يحتوي على: `app.use('/api/stripe', stripeRoutes);`

**إذا رأيت 500 أو خطأ آخر:**
- الـ route موجود لكن هناك مشكلة في الكود
- راجع Logs في Render Dashboard

### 6️⃣ التحقق من Logs في Render

1. اذهب إلى Render Dashboard
2. افتح Backend Service
3. اضغط على تبويب **"Logs"**
4. ابحث عن أخطاء مثل:
   - `STRIPE_SECRET_KEY is not set`
   - `Cannot find module './routes/stripe'`
   - أي أخطاء أخرى

---

## 🔍 خطوات التشخيص

### الخطوة 1: تحقق من أن الملف موجود
```bash
# في مجلد المشروع
ls server/routes/stripe.js
```

### الخطوة 2: تحقق من أن الـ route مسجل في server.js
افتح `server/server.js` وتأكد من وجود:
```javascript
const stripeRoutes = require('./routes/stripe');
app.use('/api/stripe', stripeRoutes);
```

### الخطوة 3: تحقق من Environment Variables
في Render Dashboard:
- Environment → تحقق من وجود `STRIPE_SECRET_KEY`

### الخطوة 4: تحقق من Logs
في Render Dashboard:
- Logs → ابحث عن أخطاء متعلقة بـ Stripe

---

## 🚀 بعد الإصلاح

بعد إضافة `STRIPE_SECRET_KEY` في Render:

1. **أعد نشر Backend:**
   - Render سيعيد التشغيل تلقائياً بعد حفظ Environment Variables

2. **اختبر الدفع:**
   - اذهب إلى صفحة الدفع في Frontend
   - حاول الدفع باستخدام بطاقة اختبار:
     - **رقم البطاقة**: `4242 4242 4242 4242`
     - **CVV**: `123`
     - **تاريخ الانتهاء**: `12/25`

3. **تحقق من Logs:**
   - إذا استمرت المشكلة، راجع Logs في Render

---

## 📝 ملاحظات مهمة

1. **Test Keys vs Live Keys:**
   - استخدم Test Keys للاختبار (تبدأ بـ `sk_test_`)
   - للحصول على Live Keys، اذهب إلى Stripe Dashboard → API Keys → Live keys

2. **Webhook Secret:**
   - إذا كنت تستخدم Webhooks، أضف `STRIPE_WEBHOOK_SECRET` أيضاً
   - يمكنك الحصول عليه من Stripe Dashboard → Developers → Webhooks

3. **CORS:**
   - تأكد من أن `FRONTEND_URL` في Render مضبوط على رابط Vercel
   - مثال: `FRONTEND_URL=https://alnuimie515.vercel.app`

---

## ✅ قائمة التحقق

- [ ] ملف `server/routes/stripe.js` موجود
- [ ] `server/server.js` يحتوي على `app.use('/api/stripe', stripeRoutes)`
- [ ] `STRIPE_SECRET_KEY` موجود في Render Environment Variables
- [ ] Backend تم إعادة نشره بعد إضافة Environment Variables
- [ ] الـ route يعمل (لا يعطي 404)
- [ ] Logs في Render لا تظهر أخطاء

---

**إذا استمرت المشكلة بعد اتباع هذه الخطوات، راجع Logs في Render Dashboard للحصول على تفاصيل الخطأ.**
