import { useMemo } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { TopBar } from '../../components/TopBar';
import { DASHBOARD_TAB_BAR_SCROLL_BASE } from '../../constants/dashboardTabBar';
import { useStore } from '../../store/useStore';
import { pressableRipple, space, useAppTheme } from '../../theme';
import { DASHBOARD_RADIUS, getDashboardPalette } from '../../theme/dashboardLight';

export function AdminHubScreen() {
  const user = useStore((s) => s.user);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const tabPad = DASHBOARD_TAB_BAR_SCROLL_BASE + insets.bottom + space.lg;
  const { resolved } = useAppTheme();
  const dash = useMemo(() => getDashboardPalette(resolved), [resolved]);
  const styles = useMemo(() => createStyles(dash), [dash]);

  const allowed = user?.role === 'admin';

  if (!allowed) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <TopBar tone="beige" title="إدارة النظام" />
        <View style={styles.denied}>
          <Text style={styles.deniedText}>هذه المنطقة للمديرين فقط.</Text>
          <Pressable onPress={() => router.back()} style={styles.deniedBtn}>
            <Text style={styles.deniedBtnTxt}>رجوع</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const row = (icon: keyof typeof Ionicons.glyphMap, title: string, subtitle: string, href: string) => (
    <Pressable
      key={href}
      style={styles.card}
      onPress={() => router.push(href as never)}
      {...pressableRipple(dash.goldTint)}
    >
      <View style={styles.cardIcon}>
        <Ionicons name={icon} size={26} color={dash.gold} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardSub}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-back" size={22} color={dash.muted} />
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <TopBar tone="beige" title="إدارة النظام" />
      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: tabPad }]} showsVerticalScrollIndicator={false}>
        <Text style={styles.lead}>
          إدارة المستخدمين، مراقبة المحتوى والبلاغات، والمراجعة المالية (Stripe). جميع الطلبات تُسجَّل على الخادم ولا يمكن لغير المدير الوصول إليها.
        </Text>
        {row('people-outline', 'المستخدمون', 'حظر، تفعيل، أدوار، كلمة مرور، تجميد محفظة', '/admin/users')}
        {row('shield-checkmark-outline', 'المحتوى والبلاغات', 'تقييمات، محافظ أعمال، بلاغات محادثات، نزاعات', '/admin/moderation')}
        {row('cash-outline', 'المالية', 'ملخص التحويلات، تحويلات كبيرة، إلغاء / استرداد Stripe', '/admin/finance')}
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(dash: ReturnType<typeof getDashboardPalette>) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: dash.pageBg },
    scroll: { paddingHorizontal: 16, paddingTop: 12 },
    lead: {
      color: dash.muted,
      fontSize: 14,
      lineHeight: 22,
      textAlign: 'right',
      marginBottom: space.md,
    },
    card: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      gap: 12,
      padding: 14,
      marginBottom: 10,
      backgroundColor: dash.white,
      borderRadius: DASHBOARD_RADIUS,
      borderWidth: 1,
      borderColor: dash.border,
    },
    cardIcon: {
      width: 48,
      height: 48,
      borderRadius: 12,
      backgroundColor: dash.goldTint,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cardTitle: { fontSize: 16, fontWeight: '900', color: dash.darkText, textAlign: 'right' },
    cardSub: { fontSize: 12, color: dash.muted, textAlign: 'right', marginTop: 4, lineHeight: 18 },
    denied: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center' },
    deniedText: { fontSize: 15, color: dash.muted, textAlign: 'center' },
    deniedBtn: { marginTop: 16, paddingVertical: 12, paddingHorizontal: 24, backgroundColor: dash.gold, borderRadius: DASHBOARD_RADIUS },
    deniedBtnTxt: { color: dash.onGold, fontWeight: '900' },
  });
}
