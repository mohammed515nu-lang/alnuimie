import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { TopBar } from '../../components/TopBar';
import { DASHBOARD_TAB_BAR_SCROLL_BASE } from '../../constants/dashboardTabBar';
import { adminAPI, type AdminUserRow } from '../../api/services/admin';
import { getApiErrorMessage } from '../../api/http';
import { useStore } from '../../store/useStore';
import { space, useAppTheme } from '../../theme';
import { DASHBOARD_RADIUS, getDashboardPalette } from '../../theme/dashboardLight';

export function AdminUsersScreen() {
  const user = useStore((s) => s.user);
  const { resolved } = useAppTheme();
  const dash = useMemo(() => getDashboardPalette(resolved), [resolved]);
  const styles = useMemo(() => createStyles(dash), [dash]);
  const insets = useSafeAreaInsets();
  const tabPad = DASHBOARD_TAB_BAR_SCROLL_BASE + insets.bottom + space.lg;

  const [q, setQ] = useState('');
  const [debounced, setDebounced] = useState('');
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<AdminUserRow[]>([]);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(q.trim()), 400);
    return () => clearTimeout(t);
  }, [q]);

  const load = useCallback(async () => {
    if (user?.role !== 'admin') return;
    setLoading(true);
    try {
      const data = await adminAPI.listUsers({ q: debounced || undefined, limit: 50 });
      setItems(data.users);
    } catch (e) {
      Alert.alert('خطأ', getApiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [debounced, user?.role]);

  useEffect(() => {
    void load();
  }, [load]);

  const onUserActions = (u: AdminUserRow) => {
    Alert.alert(u.name, u.email, [
      {
        text: 'تعليق الحساب',
        style: 'destructive',
        onPress: () =>
          void adminAPI
            .patchUser(u.id, { accountStatus: 'suspended', suspendedReason: 'تعليق إداري' })
            .then(() => load())
            .catch((e) => Alert.alert('خطأ', getApiErrorMessage(e))),
      },
      {
        text: 'تفعيل',
        onPress: () =>
          void adminAPI
            .patchUser(u.id, { accountStatus: 'active', suspendedReason: '' })
            .then(() => load())
            .catch((e) => Alert.alert('خطأ', getApiErrorMessage(e))),
      },
      {
        text: 'انتظار موافقة',
        onPress: () =>
          void adminAPI
            .patchUser(u.id, { accountStatus: 'pending' })
            .then(() => load())
            .catch((e) => Alert.alert('خطأ', getApiErrorMessage(e))),
      },
      {
        text: 'تغيير الدور',
        onPress: () => {
          Alert.alert('الدور الجديد', undefined, [
            { text: 'إلغاء', style: 'cancel' },
            {
              text: 'عميل',
              onPress: () =>
                void adminAPI
                  .patchUser(u.id, { role: 'client' })
                  .then(() => load())
                  .catch((e) => Alert.alert('خطأ', getApiErrorMessage(e))),
            },
            {
              text: 'مقاول',
              onPress: () =>
                void adminAPI
                  .patchUser(u.id, { role: 'contractor' })
                  .then(() => load())
                  .catch((e) => Alert.alert('خطأ', getApiErrorMessage(e))),
            },
            {
              text: 'مدير',
              onPress: () =>
                void adminAPI
                  .patchUser(u.id, { role: 'admin' })
                  .then(() => load())
                  .catch((e) => Alert.alert('خطأ', getApiErrorMessage(e))),
            },
          ]);
        },
      },
      {
        text: u.walletFrozen ? 'إلغاء تجميد المحفظة' : 'تجميد المحفظة',
        onPress: () =>
          void adminAPI
            .patchUser(u.id, { walletFrozen: !u.walletFrozen })
            .then(() => load())
            .catch((e) => Alert.alert('خطأ', getApiErrorMessage(e))),
      },
      {
        text: 'إعادة تعيين كلمة المرور',
        onPress: () =>
          void adminAPI
            .resetUserPassword(u.id)
            .then((res) => {
              Alert.alert('كلمة مرور مؤقتة', `احفظها وأرسلها للمستخدم عبر قناة آمنة:\n\n${res.temporaryPassword}`);
              void load();
            })
            .catch((e) => Alert.alert('خطأ', getApiErrorMessage(e))),
      },
      { text: 'إغلاق', style: 'cancel' },
    ]);
  };

  if (user?.role !== 'admin') {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <TopBar tone="beige" title="المستخدمون" />
        <Text style={styles.denied}>غير مصرّح.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <TopBar tone="beige" title="المستخدمون" />
      <View style={styles.searchWrap}>
        <TextInput
          placeholder="بحث بالاسم أو البريد"
          placeholderTextColor={dash.muted}
          style={styles.search}
          value={q}
          onChangeText={setQ}
          textAlign="right"
        />
      </View>
      {loading ? (
        <ActivityIndicator style={{ marginTop: 24 }} color={dash.gold} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: tabPad }}
          refreshing={loading}
          onRefresh={() => void load()}
          renderItem={({ item }) => (
            <Pressable style={styles.row} onPress={() => onUserActions(item)}>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.email}>{item.email}</Text>
                <Text style={styles.meta}>
                  {item.role} · {item.accountStatus}
                  {item.walletFrozen ? ' · محفظة مجمّدة' : ''}
                </Text>
              </View>
              <Text style={styles.chev}>›</Text>
            </Pressable>
          )}
          ListEmptyComponent={<Text style={styles.empty}>لا مستخدمين مطابقين.</Text>}
        />
      )}
    </SafeAreaView>
  );
}

function createStyles(dash: ReturnType<typeof getDashboardPalette>) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: dash.pageBg },
    denied: { padding: 24, textAlign: 'center', color: dash.muted },
    searchWrap: { paddingHorizontal: 16, paddingBottom: 8 },
    search: {
      backgroundColor: dash.white,
      borderRadius: DASHBOARD_RADIUS,
      borderWidth: 1,
      borderColor: dash.border,
      paddingHorizontal: 14,
      paddingVertical: 10,
      color: dash.darkText,
      fontSize: 15,
    },
    row: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 4,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: dash.border,
    },
    name: { fontSize: 16, fontWeight: '800', color: dash.darkText, textAlign: 'right' },
    email: { fontSize: 13, color: dash.muted, textAlign: 'right', marginTop: 2 },
    meta: { fontSize: 11, color: dash.muted, textAlign: 'right', marginTop: 4 },
    chev: { fontSize: 22, color: dash.muted },
    empty: { textAlign: 'center', color: dash.muted, marginTop: 40 },
  });
}
