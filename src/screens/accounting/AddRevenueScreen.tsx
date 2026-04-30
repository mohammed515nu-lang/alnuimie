import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { getApiErrorMessage } from '../../api/http';
import { useStore } from '../../store/useStore';
import { pressableRipple, touch, useAppTheme } from '../../theme';
import { DASHBOARD_RADIUS, getDashboardPalette, type DashboardPalette } from '../../theme/dashboardLight';

export function AddRevenueScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { resolved } = useAppTheme();
  const dash = useMemo(() => getDashboardPalette(resolved), [resolved]);
  const styles = useMemo(() => createStyles(dash), [dash]);
  const [amount, setAmount] = useState('');
  const [desc, setDesc] = useState('');
  const [date] = useState('2026-04-21');
  const [projectChip] = useState<'بدون'>('بدون');
  const [clientOpt, setClientOpt] = useState('');
  const [recv, setRecv] = useState(true);
  const [saving, setSaving] = useState(false);

  const saveRevenue = async () => {
    if (saving) return;
    const numericAmount = Number(amount.trim());
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      Alert.alert('بيانات ناقصة', 'أدخل مبلغاً صحيحاً أكبر من صفر.');
      return;
    }
    try {
      setSaving(true);
      await useStore.getState().createRevenueReport({
        title: `إيراد ${numericAmount.toLocaleString()} ل.س`,
        amount: numericAmount,
        description: desc.trim() || undefined,
        date,
        projectName: projectChip !== 'بدون' ? projectChip : undefined,
        clientName: clientOpt.trim() || undefined,
        received: recv,
      });
      Alert.alert('تم', 'تم حفظ الإيراد على الخادم.');
      router.back();
    } catch (err) {
      Alert.alert('تعذر الحفظ', getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.headerIconBtn} accessibilityRole="button" accessibilityLabel="إغلاق">
          <Ionicons name="close" size={24} color={dash.navy} />
        </Pressable>
        <Text style={styles.headerTitle}>إضافة إيراد</Text>
        <View style={styles.headerIconBtnHidden} />
      </View>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: 24 + insets.bottom }]}
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.label}>
          المبلغ <Text style={styles.star}>*</Text>
        </Text>
        <View style={styles.inputRow}>
          <Ionicons name="cash-outline" size={20} color={dash.muted} style={styles.fieldIcon} />
          <TextInput
            placeholder="0"
            placeholderTextColor={dash.muted}
            style={styles.inputFlex}
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            textAlign="right"
          />
        </View>
        <Text style={styles.label}>الوصف</Text>
        <View style={styles.inputRow}>
          <Ionicons name="document-text-outline" size={20} color={dash.muted} style={styles.fieldIcon} />
          <TextInput
            placeholder="وصف الإيراد"
            placeholderTextColor={dash.muted}
            style={styles.inputFlex}
            value={desc}
            onChangeText={setDesc}
            textAlign="right"
          />
        </View>
        <Text style={styles.label}>التاريخ</Text>
        <View style={[styles.inputRow, styles.inputStatic]}>
          <Ionicons name="calendar-outline" size={20} color={dash.muted} style={styles.fieldIcon} />
          <Text style={styles.staticDate}>{date}</Text>
        </View>
        <Text style={styles.label}>المشروع (اختياري)</Text>
        <View style={styles.chipRow}>
          <View style={[styles.chip, styles.chipOn]}>
            <Text style={styles.chipTextOn}>{projectChip}</Text>
          </View>
        </View>
        <Text style={styles.label}>اسم العميل (اختياري)</Text>
        <View style={styles.inputRow}>
          <Ionicons name="person-outline" size={20} color={dash.muted} style={styles.fieldIcon} />
          <TextInput style={styles.inputFlex} value={clientOpt} onChangeText={setClientOpt} textAlign="right" placeholder="—" placeholderTextColor={dash.muted} />
        </View>
        <Text style={styles.label}>الحالة</Text>
        <View style={styles.chipRow}>
          <Pressable onPress={() => setRecv(true)} {...pressableRipple(dash.goldTint)} style={[styles.chip, recv && styles.chipOn]}>
            <Text style={[styles.chipText, recv && styles.chipTextOn]}>مستلم</Text>
          </Pressable>
          <Pressable onPress={() => setRecv(false)} {...pressableRipple(dash.goldTint)} style={[styles.chip, !recv && styles.chipOn]}>
            <Text style={[styles.chipText, !recv && styles.chipTextOn]}>معلق</Text>
          </Pressable>
        </View>
        <Pressable
          disabled={saving}
          onPress={() => void saveRevenue()}
          {...pressableRipple(dash.goldTint)}
          style={[styles.save, saving && { opacity: 0.65 }]}
        >
          <Text style={styles.saveText}>{saving ? 'جاري الحفظ...' : 'حفظ الإيراد'}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(dash: DashboardPalette) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: dash.pageBg },
    header: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: 12,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: dash.border,
    },
    headerIconBtn: {
      width: 44,
      height: 44,
      borderRadius: DASHBOARD_RADIUS,
      backgroundColor: dash.white,
      borderWidth: 1,
      borderColor: dash.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerIconBtnHidden: { width: 44, height: 44 },
    headerTitle: { flex: 1, textAlign: 'center', color: dash.navy, fontWeight: '900', fontSize: 17 },
    scroll: { padding: 16, paddingTop: 8 },
    label: { color: dash.muted, textAlign: 'right', marginBottom: 8, marginTop: 12, fontWeight: '700', fontSize: 13 },
    star: { color: dash.darkText },
    inputRow: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      gap: 10,
      backgroundColor: dash.white,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: dash.border,
      paddingHorizontal: 12,
      minHeight: touch.minHeight,
      marginBottom: 8,
    },
    inputStatic: { backgroundColor: dash.inputBg },
    inputFlex: {
      flex: 1,
      paddingVertical: 12,
      color: dash.darkText,
      fontSize: 16,
    },
    staticDate: { flex: 1, textAlign: 'right', paddingVertical: 12, color: dash.darkText, fontSize: 16 },
    fieldIcon: { marginLeft: 4 },
    chipRow: { flexDirection: 'row-reverse', gap: 8, marginBottom: 12 },
    chip: {
      paddingHorizontal: 18,
      paddingVertical: 10,
      borderRadius: 12,
      backgroundColor: dash.white,
      borderWidth: 1,
      borderColor: dash.border,
    },
    chipOn: { borderColor: dash.gold, backgroundColor: dash.goldTint },
    chipText: { color: dash.muted, fontWeight: '700' },
    chipTextOn: { color: dash.navy, fontWeight: '800' },
    save: {
      marginTop: 8,
      backgroundColor: dash.gold,
      borderRadius: DASHBOARD_RADIUS,
      paddingVertical: 14,
      minHeight: touch.minHeight + 4,
      justifyContent: 'center',
    },
    saveText: { color: dash.onGold, textAlign: 'center', fontWeight: '900', fontSize: 16 },
  });
}
