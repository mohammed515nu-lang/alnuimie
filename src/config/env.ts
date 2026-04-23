import Constants from 'expo-constants';

type Extra = {
  apiUrl?: string;
  stripePublishableKey?: string;
  enableGoogleAuth?: boolean;
};

const extra = (Constants.expoConfig?.extra ?? {}) as Extra;

export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ??
  extra.apiUrl ??
  'https://alnuimie.onrender.com/api';

export const STRIPE_PUBLISHABLE_KEY =
  process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? extra.stripePublishableKey ?? '';

export const ENABLE_GOOGLE_AUTH =
  (process.env.EXPO_PUBLIC_ENABLE_GOOGLE_AUTH ?? String(extra.enableGoogleAuth ?? false)) === 'true';
