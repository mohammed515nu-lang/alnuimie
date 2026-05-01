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
import { ENABLE_GOOGLE_AUTH, GOOGLE_WEB_CLIENT_ID } from '../../config/env';
import { GoogleSignInButton } from '../../components/auth/GoogleSignInButton';
import { useStore } from '../../store/useStore';
import { useAppTheme, font, space, touch } from '../../theme';
import { hapticSuccess } from '../../utils/haptics';
import { isAndroid, isIOS } from '../../utils/platformEnv';

// Logo Component matching image "A" shape
function LogoA({ color = '#D4A574', size = 64 }: { color?: string; size?: number }) {
  return (
    <View style={[styles.logoContainer, { width: size, height: size }]}>
      <Text style={[styles.logoText, { color, fontSize: size * 0.6 }]}>A</Text>
      <View style={[styles.logoDot, { backgroundColor: color, width: size * 0.12, height: size * 0.12 }]} />
    </View>
  );
}

// Social Button Component
function SocialButton({
  icon,
  onPress,
  disabled = false,
}: {
  icon: 'logo-google' | 'logo-apple' | 'logo-facebook';
  onPress: () => void;
  disabled?: boolean;
}) {
  const { authUi } = useAppTheme();
  const iconColor = icon === 'logo-apple' ? authUi.text : undefined;
  const iconSize = 24;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={[styles.socialBtn, { borderColor: authUi.border }]}
    >
      <Ionicons name={icon} size={iconSize} color={iconColor || authUi.text} />
    </Pressable>
  );
}

