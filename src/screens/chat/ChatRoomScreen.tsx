import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  I18nManager,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

import { useStore } from '../../store/useStore';
import type { ChatMessage, UserRole } from '../../api/types';
import { getApiErrorMessage } from '../../api/http';
import { socialAPI } from '../../api/services/social';
import { isIOS } from '../../utils/platformEnv';
import { touch, useAppTheme, type ResolvedScheme, hitSlop } from '../../theme';

/** مرجع ثابت لمحدد Zustand — `?? []` داخل المحدد يُنشئ مصفوفة جديدة كل مرة ويسبب حلقة تصيير لا نهائية. */
const EMPTY_CHAT_MESSAGES: ChatMessage[] = [];

function readString(p: string | string[] | undefined): string {
  if (p === undefined) return '';
  const val = Array.isArray(p) ? (p[0] ?? '') : p;
  return val.trim();
}

function isValidConversationId(id: string): boolean {
  const s = id.trim();
  if (!s || s.length > 200) return false;
  if (/^[0-9a-f]{24}$/i.test(s)) return true;
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s)) return true;
  if (/^[a-zA-Z0-9_-]{12,128}$/.test(s)) return true;
  return false;
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

function roleLabelAr(role: UserRole | undefined): string | undefined {
  if (!role) return undefined;
  if (role === 'contractor') return 'مقاول';
  if (role === 'client') return 'صاحب مشروع';
  return undefined;
}

function formatLastSeenArabic(iso: string | null | undefined): string {
  if (!iso) return 'لا يتوفر وقت آخر ظهور';
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return 'لا يتوفر وقت آخر ظهور';
    const now = new Date();
    const startOf = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
    if (startOf(d) === startOf(now)) {
      return `اليوم ${d.toLocaleTimeString('ar-SY', { hour: '2-digit', minute: '2-digit' })}`;
    }
    const y = d.toLocaleDateString('ar-SY', { year: 'numeric', month: 'short', day: 'numeric' });
    const t = d.toLocaleTimeString('ar-SY', { hour: '2-digit', minute: '2-digit' });
    return `${y} · ${t}`;
  } catch {
    return 'لا يتوفر وقت آخر ظهور';
  }
}

/** أحدث وقت صالح من عدة مصادر (خادم + رسائل + آخر نشاط في المحادثة). */
function maxValidIso(...candidates: (string | null | undefined)[]): string | null {
  let best = 0;
  let bestStr: string | null = null;
  for (const c of candidates) {
    if (!c?.trim()) continue;
    const t = new Date(c).getTime();
    if (!Number.isNaN(t) && t >= best) {
      best = t;
      bestStr = c;
    }
  }
  return bestStr;
}

/** في RTL: flex-start يضع فقاعتي على يمين الشاشة (مثل واتساب العربي). */
function bubbleAlign(mine: boolean): 'flex-start' | 'flex-end' {
  const rtl = I18nManager.isRTL;
  if (mine) return rtl ? 'flex-start' : 'flex-end';
  return rtl ? 'flex-end' : 'flex-start';
}

type PeerStripProps = {
  onBack: () => void;
  name: string;
  avatarUri: string | null;
  roleLine?: string;
  lastSeenAt: string | null | undefined;
  styles: ReturnType<typeof createStyles>;
  tint: string;
};

