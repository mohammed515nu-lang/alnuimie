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
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useStore } from '../../store/useStore';
import { getApiErrorMessage } from '../../api/http';
import type { Connection } from '../../api/types';
import type { RootStackParamList } from '../../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function ConnectionRequestsScreen() {
  const navigation = useNavigation<Nav>();
  const me = useStore((s) => s.user);
  const refreshConnections = useStore((s) => s.refreshConnections);
  const acceptConnection = useStore((s) => s.acceptConnection);
  const rejectConnection = useStore((s) => s.rejectConnection);
  const cancelConnection = useStore((s) => s.cancelConnection);
  const ensureChatThread = useStore((s) => s.ensureChatThread);
  const connections = useStore((s) => s.connections);

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

  const renderItem = ({ item }: { item: Connection }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{otherName(item)}</Text>
      <Text style={styles.meta}>الحالة: {item.status}</Text>
      {item.message ? <Text style={styles.msg}>الرسالة: {item.message}</Text> : null}

      <View style={{ flexDirection: 'row', gap: 10, marginTop: 10, flexWrap: 'wrap' }}>
        {isIncomingPending(item) ? (
          <>
            <Pressable
              onPress={async () => {
                try {
                  await acceptConnection(item.id);
                } catch (e) {
                  Alert.alert('تعذر القبول', getApiErrorMessage(e));
                }
              }}
              style={styles.primary}
            >
              <Text style={styles.primaryText}>قبول</Text>
            </Pressable>
            <Pressable
              onPress={async () => {
                try {
                  await rejectConnection(item.id);
                } catch (e) {
                  Alert.alert('تعذر الرفض', getApiErrorMessage(e));
                }
              }}
              style={styles.danger}
            >
              <Text style={styles.dangerText}>رفض</Text>
            </Pressable>
          </>
        ) : null}

        {item.status === 'pending' && item.fromUserId === me?._id ? (
          <Pressable
            onPress={async () => {
              try {
                await cancelConnection(item.id);
              } catch (e) {
                Alert.alert('تعذر الإلغاء', getApiErrorMessage(e));
              }
            }}
            style={styles.secondary}
          >
            <Text style={styles.secondaryText}>إلغاء الطلب</Text>
          </Pressable>
        ) : null}

        {item.status === 'accepted' ? (
          <Pressable
            onPress={async () => {
              try {
                const thread = await ensureChatThread(otherId(item));
                navigation.navigate('ChatRoom', { conversationId: thread.id, title: otherName(item) });
              } catch (e) {
                Alert.alert('تعذر فتح المحادثة', getApiErrorMessage(e));
              }
            }}
            style={styles.primary}
          >
            <Text style={styles.primaryText}>فتح محادثة</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
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
      data={sorted}
      keyExtractor={(x) => x.id}
      renderItem={renderItem}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      contentContainerStyle={{ padding: 16, paddingBottom: 30, backgroundColor: '#0B1220' }}
      ListEmptyComponent={<Text style={styles.empty}>لا طلبات</Text>}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, backgroundColor: '#0B1220', alignItems: 'center', justifyContent: 'center' },
  card: {
    backgroundColor: 'rgba(15,23,42,0.72)',
    borderColor: '#1F2937',
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
  },
  title: { color: '#F8FAFC', fontWeight: '900', fontSize: 16 },
  meta: { color: '#94A3B8', marginTop: 6, fontWeight: '700' },
  msg: { color: '#E2E8F0', marginTop: 8 },
  primary: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, backgroundColor: '#38BDF8' },
  primaryText: { color: '#0B1220', fontWeight: '900' },
  secondary: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: '#334155' },
  secondaryText: { color: '#E2E8F0', fontWeight: '800' },
  danger: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: '#7F1D1D', backgroundColor: 'rgba(127,29,29,0.15)' },
  dangerText: { color: '#FCA5A5', fontWeight: '900' },
  empty: { color: '#64748B', textAlign: 'center', marginTop: 18 },
});
