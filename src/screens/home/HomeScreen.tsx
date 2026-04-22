import { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { WalletCard } from '../../components/wallet/WalletCard';
import { useStore } from '../../store/useStore';
import type { RootStackParamList } from '../../navigation/types';
import { colors, pressableRipple, radius, space, touch } from '../../theme';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const user = useStore((s) => s.user);
  const logout = useStore((s) => s.logout);
  const refreshMyProfile = useStore((s) => s.refreshMyProfile);

  useEffect(() => {
    void (async () => {
      try {
        await refreshMyProfile();
      } catch {
        // ignore
      }
    })();
  }, [refreshMyProfile]);

  return (
    <ScrollView contentContainerStyle={styles.root} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <View>
          <Text style={styles.hi}>مرحباً</Text>
          <Text style={styles.name}>{user?.name ?? ''}</Text>
          <Text style={styles.role}>{user?.role === 'contractor' ? 'مقاول' : user?.role === 'client' ? 'عميل' : user?.role}</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="تسجيل الخروج"
          onPress={() => logout()}
          {...pressableRipple(colors.primaryTint12)}
          style={styles.logout}
        >
          <Text style={styles.logoutText}>خروج</Text>
        </Pressable>
      </View>

      <WalletCard subtitle="الملخص والبطاقات من الخادم؛ يُحدَّث عند فتح الشاشة." />

      <View style={styles.card}>
        <Text style={styles.cardTitle}>اجتماعي</Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.navigate('EditProfile')}
          {...pressableRipple(colors.primaryTint18)}
          style={styles.btn}
        >
          <Text style={styles.btnText}>تعديل ملفي العام</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.navigate('PortfolioManage')}
          {...pressableRipple(colors.primaryTint12)}
          style={styles.btnSecondary}
        >
          <Text style={styles.btnSecondaryText}>إدارة معرض الأعمال</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.navigate('ConnectionRequests')}
          {...pressableRipple(colors.primaryTint12)}
          style={styles.btnSecondary}
        >
          <Text style={styles.btnSecondaryText}>طلبات التواصل</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>مدفوعات Stripe</Text>
        {user?.role === 'client' ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => navigation.navigate('PayContractor')}
            {...pressableRipple(colors.primaryTint18)}
            style={styles.btn}
          >
            <Text style={styles.btnText}>دفع للمقاول</Text>
          </Pressable>
        ) : null}
        {user?.role === 'contractor' ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => navigation.navigate('ContractorPaySupplier')}
            {...pressableRipple(colors.primaryTint18)}
            style={styles.btn}
          >
            <Text style={styles.btnText}>دفع للمورد</Text>
          </Pressable>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { padding: space.lg, paddingBottom: space.xxl + 4, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: space.md },
  hi: { color: colors.textMuted },
  name: { color: colors.text, fontSize: 22, fontWeight: '900' },
  role: { color: colors.primary, marginTop: space.xs, fontWeight: '700' },
  logout: {
    paddingHorizontal: space.md,
    paddingVertical: space.sm + 2,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    minHeight: touch.minHeight,
    justifyContent: 'center',
  },
  logoutText: { color: colors.textSecondary, fontWeight: '800' },
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.xl,
    padding: space.md - 2,
    marginBottom: space.md,
  },
  cardTitle: { color: colors.text, fontSize: 16, fontWeight: '900', marginBottom: space.sm + 2 },
  btn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: space.md,
    marginTop: space.sm,
    minHeight: touch.minHeight,
    justifyContent: 'center',
  },
  btnText: { color: colors.onPrimary, textAlign: 'center', fontWeight: '900' },
  btnSecondary: {
    borderRadius: radius.md,
    paddingVertical: space.md,
    marginTop: space.sm + 2,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    minHeight: touch.minHeight,
    justifyContent: 'center',
  },
  btnSecondaryText: { color: colors.textSecondary, textAlign: 'center', fontWeight: '800' },
});
