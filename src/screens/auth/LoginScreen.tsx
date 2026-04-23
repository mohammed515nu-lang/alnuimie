import { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { authAPI } from '../../api/services';
import { getApiErrorMessage } from '../../api/http';
import {
  DEMO_CLIENT_EMAIL,
  DEMO_CONTRACTOR_EMAIL,
  DEMO_PASSWORD,
} from '../../auth/demoAccounts';
import { useStore } from '../../store/useStore';
import { useAppTheme, font, space, touch } from '../../theme';
import { hapticSuccess } from '../../utils/haptics';
import { isAndroid, isIOS } from '../../utils/platformEnv';

export function LoginScreen() {
  const setUser = useStore((s) => s.setUser);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<'client' | 'contractor'>('contractor');
  const [loading, setLoading] = useState(false);

  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const { authUi, authCardLift, resolved } = useAppTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        screen: { flex: 1, backgroundColor: authUi.bg },
        safe: { flex: 1 },
        flex: { flex: 1 },
        scroll: {
          flexGrow: 1,
          justifyContent: 'center',
          paddingHorizontal: space.lg,
          paddingVertical: space.xl,
        },
        card: {
          ...authCardLift,
          backgroundColor: authUi.card,
          borderRadius: 20,
          padding: space.lg + 4,
          borderWidth: 1,
          borderColor: authUi.border,
          borderTopWidth: 3,
          borderTopColor: authUi.orange,
        },
        logoWrap: { alignItems: 'center', marginBottom: space.md },
        logoCircle: {
          borderCurve: 'continuous',
          boxShadow:
            resolved === 'light'
              ? '0 0 22px rgba(234, 88, 12, 0.28)'
              : '0 0 28px rgba(245, 158, 11, 0.35)',
          width: 76,
          height: 76,
          borderRadius: 38,
          backgroundColor: authUi.logoRing,
          borderWidth: 1,
          borderColor: authUi.border,
          alignItems: 'center',
          justifyContent: 'center',
        },
        screenTitle: {
          color: authUi.text,
          fontSize: font.title,
          fontWeight: '800',
          textAlign: 'center',
        },
        lead: {
          color: authUi.muted,
          fontSize: font.caption,
          textAlign: 'center',
          marginTop: space.sm,
          marginBottom: space.lg,
          lineHeight: 18,
          paddingHorizontal: space.sm,
        },
        roleRow: {
          flexDirection: 'row-reverse',
          gap: space.sm + 2,
          marginBottom: space.md + 2,
        },
        roleBtn: {
          borderCurve: 'continuous',
          flex: 1,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: authUi.border,
          backgroundColor: authUi.inputBg,
          paddingVertical: space.sm + 4,
          minHeight: 46,
          justifyContent: 'center',
        },
        roleBtnOn: {
          backgroundColor: authUi.orange,
          borderColor: authUi.orange,
        },
        roleTxt: {
          textAlign: 'center',
          fontSize: font.body,
          fontWeight: '700',
          color: authUi.label,
        },
        roleTxtOn: {
          color: authUi.onOrange,
        },
        label: {
          color: authUi.label,
          fontSize: 12,
          fontWeight: '600',
          marginBottom: space.xs + 2,
          textAlign: 'right',
        },
        input: {
          borderCurve: 'continuous',
          backgroundColor: authUi.inputBg,
          borderWidth: 1,
          borderColor: authUi.border,
          borderRadius: 12,
          paddingHorizontal: space.md,
          paddingVertical: space.sm + 4,
          fontSize: font.body,
          color: authUi.text,
          marginBottom: space.md,
          minHeight: touch.minHeight - 2,
          textAlign: 'right',
        },
        passRow: {
          borderCurve: 'continuous',
          flexDirection: 'row-reverse',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: authUi.border,
          borderRadius: 12,
          backgroundColor: authUi.inputBg,
          marginBottom: space.md,
          minHeight: touch.minHeight - 2,
        },
        inputPass: {
          flex: 1,
          paddingHorizontal: space.md,
          paddingVertical: space.sm + 4,
          fontSize: font.body,
          color: authUi.text,
          textAlign: 'right',
        },
        eyeBtn: {
          paddingHorizontal: space.sm + 2,
          paddingVertical: space.sm,
          justifyContent: 'center',
        },
        cta: {
          borderCurve: 'continuous',
          boxShadow:
            resolved === 'light'
              ? '0 10px 24px rgba(234, 88, 12, 0.25)'
              : '0 12px 28px rgba(217, 119, 6, 0.45)',
          backgroundColor: authUi.orangePressed,
          borderRadius: 14,
          paddingVertical: space.sm + 6,
          minHeight: touch.minHeight - 2,
          justifyContent: 'center',
          marginTop: space.sm,
        },
        ctaTxt: {
          color: authUi.onOrange,
          fontSize: font.button,
          fontWeight: '800',
          textAlign: 'center',
        },
        demoBox: {
          borderCurve: 'continuous',
          boxShadow:
            resolved === 'light' ? '0 8px 24px rgba(15, 23, 42, 0.06)' : '0 8px 24px rgba(0, 0, 0, 0.35)',
          marginTop: space.lg + 2,
          padding: space.md,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: resolved === 'light' ? 'rgba(234, 88, 12, 0.28)' : 'rgba(245, 158, 11, 0.35)',
          backgroundColor: authUi.inputBg,
        },
        demoTitle: {
          color: authUi.text,
          fontWeight: '800',
          fontSize: font.body,
          textAlign: 'right',
          marginBottom: space.sm,
        },
        demoHint: {
          color: authUi.muted,
          fontSize: 12,
          lineHeight: 18,
          textAlign: 'right',
          marginBottom: space.md,
        },
        demoBtns: {
          flexDirection: 'row-reverse',
          gap: space.sm + 2,
        },
        demoBtn: {
          flex: 1,
          flexDirection: 'row-reverse',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 12,
          borderWidth: 1,
          borderColor: authUi.orange,
          paddingVertical: space.sm + 4,
          minHeight: 46,
        },
        demoBtnTxt: {
          color: authUi.orange,
          fontWeight: '800',
          fontSize: font.caption,
        },
        footerRow: {
          flexDirection: 'row-reverse',
          justifyContent: 'space-between',
          marginTop: space.lg,
          paddingHorizontal: space.xs,
        },
        link: {
          color: authUi.orange,
          fontSize: font.link,
          fontWeight: '700',
        },
        footerBlock: {
          marginTop: space.lg,
          textAlign: 'center',
          fontSize: font.link,
          lineHeight: 22,
        },
        footerMuted: {
          color: authUi.muted,
          fontSize: font.link,
        },
        modalRoot: { flex: 1 },
        modalBackdrop: {
          ...StyleSheet.absoluteFillObject,
          backgroundColor: authUi.dim,
        },
        modalCenter: {
          ...StyleSheet.absoluteFillObject,
          justifyContent: 'center',
          padding: space.lg,
          pointerEvents: 'box-none',
        },
        modalCard: {
          borderCurve: 'continuous',
          boxShadow:
            resolved === 'light' ? '0 18px 48px rgba(15, 23, 42, 0.12)' : '0 24px 60px rgba(0, 0, 0, 0.55)',
          backgroundColor: authUi.card,
          borderRadius: 18,
          padding: space.lg + 2,
          borderWidth: 1,
          borderColor: authUi.border,
        },
        modalHead: {
          flexDirection: 'row-reverse',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: space.sm,
        },
        modalClose: {
          padding: space.sm,
          marginLeft: -space.sm,
        },
        modalTitle: {
          flex: 1,
          textAlign: 'right',
          color: authUi.text,
          fontSize: font.title,
          fontWeight: '800',
        },
        modalLead: {
          color: authUi.muted,
          fontSize: font.caption,
          lineHeight: 18,
          textAlign: 'right',
          marginBottom: space.md,
        },
        modalCancelWrap: {
          marginTop: space.md,
          alignItems: 'center',
          paddingVertical: space.sm,
        },
        modalCancel: {
          color: authUi.orange,
          fontSize: font.body,
          fontWeight: '700',
        },
      }),
    [authUi, authCardLift, resolved]
  );

  const FieldLabel = ({ text }: { text: string }) => <Text style={styles.label}>{text}</Text>;

  const androidRippleAuth = () => {
    if (!isAndroid) return {};
    return { android_ripple: { color: 'rgba(245,158,11,0.22)', borderless: false } };
  };

  const openForgot = () => {
    setForgotEmail(email.trim());
    setForgotOpen(true);
  };

  const sendForgot = () => {
    if (!forgotEmail.trim()) {
      Alert.alert('تنبيه', 'أدخل البريد الإلكتروني');
      return;
    }
    Alert.alert(
      'قريباً',
      'إرسال رابط إعادة التعيين يتطلب إعداداً على الخادم. راجع فريق الباكند لتفعيل المسار.'
    );
    setForgotOpen(false);
  };

  const loginAsDemo = async (kind: 'contractor' | 'client') => {
    setLoading(true);
    try {
      const res = await authAPI.login(
        kind === 'contractor' ? DEMO_CONTRACTOR_EMAIL : DEMO_CLIENT_EMAIL,
        DEMO_PASSWORD
      );
      hapticSuccess();
      setUser(res.user);
    } catch (e) {
      Alert.alert('تعذر الدخول', getApiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async () => {
    if (mode === 'register' && password !== confirmPassword) {
      return Alert.alert('تنبيه', 'كلمة المرور وتأكيدها غير متطابقتين');
    }
    setLoading(true);
    try {
      if (mode === 'login') {
        const res = await authAPI.login(email.trim(), password);
        hapticSuccess();
        setUser(res.user);
      } else {
        if (!name.trim()) throw new Error('الاسم مطلوب');
        const res = await authAPI.register({
          name: name.trim(),
          email: email.trim(),
          password,
          role,
          phone: phone.trim() || undefined,
        });
        hapticSuccess();
        setUser(res.user);
      }
    } catch (e) {
      Alert.alert('تعذر الدخول', getApiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  const isLogin = mode === 'login';

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={isIOS ? 'padding' : undefined}
          keyboardVerticalOffset={isIOS ? 8 : 0}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}
            contentInsetAdjustmentBehavior="automatic"
          >
            <View style={styles.card}>
              <View style={styles.logoWrap}>
                {isLogin ? (
                  <View style={styles.logoCircle}>
                    <Ionicons name="business" size={30} color={authUi.orange} />
                  </View>
                ) : (
                  <View style={styles.logoCircle}>
                    <Ionicons name="person-add" size={28} color={authUi.orange} />
                  </View>
                )}
              </View>

              <Text style={styles.screenTitle} accessibilityRole="header">
                {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
              </Text>
              <Text style={styles.lead}>
                {isLogin
                  ? 'سجل دخولك للوصول إلى لوحة التحكم ومتابعة مشروعاتك.'
                  : 'سجل حسابك للوصول إلى لوحة التحكم ومتابعة المشروعات.'}
              </Text>

              <View style={styles.roleRow}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="اختيار دور مقاول"
                  accessibilityState={{ selected: role === 'contractor' }}
                  onPress={() => setRole('contractor')}
                  {...androidRippleAuth()}
                  style={[styles.roleBtn, role === 'contractor' && styles.roleBtnOn]}
                >
                  <Text style={[styles.roleTxt, role === 'contractor' && styles.roleTxtOn]}>مقاول</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="اختيار دور صاحب مشروع"
                  accessibilityState={{ selected: role === 'client' }}
                  onPress={() => setRole('client')}
                  {...androidRippleAuth()}
                  style={[styles.roleBtn, role === 'client' && styles.roleBtnOn]}
                >
                  <Text style={[styles.roleTxt, role === 'client' && styles.roleTxtOn]}>صاحب مشروع</Text>
                </Pressable>
              </View>

              {!isLogin ? (
                <>
                  <FieldLabel text="الاسم الكامل" />
                  <TextInput
                    placeholder="الاسم الكامل"
                    placeholderTextColor={authUi.placeholder}
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                  />
                  <FieldLabel text="البريد الإلكتروني" />
                  <TextInput
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholder="البريد الإلكتروني"
                    placeholderTextColor={authUi.placeholder}
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                  />
                  <FieldLabel text="رقم الهاتف (اختياري)" />
                  <TextInput
                    placeholder="رقم الهاتف"
                    placeholderTextColor={authUi.placeholder}
                    style={styles.input}
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                  />
                </>
              ) : (
                <>
                  <FieldLabel text="البريد الإلكتروني" />
                  <TextInput
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholder="أدخل بريدك الإلكتروني"
                    placeholderTextColor={authUi.placeholder}
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                  />
                </>
              )}

              {isLogin ? (
                <>
                  <FieldLabel text="كلمة المرور" />
                  <View style={styles.passRow}>
                    <TextInput
                      secureTextEntry={!showPassword}
                      placeholder="أدخل كلمة المرور"
                      placeholderTextColor={authUi.placeholder}
                      style={styles.inputPass}
                      value={password}
                      onChangeText={setPassword}
                    />
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                      onPress={() => setShowPassword((v) => !v)}
                      style={styles.eyeBtn}
                      {...androidRippleAuth()}
                    >
                      <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color={authUi.label} />
                    </Pressable>
                  </View>
                </>
              ) : (
                <>
                  <FieldLabel text="كلمة المرور" />
                  <View style={styles.passRow}>
                    <TextInput
                      secureTextEntry={!showPassword}
                      placeholder="كلمة المرور"
                      placeholderTextColor={authUi.placeholder}
                      style={styles.inputPass}
                      value={password}
                      onChangeText={setPassword}
                    />
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                      onPress={() => setShowPassword((v) => !v)}
                      style={styles.eyeBtn}
                      {...androidRippleAuth()}
                    >
                      <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color={authUi.label} />
                    </Pressable>
                  </View>
                  <FieldLabel text="تأكيد كلمة المرور" />
                  <View style={styles.passRow}>
                    <TextInput
                      secureTextEntry={!showConfirm}
                      placeholder="تأكيد كلمة المرور"
                      placeholderTextColor={authUi.placeholder}
                      style={styles.inputPass}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                    />
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={showConfirm ? 'إخفاء تأكيد كلمة المرور' : 'إظهار تأكيد كلمة المرور'}
                      onPress={() => setShowConfirm((v) => !v)}
                      style={styles.eyeBtn}
                      {...androidRippleAuth()}
                    >
                      <Ionicons name={showConfirm ? 'eye-off-outline' : 'eye-outline'} size={22} color={authUi.label} />
                    </Pressable>
                  </View>
                </>
              )}

              <Pressable
                accessibilityRole="button"
                accessibilityLabel={isLogin ? 'تسجيل الدخول' : 'إنشاء الحساب'}
                disabled={loading}
                onPress={onSubmit}
                {...androidRippleAuth()}
                style={[styles.cta, loading && { opacity: 0.65 }]}
              >
                <Text style={styles.ctaTxt}>{isLogin ? 'تسجيل الدخول' : 'إنشاء حساب'}</Text>
              </Pressable>

              {isLogin ? (
                <View style={styles.demoBox}>
                  <Text style={styles.demoTitle}>دخول تجريبي (بدون خادم)</Text>
                  <Text style={styles.demoHint}>
                    مقاول: {DEMO_CONTRACTOR_EMAIL}
                    {'\n'}
                    عميل: {DEMO_CLIENT_EMAIL}
                    {'\n'}
                    كلمة المرور للاثنين: {DEMO_PASSWORD}
                  </Text>
                  <View style={styles.demoBtns}>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="دخول تجريبي كمقاول"
                      disabled={loading}
                      onPress={() => void loginAsDemo('contractor')}
                      {...androidRippleAuth()}
                      style={[styles.demoBtn, loading && { opacity: 0.65 }]}
                    >
                      <Ionicons name="hammer-outline" size={18} color={authUi.orange} style={{ marginLeft: 6 }} />
                      <Text style={styles.demoBtnTxt}>دخول كمقاول</Text>
                    </Pressable>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="دخول تجريبي كعميل"
                      disabled={loading}
                      onPress={() => void loginAsDemo('client')}
                      {...androidRippleAuth()}
                      style={[styles.demoBtn, loading && { opacity: 0.65 }]}
                    >
                      <Ionicons name="person-outline" size={18} color={authUi.orange} style={{ marginLeft: 6 }} />
                      <Text style={styles.demoBtnTxt}>دخول كعميل</Text>
                    </Pressable>
                  </View>
                </View>
              ) : null}

              {isLogin ? (
                <View style={styles.footerRow}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="الانتقال إلى إنشاء حساب جديد"
                    onPress={() => setMode('register')}
                    {...androidRippleAuth()}
                  >
                    <Text style={styles.link}>إنشاء حساب جديد</Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="نسيت كلمة المرور"
                    onPress={openForgot}
                    {...androidRippleAuth()}
                  >
                    <Text style={styles.link}>هل نسيت كلمة المرور؟</Text>
                  </Pressable>
                </View>
              ) : (
                <Text style={styles.footerBlock}>
                  <Text style={styles.link} onPress={openForgot}>
                    نسيت كلمة المرور؟
                  </Text>
                  <Text style={styles.footerMuted}> لديك حساب بالفعل؟ </Text>
                  <Text style={styles.link} onPress={() => setMode('login')}>
                    تسجيل الدخول
                  </Text>
                </Text>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <Modal visible={forgotOpen} transparent animationType="fade" onRequestClose={() => setForgotOpen(false)}>
        <View style={styles.modalRoot}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="إغلاق"
            style={styles.modalBackdrop}
            onPress={() => setForgotOpen(false)}
          />
          <View style={styles.modalCenter} pointerEvents="box-none">
            <View style={styles.modalCard}>
              <View style={styles.modalHead}>
                <Text style={styles.modalTitle}>نسيت كلمة المرور</Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="إغلاق"
                  onPress={() => setForgotOpen(false)}
                  style={styles.modalClose}
                  {...androidRippleAuth()}
                >
                  <Ionicons name="close" size={24} color={authUi.muted} />
                </Pressable>
              </View>
              <Text style={styles.modalLead}>أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين</Text>
              <FieldLabel text="البريد الإلكتروني" />
              <TextInput
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="البريد الإلكتروني"
                placeholderTextColor={authUi.placeholder}
                style={styles.input}
                value={forgotEmail}
                onChangeText={setForgotEmail}
              />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="إرسال رابط إعادة التعيين"
                onPress={sendForgot}
                style={styles.cta}
                {...androidRippleAuth()}
              >
                <Text style={styles.ctaTxt}>إرسال الرابط</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="إلغاء"
                onPress={() => setForgotOpen(false)}
                style={styles.modalCancelWrap}
                {...androidRippleAuth()}
              >
                <Text style={styles.modalCancel}>إلغاء</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
