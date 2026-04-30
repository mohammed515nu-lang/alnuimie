import { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';

import { getApiErrorMessage } from '../../api/http';
import { ApiStateView } from '../ApiStateView';
import { useStore } from '../../store/useStore';
import { pushStackRoute } from '../../navigation/href';
import { useAppTheme, pressableRipple, radius, space, touch } from '../../theme';
import type { AppGradients, AppPalette } from '../../theme/palettes';
import { DASHBOARD_RADIUS, getDashboardPalette, type DashboardPalette } from '../../theme/dashboardLight';

type Props = {
  subtitle?: string;
  /** مطابقة الرئيسية / المحاسبة — بطاقة بيضاء وحدود بيج */
  tone?: 'default' | 'beige';
};

export function WalletCard({ subtitle, tone = 'default' }: Props) {
  const user = useStore((s) => s.user);
  const paymentCards = useStore((s) => s.paymentCards);
  const walletSummary = useStore((s) => s.walletSummary);
  const transfers = useStore((s) => s.transfers);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError(null);
      const { refreshPaymentCards, refreshTransfers, refreshWalletSummary } = useStore.getState();
      await Promise.all([refreshPaymentCards(), refreshTransfers(), refreshWalletSummary()]);
    } catch (e) {
      setLoadError(getApiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  const defaultCard = useMemo(
    () => paymentCards.find((c) => c.isDefault) ?? paymentCards[0],
    [paymentCards]
  );

  const { colors, gradients, walletCardHalo, resolved } = useAppTheme();
  const dash = useMemo(() => getDashboardPalette(resolved), [resolved]);
  const styles = useMemo(
    () =>
      tone === 'beige'
        ? createBeigeWalletCardStyles(dash)
        : createWalletCardStyles(colors, gradients, walletCardHalo, resolved),
    [tone, resolved]
  );

  const lastProjectPayment = useMemo(() => {
    if (!user) return null;
    const list = [...transfers].sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
    for (const t of list) {
      if (t.type !== 'client_to_contractor') continue;
      if (user.role === 'contractor' && t.toUserId === user._id) return t;
      if (user.role === 'client' && t.fromUserId === user._id) return t;
    }
    return null;
  }, [transfers, user]);

  const roleLabel =
    user?.role === 'contractor' ? 'مقاول' : user?.role === 'client' ? 'صاحب مشروع' : user?.role ?? '';

  const ripplePrimary = tone === 'beige' ? dash.goldTint : colors.primaryTint18;
  const rippleSecondary = tone === 'beige' ? dash.navyTint : colors.primaryTint12;

  const inner = (
    <View style={styles.inner}>
      <Text style={styles.title}>المحفظة</Text>
      {subtitle ? <Text style={styles.sub}>{subtitle}</Text> : null}
      <Text style={styles.roleLine}>{roleLabel}</Text>

      {loading && paymentCards.length === 0 ? (
        <ApiStateView
          tone={tone === 'beige' ? 'beige' : 'default'}
          mode="loading"
          title="جاري تحميل بيانات المحفظة..."
        />
      ) : loadError && paymentCards.length === 0 ? (
        <ApiStateView
          tone={tone === 'beige' ? 'beige' : 'default'}
          mode="error"
          title="تعذر تحميل المحفظة"
          subtitle={loadError}
          onRetry={() => void load()}
        />
      ) : !defaultCard ? (
        <View style={styles.block}>
          <Text style={styles.muted}>لا توجد بطاقة دفع محفوظة بعد.</Text>
          <Text style={styles.hint}>أضف بطاقة بأمان عبر Stripe، ثم يظهر ملخص الرصيد والتحويلات من الخادم.</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => pushStackRoute('AddCard')}
            {...pressableRipple(ripplePrimary)}
            style={styles.primary}
          >
            <Text style={styles.primaryText}>إضافة بطاقة</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.block}>
          <Text style={styles.cardLine}>
            البطاقة الافتراضية: {defaultCard.brand.toUpperCase()} •••• {defaultCard.last4}
          </Text>
          <View style={styles.metrics}>
            <Text style={styles.metric}>وارد (مكتمل): {walletSummary?.incoming?.toFixed(2) ?? '—'}</Text>
            <Text style={styles.metric}>صادر (مكتمل): {walletSummary?.outgoing?.toFixed(2) ?? '—'}</Text>
            <Text style={styles.metricStrong}>الصافي: {walletSummary?.net?.toFixed(2) ?? '—'}</Text>
          </View>
          {lastProjectPayment ? (
            <Text style={styles.lastPay}>
              آخر دفع مشروع ({lastProjectPayment.status}): {lastProjectPayment.amount}{' '}
              {String(lastProjectPayment.currency).toUpperCase()}
              {lastProjectPayment.projectName ? ` — ${lastProjectPayment.projectName}` : ''}
            </Text>
          ) : null}
          <View style={styles.row}>
            <Pressable
              accessibilityRole="button"
              onPress={() => pushStackRoute('AddCard')}
              {...pressableRipple(rippleSecondary)}
              style={styles.secondary}
            >
              <Text style={styles.secondaryText}>بطاقة أخرى</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => pushStackRoute('Transfers')}
              {...pressableRipple(rippleSecondary)}
              style={styles.secondary}
            >
              <Text style={styles.secondaryText}>التحويلات</Text>
            </Pressable>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() => pushStackRoute('ManageCards')}
            {...pressableRipple(rippleSecondary)}
            style={[styles.secondary, styles.fullRow]}
          >
            <Text style={styles.secondaryText}>إدارة البطاقات</Text>
          </Pressable>
        </View>
      )}
    </View>
  );

  if (tone === 'beige') {
    return <View style={styles.wrap}>{inner}</View>;
  }

  return (
    <LinearGradient colors={[...gradients.walletCard]} style={styles.wrap}>
      {inner}
    </LinearGradient>
  );
}

