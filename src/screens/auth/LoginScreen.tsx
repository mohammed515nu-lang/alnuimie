import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { authAPI } from '../../api/services';
import { getApiErrorMessage } from '../../api/http';
import { useStore } from '../../store/useStore';

export function LoginScreen() {
  const setUser = useStore((s) => s.setUser);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<'client' | 'contractor'>('client');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setLoading(true);
    try {
      if (mode === 'login') {
        const res = await authAPI.login(email.trim(), password);
        setUser(res.user);
        useStore.setState({ isAuthenticated: true });
      } else {
        if (!name.trim()) throw new Error('الاسم مطلوب');
        const res = await authAPI.register({
          name: name.trim(),
          email: email.trim(),
          password,
          role,
          phone: phone.trim() || undefined,
        });
        setUser(res.user);
        useStore.setState({ isAuthenticated: true });
      }
    } catch (e) {
      Alert.alert('تعذر الدخول', getApiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#0B1220', '#111827']} style={styles.root}>
      <View style={styles.card}>
        <Text style={styles.title}>بنيان</Text>
        <Text style={styles.subtitle}>دخول مرتبط بالخادم (بدون تخزين محلي للبيانات الحساسة)</Text>

        {mode === 'register' ? (
          <>
            <TextInput placeholder="الاسم الكامل" placeholderTextColor="#64748B" style={styles.input} value={name} onChangeText={setName} />
            <TextInput placeholder="الهاتف (اختياري)" placeholderTextColor="#64748B" style={styles.input} value={phone} onChangeText={setPhone} />
            <View style={styles.roleRow}>
              <Pressable onPress={() => setRole('client')} style={[styles.roleBtn, role === 'client' && styles.roleBtnActive]}>
                <Text style={styles.roleText}>عميل</Text>
              </Pressable>
              <Pressable onPress={() => setRole('contractor')} style={[styles.roleBtn, role === 'contractor' && styles.roleBtnActive]}>
                <Text style={styles.roleText}>مقاول</Text>
              </Pressable>
            </View>
          </>
        ) : null}

        <TextInput
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="البريد الإلكتروني"
          placeholderTextColor="#64748B"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput secureTextEntry placeholder="كلمة المرور" placeholderTextColor="#64748B" style={styles.input} value={password} onChangeText={setPassword} />

        <Pressable disabled={loading} onPress={onSubmit} style={[styles.primary, loading && { opacity: 0.6 }]}>
          <Text style={styles.primaryText}>{mode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب'}</Text>
        </Pressable>

        <Pressable
          onPress={() => setMode(mode === 'login' ? 'register' : 'login')}
          style={styles.switch}
          disabled={loading}
        >
          <Text style={styles.switchText}>{mode === 'login' ? 'ليس لديك حساب؟ أنشئ حساباً' : 'لديك حساب؟ سجّل الدخول'}</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: 18, justifyContent: 'center' },
  card: {
    backgroundColor: 'rgba(15,23,42,0.72)',
    borderColor: '#1F2937',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  title: { color: '#F8FAFC', fontSize: 28, fontWeight: '800', textAlign: 'center' },
  subtitle: { color: '#94A3B8', textAlign: 'center', marginTop: 8, marginBottom: 14 },
  input: {
    backgroundColor: '#0B1220',
    borderColor: '#1F2937',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: '#E2E8F0',
    marginBottom: 10,
  },
  primary: { backgroundColor: '#38BDF8', borderRadius: 12, paddingVertical: 12, marginTop: 6 },
  primaryText: { color: '#0B1220', textAlign: 'center', fontWeight: '800' },
  switch: { paddingVertical: 14 },
  switchText: { color: '#93C5FD', textAlign: 'center', fontWeight: '700' },
  roleRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  roleBtn: { flex: 1, borderRadius: 12, borderWidth: 1, borderColor: '#1F2937', paddingVertical: 10, backgroundColor: '#0B1220' },
  roleBtnActive: { borderColor: '#38BDF8', backgroundColor: 'rgba(56,189,248,0.12)' },
  roleText: { color: '#E2E8F0', textAlign: 'center', fontWeight: '800' },
});
