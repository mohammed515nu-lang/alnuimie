import Constants from 'expo-constants';

type Extra = {
  apiUrl?: string;
  stripePublishableKey?: string;
  enableGoogleAuth?: boolean;
  googleWebClientId?: string;
  googleOauthRedirectUri?: string;
};

const extra = (Constants.expoConfig?.extra ?? {}) as Extra;

export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ??
  extra.apiUrl ??
  'https://construction-backend-2xi2.onrender.com/api';

export const STRIPE_PUBLISHABLE_KEY =
  process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? extra.stripePublishableKey ?? '';

/** تسجيل الدخول بـ Google — يُعطّل فقط بـ EXPO_PUBLIC_ENABLE_GOOGLE_AUTH=false أو extra.enableGoogleAuth=false */
export const ENABLE_GOOGLE_AUTH = (() => {
  const envFlag = process.env.EXPO_PUBLIC_ENABLE_GOOGLE_AUTH;
  if (typeof envFlag === 'string' && envFlag.trim() !== '') {
    return envFlag.trim().toLowerCase() === 'true' || envFlag.trim() === '1';
  }
  return (extra.enableGoogleAuth as boolean | undefined) !== false;
})();

/** OAuth 2.0 Web client ID (نفس GOOGLE_CLIENT_ID على السيرفر تقريبًا) */
export const GOOGLE_WEB_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? extra.googleWebClientId ?? '';

/** يجب أن يطابق ما مسجّل في Google Cloud وما يستخدمه الخادم عند تبديل الرمز */
export const GOOGLE_OAUTH_REDIRECT_URI =
  process.env.EXPO_PUBLIC_GOOGLE_OAUTH_REDIRECT_URI ??
  extra.googleOauthRedirectUri ??
  'https://alnuimie515.vercel.app/auth/google/callback';