function createBeigeWalletCardStyles(dash: DashboardPalette) {
  return StyleSheet.create({
    wrap: {
      backgroundColor: dash.white,
      borderRadius: DASHBOARD_RADIUS,
      borderWidth: 1,
      borderColor: dash.border,
      padding: 16,
      marginBottom: 12,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 10,
    },
    inner: {},
    title: { color: dash.navy, fontSize: 18, fontWeight: '900', textAlign: 'right' },
    sub: { color: dash.muted, marginTop: 6, lineHeight: 20, textAlign: 'right' },
    roleLine: { color: dash.gold, marginTop: 6, fontWeight: '700', textAlign: 'right' },
    block: { marginTop: 14 },
    muted: { color: dash.muted, textAlign: 'right' },
    hint: { color: dash.muted, marginTop: 8, lineHeight: 20, marginBottom: 12, textAlign: 'right', fontSize: 13 },
    cardLine: {
      color: dash.darkText,
      fontWeight: '700',
      marginBottom: 10,
      fontVariant: ['tabular-nums'],
      textAlign: 'right',
    },
    metrics: { gap: 4 },
    metric: { color: dash.muted, fontVariant: ['tabular-nums'], textAlign: 'right' },
    metricStrong: {
      color: dash.navy,
      fontWeight: '800',
      marginTop: 6,
      fontVariant: ['tabular-nums'],
      textAlign: 'right',
    },
    lastPay: {
      color: dash.gold,
      marginTop: 10,
      fontSize: 13,
      lineHeight: 18,
      fontVariant: ['tabular-nums'],
      textAlign: 'right',
    },
    row: { flexDirection: 'row-reverse', gap: 10, marginTop: 14 },
    fullRow: { marginTop: 10, flex: 0, alignSelf: 'stretch' },
    primary: {
      alignSelf: 'stretch',
      backgroundColor: dash.gold,
      borderRadius: 14,
      paddingVertical: space.md,
      minHeight: touch.minHeight,
      justifyContent: 'center',
    },
    primaryText: { color: dash.onGold, textAlign: 'center', fontWeight: '900' },
    secondary: {
      flex: 1,
      borderRadius: 14,
      paddingVertical: space.md,
      borderWidth: 1.5,
      borderColor: dash.gold,
      backgroundColor: dash.white,
      minHeight: touch.minHeight,
      justifyContent: 'center',
    },
    secondaryText: { color: dash.navy, textAlign: 'center', fontWeight: '800' },
  });
}

function createWalletCardStyles(
  colors: AppPalette,
  gradients: AppGradients,
  walletCardHalo: ViewStyle,
  resolved: 'light' | 'dark'
) {
  const primaryShadow =
    resolved === 'light' ? '0 8px 22px rgba(234, 88, 12, 0.22)' : '0 8px 22px rgba(245, 158, 11, 0.3)';
  return StyleSheet.create({
    wrap: {
      ...walletCardHalo,
      borderRadius: radius.xl,
      padding: 1,
      marginBottom: space.md - 2,
    },
    inner: {
      borderCurve: 'continuous',
      backgroundColor: colors.walletInner,
      borderRadius: radius.xl - 1,
      padding: space.md - 2,
      borderWidth: 1,
      borderColor: colors.walletBorderGlow,
    },
    title: { color: colors.text, fontSize: 18, fontWeight: '900' },
    sub: { color: colors.textMuted, marginTop: space.sm - 2, lineHeight: 20 },
    roleLine: { color: colors.primary, marginTop: space.sm - 2, fontWeight: '700' },
    block: { marginTop: space.md },
    muted: { color: colors.textSubtle },
    hint: { color: colors.placeholder, marginTop: space.sm, lineHeight: 20, marginBottom: space.md },
    cardLine: {
      color: colors.textSecondary,
      fontWeight: '700',
      marginBottom: space.sm + 2,
      fontVariant: ['tabular-nums'],
    },
    metrics: { gap: space.xs },
    metric: { color: colors.textMuted, fontVariant: ['tabular-nums'] },
    metricStrong: {
      color: colors.text,
      fontWeight: '800',
      marginTop: space.xs,
      fontVariant: ['tabular-nums'],
    },
    lastPay: {
      color: colors.accentIndigo,
      marginTop: space.sm + 2,
      fontSize: 13,
      lineHeight: 18,
      fontVariant: ['tabular-nums'],
    },
    row: { flexDirection: 'row', gap: space.sm + 2, marginTop: space.md },
    fullRow: { marginTop: space.sm + 2, flex: 0 },
    primary: {
      borderCurve: 'continuous',
      boxShadow: primaryShadow,
      alignSelf: 'stretch',
      backgroundColor: colors.primary,
      borderRadius: radius.md,
      paddingVertical: space.md,
      minHeight: touch.minHeight,
      justifyContent: 'center',
    },
    primaryText: { color: colors.onPrimary, textAlign: 'center', fontWeight: '900' },
    secondary: {
      borderCurve: 'continuous',
      flex: 1,
      borderRadius: radius.md,
      paddingVertical: space.md,
      borderWidth: 1,
      borderColor: colors.borderMuted,
      minHeight: touch.minHeight,
      justifyContent: 'center',
    },
    secondaryText: { color: colors.textSecondary, textAlign: 'center', fontWeight: '800' },
  });
}
