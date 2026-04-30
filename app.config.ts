import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'بنيان',
  slug: 'bunyan-construction',
  scheme: 'bunyan-construction',
  version: '1.0.1',
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
    versionCode: 2,
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
      projectId: '38176dd0-cae7-4073-9624-e57579e5e885',
    },
    apiUrl: process.env.EXPO_PUBLIC_API_URL ?? 'https://alnuimie.onrender.com/api',
    stripePublishableKey: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '',
    enableGoogleAuth: (process.env.EXPO_PUBLIC_ENABLE_GOOGLE_AUTH ?? 'false') === 'true',
    googleWebClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '',
    googleOauthRedirectUri:
      process.env.EXPO_PUBLIC_GOOGLE_OAUTH_REDIRECT_URI ??
      'https://alnuimie515.vercel.app/auth/google/callback',
  },
});
