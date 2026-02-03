# 📱 دليل تحويل المشروع إلى تطبيق موبايل

## 🎯 نظرة عامة

هذا الدليل يشرح كيفية تحويل مشروع **نظام إدارة المقاولات** من تطبيق ويب (React) إلى تطبيق موبايل باستخدام **React Native** و **Expo**.

---

## 📋 الخيارات المتاحة

### 1. **React Native + Expo** (موصى به) ⭐
- ✅ إعادة استخدام معظم الكود
- ✅ سهولة التطوير والنشر
- ✅ دعم iOS و Android من كود واحد
- ✅ أداء ممتاز

### 2. **React Native CLI**
- ✅ تحكم كامل
- ❌ يحتاج إعداد أكثر تعقيداً
- ❌ يحتاج Xcode (لـ iOS) و Android Studio

### 3. **Progressive Web App (PWA)**
- ✅ لا يحتاج متاجر تطبيقات
- ❌ محدود في الوصول لميزات الجهاز
- ❌ أداء أقل من التطبيق الأصلي

---

## 🚀 الخيار الموصى به: React Native + Expo

### لماذا Expo؟
- ✅ لا يحتاج إعداد Xcode أو Android Studio للبدء
- ✅ نشر سهل عبر Expo Go
- ✅ مكتبات جاهزة للكاميرا، الإشعارات، إلخ
- ✅ يمكن إضافة كود أصلي لاحقاً (EAS Build)

---

## 📦 الخطوة 1: تثبيت المتطلبات

### 1.1 تثبيت Node.js
```bash
# تحقق من الإصدار (يجب أن يكون 16+)
node --version
npm --version
```

### 1.2 تثبيت Expo CLI
```bash
npm install -g expo-cli
# أو
npm install -g @expo/cli
```

