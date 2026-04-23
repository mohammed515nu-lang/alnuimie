import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useNavigation } from '@react-navigation/native';

import { useStore } from '../../store/useStore';
import type { ChatMessage } from '../../api/types';
import { isIOS } from '../../utils/platformEnv';
import { useAppTheme, pressableRipple, radius, space, touch } from '../../theme';
import type { AppPalette } from '../../theme/palettes';

function readString(p: string | string[] | undefined) {
  if (p === undefined) return '';
  return Array.isArray(p) ? (p[0] ?? '') : p;
}

export function ChatRoomScreen() {
  const { conversationId: cId, title: titleP } = useLocalSearchParams<{
    conversationId: string;
    title?: string;
  }>();
  const conversationId = readString(cId);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    const t = readString(titleP);
    if (t) navigation.setOptions({ title: t } as never);
  }, [titleP, navigation]);

  const refreshChatMessages = useStore((s) => s.refreshChatMessages);
  const sendChatMessage = useStore((s) => s.sendChatMessage);
  const markChatThreadRead = useStore((s) => s.markChatThreadRead);
  const messages = useStore((s) => s.chatMessagesByThread[conversationId] ?? []);
  const me = useStore((s) => s.user);
  const { colors } = useAppTheme();
  const styles = useMemo(() => createChatRoomStyles(colors), [colors]);

  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const listRef = useRef<FlatList<ChatMessage>>(null);

  useEffect(() => {
    let poll: ReturnType<typeof setInterval> | undefined;
    (async () => {
      setLoading(true);
      try {
        await refreshChatMessages(conversationId);
        await markChatThreadRead(conversationId);
      } finally {
        setLoading(false);
      }
      poll = setInterval(() => {
        void refreshChatMessages(conversationId);
      }, 5000);
    })();
    return () => {
      if (poll) clearInterval(poll);
    };
  }, [conversationId, markChatThreadRead, refreshChatMessages]);

  const data = useMemo(() => messages, [messages]);

  const renderMessage = useCallback(
    ({ item }: { item: ChatMessage }) => {
      const mine = item.senderId === me?._id;
      return (
        <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleOther]}>
          {!mine ? <Text style={styles.sender}>{item.senderName}</Text> : null}
          <Text style={styles.msg}>{item.text}</Text>
          <Text style={styles.time}>{new Date(item.timestamp).toLocaleString()}</Text>
        </View>
      );
    },
    [me?._id, styles]
  );

  const onSend = async () => {
    const t = text.trim();
    if (!t) return;
    setText('');
    await sendChatMessage(conversationId, t);
    listRef.current?.scrollToEnd({ animated: true });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={isIOS ? 'padding' : undefined}
      keyboardVerticalOffset={isIOS ? 88 : 0}
    >
      <FlatList
        ref={listRef}
        data={data}
        keyExtractor={(m) => m.id}
        contentContainerStyle={styles.listPad}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        contentInsetAdjustmentBehavior="automatic"
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        renderItem={renderMessage}
      />

      <View style={styles.composer}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="اكتب رسالة..."
          placeholderTextColor={colors.placeholder}
          style={styles.input}
          multiline
          maxLength={4000}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="إرسال الرسالة"
          onPress={onSend}
          {...pressableRipple(colors.primaryTint18)}
          style={styles.send}
        >
          <Text style={styles.sendText}>إرسال</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

function createChatRoomStyles(colors: AppPalette) {
  return StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
  listPad: { padding: space.md, paddingBottom: 96 },
  bubble: { maxWidth: '86%', padding: space.sm + 2, borderRadius: radius.lg, marginBottom: space.sm + 2, borderWidth: 1 },
  bubbleMine: { alignSelf: 'flex-end', backgroundColor: colors.primaryTint18, borderColor: colors.primary },
  bubbleOther: { alignSelf: 'flex-start', backgroundColor: colors.card, borderColor: colors.border },
  sender: { color: colors.link, fontWeight: '800', marginBottom: space.xs },
  msg: { color: colors.textSecondary },
  time: { color: colors.placeholder, fontSize: 11, marginTop: space.sm - 2, textAlign: 'right' },
  composer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: space.sm + 2,
    paddingBottom: space.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
    flexDirection: 'row',
    gap: space.sm + 2,
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
    paddingVertical: space.sm + 2,
    color: colors.textSecondary,
    maxHeight: 120,
    minHeight: touch.minHeight - 4,
  },
  send: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
    paddingVertical: space.sm + 2,
    minHeight: touch.minHeight - 4,
    justifyContent: 'center',
  },
  sendText: { color: colors.onPrimary, fontWeight: '900' },
});
}
