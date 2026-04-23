import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useStore } from '../../store/useStore';
import { SyriaFlag } from '../../components/SyriaFlag';
import { useAppTheme, pressableRipple, radius, space, touch } from '../../theme';
import { hapticLight, hapticSuccess } from '../../utils/haptics';
import type { AppPalette } from '../../theme/palettes';

const SUGGESTIONS_CONTRACTOR: { text: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { text: 'كيف أحسب هامش الربح لكل مشروع؟', icon: 'cash-outline' },
  { text: 'أفضل خطة شراء مواد لتقليل التكلفة', icon: 'construct-outline' },
  { text: 'كيف أدفع للموردين دون تعثر؟', icon: 'people-outline' },
  { text: 'متى أعيد طلب المواد للمخزون؟', icon: 'cube-outline' },
  { text: 'بنود عقد مهمة للمقاول', icon: 'document-text-outline' },
  { text: 'سلامة العمال في الموقع النشط', icon: 'shield-checkmark-outline' },
];

const SUGGESTIONS_CLIENT: { text: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { text: 'كيف أقارن عروض مقاولين مختلفين؟', icon: 'stats-chart-outline' },
  { text: 'ما بنود يجب أن تكون في عقد التنفيذ؟', icon: 'document-text-outline' },
  { text: 'كيف أتابع دفعاتي للمقاول بأمان؟', icon: 'shield-checkmark-outline' },
  { text: 'مؤشرات جودة التنفيذ أثناء المشروع', icon: 'eye-outline' },
  { text: 'متى أصرف دفعة جزئية ومتى الخلاص؟', icon: 'calendar-outline' },
  { text: 'كيف أتواصل مع المقاول بشكل واضح؟', icon: 'chatbubbles-outline' },
];

export function BunyanAIScreen() {
  const [q, setQ] = useState('');
  const role = useStore((s) => s.user?.role);
  const { colors } = useAppTheme();
  const styles = useMemo(() => createBunyanAiStyles(colors), [colors]);
  const isClient = role === 'client';
  const suggestions = useMemo(() => (isClient ? SUGGESTIONS_CLIENT : SUGGESTIONS_CONTRACTOR), [isClient]);
  const lead = isClient
    ? 'اسألني عن اختيار المقاول، العقود، ودفعات مشروعك كصاحب مشروع'
    : 'اسألني عن إدارة المشاريع والموردين والربحية كمقاول';
  const placeholder = isClient ? '...سؤالك عن مشروعك أو المقاول' : '...اكتب سؤالك عن البناء والموقع';

  const clearDraft = () => {
    hapticLight();
    setQ('');
  };

  const sendQuestion = () => {
    const t = q.trim();
    if (!t) {
      hapticLight();
      Alert.alert('تنبيه', 'اكتب سؤالاً في الحقل ثم اضغط إرسال.');
      return;
    }
    hapticSuccess();
    Alert.alert(
      'قريباً على الخادم',
      'سيتم ربط هذا الحقل بنموذج ذكاء اصطناعي عبر الـ API. يمكنك نسخ السؤال والاحتفاظ به مؤقتاً.',
      [
        { text: 'حسناً', style: 'default' },
        {
          text: 'مسح الحقل',
          style: 'destructive',
          onPress: () => setQ(''),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.top}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="مسح مسودة السؤال"
          onPress={clearDraft}
          style={styles.trashBtn}
          {...pressableRipple('rgba(255,255,255,0.08)')}
        >
          <Ionicons name="trash-outline" size={20} color={colors.textSecondary} />
        </Pressable>
        <View style={{ flex: 1 }} />
        <View style={styles.titleBlock}>
          <View style={styles.purpleIcon}>
            <Ionicons name="hardware-chip" size={22} color={colors.onAiPurple} />
          </View>
          <View style={{ marginRight: space.sm }}>
            <Text style={styles.aiTitle}>بنيان AI</Text>
            <View style={styles.statusRow}>
              <View style={styles.dot} />
              <Text style={styles.statusText}>متصل • خبير بناء سوري</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
      >
        <View style={styles.flag}>
          <SyriaFlag width={40} height={28} />
        </View>
        <Text style={styles.hero}>مساعد بنيان الذكي</Text>
        <Text style={styles.sub}>{lead}</Text>

        <View style={styles.grid}>
          {suggestions.map((s) => (
            <Pressable
              key={s.text}
              accessibilityRole="button"
              onPress={() => setQ(s.text)}
              {...pressableRipple('rgba(139,92,246,0.12)')}
              style={styles.sCard}
            >
              <Ionicons name={s.icon} size={22} color={colors.aiPurple} style={{ marginLeft: space.sm }} />
              <Text style={styles.sText}>{s.text}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <View style={styles.inputBar}>
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={colors.placeholder}
          style={styles.input}
          value={q}
          onChangeText={setQ}
          textAlign="right"
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="إرسال السؤال"
          onPress={sendQuestion}
          style={styles.send}
          {...pressableRipple('rgba(255,255,255,0.15)')}
        >
          <Ionicons name="send" size={18} color={colors.onAiPurple} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function createBunyanAiStyles(colors: AppPalette) {
  return StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  top: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: space.md,
    paddingVertical: space.sm + 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderMuted,
  },
  trashBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.surfaceMid,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderMuted,
  },
  titleBlock: { flexDirection: 'row-reverse', alignItems: 'center' },
  purpleIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.aiPurple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiTitle: { color: colors.text, fontWeight: '900', fontSize: 17, textAlign: 'right' },
  statusRow: { flexDirection: 'row-reverse', alignItems: 'center', marginTop: 2 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.success, marginLeft: 6 },
  statusText: { color: colors.textMuted, fontSize: 12 },
  scroll: { padding: space.lg, paddingBottom: 120 },
  flag: { alignItems: 'flex-end', marginBottom: space.sm },
  hero: { color: colors.text, fontSize: 22, fontWeight: '900', textAlign: 'right' },
  sub: { color: colors.textMuted, textAlign: 'right', marginTop: space.sm, lineHeight: 22 },
  grid: {
    marginTop: space.lg,
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: space.sm + 2,
  },
  sCard: {
    width: '48.5%',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: colors.surfaceMid,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    padding: space.md,
    minHeight: 72,
  },
  sText: { flex: 1, color: colors.textSecondary, fontSize: 13, fontWeight: '700', textAlign: 'right', lineHeight: 20 },
  inputBar: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: space.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.borderMuted,
    backgroundColor: colors.tabBar,
    gap: space.sm,
  },
  input: {
    flex: 1,
    backgroundColor: colors.surfaceMid,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    paddingHorizontal: space.md,
    paddingVertical: space.md,
    color: colors.text,
    minHeight: touch.minHeight,
  },
  send: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.aiPurple,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
}
