import { useMemo } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { SyriaFlag } from '../../components/SyriaFlag';
import { navigateFromRoot } from '../../navigation/rootNavigation';
import { useStore } from '../../store/useStore';
import { useAppTheme, pressableRipple, radius, space, touch } from '../../theme';
import type { AppPalette } from '../../theme/palettes';
import { hapticLight } from '../../utils/haptics';

export function AccountScreen() {
  const user = useStore((s) => s.user);
  const logout = useStore((s) => s.logout);
  const appearance = useStore((s) => s.appearance);
  const setAppearance = useStore((s) => s.setAppearance);
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createAccountStyles(colors), [colors]);

  const roleLabel = user?.role === 'contractor' ? 'مقاول' : user?.role === 'client' ? 'صاحب مشروع' : '';
  const isContractor = user?.role === 'contractor';

  const go = (route: keyof import('../../navigation/types').RootStackParamList) => {
    navigateFromRoot(route);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: space.xxl + 12 + Math.max(insets.bottom, space.md) },
        ]}
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
      >
        <Text style={styles.pageTitle}>حسابي</Text>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color={colors.onPrimary} />
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
                name={user?.role === 'contractor' ? 'hammer' : 'person'}
                size={14}
                color={colors.primary}
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
                {...pressableRipple(colors.primaryTint12)}
              >
                <Ionicons name={t.icon} size={18} color={on ? colors.onPrimary : colors.textMuted} style={{ marginBottom: 4 }} />
                <Text style={[styles.themeBtnText, on && styles.themeBtnTextOn]}>{t.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(59,130,246,0.15)' }]}>
              <Ionicons name={user?.role === 'client' ? 'clipboard-outline' : 'cube-outline'} size={22} color="#60a5fa" />
            </View>
            <Text style={styles.statNum}>0</Text>
            <Text style={styles.statLab}>{user?.role === 'client' ? 'المتابعة' : 'المواد'}</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: colors.primaryTint12 }]}>
              <Ionicons name="folder-outline" size={22} color={colors.primary} />
            </View>
            <Text style={styles.statNum}>0</Text>
            <Text style={styles.statLab}>المشاريع</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(168,85,247,0.15)' }]}>
              <Ionicons name="cash-outline" size={22} color="#c084fc" />
            </View>
            <Text style={styles.statNum}>٠ ل.س</Text>
            <Text style={styles.statLab}>المدفوعات</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(34,197,94,0.15)' }]}>
              <Ionicons name={user?.role === 'client' ? 'hammer-outline' : 'people-outline'} size={22} color="#4ade80" />
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
            <Text style={styles.budgetOrange}>0 ل.س</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>الإعدادات</Text>
        <View style={styles.menuCard}>
          <Pressable
            style={styles.menuRow}
            onPress={() => go('EditProfile')}
            {...pressableRipple(colors.primaryTint12)}
          >
            <Ionicons name="chevron-back" size={18} color={colors.textMuted} />
            <View style={{ flex: 1 }}>
              <Text style={styles.menuTitle}>ملفي الشخصي</Text>
              <Text style={styles.menuSub}>كما يظهر للآخرين</Text>
            </View>
            <View style={[styles.menuIcon, { backgroundColor: colors.primaryTint12 }]}>
              <Ionicons name="person" size={20} color={colors.primary} />
            </View>
          </Pressable>
          <View style={styles.menuDiv} />
          <Pressable style={styles.menuRow} onPress={() => go('EditProfile')} {...pressableRipple(colors.primaryTint12)}>
            <Ionicons name="chevron-back" size={18} color={colors.textMuted} />
            <View style={{ flex: 1 }}>
              <Text style={styles.menuTitle}>تعديل الملف</Text>
              <Text style={styles.menuSub}>النبذة، التخصص، الصورة</Text>
            </View>
            <View style={[styles.menuIcon, { backgroundColor: 'rgba(59,130,246,0.15)' }]}>
              <Ionicons name="create-outline" size={20} color={colors.link} />
            </View>
          </Pressable>
          {isContractor ? (
            <>
              <View style={styles.menuDiv} />
              <Pressable style={styles.menuRow} onPress={() => go('PortfolioManage')} {...pressableRipple(colors.primaryTint12)}>
                <Ionicons name="chevron-back" size={18} color={colors.textMuted} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.menuTitle}>أعمالي المنجزة</Text>
                  <Text style={styles.menuSub}>اعرض مشاريعك السابقة</Text>
                </View>
                <View style={[styles.menuIcon, { backgroundColor: colors.primaryTint12 }]}>
                  <Ionicons name="briefcase-outline" size={20} color={colors.primary} />
                </View>
              </Pressable>
            </>
          ) : null}
          <View style={styles.menuDiv} />
          <Pressable style={styles.menuRow} onPress={() => go('ConnectionRequests')} {...pressableRipple(colors.primaryTint12)}>
            <Ionicons name="chevron-back" size={18} color={colors.textMuted} />
            <View style={{ flex: 1 }}>
              <Text style={styles.menuTitle}>طلبات التواصل</Text>
              <Text style={styles.menuSub}>الطلبات الواردة والصادرة</Text>
            </View>
            <View style={[styles.menuIcon, { backgroundColor: 'rgba(59,130,246,0.15)' }]}>
              <Ionicons name="people-outline" size={20} color={colors.link} />
            </View>
          </Pressable>
          <View style={styles.menuDiv} />
          <Pressable style={styles.menuRow} onPress={() => go('DiscoverUsers')} {...pressableRipple(colors.primaryTint12)}>
            <Ionicons name="chevron-back" size={18} color={colors.textMuted} />
            <View style={{ flex: 1 }}>
              <Text style={styles.menuTitle}>{isContractor ? 'اكتشف عملاء' : 'اكتشف مقاولين'}</Text>
              <Text style={styles.menuSub}>{isContractor ? 'ابحث عن أصحاب مشاريع جدد' : 'ابحث عن مقاولين موثوقين'}</Text>
            </View>
            <View style={[styles.menuIcon, { backgroundColor: 'rgba(139,92,246,0.18)' }]}>
              <Ionicons name="search" size={20} color={colors.aiPurple} />
            </View>
          </Pressable>
          <View style={styles.menuDiv} />
          <Pressable style={styles.menuRow} onPress={() => go('ManageCards')} {...pressableRipple(colors.primaryTint12)}>
            <Ionicons name="chevron-back" size={18} color={colors.textMuted} />
            <View style={{ flex: 1 }}>
              <Text style={styles.menuTitle}>بطاقاتي</Text>
              <Text style={styles.menuSub}>إدارة بطاقات الدفع</Text>
            </View>
            <View style={[styles.menuIcon, { backgroundColor: 'rgba(59,130,246,0.18)' }]}>
              <Ionicons name="card" size={20} color={colors.link} />
            </View>
          </Pressable>
          <View style={styles.menuDiv} />
          <Pressable style={styles.menuRow} onPress={() => go('Transfers')} {...pressableRipple(colors.primaryTint12)}>
            <Ionicons name="chevron-back" size={18} color={colors.textMuted} />
            <View style={{ flex: 1 }}>
              <Text style={styles.menuTitle}>التحويلات</Text>
              <Text style={styles.menuSub}>سجل المدفوعات والمقبوضات</Text>
            </View>
            <View style={[styles.menuIcon, { backgroundColor: colors.primaryTint12 }]}>
              <Ionicons name="swap-horizontal" size={20} color={colors.primary} />
            </View>
          </Pressable>
          <View style={styles.menuDiv} />
          <Pressable style={styles.menuRow} onPress={() => Alert.alert('الإشعارات', 'قريباً')} {...pressableRipple(colors.primaryTint12)}>
            <Ionicons name="chevron-back" size={18} color={colors.textMuted} />
            <View style={{ flex: 1 }}>
              <Text style={styles.menuTitle}>الإشعارات</Text>
              <Text style={styles.menuSub}>إدارة الإشعارات</Text>
            </View>
            <View style={[styles.menuIcon, { backgroundColor: 'rgba(251,113,133,0.18)' }]}>
              <Ionicons name="notifications" size={20} color={colors.error} />
            </View>
          </Pressable>
          <View style={styles.menuDiv} />
          <Pressable style={styles.menuRow} onPress={() => Alert.alert('الأمان', 'قريباً')} {...pressableRipple(colors.primaryTint12)}>
            <Ionicons name="chevron-back" size={18} color={colors.textMuted} />
            <View style={{ flex: 1 }}>
              <Text style={styles.menuTitle}>الأمان</Text>
              <Text style={styles.menuSub}>تغيير كلمة المرور</Text>
            </View>
            <View style={[styles.menuIcon, { backgroundColor: 'rgba(20,184,166,0.18)' }]}>
              <Ionicons name="lock-closed" size={20} color="#14b8a6" />
            </View>
          </Pressable>
        </View>

        <Text style={styles.sectionLabel}>إدارة البيانات</Text>
        <Pressable
          style={styles.dangerRow}
          onPress={() =>
            Alert.alert('تصفير البيانات', 'سيتم حذف البيانات المحلية عند تسجيل الخروج أو من الإعدادات لاحقاً.', [
              { text: 'حسناً', style: 'cancel' },
            ])
          }
          {...pressableRipple('rgba(239,68,68,0.12)')}
        >
          <Ionicons name="chevron-back" size={18} color={colors.textMuted} />
          <View style={{ flex: 1 }}>
            <Text style={styles.dangerTitle}>تصفير البيانات</Text>
            <Text style={styles.menuSub}>حذف كل البيانات المحلية</Text>
          </View>
          <View style={[styles.menuIcon, { backgroundColor: 'rgba(239,68,68,0.15)' }]}>
            <Ionicons name="refresh" size={20} color={colors.danger} />
          </View>
        </Pressable>

        <Pressable
          style={styles.logout}
          onPress={() => void logout()}
          {...pressableRipple('rgba(239,68,68,0.12)')}
        >
          <Ionicons name="log-out-outline" size={22} color={colors.danger} style={{ marginLeft: space.sm }} />
          <Text style={styles.logoutText}>تسجيل الخروج</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function createAccountStyles(colors: AppPalette) {
  return StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: space.lg, paddingBottom: space.xxl + 12 },
  pageTitle: { color: colors.text, fontSize: 22, fontWeight: '900', textAlign: 'right', marginBottom: space.md },
  profileCard: {
    backgroundColor: colors.surfaceMid,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    padding: space.lg,
    alignItems: 'center',
    marginBottom: space.lg,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space.md,
  },
  name: { color: colors.text, fontSize: 22, fontWeight: '900' },
  email: { color: colors.textMuted, marginTop: space.xs },
  chipRow: { flexDirection: 'row-reverse', gap: space.sm, marginTop: space.md },
  chipMuted: {
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderMuted,
  },
  chipWithFlag: { flexDirection: 'row-reverse', alignItems: 'center', gap: space.sm - 2 },
  chipMutedText: { color: colors.textSecondary, fontWeight: '700' },
  chipRole: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  chipRoleText: { color: colors.primary, fontWeight: '800' },
  sectionLabel: { color: colors.textMuted, fontWeight: '800', textAlign: 'right', marginBottom: space.sm, marginTop: space.sm },
  themeRow: { flexDirection: 'row-reverse', gap: space.sm, marginBottom: space.lg },
  themeBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    backgroundColor: colors.surfaceMid,
  },
  themeBtnOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  themeBtnText: { color: colors.textMuted, fontWeight: '800', fontSize: 12 },
  themeBtnTextOn: { color: colors.onPrimary },
  statsGrid: { flexDirection: 'row-reverse', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: space.lg },
  statCard: {
    width: '48%',
    backgroundColor: colors.surfaceMid,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    padding: space.md,
    marginBottom: space.sm + 2,
    alignItems: 'flex-end',
  },
  statIcon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: space.sm },
  statNum: { color: colors.text, fontWeight: '900', fontSize: 18, fontVariant: ['tabular-nums'] },
  statLab: { color: colors.textMuted, fontSize: 12, marginTop: 4 },
  budgetCard: {
    backgroundColor: colors.surfaceMid,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    padding: space.md,
    marginBottom: space.lg,
  },
  budgetRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', paddingVertical: space.sm + 2 },
  budgetLab: { color: colors.textSecondary, fontWeight: '700' },
  budgetGreen: { color: colors.success, fontWeight: '900' },
  budgetOrange: { color: colors.primary, fontWeight: '900' },
  div: { height: StyleSheet.hairlineWidth, backgroundColor: colors.borderMuted, marginVertical: space.xs },
  menuCard: {
    backgroundColor: colors.surfaceMid,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    overflow: 'hidden',
    marginBottom: space.md,
  },
  menuRow: { flexDirection: 'row-reverse', alignItems: 'center', padding: space.md, gap: space.md, minHeight: touch.minHeight + 8 },
  menuDiv: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border, marginHorizontal: space.md },
  menuTitle: { color: colors.text, fontWeight: '900', textAlign: 'right', fontSize: 15 },
  menuSub: { color: colors.textMuted, textAlign: 'right', fontSize: 12, marginTop: 2 },
  menuIcon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  dangerRow: { flexDirection: 'row-reverse', alignItems: 'center', padding: space.md, gap: space.md, marginBottom: space.md },
  dangerTitle: { color: colors.danger, fontWeight: '900', textAlign: 'right' },
  logout: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: radius.lg,
    paddingVertical: space.md,
    marginTop: space.sm,
    minHeight: touch.minHeight,
  },
  logoutText: { color: colors.danger, fontWeight: '900', fontSize: 16 },
});
}
