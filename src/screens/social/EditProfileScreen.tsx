import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { useStore } from '../../store/useStore';
import { getApiErrorMessage } from '../../api/http';
import { useAppTheme, pressableRipple, radius, space, touch } from '../../theme';
import { hapticSuccess } from '../../utils/haptics';
import { isIOS } from '../../utils/platformEnv';
import type { AppPalette } from '../../theme/palettes';

export function EditProfileScreen() {
  const refreshMyProfile = useStore((s) => s.refreshMyProfile);
  const updateMyProfile = useStore((s) => s.updateMyProfile);
  const profile = useStore((s) => s.myPublicProfile);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [bio, setBio] = useState('');
  const [years, setYears] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [website, setWebsite] = useState('');
  const [avatarUri, setAvatarUri] = useState<string | undefined>(undefined);
  const [saving, setSaving] = useState(false);

  const { colors } = useAppTheme();
  const styles = useMemo(() => createEditProfileStyles(colors), [colors]);

  useEffect(() => {
    void (async () => {
      try {
        await refreshMyProfile();
      } catch {
        // ignore
      }
    })();
  }, [refreshMyProfile]);

  useEffect(() => {
    if (!profile) return;
    setName(profile.name ?? '');
    setPhone(profile.phone ?? '');
    setCity(profile.city ?? '');
    setSpecialty(profile.specialty ?? '');
    setBio(profile.bio ?? '');
    setYears(profile.yearsExperience != null ? String(profile.yearsExperience) : '');
    setCompanyName(profile.companyName ?? '');
    setWebsite(profile.website ?? '');
    setAvatarUri(profile.avatarUri);
  }, [profile]);

  const pickAvatar = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return Alert.alert('تنبيه', 'يلزم الإذن للوصول للصور');
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.75,
      base64: true,
    });
    if (res.canceled) return;
    const asset = res.assets[0];
    if (!asset.base64) return Alert.alert('تنبيه', 'تعذر قراءة الصورة كـ base64');
    const mime = asset.mimeType ?? 'image/jpeg';
    setAvatarUri(`data:${mime};base64,${asset.base64}`);
  };

  const onSave = async () => {
    setSaving(true);
    try {
      const y = years.trim() ? Number(years) : undefined;
      await updateMyProfile({
        name: name.trim(),
        phone: phone.trim() || undefined,
        city: city.trim() || undefined,
        specialty: specialty.trim() || undefined,
        bio: bio.trim() || undefined,
        yearsExperience: y !== undefined && !Number.isNaN(y) ? y : undefined,
        companyName: companyName.trim() || undefined,
        website: website.trim() || undefined,
        avatarUri,
      });
      hapticSuccess();
      Alert.alert('تم', 'تم حفظ الملف');
    } catch (e) {
      Alert.alert('تعذر الحفظ', getApiErrorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  function Field(props: {
    label: string;
    value: string;
    onChangeText: (t: string) => void;
    multiline?: boolean;
    keyboardType?: 'default' | 'phone-pad' | 'number-pad';
    autoCapitalize?: 'none' | 'sentences';
  }) {
    return (
      <View style={{ marginBottom: space.sm + 2 }}>
        <Text style={styles.label}>{props.label}</Text>
        <TextInput
          value={props.value}
          onChangeText={props.onChangeText}
          placeholderTextColor={colors.placeholder}
          style={[styles.input, props.multiline && { minHeight: 90, textAlignVertical: 'top' }]}
          multiline={props.multiline}
          keyboardType={props.keyboardType}
          autoCapitalize={props.autoCapitalize}
        />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={isIOS ? 'padding' : undefined}
      keyboardVerticalOffset={isIOS ? 64 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.root}
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
      >
        <Text style={styles.title}>تعديل ملفي العام</Text>

        <Pressable
          accessibilityRole="button"
          onPress={pickAvatar}
          {...pressableRipple(colors.primaryTint12)}
          style={styles.secondary}
        >
          <Text style={styles.secondaryText}>اختيار صورة شخصية</Text>
        </Pressable>

        <Field label="الاسم" value={name} onChangeText={setName} />
        <Field label="الهاتف" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <Field label="المدينة" value={city} onChangeText={setCity} />
        <Field label="التخصص" value={specialty} onChangeText={setSpecialty} />
        <Field label="نبذة" value={bio} onChangeText={setBio} multiline />
        <Field label="سنوات الخبرة" value={years} onChangeText={setYears} keyboardType="number-pad" />
        <Field label="اسم الشركة" value={companyName} onChangeText={setCompanyName} />
        <Field label="الموقع" value={website} onChangeText={setWebsite} autoCapitalize="none" />

        <Pressable
          accessibilityRole="button"
          disabled={saving}
          onPress={onSave}
          {...pressableRipple(colors.primaryTint18)}
          style={[styles.primary, saving && { opacity: 0.6 }]}
        >
          <Text style={styles.primaryText}>حفظ</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function createEditProfileStyles(colors: AppPalette) {
  return StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  root: { padding: space.lg, paddingBottom: space.xxl + 8 },
  title: { color: colors.text, fontSize: 18, fontWeight: '900', marginBottom: space.md },
  label: { color: colors.textMuted, marginBottom: space.sm - 2, fontWeight: '700' },
  input: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
    paddingVertical: space.md,
    color: colors.textSecondary,
    minHeight: touch.minHeight,
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
  secondary: {
    borderRadius: radius.md,
    paddingVertical: space.md,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    marginBottom: space.md,
    minHeight: touch.minHeight,
    justifyContent: 'center',
  },
  secondaryText: { color: colors.textSecondary, textAlign: 'center', fontWeight: '800' },
});
}
