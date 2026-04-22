import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';

import { useStore } from '../../store/useStore';
import type { RootStackParamList } from '../../navigation/types';
import type { ChatMessage } from '../../api/types';
import { colors, pressableRipple, radius, space, touch } from '../../theme';

type Route = RouteProp<RootStackParamList, 'ChatRoom'>;

export function ChatRoomScreen() {
  const route = useRoute<Route>();
  const conversationId = route.params.conversationId;

  const refreshChatMessages = useStore((s) => s.refreshChatMessages);
  const sendChatMessage = useStore((s) => s.sendChatMessage);
  const markChatThreadRead = useStore((s) => s.markChatThreadRead);
  const messages = useStore((s) => s.chatMessagesByThread[conversationId] ?? []);
  const me = useStore((s) => s.user);

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
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
    >
      <FlatList
        ref={listRef}
        data={data}
        keyExtractor={(m) => m.id}
        contentContainerStyle={styles.listPad}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        renderItem={({ item }) => {
          const mine = item.senderId === me?._id;
          return (
            <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleOther]}>
              {!mine ? <Text style={styles.sender}>{item.senderName}</Text> : null}
              <Text style={styles.msg}>{item.text}</Text>
              <Text style={styles.time}>{new Date(item.timestamp).toLocaleString()}</Text>
            </View>
          );
        }}
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

const styles = StyleSheet.create({
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
