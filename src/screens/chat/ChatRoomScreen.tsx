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
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#0B1220' }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <FlatList
        ref={listRef}
        data={data}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ padding: 12, paddingBottom: 90 }}
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
        <TextInput value={text} onChangeText={setText} placeholder="اكتب رسالة..." placeholderTextColor="#64748B" style={styles.input} />
        <Pressable onPress={onSend} style={styles.send}>
          <Text style={styles.sendText}>إرسال</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, backgroundColor: '#0B1220', alignItems: 'center', justifyContent: 'center' },
  bubble: { maxWidth: '86%', padding: 10, borderRadius: 14, marginBottom: 10, borderWidth: 1 },
  bubbleMine: { alignSelf: 'flex-end', backgroundColor: 'rgba(56,189,248,0.18)', borderColor: '#38BDF8' },
  bubbleOther: { alignSelf: 'flex-start', backgroundColor: 'rgba(15,23,42,0.72)', borderColor: '#1F2937' },
  sender: { color: '#93C5FD', fontWeight: '800', marginBottom: 4 },
  msg: { color: '#E2E8F0' },
  time: { color: '#64748B', fontSize: 11, marginTop: 6, textAlign: 'right' },
  composer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#1F2937',
    backgroundColor: '#0B1220',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#0B1220',
    borderColor: '#1F2937',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#E2E8F0',
  },
  send: { backgroundColor: '#38BDF8', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12 },
  sendText: { color: '#0B1220', fontWeight: '900' },
});
