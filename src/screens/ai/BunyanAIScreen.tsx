import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from 'expo-speech-recognition';

import { getApiErrorMessage, api } from '../../api/http';
import { aiAPI } from '../../api/services';
import { API_URL } from '../../config/env';
import { SyriaFlag } from '../../components/SyriaFlag';
import { DASHBOARD_TAB_BAR_SCROLL_BASE } from '../../constants/dashboardTabBar';
import { useStore } from '../../store/useStore';
import { pressableRipple, space, touch, useAppTheme } from '../../theme';
import { DASHBOARD_RADIUS as R, getDashboardPalette, type DashboardPalette } from '../../theme/dashboardLight';
import { hapticLight, hapticSuccess } from '../../utils/haptics';
import { useKeyboardHeight } from '../../utils/useKeyboardHeight';

const SUGGESTIONS_CONTRACTOR: { text: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { text: 'كيف أحسب هامش الربح لكل مشروع؟', icon: 'cash-outline' },
  { text: 'أفضل خطة شراء مواد لتقليل التكلفة', icon: 'construct-outline' },
  { text: 'كيف أدفع للموردين دون تعثر؟', icon: 'people-outline' },
  { text: 'متى أعيد طلب المواد للمخزون؟', icon: 'cube-outline' },
  { text: 'بنود عقد مهمة للمقاول', icon: 'document-text-outline' },
  { text: 'سلامة العمال في الموقع النشط', icon: 'shield-checkmark-outline' },
];

const SUGGESTIONS_CLIENT: { text: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { text: 'كيف أقارن عروض مقاولين مختلفين؟', icon: 'stats-chart-outline' },
  { text: 'ما بنود يجب أن تكون في عقد التنفيذ؟', icon: 'document-text-outline' },
  { text: 'كيف أتابع دفعاتي للمقاول بأمان؟', icon: 'shield-checkmark-outline' },
  { text: 'مؤشرات جودة التنفيذ أثناء المشروع', icon: 'eye-outline' },
  { text: 'متى أصرف دفعة جزئية ومتى الخلاص؟', icon: 'calendar-outline' },
  { text: 'كيف أتواصل مع المقاول بشكل واضح؟', icon: 'chatbubbles-outline' },
];

type BackendStatus = 'checking' | 'online' | 'offline';

