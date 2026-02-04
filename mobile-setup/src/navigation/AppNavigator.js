import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, ActivityIndicator, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';

// Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import AddProjectScreen from '../screens/client/AddProjectScreen';
import ClientsScreen from '../screens/contractor/ClientsScreen';
import SettingsScreen from '../screens/shared/SettingsScreen';
import ReportsAndInvoicesScreen from '../screens/contractor/ReportsAndInvoicesScreen';
import InventoryMaterialsScreen from '../screens/contractor/InventoryMaterialsScreen';
import RequestsAndQuotesScreen from '../screens/client/RequestsAndQuotesScreen';
import NotificationsScreen from '../screens/shared/NotificationsScreen';
import ProfileScreen from '../screens/shared/ProfileScreen';

// Utils
import { getUser } from '../api';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// نظام الألوان الموحد
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

// شاشة لوحة تحكم العميل
const ClientDashboardScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await getUser();
        setUser(userData);
      } catch (error) {
        console.error('Error loading user:', error);
      }
    };
    loadUser();
  }, []);
  
  return (
    <ScrollView style={styles.dashboardContainer}>
      <View style={styles.dashboardHeader}>
        <View>
          <Text style={styles.welcomeText}>مرحباً</Text>
          <Text style={styles.userName}>{user?.name || 'المستخدم'}</Text>
        </View>
        <View style={styles.avatarContainer}>
          <Ionicons name="person" size={32} color={BRAND_COLORS.primary} />
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="folder" size={32} color={BRAND_COLORS.primary} />
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>المشاريع</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="time" size={32} color={BRAND_COLORS.success} />
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>قيد التنفيذ</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="checkmark-circle" size={32} color={BRAND_COLORS.success} />
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>مكتملة</Text>
        </View>
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>إجراءات سريعة</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('AddProject')}
          >
            <Ionicons name="add-circle" size={40} color={BRAND_COLORS.primary} />
            <Text style={styles.actionText}>مشروع جديد</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="search" size={40} color={BRAND_COLORS.accent} />
            <Text style={styles.actionText}>البحث</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="notifications" size={40} color={BRAND_COLORS.warning} />
            <Text style={styles.actionText}>الإشعارات</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Settings')}
          >
            <Ionicons name="settings" size={40} color={BRAND_COLORS.muted} />
            <Text style={styles.actionText}>الإعدادات</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

// شاشة مشاريع العميل
const ClientProjectsScreen = ({ navigation }) => (
  <View style={styles.dashboardContainer}>
    <View style={styles.emptyState}>
      <Ionicons name="folder-outline" size={80} color={BRAND_COLORS.muted} />
      <Text style={styles.emptyStateText}>لا توجد مشاريع بعد</Text>
      <Text style={styles.emptyStateSubtext}>ابدأ بإنشاء مشروعك الأول</Text>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate('AddProject')}
      >
        <Ionicons name="add-circle" size={20} color="#fff" />
        <Text style={styles.createButtonText}>إنشاء مشروع جديد</Text>
      </TouchableOpacity>
    </View>
  </View>
);

// شاشة لوحة تحكم المقاول
const ContractorDashboardScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await getUser();
        setUser(userData);
      } catch (error) {
        console.error('Error loading user:', error);
      }
    };
    loadUser();
  }, []);
  
  return (
    <ScrollView style={styles.dashboardContainer}>
      <View style={styles.dashboardHeader}>
        <View>
          <Text style={styles.welcomeText}>مرحباً</Text>
          <Text style={styles.userName}>{user?.name || 'المقاول'}</Text>
        </View>
        <View style={styles.avatarContainer}>
          <Ionicons name="business" size={32} color={BRAND_COLORS.primary} />
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="folder" size={32} color={BRAND_COLORS.primary} />
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>المشاريع</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="people" size={32} color={BRAND_COLORS.accent} />
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>العملاء</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="cash" size={32} color={BRAND_COLORS.success} />
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>الإيرادات</Text>
        </View>
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>إجراءات سريعة</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('AddProject')}
          >
            <Ionicons name="add-circle" size={40} color={BRAND_COLORS.primary} />
            <Text style={styles.actionText}>مشروع جديد</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Clients')}
          >
            <Ionicons name="people" size={40} color={BRAND_COLORS.accent} />
            <Text style={styles.actionText}>العملاء</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="receipt" size={40} color={BRAND_COLORS.success} />
            <Text style={styles.actionText}>الفواتير</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Settings')}
          >
            <Ionicons name="settings" size={40} color={BRAND_COLORS.muted} />
            <Text style={styles.actionText}>الإعدادات</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

