import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  I18nManager,
  Modal,
  Platform,
  Pressable,
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
import { DASHBOARD_TAB_BAR_SCROLL_BASE } from '../../constants/dashboardTabBar';
import { useStore } from '../../store/useStore';
import { pressableRipple, touch, useAppTheme, type ResolvedScheme } from '../../theme';
import { hapticLight, hapticSuccess } from '../../utils/haptics';
import { useKeyboardHeight } from '../../utils/useKeyboardHeight';
import {
  applyThreadAsActive,
  archiveCurrentAndClear,
  bunyanGenId,
  loadActiveMessages,
  loadArchives,
  loadSaved,
  loadTrash,
  moveThreadToTrash,
  purgeTrashThread,
  restoreThreadFromTrash,
  saveActiveMessages,
  saveSaved,
  type BunyanAiMessage,
  type BunyanAiThread,
  type BunyanSavedTurn,
} from './bunyanAiStorage';

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

function formatChatTime(iso: string): string {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleTimeString('ar-SY', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

function bubbleAlign(mine: boolean): 'flex-start' | 'flex-end' {
  const rtl = I18nManager.isRTL;
  if (mine) return rtl ? 'flex-start' : 'flex-end';
  return rtl ? 'flex-end' : 'flex-start';
}

function sourceLabel(source: string | undefined): string {
  if (!source) return '';
  if (source === 'nvidia') return 'المصدر: NVIDIA';
  if (source === 'nvidia-fallback') return 'المصدر: نموذج احتياطي (NVIDIA)';
  if (source === 'knowledge') return 'المصدر: قاعدة المعرفة';
  if (source === 'unconfigured') return 'المصدر: غير مهيأ';
  if (source === 'nvidia-error') return 'المصدر: خطأ';
  return 'المصدر: إجابة احتياطية';
}

type ChatTheme = {
  chatBg: string;
  headerBg: string;
  headerTint: string;
  bubbleMineBg: string;
  bubbleMineText: string;
  bubbleMineTime: string;
  bubbleOtherBg: string;
  bubbleOtherText: string;
  bubbleOtherTime: string;
  bubbleOtherName: string;
  composerBg: string;
  inputBg: string;
  inputBorder: string;
  inputText: string;
  placeholder: string;
  sendBg: string;
  sendBgDisabled: string;
  sendIcon: string;
  errBg: string;
  errBorder: string;
  errText: string;
  stripBorder: string;
  stripMuted: string;
};

function waColors(resolved: ResolvedScheme): ChatTheme {
  if (resolved === 'dark') {
    return {
      chatBg: '#0B141A',
      headerBg: '#202C33',
      headerTint: '#E9EDEF',
      bubbleMineBg: '#005C4B',
      bubbleMineText: '#E9EDEF',
      bubbleMineTime: 'rgba(233,237,239,0.65)',
      bubbleOtherBg: '#202C33',
      bubbleOtherText: '#E9EDEF',
      bubbleOtherTime: 'rgba(233,237,239,0.55)',
      bubbleOtherName: '#00A884',
      composerBg: '#1F2C33',
      inputBg: '#2A3942',
      inputBorder: 'rgba(255,255,255,0.06)',
      inputText: '#E9EDEF',
      placeholder: 'rgba(233,237,239,0.45)',
      sendBg: '#00A884',
      sendBgDisabled: '#2A3942',
      sendIcon: '#fff',
      errBg: 'rgba(220, 38, 38, 0.12)',
      errBorder: 'rgba(220, 38, 38, 0.35)',
      errText: '#fecaca',
      stripBorder: 'rgba(255,255,255,0.12)',
      stripMuted: 'rgba(233,237,239,0.78)',
    };
  }
  return {
    chatBg: '#ECE5DD',
    headerBg: '#075E54',
    headerTint: '#FFFFFF',
    bubbleMineBg: '#DCF8C6',
    bubbleMineText: '#111B21',
    bubbleMineTime: 'rgba(17,27,33,0.45)',
    bubbleOtherBg: '#FFFFFF',
    bubbleOtherText: '#111B21',
    bubbleOtherTime: 'rgba(17,27,33,0.45)',
    bubbleOtherName: '#075E54',
    composerBg: '#F0F2F5',
    inputBg: '#FFFFFF',
    inputBorder: 'rgba(17,27,33,0.08)',
    inputText: '#111B21',
    placeholder: 'rgba(17,27,33,0.45)',
    sendBg: '#00A884',
    sendBgDisabled: '#B3B9BD',
    sendIcon: '#FFFFFF',
    errBg: 'rgba(220, 38, 38, 0.08)',
    errBorder: 'rgba(220, 38, 38, 0.28)',
    errText: '#991b1b',
    stripBorder: 'rgba(255,255,255,0.22)',
    stripMuted: 'rgba(255,255,255,0.88)',
  };
}

function createChatStyles(c: ChatTheme) {
  const bubbleRadius = { borderTopLeftRadius: 8, borderTopRightRadius: 8, borderBottomLeftRadius: 8, borderBottomRightRadius: 8 };
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: c.chatBg },
    flex: { flex: 1 },
    headerRow: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      paddingHorizontal: 6,
      paddingVertical: 8,
      backgroundColor: c.headerBg,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: c.stripBorder,
      gap: 4,
    },
    headerIcons: { flexDirection: 'row-reverse', alignItems: 'center', gap: 2 },
    headerIconBtn: {
      width: 42,
      height: 42,
      borderRadius: 21,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitleBlock: { flex: 1, minWidth: 0, alignItems: 'flex-end', paddingEnd: 6 },
    headerTitle: { color: c.headerTint, fontWeight: '900', fontSize: 17, textAlign: 'right' },
    statusRow: { flexDirection: 'row-reverse', alignItems: 'center', marginTop: 2, gap: 6 },
    dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.4)' },
    dotOnline: { backgroundColor: '#7dd3a0' },
    dotOffline: { backgroundColor: '#fca5a5' },
    dotChecking: { backgroundColor: '#fcd34d' },
    statusText: { color: c.stripMuted, fontSize: 12, fontWeight: '600' },
    statusHost: { color: c.stripMuted, fontSize: 10, textAlign: 'right', marginTop: 2, opacity: 0.9 },
    listContent: { paddingHorizontal: 10, paddingTop: 8, paddingBottom: 8 },
    rowWrap: { marginBottom: 4, maxWidth: '100%' },
    bubble: {
      maxWidth: '85%',
      paddingHorizontal: 10,
      paddingTop: 6,
      paddingBottom: 5,
      ...bubbleRadius,
      elevation: 1,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 2,
    },
    bubbleMine: { backgroundColor: c.bubbleMineBg },
    bubbleOther: { backgroundColor: c.bubbleOtherBg },
    sender: { color: c.bubbleOtherName, fontWeight: '700', fontSize: 12, marginBottom: 2, textAlign: 'right' },
    msg: { fontSize: 15, lineHeight: 21, textAlign: 'right' },
    msgMine: { color: c.bubbleMineText },
    msgOther: { color: c.bubbleOtherText },
    metaRow: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'flex-end', gap: 4, marginTop: 2 },
    time: { fontSize: 10, fontWeight: '500' },
    timeMine: { color: c.bubbleMineTime },
    timeOther: { color: c.bubbleOtherTime },
    sourceLine: { fontSize: 10, marginTop: 4, textAlign: 'right', opacity: 0.85 },
    sourceMine: { color: c.bubbleMineTime },
    sourceOther: { color: c.bubbleOtherTime },
    composer: {
      position: 'absolute',
      left: 0,
      right: 0,
      paddingHorizontal: 8,
      paddingTop: 8,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: c.inputBorder,
      backgroundColor: c.composerBg,
      flexDirection: 'row-reverse',
      alignItems: 'flex-end',
      gap: 6,
    },
    inputPill: {
      flex: 1,
      flexDirection: 'row-reverse',
      alignItems: 'flex-end',
      backgroundColor: c.inputBg,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: c.inputBorder,
      paddingHorizontal: 12,
      paddingVertical: Platform.OS === 'ios' ? 10 : 8,
      minHeight: touch.minHeight - 2,
      maxHeight: 120,
    },
    input: {
      flex: 1,
      fontSize: 16,
      lineHeight: 22,
      color: c.inputText,
      textAlign: 'right',
      paddingVertical: 0,
    },
    sendFab: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 2,
    },
    sendFabActive: { backgroundColor: c.sendBg },
    sendFabDisabled: { backgroundColor: c.sendBgDisabled },
    micFab: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 4,
      borderWidth: 1,
      borderColor: c.inputBorder,
      backgroundColor: c.inputBg,
    },
    micFabActive: { borderColor: 'rgba(185, 28, 28, 0.45)', backgroundColor: 'rgba(254, 226, 226, 0.35)' },
    errWrap: {
      borderWidth: 1,
      borderColor: c.errBorder,
      backgroundColor: c.errBg,
      borderRadius: 10,
      padding: 10,
      marginBottom: 10,
    },
    errorText: { color: c.errText, textAlign: 'right', fontWeight: '600', fontSize: 13 },
    suggestGrid: {
      flexDirection: 'row-reverse',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      rowGap: 8,
      marginTop: 8,
    },
    sCard: {
      width: '48.5%',
      flexDirection: 'row-reverse',
      alignItems: 'center',
      backgroundColor: c.bubbleOtherBg,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: c.inputBorder,
      padding: 10,
      minHeight: 68,
    },
    sText: { flex: 1, color: c.bubbleOtherText, fontSize: 11, fontWeight: '700', textAlign: 'right', lineHeight: 16 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
    modalSheet: {
      backgroundColor: c.bubbleOtherBg,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      maxHeight: '72%',
      paddingBottom: 24,
    },
    modalHeader: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: c.inputBorder,
    },
    modalTitle: { fontSize: 17, fontWeight: '900', color: c.bubbleOtherText, textAlign: 'right' },
    modalRow: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: c.inputBorder,
      gap: 10,
    },
    modalRowTitle: { flex: 1, color: c.bubbleOtherText, fontWeight: '700', textAlign: 'right', fontSize: 15 },
    modalRowSub: { color: c.bubbleOtherTime, fontSize: 12, textAlign: 'right', marginTop: 2 },
    modalEmpty: { padding: 24, alignItems: 'center' },
    modalEmptyText: { color: c.bubbleOtherTime, textAlign: 'center', fontSize: 14 },
  });
}

