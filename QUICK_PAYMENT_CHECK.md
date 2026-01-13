# ⚡ فحص سريع لمشكلة الدفع

## ✅ الخطوات السريعة

### 1️⃣ تحقق من Backend
افتح في المتصفح:
```
https://construction-backend-nw0g.onrender.com/api/health
```

**يجب أن ترى:**
```json
{"status":"healthy","database":"connected"}
```

**إذا رأيت خطأ:**
- Backend غير متاح
- اذهب إلى Render Dashboard وتحقق من حالة الخدمة

---

### 2️⃣ تحقق من Stripe Route
افتح في المتصفح:
```
https://construction-backend-nw0g.onrender.com/api/stripe/create-payment-intent
```

**النتيجة:**
- ✅ خطأ 400/401 = Route يعمل
- ❌ خطأ 404 = Route غير موجود

---

### 3️⃣ تحقق من Render Environment Variables

في Render Dashboard → Backend → Environment:

**تأكد من:**
```
STRIPE_SECRET_KEY=sk_test_... (يبدأ بـ sk_test_)
MONGODB_URI=...
JWT_SECRET=...
NODE_ENV=production
PORT=10000
```

---

### 4️⃣ تحقق من Vercel Environment Variables

في Vercel Dashboard → Project → Settings → Environment Variables:

**تأكد من:**
```
REACT_APP_API_URL=https://construction-backend-nw0g.onrender.com/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

### 5️⃣ راجع Logs

**في Render:**
- Dashboard → Backend → Logs
- ابحث عن أخطاء Stripe

**في المتصفح:**
- F12 → Console
- حاول الدفع
- ابحث عن أخطاء

---

## 🔧 الحلول السريعة

### إذا كان Backend لا يعمل:
1. Render Dashboard → Backend Service
2. تحقق من حالة الخدمة
3. إذا كانت "Failed"، راجع Logs

### إذا كان Route يعطي 404:
1. تأكد من أن `server/routes/stripe.js` موجود
2. تأكد من أن `server/server.js` يحتوي على:
   ```javascript
   app.use('/api/stripe', stripeRoutes);
   ```
3. أعد نشر Backend

### إذا كان Stripe يعطي خطأ:
1. تحقق من `STRIPE_SECRET_KEY` في Render
2. تأكد أنه يبدأ بـ `sk_test_` (وليس `pk_test_`)
3. احفظ التغييرات وأعد النشر

---

## 📞 إذا استمرت المشكلة

1. افتح Console في المتصفح (F12)
2. حاول الدفع
3. انسخ الخطأ الكامل
4. راجع `PAYMENT_DEBUG.md` للتفاصيل

---

**⏱️ الوقت المتوقع: 5 دقائق**