### 1.3 تثبيت Expo Go على هاتفك
- **iOS**: [App Store - Expo Go](https://apps.apple.com/app/expo-go/id982107779)
- **Android**: [Google Play - Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent)

---

## 🏗️ الخطوة 2: إنشاء مشروع React Native جديد

### 2.1 إنشاء مجلد جديد للموبايل
```bash
# في المجلد الرئيسي للمشروع
cd ..
npx create-expo-app@latest alnuimie-mobile --template blank
cd alnuimie-mobile
```

### 2.2 تثبيت المكتبات الأساسية
```bash
# التنقل
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs

# الاعتماديات الأساسية للتنقل
npx expo install react-native-screens react-native-safe-area-context

# التخزين المحلي (بديل localStorage)
npm install @react-native-async-storage/async-storage

# HTTP Requests
npm install axios

# Icons
npm install @expo/vector-icons

# Forms
npm install react-hook-form

# UI Components
npm install react-native-paper  # أو react-native-elements
```

---

## 📁 الخطوة 3: هيكل المشروع

```
alnuimie-mobile/
├── App.js                 # نقطة الدخول
├── app.json              # إعدادات Expo
├── package.json
├── src/
│   ├── api/              # API calls (مشابه لـ utils/api.js)
│   │   └── index.js
│   ├── components/       # مكونات قابلة لإعادة الاستخدام
│   │   ├── Button.js
│   │   ├── Input.js
│   │   └── Card.js
│   ├── screens/          # الشاشات (بديل pages/)
│   │   ├── auth/
│   │   │   ├── LoginScreen.js
│   │   │   └── RegisterScreen.js
│   │   ├── client/
│   │   │   ├── ClientDashboardScreen.js
│   │   │   └── ClientProjectsScreen.js
│   │   └── contractor/
│   │       └── ContractorDashboardScreen.js
│   ├── navigation/        # إعدادات التنقل
│   │   └── AppNavigator.js
│   ├── context/           # Context API (للحالة العامة)
│   │   └── AuthContext.js
│   └── utils/            # أدوات مساعدة
│       └── constants.js
└── assets/               # الصور والخطوط
```

---

## 🔧 الخطوة 4: تحويل API Calls

### 4.1 إنشاء ملف API للموبايل

**`src/api/index.js`** (مشابه لـ `src/utils/api.js`):

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Base URL - استخدم نفس Backend
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:4000/api'  // Development
  : 'https://construction-backend-nw0g.onrender.com/api';  // Production

// إنشاء axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Interceptor لإضافة Token تلقائياً
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('jwtToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Token Management
export const setToken = async (token) => {
  await AsyncStorage.setItem('jwtToken', token);
};

export const getToken = async () => {
  return await AsyncStorage.getItem('jwtToken');
};

export const removeToken = async () => {
  await AsyncStorage.removeItem('jwtToken');
};

// User Management
export const setUser = async (user) => {
  await AsyncStorage.setItem('user', JSON.stringify(user));
};

export const getUser = async () => {
  try {
    const user = await AsyncStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (e) {
    console.error('Failed to parse user', e);
    return null;
  }
};

export const removeUser = async () => {
  await AsyncStorage.removeItem('user');
};

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (email, password) => api.post('/auth/login', { email, password }),
  getGoogleAuthUrl: () => api.get('/auth/google/url'),
  googleCallback: (code, role) => api.post('/auth/google/callback', { code, role }),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, email, password) => 
    api.post('/auth/reset-password', { token, email, password }),
};

// Projects API
export const projectsAPI = {
  getAll: (filters = {}) => api.get('/projects', { params: filters }),
  getById: (id) => api.get(`/projects/${id}`),
  create: (projectData) => api.post('/projects', projectData),
  update: (id, updateData) => api.put(`/projects/${id}`, updateData),
  remove: (id) => api.delete(`/projects/${id}`),
};

// Materials API
export const materialsAPI = {
  getAll: (filters = {}) => api.get('/materials', { params: filters }),
  getById: (id) => api.get(`/materials/${id}`),
  create: (materialData) => api.post('/materials', materialData),
  update: (id, updateData) => api.put(`/materials/${id}`, updateData),
  remove: (id) => api.delete(`/materials/${id}`),
};

// ... باقي APIs (نفس الطريقة)
// Suppliers, Purchases, Payments, Issues, Contracts, Requests, Reports

export default api;
```

---

## 🎨 الخطوة 5: إنشاء شاشة تسجيل الدخول

**`src/screens/auth/LoginScreen.js`**:

```javascript
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { authAPI, setToken, setUser } from '../../api';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('خطأ', 'يرجى إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.login(email, password);
      await setToken(response.data.token);
      await setUser(response.data.user);
      
      // التنقل حسب نوع المستخدم
      if (response.data.user.role === 'client') {
        navigation.replace('ClientTabs');
      } else {
        navigation.replace('ContractorTabs');
      }
    } catch (error) {
      Alert.alert(
        'خطأ في تسجيل الدخول',
        error.response?.data?.message || 'حدث خطأ أثناء تسجيل الدخول'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>تسجيل الدخول</Text>
      
      <TextInput
        style={styles.input}
        placeholder="البريد الإلكتروني"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="كلمة المرور"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>تسجيل الدخول</Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={() => navigation.navigate('Register')}
        style={styles.link}
      >
        <Text style={styles.linkText}>ليس لديك حساب؟ سجل الآن</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#007AFF',
    fontSize: 16,
  },
});

export default LoginScreen;
```

---

## 🧭 الخطوة 6: إعداد التنقل

**`src/navigation/AppNavigator.js`**:

```javascript
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ClientDashboardScreen from '../screens/client/ClientDashboardScreen';
import ClientProjectsScreen from '../screens/client/ClientProjectsScreen';
import ContractorDashboardScreen from '../screens/contractor/ContractorDashboardScreen';

// Utils
import { getUser } from '../api';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Client Tabs
const ClientTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Dashboard') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Projects') {
          iconName = focused ? 'folder' : 'folder-outline';
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#007AFF',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen name="Dashboard" component={ClientDashboardScreen} />
    <Tab.Screen name="Projects" component={ClientProjectsScreen} />
  </Tab.Navigator>
);

// Contractor Tabs
const ContractorTabs = () => (
  <Tab.Navigator>
    <Tab.Screen name="Dashboard" component={ContractorDashboardScreen} />
  </Tab.Navigator>
);

