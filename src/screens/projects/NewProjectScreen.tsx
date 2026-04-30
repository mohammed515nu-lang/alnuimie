import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { getApiErrorMessage } from '../../api/http';
import { aiAPI } from '../../api/services';
import { navigateFromRoot } from '../../navigation/rootNavigation';
import { useStore } from '../../store/useStore';
import { pressableRipple, space, touch } from '../../theme';
import { acceptedContractorsForClient } from '../../utils/connections';

/** مطابقة الرئيسية / المشاريع */
const D = {
  pageBg: '#F4EFE6',
  white: '#FFFFFF',
  navy: '#1a2b44',
  gold: '#a67c52',
  darkText: '#2a2520',
  muted: '#5c5348',
  border: '#E0D6C8',
  inputBg: '#FAF8F4',
  goldTint: 'rgba(166, 124, 82, 0.16)',
  navyTint: 'rgba(26, 43, 68, 0.08)',
};

const R = 16;

export function NewProjectScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(), []);

  const user = useStore((s) => s.user);
  const connections = useStore((s) => s.connections);
  const createProject = useStore((s) => s.createProject);
  const isClient = user?.role === 'client';

  const contractors = useMemo(
    () => (user ? acceptedContractorsForClient(user, connections) : []),
    [user, connections]
  );

  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState('');
  const [startDate, setStartDate] = useState('');
  const [expectedEndDate, setExpectedEndDate] = useState('');
  const [selectedContractorId, setSelectedContractorId] = useState<string | null>(null);
  const [manualContractorId, setManualContractorId] = useState('');
  const [saving, setSaving] = useState(false);
  const [estimating, setEstimating] = useState(false);

  useEffect(() => {
    if (isClient) void useStore.getState().refreshConnections();
  }, [isClient]);

  useEffect(() => {
    if (!isClient || contractors.length !== 1) return;
    setSelectedContractorId(contractors[0].id);
  }, [isClient, contractors]);

  const goBack = () => router.back();

  const save = async () => {
    if (saving) return;
    const normalizedName = projectName.trim();
    if (!normalizedName) {
      Alert.alert('بيانات ناقصة', 'الرجاء إدخال اسم المشروع.');
      return;
    }
    const normalizedLocation = location.trim();
    if (!normalizedLocation) {
      Alert.alert('بيانات ناقصة', 'الرجاء إدخال موقع المشروع قبل الإنشاء.');
      return;
    }
    let contractorId: string | undefined;
    if (isClient) {
      const fromManual = manualContractorId.trim();
      const fromList = selectedContractorId?.trim() ?? '';
      contractorId = fromManual || fromList;
      if (!contractorId) {
        Alert.alert(
          'بيانات ناقصة',
          'اختر مقاولًا من جهات الاتصال المقبولة، أو أدخل معرّف المقاول (ObjectId) يدوياً.'
        );
        return;
      }
    }
    const numericBudget = Number(budget.trim());
    const parsedBudget = Number.isFinite(numericBudget) && numericBudget > 0 ? numericBudget : undefined;

    try {
      setSaving(true);
      await createProject({
        name: normalizedName,
        location: normalizedLocation,
        description: description.trim() || undefined,
        budget: parsedBudget,
        startDate: startDate.trim() || undefined,
        expectedEndDate: expectedEndDate.trim() || undefined,
        status: 'pending',
        ...(contractorId ? { contractorId } : {}),
      });
      Alert.alert('تم', isClient ? 'تم إنشاء المشروع وربطه بالمقاول.' : 'تم إنشاء المشروع وحفظه على الخادم.');
      router.back();
    } catch (err) {
      Alert.alert('تعذر إنشاء المشروع', getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const estimateProject = async () => {
    if (estimating) return;
    const normalizedName = projectName.trim() || 'مشروع جديد';
    const normalizedLocation = location.trim() || 'غير محدد';
    const normalizedBudget = budget.trim() || 'غير محدد';
    try {
      setEstimating(true);
      const prompt = `أعطني تقدير تكلفة وخطة صرف أولية لمشروع باسم "${normalizedName}" في "${normalizedLocation}" بميزانية "${normalizedBudget}" وتاريخ بدء "${startDate || 'غير محدد'}" وانتهاء متوقع "${expectedEndDate || 'غير محدد'}".`;
      const res = await aiAPI.ask(prompt);
      Alert.alert('تقدير مبدئي من بنيان AI', res.answer);
    } catch (err) {
      Alert.alert('تعذر التقدير', getApiErrorMessage(err));
    } finally {
      setEstimating(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={goBack} style={styles.headerIconBtn} accessibilityRole="button" accessibilityLabel="إغلاق">
          <Ionicons name="close" size={24} color={D.navy} />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {isClient ? 'مشروع جديد مع مقاول' : 'مشروع جديد'}
        </Text>
        <Pressable onPress={goBack} style={styles.headerIconBtn} accessibilityRole="button" accessibilityLabel="رجوع">
          <Ionicons name="chevron-forward" size={22} color={D.navy} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: 120 + insets.bottom }]}
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        {isClient ? (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHead}>
              <Ionicons name="people-outline" size={20} color={D.gold} />
              <Text style={styles.sectionTitle}>ربط المشروع بمقاول</Text>
            </View>
            <Text style={styles.helpText}>
              يُسجَّل المشروع باسمك ويُربط مباشرة بالمقاول الذي تختاره (من الاتصالات المقبولة أو عبر المعرف).
            </Text>
            {contractors.length > 0 ? (
              <>
                <FieldLabel required>مقاول من جهات الاتصال</FieldLabel>
                {contractors.map((c) => {
                  const on = selectedContractorId === c.id && !manualContractorId.trim();
                  return (
                    <Pressable
                      key={c.id}
                      style={[styles.pickRow, on && styles.pickRowOn]}
                      onPress={() => {
                        setSelectedContractorId(c.id);
                        setManualContractorId('');
                      }}
                      {...pressableRipple(D.navyTint)}
                    >
                      <Ionicons name={on ? 'radio-button-on' : 'radio-button-off'} size={22} color={D.navy} />
                      <Text style={styles.pickName}>{c.name}</Text>
                    </Pressable>
                  );
                })}
              </>
            ) : (
              <Text style={styles.helpText}>
                لا يوجد مقاولون في قائمة «اتصالات مقبولة». يمكنك البحث عن مقاول ثم قبول طلب التواصل، أو إدخال
                معرّف المقاول يدوياً أدناه.
              </Text>
            )}
            <FieldLabel>أو معرّف المقاول (ObjectId)</FieldLabel>
            <TextInput
              placeholder="لصق معرّف المقاول إن لم يكن في القائمة"
              placeholderTextColor={D.muted}
              value={manualContractorId}
              onChangeText={(t) => {
                setManualContractorId(t);
                if (t.trim()) setSelectedContractorId(null);
              }}
              style={styles.input}
              textAlign="right"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Pressable
              style={styles.linkDiscover}
              onPress={() => navigateFromRoot('DiscoverUsers')}
              {...pressableRipple(D.navyTint)}
            >
              <Ionicons name="search-outline" size={18} color={D.gold} />
              <Text style={styles.linkDiscoverText}>البحث عن مقاولين</Text>
            </Pressable>
          </View>
        ) : null}

        <View style={styles.sectionCard}>
          <View style={styles.sectionHead}>
            <Ionicons name="document-text-outline" size={20} color={D.gold} />
            <Text style={styles.sectionTitle}>معلومات المشروع</Text>
          </View>
          <FieldLabel required>اسم المشروع</FieldLabel>
          <TextInput
            placeholder="مثال: مشروع فيلا الياسمين"
            placeholderTextColor={D.muted}
            style={styles.input}
            value={projectName}
            onChangeText={setProjectName}
            textAlign="right"
          />
          <FieldLabel>وصف المشروع</FieldLabel>
          <TextInput
            placeholder="وصف مختصر عن المشروع..."
            placeholderTextColor={D.muted}
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            textAlign="right"
            multiline
          />
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHead}>
            <Ionicons name="location-outline" size={20} color={D.gold} />
            <Text style={styles.sectionTitle}>الموقع والميزانية</Text>
          </View>
          <FieldLabel required>موقع المشروع</FieldLabel>
          <View style={styles.inputRow}>
            <Ionicons name="chevron-down" size={18} color={D.muted} />
            <TextInput
              placeholder="المدينة / المنطقة"
              placeholderTextColor={D.muted}
              style={[styles.input, styles.inputFlex]}
              value={location}
              onChangeText={setLocation}
              textAlign="right"
            />
          </View>
          <FieldLabel>الميزانية (ل.س)</FieldLabel>
          <TextInput
            placeholder="0"
            placeholderTextColor={D.muted}
            style={styles.input}
            value={budget}
            onChangeText={setBudget}
            keyboardType="decimal-pad"
            textAlign="right"
          />
          <Pressable
            accessibilityRole="button"
            onPress={() => void estimateProject()}
            disabled={estimating}
            {...pressableRipple(D.goldTint)}
            style={[styles.btnGold, estimating && styles.btnDisabled]}
          >
            <Ionicons name="calculator-outline" size={20} color={D.navy} style={{ marginLeft: space.sm }} />
            <Text style={styles.btnGoldText}>{estimating ? 'جاري التقدير...' : 'تقدير التكلفة'}</Text>
          </Pressable>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHead}>
            <Ionicons name="calendar-outline" size={20} color={D.gold} />
            <Text style={styles.sectionTitle}>التواريخ</Text>
          </View>
          <FieldLabel>تاريخ البدء</FieldLabel>
          <View style={styles.inputRow}>
            <Ionicons name="calendar-outline" size={18} color={D.muted} />
            <TextInput
              placeholder="YYYY-MM-DD"
              placeholderTextColor={D.muted}
              style={[styles.input, styles.inputFlex]}
              value={startDate}
              onChangeText={setStartDate}
              textAlign="right"
            />
          </View>
          <FieldLabel>تاريخ الانتهاء المتوقع</FieldLabel>
          <View style={styles.inputRow}>
            <Ionicons name="calendar-outline" size={18} color={D.muted} />
            <TextInput
              placeholder="YYYY-MM-DD"
              placeholderTextColor={D.muted}
              style={[styles.input, styles.inputFlex]}
              value={expectedEndDate}
              onChangeText={setExpectedEndDate}
              textAlign="right"
            />
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <Pressable
          accessibilityRole="button"
          onPress={save}
          disabled={saving}
          {...pressableRipple(D.goldTint)}
          style={[styles.createBtn, saving && styles.btnDisabled]}
        >
          <Ionicons name="checkmark-circle-outline" size={22} color={D.navy} style={{ marginLeft: space.sm }} />
          <Text style={styles.createBtnText}>{saving ? 'جاري الإنشاء...' : 'إنشاء المشروع'}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function FieldLabel({ children, required }: { children: string; required?: boolean }) {
  return (
    <Text style={fieldStyles.label}>
      {children}
      {required ? <Text style={fieldStyles.star}> *</Text> : null}
    </Text>
  );
}

