import { useCallback, useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { getApiErrorMessage } from '../../api/http';
import { DASHBOARD_TAB_BAR_SCROLL_BASE } from '../../constants/dashboardTabBar';
import { navigateFromRoot } from '../../navigation/rootNavigation';
import type { RootStackParamList } from '../../navigation/types';
import { useStore } from '../../store/useStore';
import { pressableRipple, space, touch, useAppTheme } from '../../theme';
import { DASHBOARD_RADIUS as RADIUS, getDashboardPalette, type DashboardPalette } from '../../theme/dashboardLight';

type AccTile = {
  title: string;
  sub: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: keyof RootStackParamList;
  iconBg: string;
  iconColor: string;
};

function tilesForRole(role: string | undefined, palette: DashboardPalette): AccTile[] {
  if (role === 'client') {
    return [
      {
        title: 'دفع لمقاول',
        sub: 'بعد قبول التواصل',
        icon: 'cash-outline',
        route: 'PayContractor',
        iconBg: 'rgba(166, 124, 82, 0.2)',
        iconColor: palette.navy,
      },
      {
        title: 'المحفظة',
        sub: 'البطاقات والمدفوعات',
        icon: 'wallet-outline',
        route: 'WalletHome',
        iconBg: 'rgba(37, 99, 235, 0.12)',
        iconColor: '#1d4ed8',
      },
      {
        title: 'التحويلات',
        sub: 'سجل الحركة',
        icon: 'swap-horizontal',
        route: 'Transfers',
        iconBg: 'rgba(26, 43, 68, 0.1)',
        iconColor: palette.navy,
      },
      {
        title: 'الإيرادات',
        sub: 'المبالغ المستلمة',
        icon: 'trending-up-outline',
        route: 'Revenues',
        iconBg: 'rgba(21, 128, 61, 0.12)',
        iconColor: '#15803d',
      },
      {
        title: 'التقارير',
        sub: 'ملخص مالي',
        icon: 'bar-chart-outline',
        route: 'ReportsAccounting',
        iconBg: 'rgba(166, 124, 82, 0.15)',
        iconColor: palette.gold,
      },
    ];
  }
  return [
    {
      title: 'المصروفات',
      sub: 'فئات وتصنيف',
      icon: 'pricetags-outline',
      route: 'ExpenseCategories',
      iconBg: 'rgba(124, 58, 237, 0.14)',
      iconColor: '#6d28d9',
    },
    {
      title: 'الإيرادات',
      sub: 'تسجيل الدخل',
      icon: 'trending-up-outline',
      route: 'Revenues',
      iconBg: 'rgba(21, 128, 61, 0.12)',
      iconColor: '#15803d',
    },
    {
      title: 'الفواتير',
      sub: 'إصدار ومتابعة',
      icon: 'document-text-outline',
      route: 'Invoices',
      iconBg: 'rgba(166, 124, 82, 0.22)',
      iconColor: palette.navy,
    },
    {
      title: 'المحفظة',
      sub: 'Stripe والتحويلات',
      icon: 'wallet-outline',
      route: 'WalletHome',
      iconBg: 'rgba(37, 99, 235, 0.12)',
      iconColor: '#1d4ed8',
    },
    {
      title: 'دفع الموردين',
      sub: 'للموردين المتصلين',
      icon: 'construct-outline',
      route: 'ContractorPaySupplier',
      iconBg: 'rgba(14, 116, 144, 0.12)',
      iconColor: '#0e7490',
    },
    {
      title: 'التقارير',
      sub: 'حركة شهرية',
      icon: 'bar-chart-outline',
      route: 'ReportsAccounting',
      iconBg: 'rgba(166, 124, 82, 0.15)',
      iconColor: palette.gold,
    },
  ];
}

function formatMoney(n: number | null | undefined): string {
  if (n == null || Number.isNaN(n)) return '—';
  return `${Math.round(n).toLocaleString('ar-SY')} ل.س`;
}

export function AccountingHomeScreen() {
  const role = useStore((s) => s.user?.role);
  const walletSummary = useStore((s) => s.walletSummary);
  const insets = useSafeAreaInsets();
  const tabPad = DASHBOARD_TAB_BAR_SCROLL_BASE + insets.bottom + space.lg;
  const { resolved } = useAppTheme();
  const palette = useMemo(() => getDashboardPalette(resolved), [resolved]);

  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const tiles = useMemo(() => tilesForRole(role, palette), [role, palette]);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError(null);
      await useStore.getState().refreshWalletSummary();
    } catch (e) {
      setLoadError(getApiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  const menuRows = useMemo(
    () => [
      ...tiles.map((t) => ({
        key: `${t.route}-${t.title}`,
        title: t.title,
        subtitle: t.sub,
        icon: t.icon,
        onPress: () => {
          setMenuOpen(false);
          navigateFromRoot(t.route);
        },
      })),
      {
        key: 'refresh-wallet',
        title: 'تحديث الرصيد',
        subtitle: 'جلب أحدث بيانات المحفظة من الخادم',
        icon: 'refresh-outline' as keyof typeof Ionicons.glyphMap,
        onPress: () => {
          setMenuOpen(false);
          void load();
        },
      },
      {
        key: 'notifications',
        title: 'إعدادات التنبيهات',
        subtitle: 'التحكم في الإشعارات',
        icon: 'notifications-outline' as keyof typeof Ionicons.glyphMap,
        onPress: () => {
          setMenuOpen(false);
          navigateFromRoot('NotificationSettings');
        },
      },
    ],
    [tiles, load]
  );
  const pageTitle = role === 'client' ? 'محاسبة المشروع' : 'المحاسبة';
  const balanceLabel = 'الرصيد الحالي';

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  const netDisplay = formatMoney(walletSummary?.net);
  const updatedHint = loadError ? loadError : loading ? 'جاري التحديث…' : 'يُحدَّث عند فتح الشاشة';

  const styles = useMemo(() => createStyles(palette), [palette]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          style={styles.headerIconBtn}
          accessibilityRole="button"
          accessibilityLabel="قائمة إضافية للمحاسبة"
          onPress={() => setMenuOpen(true)}
          {...pressableRipple('rgba(26, 43, 68, 0.08)')}
        >
          <Ionicons name="menu-outline" size={24} color={palette.navy} />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {pageTitle}
        </Text>
        <Pressable
          style={styles.headerIconBtn}
          accessibilityRole="button"
          accessibilityLabel="تنبيهات"
          onPress={() => navigateFromRoot('NotificationSettings')}
          {...pressableRipple('rgba(26, 43, 68, 0.08)')}
        >
          <Ionicons name="notifications-outline" size={22} color={palette.navy} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: tabPad }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          onPress={() => navigateFromRoot('WalletHome')}
          style={styles.balanceCard}
          accessibilityRole="button"
          accessibilityLabel={`${balanceLabel} ${netDisplay}`}
          {...pressableRipple('rgba(255,255,255,0.12)')}
        >
          <Text style={styles.balanceLabel}>{balanceLabel}</Text>
          <Text style={styles.balanceValue}>{netDisplay}</Text>
          <Text style={styles.balanceHint}>{updatedHint}</Text>
          <View style={styles.balanceCtaRow}>
            <Text style={styles.balanceCta}>عرض المحفظة</Text>
            <Ionicons name="chevron-back" size={18} color={palette.gold} />
          </View>
        </Pressable>

        <Text style={styles.sectionTitle}>العمليات الرئيسية</Text>

        <View style={styles.grid}>
          {tiles.map((t) => (
            <Pressable
              key={t.route + t.title}
              accessibilityRole="button"
              onPress={() => navigateFromRoot(t.route)}
              {...pressableRipple('rgba(26, 43, 68, 0.06)')}
              style={styles.tile}
            >
              <View style={[styles.tileIconWrap, { backgroundColor: t.iconBg }]}>
                <Ionicons name={t.icon} size={24} color={t.iconColor} />
              </View>
              <Text style={styles.tileTitle}>{t.title}</Text>
              <Text style={styles.tileSub}>{t.sub}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <Modal visible={menuOpen} animationType="slide" transparent onRequestClose={() => setMenuOpen(false)}>
        <View style={styles.menuRoot}>
          <Pressable
            style={styles.menuBackdrop}
            accessibilityRole="button"
            accessibilityLabel="إغلاق القائمة"
            onPress={() => setMenuOpen(false)}
          />
          <View style={[styles.menuSheet, { paddingBottom: insets.bottom + 14 }]}>
            <Text style={styles.menuTitle}>قائمة المحاسبة</Text>
            <ScrollView style={styles.menuScroll} showsVerticalScrollIndicator={false}>
              {menuRows.map((row) => (
                <Pressable
                  key={row.key}
                  accessibilityRole="button"
                  onPress={row.onPress}
                  style={styles.menuRow}
                  {...pressableRipple('rgba(26, 43, 68, 0.06)')}
                >
                  <Ionicons name="chevron-back" size={18} color={palette.muted} />
                  <View style={styles.menuRowText}>
                    <Text style={styles.menuRowTitle}>{row.title}</Text>
                    <Text style={styles.menuRowSub}>{row.subtitle}</Text>
                  </View>
                  <View style={[styles.menuIconWrap, { borderColor: palette.border }]}>
                    <Ionicons name={row.icon} size={22} color={palette.navy} />
                  </View>
                </Pressable>
              ))}
            </ScrollView>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="إغلاق القائمة"
              onPress={() => setMenuOpen(false)}
              style={styles.menuCloseBtn}
              {...pressableRipple('rgba(26, 43, 68, 0.08)')}
            >
              <Text style={styles.menuCloseText}>إغلاق</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function createStyles(palette: DashboardPalette) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: palette.pageBg },
    header: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: 12,
    },
    headerTitle: {
      flex: 1,
      textAlign: 'center',
      fontSize: 18,
      fontWeight: '900',
      color: palette.navy,
    },
    headerIconBtn: {
      width: 44,
      height: 44,
      borderRadius: RADIUS,
      backgroundColor: palette.white,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: palette.border,
    },
    scroll: { flex: 1 },
    scrollContent: {
      paddingHorizontal: 16,
      paddingTop: 4,
    },
    balanceCard: {
      backgroundColor: palette.balanceCard,
      borderRadius: RADIUS,
      padding: 18,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.12)',
    },
    balanceLabel: {
      color: palette.balanceMuted,
      fontSize: 13,
      fontWeight: '700',
      textAlign: 'right',
    },
    balanceValue: {
      color: '#ffffff',
      fontSize: 28,
      fontWeight: '900',
      textAlign: 'right',
      marginTop: 6,
      letterSpacing: 0.2,
    },
    balanceHint: {
      color: 'rgba(255,255,255,0.55)',
      fontSize: 11,
      marginTop: 8,
      textAlign: 'right',
    },
    balanceCtaRow: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: 4,
      marginTop: 14,
    },
    balanceCta: {
      color: palette.gold,
      fontWeight: '800',
      fontSize: 14,
    },
    sectionTitle: {
      color: palette.navy,
      fontSize: 16,
      fontWeight: '900',
      textAlign: 'right',
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
      backgroundColor: palette.white,
      borderRadius: RADIUS,
      borderWidth: 1,
      borderColor: palette.border,
      padding: 14,
      minHeight: touch.minHeight + 36,
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
      color: palette.darkText,
      fontWeight: '900',
      fontSize: 15,
      textAlign: 'right',
    },
    tileSub: {
      color: palette.muted,
      fontSize: 12,
      marginTop: 4,
      textAlign: 'right',
      lineHeight: 16,
    },
    menuRoot: { flex: 1, justifyContent: 'flex-end' },
    menuBackdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(15, 23, 42, 0.45)',
    },
    menuSheet: {
      marginHorizontal: 12,
      marginBottom: 8,
      maxHeight: '72%',
      backgroundColor: palette.white,
      borderTopLeftRadius: RADIUS,
      borderTopRightRadius: RADIUS,
      borderWidth: 1,
      borderColor: palette.border,
      paddingTop: 14,
      paddingHorizontal: 12,
      elevation: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
    },
    menuTitle: {
      fontSize: 17,
      fontWeight: '900',
      color: palette.navy,
      textAlign: 'right',
      marginBottom: 10,
    },
    menuScroll: { maxHeight: 420 },
    menuRow: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 8,
      borderRadius: RADIUS,
      marginBottom: 6,
      gap: 10,
    },
    menuRowText: { flex: 1, alignItems: 'flex-end' },
    menuRowTitle: { fontSize: 15, fontWeight: '800', color: palette.darkText, textAlign: 'right' },
    menuRowSub: { fontSize: 12, color: palette.muted, textAlign: 'right', marginTop: 4, lineHeight: 16 },
    menuIconWrap: {
      width: 44,
      height: 44,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      backgroundColor: palette.pageBg,
    },
    menuCloseBtn: {
      marginTop: 8,
      paddingVertical: 12,
      borderRadius: RADIUS,
      backgroundColor: palette.pageBg,
      alignItems: 'center',
    },
    menuCloseText: { fontWeight: '800', color: palette.navy, fontSize: 15 },
  });
}
