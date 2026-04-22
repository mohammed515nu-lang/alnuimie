import { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useStore } from '../../store/useStore';
import type { RootStackParamList } from '../../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const user = useStore((s) => s.user);
  const logout = useStore((s) => s.logout);
  const refreshMyProfile = useStore((s) => s.refreshMyProfile);
  const refreshWalletSummary = useStore((s) => s.refreshWalletSummary);
  const walletSummary = useStore((s) => s.walletSummary);

  useEffect(() => {
    (async () => {
      try {
        await refreshMyProfile();
      } catch {
        // ignore
      }
      try {
        await refreshWalletSummary();
      } catch {
        // ignore
      }
    })();
  }, [refreshMyProfile, refreshWalletSummary]);

  return (
    <ScrollView contentContainerStyle={styles.root}>
      <View style={styles.header}>
        <View>
          <Text style={styles.hi}>مرحباً</Text>
          <Text style={styles.name}>{user?.name ?? ''}</Text>
          <Text style={styles.role}>{user?.role === 'contractor' ? 'مقاول' : user?.role === 'client' ? 'عميل' : user?.role}</Text>
        </View>
        <Pressable onPress={() => logout()} style={styles.logout}>
          <Text style={styles.logoutText}>خروج</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>ملخص المحفظة (من الخادم)</Text>
        <Text style={styles.metric}>وارد مكتمل: {walletSummary?.incoming?.toFixed?.(2) ?? '—'}</Text>
        <Text style={styles.metric}>صادر مكتمل: {walletSummary?.outgoing?.toFixed?.(2) ?? '—'}</Text>
        <Text style={styles.metric}>الصافي: {walletSummary?.net?.toFixed?.(2) ?? '—'}</Text>

        <Pressable onPress={() => navigation.navigate('Transfers')} style={styles.btn}>
          <Text style={styles.btnText}>عرض التحويلات</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate('ManageCards')} style={styles.btnSecondary}>
          <Text style={styles.btnSecondaryText}>إدارة البطاقات</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>اجتماعي</Text>
        <Pressable onPress={() => navigation.navigate('EditProfile')} style={styles.btn}>
          <Text style={styles.btnText}>تعديل ملفي العام</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate('PortfolioManage')} style={styles.btnSecondary}>
          <Text style={styles.btnSecondaryText}>إدارة معرض الأعمال</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate('ConnectionRequests')} style={styles.btnSecondary}>
          <Text style={styles.btnSecondaryText}>طلبات التواصل</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>مدفوعات Stripe</Text>
        {user?.role === 'client' ? (
          <Pressable onPress={() => navigation.navigate('PayContractor')} style={styles.btn}>
            <Text style={styles.btnText}>دفع للمقاول</Text>
          </Pressable>
        ) : null}
        {user?.role === 'contractor' ? (
          <Pressable onPress={() => navigation.navigate('ContractorPaySupplier')} style={styles.btn}>
            <Text style={styles.btnText}>دفع للمورد</Text>
          </Pressable>
        ) : null}
        <Pressable onPress={() => navigation.navigate('AddCard')} style={styles.btnSecondary}>
          <Text style={styles.btnSecondaryText}>إضافة بطاقة (SetupIntent)</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { padding: 16, paddingBottom: 28, backgroundColor: '#0B1220' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  hi: { color: '#94A3B8' },
  name: { color: '#F8FAFC', fontSize: 22, fontWeight: '900' },
  role: { color: '#38BDF8', marginTop: 4, fontWeight: '700' },
  logout: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: '#334155' },
  logoutText: { color: '#E2E8F0', fontWeight: '800' },
  card: {
    backgroundColor: 'rgba(15,23,42,0.72)',
    borderColor: '#1F2937',
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  cardTitle: { color: '#F8FAFC', fontSize: 16, fontWeight: '900', marginBottom: 10 },
  metric: { color: '#E2E8F0', marginBottom: 6 },
  btn: { backgroundColor: '#38BDF8', borderRadius: 12, paddingVertical: 12, marginTop: 8 },
  btnText: { color: '#0B1220', textAlign: 'center', fontWeight: '900' },
  btnSecondary: { borderRadius: 12, paddingVertical: 12, marginTop: 10, borderWidth: 1, borderColor: '#334155' },
  btnSecondaryText: { color: '#E2E8F0', textAlign: 'center', fontWeight: '800' },
});
