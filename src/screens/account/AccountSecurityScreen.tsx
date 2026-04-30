import { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { TopBar } from '../../components/TopBar';
import { authAPI } from '../../api/services/auth';
import { getApiErrorMessage } from '../../api/http';
import { useStore } from '../../store/useStore';
import { pressableRipple, space, touch, useAppTheme } from '../../theme';
import { DASHBOARD_RADIUS, getDashboardPalette, type DashboardPalette } from '../../theme/dashboardLight';
import { hapticSuccess } from '../../utils/haptics';
import { isIOS } from '../../utils/platformEnv';

export function AccountSecurityScreen() {
  const user = useStore((s) => s.user);
  const insets = useSafeAreaInsets();
  const { resolved } = useAppTheme();
  const dash = useMemo(() => getDashboardPalette(resolved), [resolved]);
  const styles = useMemo(() => createStyles(dash), [dash]);

  const [current, setCurrent] = useState('');
  const [nextPwd, setNextPwd] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);

  const bottomPad = space.xxl + 8 + insets.bottom;

  const onForgotEmail = async () => {
    const email = user?.email?.trim();
    if (!email) {
      Alert.alert('تنبيه', 'لا يوجد بريد مرتبط بهذا الحساب.');
      return;
    }
    try {
      const res = await authAPI.forgotPassword(email);
      const extra = res.resetUrl ? `\n\n(وضع التطوير) رابط الاستعادة:\n${res.resetUrl}` : '';
      Alert.alert('تم الطلب', `${res.message ?? 'تحقق من بريدك إن وُجد حساب بهذا العنوان.'}${extra}`);
    } catch (e) {
      Alert.alert('تعذر الطلب', getApiErrorMessage(e));
    }
  };

  const onChangePassword = async () => {
    if (!current.trim() || !nextPwd.trim()) {
      Alert.alert('تنبيه', 'أدخل كلمة المرور الحالية والجديدة.');
      return;
    }
    if (nextPwd.length < 6) {
      Alert.alert('تنبيه', 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل.');
      return;
    }
    if (nextPwd !== confirm) {
      Alert.alert('تنبيه', 'تأكيد كلمة المرور لا يطابق الجديدة.');
      return;
    }
    setBusy(true);
    try {
      await authAPI.changePassword({ currentPassword: current, newPassword: nextPwd });
      hapticSuccess();
      setCurrent('');
      setNextPwd('');
      setConfirm('');
      Alert.alert('تم', 'تم تغيير كلمة المرور بنجاح.');
    } catch (e) {
      Alert.alert('تعذر التغيير', getApiErrorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <TopBar tone="beige" title="الأمان" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={isIOS ? 'padding' : undefined}
        keyboardVerticalOffset={isIOS ? 64 : 0}
      >
        <ScrollView
          contentContainerStyle={[styles.root, { paddingBottom: bottomPad }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>حماية الحساب</Text>
            <Text style={styles.infoBody}>
              استخدم كلمة مرور قوية ولا تشاركها. يمكنك تغييرها هنا إن كان حسابك ببريد وكلمة مرور (وليس Google فقط).
            </Text>
          </View>

          <Text style={styles.section}>تغيير كلمة المرور</Text>
          <Text style={styles.label}>كلمة المرور الحالية</Text>
          <TextInput
            value={current}
            onChangeText={setCurrent}
            secureTextEntry
            placeholder="••••••••"
            placeholderTextColor={dash.muted}
            style={styles.input}
            textAlign="right"
            autoCapitalize="none"
          />
          <Text style={styles.label}>كلمة المرور الجديدة</Text>
          <TextInput
            value={nextPwd}
            onChangeText={setNextPwd}
            secureTextEntry
            placeholder="6 أحرف على الأقل"
            placeholderTextColor={dash.muted}
            style={styles.input}
            textAlign="right"
            autoCapitalize="none"
          />
          <Text style={styles.label}>تأكيد الجديدة</Text>
          <TextInput
            value={confirm}
            onChangeText={setConfirm}
            secureTextEntry
            placeholder="أعد كتابة كلمة المرور"
            placeholderTextColor={dash.muted}
            style={styles.input}
            textAlign="right"
            autoCapitalize="none"
          />

          <Pressable
            accessibilityRole="button"
            disabled={busy}
            onPress={() => void onChangePassword()}
            {...pressableRipple(dash.goldTint)}
            style={[styles.primary, busy && { opacity: 0.6 }]}
          >
            <Text style={styles.primaryText}>تحديث كلمة المرور</Text>
          </Pressable>

          <Text style={styles.section}>نسيت كلمة المرور؟</Text>
          <Text style={styles.hint}>سنرسل تعليمات الاستعادة إلى بريدك المسجّل ({user?.email ?? '—'}).</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => void onForgotEmail()}
            {...pressableRipple(dash.navyTint)}
            style={styles.secondary}
          >
            <Text style={styles.secondaryText}>طلب رابط استعادة عبر البريد</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function createStyles(dash: DashboardPalette) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: dash.pageBg },
    flex: { flex: 1, backgroundColor: dash.pageBg },
    root: { paddingHorizontal: 16, paddingTop: 4 },
    infoCard: {
      backgroundColor: dash.white,
      borderRadius: DASHBOARD_RADIUS,
      borderWidth: 1,
      borderColor: dash.border,
      padding: 16,
      marginBottom: space.lg,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
    },
    infoTitle: { color: dash.navy, fontWeight: '900', fontSize: 16, textAlign: 'right', marginBottom: 8 },
    infoBody: { color: dash.muted, fontSize: 14, lineHeight: 22, textAlign: 'right' },
    section: {
      color: dash.navy,
      fontWeight: '900',
      fontSize: 15,
      textAlign: 'right',
      marginBottom: 10,
      marginTop: 8,
    },
    label: { color: dash.muted, marginBottom: space.sm - 2, fontWeight: '700', textAlign: 'right' },
    input: {
      backgroundColor: dash.white,
      borderColor: dash.border,
      borderWidth: 1,
      borderRadius: DASHBOARD_RADIUS,
      paddingHorizontal: space.md,
      paddingVertical: space.md,
      color: dash.darkText,
      minHeight: touch.minHeight,
      marginBottom: space.sm + 2,
    },
    primary: {
      backgroundColor: dash.gold,
      borderRadius: DASHBOARD_RADIUS,
      paddingVertical: space.md,
      marginTop: space.sm,
      minHeight: touch.minHeight,
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: dash.gold,
    },
    primaryText: { color: dash.onGold, textAlign: 'center', fontWeight: '900' },
    hint: { color: dash.muted, fontSize: 13, lineHeight: 20, textAlign: 'right', marginBottom: space.sm + 2 },
    secondary: {
      borderRadius: DASHBOARD_RADIUS,
      paddingVertical: space.md,
      borderWidth: 1,
      borderColor: dash.border,
      minHeight: touch.minHeight,
      justifyContent: 'center',
      backgroundColor: dash.white,
    },
    secondaryText: { color: dash.darkText, textAlign: 'center', fontWeight: '800' },
  });
}