function PeerContactStrip({ onBack, name, avatarUri, roleLine, lastSeenAt, styles, tint }: PeerStripProps) {
  const line = `آخر ظهور: ${formatLastSeenArabic(lastSeenAt)}`;
  return (
    <View style={styles.peerStrip}>
      <Pressable accessibilityRole="button" accessibilityLabel="رجوع" onPress={onBack} style={styles.peerBack} hitSlop={hitSlop}>
        <Ionicons name="chevron-forward" size={26} color={tint} />
      </Pressable>
      {avatarUri ? (
        <View style={styles.peerAvatarRing}>
          <Image source={{ uri: avatarUri }} style={styles.peerAvatarImg} />
        </View>
      ) : (
        <View style={styles.peerAvatarPh}>
          <Ionicons name="person" size={26} color={tint} />
        </View>
      )}
      <View style={styles.peerTextCol}>
        <Text style={[styles.peerName, { color: tint }]} numberOfLines={1}>
          {name}
        </Text>
        {roleLine ? (
          <Text style={styles.peerRole} numberOfLines={1}>
            {roleLine}
          </Text>
        ) : null}
        <Text style={styles.peerLastSeen} numberOfLines={2}>
          {line}
        </Text>
      </View>
    </View>
  );
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

function createStyles(c: ChatTheme) {
  const bubbleRadius = { borderTopLeftRadius: 8, borderTopRightRadius: 8, borderBottomLeftRadius: 8, borderBottomRightRadius: 8 };
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: c.chatBg },
    flex: { flex: 1 },
    center: { flex: 1, backgroundColor: c.chatBg, alignItems: 'center', justifyContent: 'center' },
    peerStrip: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      paddingHorizontal: 4,
      paddingVertical: 8,
      backgroundColor: c.headerBg,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: c.stripBorder,
      gap: 8,
    },
    peerBack: {
      width: 44,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
    },
    peerAvatarRing: {
      width: 50,
      height: 50,
      borderRadius: 25,
      overflow: 'hidden',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: 'rgba(255,255,255,0.4)',
      backgroundColor: 'rgba(255,255,255,0.12)',
    },
    peerAvatarImg: { width: 50, height: 50, borderRadius: 25 },
    peerAvatarPh: {
      width: 50,
      height: 50,
      borderRadius: 25,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: 'rgba(255,255,255,0.35)',
      backgroundColor: 'rgba(255,255,255,0.15)',
    },
    peerTextCol: { flex: 1, alignItems: 'flex-end', justifyContent: 'center', minWidth: 0, paddingEnd: 4 },
    peerName: { fontSize: 18, fontWeight: '800', textAlign: 'right' },
    peerRole: { fontSize: 13, fontWeight: '600', marginTop: 2, textAlign: 'right', color: c.stripMuted },
    peerLastSeen: { fontSize: 12, fontWeight: '500', marginTop: 3, textAlign: 'right', color: c.stripMuted, lineHeight: 17 },
    listContent: { paddingHorizontal: 10, paddingTop: 10, paddingBottom: 8 },
    rowWrap: { marginBottom: 3, maxWidth: '100%' },
    bubble: {
      maxWidth: '82%',
      paddingHorizontal: 10,
      paddingTop: 6,
      paddingBottom: 5,
      ...bubbleRadius,
      elevation: 1,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 2,
    },
    bubbleMine: {
      backgroundColor: c.bubbleMineBg,
    },
    bubbleOther: {
      backgroundColor: c.bubbleOtherBg,
    },
    sender: {
      color: c.bubbleOtherName,
      fontWeight: '700',
      fontSize: 13,
      marginBottom: 3,
      textAlign: 'right',
    },
    msg: { fontSize: 16, lineHeight: 22, textAlign: 'right' },
    msgMine: { color: c.bubbleMineText },
    msgOther: { color: c.bubbleOtherText },
    metaRow: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: 4,
      marginTop: 2,
    },
    time: { fontSize: 11, fontWeight: '500' },
    timeMine: { color: c.bubbleMineTime },
    timeOther: { color: c.bubbleOtherTime },
    composer: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
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
      paddingHorizontal: 14,
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
      margin: 0,
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
    errWrap: {
      borderWidth: 1,
      borderColor: c.errBorder,
      backgroundColor: c.errBg,
      borderRadius: 10,
      padding: 10,
      marginBottom: 10,
    },
    errorText: { color: c.errText, textAlign: 'right', fontWeight: '600', fontSize: 13 },
  });
}

