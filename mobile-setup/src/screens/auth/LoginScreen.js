import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { authAPI, setToken, setUser } from '../../api';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('contractor'); // 'contractor' | 'client'
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('خطأ', 'يرجى إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.login(email, password);
      const { token, user } = response.data;
      
      await setToken(token);
      await setUser(user);
      
      // التنقل حسب نوع المستخدم
      if (user.role === 'client') {
        navigation.replace('ClientTabs');
      } else {
        navigation.replace('ContractorTabs');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         'حدث خطأ أثناء تسجيل الدخول';
      Alert.alert('خطأ في تسجيل الدخول', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.topSpacing} />
        <View style={styles.card}>
          <Text style={styles.title}>تسجيل الدخول</Text>
          <Text style={styles.subtitle}>سجل دخولك للوصول إلى لوحة التحكم ومتابعة مشروعاتك.</Text>

          {/* Role selector */}
          <View style={styles.roleContainer}>
            <TouchableOpacity
              style={[styles.rolePill, role === 'contractor' && styles.rolePillActive]}
              onPress={() => setRole('contractor')}
            >
              <Text style={[styles.roleText, role === 'contractor' && styles.roleTextActive]}>مقاول</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.rolePill, role === 'client' && styles.rolePillActive]}
              onPress={() => setRole('client')}
            >
              <Text style={[styles.roleText, role === 'client' && styles.roleTextActive]}>صاحب مشروع</Text>
            </TouchableOpacity>
          </View>

          {/* Inputs */}
          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="أدخل بريدك الإلكتروني"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="أدخل كلمة المرور"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
              <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={18} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>تسجيل الدخول</Text>
            )}
          </TouchableOpacity>

          {/* Divider with OR */}
          <View style={styles.orRow}>
            <View style={styles.line} />
            <Text style={styles.orText}>أو</Text>
            <View style={styles.line} />
          </View>

          <TouchableOpacity style={styles.googleButton} onPress={() => Alert.alert('Google Sign-in', 'غير مفعّل في النسخة التجريبية')}>
            <Ionicons name="logo-google" size={18} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.googleText}>تسجيل الدخول بحساب Google</Text>
          </TouchableOpacity>

          <View style={styles.linksRow}>
            <TouchableOpacity onPress={() => Alert.alert('نسيت كلمة المرور', 'ميزة إعادة تعيين كلمة المرور')}>
              <Text style={styles.smallLink}>هل نسيت كلمة المرور؟</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.smallLink}>إنشاء حساب جديد</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1220',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
  },
  topSpacing: {
    height: 40,
  },
  card: {
    width: '90%',
    backgroundColor: '#0f1724',
    borderRadius: 16,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.02)',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'center',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 18,
  },
  roleContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginBottom: 18,
    backgroundColor: 'transparent',
  },
  rolePill: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginHorizontal: 6,
    backgroundColor: '#0b1622',
  },
  rolePillActive: {
    backgroundColor: '#0b2231',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
  roleText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '600',
  },
  roleTextActive: {
    color: '#fff',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0b1622',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    color: '#fff',
    fontSize: 15,
  },
  eyeButton: {
    padding: 8,
  },
  button: {
    backgroundColor: '#0b1b2a',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  orText: {
    marginHorizontal: 10,
    color: '#9CA3AF',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    paddingVertical: 12,
    borderRadius: 12,
  },
  googleText: {
    color: '#fff',
    fontSize: 15,
  },
  linksRow: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  smallLink: {
    color: '#9CA3AF',
    fontSize: 13,
  },
});

export default LoginScreen;
