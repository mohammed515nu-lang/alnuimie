# 📱 تعليمات إعداد تطبيق الموبايل

## الخطوة 1: إنشاء مشروع Expo جديد

### الطريقة الأولى: استخدام الملفات الجاهزة

1. انسخ مجلد `mobile-setup` إلى مكان جديد:
```bash
# في المجلد الرئيسي
cp -r mobile-setup ../alnuimie-mobile
cd ../alnuimie-mobile
```

2. ثبت المكتبات:
```bash
npm install
```

### الطريقة الثانية: إنشاء مشروع جديد من الصفر

```bash
# في المجلد الرئيسي
cd ..
npx create-expo-app@latest alnuimie-mobile --template blank
cd alnuimie-mobile
```

ثم انسخ الملفات من `mobile-setup` إلى المشروع الجديد.

---

## الخطوة 2: تثبيت المكتبات المطلوبة

```bash
# التنقل
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs

# الاعتماديات الأساسية
npx expo install react-native-screens react-native-safe-area-context

# التخزين المحلي
npm install @react-native-async-storage/async-storage

# HTTP Requests
npm install axios

# Icons
npm install @expo/vector-icons

# Forms (اختياري)
npm install react-hook-form

# Constants (للوصول لإعدادات Expo)
npx expo install expo-constants
```

---

## الخطوة 3: إعداد API URL

### للتطوير المحلي:

1. تأكد أن Backend يعمل على `http://localhost:4000`

2. للاختبار على هاتف حقيقي، ستحتاج IP جهازك:
   - Windows: `ipconfig` (ابحث عن IPv4)
   - Mac/Linux: `ifconfig` (ابحث عن inet)

3. في `src/api/index.js`، غيّر:
```javascript
const API_BASE_URL = __DEV__
  ? 'http://YOUR_IP_ADDRESS:4000/api'  // استبدل YOUR_IP_ADDRESS
  : 'https://construction-backend-nw0g.onrender.com/api';
```

### للإنتاج:

استخدم الرابط الحالي في `app.json`:
```json
{
  "expo": {
    "extra": {
      "apiUrl": "https://construction-backend-nw0g.onrender.com/api"
    }
  }
}
```

---

## الخطوة 4: تشغيل التطبيق

### على الكمبيوتر:

```bash
npm start
```

### على الهاتف:

1. ثبت **Expo Go**:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Android Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. تأكد أن الكمبيوتر والهاتف على نفس الشبكة (WiFi)

3. امسح QR Code الذي يظهر في Terminal

### على المحاكي:

```bash
# iOS (Mac فقط)
npm run ios

# Android
npm run android
```

---

## الخطوة 5: إضافة المزيد من الشاشات

### مثال: إضافة شاشة Dashboard للعميل

1. أنشئ ملف `src/screens/client/ClientDashboardScreen.js`:

```javascript
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { projectsAPI, getUser } from '../../api';

const ClientDashboardScreen = () => {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await getUser();
      setUser(userData);
      
      const response = await projectsAPI.getAll();
      setProjects(response.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>مرحباً {user?.name}</Text>
      <Text style={styles.subtitle}>عدد المشاريع: {projects.length}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});

export default ClientDashboardScreen;
```

2. استبدل الـ placeholder في `AppNavigator.js`:

```javascript
import ClientDashboardScreen from '../screens/client/ClientDashboardScreen';
```

---

## الخطوة 6: إضافة الأيقونات والصور

1. ضع الأيقونات في `assets/`:
   - `icon.png` (1024x1024)
   - `splash.png` (1242x2436)
   - `adaptive-icon.png` (1024x1024)

2. استخدم الصور في الكود:
```javascript
import { Image } from 'react-native';

<Image 
  source={require('../assets/logo.png')} 
  style={{ width: 100, height: 100 }} 
/>
```

---

## الخطوة 7: بناء التطبيق للنشر

### باستخدام EAS Build:

```bash
# تثبيت EAS CLI
npm install -g eas-cli

# تسجيل الدخول
eas login

# إعداد المشروع
eas build:configure

# بناء Android
eas build --platform android

# بناء iOS (يحتاج Apple Developer Account)
eas build --platform ios
```

---

## 🔧 حل المشاكل الشائعة

### المشكلة: لا يمكن الاتصال بالـ API

**الحل:**
1. تأكد أن Backend يعمل
2. تحقق من IP Address (للاختبار على هاتف)
3. تأكد من إعدادات CORS في Backend

### المشكلة: خطأ في تثبيت المكتبات

**الحل:**
```bash
# احذف node_modules و package-lock.json
rm -rf node_modules package-lock.json

# أعد التثبيت
npm install
```

### المشكلة: التطبيق لا يفتح على الهاتف

**الحل:**
1. تأكد أن الكمبيوتر والهاتف على نفس WiFi
2. جرب إعادة تشغيل Expo:
```bash
npm start -- --clear
```

---

## 📚 الخطوات التالية

1. ✅ إضافة المزيد من الشاشات
2. ✅ تحسين التصميم
3. ✅ إضافة ميزات موبايل (كاميرا، إشعارات، إلخ)
4. ✅ اختبار شامل
5. ✅ بناء ونشر التطبيق

---

**راجع `../MOBILE_APP_GUIDE.md` للدليل الكامل!**
