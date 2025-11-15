# 🔧 حل مشكلة "Access blocked: Authorization Error" في Google OAuth

## ❌ المشكلة:
```
Access blocked: Authorization Error
Error 400: invalid_request
You can't sign in to this app because it doesn't comply with Google's OAuth 2.0 policy
```

## ✅ الحلول:

---

## الحل 1: إكمال OAuth Consent Screen (الأهم!)

### الخطوة 1: اذهب إلى Google Cloud Console

1. اذهب إلى [console.cloud.google.com](https://console.cloud.google.com)
2. اختر المشروع الخاص بك
3. اذهب إلى **APIs & Services** → **OAuth consent screen**

### الخطوة 2: إكمال OAuth Consent Screen

1. **User Type:**
   - اختر **"External"** (إذا كان التطبيق للاستخدام العام)
   - أو **"Internal"** (إذا كان داخل مؤسستك فقط)

2. **App Information:**
   - **App name**: `نظام ادارة المقاولات` (أو `Construction Management System`)
   - **User support email**: اختر بريدك الإلكتروني (`mohammed515nu@gmail.com`)
   - **App logo**: (اختياري) يمكنك رفع شعار
   - **App domain**: (اختياري) يمكنك تركها فارغة
   - **Application home page**: `https://your-frontend-domain.com` (أو `http://localhost:3000` للـ Development)
   - **Privacy policy link**: (اختياري) يمكنك إنشاء صفحة Privacy Policy
   - **Terms of service link**: (اختياري) يمكنك إنشاء صفحة Terms of Service
   - **Authorized domains**: (اختياري) يمكنك إضافة domain

3. **Developer contact information:**
   - **Email addresses**: أضف `mohammed515nu@gmail.com`

4. **Scopes:**
   - تأكد من وجود:
     - ✅ `openid`
     - ✅ `email`
     - ✅ `profile`

5. **Test users** (إذا كان التطبيق في وضع Testing):
   - اضغط **"Add Users"**
   - أضف `mohammed515nu@gmail.com` كـ test user
   - أضف أي بريد إلكتروني آخر تريد السماح له بالدخول

6. **اضغط "Save and Continue"** في كل خطوة

---

## الحل 2: التحقق من Authorized Redirect URIs

### الخطوة 1: اذهب إلى Credentials

1. في Google Cloud Console
2. اذهب إلى **APIs & Services** → **Credentials**
3. اضغط على **OAuth 2.0 Client ID** الخاص بك

### الخطوة 2: تأكد من Redirect URIs

في **Authorized redirect URIs**، تأكد من وجود:

**للـ Development:**
```
http://localhost:3000/auth/google/callback
```

**للـ Production (Vercel):**
```
https://your-project-name.vercel.app/auth/google/callback
```

**مثال:**
```
https://construction-client.vercel.app/auth/google/callback
```

**⚠️ مهم جداً:**
- يجب أن يكون مطابقاً **تماماً** (بما في ذلك `http://` vs `https://`)
- لا مسافات إضافية
- لا `/` في النهاية (إلا إذا كان موجوداً في الكود)

### الخطوة 3: تأكد من Authorized JavaScript origins

في **Authorized JavaScript origins**، أضف:

**للـ Development:**
```
http://localhost:3000
```

**للـ Production:**
```
https://your-project-name.vercel.app
```

---

## الحل 3: التحقق من Environment Variables

### في Backend (Render.com):

1. اذهب إلى Render Dashboard
2. اختر Backend Service
3. اذهب إلى **Environment** tab
4. تأكد من وجود:

```env
GOOGLE_CLIENT_ID=your-client-id-here
GOOGLE_CLIENT_SECRET=your-client-secret-here
FRONTEND_URL=https://your-project-name.vercel.app
```

**⚠️ مهم:**
- `FRONTEND_URL` يجب أن يكون **نفس** رابط Vercel الخاص بك
- بدون `/` في النهاية
- مع `https://`

### في Backend (localhost):

في ملف `server/.env`:

```env
GOOGLE_CLIENT_ID=your-client-id-here
GOOGLE_CLIENT_SECRET=your-client-secret-here
FRONTEND_URL=http://localhost:3000
```

---

## الحل 4: نشر التطبيق (إذا كان في وضع Testing)

إذا كان التطبيق في وضع **Testing**:

1. في **OAuth consent screen**
2. اضغط **"PUBLISH APP"** في الأعلى
3. سيطلب منك تأكيد
4. بعد النشر، يمكن لأي مستخدم تسجيل الدخول

**⚠️ ملاحظة:**
- في وضع Testing، يمكن فقط للمستخدمين المضافة كـ "Test users" تسجيل الدخول
- بعد النشر، يمكن لأي مستخدم تسجيل الدخول

---

## الحل 5: التحقق من أن التطبيق ليس محظوراً

1. في **OAuth consent screen**
2. تحقق من أن حالة التطبيق هي:
   - ✅ **"In production"** (أو "Published")
   - ❌ **ليس** "Blocked" أو "Restricted"

---

## ✅ Checklist الكامل:

### في Google Cloud Console:
- [ ] OAuth Consent Screen مكتمل (جميع الحقول المطلوبة)
- [ ] App name موجود
- [ ] User support email موجود
- [ ] Developer contact information موجود
- [ ] Scopes (`openid`, `email`, `profile`) موجودة
- [ ] Test users مضافة (إذا كان في وضع Testing)
- [ ] التطبيق منشور (Published) وليس في وضع Testing فقط

### في Credentials:
- [ ] Authorized redirect URIs صحيحة ومطابقة تماماً
- [ ] Authorized JavaScript origins صحيحة
- [ ] Client ID و Client Secret صحيحان

### في Backend (Render):
- [ ] `GOOGLE_CLIENT_ID` موجود وصحيح
- [ ] `GOOGLE_CLIENT_SECRET` موجود وصحيح
- [ ] `FRONTEND_URL` موجود ومطابق لرابط Vercel

### في Frontend (Vercel):
- [ ] الموقع منشور ويعمل
- [ ] الرابط صحيح (مثل: `https://construction-client.vercel.app`)

---

## 🔍 خطوات التحقق:

### 1. تحقق من Redirect URI:

افتح Browser Console (F12) في صفحة تسجيل الدخول، وابحث عن:
```
redirect_uri=http://localhost:3000/auth/google/callback
```
أو
```
redirect_uri=https://your-project.vercel.app/auth/google/callback
```

تأكد من أن هذا الرابط **مطابق تماماً** لما هو موجود في Google Cloud Console.

### 2. تحقق من Environment Variables:

في Backend (Render)، يمكنك استخدام endpoint:
```
https://construction-backend-nw0g.onrender.com/api/debug/env
```

تحقق من:
- `hasGoogleClientId: true`
- `hasGoogleClientSecret: true`
- `frontendUrl` مطابق لرابط Vercel

---

## 🎯 الحل السريع (موصى به):

1. **اذهب إلى [console.cloud.google.com](https://console.cloud.google.com)**
2. **APIs & Services** → **OAuth consent screen**
3. **أكمل جميع الحقول المطلوبة:**
   - App name
   - User support email
   - Developer contact information
4. **أضف Test users** (إذا كان في وضع Testing):
   - `mohammed515nu@gmail.com`
5. **اضغط "PUBLISH APP"** (إذا كان في وضع Testing)
6. **اذهب إلى Credentials**
7. **تحقق من Authorized redirect URIs:**
   - `http://localhost:3000/auth/google/callback` (Development)
   - `https://your-project.vercel.app/auth/google/callback` (Production)
8. **في Render، تأكد من `FRONTEND_URL`**:
   - يجب أن يكون مطابقاً لرابط Vercel
9. **أعد المحاولة!**

---

## 📚 مراجع:

- [Google OAuth 2.0 Policy](https://developers.google.com/identity/protocols/oauth2/policies)
- [OAuth Consent Screen](https://support.google.com/cloud/answer/10311615)
- [Google Cloud Console](https://console.cloud.google.com)

---

**بعد إكمال هذه الخطوات، يجب أن يعمل Google OAuth بشكل صحيح! 🎉**


