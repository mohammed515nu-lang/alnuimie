import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useAppTheme, hitSlop, space } from '../theme';
import type { AppPalette } from '../theme/palettes';
import { DASHBOARD_RADIUS, getDashboardPalette, type DashboardPalette } from '../theme/dashboardLight';

type Props = {
  title: string;
  /** يُعرض يسار العنوان (مثلاً +) في واجهة RTL */
  leftAction?: ReactNode;
  showBack?: boolean;
  /** مطابقة شاشات الرئيسية / المحاسبة الفاتحة */
  tone?: 'default' | 'beige';
};

export function TopBar({ title, leftAction, showBack = true, tone = 'default' }: Props) {
  const router = useRouter();
  const { colors, resolved } = useAppTheme();
  const dash = useMemo(() => getDashboardPalette(resolved), [resolved]);
  /** `resolved` + `tone` يكفيان: `colors` و`dash` يُشتقان من `resolved` في ThemeProvider — إدراج `colors`/`dash` في التبعيات سبب حلقة تحديث مع persist */
  const styles = useMemo(() => createTopBarStyles(colors, tone, dash), [resolved, tone]);
  const chevronColor = tone === 'beige' ? dash.navy : colors.text;

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        {showBack ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="رجوع"
            hitSlop={hitSlop}
            onPress={() => router.back()}
            style={styles.iconCircle}
          >
            <Ionicons name="chevron-forward" size={22} color={chevronColor} />
          </Pressable>
        ) : (
          <View style={styles.iconCircleHidden} />
        )}
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.side}>{leftAction ?? <View style={styles.iconCircleHidden} />}</View>
      </View>
    </View>
  );
}

function createTopBarStyles(colors: AppPalette, tone: 'default' | 'beige', dash: DashboardPalette) {
  const beige = tone === 'beige';
  return StyleSheet.create({
    wrap: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: beige ? dash.border : colors.borderMuted,
      paddingBottom: space.sm + 2,
      marginBottom: space.md,
    },
    row: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      paddingHorizontal: space.md,
      gap: space.sm,
    },
    title: {
      flex: 1,
      textAlign: 'center',
      color: beige ? dash.navy : colors.text,
      fontSize: 17,
      fontWeight: '800',
    },
    side: { minWidth: 40, alignItems: 'center', justifyContent: 'center' },
    iconCircle: {
      width: 40,
      height: 40,
      borderRadius: DASHBOARD_RADIUS,
      backgroundColor: beige ? dash.white : colors.surfaceMid,
      borderWidth: 1,
      borderColor: beige ? dash.border : colors.borderMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconCircleHidden: { width: 40, height: 40 },
  });
}
