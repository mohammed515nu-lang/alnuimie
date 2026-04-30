import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { TopBar } from '../../components/TopBar';
import { space, useAppTheme } from '../../theme';
import { DASHBOARD_RADIUS, getDashboardPalette, type DashboardPalette } from '../../theme/dashboardLight';

const ROWS = [
  { label: 'نقل', value: '٠ ل.س' },
  { label: 'إدارية', value: '٠ ل.س' },
  { label: 'أخرى', value: '٠ ل.س' },
];

export function ReportsScreen() {
  const insets = useSafeAreaInsets();
  const { resolved } = useAppTheme();
  const dash = useMemo(() => getDashboardPalette(resolved), [resolved]);
  const styles = useMemo(() => createStyles(dash), [dash]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <TopBar tone="beige" title="التقارير المالية" />
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: 24 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.intro}>ملخص حسب الفئات (تجريبي)</Text>
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
          <Text style={styles.placeholder}>لا توجد حركات مسجّلة</Text>
        </View>
        <Text style={styles.section}>تقارير محفوظة على الخادم</Text>
        <View style={styles.card}>
          <Text style={styles.placeholder2}>لا توجد تقارير مولّدة بعد. اسحب للتحديث من الشاشات ذات القوائم عند توفر المزامنة.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(dash: DashboardPalette) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: dash.pageBg },
    scroll: { paddingHorizontal: 16, paddingTop: 4 },
    intro: {
      color: dash.muted,
      fontSize: 13,
      textAlign: 'right',
      marginBottom: space.sm,
    },
    card: {
      backgroundColor: dash.white,
      borderRadius: DASHBOARD_RADIUS,
      borderWidth: 1,
      borderColor: dash.border,
      padding: space.md,
      marginBottom: space.md,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
    },
    row: { flexDirection: 'row-reverse', justifyContent: 'space-between', paddingVertical: 10 },
    lab: { color: dash.darkText, fontWeight: '700' },
    val: { color: dash.gold, fontWeight: '800' },
    div: { height: StyleSheet.hairlineWidth, backgroundColor: dash.border },
    section: { color: dash.navy, fontWeight: '900', fontSize: 16, textAlign: 'right', marginBottom: space.sm },
    placeholder: { color: dash.muted, textAlign: 'center', paddingVertical: space.lg },
    placeholder2: { color: dash.muted, textAlign: 'center', paddingVertical: space.md, lineHeight: 22 },
  });
}
