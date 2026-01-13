# 🔧 حل مشكلة خطأ Stripe Payment Intent

## ❌ المشكلة

عند محاولة الدفع باستخدام Stripe، تظهر رسالة خطأ:
```
We're sorry, but we're unable to serve your request.
```

أو في Console:
```
POST http://localhost:4000/api/stripe/create-payment-intent 500 (Internal Server Error)
Error creating payment intent: Error: ...
```

---

## 🔍 السبب

السبب الأكثر شيوعاً هو **عدم وجود `STRIPE_SECRET_KEY`** في متغيرات البيئة في الخادم.

---

## ✅ الحل

### الخطوة 1: التحقق من متغيرات البيئة المحلية

#### في Development (على الجهاز المحلي):

1. افتح ملف `server/.env`
2. تأكد من وجود:
```env
STRIPE_SECRET_KEY=sk_test_...your_key_here
STRIPE_WEBHOOK_SECRET=whsec_...your_webhook_secret_here
```

3. إذا لم يكن الملف موجوداً:
```bash
cd server
touch .env
```

4. أضف المفاتيح:
   - احصل على `STRIPE_SECRET_KEY` من [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
   - اختر "Test mode" للاختبار المحلي
   - انسخ المفتاح الذي يبدأ بـ `sk_test_...`

### الخطوة 2: إضافة متغيرات البيئة في Render

#### إذا كنت تستخدم Render.com:

1. اذهب إلى [Render Dashboard](https://dashboard.render.com)
2. اختر Service الخاص بالخادم (Backend)
3. اضغط على "Environment"
4. أضف المتغيرات التالية:

| Key | Value | ملاحظات |
|-----|-------|---------|
| `STRIPE_SECRET_KEY` | `sk_test_...` أو `sk_live_...` | Secret Key من Stripe Dashboard |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | Webhook Secret (اختياري للاختبار) |
| `REACT_APP_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` أو `pk_live_...` | في Frontend Service |

5. بعد إضافة المتغيرات، اضغط "Save Changes"
6. **أعد نشر الخادم**: Manual Deploy → Deploy latest commit

### الخطوة 3: إضافة متغيرات البيئة في Frontend

#### في Frontend (إذا كان على Render/Vercel/Netlify):

1. في Render Dashboard:
   - اختر Frontend Service
   - اضغط على "Environment"
   - أضف: `REACT_APP_STRIPE_PUBLISHABLE_KEY` = `pk_test_...`

2. في Vercel:
   - Project → Settings → Environment Variables
   - أضف: `REACT_APP_STRIPE_PUBLISHABLE_KEY` = `pk_test_...`

3. في Netlify:
   - Site settings → Environment variables
   - أضف: `REACT_APP_STRIPE_PUBLISHABLE_KEY` = `pk_test_...`

### الخطوة 4: التحقق من المفاتيح

#### في Stripe Dashboard:

1. اذهب إلى [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. تأكد من أنك في **Test mode** للاختبار
3. انسخ:
   - **Publishable key**: `pk_test_...`
   - **Secret key**: `sk_test_...`

#### للـ Production:

عندما تكون جاهزاً للنشر على Production:
1. اضغط على "Activate test mode" لتحويله إلى Live mode
2. انسخ **Live keys**
3. استبدل Test keys بـ Live keys في متغيرات البيئة

---

## 🧪 التحقق من الإعداد

### 1. تحقق من الخادم:

```bash
# في Terminal
cd server
node -e "console.log('STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? 'SET' : 'NOT SET')"
```

### 2. تحقق من Console في المتصفح:

افتح Developer Tools (F12) → Console

يجب أن ترى عند تحميل صفحة الدفع:
```
✅ Stripe is configured
```

إذا رأيت:
```
⚠️ STRIPE_SECRET_KEY is not set. Stripe payments will not work.
```

يعني أن المفتاح غير موجود في الخادم.

### 3. اختبر API مباشرة:

في المتصفح، افتح Console واكتب:
```javascript
fetch('http://localhost:4000/api/stripe/create-payment-intent', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN_HERE'
  },
  body: JSON.stringify({
    amount: 100,
    supplier: 'test',
    currency: 'usd'
  })
})
.then(r => r.json())
.then(console.log)
.catch(console.error)
```

**إذا رأيت:**
```json
{
  "error": "Stripe payment service is not configured",
  "message": "Please contact the administrator. STRIPE_SECRET_KEY is missing..."
}
```

يعني أن `STRIPE_SECRET_KEY` غير موجود.

---

## 🔄 بعد إضافة المتغيرات

### 1. أعد تشغيل الخادم المحلي:

```bash
cd server
npm start
# أو
npm run dev
```

### 2. في Render/Vercel/Netlify:

- **Render**: اضغط "Manual Deploy" → "Deploy latest commit"
- **Vercel**: سيتم إعادة النشر تلقائياً، أو اضغط "Redeploy"
- **Netlify**: سيتم إعادة النشر تلقائياً

### 3. امسح Cache:

- في المتصفح: Ctrl+Shift+Delete
- مسح Cache و Cookies
- إعادة تحميل الصفحة

---

## 📋 قائمة التحقق

- [ ] `STRIPE_SECRET_KEY` موجود في `server/.env`
- [ ] `STRIPE_SECRET_KEY` موجود في Render/Vercel Environment Variables
- [ ] `REACT_APP_STRIPE_PUBLISHABLE_KEY` موجود في Frontend Environment Variables
- [ ] الخادم تم إعادة تشغيله بعد إضافة المتغيرات
- [ ] Frontend تم إعادة نشره بعد إضافة المتغيرات
- [ ] Cache المتصفح تم مسحه
- [ ] المفاتيح صحيحة (يبدأ `STRIPE_SECRET_KEY` بـ `sk_test_` أو `sk_live_`)

---

## 🆘 إذا استمرت المشكلة

### 1. تحقق من Logs في Render:

1. اذهب إلى Render Dashboard
2. اختر Backend Service
3. اضغط "Logs"
4. ابحث عن:
   - `⚠️ STRIPE_SECRET_KEY is not set`
   - `❌ Stripe is not configured`
   - أي أخطاء أخرى

### 2. تحقق من Console في المتصفح:

افتح F12 → Console وابحث عن:
- رسائل خطأ من API
- Network requests فاشلة
- تفاصيل الخطأ

### 3. اختبر Stripe Keys مباشرة:

```bash
# في Terminal
curl https://api.stripe.com/v1/charges \
  -u sk_test_YOUR_KEY_HERE: \
  -d amount=2000 \
  -d currency=usd \
  -d source=tok_visa
```

إذا حصلت على خطأ، المفتاح غير صحيح.

---

## 📝 ملاحظات

1. **Test Mode vs Live Mode:**
   - Test Mode: استخدم `sk_test_...` و `pk_test_...`
   - Live Mode: استخدم `sk_live_...` و `pk_live_...`

2. **الأمان:**
   - ❌ **لا تنشر** `STRIPE_SECRET_KEY` في GitHub أو أي مكان عام
   - ✅ استخدم دائماً Environment Variables
   - ✅ أضف `server/.env` في `.gitignore`

3. **Webhook:**
   - Webhook Secret ليس ضرورياً للاختبار المحلي
   - مطلوب فقط في Production لتحسين الأمان

---

## ✅ بعد الحل

بعد إضافة المفاتيح وإعادة تشغيل الخادم، يجب أن يعمل الدفع بشكل صحيح. جرب:

1. افتح صفحة الدفع
2. اختر "بطاقة ائتمانية (Stripe)"
3. أدخل بيانات بطاقة اختبار:
   - رقم البطاقة: `4242 4242 4242 4242`
   - CVV: `123`
   - تاريخ الانتهاء: `12/25`
4. اضغط "دفع"

يجب أن تظهر رسالة نجاح! ✅

