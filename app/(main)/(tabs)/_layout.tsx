import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppTheme } from '../../../src/theme';

export default function MainTabsLayout() {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const tabBarHeight = 58 + insets.bottom;

  const tabIcon: Record<string, keyof typeof Ionicons.glyphMap> = {
    index: 'home-outline',
    projects: 'folder-outline',
    'bunyan-ai': 'hardware-chip-outline',
    accounting: 'calculator-outline',
    chats: 'chatbubbles-outline',
    account: 'person-outline',
  };

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.borderMuted,
          paddingTop: 4,
          paddingBottom: insets.bottom,
          height: tabBarHeight,
        },
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: { fontWeight: '700' as const, fontSize: 10, marginBottom: 2 },
        tabBarIcon: ({ color, size }) => {
          const icon = tabIcon[route.name] ?? 'ellipse';
          return <Ionicons name={icon} size={size - 2} color={color} />;
        },
      })}
    />
  );
}
