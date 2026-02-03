# 🔐 دليل إعداد Google OAuth - خطوة بخطوة

## 📋 المتطلبات
- حساب Google (Gmail)
- متصفح إنترنت

---

## 🚀 الخطوات التفصيلية

### الخطوة 1: إنشاء مشروع في Google Cloud Console

1. **اذهب إلى**: [Google Cloud Console](https://console.cloud.google.com/)
2. **سجل الدخول** بحساب Google الخاص بك
3. **في الأعلى**، اضغط على **"Select a project"** (اختر مشروع)
4. **اضغط** على **"New Project"** (مشروع جديد)
5. **أدخل اسم المشروع** (مثلاً: `Construction Management` أو `نظام إدارة المقاولات`)
6. **اضغط** على **"Create"** (إنشاء)
7. **انتظر** حتى يتم إنشاء المشروع (ثواني قليلة)
8. **اختر المشروع الجديد** من القائمة المنسدلة في الأعلى

---

### الخطوة 2: تفعيل Google Identity API

1. **من القائمة الجانبية**، اذهب إلى **"APIs & Services"** → **"Library"**
2. **في شريط البحث**، ابحث عن: `Google Identity`
3. **اضغط** على **"Google Identity Services API"** أو **"Google+ API"**
4. **اضغط** على زر **"Enable"** (تفعيل)
5. **انتظر** حتى يتم التفعيل (ثواني قليلة)

---

### الخطوة 3: إعداد OAuth Consent Screen (شاشة الموافقة)

1. **من القائمة الجانبية**، اذهب إلى **"APIs & Services"** → **"OAuth consent screen"**
2. **اختر** **"External"** (للاستخدام العام) ثم اضغط **"Create"**
3. **املأ المعلومات التالية**:
   - **App name** (اسم التطبيق): `نظام إدارة المقاولات`
   - **User support email** (بريد الدعم): اختر بريدك الإلكتروني
   - **App logo** (الشعار): اختياري - يمكنك تخطيه
   - **Application home page** (الصفحة الرئيسية): `http://localhost:3000` (للـ Development)
   - **Developer contact information** (معلومات الاتصال): بريدك الإلكتروني
4. **اضغط** على **"Save and Continue"** (حفظ ومتابعة)
5. **في صفحة Scopes**:
   - لا حاجة لإضافة scopes إضافية
   - **اضغط** على **"Save and Continue"**
6. **في صفحة Test users** (للتطوير فقط):
   - يمكنك إضافة بريدك الإلكتروني كـ test user
   - أو **اضغط** على **"Save and Continue"** للتخطي
7. **في صفحة Summary**:
   - **راجع** المعلومات
   - **اضغط** على **"Back to Dashboard"** (العودة للوحة التحكم)

---

### الخطوة 4: إنشاء OAuth 2.0 Client ID

1. **من القائمة الجانبية**، اذهب إلى **"APIs & Services"** → **"Credentials"**
2. **في الأعلى**، اضغط على **"+ CREATE CREDENTIALS"** (إنشاء بيانات اعتماد)
3. **اختر** **"OAuth client ID"** من القائمة
4. **إذا طُلب منك** إكمال OAuth consent screen، اتبع الخطوة 3 أعلاه
5. **في صفحة Create OAuth client ID**:
   - **Application type**: اختر **"Web application"**
   - **Name**: `Construction Management Web Client` (أو أي اسم تريده)
   
6. **Authorized JavaScript origins** (أصول JavaScript المصرح بها):
   - **أضف**: `http://localhost:3000` (للـ Development)
   - **إذا كان لديك Production URL**، أضفه أيضاً (مثلاً: `https://your-app.vercel.app`)
   
7. **Authorized redirect URIs** (URIs إعادة التوجيه المصرح بها):
   - **أضف**: `http://localhost:3000/auth/google/callback` (للـ Development)
   - **إذا كان لديك Production URL**، أضفه أيضاً (مثلاً: `https://your-app.vercel.app/auth/google/callback`)
   
8. **اضغط** على **"Create"** (إنشاء)

---

### الخطوة 5: نسخ Client ID و Client Secret

بعد إنشاء OAuth Client ID، ستظهر نافذة تحتوي على:

1. **Your Client ID** (معرف العميل):
   - سيبدو مثل: `123456789-abcdefghijklmnop.apps.googleusercontent.com`
   - **انسخه** واحفظه في مكان آمن

2. **Your Client Secret** (سر العميل):
   - سيبدو مثل: `GOCSPX-abcdefghijklmnopqrstuvwxyz123456`
   - **انسخه** واحفظه في مكان آمن
   - ⚠️ **مهم**: هذا السر لن يظهر مرة أخرى! تأكد من نسخه الآن

3. **اضغط** على **"OK"** لإغلاق النافذة

---

### الخطوة 6: تحديث ملف .env

1. **افتح ملف** `server/.env` في محرر النصوص
2. **استبدل** القيم التالية:

```env
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz123456
```

**⚠️ مهم جداً:**
- استبدل القيم بأرقامك الحقيقية
- لا تضع مسافات قبل أو بعد القيم
- لا تضع علامات اقتباس حول القيم
- تأكد من أن `FRONTEND_URL=http://localhost:3000` موجود

3. **احفظ** الملف

---

### الخطوة 7: إعادة تشغيل السيرفر

1. **أوقف** السيرفر إذا كان يعمل (اضغط `Ctrl+C`)
2. **شغّل** السيرفر مرة أخرى:
   ```bash
   cd server
   npm start
   ```
   أو إذا كنت تستخدم nodemon:
   ```bash
   npm run dev
   ```

---

### الخطوة 8: اختبار الإعداد

1. **تأكد** من أن:
   - السيرفر يعمل على `http://localhost:4000`
   - Frontend يعمل على `http://localhost:3000`

2. **افتح المتصفح** واذهب إلى: `http://localhost:3000/login`

3. **اضغط** على زر **"تسجيل الدخول عبر Google"**

4. **يجب أن**:
   - يتم توجيهك إلى صفحة Google للموافقة
   - بعد الموافقة، يتم تسجيل دخولك تلقائياً

---

## 🔍 التحقق من الإعداد

يمكنك التحقق من أن الإعداد صحيح عبر زيارة:

```
http://localhost:4000/api/auth/google/status
```

يجب أن ترى:
```json
{
  "enabled": true,
  "message": "Google OAuth is configured"
}
```

---

## ⚠️ مشاكل شائعة وحلولها

### المشكلة 1: "redirect_uri_mismatch"
**الحل:**
- تأكد من أن Redirect URI في Google Cloud Console مطابق تماماً: `http://localhost:3000/auth/google/callback`
- تأكد من أن `FRONTEND_URL=http://localhost:3000` في ملف `.env`

### المشكلة 2: "invalid_client"
**الحل:**
- تأكد من نسخ Client ID و Client Secret بشكل صحيح
- تأكد من عدم وجود مسافات إضافية
- تأكد من حفظ ملف `.env` بعد التعديل

### المشكلة 3: "access_denied"
**الحل:**
- هذا يعني أن المستخدم رفض السماح بالوصول
- حاول مرة أخرى ووافق على الصلاحيات

### المشكلة 4: السيرفر لا يقرأ ملف .env
**الحل:**
- تأكد من أن الملف موجود في `server/.env` (وليس في المجلد الرئيسي)
- أعد تشغيل السيرفر بعد تعديل الملف
- تأكد من عدم وجود أخطاء في صيغة الملف

---

## 📝 ملاحظات مهمة

1. **للـ Development (التطوير المحلي)**:
   - استخدم `http://localhost:3000` في جميع الإعدادات
   - لا حاجة لـ HTTPS

2. **للـ Production (الإنتاج)**:
   - استخدم رابط HTTPS الخاص بك (مثلاً: `https://your-app.vercel.app`)
   - أضف Redirect URI و JavaScript origin في Google Cloud Console
   - حدث `FRONTEND_URL` في ملف `.env` أو في Render/Vercel

3. **الأمان**:
   - **لا تشارك** `GOOGLE_CLIENT_SECRET` أبداً
   - **لا ترفع** ملف `.env` إلى GitHub
   - احتفظ بالسر في مكان آمن

---

## 🎉 تهانينا!

إذا اتبعت جميع الخطوات، يجب أن يعمل Google OAuth الآن بشكل صحيح!

إذا واجهت أي مشاكل، راجع قسم "مشاكل شائعة وحلولها" أعلاه.
