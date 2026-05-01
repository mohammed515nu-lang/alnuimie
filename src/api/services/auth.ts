import { api, setAuthToken } from '../http';
import type { AuthUser } from '../types';

type LoginResponse = { token: string; user: AuthUser };
type RegisterResponse = LoginResponse;

type AuthResponseRaw =
  | { token?: unknown; accessToken?: unknown; user?: unknown }
  | { data?: { token?: unknown; accessToken?: unknown; user?: unknown } };

function idToString(raw: unknown): string {
  if (raw == null) return '';
  if (typeof raw === 'string' || typeof raw === 'number') return String(raw);
  if (typeof raw === 'object' && 'toString' in raw && typeof (raw as { toString: () => string }).toString === 'function') {
    return String((raw as { toString: () => string }).toString());
  }
  return String(raw);
}

function normalizeUser(u: unknown): AuthUser {
  const anyU = u as { _id?: unknown; id?: unknown; name?: string; email?: string; role?: string; phone?: string };
  return {
    _id: idToString(anyU._id ?? anyU.id),
    name: String(anyU.name ?? ''),
    email: String(anyU.email ?? ''),
    role: String(anyU.role ?? 'client'),
    phone: anyU.phone,
  };
}

function shouldRetryAuthRequest(error: unknown): boolean {
  const err = error as { response?: { status?: number }; code?: string } | undefined;
  if (!err?.response) return true;
  if (err.code === 'ECONNABORTED' || err.code === 'ERR_NETWORK') return true;
  const status = err.response.status ?? 0;
  return status >= 500;
}

function normalizeAuthResponse(raw: AuthResponseRaw): LoginResponse {
  const fromRoot = (raw as { token?: unknown; accessToken?: unknown; user?: unknown }) ?? {};
  const nested = (raw as { data?: { token?: unknown; accessToken?: unknown; user?: unknown } })?.data ?? {};
  const tokenCandidate = fromRoot.token ?? fromRoot.accessToken ?? nested.token ?? nested.accessToken;
  const token = typeof tokenCandidate === 'string' ? tokenCandidate : '';
  if (!token) throw new Error('الخادم أعاد استجابة تسجيل دخول غير مكتملة (token مفقود).');
  const user = fromRoot.user ?? nested.user;
  return { token, user: normalizeUser(user) };
}

export const authAPI = {
  async login(email: string, password: string): Promise<LoginResponse> {
    let data: LoginResponse;
    try {
      const res = await api.post<AuthResponseRaw>(
        '/auth/login',
        { email, password },
        { timeout: 120_000 }
      );
      data = normalizeAuthResponse(res.data);
    } catch (e) {
      if (!shouldRetryAuthRequest(e)) throw e;
      // Retry once for transient cold-start/network failures.
      const res = await api.post<AuthResponseRaw>('/auth/login', { email, password }, { timeout: 120_000 });
      data = normalizeAuthResponse(res.data);
    }
    await setAuthToken(data.token);
    return data;
  },

  async register(payload: {
    name: string;
    email: string;
    password: string;
    role: 'client' | 'contractor';
    phone?: string;
  }): Promise<RegisterResponse> {
    let data: RegisterResponse;
    try {
      const res = await api.post<AuthResponseRaw>(
        '/auth/register',
        payload,
        { timeout: 120_000 }
      );
      data = normalizeAuthResponse(res.data);
    } catch (e) {
      if (!shouldRetryAuthRequest(e)) throw e;
      const res = await api.post<AuthResponseRaw>('/auth/register', payload, { timeout: 120_000 });
      data = normalizeAuthResponse(res.data);
    }
    await setAuthToken(data.token);
    return data;
  },

  async me(): Promise<AuthUser> {
    const { data } = await api.get<{ user: unknown }>('/auth/me', { timeout: 120_000 });
    return normalizeUser(data.user);
  },

  async logout() {
    await setAuthToken(null);
  },

  async forgotPassword(email: string): Promise<{ message: string; resetUrl?: string }> {
    const { data } = await api.post<{ message: string; resetUrl?: string }>('/auth/forgot-password', { email });
    return data;
  },

  async changePassword(payload: { currentPassword: string; newPassword: string }): Promise<{ message: string }> {
    const { data } = await api.post<{ message: string }>('/auth/change-password', payload, { timeout: 120_000 });
    return data;
  },

  /**
   * تسجيل دخول Google: رمز التفويض من OAuth يُرسل للخادم ليستبدله بـ JWT (نفس مسار الويب).
   */
  async loginWithGoogleAuthorizationCode(code: string): Promise<LoginResponse> {
    const res = await api.post<AuthResponseRaw>('/auth/google/callback', { code }, { timeout: 120_000 });
    const data = normalizeAuthResponse(res.data);
    await setAuthToken(data.token);
    return data;
  },

  /**
   * يربط جهاز المستخدم برمز Expo Push لإرسال إشعارات من الخادم.
   * يتوقع الخادم: `POST /auth/push-token` مع جسم JSON يحتوي `expoPushToken` و`platform` (`ios` | `android`).
   */
  async registerPushToken(payload: { expoPushToken: string; platform: 'ios' | 'android' }): Promise<void> {
    await api.post('/auth/push-token', payload, { timeout: 60_000 });
  },
};
