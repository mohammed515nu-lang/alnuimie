# 🔧 إصلاح خطأ 400 (Bad Request)

## ❌ المشكلة

عند محاولة تسجيل الدخول، يظهر خطأ 400 (Bad Request).

---

## 🔍 الأسباب المحتملة

### 1. البيانات غير مكتملة
السيرفر يتوقع:
- `email` (مطلوب)
- `password` (مطلوب)

### 2. تنسيق البيانات خاطئ
قد تكون البيانات لا تُرسل بشكل صحيح.

### 3. مشكلة في CORS
قد يكون السيرفر يرفض الطلب.

---

## ✅ الحلول المطبقة

### 1. تحسين معالجة الأخطاء
تم تحديث `LoginScreen.js` و `RegisterScreen.js` لعرض رسائل خطأ أوضح.

### 2. إضافة Logging
تم إضافة `console.log` لتتبع البيانات المرسلة.

---

## 🔍 خطوات التشخيص

### 1. افتح Console في Terminal
عند محاولة تسجيل الدخول، ستظهر رسائل مثل:
```
Login request: { email: 'user@example.com', password: '***' }
```

### 2. تحقق من رسالة الخطأ
الآن ستظهر رسالة خطأ أوضح:
- **400**: "بيانات غير صحيحة. يرجى التحقق من البريد الإلكتروني وكلمة المرور"
- **401**: "البريد الإلكتروني أو كلمة المرور غير صحيحة"
- **500**: "خطأ في السيرفر. يرجى المحاولة لاحقاً"

### 3. تحقق من Backend
افتح في المتصفح:
```
https://construction-backend-nw0g.onrender.com/api/health
```

يجب أن ترى:
```json
{
  "status": "healthy",
  "database": "connected",
  ...
}
```

---

## 🧪 اختبار يدوي

### 1. اختبر API مباشرة
استخدم Postman أو curl:

```bash
curl -X POST https://construction-backend-nw0g.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 2. تحقق من البيانات
تأكد أن:
- البريد الإلكتروني صحيح
- كلمة المرور ليست فارغة
- الحقول مملوءة بشكل صحيح

---

## 🔧 حلول إضافية

### إذا استمر الخطأ 400:

#### 1. تحقق من تنسيق البريد الإلكتروني
```javascript
// في LoginScreen.js
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  Alert.alert('خطأ', 'البريد الإلكتروني غير صحيح');
  return;
}
```

#### 2. تحقق من طول كلمة المرور
```javascript
if (password.length < 6) {
  Alert.alert('خطأ', 'كلمة المرور يجب أن تكون 6 أحرف على الأقل');
  return;
}
```

#### 3. تحقق من اتصال Backend
```javascript
// في src/api/index.js
console.log('API Base URL:', API_BASE_URL);
```

---

## 📝 ملاحظات

1. **خطأ 400** يعني أن الطلب وصل للسيرفر لكن البيانات غير صحيحة
2. **خطأ 401** يعني أن البيانات صحيحة لكن المستخدم غير موجود أو كلمة المرور خاطئة
3. **خطأ 500** يعني خطأ في السيرفر نفسه

---

## ✅ الخطوات التالية

1. **أعد تحميل التطبيق** (اضغط `r` في Terminal)
2. **جرب تسجيل الدخول مرة أخرى**
3. **تحقق من Console** لرؤية البيانات المرسلة
4. **تحقق من رسالة الخطأ** - ستكون أوضح الآن

---

## 🔗 روابط مفيدة

- Backend Health: `https://construction-backend-nw0g.onrender.com/api/health`
- Backend Root: `https://construction-backend-nw0g.onrender.com/`

---

**تم تحديث معالجة الأخطاء! جرب الآن وستحصل على رسالة خطأ أوضح! 🚀**
