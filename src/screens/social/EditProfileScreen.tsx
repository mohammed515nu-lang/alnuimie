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
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';

import { TopBar } from '../../components/TopBar';
import { useStore } from '../../store/useStore';
import { getApiErrorMessage } from '../../api/http';
import { pressableRipple, space, touch, useAppTheme } from '../../theme';
import { DASHBOARD_RADIUS, getDashboardPalette, type DashboardPalette } from '../../theme/dashboardLight';
import { hapticSuccess } from '../../utils/haptics';
import { isIOS } from '../../utils/platformEnv';

export function EditProfileScreen() {
  const updateMyProfile = useStore((s) => s.updateMyProfile);
  const profile = useStore((s) => s.myPublicProfile);
  const insets = useSafeAreaInsets();
  const { resolved } = useAppTheme();
  const dash = useMemo(() => getDashboardPalette(resolved), [resolved]);

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

  const styles = useMemo(() => createStyles(dash), [dash]);

  useEffect(() => {
    void (async () => {
      try {
        await useStore.getState().refreshMyProfile();
      } catch {
        // ignore
      }
    })();
  }, []);

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
          placeholderTextColor={dash.muted}
          style={[styles.input, props.multiline && { minHeight: 90, textAlignVertical: 'top' }]}
          multiline={props.multiline}
          keyboardType={props.keyboardType}
          autoCapitalize={props.autoCapitalize}
          textAlign="right"
        />
      </View>
    );
  }

  const bottomPad = space.xxl + 8 + insets.bottom;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <TopBar tone="beige" title="تعديل الملف" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={isIOS ? 'padding' : undefined}
        keyboardVerticalOffset={isIOS ? 64 : 0}
      >
        <ScrollView
          contentContainerStyle={[styles.root, { paddingBottom: bottomPad }]}
          keyboardShouldPersistTaps="handled"
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.lead}>حدّث بياناتك كما تظهر للآخرين في التطبيق.</Text>

          <Pressable
            accessibilityRole="button"
            onPress={pickAvatar}
            {...pressableRipple(dash.navyTint)}
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
            {...pressableRipple(dash.goldTint)}
            style={[styles.primary, saving && { opacity: 0.6 }]}
          >
            <Text style={styles.primaryText}>حفظ</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function createStyles(dash: DashboardPalette) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: dash.pageBg },
    flex: { flex: 1, backgroundColor: dash.pageBg },
    root: { paddingHorizontal: 16, paddingTop: 4 },
    lead: {
      color: dash.muted,
      fontSize: 14,
      lineHeight: 22,
      textAlign: 'right',
      marginBottom: space.md,
    },
    label: { color: dash.muted, marginBottom: space.sm - 2, fontWeight: '700', textAlign: 'right' },
    input: {
      backgroundColor: dash.white,
      borderColor: dash.border,
      borderWidth: 1,
      borderRadius: DASHBOARD_RADIUS,
      paddingHorizontal: space.md,
      paddingVertical: space.md,
      color: dash.darkText,
      minHeight: touch.minHeight,
    },
    primary: {
      backgroundColor: dash.gold,
      borderRadius: DASHBOARD_RADIUS,
      paddingVertical: space.md,
      marginTop: space.sm,
      minHeight: touch.minHeight,
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: dash.gold,
    },
    primaryText: { color: dash.onGold, textAlign: 'center', fontWeight: '900' },
    secondary: {
      borderRadius: DASHBOARD_RADIUS,
      paddingVertical: space.md,
      borderWidth: 1,
      borderColor: dash.border,
      marginBottom: space.md,
      minHeight: touch.minHeight,
      justifyContent: 'center',
      backgroundColor: dash.white,
    },
    secondaryText: { color: dash.darkText, textAlign: 'center', fontWeight: '800' },
  });
}
