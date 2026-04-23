import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { pushStackRoute } from '../../navigation/href';
import { useStore } from '../../store/useStore';
import { getApiErrorMessage } from '../../api/http';
import type { Connection } from '../../api/types';
import { useAppTheme, pressableRipple, radius, space, touch } from '../../theme';
import type { AppPalette } from '../../theme/palettes';

function statusAr(s: string) {
  switch (s) {
    case 'pending':
      return 'قيد الانتظار';
    case 'accepted':
      return 'مقبول';
    case 'rejected':
      return 'مرفوض';
    default:
      return s;
  }
}

export function ConnectionRequestsScreen() {
  const me = useStore((s) => s.user);
  const refreshConnections = useStore((s) => s.refreshConnections);
  const acceptConnection = useStore((s) => s.acceptConnection);
  const rejectConnection = useStore((s) => s.rejectConnection);
  const cancelConnection = useStore((s) => s.cancelConnection);
  const ensureChatThread = useStore((s) => s.ensureChatThread);
  const connections = useStore((s) => s.connections);
  const { colors } = useAppTheme();
  const styles = useMemo(() => createConnectionRequestsStyles(colors), [colors]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    await refreshConnections();
  }, [refreshConnections]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        await load();
      } catch (e) {
        Alert.alert('تعذر التحميل', getApiErrorMessage(e));
      } finally {
        setLoading(false);
      }
    })();
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await load();
    } catch (e) {
      Alert.alert('تعذر التحديث', getApiErrorMessage(e));
    } finally {
      setRefreshing(false);
    }
  };

  const otherName = (c: Connection) => (c.fromUserId === me?._id ? c.toUserName : c.fromUserName);
  const otherId = (c: Connection) => (c.fromUserId === me?._id ? c.toUserId : c.fromUserId);
  const isIncomingPending = (c: Connection) => c.status === 'pending' && c.toUserId === me?._id;

  const sorted = useMemo(() => {
    return [...connections].sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  }, [connections]);

  const renderItem = useCallback(
    ({ item }: { item: Connection }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{otherName(item)}</Text>
      <Text style={styles.meta}>الحالة: {statusAr(String(item.status))}</Text>
      {item.message ? <Text style={styles.msg}>الرسالة: {item.message}</Text> : null}

      <View style={{ flexDirection: 'row', gap: space.sm + 2, marginTop: space.sm + 2, flexWrap: 'wrap' }}>
        {isIncomingPending(item) ? (
          <>
            <Pressable
              accessibilityRole="button"
              onPress={async () => {
                try {
                  await acceptConnection(item.id);
                } catch (e) {
                  Alert.alert('تعذر القبول', getApiErrorMessage(e));
                }
              }}
              {...pressableRipple(colors.primaryTint18)}
              style={styles.primary}
            >
              <Text style={styles.primaryText}>قبول</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={async () => {
                try {
                  await rejectConnection(item.id);
                } catch (e) {
                  Alert.alert('تعذر الرفض', getApiErrorMessage(e));
                }
              }}
              {...pressableRipple('rgba(248,113,113,0.2)')}
              style={styles.danger}
            >
              <Text style={styles.dangerText}>رفض</Text>
            </Pressable>
          </>
        ) : null}

        {item.status === 'pending' && item.fromUserId === me?._id ? (
          <Pressable
            accessibilityRole="button"
            onPress={async () => {
              try {
                await cancelConnection(item.id);
              } catch (e) {
                Alert.alert('تعذر الإلغاء', getApiErrorMessage(e));
              }
            }}
            {...pressableRipple(colors.primaryTint12)}
            style={styles.secondary}
          >
            <Text style={styles.secondaryText}>إلغاء الطلب</Text>
          </Pressable>
        ) : null}

        {item.status === 'accepted' ? (
          <Pressable
            accessibilityRole="button"
            onPress={async () => {
              try {
                const thread = await ensureChatThread(otherId(item));
                pushStackRoute('ChatRoom', { conversationId: thread.id, title: otherName(item) });
              } catch (e) {
                Alert.alert('تعذر فتح المحادثة', getApiErrorMessage(e));
              }
            }}
            {...pressableRipple(colors.primaryTint18)}
            style={styles.primary}
          >
            <Text style={styles.primaryText}>فتح محادثة</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
    ),
    [colors, styles, me?._id, acceptConnection, rejectConnection, cancelConnection, ensureChatThread]
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
      data={sorted}
      keyExtractor={(x) => x.id}
      renderItem={renderItem}
      keyboardShouldPersistTaps="handled"
      contentInsetAdjustmentBehavior="automatic"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      contentContainerStyle={styles.listContent}
      ListEmptyComponent={<Text style={styles.empty}>لا طلبات</Text>}
    />
  );
}

function createConnectionRequestsStyles(colors: AppPalette) {
  return StyleSheet.create({
  center: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
  listContent: { padding: space.lg, paddingBottom: space.xxl + 6, backgroundColor: colors.background, flexGrow: 1 },
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.xl,
    padding: space.md,
    marginBottom: space.sm + 2,
  },
  title: { color: colors.text, fontWeight: '900', fontSize: 16 },
  meta: { color: colors.textMuted, marginTop: space.sm - 2, fontWeight: '700' },
  msg: { color: colors.textSecondary, marginTop: space.sm },
  primary: {
    paddingHorizontal: space.md,
    paddingVertical: space.sm + 2,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    minHeight: touch.minHeight - 4,
    justifyContent: 'center',
  },
  primaryText: { color: colors.onPrimary, fontWeight: '900' },
  secondary: {
    paddingHorizontal: space.md,
    paddingVertical: space.sm + 2,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    minHeight: touch.minHeight - 4,
    justifyContent: 'center',
  },
  secondaryText: { color: colors.textSecondary, fontWeight: '800' },
  danger: {
    paddingHorizontal: space.md,
    paddingVertical: space.sm + 2,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.dangerBorder,
    backgroundColor: colors.dangerBg,
    minHeight: touch.minHeight - 4,
    justifyContent: 'center',
  },
  dangerText: { color: colors.dangerText, fontWeight: '900' },
  empty: { color: colors.placeholder, textAlign: 'center', marginTop: space.lg + 2 },
});
}
