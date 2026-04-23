import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TopBar } from '../../components/TopBar';
import { useAppTheme, radius, space } from '../../theme';
import type { AppPalette } from '../../theme/palettes';

const ROWS = [
  { label: 'نقل', value: '٠ ل.س' },
  { label: 'إدارية', value: '٠ ل.س' },
  { label: 'أخرى', value: '٠ ل.س' },
];

export function ReportsScreen() {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createReportsStyles(colors), [colors]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <TopBar title="التقارير" />
      <View style={styles.card}>
        {ROWS.map((r, i) => (
          <View key={r.label}>
            {i > 0 ? <View style={styles.div} /> : null}
            <View style={styles.row}>
              <Text style={styles.val}>{r.value}</Text>
              <Text style={styles.lab}>{r.label}</Text>
            </View>
          </View>
        ))}
      </View>
      <Text style={styles.section}>حركة شهرية</Text>
      <View style={styles.card}>
        <Text style={styles.placeholder}>لا توجد حركات</Text>
      </View>
      <Text style={styles.section}>تقارير محفوظة على الخادم</Text>
      <View style={styles.card}>
        <Text style={styles.placeholder2}>لا توجد تقارير مولّدة بعد (أو اسحب للتحديث من الشاشة الرئيسية)</Text>
      </View>
    </SafeAreaView>
  );
}

function createReportsStyles(colors: AppPalette) {
  return StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background, paddingHorizontal: space.lg },
  card: {
    backgroundColor: colors.surfaceMid,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    padding: space.md,
    marginBottom: space.md,
  },
  row: { flexDirection: 'row-reverse', justifyContent: 'space-between', paddingVertical: space.sm + 2 },
  lab: { color: colors.textSecondary, fontWeight: '700' },
  val: { color: colors.reportValue, fontWeight: '800' },
  div: { height: StyleSheet.hairlineWidth, backgroundColor: colors.borderMuted },
  section: { color: colors.text, fontWeight: '900', fontSize: 16, textAlign: 'right', marginBottom: space.sm },
  placeholder: { color: colors.placeholder, textAlign: 'center', paddingVertical: space.lg },
  placeholder2: { color: colors.placeholder, textAlign: 'center', paddingVertical: space.md, lineHeight: 22 },
});
}
