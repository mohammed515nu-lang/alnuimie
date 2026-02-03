# 🚀 إعداد Google OAuth - دليل سريع

## ⚡ الخطوات (5 دقائق فقط!)

### الخطوة 1: افتح Google Cloud Console
**اضغط هنا:** https://console.cloud.google.com/apis/credentials

---

### الخطوة 2: أنشئ OAuth Client ID

1. **اضغط** على **"+ CREATE CREDENTIALS"** (أعلى الصفحة)
2. **اختر** **"OAuth client ID"**

3. **إذا ظهرت لك رسالة** "Configure OAuth consent screen":
   - اضغط **"CONFIGURE CONSENT SCREEN"**
   - اختر **"External"** ثم **"CREATE"**
   - املأ:
     - **App name**: `نظام إدارة المقاولات`
     - **User support email**: اختر بريدك
     - **Developer contact information**: بريدك
   - اضغط **"SAVE AND CONTINUE"** 3 مرات
   - اضغط **"BACK TO DASHBOARD"**

4. **الآن أنشئ OAuth Client ID**:
   - اضغط **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
   - **Application type**: اختر **"Web application"**
   - **Name**: `Construction Management`
   - **Authorized JavaScript origins**: 
     ```
     http://localhost:3000
     ```
   - **Authorized redirect URIs**: 
     ```
     http://localhost:3000/auth/google/callback
     ```
   - اضغط **"CREATE"**

---

### الخطوة 3: انسخ القيم

ستظهر لك نافذة تحتوي على:

1. **Your Client ID**
   - انسخه (سيبدو مثل: `123456789-abc.apps.googleusercontent.com`)

2. **Your Client Secret**
   - انسخه (سيبدو مثل: `GOCSPX-abc123...`)
   - ⚠️ **مهم**: هذا السر لن يظهر مرة أخرى! انسخه الآن

3. اضغط **"OK"**

---

### الخطوة 4: حدث ملف `.env`

1. **افتح ملف** `server/.env` في Notepad أو أي محرر نصوص

2. **ابحث عن** هذه الأسطر:
   ```env
   GOOGLE_CLIENT_ID=your-google-client-id-here
   GOOGLE_CLIENT_SECRET=your-google-client-secret-here
   ```

3. **استبدل** `your-google-client-id-here` بـ **Client ID** الذي نسخته
4. **استبدل** `your-google-client-secret-here` بـ **Client Secret** الذي نسخته

**مثال:**
```env
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz123456
```

5. **احفظ** الملف (Ctrl+S)

---

### الخطوة 5: تحقق من الإعداد

افتح Terminal/PowerShell في مجلد `server` وشغّل:

```bash
npm run check-oauth
```

**إذا رأيت** ✅ **"Google OAuth جاهز للاستخدام!"** → **تم بنجاح!** 🎉

**إذا رأيت** ❌ **"Google OAuth غير مُعد"** → راجع الخطوات السابقة

---

### الخطوة 6: أعد تشغيل السيرفر

1. **أوقف** السيرفر إذا كان يعمل (اضغط `Ctrl+C`)
2. **شغّله** مرة أخرى:
   ```bash
   npm start
   ```

---

## ✅ جاهز!

الآن جرب تسجيل الدخول عبر Google في التطبيق!

---

## 🔍 مساعدة إضافية

### للتحقق من الإعداد في أي وقت:
```bash
cd server
npm run check-oauth
```

### إذا نسيت Redirect URI:
بعد تشغيل `npm run check-oauth`، سيظهر لك Redirect URI المطلوب

### رابط مباشر لإنشاء OAuth Client:
https://console.cloud.google.com/apis/credentials/consent

---

## 📞 إذا واجهت مشاكل

1. **تأكد** من نسخ Client ID و Client Secret بدون مسافات إضافية
2. **تأكد** من حفظ ملف `.env` بعد التعديل
3. **أعد تشغيل** السيرفر بعد التعديل
4. **شغّل** `npm run check-oauth` للتحقق

---

**بالتوفيق! 🎉**
