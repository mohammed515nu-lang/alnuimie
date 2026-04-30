import { Ionicons } from '@expo/vector-icons';
import {
  createMaterialTopTabNavigator,
  type MaterialTopTabBarProps,
  type MaterialTopTabNavigationEventMap,
  type MaterialTopTabNavigationOptions,
} from '@react-navigation/material-top-tabs';
import type { ParamListBase, TabNavigationState } from '@react-navigation/native';
import { withLayoutContext } from 'expo-router';
import { tabRouterOverride } from 'expo-router/build/layouts/TabRouter';
import { useMemo } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppTheme } from '../../../src/theme';
import { getDashboardPalette } from '../../../src/theme/dashboardLight';

/** شريط سفلي داكن مع بطاقة وحواف خارجية — سحب أفقي بين التبويبات */
const TAB_BAR_CARD_BG = '#0a0f16';
const TAB_BAR_CARD_BORDER = 'rgba(255,255,255,0.12)';
const TAB_LABEL = 'rgba(255,255,255,0.52)';
const TAB_LABEL_ACTIVE = '#f2e6c9';
const TAB_ACCENT = '#c9a96b';

const TAB_LABEL_AR: Record<string, string> = {
  index: 'الرئيسية',
  projects: 'المشاريع',
  'bunyan-ai': 'مساعد بنيان',
  accounting: 'الحسابات',
  chats: 'المحادثات',
  account: 'حسابي',
};

const TopMaterial = createMaterialTopTabNavigator();

const ExpoTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof TopMaterial.Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(TopMaterial.Navigator);

const tabIcon: Record<string, keyof typeof Ionicons.glyphMap> = {
  index: 'home-outline',
  projects: 'folder-outline',
  'bunyan-ai': 'hardware-chip-outline',
  accounting: 'calculator-outline',
  chats: 'chatbubbles-outline',
  account: 'person-outline',
};

function DashboardBottomTabBar({ state, descriptors, navigation }: MaterialTopTabBarProps) {
  const insets = useSafeAreaInsets();
  const { resolved, authUi } = useAppTheme();
  const isDark = resolved === 'dark';
  const tabCardStyle = [
    styles.tabBarCard,
    isDark ? { backgroundColor: authUi.card, borderColor: authUi.border } : null,
  ];
  const accent = isDark ? authUi.gold : TAB_ACCENT;
  const labelActive = isDark ? authUi.gold : TAB_LABEL_ACTIVE;
  const labelIdle = isDark ? authUi.muted : TAB_LABEL;

  return (
    <View style={[styles.tabBarScreenPad, { paddingBottom: insets.bottom + 12 }]}>
      <View style={tabCardStyle}>
        <View style={styles.tabRow}>
          {state.routes.map((route) => {
            const focused = state.routes[state.index]?.key === route.key;
            const opts = descriptors[route.key]?.options ?? {};
            const label =
              TAB_LABEL_AR[route.name] ??
              (typeof opts.title === 'string'
                ? opts.title
                : typeof opts.tabBarLabel === 'string'
                  ? opts.tabBarLabel
                  : route.name);
            const icon = tabIcon[route.name] ?? 'ellipse';
            const color = focused ? labelActive : labelIdle;

            return (
              <Pressable
                key={route.key}
                style={styles.tabBtn}
                accessibilityRole="button"
                accessibilityState={{ selected: focused }}
                onPress={() => {
                  const e = navigation.emit({
                    type: 'tabPress',
                    target: route.key,
                    canPreventDefault: true,
                  });
                  if (!focused && !e.defaultPrevented) {
                    navigation.navigate(route.name);
                  }
                }}
              >
                <View style={styles.iconWrap}>
                  <View style={[styles.activeDash, focused && { backgroundColor: accent }]} />
                  <Ionicons name={icon} size={22} color={color} />
                </View>
                <Text style={[styles.tabLabel, { color }]} numberOfLines={1}>
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

export default function MainTabsLayout() {
  const { resolved, authUi } = useAppTheme();
  const dash = useMemo(() => getDashboardPalette(resolved), [resolved]);
  const isDark = resolved === 'dark';

  return (
    <ExpoTopTabs
      UNSTABLE_router={tabRouterOverride}
      initialRouteName="index"
      tabBarPosition="bottom"
      tabBar={(props) => <DashboardBottomTabBar {...props} />}
      screenOptions={{
        swipeEnabled: true,
        animationEnabled: true,
        lazy: true,
        tabBarShowIcon: true,
        tabBarActiveTintColor: isDark ? authUi.gold : TAB_LABEL_ACTIVE,
        tabBarInactiveTintColor: isDark ? authUi.muted : TAB_LABEL,
        sceneStyle: { backgroundColor: dash.pageBg },
      }}
    >
      {/* ترتيب المشهد: من اليسار لليمين = الحساب … الرئيسية (الرئيسية يمين الشاشة) */}
      <ExpoTopTabs.Screen name="account" />
      <ExpoTopTabs.Screen name="chats" />
      <ExpoTopTabs.Screen name="accounting" />
      <ExpoTopTabs.Screen name="bunyan-ai" />
      <ExpoTopTabs.Screen name="projects" />
      <ExpoTopTabs.Screen name="index" />
    </ExpoTopTabs>
  );
}

const styles = StyleSheet.create({
  tabBarScreenPad: {
    paddingHorizontal: 14,
    backgroundColor: 'transparent',
  },
  tabBarCard: {
    backgroundColor: TAB_BAR_CARD_BG,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: TAB_BAR_CARD_BORDER,
    paddingTop: 10,
    paddingBottom: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 14,
      },
      android: { elevation: 12 },
    }),
  },
  tabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 2,
    minWidth: 0,
  },
  tabLabel: {
    fontWeight: '800',
    fontSize: 11,
    marginTop: 2,
    marginBottom: 2,
    textAlign: 'center',
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  activeDash: {
    width: 28,
    height: 2,
    borderRadius: 1,
    marginBottom: 4,
    backgroundColor: 'transparent',
  },
});
