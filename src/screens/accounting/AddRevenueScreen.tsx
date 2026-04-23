import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { useAppTheme, pressableRipple, radius, space, touch } from '../../theme';
import type { AppPalette } from '../../theme/palettes';

export function AddRevenueScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const styles = useMemo(() => createAddRevenueStyles(colors), [colors]);
  const [amount, setAmount] = useState('');
  const [desc, setDesc] = useState('');
  const [date] = useState('2026-04-21');
  const [projectChip] = useState<'بدون'>('بدون');
  const [clientOpt, setClientOpt] = useState('');
  const [recv, setRecv] = useState(true);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.cancel}>إلغاء</Text>
        </Pressable>
        <Text style={styles.headerTitle}>إضافة إيراد</Text>
        <View style={{ width: 48 }} />
      </View>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
      >
        <Text style={styles.label}>
          المبلغ <Text style={styles.star}>*</Text>
        </Text>
        <TextInput
          placeholder="0"
          placeholderTextColor={colors.placeholder}
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
          textAlign="right"
        />
        <Text style={styles.label}>الوصف</Text>
        <TextInput
          placeholder="وصف الإيراد"
          placeholderTextColor={colors.placeholder}
          style={styles.input}
          value={desc}
          onChangeText={setDesc}
          textAlign="right"
        />
        <Text style={styles.label}>التاريخ</Text>
        <Text style={styles.input}>{date}</Text>
        <Text style={styles.label}>المشروع (اختياري)</Text>
        <View style={styles.chipRow}>
          <View style={[styles.chip, styles.chipOn]}>
            <Text style={styles.chipTextOn}>{projectChip}</Text>
          </View>
        </View>
        <Text style={styles.label}>اسم العميل (اختياري)</Text>
        <TextInput style={styles.input} value={clientOpt} onChangeText={setClientOpt} textAlign="right" />
        <Text style={styles.label}>الحالة</Text>
        <View style={styles.chipRow}>
          <Pressable onPress={() => setRecv(true)} style={[styles.chip, recv && styles.chipOn]}>
            <Text style={[styles.chipText, recv && styles.chipTextOn]}>مستلم</Text>
          </Pressable>
          <Pressable onPress={() => setRecv(false)} style={[styles.chip, !recv && styles.chipOn]}>
            <Text style={[styles.chipText, !recv && styles.chipTextOn]}>معلق</Text>
          </Pressable>
        </View>
        <Pressable
          onPress={() => Alert.alert('تم', 'سيتم الحفظ مع الخادم.')}
          {...pressableRipple(colors.primaryTint18)}
          style={styles.save}
        >
          <Text style={styles.saveText}>حفظ الإيراد</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function createAddRevenueStyles(colors: AppPalette) {
  return StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  headerRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: space.md,
    paddingBottom: space.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderMuted,
  },
  cancel: { color: colors.textMuted, fontWeight: '700', width: 48, textAlign: 'right' },
  headerTitle: { flex: 1, textAlign: 'center', color: colors.text, fontWeight: '900', fontSize: 17 },
  scroll: { padding: space.lg, paddingBottom: space.xxl },
  label: { color: colors.textMuted, textAlign: 'right', marginBottom: space.sm, marginTop: space.sm, fontWeight: '700' },
  star: { color: colors.text },
  input: {
    backgroundColor: colors.surfaceMid,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    padding: space.md,
    color: colors.textSecondary,
    marginBottom: space.sm,
    minHeight: touch.minHeight,
    textAlign: 'right',
  },
  chipRow: { flexDirection: 'row-reverse', gap: space.sm, marginBottom: space.md },
  chip: {
    paddingHorizontal: space.lg,
    paddingVertical: space.sm + 2,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMid,
    borderWidth: 1,
    borderColor: colors.borderMuted,
  },
  chipOn: { borderColor: colors.primary, backgroundColor: colors.primaryTint12 },
  chipText: { color: colors.textMuted, fontWeight: '700' },
  chipTextOn: { color: colors.primary, fontWeight: '800' },
  save: {
    marginTop: space.lg,
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: space.md + 2,
    minHeight: touch.minHeight + 4,
    justifyContent: 'center',
  },
  saveText: { color: colors.onPrimary, textAlign: 'center', fontWeight: '900', fontSize: 16 },
});
}
