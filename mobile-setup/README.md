# 📱 تطبيق موبايل - نظام إدارة المقاولات

## 🚀 البدء السريع

### 1. تثبيت المتطلبات

```bash
# تثبيت Expo CLI
npm install -g expo-cli

# أو
npm install -g @expo/cli
```

### 2. تثبيت المكتبات

```bash
cd mobile-setup
npm install
```

### 3. تشغيل التطبيق

```bash
npm start
```

### 4. فتح على الهاتف

1. ثبت **Expo Go** على هاتفك:
   - [iOS](https://apps.apple.com/app/expo-go/id982107779)
   - [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. امسح QR Code الذي يظهر في Terminal

---

## 📁 هيكل المشروع

```
mobile-setup/
├── App.js                 # نقطة الدخول
├── app.json              # إعدادات Expo
├── package.json
├── src/
│   ├── api/              # API calls
│   │   └── index.js
│   ├── screens/          # الشاشات
│   │   └── auth/
│   │       └── LoginScreen.js
│   └── navigation/       # التنقل
│       └── AppNavigator.js
└── assets/               # الصور والخطوط
```

---

## ⚙️ الإعدادات

### تغيير API URL

في `app.json`:
```json
{
  "expo": {
    "extra": {
      "apiUrl": "YOUR_API_URL"
    }
  }
}
```

أو في `src/api/index.js`:
```javascript
const API_BASE_URL = 'YOUR_API_URL';
```

---

## 📝 ملاحظات

- هذا هيكل أساسي للتطبيق
- يمكنك إضافة المزيد من الشاشات والمكونات
- راجع `../MOBILE_APP_GUIDE.md` للدليل الكامل

---

## 🔗 روابط مفيدة

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