function apiHostLabel(): string {
  try {
    const u = new URL(API_URL);
    return u.hostname || API_URL;
  } catch {
    return API_URL.replace(/^https?:\/\//i, '').split('/')[0] ?? '';
  }
}

export function BunyanAIScreen() {
  const [q, setQ] = useState('');
  const [answer, setAnswer] = useState('');
  const [answerSource, setAnswerSource] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [backendStatus, setBackendStatus] = useState<BackendStatus>('checking');
  const user = useStore((s) => s.user);
  const role = useStore((s) => s.user?.role);
  const insets = useSafeAreaInsets();
  const keyboardHeight = useKeyboardHeight();
  const { resolved } = useAppTheme();
  const dash = useMemo(() => getDashboardPalette(resolved), [resolved]);
  const styles = useMemo(() => createStyles(dash), [dash]);

  const tabReserve = DASHBOARD_TAB_BAR_SCROLL_BASE + insets.bottom + 8;
  const bottomPad = tabReserve + keyboardHeight;

  const isClient = role === 'client';
  const suggestions = useMemo(() => (isClient ? SUGGESTIONS_CLIENT : SUGGESTIONS_CONTRACTOR), [isClient]);
  const lead = isClient
    ? 'اسألني عن اختيار المقاول، العقود، ودفعات مشروعك كصاحب مشروع'
    : 'اسألني عن إدارة المشاريع والموردين والربحية كمقاول';
  const placeholder = isClient
    ? 'اكتب سؤالك عن مشروعك أو المقاول...'
    : 'اكتب سؤالك عن البناء والموقع...';

  const serverHost = useMemo(() => apiHostLabel(), []);

  const checkBackendHealth = useCallback(async (fromUser = false) => {
    if (fromUser) setBackendStatus('checking');
    try {
      const { data } = await api.get<{ status?: string }>('/health', { timeout: 28_000 });
      setBackendStatus(data?.status === 'healthy' ? 'online' : 'offline');
    } catch {
      setBackendStatus('offline');
    }
  }, []);

  useEffect(() => {
    void checkBackendHealth(false);
    const id = setInterval(() => void checkBackendHealth(false), 60_000);
    return () => clearInterval(id);
  }, [checkBackendHealth]);

  useFocusEffect(
    useCallback(() => {
      void checkBackendHealth(false);
    }, [checkBackendHealth])
  );

  useSpeechRecognitionEvent('result', (ev) => {
    const t = ev.results[0]?.transcript?.trim();
    if (t) setQ(t);
  });

  useSpeechRecognitionEvent('error', (ev) => {
    setListening(false);
    if (ev.error !== 'aborted' && ev.error !== 'no-speech') {
      Alert.alert('التعرّف على الصوت', ev.message || ev.error);
    }
  });

  useSpeechRecognitionEvent('end', () => {
    setListening(false);
  });

  const clearDraft = () => {
    hapticLight();
    if (listening && Platform.OS !== 'web') {
      try {
        ExpoSpeechRecognitionModule.stop();
      } catch {
        /* noop */
      }
      setListening(false);
    }
    setQ('');
    setAnswer('');
    setAnswerSource(undefined);
  };

  const sendQuestion = async () => {
    const t = q.trim();
    if (!user?._id) {
      Alert.alert('تسجيل الدخول مطلوب', 'يرجى تسجيل الدخول أولاً لاستخدام بنيان AI.');
      return;
    }
    if (!t) {
      hapticLight();
      Alert.alert('تنبيه', 'اكتب سؤالاً في الحقل ثم اضغط إرسال.');
      return;
    }
    if (backendStatus === 'offline') {
      Alert.alert(
        'الخادم غير متاح',
        'تعذر الاتصال بالـ API (مثلاً Render بعد سبات الخدمة). انتظر نحو 30–60 ثانية ثم اضغط على سطر حالة الاتصال في بطاقة بنيان AI أعلاه لإعادة المحاولة.',
      );
      return;
    }
    setLoading(true);
    try {
      const res = await aiAPI.ask(t);
      setAnswer(res.answer);
      setAnswerSource(res.source);
      hapticSuccess();
    } catch (e) {
      Alert.alert('تعذر إرسال السؤال', getApiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  const onMic = useCallback(async () => {
    if (Platform.OS === 'web') {
      Alert.alert('تنبيه', 'الإدخال الصوتي متاح في تطبيق الجوال (iOS / Android).');
      return;
    }
    if (listening) {
      try {
        ExpoSpeechRecognitionModule.stop();
      } catch {
        /* noop */
      }
      setListening(false);
      return;
    }
    hapticLight();
    try {
      const perm = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('إذن مطلوب', 'فعّل الميكروفون والتعرّف على الكلام من إعدادات الجهاز لاستخدام الإدخال الصوتي.');
        return;
      }
      if (!ExpoSpeechRecognitionModule.isRecognitionAvailable()) {
        Alert.alert('غير متاح', 'خدمة التعرّف على الكلام غير متاحة على هذا الجهاز.');
        return;
      }
      ExpoSpeechRecognitionModule.start({
        lang: 'ar-SA',
        interimResults: true,
        addsPunctuation: true,
        continuous: false,
      });
      setListening(true);
    } catch (e) {
      Alert.alert('تعذر التشغيل', getApiErrorMessage(e));
    }
  }, [listening]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={[styles.flex, { paddingBottom: bottomPad }]}>
        <View style={styles.flex}>
          <View style={styles.topBar}>
            <View style={styles.brandBlock}>
              <Text style={styles.brandWordmark}>bunyan-ai</Text>
              <View style={styles.brandMark}>
                <Text style={styles.brandMarkLetter}>B</Text>
              </View>
            </View>
            <View style={{ flex: 1 }} />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="مسح مسودة السؤال"
              onPress={clearDraft}
              style={styles.trashBtn}
              {...pressableRipple(dash.goldTint)}
            >
              <Ionicons name="trash-outline" size={20} color={dash.navy} />
            </Pressable>
          </View>

          <View style={styles.profileCard}>
            <View style={styles.chipFrame}>
              <View style={styles.chipInner}>
                <Ionicons name="hardware-chip" size={24} color={dash.gold} />
              </View>
            </View>
            <View style={styles.profileText}>
              <Text style={styles.aiTitleGold}>بنيان AI</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="إعادة التحقق من اتصال الخادم"
                onPress={() => void checkBackendHealth(true)}
                style={styles.statusRow}
                hitSlop={{ top: 8, bottom: 8, left: 12, right: 12 }}
              >
                <View
                  style={[
                    styles.dot,
                    backendStatus === 'online' && styles.dotOnline,
                    backendStatus === 'offline' && styles.dotOffline,
                    backendStatus === 'checking' && styles.dotChecking,
                  ]}
                />
                <Text style={styles.statusText}>
                  {backendStatus === 'checking'
                    ? 'جاري التحقق من الخادم…'
                    : backendStatus === 'online'
                      ? 'متصل بالخادم'
                      : 'الخادم غير متاح'}
                </Text>
              </Pressable>
              <Text style={styles.statusHost} numberOfLines={1}>
                {serverHost}
              </Text>
              <View style={styles.expertRow}>
                <Ionicons name="shield-checkmark" size={14} color={dash.gold} />
                <Text style={styles.expertText}>خبير بناء سوري</Text>
              </View>
            </View>
          </View>

          <ScrollView
            style={styles.flex}
            contentContainerStyle={[styles.scroll, { paddingBottom: 24 }]}
            keyboardShouldPersistTaps="handled"
            contentInsetAdjustmentBehavior="automatic"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.mainPanel}>
              <View style={styles.flagRow}>
                <SyriaFlag width={40} height={28} />
              </View>
              <Text style={styles.hero}>مساعد بنيان الذكي</Text>
              <Text style={styles.sub}>{lead}</Text>

              <View style={styles.grid}>
                {suggestions.map((s) => (
                  <Pressable
                    key={s.text}
                    accessibilityRole="button"
                    onPress={() => setQ(s.text)}
                    {...pressableRipple(dash.goldTint)}
                    style={styles.sCard}
                  >
                    <Ionicons name={s.icon} size={22} color={dash.gold} style={{ marginLeft: space.sm }} />
                    <Text style={styles.sText}>{s.text}</Text>
                  </Pressable>
                ))}
              </View>

              {answer ? (
                <View style={styles.answerCard}>
                  <Text style={styles.answerTitle}>رد بنيان AI</Text>
                  <Text style={styles.answerText}>{answer}</Text>
                  {answerSource ? (
                    <Text style={styles.answerSource}>
                      {answerSource === 'nvidia'
                        ? 'المصدر: NVIDIA'
                        : answerSource === 'knowledge'
                          ? 'المصدر: قاعدة المعرفة (خادم قديم — أعد نشر الخادم)'
                          : answerSource === 'unconfigured'
                            ? 'المصدر: غير مهيأ على الخادم'
                            : answerSource === 'nvidia-error'
                              ? 'المصدر: خطأ NVIDIA'
                              : 'المصدر: إجابة احتياطية'}
                    </Text>
                  ) : null}
                </View>
              ) : null}
            </View>
          </ScrollView>

          <View style={[styles.inputBar, { paddingBottom: 10 }]}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="إرسال السؤال"
              onPress={() => void sendQuestion()}
              style={styles.send}
              disabled={loading}
              {...pressableRipple('rgba(255,255,255,0.2)')}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Ionicons name="send" size={18} color="#ffffff" />
              )}
            </Pressable>
            <TextInput
              placeholder={placeholder}
              placeholderTextColor={dash.muted}
              style={styles.input}
              value={q}
              onChangeText={setQ}
              textAlign="right"
              editable={!loading}
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={listening ? 'إيقاف التسجيل الصوتي' : 'إدخال صوتي'}
              onPress={() => void onMic()}
              style={[styles.micBtn, listening && styles.micBtnActive]}
              disabled={loading}
              {...pressableRipple(dash.goldTint)}
            >
              {listening ? (
                <Ionicons name="stop-circle" size={26} color="#b91c1c" />
              ) : (
                <Ionicons name="mic-outline" size={22} color={dash.navy} />
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

function createStyles(dash: DashboardPalette) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: dash.pageBg },
    flex: { flex: 1 },
    topBar: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: dash.border,
    },
    brandBlock: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8 },
    brandWordmark: {
      fontSize: 17,
      fontWeight: '800',
      color: dash.navy,
      letterSpacing: 0.3,
    },
    brandMark: {
      width: 32,
      height: 32,
      borderRadius: 8,
      backgroundColor: dash.logoMarkBg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    brandMarkLetter: { color: '#ffffff', fontWeight: '900', fontSize: 15 },
    trashBtn: {
      width: 44,
      height: 44,
      borderRadius: R,
      backgroundColor: dash.white,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: dash.border,
    },
    profileCard: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      marginHorizontal: 16,
      marginTop: 12,
      padding: 14,
      backgroundColor: dash.white,
      borderRadius: R,
      borderWidth: 1,
      borderColor: dash.border,
      gap: 12,
      elevation: 1,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
    },
    chipFrame: {
      padding: 3,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: dash.gold,
    },
    chipInner: {
      width: 52,
      height: 52,
      borderRadius: 8,
      backgroundColor: dash.goldTint,
      alignItems: 'center',
      justifyContent: 'center',
    },
    profileText: { flex: 1, alignItems: 'flex-end' },
    aiTitleGold: { color: dash.gold, fontWeight: '900', fontSize: 18, textAlign: 'right' },
    statusRow: { flexDirection: 'row-reverse', alignItems: 'center', marginTop: 4, gap: 6, alignSelf: 'flex-end' },
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: dash.muted },
    dotOnline: { backgroundColor: dash.success },
    dotOffline: { backgroundColor: '#dc2626' },
    dotChecking: { backgroundColor: '#d97706' },
    statusText: { color: dash.muted, fontSize: 13, fontWeight: '600' },
    statusHost: {
      color: dash.muted,
      fontSize: 11,
      fontWeight: '500',
      textAlign: 'right',
      marginTop: 2,
      opacity: 0.85,
    },
    expertRow: { flexDirection: 'row-reverse', alignItems: 'center', marginTop: 6, gap: 6 },
    expertText: { color: dash.darkText, fontSize: 13, fontWeight: '700', textAlign: 'right' },
    scroll: { paddingHorizontal: 16, paddingTop: 14 },
    mainPanel: {
      backgroundColor: dash.panelBg,
      borderRadius: R,
      borderWidth: 1,
      borderColor: dash.border,
      padding: 16,
      paddingBottom: 20,
    },
    flagRow: { alignItems: 'flex-end', marginBottom: 10 },
    hero: { color: dash.navy, fontSize: 21, fontWeight: '900', textAlign: 'right' },
    sub: { color: dash.muted, textAlign: 'right', marginTop: 8, lineHeight: 22, fontSize: 14 },
    grid: {
      marginTop: 16,
      flexDirection: 'row-reverse',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      rowGap: 10,
    },
    sCard: {
      width: '48.5%',
      flexDirection: 'row-reverse',
      alignItems: 'center',
      backgroundColor: dash.white,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: dash.border,
      padding: 12,
      minHeight: 76,
    },
    sText: {
      flex: 1,
      color: dash.darkText,
      fontSize: 12,
      fontWeight: '700',
      textAlign: 'right',
      lineHeight: 18,
    },
    answerCard: {
      marginTop: 16,
      backgroundColor: dash.white,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: dash.border,
      padding: 14,
      gap: 8,
    },
    answerTitle: { color: dash.gold, fontWeight: '900', textAlign: 'right', fontSize: 15 },
    answerText: { color: dash.muted, textAlign: 'right', lineHeight: 22, fontSize: 14 },
    answerSource: {
      marginTop: 10,
      color: dash.muted,
      textAlign: 'right',
      fontSize: 11,
      opacity: 0.85,
    },
    inputBar: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingTop: 10,
      gap: 10,
      backgroundColor: dash.pageBg,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: dash.border,
    },
    input: {
      flex: 1,
      backgroundColor: dash.white,
      borderRadius: R,
      borderWidth: 1,
      borderColor: dash.border,
      paddingHorizontal: 14,
      paddingVertical: 12,
      color: dash.darkText,
      minHeight: touch.minHeight,
      fontSize: 15,
    },
    send: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: dash.logoMarkBg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    micBtn: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: dash.white,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: dash.border,
    },
    micBtnActive: {
      borderColor: 'rgba(185, 28, 28, 0.45)',
      backgroundColor: 'rgba(254, 226, 226, 0.5)',
    },
  });
}