// Client Stack Navigator
const ClientStack = createNativeStackNavigator();
const ClientStackNavigator = () => (
  <ClientStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: BRAND_COLORS.card,
      },
      headerTintColor: BRAND_COLORS.text,
      headerTitleStyle: {
        fontWeight: '700',
      },
    }}
  >
    <ClientStack.Screen
      name="ClientDashboard"
      component={ClientDashboardScreen}
      options={{ headerShown: false }}
    />
    <ClientStack.Screen
      name="ClientProjects"
      component={ClientProjectsScreen}
      options={{ title: 'المشاريع' }}
    />
    <ClientStack.Screen
      name="AddProject"
      component={AddProjectScreen}
      options={{ title: 'مشروع جديد' }}
    />
    <ClientStack.Screen
      name="Settings"
      component={SettingsScreen}
      options={{ title: 'الإعدادات' }}
    />
    <ClientStack.Screen
      name="Notifications"
      component={() => <NotificationsScreen userRole="client" />}
      options={{ title: 'الإشعارات' }}
    />
    <ClientStack.Screen
      name="Profile"
      component={() => <ProfileScreen userRole="client" />}
      options={{ title: 'الملف الشخصي' }}
    />
  </ClientStack.Navigator>
);

// Client Tabs
const ClientTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Dashboard') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Projects') {
          iconName = focused ? 'folder' : 'folder-outline';
        } else if (route.name === 'Requests') {
          iconName = focused ? 'document-text' : 'document-text-outline';
        } else if (route.name === 'Notifications') {
          iconName = focused ? 'notifications' : 'notifications-outline';
        } else if (route.name === 'Profile') {
          iconName = focused ? 'person' : 'person-outline';
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: BRAND_COLORS.primary,
      tabBarInactiveTintColor: BRAND_COLORS.muted,
      headerShown: false,
    })}
  >
    <Tab.Screen 
      name="Dashboard" 
      component={ClientStackNavigator}
      options={{ title: 'لوحة التحكم' }}
    />
    <Tab.Screen 
      name="Projects" 
      component={ClientProjectsScreen}
      options={{ title: 'المشاريع' }}
    />
    <Tab.Screen 
      name="Requests" 
      component={RequestsAndQuotesScreen}
      options={{ title: 'الطلبات والعروض' }}
    />
    <Tab.Screen 
      name="Notifications" 
      component={() => <NotificationsScreen userRole="client" />}
      options={{ title: 'الإشعارات' }}
    />
    <Tab.Screen 
      name="Profile" 
      component={() => <ProfileScreen userRole="client" />}
      options={{ title: 'الملف الشخصي' }}
    />
  </Tab.Navigator>
);

// Contractor Stack Navigator
const ContractorStack = createNativeStackNavigator();
const ContractorStackNavigator = () => (
  <ContractorStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: BRAND_COLORS.card,
      },
      headerTintColor: BRAND_COLORS.text,
      headerTitleStyle: {
        fontWeight: '700',
      },
    }}
  >
    <ContractorStack.Screen
      name="ContractorDashboard"
      component={ContractorDashboardScreen}
      options={{ headerShown: false }}
    />
    <ContractorStack.Screen
      name="ContractorProjects"
      component={ClientProjectsScreen}
      options={{ title: 'المشاريع' }}
    />
    <ContractorStack.Screen
      name="AddProject"
      component={AddProjectScreen}
      options={{ title: 'مشروع جديد' }}
    />
    <ContractorStack.Screen
      name="Clients"
      component={ClientsScreen}
      options={{ title: 'العملاء' }}
    />
    <ContractorStack.Screen
      name="Settings"
      component={SettingsScreen}
      options={{ title: 'الإعدادات' }}
    />
    <ContractorStack.Screen
      name="ReportsAndInvoices"
      component={ReportsAndInvoicesScreen}
      options={{ title: 'التقارير والفواتير' }}
    />
    <ContractorStack.Screen
      name="InventoryMaterials"
      component={InventoryMaterialsScreen}
      options={{ title: 'المخزون والمواد' }}
    />
    <ContractorStack.Screen
      name="Notifications"
      component={() => <NotificationsScreen userRole="contractor" />}
      options={{ title: 'الإشعارات' }}
    />
    <ContractorStack.Screen
      name="Profile"
      component={() => <ProfileScreen userRole="contractor" />}
      options={{ title: 'الملف الشخصي' }}
    />
  </ContractorStack.Navigator>
);

