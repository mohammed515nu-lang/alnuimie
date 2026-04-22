import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useStore } from '../../store/useStore';
import { getApiErrorMessage } from '../../api/http';
import type { ChatThread } from '../../api/types';
import type { RootStackParamList } from '../../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function ChatListScreen() {
  const navigation = useNavigation<Nav>();
  const refreshChatThreads = useStore((s) => s.refreshChatThreads);
  const refreshConnections = useStore((s) => s.refreshConnections);
  const threads = useStore((s) => s.chatThreads);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    await Promise.all([refreshChatThreads(), refreshConnections()]);
  }, [refreshChatThreads, refreshConnections]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        await load();
      } catch (e) {
        setError(getApiErrorMessage(e));
      } finally {
        setLoading(false);
      }
    })();
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await load();
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setRefreshing(false);
    }
  };

  const renderItem = ({ item }: { item: ChatThread }) => (
    <Pressable
      style={styles.row}
      onPress={() => navigation.navigate('ChatRoom', { conversationId: item.id, title: item.otherUserName })}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.otherUserName}</Text>
        <Text style={styles.last} numberOfLines={1}>
          {item.lastMessage ?? '—'}
        </Text>
      </View>
      {item.unread > 0 ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.unread}</Text>
        </View>
      ) : (
        <Text style={styles.chev}>›</Text>
      )}
    </Pressable>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <FlatList
      data={threads}
      keyExtractor={(x) => x.id}
      renderItem={renderItem}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      contentContainerStyle={{ padding: 16, paddingBottom: 30, backgroundColor: '#0B1220' }}
      ListHeaderComponent={
        error ? (
          <View style={{ marginBottom: 10 }}>
            <Text style={styles.error}>{error}</Text>
            <Pressable onPress={() => void onRefresh()} style={styles.retry}>
              <Text style={styles.retryText}>إعادة المحاولة</Text>
            </Pressable>
          </View>
        ) : null
      }
      ListEmptyComponent={<Text style={styles.empty}>لا محادثات بعد</Text>}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, backgroundColor: '#0B1220', alignItems: 'center', justifyContent: 'center' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1F2937',
    backgroundColor: 'rgba(15,23,42,0.55)',
    marginBottom: 10,
  },
  name: { color: '#F8FAFC', fontWeight: '900' },
  last: { color: '#94A3B8', marginTop: 6 },
  chev: { color: '#94A3B8', fontSize: 26, paddingLeft: 8 },
  badge: { minWidth: 26, height: 26, borderRadius: 13, backgroundColor: '#F97316', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
  badgeText: { color: '#0B1220', fontWeight: '900' },
  empty: { color: '#64748B', textAlign: 'center', marginTop: 18 },
  error: { color: '#FB7185', textAlign: 'center' },
  retry: { marginTop: 10, alignSelf: 'center', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: '#334155' },
  retryText: { color: '#E2E8F0', fontWeight: '800' },
});
