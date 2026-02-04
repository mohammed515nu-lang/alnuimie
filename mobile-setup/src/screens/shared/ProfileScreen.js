import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getUser } from '../../api';

const BRAND_COLORS = {
  primary: '#3A424F',
  accent: '#4A5568',
  secondary: '#5A6578',
  dark: '#2D3748',
  light: '#EDF2F7',
  background: '#F7FAFC',
  card: '#ffffff',
  text: '#2D3748',
  muted: '#718096',
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
};

const ProfileScreen = ({ navigation, userRole }) => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    bio: '',
    specialization: '',
    experience: '',
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await getUser();
      setUser(userData);
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        company: userData.company || '',
        address: userData.address || '',
        bio: userData.bio || '',
        specialization: userData.specialization || '',
        experience: userData.experience || '',
      });
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleSave = () => {
    Alert.alert('حفظ التغييرات', 'هل أنت متأكد من حفظ التغييرات؟', [
      { text: 'إلغاء', style: 'cancel' },
      {
        text: 'حفظ',
        onPress: () => {
          setUser({ ...user, ...formData });
          setEditing(false);
          Alert.alert('نجاح', 'تم حفظ التغييرات بنجاح');
        },
      },
    ]);
  };

  const stats = userRole === 'contractor' ? [
    { label: 'المشاريع المكتملة', value: '24', icon: 'checkmark-circle' },
    { label: 'العملاء', value: '18', icon: 'people' },
    { label: 'سنوات الخبرة', value: '8', icon: 'award' },
    { label: 'التقييم', value: '4.8', icon: 'star' },
  ] : [
    { label: 'المشاريع', value: '5', icon: 'folder' },
    { label: 'الطلبات', value: '12', icon: 'document-text' },
    { label: 'المقاولين', value: '8', icon: 'business' },
    { label: 'التقييم', value: '4.6', icon: 'star' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons 
                name={userRole === 'contractor' ? 'business' : 'person'} 
                size={50} 
                color={BRAND_COLORS.primary} 
              />
            </View>
            <TouchableOpacity style={styles.editAvatarButton}>
              <Ionicons name="camera" size={16} color={BRAND_COLORS.card} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.userName}>{user?.name || 'المستخدم'}</Text>
          <Text style={styles.userRole}>
            {userRole === 'contractor' ? 'مقاول' : 'عميل'}
          </Text>
          
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setEditing(!editing)}
          >
            <Ionicons name={editing ? 'close' : 'create'} size={16} color={BRAND_COLORS.card} />
            <Text style={styles.editButtonText}>
              {editing ? 'إلغاء' : 'تعديل الملف'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <Ionicons name={stat.icon} size={24} color={BRAND_COLORS.primary} />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Profile Information */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>المعلومات الشخصية</Text>
          
          {editing ? (
            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>الاسم</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>البريد الإلكتروني</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.email}
                  onChangeText={(text) => setFormData({ ...formData, email: text })}
                  keyboardType="email-address"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>رقم الهاتف</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.phone}
                  onChangeText={(text) => setFormData({ ...formData, phone: text })}
                  keyboardType="phone-pad"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>العنوان</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.address}
                  onChangeText={(text) => setFormData({ ...formData, address: text })}
                />
              </View>
              
              {userRole === 'contractor' && (
                <>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>الشركة</Text>
                    <TextInput
                      style={styles.textInput}
                      value={formData.company}
                      onChangeText={(text) => setFormData({ ...formData, company: text })}
                    />
                  </View>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>التخصص</Text>
                    <TextInput
                      style={styles.textInput}
                      value={formData.specialization}
                      onChangeText={(text) => setFormData({ ...formData, specialization: text })}
                    />
                  </View>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>سنوات الخبرة</Text>
                    <TextInput
                      style={styles.textInput}
                      value={formData.experience}
                      onChangeText={(text) => setFormData({ ...formData, experience: text })}
                    />
                  </View>
                </>
              )}
              
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>حفظ التغييرات</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.infoContainer}>
              <InfoRow label="الاسم" value={user?.name || ''} />
              <InfoRow label="البريد الإلكتروني" value={user?.email || ''} />
              <InfoRow label="رقم الهاتف" value={user?.phone || ''} />
              <InfoRow label="العنوان" value={user?.address || ''} />
              
              {userRole === 'contractor' && (
                <>
                  <InfoRow label="الشركة" value={user?.company || ''} />
                  <InfoRow label="التخصص" value={user?.specialization || ''} />
                  <InfoRow label="سنوات الخبرة" value={user?.experience || ''} />
                </>
              )}
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>إجراءات سريعة</Text>
          
          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="shield-checkmark" size={24} color={BRAND_COLORS.success} />
            <Text style={styles.actionText}>تغيير كلمة المرور</Text>
            <Ionicons name="chevron-forward" size={20} color={BRAND_COLORS.muted} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="notifications" size={24} color={BRAND_COLORS.warning} />
            <Text style={styles.actionText}>إعدادات الإشعارات</Text>
            <Ionicons name="chevron-forward" size={20} color={BRAND_COLORS.muted} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="log-out" size={24} color={BRAND_COLORS.error} />
            <Text style={styles.actionText}>تسجيل الخروج</Text>
            <Ionicons name="chevron-forward" size={20} color={BRAND_COLORS.muted} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const InfoRow = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BRAND_COLORS.background,
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: BRAND_COLORS.card,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: BRAND_COLORS.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: BRAND_COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: BRAND_COLORS.text,
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    color: BRAND_COLORS.muted,
    marginBottom: 16,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BRAND_COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  editButtonText: {
    color: BRAND_COLORS.card,
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: BRAND_COLORS.card,
    marginTop: 16,
    marginHorizontal: 20,
    borderRadius: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: BRAND_COLORS.text,
    marginTop: 4,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: BRAND_COLORS.muted,
    textAlign: 'center',
  },
  infoSection: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: BRAND_COLORS.text,
    marginBottom: 16,
  },
  formContainer: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: BRAND_COLORS.text,
  },
  textInput: {
    backgroundColor: BRAND_COLORS.card,
    borderWidth: 1,
    borderColor: BRAND_COLORS.light,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: BRAND_COLORS.text,
    textAlign: 'right',
  },
  saveButton: {
    backgroundColor: BRAND_COLORS.success,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: BRAND_COLORS.card,
    fontSize: 16,
    fontWeight: '600',
  },
  infoContainer: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: BRAND_COLORS.card,
    padding: 16,
    borderRadius: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: BRAND_COLORS.text,
  },
  infoValue: {
    fontSize: 14,
    color: BRAND_COLORS.muted,
  },
  actionsSection: {
    marginTop: 24,
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BRAND_COLORS.card,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    gap: 12,
  },
  actionText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: BRAND_COLORS.text,
  },
});

export default ProfileScreen;