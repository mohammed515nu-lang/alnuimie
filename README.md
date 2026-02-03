# 📱 تطبيق موبايل - نظام إدارة المقاولات

تطبيق موبايل مبني باستخدام React Native و Expo لنظام إدارة المقاولات.

## 🚀 البدء السريع

### 1. تثبيت المتطلبات

```bash
# تأكد من تثبيت Node.js (v16+)
node --version

# تثبيت Expo CLI (اختياري)
npm install -g expo-cli
```

### 2. تثبيت المكتبات

```bash
npm install
```

### 3. تشغيل التطبيق

```bash
npm start
```

### 4. فتح على الهاتف

1. ثبت **Expo Go** على هاتفك:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Android Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. تأكد أن الكمبيوتر والهاتف على نفس الشبكة (WiFi)

3. امسح QR Code الذي يظهر في Terminal

### 5. تشغيل على المحاكي

```bash
# iOS (Mac فقط)
npm run ios

# Android
npm run android
```

---

## 📁 هيكل المشروع

```
alnuimie-mobile/
├── App.js                 # نقطة الدخول
├── app.json              # إعدادات Expo
├── package.json
├── src/
│   ├── api/              # API calls
│   │   └── index.js
│   ├── screens/          # الشاشات
│   │   └── auth/
│   │       ├── LoginScreen.js
│   │       └── RegisterScreen.js
│   └── navigation/       # التنقل
│       └── AppNavigator.js
└── assets/               # الصور والخطوط
```

---

## ⚙️ الإعدادات

### تغيير API URL

في `src/api/index.js`:
```javascript
const API_BASE_URL = __DEV__
  ? 'http://YOUR_IP:4000/api'  // للتطوير (استبدل YOUR_IP بـ IP جهازك)
  : 'https://construction-backend-nw0g.onrender.com/api';  // للإنتاج
```

**ملاحظة:** للاختبار على هاتف حقيقي، استخدم IP جهازك بدلاً من localhost.

---

## 📚 الميزات

✅ تسجيل الدخول والتسجيل
✅ إدارة Token والمستخدم
✅ API calls كاملة
✅ تنقل حسب نوع المستخدم (عميل/مقاول)
✅ تصميم responsive

---

## 🔧 المكتبات المستخدمة

- **React Native** - إطار العمل الأساسي
- **Expo** - أدوات التطوير والنشر
- **React Navigation** - التنقل بين الشاشات
- **Axios** - HTTP requests
- **AsyncStorage** - التخزين المحلي
- **Expo Vector Icons** - الأيقونات

---

## 📝 الخطوات التالية

1. إضافة المزيد من الشاشات (Dashboard، المشاريع، إلخ)
2. تحسين التصميم
3. إضافة ميزات موبايل (كاميرا، إشعارات)
4. بناء ونشر التطبيق

---

## 🔗 روابط مفيدة

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)

---

## 📖 الدليل الكامل

راجع `../alnuimie-main/MOBILE_APP_GUIDE.md` للدليل الشامل.

---

**تم إنشاء المشروع بنجاح! 🎉**
