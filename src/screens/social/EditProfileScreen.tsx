import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { useStore } from '../../store/useStore';
import { getApiErrorMessage } from '../../api/http';

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

  useEffect(() => {
    (async () => {
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
      Alert.alert('تم', 'تم حفظ الملف');
    } catch (e) {
      Alert.alert('تعذر الحفظ', getApiErrorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.root}>
      <Text style={styles.title}>تعديل ملفي العام</Text>

      <Pressable onPress={pickAvatar} style={styles.secondary}>
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

      <Pressable disabled={saving} onPress={onSave} style={[styles.primary, saving && { opacity: 0.6 }]}>
        <Text style={styles.primaryText}>حفظ</Text>
      </Pressable>
    </ScrollView>
  );
}

function Field(props: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  multiline?: boolean;
  keyboardType?: 'default' | 'phone-pad' | 'number-pad';
  autoCapitalize?: 'none' | 'sentences';
}) {
  return (
    <View style={{ marginBottom: 10 }}>
      <Text style={styles.label}>{props.label}</Text>
      <TextInput
        value={props.value}
        onChangeText={props.onChangeText}
        placeholderTextColor="#64748B"
        style={[styles.input, props.multiline && { minHeight: 90, textAlignVertical: 'top' }]}
        multiline={props.multiline}
        keyboardType={props.keyboardType}
        autoCapitalize={props.autoCapitalize}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { padding: 16, paddingBottom: 30, backgroundColor: '#0B1220' },
  title: { color: '#F8FAFC', fontSize: 18, fontWeight: '900', marginBottom: 12 },
  label: { color: '#94A3B8', marginBottom: 6, fontWeight: '700' },
  input: {
    backgroundColor: '#0B1220',
    borderColor: '#1F2937',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: '#E2E8F0',
  },
  primary: { backgroundColor: '#38BDF8', borderRadius: 12, paddingVertical: 12, marginTop: 8 },
  primaryText: { color: '#0B1220', textAlign: 'center', fontWeight: '900' },
  secondary: { borderRadius: 12, paddingVertical: 12, borderWidth: 1, borderColor: '#334155', marginBottom: 12 },
  secondaryText: { color: '#E2E8F0', textAlign: 'center', fontWeight: '800' },
});
