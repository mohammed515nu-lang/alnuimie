import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { WalletCard } from '../../components/wallet/WalletCard';
import { TopBar } from '../../components/TopBar';
import { pushStackRoute } from '../../navigation/href';
import type { RootStackParamList } from '../../navigation/types';
import { useStore } from '../../store/useStore';
import { pressableRipple, touch, useAppTheme } from '../../theme';
import { DASHBOARD_RADIUS, getDashboardPalette, type DashboardPalette } from '../../theme/dashboardLight';

type WalletAction = {
  key: string;
  title: string;
  sub: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: keyof RootStackParamList;
  iconBg: string;
  iconColor: string;
};

function actionsForUser(role: string | undefined, dash: DashboardPalette): WalletAction[] {
  const list: WalletAction[] = [
    {
      key: 'cards',
      title: 'إدارة البطاقات',
      sub: 'Stripe والبطاقة الافتراضية',
      icon: 'card-outline',
      route: 'ManageCards',
      iconBg: 'rgba(166, 124, 82, 0.2)',
      iconColor: dash.navy,
    },
  ];
  if (role === 'client') {
    list.push({
      key: 'pay',
      title: 'دفع لمقاول',
      sub: 'بعد قبول التواصل',
      icon: 'cash-outline',
      route: 'PayContractor',
      iconBg: 'rgba(21, 128, 61, 0.12)',
      iconColor: dash.success,
    });
  } else if (role === 'contractor') {
    list.push({
      key: 'supplier',
      title: 'دفع للمورد',
      sub: 'تسجيل دفعة للمورد',
      icon: 'construct-outline',
      route: 'ContractorPaySupplier',
      iconBg: 'rgba(14, 116, 144, 0.12)',
      iconColor: '#0e7490',
    });
  }
  list.push({
    key: 'transfers',
    title: 'التحويلات',
    sub: 'سجل المدفوعات والمقبوضات',
    icon: 'swap-horizontal-outline',
    route: 'Transfers',
    iconBg: 'rgba(26, 43, 68, 0.1)',
    iconColor: dash.navy,
  });
  return list;
}

export function WalletHomeScreen() {
  const user = useStore((s) => s.user);
  const isClient = user?.role === 'client';
  const insets = useSafeAreaInsets();
  const { resolved } = useAppTheme();
  const dash = useMemo(() => getDashboardPalette(resolved), [resolved]);
  const styles = useMemo(() => createStyles(dash), [dash]);
  const actions = useMemo(() => actionsForUser(user?.role, dash), [user?.role, dash]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <TopBar tone="beige" title="المحفظة" />
      <ScrollView
        contentContainerStyle={[styles.root, { paddingBottom: 24 + insets.bottom }]}
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.intro}>
          {isClient
            ? 'من هنا تدير بطاقاتك وتدفع للمقاولين بعد الاتصال.'
            : 'من هنا تدير بطاقاتك وتسجّل دفعات الموردين والمقبوضات.'}
        </Text>
        <WalletCard tone="beige" />

        <Text style={styles.sectionTitle}>إجراءات</Text>
        <View style={styles.grid}>
          {actions.map((a) => (
            <Pressable
              key={a.key}
              accessibilityRole="button"
              accessibilityLabel={a.title}
              onPress={() => pushStackRoute(a.route)}
              {...pressableRipple(dash.navyTint)}
              style={styles.tile}
            >
              <View style={[styles.tileIconWrap, { backgroundColor: a.iconBg }]}>
                <Ionicons name={a.icon} size={24} color={a.iconColor} />
              </View>
              <Text style={styles.tileTitle}>{a.title}</Text>
              <Text style={styles.tileSub}>{a.sub}</Text>
              <View style={styles.tileFooter}>
                <Ionicons name="chevron-back" size={18} color={dash.muted} />
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(dash: DashboardPalette) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: dash.pageBg },
    root: { paddingHorizontal: 16, paddingTop: 4 },
    intro: {
      color: dash.muted,
      fontSize: 14,
      lineHeight: 22,
      textAlign: 'right',
      marginBottom: 12,
      fontWeight: '600',
    },
    sectionTitle: {
      color: dash.navy,
      fontSize: 16,
      fontWeight: '900',
      textAlign: 'right',
      marginTop: 8,
      marginBottom: 12,
    },
    grid: {
      flexDirection: 'row-reverse',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      rowGap: 12,
    },
    tile: {
      width: '48.5%',
      backgroundColor: dash.white,
      borderRadius: DASHBOARD_RADIUS,
      borderWidth: 1,
      borderColor: dash.border,
      padding: 14,
      minHeight: touch.minHeight + 52,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
    },
    tileIconWrap: {
      width: 48,
      height: 48,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'flex-end',
      marginBottom: 10,
    },
    tileTitle: {
      color: dash.darkText,
      fontWeight: '900',
      fontSize: 15,
      textAlign: 'right',
    },
    tileSub: {
      color: dash.muted,
      fontSize: 12,
      marginTop: 4,
      textAlign: 'right',
      lineHeight: 16,
    },
    tileFooter: {
      flexDirection: 'row-reverse',
      justifyContent: 'flex-end',
      marginTop: 10,
    },
  });
}
