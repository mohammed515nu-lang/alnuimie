import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { TopBar } from '../../components/TopBar';
import { useAppTheme, pressableRipple, radius, space, touch } from '../../theme';
import type { AppPalette } from '../../theme/palettes';

export function NewProjectScreen() {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createNewProjectStyles(colors), [colors]);
  const [clientName, setClientName] = useState('');
  const [city, setCity] = useState('');
  const [budget, setBudget] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  const save = () => {
    Alert.alert('قريباً', 'سيتم ربط إنشاء المشروع بالخادم لاحقاً.');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <TopBar title="مشروع جديد" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
      >
        <View style={styles.card}>
          <Text style={styles.label}>اسم العميل</Text>
          <TextInput
            placeholder="اسم صاحب المشروع"
            placeholderTextColor={colors.placeholder}
            style={styles.input}
            value={clientName}
            onChangeText={setClientName}
            textAlign="right"
          />
          <Text style={styles.label}>
            الموقع <Text style={styles.star}>*</Text>
          </Text>
          <View style={styles.inputRow}>
            <Ionicons name="chevron-down" size={18} color={colors.textMuted} />
            <TextInput
              placeholder="اختر المدينة..."
              placeholderTextColor={colors.placeholder}
              style={[styles.input, styles.inputFlex]}
              value={city}
              onChangeText={setCity}
              textAlign="right"
            />
          </View>
          <Text style={styles.label}>الميزانية (ل.س)</Text>
          <TextInput
            placeholder="0"
            placeholderTextColor={colors.placeholder}
            style={styles.input}
            value={budget}
            onChangeText={setBudget}
            keyboardType="decimal-pad"
            textAlign="right"
          />
          <Pressable
            accessibilityRole="button"
            onPress={() => Alert.alert('تقدير التكلفة', 'قريباً')}
            {...pressableRipple(colors.primaryTint12)}
            style={styles.estimate}
          >
            <Ionicons name="calculator-outline" size={20} color={colors.onPrimary} style={{ marginLeft: space.sm }} />
            <Text style={styles.estimateText}>تقدير التكلفة</Text>
          </Pressable>
          <Text style={styles.label}>تاريخ البدء</Text>
          <TextInput
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.placeholder}
            style={styles.input}
            value={start}
            onChangeText={setStart}
            textAlign="right"
          />
          <Text style={styles.label}>تاريخ الانتهاء</Text>
          <TextInput
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.placeholder}
            style={styles.input}
            value={end}
            onChangeText={setEnd}
            textAlign="right"
          />
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Pressable
          accessibilityRole="button"
          onPress={save}
          {...pressableRipple(colors.primaryTint18)}
          style={styles.createBtn}
        >
          <Ionicons name="checkmark-circle-outline" size={22} color={colors.onPrimary} style={{ marginLeft: space.sm }} />
          <Text style={styles.createBtnText}>إنشاء المشروع</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function createNewProjectStyles(colors: AppPalette) {
  return StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: space.lg, paddingBottom: space.xxl },
  card: {
    backgroundColor: colors.surfaceMid,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    padding: space.lg,
  },
  label: { color: colors.textMuted, fontSize: 13, fontWeight: '700', textAlign: 'right', marginBottom: space.sm },
  star: { color: colors.text },
  input: {
    backgroundColor: colors.background,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    paddingHorizontal: space.md,
    paddingVertical: space.md,
    color: colors.textSecondary,
    marginBottom: space.md,
    minHeight: touch.minHeight,
  },
  inputRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    paddingHorizontal: space.md,
    marginBottom: space.md,
    minHeight: touch.minHeight,
  },
  inputFlex: { flex: 1, borderWidth: 0, marginBottom: 0, minHeight: undefined },
  estimate: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: space.md,
    marginBottom: space.md,
    minHeight: touch.minHeight,
  },
  estimateText: { color: colors.onPrimary, fontWeight: '900', fontSize: 15 },
  footer: { padding: space.lg, paddingBottom: space.xl, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
  createBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: space.md + 2,
    minHeight: touch.minHeight + 4,
  },
  createBtnText: { color: colors.onPrimary, fontWeight: '900', fontSize: 16 },
});
}