const AppNavigator = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const userData = await getUser();
      setUser(userData);
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return null; // أو شاشة تحميل
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : user.role === 'client' ? (
          <Stack.Screen name="ClientTabs" component={ClientTabs} />
        ) : (
          <Stack.Screen name="ContractorTabs" component={ContractorTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
```

---

## 📱 الخطوة 7: تحديث App.js

**`App.js`**:

```javascript
import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return <AppNavigator />;
}
```

---

## ⚙️ الخطوة 8: إعدادات Expo

**`app.json`**:

```json
{
  "expo": {
    "name": "نظام إدارة المقاولات",
    "slug": "alnuimie-mobile",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.alnuimie.mobile"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.alnuimie.mobile"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}
```

---

## 🚀 الخطوة 9: تشغيل التطبيق

### 9.1 Development Mode
```bash
# في مجلد alnuimie-mobile
npm start
# أو
expo start
```

### 9.2 على الهاتف
1. افتح Expo Go على هاتفك
2. امسح QR Code الذي يظهر في Terminal
3. التطبيق سيعمل على هاتفك!

### 9.3 على المحاكي
```bash
# iOS Simulator (Mac فقط)
npm run ios

# Android Emulator
npm run android
```

---

## 🔄 الخطوة 10: التحويلات المهمة

### 10.1 CSS → StyleSheet
```javascript
// ❌ Web (CSS)
<div className="container">

// ✅ Mobile (StyleSheet)
<View style={styles.container}>
```

### 10.2 HTML → React Native Components
```javascript
// ❌ Web
<div> → <View>
<span> → <Text>
<input> → <TextInput>
<button> → <TouchableOpacity>
<img> → <Image>
```

### 10.3 localStorage → AsyncStorage
```javascript
// ❌ Web
localStorage.setItem('key', 'value');

// ✅ Mobile
await AsyncStorage.setItem('key', 'value');
```

### 10.4 fetch → axios
```javascript
// ✅ يمكن استخدام axios (أسهل)
import axios from 'axios';
```

---

## 📦 الخطوة 11: إضافة ميزات موبايل

### 11.1 الإشعارات
```bash
npm install expo-notifications
```

### 11.2 الكاميرا
```bash
npm install expo-camera
```

### 11.3 الموقع الجغرافي
```bash
npm install expo-location
```

### 11.4 مشاركة الملفات
```bash
npm install expo-sharing expo-file-system
```

---

## 🏗️ الخطوة 12: بناء التطبيق للنشر

### 12.1 تثبيت EAS CLI
```bash
npm install -g eas-cli
```

### 12.2 تسجيل الدخول
```bash
eas login
```

### 12.3 إعداد المشروع
```bash
eas build:configure
```

### 12.4 بناء التطبيق
```bash
# Android
eas build --platform android

# iOS (يحتاج Apple Developer Account)
eas build --platform ios
```

---

## 📝 ملاحظات مهمة

### ✅ ما يعمل مباشرة:
- ✅ معظم منطق JavaScript
- ✅ API calls
- ✅ State management
- ✅ Business logic

### ⚠️ ما يحتاج تعديل:
- ⚠️ CSS → StyleSheet
- ⚠️ HTML elements → React Native components
- ⚠️ localStorage → AsyncStorage
- ⚠️ بعض المكتبات قد لا تعمل (تحقق من التوافق)

---

## 🔗 روابط مفيدة

- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Expo Vector Icons](https://docs.expo.dev/guides/icons/)

---

## 🎯 الخطوات التالية

1. ✅ إنشاء مشروع Expo جديد
2. ✅ تحويل API calls
3. ✅ إنشاء شاشات Authentication
4. ✅ إنشاء شاشات Dashboard
5. ✅ إضافة التنقل
6. ✅ اختبار على أجهزة حقيقية
7. ✅ بناء ونشر التطبيق

---

## 💡 نصائح

1. **ابدأ ببطء**: حول شاشة واحدة في كل مرة
2. **اختبر على أجهزة حقيقية**: المحاكيات قد تختلف
3. **استخدم TypeScript**: يساعد في تجنب الأخطاء
4. **احفظ Backend كما هو**: لا حاجة لتغييره
5. **استخدم Git**: احفظ كل خطوة

---

**تم إنشاء هذا الدليل لمساعدتك في تحويل مشروعك إلى تطبيق موبايل بنجاح! 🚀**
