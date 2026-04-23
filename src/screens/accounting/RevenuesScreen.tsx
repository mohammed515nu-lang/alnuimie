import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { TopBar } from '../../components/TopBar';
import { pushStackRoute } from '../../navigation/href';
import { useAppTheme, pressableRipple, radius, space, touch } from '../../theme';
import type { AppPalette } from '../../theme/palettes';

export function RevenuesScreen() {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createRevenuesStyles(colors), [colors]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <TopBar
        title="الإيرادات"
        leftAction={
          <Pressable onPress={() => pushStackRoute('AddRevenue')} hitSlop={12}>
            <Ionicons name="add" size={28} color={colors.text} />
          </Pressable>
        }
      />
      <View style={styles.summary}>
        <Text style={styles.sumLabel}>إجمالي الإيرادات</Text>
        <View style={styles.sumRow}>
          <Text style={styles.sumVal}>٠ ل.س</Text>
          <Ionicons name="trending-up" size={18} color={colors.success} style={{ marginRight: space.sm }} />
        </View>
      </View>
      <View style={styles.emptyWrap}>
        <Ionicons name="wallet-outline" size={80} color={colors.textMuted} />
        <Text style={styles.empty}>لا توجد إيرادات</Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => pushStackRoute('AddRevenue')}
          {...pressableRipple(colors.primaryTint12)}
          style={styles.cta}
        >
          <Text style={styles.ctaText}>إضافة إيراد</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function createRevenuesStyles(colors: AppPalette) {
  return StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  summary: {
    marginHorizontal: space.lg,
    backgroundColor: colors.surfaceMid,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    padding: space.lg,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: space.md,
  },
  sumRow: { flexDirection: 'row-reverse', alignItems: 'center' },
  sumVal: { color: colors.success, fontWeight: '900', fontSize: 18 },
  sumLabel: { color: colors.textMuted, fontWeight: '700', textAlign: 'right' },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 80 },
  empty: { color: colors.textMuted, marginTop: space.lg, fontWeight: '700' },
  cta: {
    marginTop: space.xl,
    backgroundColor: colors.primary,
    paddingHorizontal: space.xxl,
    paddingVertical: space.md,
    borderRadius: radius.lg,
    minHeight: touch.minHeight,
    justifyContent: 'center',
  },
  ctaText: { color: colors.onPrimary, fontWeight: '900', fontSize: 16 },
});
}
