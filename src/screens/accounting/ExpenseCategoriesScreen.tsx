import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { TopBar } from '../../components/TopBar';
import { useAppTheme, pressableRipple, radius, space, touch } from '../../theme';
import type { AppPalette } from '../../theme/palettes';

const DEFAULTS = ['مواد', 'عمالة', 'معدات', 'نقل', 'إدارية', 'أخرى'];

export function ExpenseCategoriesScreen() {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createExpenseCategoriesStyles(colors), [colors]);
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
        title="فئات المصروفات"
        leftAction={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="إضافة فئة"
            onPress={() => setItems((prev) => [...prev, `فئة ${prev.length + 1}`])}
            hitSlop={12}
          >
            <Ionicons name="add" size={28} color={colors.text} />
          </Pressable>
        }
      />
      <ScrollView contentContainerStyle={styles.scroll} contentInsetAdjustmentBehavior="automatic">
        {items.map((label, i) => (
          <View key={`${label}-${i}`} style={styles.card}>
            <Text style={styles.label}>{label}</Text>
            <Pressable onPress={() => editAt(i)} {...pressableRipple(colors.primaryTint12)} style={styles.iconBtn}>
              <Ionicons name="pencil" size={20} color={colors.primary} />
            </Pressable>
            <Pressable onPress={() => removeAt(i)} {...pressableRipple('rgba(239,68,68,0.15)')} style={styles.iconBtn}>
              <Ionicons name="trash-outline" size={20} color={colors.danger} />
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function createExpenseCategoriesStyles(colors: AppPalette) {
  return StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: space.lg, paddingBottom: space.xxl },
  card: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: colors.surfaceMid,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    padding: space.md,
    marginBottom: space.sm + 2,
    minHeight: touch.minHeight + 4,
    gap: space.md,
  },
  label: { flex: 1, color: colors.text, fontWeight: '800', fontSize: 16, textAlign: 'right' },
  iconBtn: { padding: space.sm },
});
}
