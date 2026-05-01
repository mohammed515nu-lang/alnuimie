import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../config/env';

const TOKEN_KEY = 'auth_token';

export const api = axios.create({
  baseURL: API_URL,
  // Render Free: أول طلب بعد السبات قد يتجاوز 60 ثانية قبل أن يستجيب Node أصلاً
  timeout: 120_000,
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function setAuthToken(token: string | null) {
  if (token) {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } else {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }
}

export async function getAuthToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function getApiErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    if (!err.response) {
      if (err.code === 'ECONNABORTED') {
        return 'انتهت مهلة الاتصال. إن كان الخادم على Render فقد يكون في سبات — انتظر نحو دقيقة ثم أعد المحاولة.';
      }
      const code = err.code ? ` (${err.code})` : '';
      const hint = err.message && err.message !== 'Network Error' ? ` ${err.message}` : '';
      return `تعذر الوصول للخادم${code}.${hint} تحقق من الإنترنت ومن صحة رابط الـ API في إعدادات البناء.\nالرابط: ${API_URL}`;
    }
    const data = err.response?.data as { message?: string; error?: string } | undefined;
    const raw = (data?.message || data?.error || err.message || 'حدث خطأ غير متوقع').trim();
    const lower = raw.toLowerCase();
    if (lower.includes('invalid credentials')) return 'البريد الإلكتروني أو كلمة المرور غير صحيحة.';
    if (lower.includes('this account was created with google')) {
      return 'هذا الحساب مُسجّل عبر Google. استخدم تسجيل الدخول بـ Google أو أعد تعيين كلمة المرور.';
    }
    if (lower.includes('not authenticated') || lower.includes('authentication required')) {
      return 'انتهت الجلسة. يرجى تسجيل الدخول من جديد.';
    }
    return raw;
  }
  if (err instanceof Error) return err.message;
  return 'حدث خطأ غير متوقع';
}
