import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { TopBar } from '../../components/TopBar';
import { pressableRipple, touch, useAppTheme } from '../../theme';
import { DASHBOARD_RADIUS, getDashboardPalette, type DashboardPalette } from '../../theme/dashboardLight';

const DEFAULTS = ['مواد', 'عمالة', 'معدات', 'نقل', 'إدارية', 'أخرى'];

export function ExpenseCategoriesScreen() {
  const insets = useSafeAreaInsets();
  const { resolved } = useAppTheme();
  const dash = useMemo(() => getDashboardPalette(resolved), [resolved]);
  const styles = useMemo(() => createStyles(dash), [dash]);
  const [items, setItems] = useState(DEFAULTS);

  const editAt = (i: number) => {
    Alert.alert('تعديل', `تعديل «${items[i]}» — سيتم مع الخادم.`);
  };
  const removeAt = (i: number) => {
    Alert.alert('حذف', `حذف «${items[i]}»؟`, [
      { text: 'إلغاء', style: 'cancel' },
      { text: 'حذف', style: 'destructive', onPress: () => setItems((prev) => prev.filter((_, j) => j !== i)) },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <TopBar
        tone="beige"
        title="فئات المصروفات"
        leftAction={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="إضافة فئة"
            onPress={() => setItems((prev) => [...prev, `فئة ${prev.length + 1}`])}
            hitSlop={12}
            style={styles.headerAddWrap}
          >
            <Ionicons name="add" size={26} color={dash.navy} />
          </Pressable>
        }
      />
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: 24 + insets.bottom }]}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        {items.map((label, i) => (
          <View key={`${label}-${i}`} style={styles.card}>
            <View style={styles.iconTile}>
              <Ionicons name="pricetag-outline" size={22} color={dash.gold} />
            </View>
            <Text style={styles.label}>{label}</Text>
            <Pressable onPress={() => editAt(i)} {...pressableRipple(dash.goldTint)} style={styles.iconBtn}>
              <Ionicons name="pencil" size={20} color={dash.navy} />
            </Pressable>
            <Pressable onPress={() => removeAt(i)} {...pressableRipple('rgba(185, 28, 28, 0.12)')} style={styles.iconBtn}>
              <Ionicons name="trash-outline" size={20} color={dash.danger} />
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(dash: DashboardPalette) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: dash.pageBg },
    scroll: { paddingHorizontal: 16, paddingTop: 4 },
    headerAddWrap: {
      width: 40,
      height: 40,
      borderRadius: DASHBOARD_RADIUS,
      backgroundColor: dash.white,
      borderWidth: 1,
      borderColor: dash.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    card: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      backgroundColor: dash.white,
      borderRadius: DASHBOARD_RADIUS,
      borderWidth: 1,
      borderColor: dash.border,
      padding: 14,
      marginBottom: 10,
      minHeight: touch.minHeight + 4,
      gap: 12,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
    },
    iconTile: {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: dash.goldTint,
      alignItems: 'center',
      justifyContent: 'center',
    },
    label: { flex: 1, color: dash.darkText, fontWeight: '800', fontSize: 16, textAlign: 'right' },
    iconBtn: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: dash.inputBg,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: dash.border,
    },
  });
}
