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
import { colors, pressableRipple, radius, space, touch } from '../../theme';

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
      accessibilityRole="button"
      style={styles.row}
      onPress={() => navigation.navigate('ChatRoom', { conversationId: item.id, title: item.otherUserName })}
      {...pressableRipple(colors.primaryTint12)}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.otherUserName}</Text>
        <Text style={styles.last} numberOfLines={1}>
          {item.lastMessage ?? '—'}
        </Text>
      </View>
      {item.unread > 0 ? (
        <View style={styles.badge} accessibilityLabel={`${item.unread} غير مقروء`}>
          <Text style={styles.badgeText}>{item.unread > 99 ? '99+' : item.unread}</Text>
        </View>
      ) : (
        <Text style={styles.chev}>›</Text>
      )}
    </Pressable>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <FlatList
      data={threads}
      keyExtractor={(x) => x.id}
      renderItem={renderItem}
      keyboardShouldPersistTaps="handled"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      contentContainerStyle={styles.listContent}
      ListHeaderComponent={
        error ? (
          <View style={styles.errWrap}>
            <Text style={styles.error}>{error}</Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => void onRefresh()}
              {...pressableRipple(colors.primaryTint12)}
              style={styles.retry}
            >
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
  center: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
  listContent: { padding: space.lg, paddingBottom: space.xxl + 6, backgroundColor: colors.background, flexGrow: 1 },
  errWrap: { marginBottom: space.sm + 2 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: space.md,
    paddingHorizontal: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardSoft,
    marginBottom: space.sm + 2,
    minHeight: touch.minHeight + 4,
  },
  name: { color: colors.text, fontWeight: '900' },
  last: { color: colors.textMuted, marginTop: space.sm - 2 },
  chev: { color: colors.textMuted, fontSize: 26, paddingLeft: space.sm },
  badge: {
    minWidth: 28,
    minHeight: 28,
    borderRadius: 14,
    backgroundColor: colors.notification,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.sm,
  },
  badgeText: { color: colors.onPrimary, fontWeight: '900', fontSize: 12 },
  empty: { color: colors.placeholder, textAlign: 'center', marginTop: space.lg + 2 },
  error: { color: colors.error, textAlign: 'center' },
  retry: {
    marginTop: space.sm + 2,
    alignSelf: 'center',
    paddingHorizontal: space.md - 2,
    paddingVertical: space.sm + 2,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    minHeight: touch.minHeight - 4,
    justifyContent: 'center',
  },
  retryText: { color: colors.textSecondary, fontWeight: '800' },
});
