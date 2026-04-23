import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { useAppTheme, pressableRipple, radius, space, touch } from '../../theme';
import type { AppPalette } from '../../theme/palettes';

const STATUSES = ['مسودة', 'مرسلة', 'مدفوعة', 'متأخرة'] as const;

export function NewInvoiceScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const styles = useMemo(() => createNewInvoiceStyles(colors), [colors]);
  const [client, setClient] = useState('');
  const [amount, setAmount] = useState('');
  const [issue, setIssue] = useState('2026-04-21');
  const [due, setDue] = useState('2026-04-21');
  const [status, setStatus] = useState<(typeof STATUSES)[number]>('مسودة');

  const header = (
    <View style={styles.headerRow}>
      <Pressable onPress={() => router.back()} hitSlop={12}>
        <Text style={styles.cancel}>إلغاء</Text>
      </Pressable>
      <Text style={styles.headerTitle}>فاتورة جديدة</Text>
      <View style={{ width: 48 }} />
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {header}
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
      >
        <Text style={styles.label}>
          المشروع <Text style={styles.star}>*</Text>
        </Text>
        <Pressable style={styles.fakeInput} {...pressableRipple(colors.primaryTint12)}>
          <Text style={styles.ph}>اختر المشروع...</Text>
        </Pressable>

        <Text style={styles.label}>
          اسم العميل <Text style={styles.star}>*</Text>
        </Text>
        <TextInput
          placeholder="اسم العميل"
          placeholderTextColor={colors.placeholder}
          style={styles.input}
          value={client}
          onChangeText={setClient}
          textAlign="right"
        />

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
          textAlign="left"
        />

        <Text style={styles.label}>تاريخ الإصدار</Text>
        <TextInput style={styles.input} value={issue} onChangeText={setIssue} textAlign="right" />

        <Text style={styles.label}>تاريخ الاستحقاق</Text>
        <TextInput style={styles.input} value={due} onChangeText={setDue} textAlign="right" />

        <Text style={styles.label}>الحالة</Text>
        <View style={styles.chips}>
          {STATUSES.map((s) => {
            const on = s === status;
            return (
              <Pressable
                key={s}
                onPress={() => setStatus(s)}
                style={[styles.chip, on && styles.chipOn]}
                {...pressableRipple(colors.primaryTint12)}
              >
                <Text style={[styles.chipText, on && styles.chipTextOn]}>{s}</Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => Alert.alert('تم', 'سيتم الحفظ عند ربط الخادم.')}
          {...pressableRipple(colors.primaryTint18)}
          style={styles.save}
        >
          <Text style={styles.saveText}>حفظ الفاتورة</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function createNewInvoiceStyles(colors: AppPalette) {
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
  cancel: { color: colors.textMuted, fontWeight: '700', fontSize: 16, width: 48, textAlign: 'right' },
  headerTitle: { flex: 1, textAlign: 'center', color: colors.text, fontWeight: '900', fontSize: 17 },
  scroll: { padding: space.lg, paddingBottom: space.xxl },
  label: { color: colors.textMuted, fontSize: 13, fontWeight: '700', textAlign: 'right', marginBottom: space.sm, marginTop: space.sm },
  star: { color: colors.text },
  input: {
    backgroundColor: colors.surfaceMid,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    paddingHorizontal: space.md,
    paddingVertical: space.md,
    color: colors.textSecondary,
    marginBottom: space.sm,
    minHeight: touch.minHeight,
  },
  fakeInput: {
    backgroundColor: colors.surfaceMid,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    paddingHorizontal: space.md,
    paddingVertical: space.md,
    marginBottom: space.sm,
    minHeight: touch.minHeight,
    justifyContent: 'center',
  },
  ph: { color: colors.placeholder, textAlign: 'right' },
  chips: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: space.sm, marginBottom: space.lg },
  chip: {
    paddingHorizontal: space.md,
    paddingVertical: space.sm + 2,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMid,
    borderWidth: 1,
    borderColor: colors.borderMuted,
  },
  chipOn: { borderColor: colors.primary, backgroundColor: colors.primaryTint12 },
  chipText: { color: colors.textMuted, fontWeight: '700' },
  chipTextOn: { color: colors.primary },
  save: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: space.md + 2,
    minHeight: touch.minHeight + 4,
    justifyContent: 'center',
    marginTop: space.md,
  },
  saveText: { color: colors.onPrimary, textAlign: 'center', fontWeight: '900', fontSize: 16 },
});
}