const fieldStyles = StyleSheet.create({
  label: {
    color: D.muted,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'right',
    marginBottom: space.sm,
  },
  star: { color: D.navy, fontWeight: '900' },
});

function createStyles() {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: D.pageBg },
    header: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: D.border,
    },
    headerTitle: {
      flex: 1,
      textAlign: 'center',
      fontSize: 18,
      fontWeight: '900',
      color: D.navy,
    },
    headerIconBtn: {
      width: 44,
      height: 44,
      borderRadius: R,
      backgroundColor: D.white,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: D.border,
    },
    scroll: { paddingHorizontal: 16, paddingTop: 12, gap: 14 },
    sectionCard: {
      backgroundColor: D.white,
      borderRadius: R,
      borderWidth: 1,
      borderColor: D.border,
      padding: 16,
      elevation: 1,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 6,
    },
    sectionHead: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      gap: 8,
      marginBottom: 14,
      paddingBottom: 10,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: D.border,
    },
    sectionTitle: { fontSize: 16, fontWeight: '900', color: D.darkText, flex: 1, textAlign: 'right' },
    helpText: {
      color: D.muted,
      fontSize: 13,
      lineHeight: 20,
      textAlign: 'right',
      marginBottom: 14,
    },
    pickRow: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      gap: 10,
      paddingVertical: 12,
      paddingHorizontal: 12,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: D.border,
      backgroundColor: D.inputBg,
      marginBottom: 8,
    },
    pickRowOn: { borderColor: D.gold, backgroundColor: D.goldTint },
    pickName: { flex: 1, color: D.darkText, fontWeight: '800', fontSize: 15, textAlign: 'right' },
    linkDiscover: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      marginTop: 8,
      paddingVertical: 12,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: D.navy,
      backgroundColor: D.white,
    },
    linkDiscoverText: { color: D.navy, fontWeight: '900', fontSize: 14 },
    input: {
      backgroundColor: D.inputBg,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: D.border,
      paddingHorizontal: 14,
      paddingVertical: 12,
      color: D.darkText,
      marginBottom: 14,
      minHeight: touch.minHeight,
      fontSize: 15,
    },
    inputRow: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      backgroundColor: D.inputBg,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: D.border,
      paddingHorizontal: 12,
      marginBottom: 14,
      minHeight: touch.minHeight,
      gap: 8,
    },
    inputFlex: { flex: 1, borderWidth: 0, marginBottom: 0, minHeight: undefined, paddingHorizontal: 0 },
    textArea: { minHeight: 96, textAlignVertical: 'top' },
    btnGold: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: D.gold,
      borderRadius: 14,
      paddingVertical: 14,
      marginBottom: 0,
      minHeight: touch.minHeight,
    },
    btnGoldText: { color: D.navy, fontWeight: '900', fontSize: 15 },
    btnDisabled: { opacity: 0.6 },
    footer: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      paddingHorizontal: 16,
      paddingTop: 10,
      backgroundColor: D.pageBg,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: D.border,
    },
    createBtn: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: D.gold,
      borderRadius: R,
      paddingVertical: 16,
      minHeight: touch.minHeight + 4,
    },
    createBtnText: { color: D.navy, fontWeight: '900', fontSize: 16 },
  });
}
