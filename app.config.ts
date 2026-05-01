import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'بنيان',
  // يجب أن يطابق slug مشروع Expo على لوحة المشروع المرتبط بـ extra.eas.projectId (eas init مع مشروع banyan1)
  slug: 'banyan1',
  scheme: 'bunyan-construction',
  version: '1.0.3',
  orientation: 'portrait',
  userInterfaceStyle: 'dark',
  icon: './assets-png/icon.png',
  splash: {
    image: './assets-png/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#E8A838',
  },
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'com.bunyan.construction',
    infoPlist: {
      NSPhotoLibraryUsageDescription: 'نحتاج الوصول للصور لإضافة صور المشاريع',
      NSCameraUsageDescription: 'نحتاج الكاميرا لالتقاط صور المشاريع',
      NSMicrophoneUsageDescription: 'نحتاج الميكروفون لتحويل كلامك إلى نص في مساعد بنيان AI',
      NSSpeechRecognitionUsageDescription: 'نحتاج التعرّف على الكلام لإدخال أسئلتك صوتياً في بنيان AI',
    },
  },
  android: {
    package: 'com.bunyan.construction',
    versionCode: 4,
    /** يضبط windowSoftInputMode — يقلل تغطية الكيبورد لحقول الإدخال السفلية */
    softwareKeyboardLayoutMode: 'resize',
    permissions: ['RECORD_AUDIO'],
    adaptiveIcon: {
      foregroundImage: './assets-png/adaptive-icon.png',
      backgroundColor: '#E8A838',
    },
  },
  web: {
    favicon: './assets-png/favicon.png',
  },
  plugins: [
    [
      'expo-build-properties',
      {
        android: {
          // ABI split: smaller artifact; excludes 32-bit-only devices
          buildArchs: ['arm64-v8a'],
        },
      },
    ],
    'expo-router',
    'expo-secure-store',
    'expo-web-browser',
    'expo-image-picker',
    'expo-font',
    [
      '@stripe/stripe-react-native',
      {
        merchantIdentifier: 'merchant.com.bunyan.construction',
        enableGooglePay: true,
      },
    ],
    [
      'expo-notifications',
      {
        icon: './assets-png/notification-icon.png',
        color: '#E8A838',
        sounds: [],
        enableBackgroundRemoteNotifications: true,
      },
    ],
  ],
  extra: {
    eas: {
      // مشروع Expo المرتبط بحسابك (eas init --id …) — مطلوب لـ eas build بدون خطأ الصلاحيات
      projectId: '65a97044-5719-4c54-a41b-2094584289b1',
    },
    apiUrl: process.env.EXPO_PUBLIC_API_URL ?? 'https://construction-backend-2xi2.onrender.com/api',
    stripePublishableKey: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '',
    enableGoogleAuth: (process.env.EXPO_PUBLIC_ENABLE_GOOGLE_AUTH ?? 'false') === 'true',
    googleWebClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '',
    googleOauthRedirectUri:
      process.env.EXPO_PUBLIC_GOOGLE_OAUTH_REDIRECT_URI ??
      'https://alnuimie515.vercel.app/auth/google/callback',
  },
});
