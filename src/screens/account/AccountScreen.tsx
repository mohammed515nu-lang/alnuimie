import { useMemo } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { SyriaFlag } from '../../components/SyriaFlag';
import { DASHBOARD_TAB_BAR_SCROLL_BASE } from '../../constants/dashboardTabBar';
import { pushStackRoute } from '../../navigation/href';
import { navigateFromRoot } from '../../navigation/rootNavigation';
import { useStore } from '../../store/useStore';
import { pressableRipple, space, touch, useAppTheme } from '../../theme';
import { DASHBOARD_RADIUS, getDashboardPalette, type DashboardPalette } from '../../theme/dashboardLight';
import { hapticLight } from '../../utils/haptics';

export function AccountScreen() {
  const user = useStore((s) => s.user);
  const logout = useStore((s) => s.logout);
  const appearance = useStore((s) => s.appearance);
  const setAppearance = useStore((s) => s.setAppearance);
  const insets = useSafeAreaInsets();
  const tabPad = DASHBOARD_TAB_BAR_SCROLL_BASE + insets.bottom + space.lg;
  const { resolved } = useAppTheme();
  const dash = useMemo(() => getDashboardPalette(resolved), [resolved]);
  const styles = useMemo(() => createStyles(dash), [dash]);

  const roleLabel = user?.role === 'contractor' ? 'مقاول' : user?.role === 'client' ? 'صاحب مشروع' : '';
  const isContractor = user?.role === 'contractor';

  const go = (route: keyof import('../../navigation/types').RootStackParamList) => {
    navigateFromRoot(route);
  };

  const openMyPublicProfile = () => {
    const id = String(user?._id ?? '').trim();
    if (!id) {
      Alert.alert('تنبيه', 'تعذر فتح الملف. جرّب تسجيل الخروج والدخول من جديد.');
      return;
    }
    pushStackRoute('PublicProfile', { userId: id });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          style={styles.headerIconBtn}
          accessibilityRole="button"
          accessibilityLabel="تنبيهات"
          onPress={() => pushStackRoute('NotificationSettings')}
          {...pressableRipple(dash.navyTint)}
        >
          <Ionicons name="notifications-outline" size={22} color={dash.navy} />
        </Pressable>
        <Text style={styles.headerTitle}>حسابي</Text>
        <View style={styles.headerIconBtnHidden} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: tabPad }]}
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color={dash.navy} />
            <Pressable
              style={styles.avatarCam}
              accessibilityRole="button"
              accessibilityLabel="تغيير الصورة"
              onPress={() => go('EditProfile')}
              {...pressableRipple(dash.goldTint)}
            >
              <Ionicons name="camera" size={16} color={dash.onGold} />
            </Pressable>
          </View>
          <Text style={styles.name}>{user?.name ?? '—'}</Text>
          <Text style={styles.email} selectable>
            {user?.email ?? ''}
          </Text>
          <View style={styles.chipRow}>
            <View style={[styles.chipMuted, styles.chipWithFlag]}>
              <SyriaFlag width={22} height={16} />
              <Text style={styles.chipMutedText}>سوريا</Text>
            </View>
            <View style={styles.chipRole}>
              <Ionicons
                name={user?.role === 'contractor' ? 'construct-outline' : 'person-outline'}
                size={14}
                color={dash.navy}
                style={{ marginLeft: 4 }}
              />
              <Text style={styles.chipRoleText}>{roleLabel}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionLabel}>مظهر التطبيق</Text>
        <View style={styles.themeRow}>
          {(
            [
              { k: 'light' as const, label: 'فاتح', icon: 'sunny-outline' as const },
              { k: 'dark' as const, label: 'داكن', icon: 'moon-outline' as const },
              { k: 'system' as const, label: 'النظام', icon: 'phone-portrait-outline' as const },
            ] as const
          ).map((t) => {
            const on = appearance === t.k;
            return (
              <Pressable
                key={t.k}
                onPress={() => {
                  hapticLight();
                  setAppearance(t.k);
                }}
                style={[styles.themeBtn, on && styles.themeBtnOn]}
                {...pressableRipple(dash.goldTint)}
              >
                <Ionicons name={t.icon} size={18} color={on ? dash.navy : dash.muted} style={{ marginBottom: 4 }} />
                <Text style={[styles.themeBtnText, on && styles.themeBtnTextOn]}>{t.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.sectionLabel}>إحصائيات سريعة</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(37, 99, 235, 0.12)' }]}>
              <Ionicons name={user?.role === 'client' ? 'clipboard-outline' : 'cube-outline'} size={22} color="#1d4ed8" />
            </View>
            <Text style={styles.statNum}>0</Text>
            <Text style={styles.statLab}>{user?.role === 'client' ? 'المتابعة' : 'المواد / عناصر'}</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: dash.goldTint }]}>
              <Ionicons name="folder-outline" size={22} color={dash.navy} />
            </View>
            <Text style={styles.statNum}>0</Text>
            <Text style={styles.statLab}>المشاريع / نشط</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(166, 124, 82, 0.2)' }]}>
              <Ionicons name="cash-outline" size={22} color={dash.gold} />
            </View>
            <Text style={styles.statNum}>٠ ل.س</Text>
            <Text style={styles.statLab}>المدفوعات</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(26, 43, 68, 0.1)' }]}>
              <Ionicons name={user?.role === 'client' ? 'construct-outline' : 'people-outline'} size={22} color={dash.navy} />
            </View>
            <Text style={styles.statNum}>0</Text>
            <Text style={styles.statLab}>{user?.role === 'client' ? 'مقاولون' : 'الموردين'}</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>نظرة على الميزانية</Text>
        <View style={styles.budgetCard}>
          <View style={styles.budgetRow}>
            <Text style={styles.budgetLab}>الميزانية الكلية</Text>
            <Text style={styles.budgetGreen}>0 ل.س</Text>
          </View>
          <View style={styles.div} />
          <View style={styles.budgetRow}>
            <Text style={styles.budgetLab}>إجمالي المدفوع</Text>
            <Text style={styles.budgetGold}>0 ل.س</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>الإعدادات</Text>

        <Text style={styles.settingsGroup}>الملف والظهور</Text>
        <View style={styles.menuCard}>
          <Pressable style={styles.menuRow} onPress={openMyPublicProfile} {...pressableRipple(dash.navyTint)}>
            <Ionicons name="chevron-back" size={18} color={dash.muted} />
            <View style={{ flex: 1 }}>
              <Text style={styles.menuTitle}>ملفي الشخصي</Text>
              <Text style={styles.menuSub}>معاينة كما يراها الآخرون</Text>
            </View>
            <View style={[styles.menuIcon, { backgroundColor: dash.goldTint }]}>
              <Ionicons name="person-outline" size={20} color={dash.navy} />
            </View>
          </Pressable>
          <View style={styles.menuDiv} />
          <Pressable style={styles.menuRow} onPress={() => go('EditProfile')} {...pressableRipple(dash.navyTint)}>
            <Ionicons name="chevron-back" size={18} color={dash.muted} />
            <View style={{ flex: 1 }}>
              <Text style={styles.menuTitle}>تعديل الملف</Text>
              <Text style={styles.menuSub}>الاسم، الهاتف، النبذة، التخصص والصورة</Text>
            </View>
            <View style={[styles.menuIcon, { backgroundColor: 'rgba(37, 99, 235, 0.12)' }]}>
              <Ionicons name="create-outline" size={20} color="#1d4ed8" />
            </View>
          </Pressable>
          {isContractor ? (
            <>
              <View style={styles.menuDiv} />
              <Pressable style={styles.menuRow} onPress={() => go('PortfolioManage')} {...pressableRipple(dash.navyTint)}>
                <Ionicons name="chevron-back" size={18} color={dash.muted} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.menuTitle}>أعمالي المنجزة</Text>
                  <Text style={styles.menuSub}>اعرض مشاريعك السابقة</Text>
                </View>
                <View style={[styles.menuIcon, { backgroundColor: dash.goldTint }]}>
                  <Ionicons name="briefcase-outline" size={20} color={dash.navy} />
                </View>
              </Pressable>
            </>
          ) : null}
        </View>

        <Text style={styles.settingsGroup}>التواصل</Text>
        <View style={styles.menuCard}>
          <Pressable style={styles.menuRow} onPress={() => go('ConnectionRequests')} {...pressableRipple(dash.navyTint)}>
            <Ionicons name="chevron-back" size={18} color={dash.muted} />
            <View style={{ flex: 1 }}>
              <Text style={styles.menuTitle}>طلبات التواصل</Text>
              <Text style={styles.menuSub}>الطلبات الواردة والصادرة</Text>
            </View>
            <View style={[styles.menuIcon, { backgroundColor: 'rgba(124, 58, 237, 0.14)' }]}>
              <Ionicons name="people-outline" size={20} color="#6d28d9" />
            </View>
          </Pressable>
          <View style={styles.menuDiv} />
          <Pressable style={styles.menuRow} onPress={() => go('DiscoverUsers')} {...pressableRipple(dash.navyTint)}>
            <Ionicons name="chevron-back" size={18} color={dash.muted} />
            <View style={{ flex: 1 }}>
              <Text style={styles.menuTitle}>{isContractor ? 'اكتشف عملاء' : 'اكتشف مقاولين'}</Text>
              <Text style={styles.menuSub}>{isContractor ? 'ابحث عن أصحاب مشاريع جدد' : 'ابحث عن مقاولين موثوقين'}</Text>
            </View>
            <View style={[styles.menuIcon, { backgroundColor: 'rgba(14, 116, 144, 0.12)' }]}>
              <Ionicons name="search-outline" size={20} color="#0e7490" />
            </View>
          </Pressable>
          <View style={styles.menuDiv} />
          <Pressable
            style={styles.menuRow}
            onPress={() => pushStackRoute('NotificationSettings')}
            {...pressableRipple(dash.navyTint)}
          >
            <Ionicons name="chevron-back" size={18} color={dash.muted} />
            <View style={{ flex: 1 }}>
              <Text style={styles.menuTitle}>الإشعارات</Text>
              <Text style={styles.menuSub}>إدارة الإشعارات</Text>
            </View>
            <View style={[styles.menuIcon, { backgroundColor: 'rgba(185, 28, 28, 0.1)' }]}>
              <Ionicons name="notifications-outline" size={20} color={dash.danger} />
            </View>
          </Pressable>
        </View>

        <Text style={styles.settingsGroup}>المدفوعات</Text>
        <View style={styles.menuCard}>
          <Pressable style={styles.menuRow} onPress={() => go('ManageCards')} {...pressableRipple(dash.navyTint)}>
            <Ionicons name="chevron-back" size={18} color={dash.muted} />
            <View style={{ flex: 1 }}>
              <Text style={styles.menuTitle}>بطاقاتي</Text>
              <Text style={styles.menuSub}>إدارة بطاقات الدفع</Text>
            </View>
            <View style={[styles.menuIcon, { backgroundColor: 'rgba(37, 99, 235, 0.12)' }]}>
              <Ionicons name="card-outline" size={20} color="#1d4ed8" />
            </View>
          </Pressable>
          <View style={styles.menuDiv} />
          <Pressable style={styles.menuRow} onPress={() => go('Transfers')} {...pressableRipple(dash.navyTint)}>
            <Ionicons name="chevron-back" size={18} color={dash.muted} />
            <View style={{ flex: 1 }}>
              <Text style={styles.menuTitle}>التحويلات</Text>
              <Text style={styles.menuSub}>سجل المدفوعات والمقبوضات</Text>
            </View>
            <View style={[styles.menuIcon, { backgroundColor: 'rgba(26, 43, 68, 0.1)' }]}>
              <Ionicons name="swap-horizontal-outline" size={20} color={dash.navy} />
            </View>
          </Pressable>
        </View>

        <Text style={styles.settingsGroup}>الأمان</Text>
        <View style={styles.menuCard}>
          <Pressable style={styles.menuRow} onPress={() => go('AccountSecurity')} {...pressableRipple(dash.navyTint)}>
            <Ionicons name="chevron-back" size={18} color={dash.muted} />
            <View style={{ flex: 1 }}>
              <Text style={styles.menuTitle}>الأمان</Text>
              <Text style={styles.menuSub}>كلمة المرور واستعادة الحساب</Text>
            </View>
            <View style={[styles.menuIcon, { backgroundColor: 'rgba(21, 128, 61, 0.12)' }]}>
              <Ionicons name="lock-closed-outline" size={20} color={dash.success} />
            </View>
          </Pressable>
        </View>

        <Text style={styles.sectionLabel}>إدارة البيانات</Text>
        <View style={styles.menuCard}>
          <Pressable
            style={styles.menuRow}
            onPress={() =>
              Alert.alert('تصفير البيانات', 'سيتم حذف البيانات المحلية عند تسجيل الخروج أو من الإعدادات لاحقاً.', [
                { text: 'حسناً', style: 'cancel' },
              ])
            }
            {...pressableRipple('rgba(185, 28, 28, 0.08)')}
          >
            <Ionicons name="chevron-back" size={18} color={dash.muted} />
            <View style={{ flex: 1 }}>
              <Text style={styles.dangerTitle}>تصفير البيانات</Text>
              <Text style={styles.menuSub}>حذف كل البيانات المحلية</Text>
            </View>
            <View style={[styles.menuIcon, { backgroundColor: 'rgba(185, 28, 28, 0.1)' }]}>
              <Ionicons name="refresh-outline" size={20} color={dash.danger} />
            </View>
          </Pressable>
        </View>

        <Pressable
          style={styles.logout}
          onPress={() => void logout()}
          {...pressableRipple('rgba(185, 28, 28, 0.1)')}
        >
          <Ionicons name="log-out-outline" size={22} color={dash.danger} style={{ marginLeft: 8 }} />
          <Text style={styles.logoutText}>تسجيل الخروج</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(dash: DashboardPalette) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: dash.pageBg },
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
      color: dash.navy,
    },
    headerIconBtn: {
      width: 44,
      height: 44,
      borderRadius: DASHBOARD_RADIUS,
      backgroundColor: dash.white,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: dash.border,
    },
    headerIconBtnHidden: { width: 44, height: 44 },
    scroll: { paddingHorizontal: 16, paddingTop: 4 },
    profileCard: {
      backgroundColor: dash.white,
      borderRadius: DASHBOARD_RADIUS,
      borderWidth: 1,
      borderColor: dash.border,
      padding: 20,
      alignItems: 'center',
      marginBottom: 16,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
    },
    avatar: {
      width: 92,
      height: 92,
      borderRadius: 46,
      backgroundColor: dash.goldTint,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
      borderWidth: 2,
      borderColor: dash.border,
      position: 'relative',
    },
    avatarCam: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: dash.gold,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: dash.white,
    },
    name: { color: dash.navy, fontSize: 22, fontWeight: '900' },
    email: { color: dash.muted, marginTop: 6, fontSize: 14 },
    chipRow: { flexDirection: 'row-reverse', gap: 10, marginTop: 14 },
    chipMuted: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: dash.inputBg,
      borderWidth: 1,
      borderColor: dash.border,
    },
    chipWithFlag: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6 },
    chipMutedText: { color: dash.darkText, fontWeight: '700', fontSize: 13 },
    chipRole: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: dash.goldTint,
      borderWidth: 1,
      borderColor: dash.gold,
    },
    chipRoleText: { color: dash.navy, fontWeight: '800', fontSize: 13 },
    sectionLabel: {
      color: dash.navy,
      fontWeight: '900',
      textAlign: 'right',
      marginBottom: 10,
      marginTop: 8,
      fontSize: 15,
    },
    settingsGroup: {
      color: dash.muted,
      fontSize: 12,
      fontWeight: '800',
      textAlign: 'right',
      marginBottom: 8,
      marginTop: 4,
      letterSpacing: 0.2,
    },
    themeRow: { flexDirection: 'row-reverse', gap: 8, marginBottom: 16 },
    themeBtn: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 12,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: dash.border,
      backgroundColor: dash.white,
    },
    themeBtnOn: { backgroundColor: dash.gold, borderColor: dash.gold },
    themeBtnText: { color: dash.muted, fontWeight: '800', fontSize: 12 },
    themeBtnTextOn: { color: dash.onGold },
    statsGrid: { flexDirection: 'row-reverse', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 8 },
    statCard: {
      width: '48.5%',
      backgroundColor: dash.white,
      borderRadius: DASHBOARD_RADIUS,
      borderWidth: 1,
      borderColor: dash.border,
      padding: 14,
      marginBottom: 10,
      alignItems: 'flex-end',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
    },
    statIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
    statNum: { color: dash.navy, fontWeight: '900', fontSize: 18, fontVariant: ['tabular-nums'] },
    statLab: { color: dash.muted, fontSize: 11, marginTop: 4, textAlign: 'right', lineHeight: 16 },
    budgetCard: {
      backgroundColor: dash.white,
      borderRadius: DASHBOARD_RADIUS,
      borderWidth: 1,
      borderColor: dash.border,
      padding: 16,
      marginBottom: 16,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
    },
    budgetRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
    budgetLab: { color: dash.muted, fontWeight: '700', fontSize: 14 },
    budgetGreen: { color: dash.success, fontWeight: '900' },
    budgetGold: { color: dash.gold, fontWeight: '900' },
    div: { height: StyleSheet.hairlineWidth, backgroundColor: dash.border, marginVertical: 4 },
    menuCard: {
      backgroundColor: dash.white,
      borderRadius: DASHBOARD_RADIUS,
      borderWidth: 1,
      borderColor: dash.border,
      overflow: 'hidden',
      marginBottom: 12,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
    },
    menuRow: { flexDirection: 'row-reverse', alignItems: 'center', padding: 14, gap: 12, minHeight: touch.minHeight + 6 },
    menuDiv: { height: StyleSheet.hairlineWidth, backgroundColor: dash.border, marginHorizontal: 14 },
    menuTitle: { color: dash.darkText, fontWeight: '900', textAlign: 'right', fontSize: 15 },
    menuSub: { color: dash.muted, textAlign: 'right', fontSize: 12, marginTop: 2 },
    menuIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    dangerTitle: { color: dash.danger, fontWeight: '900', textAlign: 'right', fontSize: 15 },
    logout: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1.5,
      borderColor: dash.danger,
      borderRadius: DASHBOARD_RADIUS,
      paddingVertical: 14,
      marginTop: 8,
      minHeight: touch.minHeight,
      backgroundColor: dash.white,
    },
    logoutText: { color: dash.danger, fontWeight: '900', fontSize: 16 },
  });
}
