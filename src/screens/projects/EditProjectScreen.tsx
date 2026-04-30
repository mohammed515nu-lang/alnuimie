import { useEffect, useMemo, useState } from 'react';
import { Alert, KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { getApiErrorMessage } from '../../api/http';
import { useStore } from '../../store/useStore';
import { useAppTheme, pressableRipple, radius, space, touch } from '../../theme';
import type { AppPalette } from '../../theme/palettes';
import { isIOS } from '../../utils/platformEnv';

export function EditProjectScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const projectId = String(params.id ?? '');
  const projects = useStore((s) => s.projects);
  const updateProject = useStore((s) => s.updateProject);
  const project = projects.find((p) => p.id === projectId);

  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState('');
  const [startDate, setStartDate] = useState('');
  const [expectedEndDate, setExpectedEndDate] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (project) {
      setName(project.name ?? '');
      setDescription(project.description ?? '');
      setLocation(project.location ?? '');
      setBudget(typeof project.budget === 'number' ? String(project.budget) : '');
      setStartDate(project.startDate?.slice(0, 10) ?? '');
      setExpectedEndDate(project.expectedEndDate?.slice(0, 10) ?? '');
      return;
    }
    if (!projectId) return;
    void useStore.getState().refreshProjects();
  }, [project, projectId]);

  const onSave = async () => {
    if (!projectId || saving) return;
    const normalizedName = name.trim();
    if (!normalizedName) {
      Alert.alert('بيانات ناقصة', 'الرجاء إدخال اسم المشروع.');
      return;
    }
    const normalizedLocation = location.trim();
    if (!normalizedLocation) {
      Alert.alert('بيانات ناقصة', 'الرجاء إدخال موقع المشروع.');
      return;
    }
    const numericBudget = Number(budget.trim());
    const parsedBudget = Number.isFinite(numericBudget) && numericBudget > 0 ? numericBudget : undefined;

    try {
      setSaving(true);
      await updateProject(projectId, {
        name: normalizedName,
        location: normalizedLocation,
        description: description.trim() || undefined,
        budget: parsedBudget,
        startDate: startDate.trim() || undefined,
        expectedEndDate: expectedEndDate.trim() || undefined,
      });
      Alert.alert('تم', 'تم تحديث المشروع بنجاح.');
      router.back();
    } catch (err) {
      Alert.alert('تعذر التحديث', getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={isIOS ? 'padding' : undefined}
      keyboardVerticalOffset={isIOS ? 64 : 0}
    >
      <ScrollView contentContainerStyle={styles.root} keyboardShouldPersistTaps="handled" contentInsetAdjustmentBehavior="automatic">
        <Text style={styles.title}>تعديل المشروع</Text>
        <Field label="اسم المشروع *" value={name} onChangeText={setName} styles={styles} />
        <Field label="وصف المشروع" value={description} onChangeText={setDescription} multiline styles={styles} />
        <Field label="موقع المشروع *" value={location} onChangeText={setLocation} styles={styles} />
        <Field label="الميزانية" value={budget} onChangeText={setBudget} keyboardType="number-pad" styles={styles} />
        <Field label="تاريخ البدء" value={startDate} onChangeText={setStartDate} styles={styles} />
        <Field label="تاريخ الانتهاء المتوقع" value={expectedEndDate} onChangeText={setExpectedEndDate} styles={styles} />

        <Pressable
          accessibilityRole="button"
          disabled={saving}
          onPress={onSave}
          {...pressableRipple(colors.primaryTint18)}
          style={[styles.primary, saving && { opacity: 0.6 }]}
        >
          <Text style={styles.primaryText}>{saving ? 'جاري الحفظ...' : 'حفظ التعديلات'}</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field(props: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  multiline?: boolean;
  keyboardType?: 'default' | 'number-pad';
  styles: ReturnType<typeof createStyles>;
}) {
  return (
    <>
      <Text style={props.styles.label}>{props.label}</Text>
      <TextInput
        value={props.value}
        onChangeText={props.onChangeText}
        placeholderTextColor="#7f8a9b"
        style={[props.styles.input, props.multiline && { minHeight: 90, textAlignVertical: 'top' }]}
        multiline={props.multiline}
        keyboardType={props.keyboardType}
        textAlign="right"
      />
    </>
  );
}

function createStyles(colors: AppPalette) {
  return StyleSheet.create({
    flex: { flex: 1, backgroundColor: colors.background },
    root: { padding: space.lg, paddingBottom: space.xxl + 8 },
    title: { color: colors.text, fontSize: 18, fontWeight: '900', marginBottom: space.md, textAlign: 'right' },
    label: { color: colors.textMuted, marginBottom: space.xs, fontWeight: '700', textAlign: 'right' },
    input: {
      backgroundColor: colors.background,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: radius.md,
      paddingHorizontal: space.md,
      paddingVertical: space.md,
      color: colors.textSecondary,
      minHeight: touch.minHeight,
      marginBottom: space.sm + 2,
    },
    primary: {
      backgroundColor: colors.primary,
      borderRadius: radius.md,
      paddingVertical: space.md,
      marginTop: space.sm,
      minHeight: touch.minHeight,
      justifyContent: 'center',
    },
    primaryText: { color: colors.onPrimary, textAlign: 'center', fontWeight: '900' },
  });
}
