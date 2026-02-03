import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

// Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Utils
import { getUser } from '../api';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Placeholder screens - يمكنك استبدالها لاحقاً
const ClientDashboardScreen = () => (
  <View style={styles.placeholder}>
    <Ionicons name="home" size={64} color="#007AFF" />
  </View>
);

const ClientProjectsScreen = () => (
  <View style={styles.placeholder}>
    <Ionicons name="folder" size={64} color="#007AFF" />
  </View>
);

const ContractorDashboardScreen = () => (
  <View style={styles.placeholder}>
    <Ionicons name="business" size={64} color="#007AFF" />
  </View>
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
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#007AFF',
      tabBarInactiveTintColor: 'gray',
      headerShown: true,
      headerTitle: route.name === 'Dashboard' ? 'لوحة التحكم' : 'المشاريع',
    })}
  >
    <Tab.Screen name="Dashboard" component={ClientDashboardScreen} />
    <Tab.Screen name="Projects" component={ClientProjectsScreen} />
  </Tab.Navigator>
);

// Contractor Tabs
const ContractorTabs = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: '#007AFF',
      tabBarInactiveTintColor: 'gray',
      headerShown: true,
      headerTitle: 'لوحة التحكم',
    }}
  >
    <Tab.Screen 
      name="Dashboard" 
      component={ContractorDashboardScreen}
      options={{
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons 
            name={focused ? 'business' : 'business-outline'} 
            size={size} 
            color={color} 
          />
        ),
      }}
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

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : user.role === 'client' ? (
          <Stack.Screen name="ClientTabs" component={ClientTabs} />
        ) : (
          <Stack.Screen name="ContractorTabs" component={ContractorTabs} />
        )}
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
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default AppNavigator;
