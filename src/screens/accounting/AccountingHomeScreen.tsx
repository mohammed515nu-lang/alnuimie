import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { WalletCard } from '../../components/wallet/WalletCard';
import { navigateFromRoot } from '../../navigation/rootNavigation';
import type { RootStackParamList } from '../../navigation/types';
import { useStore } from '../../store/useStore';
import { useAppTheme, pressableRipple, radius, space, touch } from '../../theme';
import type { AppPalette } from '../../theme/palettes';

type AccRow = {
  title: string;
  sub: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: keyof RootStackParamList;
};

function rowsForRole(role: string | undefined): AccRow[] {
  if (role === 'client') {
    return [
      {
        title: 'دفع لمقاول',
        sub: 'دفع لمقاول متصل بعد قبول التواصل',
        icon: 'cash-outline',
        route: 'PayContractor',
      },
      {
        title: 'المحفظة والبطاقات',
        sub: 'Stripe والبطاقات المحفوظة',
        icon: 'wallet-outline',
        route: 'WalletHome',
      },
      {
        title: 'التحويلات',
        sub: 'سجل المدفوعات والمقبوضات',
        icon: 'swap-horizontal',
        route: 'Transfers',
      },
      {
        title: 'الإيرادات والوارد',
        sub: 'متابعة المبالغ المستلمة',
        icon: 'trending-up-outline',
        route: 'Revenues',
      },
      {
        title: 'التقارير',
        sub: 'ملخص مالي لمشاريعك',
        icon: 'bar-chart-outline',
        route: 'ReportsAccounting',
      },
    ];
  }
  /** مقاول (افتراضي) */
  return [
    { title: 'الفواتير', sub: 'إصدار ومتابعة الفواتير', icon: 'document-text-outline', route: 'Invoices' },
    { title: 'الإيرادات', sub: 'تسجيل الدخل والمتابعة', icon: 'trending-up-outline', route: 'Revenues' },
    { title: 'فئات المصروفات', sub: 'تصنيف مصاريف الموقع والمواد', icon: 'pricetags-outline', route: 'ExpenseCategories' },
    { title: 'التقارير', sub: 'حركة شهرية وتقارير محفوظة', icon: 'bar-chart-outline', route: 'ReportsAccounting' },
    {
      title: 'دفع للمورد',
      sub: 'تسجيل دفعات للموردين المتصلين',
      icon: 'construct-outline',
      route: 'ContractorPaySupplier',
    },
    { title: 'المحفظة والبطاقات', sub: 'Stripe والتحويلات', icon: 'wallet-outline', route: 'WalletHome' },
  ];
}

export function AccountingHomeScreen() {
  const role = useStore((s) => s.user?.role);
  const { colors } = useAppTheme();
  const styles = useMemo(() => createAccountingHomeStyles(colors), [colors]);
  const rows = useMemo(() => rowsForRole(role), [role]);
  const walletHint =
    role === 'client'
      ? 'مدفوعاتك وبطاقاتك من الخادم؛ يُحدَّث عند فتح الشاشة.'
      : 'ملخص المحفظة والموردين من الخادم؛ يُحدَّث عند فتح الشاشة.';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
      >
        <Text style={styles.pageTitle}>{role === 'client' ? 'محاسبة المشروع' : 'محاسبة المقاول'}</Text>
        <WalletCard subtitle={walletHint} />

        {rows.map((r) => (
          <Pressable
            key={r.route + r.title}
            accessibilityRole="button"
            onPress={() => navigateFromRoot(r.route)}
            {...pressableRipple(colors.primaryTint12)}
            style={styles.row}
          >
            <View style={styles.iconWrap}>
              <Ionicons name={r.icon} size={22} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>{r.title}</Text>
              <Text style={styles.rowSub}>{r.sub}</Text>
            </View>
            <Ionicons name="chevron-back" size={20} color={colors.textMuted} />
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function createAccountingHomeStyles(colors: AppPalette) {
  return StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: space.lg, paddingBottom: space.xxl + 8 },
  pageTitle: { color: colors.text, fontSize: 22, fontWeight: '900', textAlign: 'right', marginBottom: space.md },
  row: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: colors.surfaceMid,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    padding: space.md,
    marginBottom: space.sm + 2,
    minHeight: touch.minHeight + 8,
    gap: space.md,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primaryTint12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTitle: { color: colors.text, fontWeight: '900', fontSize: 16, textAlign: 'right' },
  rowSub: { color: colors.textMuted, fontSize: 12, marginTop: 2, textAlign: 'right' },
});
}
