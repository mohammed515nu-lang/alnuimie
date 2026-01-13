# 🔐 دليل إعداد نظام الدفع Stripe

## 📋 المتطلبات

تم إضافة نظام دفع حقيقي باستخدام Stripe للموقع. يمكن الآن للمستخدمين الدفع بالبطاقات الائتمانية بشكل آمن.

---

## 🚀 خطوات الإعداد

### 1. إنشاء حساب Stripe

1. اذهب إلى [Stripe.com](https://stripe.com)
2. أنشئ حساب جديد (مجاني)
3. انتقل إلى Dashboard → Developers → API keys

### 2. الحصول على API Keys

#### للـ Development (Test Mode):
- **Publishable Key**: يبدأ بـ `pk_test_...`
- **Secret Key**: يبدأ بـ `sk_test_...`

#### للـ Production:
- **Publishable Key**: يبدأ بـ `pk_live_...`
- **Secret Key**: يبدأ بـ `sk_live_...`

### 3. إعداد متغيرات البيئة

#### في Backend (`server/.env`):
```env
# Stripe Keys
STRIPE_SECRET_KEY=sk_test_...your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_...your_webhook_secret_here
```

#### في Frontend (`.env` في الجذر):
```env
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...your_publishable_key_here
```

### 4. إعداد Webhook

1. في Stripe Dashboard → Developers → Webhooks
2. اضغط "Add endpoint"
3. URL: `https://your-backend-url.com/api/stripe/webhook`
4. Events to listen to:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `payment_intent.canceled`
5. انسخ Webhook Secret وأضفه في `.env`

---

## 📦 تثبيت المكتبات

### Backend:
```bash
cd server
npm install stripe
```

### Frontend:
```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

---

## 🧪 اختبار الدفع

### استخدام Test Cards:

Stripe يوفر بطاقات اختبار:

- **نجاح الدفع**: `4242 4242 4242 4242`
- **فشل الدفع**: `4000 0000 0000 0002`
- **يتطلب 3D Secure**: `4000 0025 0000 3155`

**تفاصيل البطاقة:**
- CVV: أي 3 أرقام (مثلاً: 123)
- تاريخ الانتهاء: أي تاريخ في المستقبل (مثلاً: 12/25)
- الرمز البريدي: أي 5 أرقام (مثلاً: 12345)

---

## 🔧 الملفات المضافة/المعدلة

### Backend:
- ✅ `server/package.json` - إضافة Stripe
- ✅ `server/models/Payment.js` - إضافة حقول Stripe
- ✅ `server/routes/stripe.js` - Routes للدفع
- ✅ `server/server.js` - إضافة Stripe routes

### Frontend:
- ✅ `package.json` - إضافة مكتبات Stripe
- ✅ `src/utils/api.js` - إضافة Stripe API
- ✅ `src/components/StripePaymentForm.js` - مكون الدفع
- ✅ `src/pages/contractor/SuppliersAndPayments.js` - تحديث واجهة الدفع

---

## 📊 كيفية العمل

1. **إنشاء Payment Intent**: عند اختيار "بطاقة ائتمانية"، يتم إنشاء Payment Intent في Stripe
2. **إدخال بيانات البطاقة**: المستخدم يدخل بيانات البطاقة في نموذج آمن
3. **تأكيد الدفع**: Stripe يعالج الدفع
4. **Webhook**: Stripe يرسل إشعار للـ backend لتحديث حالة الدفع
5. **التحديث**: يتم تحديث حالة الدفع في قاعدة البيانات

---

## 🔒 الأمان

- ✅ جميع البيانات الحساسة تُعالج عبر Stripe (لا تمر عبر السيرفر)
- ✅ استخدام HTTPS في Production
- ✅ Webhook signature verification
- ✅ Token-based authentication

---

## 🐛 استكشاف الأخطاء

### المشكلة: "Stripe غير مُعد بشكل صحيح"
**الحل**: تأكد من إضافة `REACT_APP_STRIPE_PUBLISHABLE_KEY` في `.env`

### المشكلة: "Failed to create payment intent"
**الحل**: 
- تحقق من `STRIPE_SECRET_KEY` في `server/.env`
- تأكد من أن المفتاح صحيح (يبدأ بـ `sk_test_` أو `sk_live_`)

### المشكلة: Webhook لا يعمل
**الحل**:
- تأكد من إضافة `STRIPE_WEBHOOK_SECRET` في `server/.env`
- تحقق من أن URL صحيح في Stripe Dashboard
- استخدم ngrok للاختبار المحلي: `ngrok http 4000`

---

## 📝 ملاحظات مهمة

1. **Test Mode**: في Development، استخدم Test Keys (تبدأ بـ `test_`)
2. **Production**: عند النشر، استخدم Live Keys (تبدأ بـ `live_`)
3. **Webhook**: يجب أن يكون URL عام (لا يمكن استخدام localhost)
4. **الرسوم**: Stripe يأخذ 2.9% + $0.30 لكل معاملة ناجحة

---

## 🎯 الميزات المضافة

- ✅ دفع بالبطاقات الائتمانية
- ✅ معالجة آمنة عبر Stripe
- ✅ تتبع حالة الدفع
- ✅ Webhook للتحقق التلقائي
- ✅ دعم جميع أنواع البطاقات (Visa, Mastercard, etc.)
- ✅ واجهة عربية كاملة

---

**تاريخ الإضافة**: $(date)
**الإصدار**: 1.0.0

