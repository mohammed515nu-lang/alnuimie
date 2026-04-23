import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { TopBar } from '../../components/TopBar';
import { pushStackRoute } from '../../navigation/href';
import { useAppTheme, pressableRipple, radius, space, touch } from '../../theme';
import type { AppPalette } from '../../theme/palettes';

export function InvoicesScreen() {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createInvoicesStyles(colors), [colors]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <TopBar
        title="الفواتير"
        leftAction={
          <Pressable
            accessibilityRole="button"
            onPress={() => pushStackRoute('NewInvoice')}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="add" size={28} color={colors.text} />
          </Pressable>
        }
      />
      <View style={styles.emptyWrap}>
        <Ionicons name="document-text-outline" size={80} color={colors.textMuted} />
        <Text style={styles.empty}>لا توجد فواتير</Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => pushStackRoute('NewInvoice')}
          {...pressableRipple(colors.primaryTint12)}
          style={styles.cta}
        >
          <Text style={styles.ctaText}>فاتورة جديدة</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function createInvoicesStyles(colors: AppPalette) {
  return StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 80 },
  empty: { color: colors.textMuted, fontSize: 16, fontWeight: '700', marginTop: space.lg },
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