// Contractor Tabs
const ContractorTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Dashboard') {
          iconName = focused ? 'business' : 'business-outline';
        } else if (route.name === 'Projects') {
          iconName = focused ? 'folder' : 'folder-outline';
        } else if (route.name === 'Clients') {
          iconName = focused ? 'people' : 'people-outline';
        } else if (route.name === 'ReportsAndInvoices') {
          iconName = focused ? 'receipt' : 'receipt-outline';
        } else if (route.name === 'InventoryMaterials') {
          iconName = focused ? 'cube' : 'cube-outline';
        } else if (route.name === 'Notifications') {
          iconName = focused ? 'notifications' : 'notifications-outline';
        } else if (route.name === 'Profile') {
          iconName = focused ? 'person' : 'person-outline';
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: BRAND_COLORS.primary,
      tabBarInactiveTintColor: BRAND_COLORS.muted,
      headerShown: false,
    })}
  >
    <Tab.Screen 
      name="Dashboard" 
      component={ContractorStackNavigator}
      options={{ title: 'لوحة التحكم' }}
    />
    <Tab.Screen 
      name="Projects" 
      component={ClientProjectsScreen}
      options={{ title: 'المشاريع' }}
    />
    <Tab.Screen 
      name="Clients" 
      component={ClientsScreen}
      options={{ title: 'العملاء' }}
    />
    <Tab.Screen 
      name="ReportsAndInvoices" 
      component={ReportsAndInvoicesScreen}
      options={{ title: 'التقارير والفواتير' }}
    />
    <Tab.Screen 
      name="InventoryMaterials" 
      component={InventoryMaterialsScreen}
      options={{ title: 'المخزون والمواد' }}
    />
    <Tab.Screen 
      name="Notifications" 
      component={() => <NotificationsScreen userRole="contractor" />}
      options={{ title: 'الإشعارات' }}
    />
    <Tab.Screen 
      name="Profile" 
      component={() => <ProfileScreen userRole="contractor" />}
      options={{ title: 'الملف الشخصي' }}
    />
  </Tab.Navigator>
);

const AppNavigator = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const userData = await getUser();
      setUser(userData);
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // تحديد الشاشة الأولية بناءً على حالة المستخدم
  const getInitialRoute = () => {
    if (user) {
      return user.role === 'client' ? 'ClientTabs' : 'ContractorTabs';
    }
    return 'Login';
  };

  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ headerShown: false }}
        initialRouteName={getInitialRoute()}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ClientTabs" component={ClientTabs} />
        <Stack.Screen name="ContractorTabs" component={ContractorTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  dashboardContainer: {
    flex: 1,
    backgroundColor: BRAND_COLORS.background,
    padding: 20,
  },
  dashboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 10,
  },
  welcomeText: {
    fontSize: 16,
    color: BRAND_COLORS.muted,
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: BRAND_COLORS.text,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: BRAND_COLORS.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: BRAND_COLORS.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: BRAND_COLORS.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: BRAND_COLORS.text,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: BRAND_COLORS.muted,
    textAlign: 'center',
  },
  quickActions: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: BRAND_COLORS.text,
    marginBottom: 16,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: '47%',
    backgroundColor: BRAND_COLORS.card,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    shadowColor: BRAND_COLORS.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: BRAND_COLORS.text,
    marginTop: 8,
    textAlign: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: '600',
    color: BRAND_COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: BRAND_COLORS.muted,
    textAlign: 'center',
    marginBottom: 20,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BRAND_COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 20,
    gap: 8,
  },
  createButtonText: {
    color: BRAND_COLORS.card,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AppNavigator;
