import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { ApiStateView } from '../../components/ApiStateView';
import { TopBar } from '../../components/TopBar';
import { pushStackRoute } from '../../navigation/href';
import { useStore } from '../../store/useStore';
import { getApiErrorMessage } from '../../api/http';
import type { Connection } from '../../api/types';
import { pressableRipple, space, touch, useAppTheme } from '../../theme';
import { DASHBOARD_RADIUS, getDashboardPalette, type DashboardPalette } from '../../theme/dashboardLight';

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
  const acceptConnection = useStore((s) => s.acceptConnection);
  const rejectConnection = useStore((s) => s.rejectConnection);
  const cancelConnection = useStore((s) => s.cancelConnection);
  const ensureChatThread = useStore((s) => s.ensureChatThread);
  const connections = useStore((s) => s.connections);
  const insets = useSafeAreaInsets();
  const { resolved } = useAppTheme();
  const dash = useMemo(() => getDashboardPalette(resolved), [resolved]);
  const styles = useMemo(() => createStyles(dash), [dash]);
  const apiTone = resolved === 'light' ? 'beige' : 'default';

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    await useStore.getState().refreshConnections();
  }, []);

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

        <View style={styles.actionsRow}>
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
                {...pressableRipple(dash.goldTint)}
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
                {...pressableRipple('rgba(185, 28, 28, 0.1)')}
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
              {...pressableRipple(dash.navyTint)}
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
                  const targetUserId = String(otherId(item) ?? '').trim();
                  if (!targetUserId) {
                    Alert.alert('تعذر فتح المحادثة', 'معرّف المستخدم غير صالح');
                    return;
                  }
                  const thread = await ensureChatThread(targetUserId);
                  const cid = String(thread.id ?? '').trim();
                  if (!cid) {
                    Alert.alert('تعذر فتح المحادثة', 'لم يُرجع الخادم معرف محادثة صالحاً.');
                    return;
                  }
                  pushStackRoute('ChatRoom', { conversationId: cid, title: otherName(item) });
                } catch (e) {
                  Alert.alert('تعذر فتح المحادثة', getApiErrorMessage(e));
                }
              }}
              {...pressableRipple(dash.goldTint)}
              style={styles.primary}
            >
              <Text style={styles.primaryText}>فتح محادثة</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    ),
    [styles, dash, me?._id, acceptConnection, rejectConnection, cancelConnection, ensureChatThread]
  );

  const bottomPad = space.xxl + 6 + insets.bottom;

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <TopBar tone="beige" title="طلبات التواصل" />
        <View style={styles.center}>
          <ApiStateView tone={apiTone} mode="loading" title="جاري تحميل طلبات التواصل..." />
        </View>
      </SafeAreaView>
    );
  }

  if (error && sorted.length === 0) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <TopBar tone="beige" title="طلبات التواصل" />
        <View style={styles.center}>
          <ApiStateView
            tone={apiTone}
            mode="error"
            title="تعذر تحميل طلبات التواصل"
            subtitle={error}
            onRetry={() => void onRefresh()}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <TopBar tone="beige" title="طلبات التواصل" />
      <FlatList
        style={styles.list}
        data={sorted}
        keyExtractor={(x) => x.id}
        renderItem={renderItem}
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={dash.gold} />}
        contentContainerStyle={[styles.listContent, { paddingBottom: bottomPad }]}
        ListHeaderComponent={
          error ? (
            <View style={styles.bannerErr}>
              <ApiStateView
                tone={apiTone}
                mode="error"
                title="حدث خطأ أثناء التحديث"
                subtitle={error}
                onRetry={() => void onRefresh()}
              />
            </View>
          ) : null
        }
        ListEmptyComponent={<ApiStateView tone={apiTone} mode="empty" title="لا طلبات" />}
      />
    </SafeAreaView>
  );
}

function createStyles(dash: DashboardPalette) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: dash.pageBg },
    list: { flex: 1 },
    center: { flex: 1, paddingHorizontal: 16, paddingTop: 24, alignItems: 'stretch', justifyContent: 'center' },
    listContent: { paddingHorizontal: 16, paddingTop: 4, flexGrow: 1 },
    bannerErr: { marginBottom: space.sm },
    card: {
      backgroundColor: dash.white,
      borderColor: dash.border,
      borderWidth: 1,
      borderRadius: DASHBOARD_RADIUS,
      padding: space.md,
      marginBottom: space.sm + 2,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
    },
    title: { color: dash.navy, fontWeight: '900', fontSize: 16, textAlign: 'right' },
    meta: { color: dash.muted, marginTop: space.sm - 2, fontWeight: '700', textAlign: 'right' },
    msg: { color: dash.darkText, marginTop: space.sm, textAlign: 'right', lineHeight: 20 },
    actionsRow: {
      flexDirection: 'row-reverse',
      gap: space.sm + 2,
      marginTop: space.sm + 2,
      flexWrap: 'wrap',
    },
    primary: {
      paddingHorizontal: space.md,
      paddingVertical: space.sm + 2,
      borderRadius: DASHBOARD_RADIUS,
      backgroundColor: dash.gold,
      minHeight: touch.minHeight - 4,
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: dash.gold,
    },
    primaryText: { color: dash.onGold, fontWeight: '900', textAlign: 'center' },
    secondary: {
      paddingHorizontal: space.md,
      paddingVertical: space.sm + 2,
      borderRadius: DASHBOARD_RADIUS,
      borderWidth: 1,
      borderColor: dash.border,
      minHeight: touch.minHeight - 4,
      justifyContent: 'center',
      backgroundColor: dash.white,
    },
    secondaryText: { color: dash.darkText, fontWeight: '800', textAlign: 'center' },
    danger: {
      paddingHorizontal: space.md,
      paddingVertical: space.sm + 2,
      borderRadius: DASHBOARD_RADIUS,
      borderWidth: 1,
      borderColor: dash.danger,
      backgroundColor: 'rgba(185, 28, 28, 0.08)',
      minHeight: touch.minHeight - 4,
      justifyContent: 'center',
    },
    dangerText: { color: dash.danger, fontWeight: '900', textAlign: 'center' },
  });
}
