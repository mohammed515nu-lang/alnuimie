import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { WalletCard } from '../../components/wallet/WalletCard';
import { pushStackRoute } from '../../navigation/href';
import { useStore } from '../../store/useStore';
import { useAppTheme, pressableRipple, radius, space, touch } from '../../theme';
import type { AppPalette } from '../../theme/palettes';

export function WalletHomeScreen() {
  const user = useStore((s) => s.user);
  const isClient = user?.role === 'client';
  const { colors, surfaceLift, resolved } = useAppTheme();
  const styles = useMemo(
    () => createWalletHomeStyles(colors, surfaceLift, resolved),
    [colors, surfaceLift, resolved]
  );

  return (
    <ScrollView
      contentContainerStyle={styles.root}
      keyboardShouldPersistTaps="handled"
      contentInsetAdjustmentBehavior="automatic"
    >
      <Text style={styles.intro}>
        {isClient
          ? 'من هنا تدير بطاقاتك وتدفع للمقاولين بعد الاتصال.'
          : 'من هنا تدير بطاقاتك وتسجّل دفعات الموردين والمقبوضات.'}
      </Text>
      <WalletCard />

      <View style={styles.card}>
        <Text style={styles.cardTitle}>إجراءات</Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => pushStackRoute('ManageCards')}
          {...pressableRipple(colors.primaryTint18)}
          style={styles.primary}
        >
          <Text style={styles.primaryText}>إدارة البطاقات</Text>
        </Pressable>
        {user?.role === 'client' ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => pushStackRoute('PayContractor')}
            {...pressableRipple(colors.primaryTint12)}
            style={styles.secondary}
          >
            <Text style={styles.secondaryText}>دفع لمقاول متصل</Text>
          </Pressable>
        ) : null}
        {user?.role === 'contractor' ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => pushStackRoute('ContractorPaySupplier')}
            {...pressableRipple(colors.primaryTint12)}
            style={styles.secondary}
          >
            <Text style={styles.secondaryText}>دفع للمورد</Text>
          </Pressable>
        ) : null}
        <Pressable
          accessibilityRole="button"
          onPress={() => pushStackRoute('Transfers')}
          {...pressableRipple(colors.primaryTint12)}
          style={styles.secondary}
        >
          <Text style={styles.secondaryText}>قائمة التحويلات</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

function createWalletHomeStyles(
  colors: AppPalette,
  surfaceLift: ViewStyle,
  resolved: 'light' | 'dark'
) {
  const primaryShadow =
    resolved === 'light' ? '0 8px 20px rgba(234, 88, 12, 0.22)' : '0 8px 20px rgba(245, 158, 11, 0.28)';
  return StyleSheet.create({
  root: { padding: space.lg, paddingBottom: space.xxl + 4, backgroundColor: colors.background },
  intro: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'right',
    marginBottom: space.md,
    fontWeight: '600',
  },
  card: {
    ...surfaceLift,
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.xl,
    padding: space.md - 2,
    marginBottom: space.md,
  },
  cardTitle: { color: colors.text, fontWeight: '900', marginBottom: space.sm + 2 },
  primary: {
    borderCurve: 'continuous',
    boxShadow: primaryShadow,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: space.md,
    marginTop: space.sm,
    minHeight: touch.minHeight,
    justifyContent: 'center',
  },
  primaryText: { color: colors.onPrimary, textAlign: 'center', fontWeight: '900' },
  secondary: {
    borderRadius: radius.md,
    paddingVertical: space.md,
    marginTop: space.sm + 2,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    minHeight: touch.minHeight,
    justifyContent: 'center',
  },
  secondaryText: { color: colors.textSecondary, textAlign: 'center', fontWeight: '800' },
});
}
