# 🔧 إصلاح مشكلة تسجيل الدخول في تطبيق الموبايل

## ❌ المشكلة

تطبيق الموبايل لا يسجل الدخول لأن:
1. كان يحاول الاتصال بـ `localhost:4000` (لا يعمل على الهاتف)
2. السيرفر المحلي قد لا يكون مشغولاً

---

## ✅ الحل

### تم التحديث تلقائياً! 🎉

تم تحديث `alnuimie-mobile/src/api/index.js` لاستخدام Backend على Render مباشرة:

```javascript
const API_BASE_URL = 'https://construction-backend-nw0g.onrender.com/api';
```

**لا حاجة لتشغيل السيرفر محلياً!**

---

## 🚀 الخطوات

### 1. إعادة تحميل التطبيق

في Terminal حيث يعمل `npm start`:
- اضغط `r` لإعادة التحميل
- أو أغلق وأعد فتح Expo Go

### 2. جرب تسجيل الدخول

يجب أن يعمل الآن! ✅

---

## 📍 موقع ملفات السيرفر

إذا أردت تشغيل السيرفر محلياً (اختياري):

```
alnuimie-main/
└── server/
    ├── server.js          # الملف الرئيسي
    ├── package.json
    ├── routes/            # مسارات API
    └── models/            # نماذج قاعدة البيانات
```

**راجع:** `server/START_SERVER.md` للتعليمات الكاملة

---

## 🔄 إذا أردت استخدام السيرفر المحلي

### 1. شغّل السيرفر:
```bash
cd server
npm run dev
```

### 2. اعرف IP جهازك:
```bash
# Windows
ipconfig

# Mac/Linux
ifconfig
```

### 3. غيّر API URL في `alnuimie-mobile/src/api/index.js`:
```javascript
const API_BASE_URL = 'http://YOUR_IP:4000/api';
// مثال: http://192.168.1.100:4000/api
```

### 4. تأكد أن الكمبيوتر والهاتف على نفس WiFi

---

## ✅ الحل الأسهل (موصى به)

**استخدم Backend على Render مباشرة - لا حاجة لأي إعداد!**

التطبيق محدّث الآن ويستخدم:
- `https://construction-backend-nw0g.onrender.com/api`

**جرب تسجيل الدخول الآن!** 🎉

---

## 🔍 التحقق من الاتصال

إذا استمرت المشكلة:

1. **تحقق من Backend على Render:**
   - افتح: `https://construction-backend-nw0g.onrender.com/api/health`
   - يجب أن ترى: `{"status":"healthy",...}`

2. **تحقق من Console في Terminal:**
   - ابحث عن أخطاء في الاتصال

3. **تحقق من بيانات تسجيل الدخول:**
   - تأكد أن المستخدم موجود في قاعدة البيانات

---

**تم الإصلاح! جرب الآن! 🚀**