// Feature Badge Component
function FeatureBadge({ icon, text }: { icon: string; text: string }) {
  const { authUi } = useAppTheme();
  return (
    <View style={styles.badge}>
      <Ionicons name={icon as any} size={16} color={authUi.muted} />
      <Text style={[styles.badgeText, { color: authUi.muted }]}>{text}</Text>
    </View>
  );
}

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
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const { authUi, authCardLift, resolved } = useAppTheme();
  const isDark = resolved === 'dark';

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
          borderRadius: 24,
          padding: space.lg + 8,
          borderWidth: 1,
          borderColor: authUi.border,
        },
        logoWrap: { alignItems: 'center', marginBottom: space.md },
        headerTitle: {
          color: authUi.text,
          fontSize: 24,
          fontWeight: '700',
          textAlign: 'center',
          marginBottom: space.xs,
        },
        headerSubtitle: {
          color: authUi.muted,
          fontSize: 14,
          textAlign: 'center',
          marginBottom: space.lg + 4,
        },
        labelRow: {
          flexDirection: 'row-reverse',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: space.xs + 2,
        },
        label: {
          color: authUi.label,
          fontSize: 13,
          fontWeight: '600',
        },
        forgotLink: {
          color: authUi.gold,
          fontSize: 13,
          fontWeight: '600',
        },
        inputRow: {
          borderCurve: 'continuous',
          flexDirection: 'row-reverse',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: authUi.border,
          borderRadius: 12,
          backgroundColor: authUi.inputBg,
          marginBottom: space.md,
          minHeight: 52,
          paddingHorizontal: space.md,
          gap: space.sm,
        },
        inputRowError: {
          borderColor: authUi.errorText || '#dc2626',
        },
        input: {
          flex: 1,
          fontSize: 15,
          color: authUi.text,
          textAlign: 'right',
          paddingVertical: 12,
        },
        inputIcon: {
          opacity: 0.6,
        },
        eyeBtn: {
          padding: space.xs,
        },
        errorRow: {
          flexDirection: 'row-reverse',
          alignItems: 'center',
          gap: space.xs,
          marginTop: -space.sm,
          marginBottom: space.sm,
          marginRight: space.xs,
        },
        errorText: {
          color: authUi.errorText || '#dc2626',
          fontSize: 12,
        },
        cta: {
          borderCurve: 'continuous',
          backgroundColor: authUi.gold,
          borderRadius: 12,
          paddingVertical: 14,
          minHeight: 52,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: space.sm,
        },
        ctaTxt: {
          color: authUi.onGold,
          fontSize: 16,
          fontWeight: '700',
        },
        dividerRow: {
          flexDirection: 'row-reverse',
          alignItems: 'center',
          gap: space.md,
          marginTop: space.lg,
          marginBottom: space.md,
        },
        dividerLine: {
          flex: 1,
          height: 1,
          backgroundColor: authUi.border,
        },
        dividerTxt: {
          color: authUi.muted,
          fontSize: 13,
        },
        socialRow: {
          flexDirection: 'row-reverse',
          justifyContent: 'center',
          gap: space.md,
          marginBottom: space.lg,
        },
        footerRow: {
          flexDirection: 'row-reverse',
          justifyContent: 'center',
          alignItems: 'center',
          gap: space.xs,
        },
        footerText: {
          color: authUi.muted,
          fontSize: 14,
        },
        footerLink: {
          color: authUi.gold,
          fontSize: 14,
          fontWeight: '700',
        },
        badgesRow: {
          flexDirection: 'row-reverse',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: space.sm,
          marginTop: space.xl + 4,
          paddingHorizontal: space.md,
        },
        // Modal styles
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
          backgroundColor: authUi.card,
          borderRadius: 20,
          padding: space.lg + 4,
          borderWidth: 1,
          borderColor: authUi.border,
        },
        modalHead: {
          flexDirection: 'row-reverse',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: space.md,
        },
        modalTitle: {
          flex: 1,
          textAlign: 'right',
          color: authUi.text,
          fontSize: 18,
          fontWeight: '700',
        },
        modalClose: {
          padding: space.xs,
        },
        modalLead: {
          color: authUi.muted,
          fontSize: 14,
          textAlign: 'right',
          marginBottom: space.md,
        },
        // Role selection styles
        roleRow: {
          flexDirection: 'row-reverse',
          gap: space.sm + 2,
          marginBottom: space.md + 2,
        },
        roleBtn: {
          borderCurve: 'continuous',
          flex: 1,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: authUi.border,
          backgroundColor: authUi.inputBg,
          paddingVertical: 12,
          justifyContent: 'center',
          alignItems: 'center',
        },
        roleBtnOn: {
          backgroundColor: authUi.gold,
          borderColor: authUi.gold,
        },
        roleTxt: {
          fontSize: 14,
          fontWeight: '600',
          color: authUi.text,
        },
        roleTxtOn: {
          color: authUi.onGold,
        },
      }),
    [authUi, authCardLift, resolved]
  );

  const androidRippleAuth = () => {
    if (!isAndroid) return {};
    return { android_ripple: { color: 'rgba(212,165,116,0.2)', borderless: false } };
  };

  const openForgot = () => {
    setForgotEmail(email.trim());
    setForgotOpen(true);
  };

  const sendForgot = async () => {
    if (!forgotEmail.trim()) {
      Alert.alert('تنبيه', 'أدخل البريد الإلكتروني');
      return;
    }
    try {
      const res = await authAPI.forgotPassword(forgotEmail.trim());
      const devExtra = res.resetUrl ? `\n\n(وضع التطوير)\n${res.resetUrl}` : '';
      const body =
        (res.message && String(res.message).trim()) ||
        'إذا وُجد حساب مرتبط بهذا البريد، ستصلك تعليمات إعادة تعيين كلمة المرور عند توفر خدمة الإرسال.';
      Alert.alert('تم', `${body}${devExtra}`);
      setForgotOpen(false);
    } catch (e) {
      Alert.alert('تعذر الإرسال', getApiErrorMessage(e));
    }
  };

  const onSubmit = async () => {
    const cleanEmail = email.trim().toLowerCase();
    setPasswordError(null);

    if (!cleanEmail || !password) {
      return Alert.alert('تنبيه', 'أدخل البريد الإلكتروني وكلمة المرور.');
    }

    if (mode === 'register' && password !== confirmPassword) {
      return Alert.alert('تنبيه', 'كلمة المرور وتأكيدها غير متطابقتين');
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        const res = await authAPI.login(cleanEmail, password);
        hapticSuccess();
        setUser(res.user);
      } else {
        if (!name.trim()) throw new Error('الاسم مطلوب');
        const res = await authAPI.register({
          name: name.trim(),
          email: cleanEmail,
          password,
          role,
          phone: phone.trim() || undefined,
        });
        hapticSuccess();
        setUser(res.user);
      }
    } catch (e) {
      const errorMsg = getApiErrorMessage(e);
      if (errorMsg.includes('كلمة المرور') || errorMsg.toLowerCase().includes('password')) {
        setPasswordError('كلمة المرور غير صحيحة');
      }
      Alert.alert('تعذر الدخول', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const onSocialPress = (provider: 'google' | 'apple' | 'facebook') => {
    if (provider === 'google') {
      // Handled by GoogleSignInButton
      return;
    }
    Alert.alert(provider, 'قريباً');
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
              {/* Logo */}
              <View style={styles.logoWrap}>
                <LogoA color={authUi.gold} size={72} />
              </View>

              {/* Header */}
              <Text style={styles.headerTitle}>مرحباً بك مجدداً</Text>
              <Text style={styles.headerSubtitle}>سجل الدخول للمتابعة</Text>

              {/* Role Selection */}
              <View style={styles.roleRow}>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setRole('contractor')}
                  style={[styles.roleBtn, role === 'contractor' && styles.roleBtnOn]}
                >
                  <Text style={[styles.roleTxt, role === 'contractor' && styles.roleTxtOn]}>مقاول</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setRole('client')}
                  style={[styles.roleBtn, role === 'client' && styles.roleBtnOn]}
                >
                  <Text style={[styles.roleTxt, role === 'client' && styles.roleTxtOn]}>صاحب مشروع</Text>
                </Pressable>
              </View>

              {/* Name (Register only) */}
              {!isLogin && (
                <>
                  <View style={styles.inputRow}>
                    <Ionicons name="person-outline" size={20} color={authUi.label} style={styles.inputIcon} />
                    <TextInput
                      placeholder="الاسم الكامل"
                      placeholderTextColor={authUi.placeholder}
                      style={styles.input}
                      value={name}
                      onChangeText={setName}
                    />
                  </View>
                </>
              )}

              {/* Email */}
              <View style={styles.inputRow}>
                <Ionicons name="mail-outline" size={20} color={authUi.label} style={styles.inputIcon} />
                <TextInput
                  autoCapitalize="none"
                  keyboardType="email-address"
                  placeholder="ahmed@example.com"
                  placeholderTextColor={authUi.placeholder}
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              {/* Password Label Row */}
              <View style={styles.labelRow}>
                <Text style={styles.label}>كلمة المرور</Text>
                {isLogin && (
                  <Pressable onPress={openForgot}>
                    <Text style={styles.forgotLink}>نسيت كلمة المرور؟</Text>
                  </Pressable>
                )}
              </View>

              {/* Password Input */}
              <View style={[styles.inputRow, passwordError && styles.inputRowError]}>
                <Ionicons name="lock-closed-outline" size={20} color={authUi.label} style={styles.inputIcon} />
                <TextInput
                  secureTextEntry={!showPassword}
                  placeholder="••••••••••••"
                  placeholderTextColor={authUi.placeholder}
                  style={styles.input}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setPasswordError(null);
                  }}
                />
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setShowPassword((v) => !v)}
                  style={styles.eyeBtn}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={authUi.label}
                  />
                </Pressable>
              </View>

              {/* Password Error */}
              {passwordError && (
                <View style={styles.errorRow}>
                  <Ionicons name="alert-circle" size={14} color={authUi.errorText || '#dc2626'} />
                  <Text style={styles.errorText}>{passwordError}</Text>
                </View>
              )}

              {/* Confirm Password (Register only) */}
              {!isLogin && (
                <>
                  <Text style={[styles.label, { marginBottom: space.xs + 2, textAlign: 'right' }]}>
                    تأكيد كلمة المرور
                  </Text>
                  <View style={styles.inputRow}>
                    <Ionicons name="lock-closed-outline" size={20} color={authUi.label} style={styles.inputIcon} />
                    <TextInput
                      secureTextEntry={!showConfirm}
                      placeholder="••••••••••••"
                      placeholderTextColor={authUi.placeholder}
                      style={styles.input}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                    />
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => setShowConfirm((v) => !v)}
                      style={styles.eyeBtn}
                    >
                      <Ionicons
                        name={showConfirm ? 'eye-off-outline' : 'eye-outline'}
                        size={20}
                        color={authUi.label}
                      />
                    </Pressable>
                  </View>
                </>
              )}

              {/* Phone (Register only) */}
              {!isLogin && (
                <>
                  <Text style={[styles.label, { marginBottom: space.xs + 2, textAlign: 'right' }]}>
                    رقم الهاتف (اختياري)
                  </Text>
                  <View style={styles.inputRow}>
                    <Ionicons name="call-outline" size={20} color={authUi.label} style={styles.inputIcon} />
                    <TextInput
                      placeholder="رقم الهاتف"
                      placeholderTextColor={authUi.placeholder}
                      style={styles.input}
                      value={phone}
                      onChangeText={setPhone}
                      keyboardType="phone-pad"
                    />
                  </View>
                </>
              )}

              {/* Submit Button */}
              <Pressable
                accessibilityRole="button"
                disabled={loading}
                onPress={onSubmit}
                {...androidRippleAuth()}
                style={[styles.cta, loading && { opacity: 0.65 }]}
              >
                <Text style={styles.ctaTxt}>
                  {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب'}
                </Text>
              </Pressable>

              {/* Divider */}
              {isLogin && ENABLE_GOOGLE_AUTH && GOOGLE_WEB_CLIENT_ID.trim() && (
                <View style={styles.dividerRow}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerTxt}>أو سجل الدخول باستخدام</Text>
                  <View style={styles.dividerLine} />
                </View>
              )}

              {/* Social Buttons */}
              {isLogin && (
                <View style={styles.socialRow}>
                  <SocialButton icon="logo-google" onPress={() => onSocialPress('google')} />
                  <SocialButton icon="logo-apple" onPress={() => onSocialPress('apple')} />
                  <SocialButton icon="logo-facebook" onPress={() => onSocialPress('facebook')} />
                </View>
              )}

              {/* Footer */}
              <View style={styles.footerRow}>
                <Text style={styles.footerText}>
                  {isLogin ? 'ليس لديك حساب؟' : 'لديك حساب بالفعل؟'}
                </Text>
                <Pressable onPress={() => setMode(isLogin ? 'register' : 'login')}>
                  <Text style={styles.footerLink}>
                    {isLogin ? 'إنشاء حساب' : 'تسجيل الدخول'}
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Feature Badges */}
            <View style={styles.badgesRow}>
              <FeatureBadge icon="shield-checkmark-outline" text="أمن وموثوق" />
              <FeatureBadge icon="color-palette-outline" text="تصميم عصري" />
              <FeatureBadge icon="phone-portrait-outline" text="تجربة سلسلة" />
              <FeatureBadge icon="lock-closed-outline" text="خصوصيات تهمنا" />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* Forgot Password Modal */}
      <Modal visible={forgotOpen} transparent animationType="fade" onRequestClose={() => setForgotOpen(false)}>
        <View style={styles.modalRoot}>
          <Pressable
            accessibilityRole="button"
            style={styles.modalBackdrop}
            onPress={() => setForgotOpen(false)}
          />
          <View style={styles.modalCenter} pointerEvents="box-none">
            <View style={styles.modalCard}>
              <View style={styles.modalHead}>
                <Text style={styles.modalTitle}>نسيت كلمة المرور</Text>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setForgotOpen(false)}
                  style={styles.modalClose}
                >
                  <Ionicons name="close" size={24} color={authUi.muted} />
                </Pressable>
              </View>
              <Text style={styles.modalLead}>أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين</Text>
              <Text style={[styles.label, { marginBottom: space.xs + 2, textAlign: 'right' }]}>البريد الإلكتروني</Text>
              <View style={styles.inputRow}>
                <Ionicons name="mail-outline" size={20} color={authUi.label} style={styles.inputIcon} />
                <TextInput
                  autoCapitalize="none"
                  keyboardType="email-address"
                  placeholder="البريد الإلكتروني"
                  placeholderTextColor={authUi.placeholder}
                  style={styles.input}
                  value={forgotEmail}
                  onChangeText={setForgotEmail}
                />
              </View>
              <Pressable
                accessibilityRole="button"
                onPress={sendForgot}
                style={styles.cta}
                {...androidRippleAuth()}
              >
                <Text style={styles.ctaTxt}>إرسال الرابط</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Static styles (don't depend on theme)
const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  logoText: {
    fontWeight: '700',
    lineHeight: undefined,
  },
  logoDot: {
    position: 'absolute',
    bottom: '15%',
    borderRadius: 999,
  },
  socialBtn: {
    width: 52,
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  badge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '500',
  },
});
