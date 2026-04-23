import { useCallback, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';

import { useStore } from '../../store/useStore';
import { pushStackRoute } from '../../navigation/href';
import { useAppTheme, pressableRipple, radius, space, touch } from '../../theme';
import type { AppGradients, AppPalette } from '../../theme/palettes';

type Props = {
  subtitle?: string;
};

export function WalletCard({ subtitle }: Props) {
  const user = useStore((s) => s.user);
  const paymentCards = useStore((s) => s.paymentCards);
  const walletSummary = useStore((s) => s.walletSummary);
  const transfers = useStore((s) => s.transfers);
  const refreshPaymentCards = useStore((s) => s.refreshPaymentCards);
  const refreshTransfers = useStore((s) => s.refreshTransfers);
  const refreshWalletSummary = useStore((s) => s.refreshWalletSummary);

  const load = useCallback(async () => {
    await Promise.all([refreshPaymentCards(), refreshTransfers(), refreshWalletSummary()]);
  }, [refreshPaymentCards, refreshTransfers, refreshWalletSummary]);

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
  const styles = useMemo(
    () => createWalletCardStyles(colors, gradients, walletCardHalo, resolved),
    [colors, gradients, walletCardHalo, resolved]
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

  return (
    <LinearGradient colors={[...gradients.walletCard]} style={styles.wrap}>
      <View style={styles.inner}>
        <Text style={styles.title}>المحفظة</Text>
        {subtitle ? <Text style={styles.sub}>{subtitle}</Text> : null}
        <Text style={styles.roleLine}>{roleLabel}</Text>

        {!defaultCard ? (
          <View style={styles.block}>
            <Text style={styles.muted}>لا توجد بطاقة دفع محفوظة بعد.</Text>
            <Text style={styles.hint}>أضف بطاقة بأمان عبر Stripe، ثم يظهر ملخص الرصيد والتحويلات من الخادم.</Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => pushStackRoute('AddCard')}
              {...pressableRipple(colors.primaryTint18)}
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
                {...pressableRipple(colors.primaryTint12)}
                style={styles.secondary}
              >
                <Text style={styles.secondaryText}>بطاقة أخرى</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={() => pushStackRoute('Transfers')}
                {...pressableRipple(colors.primaryTint12)}
                style={styles.secondary}
              >
                <Text style={styles.secondaryText}>التحويلات</Text>
              </Pressable>
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={() => pushStackRoute('ManageCards')}
              {...pressableRipple(colors.primaryTint12)}
              style={[styles.secondary, styles.fullRow]}
            >
              <Text style={styles.secondaryText}>إدارة البطاقات</Text>
            </Pressable>
          </View>
        )}
      </View>
    </LinearGradient>
  );
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
  cardLine: { color: colors.textSecondary, fontWeight: '700', marginBottom: space.sm + 2, fontVariant: ['tabular-nums'] },
  metrics: { gap: space.xs },
  metric: { color: colors.textMuted, fontVariant: ['tabular-nums'] },
  metricStrong: {
    color: colors.text,
    fontWeight: '800',
    marginTop: space.xs,
    fontVariant: ['tabular-nums'],
  },
  lastPay: { color: colors.accentIndigo, marginTop: space.sm + 2, fontSize: 13, lineHeight: 18, fontVariant: ['tabular-nums'] },
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
