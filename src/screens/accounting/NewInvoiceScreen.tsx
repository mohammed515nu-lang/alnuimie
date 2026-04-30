import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { getApiErrorMessage } from '../../api/http';
import { useStore } from '../../store/useStore';
import { pressableRipple, touch, useAppTheme } from '../../theme';
import { DASHBOARD_RADIUS, getDashboardPalette, type DashboardPalette } from '../../theme/dashboardLight';

const STATUSES = ['مسودة', 'مرسلة', 'مدفوعة', 'متأخرة'] as const;

export function NewInvoiceScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { resolved } = useAppTheme();
  const dash = useMemo(() => getDashboardPalette(resolved), [resolved]);
  const styles = useMemo(() => createStyles(dash), [dash]);
  const [client, setClient] = useState('');
  const [amount, setAmount] = useState('');
  const [issue, setIssue] = useState('2026-04-21');
  const [due, setDue] = useState('2026-04-21');
  const [status, setStatus] = useState<(typeof STATUSES)[number]>('مسودة');
  const [saving, setSaving] = useState(false);

  const saveInvoice = async () => {
    if (saving) return;
    const clientName = client.trim();
    if (!clientName) {
      Alert.alert('بيانات ناقصة', 'أدخل اسم العميل.');
      return;
    }
    const numericAmount = Number(amount.trim());
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      Alert.alert('بيانات ناقصة', 'أدخل مبلغاً صحيحاً أكبر من صفر.');
      return;
    }
    try {
      setSaving(true);
      await useStore.getState().createInvoiceReport({
        title: `فاتورة ${clientName}`,
        amount: numericAmount,
        clientName,
        issueDate: issue.trim() || undefined,
        dueDate: due.trim() || undefined,
        statusLabel: status,
      });
      Alert.alert('تم', 'تم حفظ الفاتورة على الخادم.');
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
        <Text style={styles.headerTitle}>فاتورة جديدة</Text>
        <View style={styles.headerIconBtnHidden} />
      </View>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: 24 + insets.bottom }]}
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.label}>
          المشروع <Text style={styles.star}>*</Text>
        </Text>
        <Pressable style={styles.fakeInput} {...pressableRipple(dash.navyTint)}>
          <Ionicons name="folder-outline" size={20} color={dash.muted} style={styles.fieldIcon} />
          <Text style={styles.ph}>اختر المشروع...</Text>
        </Pressable>

        <Text style={styles.label}>
          اسم العميل <Text style={styles.star}>*</Text>
        </Text>
        <View style={styles.inputRow}>
          <Ionicons name="person-outline" size={20} color={dash.muted} style={styles.fieldIcon} />
          <TextInput
            placeholder="اسم العميل"
            placeholderTextColor={dash.muted}
            style={styles.inputFlex}
            value={client}
            onChangeText={setClient}
            textAlign="right"
          />
        </View>

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

        <Text style={styles.label}>تاريخ الإصدار</Text>
        <View style={styles.inputRow}>
          <Ionicons name="calendar-outline" size={20} color={dash.muted} style={styles.fieldIcon} />
          <TextInput style={styles.inputFlex} value={issue} onChangeText={setIssue} textAlign="right" />
        </View>

        <Text style={styles.label}>تاريخ الاستحقاق</Text>
        <View style={styles.inputRow}>
          <Ionicons name="calendar-outline" size={20} color={dash.muted} style={styles.fieldIcon} />
          <TextInput style={styles.inputFlex} value={due} onChangeText={setDue} textAlign="right" />
        </View>

        <Text style={styles.label}>الحالة</Text>
        <View style={styles.chips}>
          {STATUSES.map((s) => {
            const on = s === status;
            return (
              <Pressable
                key={s}
                onPress={() => setStatus(s)}
                style={[styles.chip, on && styles.chipOn]}
                {...pressableRipple(dash.goldTint)}
              >
                <Text style={[styles.chipText, on && styles.chipTextOn]}>{s}</Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable
          accessibilityRole="button"
          disabled={saving}
          onPress={() => void saveInvoice()}
          {...pressableRipple(dash.goldTint)}
          style={[styles.save, saving && { opacity: 0.65 }]}
        >
          <Text style={styles.saveText}>{saving ? 'جاري الحفظ...' : 'حفظ الفاتورة'}</Text>
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
    label: {
      color: dash.muted,
      fontSize: 13,
      fontWeight: '700',
      textAlign: 'right',
      marginBottom: 8,
      marginTop: 12,
    },
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
    inputFlex: {
      flex: 1,
      paddingVertical: 12,
      color: dash.darkText,
      fontSize: 16,
    },
    fieldIcon: { marginLeft: 4 },
    fakeInput: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      gap: 10,
      backgroundColor: dash.inputBg,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: dash.border,
      paddingHorizontal: 12,
      marginBottom: 8,
      minHeight: touch.minHeight,
    },
    ph: { color: dash.muted, textAlign: 'right', flex: 1, fontSize: 15 },
    chips: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
    chip: {
      paddingHorizontal: 14,
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
      backgroundColor: dash.gold,
      borderRadius: DASHBOARD_RADIUS,
      paddingVertical: 14,
      minHeight: touch.minHeight + 4,
      justifyContent: 'center',
      marginTop: 8,
    },
    saveText: { color: dash.onGold, textAlign: 'center', fontWeight: '900', fontSize: 16 },
  });
}