export function BunyanAIScreen() {
  const user = useStore((s) => s.user);
  const role = useStore((s) => s.user?.role);
  const uid = user?._id ? String(user._id) : '';
  const insets = useSafeAreaInsets();
  const keyboardHeight = useKeyboardHeight();
  const { resolved } = useAppTheme();
  const wa = useMemo(() => waColors(resolved), [resolved]);
  const styles = useMemo(() => createChatStyles(wa), [wa]);

  const [messages, setMessages] = useState<BunyanAiMessage[]>([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [backendStatus, setBackendStatus] = useState<BackendStatus>('checking');
  const [historyOpen, setHistoryOpen] = useState(false);
  const [savedOpen, setSavedOpen] = useState(false);
  const [trashOpen, setTrashOpen] = useState(false);
  const [archives, setArchives] = useState<BunyanAiThread[]>([]);
  const [trashThreads, setTrashThreads] = useState<BunyanAiThread[]>([]);
  const [savedTurns, setSavedTurns] = useState<BunyanSavedTurn[]>([]);

  const listRef = useRef<FlatList<BunyanAiMessage>>(null);
  const tabReserve = DASHBOARD_TAB_BAR_SCROLL_BASE + insets.bottom + 8;
  const composerBottom = Math.max(insets.bottom, 8) + 6;
  const composerLift = tabReserve + keyboardHeight;

  const isClient = role === 'client';
  const suggestions = useMemo(() => (isClient ? SUGGESTIONS_CLIENT : SUGGESTIONS_CONTRACTOR), [isClient]);
  const placeholder = isClient ? 'سؤالك عن المشروع أو المقاول…' : 'سؤالك عن البناء والموقع…';
  const serverHost = useMemo(() => apiHostLabel(), []);

  const checkBackendHealth = useCallback(async (fromUser = false) => {
    if (fromUser) setBackendStatus('checking');
    try {
      const { data } = await api.get<{ status?: string }>('/health', { timeout: 90_000 });
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

  useEffect(() => {
    if (!uid) {
      setMessages([]);
      return;
    }
    let cancelled = false;
    void loadActiveMessages(uid).then((m) => {
      if (!cancelled) setMessages(m);
    });
    return () => {
      cancelled = true;
    };
  }, [uid]);

  useEffect(() => {
    if (!uid) return;
    const t = setTimeout(() => {
      void saveActiveMessages(uid, messages);
    }, 350);
    return () => clearTimeout(t);
  }, [messages, uid]);

  const refreshArchives = useCallback(async () => {
    if (!uid) return;
    setArchives(await loadArchives(uid));
  }, [uid]);

  const refreshTrash = useCallback(async () => {
    if (!uid) return;
    setTrashThreads(await loadTrash(uid));
  }, [uid]);

  const refreshSaved = useCallback(async () => {
    if (!uid) return;
    setSavedTurns(await loadSaved(uid));
  }, [uid]);

  useEffect(() => {
    if (historyOpen) void refreshArchives();
  }, [historyOpen, refreshArchives]);

  useEffect(() => {
    if (trashOpen) void refreshTrash();
  }, [trashOpen, refreshTrash]);

  useEffect(() => {
    if (savedOpen) void refreshSaved();
  }, [savedOpen, refreshSaved]);

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

  const openFromHistory = useCallback(
    async (thread: BunyanAiThread) => {
      if (!uid) return;
      const go = async () => {
        if (messages.length > 0) {
          await archiveCurrentAndClear(uid, messages);
        }
        await applyThreadAsActive(uid, thread);
        setMessages(thread.messages);
        setHistoryOpen(false);
        hapticSuccess();
      };
      if (messages.length > 0) {
        Alert.alert('فتح محادثة سابقة', 'سيُؤرشف الحديث الحالي في «المحادثات السابقة» ثم يُفتح المحدد.', [
          { text: 'إلغاء', style: 'cancel' },
          { text: 'متابعة', onPress: () => void go() },
        ]);
      } else {
        await go();
      }
    },
    [messages, uid]
  );

  const startNewChat = useCallback(() => {
    if (!uid) return;
    if (messages.length === 0) {
      hapticLight();
      return;
    }
    Alert.alert('محادثة جديدة', 'سيُحفظ الحديث الحالي في «المحادثات السابقة» وتبدأ صفحة فارغة.', [
      { text: 'إلغاء', style: 'cancel' },
      {
        text: 'متابعة',
        onPress: () => {
          void (async () => {
            await archiveCurrentAndClear(uid, messages);
            setMessages([]);
            await refreshArchives();
            hapticSuccess();
          })();
        },
      },
    ]);
  }, [messages, refreshArchives, uid]);

  const sendQuestion = async () => {
    const t = q.trim();
    if (!uid) {
      Alert.alert('تسجيل الدخول مطلوب', 'يرجى تسجيل الدخول أولاً لاستخدام مساعد بنيان.');
      return;
    }
    if (!t) {
      hapticLight();
      Alert.alert('تنبيه', 'اكتب سؤالاً ثم اضغط إرسال.');
      return;
    }
    if (backendStatus === 'offline') {
      Alert.alert(
        'الخادم غير متاح',
        'تعذر الاتصال بالـ API. انتظر قليلاً ثم اضغط على حالة الاتصال أعلاه لإعادة المحاولة.',
      );
      return;
    }
    const userMsg: BunyanAiMessage = {
      id: bunyanGenId(),
      role: 'user',
      content: t,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setQ('');
    setLoading(true);
    try {
      const res = await aiAPI.ask(t);
      const asst: BunyanAiMessage = {
        id: bunyanGenId(),
        role: 'assistant',
        content: res.answer,
        source: res.source,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, asst]);
      hapticSuccess();
    } catch (e) {
      const errText = getApiErrorMessage(e);
      Alert.alert('تعذر إرسال السؤال', errText);
      const asstErr: BunyanAiMessage = {
        id: bunyanGenId(),
        role: 'assistant',
        content: `تعذر الحصول على رد: ${errText}`,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, asstErr]);
    } finally {
      setLoading(false);
    }
  };

  const findPrevUserQuestion = useCallback((assistantIndex: number) => {
    for (let i = assistantIndex - 1; i >= 0; i--) {
      if (messages[i]?.role === 'user') return messages[i].content;
    }
    return '';
  }, [messages]);

  const onLongPressAssistant = useCallback(
    (item: BunyanAiMessage, index: number) => {
      if (!uid) return;
      const question = findPrevUserQuestion(index);
      Alert.alert('الجواب', undefined, [
        {
          text: 'حفظ في المحفوظات',
          onPress: () => {
            void (async () => {
              const list = await loadSaved(uid);
              const row: BunyanSavedTurn = {
                id: bunyanGenId(),
                question: question || '—',
                answer: item.content,
                source: item.source,
                savedAt: new Date().toISOString(),
              };
              await saveSaved(uid, [row, ...list]);
              await refreshSaved();
              hapticSuccess();
            })();
          },
        },
        { text: 'إلغاء', style: 'cancel' },
      ]);
    },
    [findPrevUserQuestion, refreshSaved, uid]
  );

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
        Alert.alert('إذن مطلوب', 'فعّل الميكروفون من إعدادات الجهاز.');
        return;
      }
      if (!ExpoSpeechRecognitionModule.isRecognitionAvailable()) {
        Alert.alert('غير متاح', 'التعرّف على الكلام غير متاح على هذا الجهاز.');
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

  const renderMessage = useCallback(
    ({ item, index }: { item: BunyanAiMessage; index: number }) => {
      const mine = item.role === 'user';
      const align = bubbleAlign(mine);
      const srcLine = !mine && item.source ? sourceLabel(item.source) : '';
      return (
        <Pressable
          style={[styles.rowWrap, { alignSelf: align }]}
          onLongPress={!mine ? () => onLongPressAssistant(item, index) : undefined}
          delayLongPress={450}
        >
          <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleOther]}>
            {!mine ? <Text style={styles.sender}>بنيان AI</Text> : null}
            <Text style={[styles.msg, mine ? styles.msgMine : styles.msgOther]}>{item.content}</Text>
            {srcLine ? (
              <Text style={[styles.sourceLine, mine ? styles.sourceMine : styles.sourceOther]}>{srcLine}</Text>
            ) : null}
            <View style={styles.metaRow}>
              <Text style={[styles.time, mine ? styles.timeMine : styles.timeOther]}>{formatChatTime(item.createdAt)}</Text>
            </View>
          </View>
        </Pressable>
      );
    },
    [onLongPressAssistant, styles]
  );

  const listPaddingBottom = 72 + composerBottom + composerLift;

  const listHeader = useMemo(
    () => (
      <View>
        {backendStatus === 'offline' ? (
          <View style={styles.errWrap}>
            <Text style={styles.errorText}>الخادم غير متاح — اضغط على حالة الاتصال في الشريط العلوي لإعادة المحاولة.</Text>
          </View>
        ) : null}
        {messages.length === 0 ? (
          <View style={{ marginBottom: 12 }}>
            <Text style={[styles.modalRowTitle, { marginBottom: 8 }]}>اقتراحات سريعة</Text>
            <View style={styles.suggestGrid}>
              {suggestions.map((s) => (
                <Pressable
                  key={s.text}
                  accessibilityRole="button"
                  onPress={() => setQ(s.text)}
                  {...pressableRipple(wa.inputBorder)}
                  style={styles.sCard}
                >
                  <Ionicons name={s.icon} size={20} color={wa.sendBg} style={{ marginLeft: 8 }} />
                  <Text style={styles.sText}>{s.text}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        ) : null}
      </View>
    ),
    [backendStatus, messages.length, styles, suggestions, wa.inputBorder, wa.sendBg]
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.headerRow}>
        <View style={styles.headerIcons}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="سلة المحذوفات"
            onPress={() => {
              hapticLight();
              setTrashOpen(true);
            }}
            style={styles.headerIconBtn}
          >
            <Ionicons name="trash-outline" size={22} color={wa.headerTint} />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="المحفوظات"
            onPress={() => {
              hapticLight();
              setSavedOpen(true);
            }}
            style={styles.headerIconBtn}
          >
            <Ionicons name="bookmark-outline" size={22} color={wa.headerTint} />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="محادثات سابقة"
            onPress={() => {
              hapticLight();
              setHistoryOpen(true);
            }}
            style={styles.headerIconBtn}
          >
            <Ionicons name="chatbubbles-outline" size={22} color={wa.headerTint} />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="محادثة جديدة"
            onPress={() => {
              hapticLight();
              startNewChat();
            }}
            style={styles.headerIconBtn}
          >
            <Ionicons name="create-outline" size={22} color={wa.headerTint} />
          </Pressable>
        </View>
        <View style={{ flex: 1 }} />
        <View style={styles.headerTitleBlock}>
          <Text style={styles.headerTitle}>مساعد بنيان</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="إعادة التحقق من الخادم"
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
                ? 'جاري التحقق…'
                : backendStatus === 'online'
                  ? 'متصل بالخادم'
                  : 'غير متصل'}
            </Text>
          </Pressable>
          <Text style={styles.statusHost} numberOfLines={1}>
            {serverHost}
          </Text>
        </View>
      </View>

      <View style={styles.flex}>
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          renderItem={renderMessage}
          contentContainerStyle={[styles.listContent, { paddingBottom: listPaddingBottom }]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={listHeader}
          ListFooterComponent={
            loading ? (
              <View style={{ paddingVertical: 12, alignItems: 'center' }}>
                <ActivityIndicator color={wa.sendBg} />
                <Text style={[styles.timeOther, { marginTop: 8 }]}>جاري توليد الرد…</Text>
              </View>
            ) : null
          }
          extraData={loading}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        />

        <View style={[styles.composer, { paddingBottom: composerBottom, bottom: composerLift }]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="إرسال"
            onPress={() => void sendQuestion()}
            disabled={!q.trim() || loading}
            style={[styles.sendFab, q.trim() && !loading ? styles.sendFabActive : styles.sendFabDisabled]}
          >
            <Ionicons name="send" size={20} color={wa.sendIcon} />
          </Pressable>
          <View style={styles.inputPill}>
            <TextInput
              value={q}
              onChangeText={setQ}
              placeholder={placeholder}
              placeholderTextColor={wa.placeholder}
              style={styles.input}
              multiline
              maxLength={2000}
              textAlign="right"
              editable={!loading}
            />
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={listening ? 'إيقاف التسجيل' : 'إدخال صوتي'}
            onPress={() => void onMic()}
            style={[styles.micFab, listening && styles.micFabActive]}
            disabled={loading}
          >
            {listening ? (
              <Ionicons name="stop-circle" size={26} color="#b91c1c" />
            ) : (
              <Ionicons name="mic-outline" size={22} color={wa.bubbleOtherText} />
            )}
          </Pressable>
        </View>
      </View>

      <Modal visible={historyOpen} animationType="slide" transparent onRequestClose={() => setHistoryOpen(false)}>
        <View style={styles.modalOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setHistoryOpen(false)} />
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Pressable onPress={() => setHistoryOpen(false)} hitSlop={12}>
                <Ionicons name="close" size={28} color={wa.bubbleOtherText} />
              </Pressable>
              <Text style={styles.modalTitle}>المحادثات السابقة</Text>
              <View style={{ width: 28 }} />
            </View>
            <FlatList
              data={archives}
              keyExtractor={(t) => t.id}
              ListEmptyComponent={
                <View style={styles.modalEmpty}>
                  <Text style={styles.modalEmptyText}>لا توجد محادثات مؤرشفة بعد. استخدم «محادثة جديدة» لحفظ الحديث الحالي.</Text>
                </View>
              }
              renderItem={({ item }) => (
                <View style={styles.modalRow}>
                  <Pressable
                    onPress={() => void openFromHistory(item)}
                    style={{ flex: 1 }}
                    accessibilityRole="button"
                    accessibilityLabel={`فتح ${item.title}`}
                  >
                    <Text style={styles.modalRowTitle} numberOfLines={2}>
                      {item.title}
                    </Text>
                    <Text style={styles.modalRowSub}>
                      {formatChatTime(item.updatedAt)} · {item.messages.length} رسالة
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      Alert.alert('نقل إلى سلة المحذوفات؟', item.title, [
                        { text: 'إلغاء', style: 'cancel' },
                        {
                          text: 'حذف',
                          style: 'destructive',
                          onPress: () => {
                            void (async () => {
                              await moveThreadToTrash(uid, item.id, 'archives');
                              await refreshArchives();
                              await refreshTrash();
                            })();
                          },
                        },
                      ]);
                    }}
                    hitSlop={8}
                  >
                    <Ionicons name="trash-outline" size={22} color="#b91c1c" />
                  </Pressable>
                </View>
              )}
            />
          </View>
        </View>
      </Modal>

      <Modal visible={savedOpen} animationType="slide" transparent onRequestClose={() => setSavedOpen(false)}>
        <View style={styles.modalOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setSavedOpen(false)} />
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Pressable onPress={() => setSavedOpen(false)} hitSlop={12}>
                <Ionicons name="close" size={28} color={wa.bubbleOtherText} />
              </Pressable>
              <Text style={styles.modalTitle}>المحفوظات</Text>
              <View style={{ width: 28 }} />
            </View>
            <FlatList
              data={savedTurns}
              keyExtractor={(s) => s.id}
              ListEmptyComponent={
                <View style={styles.modalEmpty}>
                  <Text style={styles.modalEmptyText}>اضغط مطولاً على رد بنيان AI ثم اختر «حفظ في المحفوظات».</Text>
                </View>
              }
              renderItem={({ item }) => (
                <View style={styles.modalRow}>
                  <Pressable
                    style={{ flex: 1 }}
                    onPress={() => {
                      Alert.alert(item.question, `${item.answer}\n\n${sourceLabel(item.source)}`, [{ text: 'حسناً' }]);
                    }}
                  >
                    <Text style={styles.modalRowTitle} numberOfLines={2}>
                      {item.question}
                    </Text>
                    <Text style={styles.modalRowSub} numberOfLines={2}>
                      {item.answer}
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      Alert.alert('نقل إلى السلة؟', undefined, [
                        { text: 'إلغاء', style: 'cancel' },
                        {
                          text: 'حذف',
                          style: 'destructive',
                          onPress: () => {
                            void (async () => {
                              await moveThreadToTrash(uid, item.id, 'saved');
                              await refreshSaved();
                              await refreshTrash();
                            })();
                          },
                        },
                      ]);
                    }}
                  >
                    <Ionicons name="trash-outline" size={22} color="#b91c1c" />
                  </Pressable>
                </View>
              )}
            />
          </View>
        </View>
      </Modal>

      <Modal visible={trashOpen} animationType="slide" transparent onRequestClose={() => setTrashOpen(false)}>
        <View style={styles.modalOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setTrashOpen(false)} />
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Pressable onPress={() => setTrashOpen(false)} hitSlop={12}>
                <Ionicons name="close" size={28} color={wa.bubbleOtherText} />
              </Pressable>
              <Text style={styles.modalTitle}>سلة المحذوفات</Text>
              <View style={{ width: 28 }} />
            </View>
            <FlatList
              data={trashThreads}
              keyExtractor={(t) => t.id}
              ListEmptyComponent={
                <View style={styles.modalEmpty}>
                  <Text style={styles.modalEmptyText}>السلة فارغة.</Text>
                </View>
              }
              renderItem={({ item }) => (
                <View style={styles.modalRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.modalRowTitle} numberOfLines={2}>
                      {item.title}
                    </Text>
                    <Text style={styles.modalRowSub}>{formatChatTime(item.updatedAt)}</Text>
                  </View>
                  <Pressable
                    onPress={() => {
                      void (async () => {
                        await restoreThreadFromTrash(uid, item.id);
                        await refreshTrash();
                        await refreshArchives();
                        hapticLight();
                      })();
                    }}
                    hitSlop={8}
                  >
                    <Ionicons name="arrow-undo-outline" size={24} color={wa.sendBg} />
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      Alert.alert('حذف نهائي؟', 'لا يمكن التراجع.', [
                        { text: 'إلغاء', style: 'cancel' },
                        {
                          text: 'حذف',
                          style: 'destructive',
                          onPress: () => {
                            void (async () => {
                              await purgeTrashThread(uid, item.id);
                              await refreshTrash();
                            })();
                          },
                        },
                      ]);
                    }}
                    hitSlop={8}
                  >
                    <Ionicons name="close-circle-outline" size={24} color="#b91c1c" />
                  </Pressable>
                </View>
              )}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
