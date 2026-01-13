# 🔧 إصلاح خطأ: "This API call cannot be made with a publishable API key"

## ❌ المشكلة
```
This API call cannot be made with a publishable API key. 
Please use a secret API key.
```

## 🔍 السبب
هذا الخطأ يعني أن Backend يحاول استخدام **Publishable Key** (pk_test_...) بدلاً من **Secret Key** (sk_test_...) لإنشاء Payment Intent.

## ✅ الحل

### المشكلة في Render Environment Variables

في Render Dashboard، تأكد من أنك أضفت **Secret Key** وليس **Publishable Key**:

#### ❌ خطأ:
```
STRIPE_SECRET_KEY=pk_test_...  ← هذا Publishable Key (خطأ!)
```

#### ✅ صحيح:
```
STRIPE_SECRET_KEY=sk_test_...  ← هذا Secret Key (صحيح!)
```

---

## 📋 خطوات الإصلاح

### 1️⃣ احصل على Secret Key الصحيح

1. اذهب إلى: https://dashboard.stripe.com/test/apikeys
2. انسخ **Secret key** (يبدأ بـ `sk_test_`)
   - ⚠️ **ليس** Publishable key (الذي يبدأ بـ `pk_test_`)

### 2️⃣ أضف Secret Key في Render

1. اذهب إلى Render Dashboard
2. افتح Backend Service
3. اضغط **"Environment"**
4. ابحث عن `STRIPE_SECRET_KEY`
5. إذا كان موجوداً:
   - تأكد أنه يبدأ بـ `sk_test_` (وليس `pk_test_`)
   - إذا كان يبدأ بـ `pk_test_`، احذفه وأضف Secret Key الصحيح
6. إذا لم يكن موجوداً:
   - اضغط **"Add Environment Variable"**
   - Key: `STRIPE_SECRET_KEY`
   - Value: `sk_test_...` (Secret Key من Stripe)
7. اضغط **"Save Changes"**

### 3️⃣ أضف Publishable Key في Vercel (Frontend)

1. اذهب إلى Vercel Dashboard
2. افتح Frontend Project
3. اضغط **"Settings"** → **"Environment Variables"**
4. أضف:
   - Key: `REACT_APP_STRIPE_PUBLISHABLE_KEY`
   - Value: `pk_test_...` (Publishable Key من Stripe)
5. اضغط **"Save"**

---

## 🔑 الفرق بين المفاتيح

### Secret Key (Backend فقط):
- يبدأ بـ: `sk_test_` (للاختبار) أو `sk_live_` (للإنتاج)
- **استخدمه في Render فقط**
- **لا ترفعه إلى GitHub أبداً**
- **لا تستخدمه في Frontend**

### Publishable Key (Frontend):
- يبدأ بـ: `pk_test_` (للاختبار) أو `pk_live_` (للإنتاج)
- **استخدمه في Vercel فقط**
- **آمن للاستخدام في Frontend**
- **لا يستخدم لإنشاء Payment Intent**

---

## ✅ قائمة التحقق

### في Render (Backend):
- [ ] `STRIPE_SECRET_KEY` موجود
- [ ] يبدأ بـ `sk_test_` (وليس `pk_test_`)
- [ ] تم حفظ التغييرات
- [ ] Backend تم إعادة نشره

### في Vercel (Frontend):
- [ ] `REACT_APP_STRIPE_PUBLISHABLE_KEY` موجود
- [ ] يبدأ بـ `pk_test_`
- [ ] تم حفظ التغييرات
- [ ] Frontend تم إعادة نشره

---

## 🧪 اختبار بعد الإصلاح

1. **اختبر Backend:**
   ```
   https://construction-backend-nw0g.onrender.com/api/health
   ```
   يجب أن يعمل بدون أخطاء

2. **اختبر الدفع:**
   - اذهب إلى صفحة الدفع في Frontend
   - حاول الدفع باستخدام بطاقة اختبار
   - يجب أن يعمل بدون خطأ "publishable API key"

---

## 📝 ملاحظات مهمة

1. **Secret Key في Backend فقط:**
   - Render → `STRIPE_SECRET_KEY=sk_test_...`

2. **Publishable Key في Frontend فقط:**
   - Vercel → `REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...`

3. **لا تخلط بينهما:**
   - Secret Key في Frontend = خطأ ❌
   - Publishable Key في Backend = خطأ ❌

---

**⏱️ الوقت المتوقع: 5 دقائق**
