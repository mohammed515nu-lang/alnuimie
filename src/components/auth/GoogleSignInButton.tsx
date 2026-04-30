import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Google from 'expo-auth-session/providers/google';

import { authAPI } from '../../api/services';
import { getApiErrorMessage } from '../../api/http';
import { GOOGLE_OAUTH_REDIRECT_URI, GOOGLE_WEB_CLIENT_ID } from '../../config/env';
import { useAppTheme, font, space, touch } from '../../theme';
import { isAndroid } from '../../utils/platformEnv';
import { hapticSuccess } from '../../utils/haptics';
import type { AuthUser } from '../../api/types';

type Props = {
  onSignedIn: (user: AuthUser) => void;
  disabled?: boolean;
};

export function GoogleSignInButton({ onSignedIn, disabled }: Props) {
  const { authUi } = useAppTheme();
  const [busy, setBusy] = useState(false);

  const clientId = GOOGLE_WEB_CLIENT_ID.trim();
  const redirectUri = GOOGLE_OAUTH_REDIRECT_URI.trim();

  const [request, response, promptAsync] = Google.useAuthRequest(
    {
      webClientId: clientId,
      iosClientId: clientId,
      androidClientId: clientId,
      redirectUri,
      shouldAutoExchangeCode: false,
      usePKCE: false,
    },
    {}
  );

  const styles = useMemo(
    () =>
      StyleSheet.create({
        wrap: { marginTop: space.md, gap: space.sm },
        dividerRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: space.sm, marginTop: space.sm },
        line: { flex: 1, height: 1, backgroundColor: authUi.border },
        dividerTxt: { color: authUi.muted, fontSize: 12, fontWeight: '700' },
        btn: {
          borderCurve: 'continuous',
          flexDirection: 'row-reverse',
          alignItems: 'center',
          justifyContent: 'center',
          gap: space.sm,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: authUi.border,
          backgroundColor: authUi.inputBg,
          paddingVertical: space.sm + 6,
          minHeight: touch.minHeight - 2,
        },
        btnTxt: { color: authUi.text, fontSize: font.body, fontWeight: '800' },
      }),
    [authUi]
  );

  const androidRipple = useCallback(() => {
    if (!isAndroid) return {};
    return { android_ripple: { color: 'rgba(245,158,11,0.18)', borderless: false } };
  }, []);

  useEffect(() => {
    if (!response) return;
    if (response.type === 'cancel' || response.type === 'dismiss') return;
    if (response.type === 'error') {
      const msg = response.error?.message ?? response.params?.error_description ?? 'تعذر إكمال تسجيل الدخول بـ Google';
      Alert.alert('Google', String(msg));
      return;
    }
    if (response.type !== 'success') return;

    const code = response.params?.code;
    if (!code) {
      Alert.alert('Google', 'لم يُرجع Google رمز التفويض. تحقق من إعدادات OAuth.');
      return;
    }

    let cancelled = false;
    (async () => {
      setBusy(true);
      try {
        const res = await authAPI.loginWithGoogleAuthorizationCode(code);
        if (!cancelled) {
          hapticSuccess();
          onSignedIn(res.user);
        }
      } catch (e) {
        if (!cancelled) Alert.alert('تعذر الدخول', getApiErrorMessage(e));
      } finally {
        if (!cancelled) setBusy(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [response, onSignedIn]);

  const onPress = async () => {
    if (!clientId) {
      Alert.alert(
        'إعداد ناقص',
        'أضف EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID في ملف .env أو في متغيرات مشروع Expo (نفس معرف عميل Google المستخدم على السيرفر).'
      );
      return;
    }
    if (!request) {
      Alert.alert('تنبيه', 'جاري تهيئة Google… حاول بعد لحظة.');
      return;
    }
    setBusy(true);
    try {
      await promptAsync();
    } catch (e) {
      Alert.alert('Google', getApiErrorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  const loading = busy || !request;
  const isDisabled = disabled || loading || !clientId;

  return (
    <View style={styles.wrap}>
      <View style={styles.dividerRow}>
        <View style={styles.line} />
        <Text style={styles.dividerTxt}>أو</Text>
        <View style={styles.line} />
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="تسجيل الدخول بحساب Google"
        disabled={isDisabled}
        onPress={() => void onPress()}
        {...androidRipple()}
        style={[styles.btn, isDisabled && { opacity: 0.55 }]}
      >
        {loading ? (
          <ActivityIndicator color={authUi.orange} />
        ) : (
          <Ionicons name="logo-google" size={22} color={authUi.text} />
        )}
        <Text style={styles.btnTxt}>المتابعة مع Google</Text>
      </Pressable>
    </View>
  );
}
