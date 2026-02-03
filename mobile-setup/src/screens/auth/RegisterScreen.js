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
} from 'react-native';
import { authAPI, setToken, setUser } from '../../api';

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'client',
    phone: '',
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    const { name, email, password, confirmPassword, role, phone } = formData;

    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('خطأ', 'يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('خطأ', 'كلمات المرور غير متطابقة');
      return;
    }

    if (password.length < 6) {
      Alert.alert('خطأ', 'كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    setLoading(true);
    try {
      const userData = {
        name,
        email,
        password,
        role,
        phone: phone || undefined,
      };

      const response = await authAPI.register(userData);
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
                         'حدث خطأ أثناء التسجيل';
      Alert.alert('خطأ في التسجيل', errorMessage);
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
        <View style={styles.content}>
          <Text style={styles.title}>إنشاء حساب جديد</Text>
          
          <TextInput
            style={styles.input}
            placeholder="الاسم الكامل"
            placeholderTextColor="#999"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
          />
          
          <TextInput
            style={styles.input}
            placeholder="البريد الإلكتروني"
            placeholderTextColor="#999"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          
          <TextInput
            style={styles.input}
            placeholder="رقم الهاتف (اختياري)"
            placeholderTextColor="#999"
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
            keyboardType="phone-pad"
          />
          
          <TextInput
            style={styles.input}
            placeholder="كلمة المرور"
            placeholderTextColor="#999"
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
            secureTextEntry
            autoCapitalize="none"
          />
          
          <TextInput
            style={styles.input}
            placeholder="تأكيد كلمة المرور"
            placeholderTextColor="#999"
            value={formData.confirmPassword}
            onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
            secureTextEntry
            autoCapitalize="none"
          />
          
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>إنشاء حساب</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            style={styles.linkContainer}
          >
            <Text style={styles.linkText}>لديك حساب بالفعل؟ سجل الدخول</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#007AFF',
    fontSize: 16,
  },
});

export default RegisterScreen;
