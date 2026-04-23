import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'بنيان',
  slug: 'bunyan-construction',
  scheme: 'bunyan-construction',
  version: '1.0.1',
  orientation: 'portrait',
  userInterfaceStyle: 'dark',
  icon: './assets/icon.png',
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#0F172A',
  },
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'com.bunyan.construction',
    infoPlist: {
      NSPhotoLibraryUsageDescription: 'نحتاج الوصول للصور لإضافة صور المشاريع',
      NSCameraUsageDescription: 'نحتاج الكاميرا لالتقاط صور المشاريع',
    },
  },
  android: {
    package: 'com.bunyan.construction',
    versionCode: 2,
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#0F172A',
    },
  },
  web: {
    favicon: './assets/favicon.png',
  },
  plugins: [
    'expo-router',
    'expo-secure-store',
    'expo-image-picker',
    'expo-font',
    [
      '@stripe/stripe-react-native',
      {
        merchantIdentifier: 'merchant.com.bunyan.construction',
        enableGooglePay: true,
      },
    ],
  ],
  extra: {
    apiUrl: process.env.EXPO_PUBLIC_API_URL ?? 'https://alnuimie.onrender.com/api',
    stripePublishableKey: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '',
    enableGoogleAuth: (process.env.EXPO_PUBLIC_ENABLE_GOOGLE_AUTH ?? 'false') === 'true',
  },
});
