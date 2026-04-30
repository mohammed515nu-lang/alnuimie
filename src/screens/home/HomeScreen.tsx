import { useCallback, useEffect, useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';

import { DASHBOARD_TAB_BAR_SCROLL_BASE } from '../../constants/dashboardTabBar';
import { ContractorShowcaseCarousel } from '../../components/home/ContractorShowcaseCarousel';
import { navigateFromRoot } from '../../navigation/rootNavigation';
import type { ReportItem, Transfer } from '../../api/types';
import { useStore } from '../../store/useStore';
import { pressableRipple, space, touch, useAppTheme } from '../../theme';
import { DASHBOARD_RADIUS, getDashboardPalette, type DashboardPalette } from '../../theme/dashboardLight';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

function formatMoneyLira(n: number | null | undefined): string {
  if (n == null || Number.isNaN(n)) return '—';
  return `${Math.round(n).toLocaleString('ar-SY')} ل.س`;
}

function invoiceLineAmount(item: ReportItem): number {
  const a = (item.data as { amount?: number } | undefined)?.amount;
  return typeof a === 'number' && !Number.isNaN(a) ? a : 0;
}

function sumPendingTransferAmount(transfers: Transfer[], userId: string): number {
  return transfers
    .filter(
      (t) =>
        (t.status === 'pending' || t.status === 'processing') &&
        (t.fromUserId === userId || t.toUserId === userId)
    )
    .reduce((s, t) => s + (typeof t.amount === 'number' && !Number.isNaN(t.amount) ? t.amount : 0), 0);
}

/** ألوان لوحة المقاول — عمود الرصيد يستخدم balanceCard وليس لون النص الكحلي */
function contractorDashboardColors(dash: DashboardPalette) {
  return {
    pageBg: dash.pageBg,
    white: dash.white,
    ink: dash.navy,
    financeStripBg: dash.balanceCard,
    gold: dash.gold,
    shortcutBg: dash.statTileBg,
    darkText: dash.darkText,
    muted: dash.muted,
    border: dash.border,
    paidGreen: dash.success,
    onGold: dash.onGold,
  };
}

export function HomeScreen() {
  const router = useRouter();
  const user = useStore((s) => s.user);
  const isContractor = user?.role === 'contractor';
  const myPublicProfile = useStore((s) => s.myPublicProfile);
  const walletSummary = useStore((s) => s.walletSummary);
  const transfers = useStore((s) => s.transfers);
  const invoiceReports = useStore((s) => s.invoiceReports);
  const projects = useStore((s) => s.projects);
  const connections = useStore((s) => s.connections);
  const chatThreads = useStore((s) => s.chatThreads);
  const insets = useSafeAreaInsets();
  const tabBarBottomPadding = DASHBOARD_TAB_BAR_SCROLL_BASE + insets.bottom;
  const { resolved } = useAppTheme();
  const dash = useMemo(() => getDashboardPalette(resolved), [resolved]);
  const C = useMemo(() => contractorDashboardColors(dash), [dash]);

  const clientStyles = useMemo(() => createClientHomeStyles(tabBarBottomPadding, dash), [tabBarBottomPadding, dash]);

  useEffect(() => {
    void (async () => {
      try {
        await useStore.getState().refreshMyProfile();
      } catch {
        // ignore
      }
    })();
  }, []);

  const refreshContractorHomeData = useCallback(async () => {
    if (!isContractor) return;
    const st = useStore.getState();
    try {
      await Promise.all([
        st.refreshWalletSummary(),
        st.refreshTransfers(),
        st.refreshInvoiceReports(),
        st.refreshProjects(),
        st.refreshConnections(),
        st.refreshChatThreads(),
      ]);
    } catch {
      // تُعرض أحدث قيم مخزّنة؛ الأخطاء تُعالج في الشاشات التفصيلية
    }
  }, [isContractor]);

  useFocusEffect(
    useCallback(() => {
      void refreshContractorHomeData();
    }, [refreshContractorHomeData])
  );

  const contractorHomeStats = useMemo(() => {
    const uid = String(user?._id ?? '');
    const invoiceTotal = invoiceReports.reduce((s, i) => s + invoiceLineAmount(i), 0);
    const invoicePaid = invoiceReports
      .filter((i) => (i.status ?? 'completed') === 'completed')
      .reduce((s, i) => s + invoiceLineAmount(i), 0);
    const invoicePending = invoiceReports
      .filter((i) => i.status === 'pending')
      .reduce((s, i) => s + invoiceLineAmount(i), 0);
    const hasInvoices = invoiceReports.length > 0;
    const pendingTransfers = uid ? sumPendingTransferAmount(transfers, uid) : 0;

    const paidDisplay = formatMoneyLira(hasInvoices ? invoicePaid : walletSummary?.incoming ?? 0);
    const pendingDisplay = formatMoneyLira(hasInvoices ? invoicePending : pendingTransfers);
    const totalInvoicesDisplay = formatMoneyLira(invoiceTotal);
    const balanceDisplay = formatMoneyLira(walletSummary?.net);

    return {
      balanceDisplay,
      paidDisplay,
      pendingDisplay,
      totalInvoicesDisplay,
      projectsCount: projects.length,
      contactRequestsCount: connections.length,
      conversationsCount: chatThreads.length,
    };
  }, [
    user?._id,
    walletSummary,
    transfers,
    invoiceReports,
    projects,
    connections,
    chatThreads,
  ]);

  const contractorStyles = useMemo(
    () => {
      return StyleSheet.create({
        screen: { flex: 1, backgroundColor: C.pageBg },
        safe: { flex: 1 },
        scroll: { flexGrow: 1, paddingBottom: tabBarBottomPadding + space.lg },
        header: {
          flexDirection: 'row-reverse',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          paddingTop: 12,
          paddingBottom: 8,
        },
        headerProfile: { flexDirection: 'row-reverse', alignItems: 'center', gap: 12, flex: 1 },
        avatar: {
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: C.border,
          borderWidth: 2,
          borderColor: `${C.gold}66`,
        },
        headerTextWrap: { alignItems: 'flex-end', flex: 1 },
        headerTitle: {
          fontSize: 14,
          fontWeight: '600',
          color: C.muted,
          textAlign: 'right',
        },
        headerName: {
          fontSize: 17,
          fontWeight: '800',
          color: C.darkText,
          textAlign: 'right',
          marginTop: 2,
        },
        headerIconBtn: {
          width: 44,
          height: 44,
          borderRadius: 16,
          backgroundColor: C.white,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1,
          borderColor: C.border,
        },
        financeSection: { paddingHorizontal: 20, paddingTop: 8 },
        financeCard: {
          flexDirection: 'row-reverse',
          borderRadius: 18,
          overflow: 'hidden',
          backgroundColor: C.white,
          elevation: 3,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
        },
        financeNavy: {
          width: Math.min(SCREEN_WIDTH * 0.42, 188),
          backgroundColor: C.financeStripBg,
          paddingVertical: 18,
          paddingHorizontal: 14,
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          minHeight: 196,
        },
        financeWhite: {
          flex: 1,
          paddingVertical: 16,
          paddingHorizontal: 14,
          alignItems: 'flex-end',
          justifyContent: 'flex-start',
        },
        paymentsHeading: {
          flexDirection: 'row-reverse',
          alignItems: 'center',
          gap: 6,
          marginBottom: 6,
        },
        paymentsHeadingText: {
          fontSize: 15,
          fontWeight: '800',
          color: C.darkText,
          textAlign: 'right',
        },
        walletBtn: {
          backgroundColor: C.gold,
          paddingVertical: 10,
          paddingHorizontal: 12,
          borderRadius: 14,
          marginTop: 10,
          alignSelf: 'stretch',
          alignItems: 'center',
        },
        walletBtnText: { color: C.onGold, fontWeight: '800', fontSize: 13 },
        balanceLabel: { color: 'rgba(255,255,255,0.88)', fontSize: 13, textAlign: 'right', fontWeight: '600' },
        balanceValue: {
          color: '#fff',
          fontSize: 21,
          fontWeight: '900',
          marginTop: 6,
          textAlign: 'right',
        },
        paymentLine: {
          flexDirection: 'row-reverse',
          alignItems: 'center',
          justifyContent: 'flex-start',
          flexWrap: 'wrap',
          gap: 8,
          marginTop: 10,
        },
        paymentLineLabel: { fontSize: 13, color: C.muted, fontWeight: '600' },
        statsRow: {
          flexDirection: 'row-reverse',
          gap: 10,
          paddingHorizontal: 20,
          paddingTop: 16,
        },
        statTile: {
          flex: 1,
          backgroundColor: C.shortcutBg,
          borderRadius: 16,
          paddingVertical: 14,
          paddingHorizontal: 10,
          alignItems: 'flex-end',
          minHeight: 96,
          justifyContent: 'space-between',
        },
        statLabel: { color: 'rgba(255,255,255,0.88)', fontSize: 11, fontWeight: '700', textAlign: 'right' },
        statValue: { color: '#fff', fontSize: 20, fontWeight: '900', textAlign: 'right' },
        sectionBlock: { paddingHorizontal: 20, paddingTop: 22 },
        sectionHeading: {
          flexDirection: 'row-reverse',
          alignItems: 'center',
          marginBottom: 12,
          gap: 8,
        },
        sectionBar: { width: 3, height: 18, backgroundColor: C.gold, borderRadius: 2 },
        sectionTitle: {
          fontSize: 16,
          fontWeight: '800',
          color: C.darkText,
          textAlign: 'right',
          flex: 1,
        },
        shortcutsGrid: { gap: 10 },
        shortcutRow: { flexDirection: 'row-reverse', gap: 10 },
        shortcutCell: {
          flex: 1,
          backgroundColor: C.shortcutBg,
          borderRadius: 16,
          paddingVertical: 18,
          paddingHorizontal: 12,
          alignItems: 'flex-end',
          minHeight: 88,
          justifyContent: 'center',
          gap: 8,
        },
        shortcutLabel: {
          color: '#fff',
          fontSize: 12,
          fontWeight: '700',
          textAlign: 'right',
          lineHeight: 18,
        },
        profileSection: { paddingTop: 4 },
        profileCard: {
          backgroundColor: C.white,
          borderRadius: 18,
          borderWidth: 1,
          borderColor: C.border,
          overflow: 'hidden',
        },
        profileMenuItem: {
          flexDirection: 'row-reverse',
          alignItems: 'center',
          paddingVertical: 16,
          paddingHorizontal: 16,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: C.border,
          gap: 12,
        },
        profileMenuItemLast: { borderBottomWidth: 0 },
        profileMenuText: {
          flex: 1,
          fontSize: 15,
          color: C.darkText,
          fontWeight: '600',
          textAlign: 'right',
        },
      });
    },
    [tabBarBottomPadding, C]
  );

  // لوحة صاحب المشروع — نفس ألوان dashboardLight (بيج، كحلي، ذهبي)
  const renderClientDashboard = () => (
    <SafeAreaView style={clientStyles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={clientStyles.scrollContent}
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <View style={clientStyles.header}>
          <Text style={clientStyles.hi}>مرحباً</Text>
          <Text style={clientStyles.name}>{user?.name ?? '—'}</Text>
          <Text style={clientStyles.role}>صاحب مشروع</Text>
        </View>

        <ContractorShowcaseCarousel />

        <Text style={clientStyles.section}>اختصارات صاحب المشروع</Text>
        <View style={clientStyles.grid}>
          <Pressable
            style={clientStyles.tile}
            onPress={() => router.push('/(main)/(tabs)/accounting' as const)}
            {...pressableRipple(dash.navyTint)}
          >
            <View style={[clientStyles.tileIconWrap, { backgroundColor: dash.goldTint }]}>
              <Ionicons name="calculator-outline" size={22} color={dash.navy} />
            </View>
            <Text style={clientStyles.tileText}>المدفوعات والمحفظة</Text>
          </Pressable>
          <Pressable
            style={clientStyles.tile}
            onPress={() => router.push('/(main)/(tabs)/projects' as const)}
            {...pressableRipple(dash.navyTint)}
          >
            <View style={[clientStyles.tileIconWrap, { backgroundColor: 'rgba(37, 99, 235, 0.12)' }]}>
              <Ionicons name="folder-outline" size={22} color="#1d4ed8" />
            </View>
            <Text style={clientStyles.tileText}>مشاريعي</Text>
          </Pressable>
          <Pressable style={clientStyles.tile} onPress={() => navigateFromRoot('DiscoverUsers')} {...pressableRipple(dash.navyTint)}>
            <View style={[clientStyles.tileIconWrap, { backgroundColor: 'rgba(14, 116, 144, 0.12)' }]}>
              <Ionicons name="search-outline" size={22} color="#0e7490" />
            </View>
            <Text style={clientStyles.tileText}>البحث عن مقاولين</Text>
          </Pressable>
          <Pressable
            style={clientStyles.tile}
            onPress={() => router.push('/(main)/(tabs)/chats' as const)}
            {...pressableRipple(dash.navyTint)}
          >
            <View style={[clientStyles.tileIconWrap, { backgroundColor: dash.navyTint }]}>
              <Ionicons name="chatbubbles-outline" size={22} color={dash.navy} />
            </View>
            <Text style={clientStyles.tileText}>المحادثات</Text>
          </Pressable>
          <Pressable style={clientStyles.tile} onPress={() => navigateFromRoot('PayContractor')} {...pressableRipple(dash.navyTint)}>
            <View style={[clientStyles.tileIconWrap, { backgroundColor: 'rgba(21, 128, 61, 0.12)' }]}>
              <Ionicons name="card-outline" size={22} color={dash.success} />
            </View>
            <Text style={clientStyles.tileText}>دفع لمقاول</Text>
          </Pressable>
          <Pressable
            style={clientStyles.tile}
            onPress={() => navigateFromRoot('ConnectionRequests')}
            {...pressableRipple(dash.navyTint)}
          >
            <View style={[clientStyles.tileIconWrap, { backgroundColor: 'rgba(124, 58, 237, 0.14)' }]}>
              <Ionicons name="people-outline" size={22} color="#6d28d9" />
            </View>
            <Text style={clientStyles.tileText}>طلبات التواصل</Text>
          </Pressable>
        </View>

        <Text style={clientStyles.section}>حسابي وملفي</Text>
        <View style={clientStyles.card}>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/(main)/(tabs)/account' as const)}
            {...pressableRipple(dash.navyTint)}
            style={clientStyles.rowBtn}
          >
            <Ionicons name="chevron-back" size={18} color={dash.muted} />
            <Text style={clientStyles.rowBtnText}>فتح حسابي</Text>
            <View style={[clientStyles.rowIcon, { backgroundColor: dash.goldTint }]}>
              <Ionicons name="person-circle-outline" size={22} color={dash.navy} />
            </View>
          </Pressable>
          <View style={clientStyles.div} />
          <Pressable
            accessibilityRole="button"
            onPress={() => navigateFromRoot('EditProfile')}
            {...pressableRipple(dash.navyTint)}
            style={clientStyles.rowBtn}
          >
            <Ionicons name="chevron-back" size={18} color={dash.muted} />
            <Text style={clientStyles.rowBtnText}>تعديل الملف</Text>
            <View style={[clientStyles.rowIcon, { backgroundColor: 'rgba(37, 99, 235, 0.12)' }]}>
              <Ionicons name="create-outline" size={22} color="#1d4ed8" />
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  // Contractor home — reference layout (RTL)
  const renderContractorDashboard = () => {
    const avatarUri = myPublicProfile?.avatarUri?.trim();

    return (
      <View style={contractorStyles.screen}>
        <SafeAreaView style={contractorStyles.safe} edges={['top']}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={contractorStyles.scroll}
            keyboardShouldPersistTaps="handled"
          >
            <View style={contractorStyles.header}>
              <View style={contractorStyles.headerProfile}>
                {avatarUri ? (
                  <Image source={{ uri: avatarUri }} style={contractorStyles.avatar} />
                ) : (
                  <View style={[contractorStyles.avatar, { alignItems: 'center', justifyContent: 'center' }]}>
                    <Ionicons name="person" size={26} color={C.muted} />
                  </View>
                )}
                <View style={contractorStyles.headerTextWrap}>
                  <Text style={contractorStyles.headerTitle}>مرحباً بك</Text>
                  <Text style={contractorStyles.headerName} numberOfLines={1}>
                    {user?.name ?? '—'}
                  </Text>
                </View>
              </View>
              <Pressable
                style={contractorStyles.headerIconBtn}
                accessibilityRole="button"
                accessibilityLabel="تنبيهات"
                onPress={() => navigateFromRoot('NotificationSettings')}
                {...pressableRipple(C.gold)}
              >
                <Ionicons name="notifications-outline" size={22} color={C.ink} />
              </Pressable>
            </View>

            <View style={contractorStyles.financeSection}>
              <View style={contractorStyles.financeCard}>
                <View style={contractorStyles.financeWhite}>
                  <View style={contractorStyles.paymentsHeading}>
                    <Text style={contractorStyles.paymentsHeadingText}>المدفوعات</Text>
                    <Ionicons name="document-text-outline" size={20} color={C.ink} />
                  </View>
                  <View style={contractorStyles.paymentLine}>
                    <Text style={contractorStyles.paymentLineLabel}>مدفوع</Text>
                    <Text style={[contractorStyles.paymentLineLabel, { color: C.paidGreen }]}>
                      {contractorHomeStats.paidDisplay}
                    </Text>
                  </View>
                  <View style={contractorStyles.paymentLine}>
                    <Text style={contractorStyles.paymentLineLabel}>معلق</Text>
                    <Text style={[contractorStyles.paymentLineLabel, { color: C.gold }]}>
                      {contractorHomeStats.pendingDisplay}
                    </Text>
                  </View>
                  <View style={contractorStyles.paymentLine}>
                    <Text style={contractorStyles.paymentLineLabel}>إجمالي الفواتير</Text>
                    <Text style={[contractorStyles.paymentLineLabel, { color: C.darkText }]}>
                      {contractorHomeStats.totalInvoicesDisplay}
                    </Text>
                  </View>
                </View>

                <View style={contractorStyles.financeNavy}>
                  <Ionicons name="wallet" size={28} color={C.gold} />
                  <View>
                    <Text style={contractorStyles.balanceLabel}>الرصيد الحالي</Text>
                    <Text style={contractorStyles.balanceValue}>{contractorHomeStats.balanceDisplay}</Text>
                  </View>
                  <Pressable
                    style={contractorStyles.walletBtn}
                    onPress={() => router.push('/wallet-home' as any)}
                  >
                    <Text style={contractorStyles.walletBtnText}>عرض المحفظة</Text>
                  </Pressable>
                </View>
              </View>
            </View>

            <View style={contractorStyles.statsRow}>
              <Pressable
                style={contractorStyles.statTile}
                onPress={() => router.push('/(main)/(tabs)/projects' as any)}
              >
                <Ionicons name="folder-outline" size={22} color={C.gold} />
                <Text style={contractorStyles.statValue}>{contractorHomeStats.projectsCount.toLocaleString('ar-SY')}</Text>
                <Text style={contractorStyles.statLabel}>المشاريع</Text>
              </Pressable>
              <Pressable
                style={contractorStyles.statTile}
                onPress={() => navigateFromRoot('ConnectionRequests')}
              >
                <Ionicons name="people-outline" size={22} color={C.gold} />
                <Text style={contractorStyles.statValue}>{contractorHomeStats.contactRequestsCount.toLocaleString('ar-SY')}</Text>
                <Text style={contractorStyles.statLabel}>طلبات التواصل</Text>
              </Pressable>
              <Pressable
                style={contractorStyles.statTile}
                onPress={() => router.push('/(main)/(tabs)/chats' as any)}
              >
                <Ionicons name="chatbubbles-outline" size={22} color={C.gold} />
                <Text style={contractorStyles.statValue}>{contractorHomeStats.conversationsCount.toLocaleString('ar-SY')}</Text>
                <Text style={contractorStyles.statLabel}>المحادثات</Text>
              </Pressable>
            </View>

            <View style={contractorStyles.sectionBlock}>
              <View style={contractorStyles.sectionHeading}>
                <View style={contractorStyles.sectionBar} />
                <Text style={contractorStyles.sectionTitle}>اختصارات المقاول</Text>
              </View>
              <View style={contractorStyles.shortcutsGrid}>
                <View style={contractorStyles.shortcutRow}>
                  <Pressable
                    style={contractorStyles.shortcutCell}
                    onPress={() => router.push('/(main)/(tabs)/projects' as any)}
                  >
                    <Ionicons name="folder-outline" size={24} color={C.gold} />
                    <Text style={contractorStyles.shortcutLabel}>مشاريع العمل</Text>
                  </Pressable>
                  <Pressable
                    style={contractorStyles.shortcutCell}
                    onPress={() => router.push('/(main)/(tabs)/chats' as any)}
                  >
                    <Ionicons name="chatbubbles-outline" size={24} color={C.gold} />
                    <Text style={contractorStyles.shortcutLabel}>المحادثات</Text>
                  </Pressable>
                </View>
                <View style={contractorStyles.shortcutRow}>
                  <Pressable
                    style={contractorStyles.shortcutCell}
                    onPress={() => navigateFromRoot('ConnectionRequests')}
                  >
                    <Ionicons name="people-outline" size={24} color={C.gold} />
                    <Text style={contractorStyles.shortcutLabel}>طلبات التواصل</Text>
                  </Pressable>
                  <Pressable
                    style={contractorStyles.shortcutCell}
                    onPress={() => navigateFromRoot('DiscoverUsers')}
                  >
                    <Ionicons name="search-outline" size={24} color={C.gold} />
                    <Text style={contractorStyles.shortcutLabel}>البحث عن عملاء</Text>
                  </Pressable>
                </View>
                <View style={contractorStyles.shortcutRow}>
                  <Pressable
                    style={contractorStyles.shortcutCell}
                    onPress={() => router.push('/(main)/(tabs)/accounting' as any)}
                  >
                    <Ionicons name="calculator-outline" size={24} color={C.gold} />
                    <Text style={contractorStyles.shortcutLabel}>المحاسبة والموقع</Text>
                  </Pressable>
                  <Pressable
                    style={contractorStyles.shortcutCell}
                    onPress={() => navigateFromRoot('ContractorPaySupplier')}
                  >
                    <Ionicons name="construct-outline" size={24} color={C.gold} />
                    <Text style={contractorStyles.shortcutLabel}>دفع لمورد</Text>
                  </Pressable>
                </View>
              </View>
            </View>

            <View style={contractorStyles.sectionBlock}>
              <View style={contractorStyles.sectionHeading}>
                <View style={contractorStyles.sectionBar} />
                <Text style={contractorStyles.sectionTitle}>حسابي وملفي</Text>
              </View>
              <View style={contractorStyles.profileSection}>
                <View style={contractorStyles.profileCard}>
                  <Pressable
                    style={contractorStyles.profileMenuItem}
                    onPress={() => router.push('/(main)/(tabs)/account' as any)}
                  >
                    <Ionicons name="chevron-back" size={18} color={C.muted} />
                    <Text style={contractorStyles.profileMenuText}>فتح حسابي</Text>
                    <Ionicons name="person-outline" size={22} color={C.gold} />
                  </Pressable>
                  <Pressable
                    style={contractorStyles.profileMenuItem}
                    onPress={() => navigateFromRoot('EditProfile')}
                  >
                    <Ionicons name="chevron-back" size={18} color={C.muted} />
                    <Text style={contractorStyles.profileMenuText}>تعديل ملفي العام</Text>
                    <Ionicons name="create-outline" size={22} color={C.gold} />
                  </Pressable>
                  <Pressable
                    style={[contractorStyles.profileMenuItem, contractorStyles.profileMenuItemLast]}
                    onPress={() => navigateFromRoot('PortfolioManage')}
                  >
                    <Ionicons name="chevron-back" size={18} color={C.muted} />
                    <Text style={contractorStyles.profileMenuText}>معرض أعمالي</Text>
                    <Ionicons name="images-outline" size={22} color={C.gold} />
                  </Pressable>
                </View>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  };

  return isContractor ? renderContractorDashboard() : renderClientDashboard();
}

function createClientHomeStyles(tabPadBottom: number, p: DashboardPalette) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: p.pageBg },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: 16,
      paddingTop: 4,
      paddingBottom: tabPadBottom + space.lg,
    },
    header: { marginBottom: 14, alignItems: 'flex-end' },
    hi: { color: p.muted, textAlign: 'right', fontSize: 14, fontWeight: '600' },
    name: { color: p.navy, fontSize: 22, fontWeight: '900', textAlign: 'right', marginTop: 6 },
    role: { color: p.gold, marginTop: 6, fontWeight: '800', textAlign: 'right', fontSize: 14 },
    section: {
      color: p.navy,
      fontSize: 16,
      fontWeight: '900',
      textAlign: 'right',
      marginTop: 20,
      marginBottom: 10,
    },
    grid: { flexDirection: 'row-reverse', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10 },
    tile: {
      width: '48%',
      backgroundColor: p.white,
      borderRadius: DASHBOARD_RADIUS,
      borderWidth: 1,
      borderColor: p.border,
      padding: 14,
      marginBottom: 4,
      alignItems: 'flex-end',
      minHeight: 108,
      justifyContent: 'space-between',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
    },
    tileIconWrap: {
      width: 44,
      height: 44,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    tileText: {
      color: p.darkText,
      fontWeight: '800',
      textAlign: 'right',
      marginTop: 10,
      fontSize: 13,
      lineHeight: 19,
    },
    card: {
      backgroundColor: p.white,
      borderRadius: DASHBOARD_RADIUS,
      borderWidth: 1,
      borderColor: p.border,
      overflow: 'hidden',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
    },
    rowBtn: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: 14,
      gap: 12,
      minHeight: touch.minHeight + 4,
    },
    rowBtnText: { flex: 1, color: p.darkText, fontWeight: '900', textAlign: 'right', fontSize: 15 },
    rowIcon: {
      width: 44,
      height: 44,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    div: { height: StyleSheet.hairlineWidth, backgroundColor: p.border, marginHorizontal: 14 },
  });
}