export function ChatRoomScreen() {
  const { conversationId: cId, title: titleP } = useLocalSearchParams<{
    conversationId: string;
    title?: string;
  }>();
  const conversationId = readString(cId);
  const valid = !!conversationId && isValidConversationId(conversationId);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { resolved } = useAppTheme();
  const wa = useMemo(() => waColors(resolved), [resolved]);
  const styles = useMemo(() => createStyles(wa), [wa]);

  const messages = useStore((s) => {
    const list = s.chatMessagesByThread[conversationId];
    return list ?? EMPTY_CHAT_MESSAGES;
  });
  const me = useStore((s) => s.user);
  const chatThreads = useStore((s) => s.chatThreads);

  const thread = useMemo(
    () => chatThreads.find((t) => t.id === conversationId),
    [chatThreads, conversationId]
  );

  const inferredOtherUserId = useMemo(() => {
    const uid = me?._id ? String(me._id) : '';
    if (!uid || !messages.length) return '';
    const m = messages.find((x) => String(x.senderId) !== uid);
    return m?.senderId ? String(m.senderId) : '';
  }, [me?._id, messages]);

  const otherUserIdForProfile = useMemo(() => {
    const fromThread = thread?.otherUserId?.trim();
    if (fromThread) return fromThread;
    return inferredOtherUserId.trim();
  }, [thread?.otherUserId, inferredOtherUserId]);

  const basePeerName = useMemo(() => {
    const fromThread = thread?.otherUserName?.trim();
    const fromParam = readString(titleP);
    return (fromThread || fromParam || 'محادثة').trim();
  }, [thread?.otherUserName, titleP]);

  const headerSubtitle = useMemo(() => roleLabelAr(thread?.otherUserRole), [thread?.otherUserRole]);

  const [peerAvatarUri, setPeerAvatarUri] = useState<string | null>(null);
  const [peerNameOverride, setPeerNameOverride] = useState<string | null>(null);
  const [peerLastSeenFromProfile, setPeerLastSeenFromProfile] = useState<string | null>(null);

  const headerDisplayName = (peerNameOverride?.trim() || basePeerName).trim() || 'محادثة';

  const peerLastSeenAt = useMemo(() => {
    const uid = otherUserIdForProfile?.trim();
    let fromMsgs: string | null = null;
    if (uid && messages.length) {
      let latest = 0;
      for (const m of messages) {
        if (String(m.senderId) !== uid) continue;
        const t = new Date(m.timestamp).getTime();
        if (!Number.isNaN(t) && t >= latest) {
          latest = t;
          fromMsgs = m.timestamp;
        }
      }
    }
    const threadFromPeer =
      thread?.lastTime?.trim() &&
      thread?.lastSenderId &&
      uid &&
      String(thread.lastSenderId) === uid
        ? String(thread.lastTime)
        : null;
    return maxValidIso(thread?.otherUserLastSeenAt, peerLastSeenFromProfile, fromMsgs, threadFromPeer);
  }, [
    messages,
    otherUserIdForProfile,
    thread?.otherUserLastSeenAt,
    thread?.lastTime,
    thread?.lastSenderId,
    peerLastSeenFromProfile,
  ]);

  const handleStripBack = useCallback(() => {
    if (router.canGoBack()) router.back();
  }, [router]);

  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<FlatList<ChatMessage>>(null);
  const isLoadingRef = useRef(false);

  useEffect(() => {
    if (valid) return;
    const t = setTimeout(() => {
      console.warn('Invalid conversationId:', conversationId);
      if (router.canGoBack()) router.back();
    }, 400);
    return () => clearTimeout(t);
  }, [conversationId, valid, router]);

  useEffect(() => {
    if (!valid || !otherUserIdForProfile) {
      setPeerAvatarUri(null);
      setPeerNameOverride(null);
      setPeerLastSeenFromProfile(null);
      return;
    }
    let cancelled = false;
    void (async () => {
      try {
        const p = await socialAPI.getPublicProfile(otherUserIdForProfile);
        if (cancelled) return;
        setPeerNameOverride(p.name?.trim() || null);
        setPeerAvatarUri(p.avatarUri ?? null);
        setPeerLastSeenFromProfile(p.lastSeenAt ?? null);
      } catch {
        if (!cancelled) {
          setPeerAvatarUri(null);
          setPeerNameOverride(null);
          setPeerLastSeenFromProfile(null);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [valid, otherUserIdForProfile]);

  const loadMessages = useCallback(
    async (showSpinner = false) => {
      if (!valid || !conversationId || isLoadingRef.current) return;
      isLoadingRef.current = true;
      if (showSpinner) setLoading(true);
      setError(null);
      try {
        const st = useStore.getState();
        await st.refreshChatMessages(conversationId);
        await st.markChatThreadRead(conversationId);
      } catch (e) {
        setError(getApiErrorMessage(e));
      } finally {
        isLoadingRef.current = false;
        if (showSpinner) setLoading(false);
      }
    },
    [valid, conversationId]
  );

  useEffect(() => {
    if (!valid) return;
    void loadMessages(true);
  }, [valid, loadMessages]);

  useFocusEffect(
    useCallback(() => {
      if (!valid) return () => {};
      let active = true;
      const poll = setInterval(() => {
        if (active) {
          void loadMessages(false);
          void useStore.getState().refreshChatThreads();
        }
      }, 4000);
      return () => {
        active = false;
        clearInterval(poll);
      };
    }, [valid, loadMessages])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadMessages(false);
    setRefreshing(false);
  }, [loadMessages]);

  const data = useMemo(() => messages, [messages]);

  const composerBottom = Math.max(insets.bottom, 8) + 6;
  const canSend = text.trim().length > 0 && !sending;

  const renderMessage = useCallback(
    ({ item }: { item: ChatMessage }) => {
      const mine = item.senderId === me?._id;
      const align = bubbleAlign(mine);
      return (
        <View style={[styles.rowWrap, { alignSelf: align }]}>
          <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleOther]}>
            {!mine ? <Text style={styles.sender}>{item.senderName}</Text> : null}
            <Text style={[styles.msg, mine ? styles.msgMine : styles.msgOther]}>{item.text}</Text>
            <View style={styles.metaRow}>
              <Text style={[styles.time, mine ? styles.timeMine : styles.timeOther]}>{formatChatTime(item.timestamp)}</Text>
              {mine ? (
                <Ionicons name="checkmark-done" size={14} color={resolved === 'dark' ? 'rgba(233,237,239,0.7)' : 'rgba(17,27,33,0.45)'} />
              ) : null}
            </View>
          </View>
        </View>
      );
    },
    [me?._id, resolved, styles]
  );

  const onSend = async () => {
    if (!valid) return;
    const t = text.trim();
    if (!t || sending) return;
    setSending(true);
    setError(null);
    setText('');
    try {
      await useStore.getState().sendChatMessage(conversationId, t);
      listRef.current?.scrollToEnd({ animated: true });
      await useStore.getState().markChatThreadRead(conversationId);
    } catch (e) {
      setText(t);
      setError(getApiErrorMessage(e));
    } finally {
      setSending(false);
    }
  };

  if (!valid) return null;

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <PeerContactStrip
          onBack={handleStripBack}
          name={headerDisplayName}
          avatarUri={peerAvatarUri}
          roleLine={headerSubtitle}
          lastSeenAt={peerLastSeenAt}
          styles={styles}
          tint={wa.headerTint}
        />
        <View style={styles.center}>
          <ActivityIndicator color={wa.sendBg} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <PeerContactStrip
        onBack={handleStripBack}
        name={headerDisplayName}
        avatarUri={peerAvatarUri}
        roleLine={headerSubtitle}
        lastSeenAt={peerLastSeenAt}
        styles={styles}
        tint={wa.headerTint}
      />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={isIOS ? 'padding' : undefined}
        keyboardVerticalOffset={isIOS ? insets.top : 0}
      >
        <FlatList
          ref={listRef}
          data={data}
          keyExtractor={(m) => m.id}
          contentContainerStyle={[styles.listContent, { paddingBottom: 72 + composerBottom }]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          contentInsetAdjustmentBehavior="automatic"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={wa.sendBg} colors={[wa.sendBg]} />
          }
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
          renderItem={renderMessage}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            error ? (
              <View style={styles.errWrap}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null
          }
        />

        <View style={[styles.composer, { paddingBottom: composerBottom }]}>
          <View style={styles.inputPill}>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="رسالة"
              placeholderTextColor={wa.placeholder}
              style={styles.input}
              multiline
              maxLength={4000}
              textAlign="right"
            />
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="إرسال"
            onPress={onSend}
            disabled={!canSend}
            style={[styles.sendFab, canSend ? styles.sendFabActive : styles.sendFabDisabled]}
          >
            <Ionicons name="send" size={20} color={wa.sendIcon} style={{ marginLeft: I18nManager.isRTL ? 0 : 2, marginRight: I18nManager.isRTL ? 2 : 0 }} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
