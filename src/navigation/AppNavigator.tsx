import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';

import { useStore } from '../store/useStore';
import type { RootStackParamList } from './types';

import { LoginScreen } from '../screens/auth/LoginScreen';
import { HomeScreen } from '../screens/home/HomeScreen';
import { SearchScreen } from '../screens/social/SearchScreen';
import { PublicProfileScreen } from '../screens/social/PublicProfileScreen';
import { EditProfileScreen } from '../screens/social/EditProfileScreen';
import { PortfolioManageScreen } from '../screens/social/PortfolioManageScreen';
import { ConnectionRequestsScreen } from '../screens/social/ConnectionRequestsScreen';
import { ChatListScreen } from '../screens/chat/ChatListScreen';
import { ChatRoomScreen } from '../screens/chat/ChatRoomScreen';
import { WalletHomeScreen } from '../screens/wallet/WalletHomeScreen';
import { ManageCardsScreen } from '../screens/wallet/ManageCardsScreen';
import { AddCardScreen } from '../screens/wallet/AddCardScreen';
import { PayContractorScreen } from '../screens/wallet/PayContractorScreen';
import { ContractorPaySupplierScreen } from '../screens/wallet/ContractorPaySupplierScreen';
import { TransfersScreen } from '../screens/wallet/TransfersScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#38BDF8',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: { backgroundColor: '#0B1220', borderTopColor: '#1F2937' },
        tabBarIcon: ({ color, size }) => {
          const map: Record<string, keyof typeof Ionicons.glyphMap> = {
            Home: 'home',
            Search: 'search',
            Chats: 'chatbubbles',
            Wallet: 'wallet',
          };
          const icon = map[route.name] ?? 'ellipse';
          return <Ionicons name={icon} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="Home" component={HomeScreen} options={{ title: 'الرئيسية' }} />
      <Tabs.Screen name="Search" component={SearchScreen} options={{ title: 'بحث' }} />
      <Tabs.Screen name="Chats" component={ChatListScreen} options={{ title: 'محادثات' }} />
      <Tabs.Screen name="Wallet" component={WalletHomeScreen} options={{ title: 'المحفظة' }} />
    </Tabs.Navigator>
  );
}

export function AppNavigator() {
  const isAuthenticated = useStore((s) => s.isAuthenticated);

  const theme = useMemo(
    () => ({
      ...DarkTheme,
      colors: {
        ...DarkTheme.colors,
        background: '#0B1220',
        card: '#0B1220',
        primary: '#38BDF8',
        text: '#E2E8F0',
        border: '#1F2937',
        notification: '#F97316',
      },
    }),
    []
  );

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={LoginScreen} options={{ headerShown: false }} />
        ) : (
          <>
            <Stack.Screen name="App" component={MainTabs} options={{ headerShown: false }} />
            <Stack.Screen name="PublicProfile" component={PublicProfileScreen} options={{ title: 'ملف عام' }} />
            <Stack.Screen name="ChatRoom" component={ChatRoomScreen} options={{ title: 'محادثة' }} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'تعديل ملفي' }} />
            <Stack.Screen name="PortfolioManage" component={PortfolioManageScreen} options={{ title: 'معرض أعمالي' }} />
            <Stack.Screen name="ConnectionRequests" component={ConnectionRequestsScreen} options={{ title: 'طلبات التواصل' }} />
            <Stack.Screen name="ManageCards" component={ManageCardsScreen} options={{ title: 'البطاقات' }} />
            <Stack.Screen name="AddCard" component={AddCardScreen} options={{ title: 'إضافة بطاقة' }} />
            <Stack.Screen name="PayContractor" component={PayContractorScreen} options={{ title: 'دفع للمقاول' }} />
            <Stack.Screen name="ContractorPaySupplier" component={ContractorPaySupplierScreen} options={{ title: 'دفع للمورد' }} />
            <Stack.Screen name="Transfers" component={TransfersScreen} options={{ title: 'التحويلات' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
