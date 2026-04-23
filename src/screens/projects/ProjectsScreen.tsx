import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { navigateFromRoot } from '../../navigation/rootNavigation';
import { useStore } from '../../store/useStore';
import { useAppTheme, pressableRipple, radius, space, touch } from '../../theme';
import type { AppPalette } from '../../theme/palettes';

export function ProjectsScreen() {
  const role = useStore((s) => s.user?.role);
  const isClient = role === 'client';
  const { colors } = useAppTheme();
  const styles = useMemo(() => createProjectsStyles(colors), [colors]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.root}>
        <Text style={styles.pageTitle}>{isClient ? 'مشاريعي' : 'مشاريع العمل'}</Text>
        <View style={styles.emptyWrap}>
          <Ionicons name="folder-open-outline" size={72} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>{isClient ? 'لا مشاريع مسجلة بعد' : 'لا مشاريع بعد'}</Text>
          <Text style={styles.emptySub}>
            {isClient
              ? 'ابدأ بربط مشروع مع مقاول أو تابع العروض من المحادثات.'
              : 'أنشئ مشروعاً لتتبّع الميزانية والمواعيد والمواد.'}
          </Text>
          {isClient ? (
            <Pressable
              accessibilityRole="button"
              onPress={() => navigateFromRoot('DiscoverUsers')}
              {...pressableRipple(colors.primaryTint12)}
              style={styles.cta}
            >
              <Text style={styles.ctaText}>البحث عن مقاولين</Text>
            </Pressable>
          ) : (
            <Pressable
              accessibilityRole="button"
              onPress={() => navigateFromRoot('NewProject')}
              {...pressableRipple(colors.primaryTint12)}
              style={styles.cta}
            >
              <Text style={styles.ctaText}>مشروع جديد</Text>
            </Pressable>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

function createProjectsStyles(colors: AppPalette) {
  return StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  root: { flex: 1, paddingHorizontal: space.lg },
  pageTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'right',
    marginBottom: space.lg,
    marginTop: space.sm,
  },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: space.xxl * 2 },
  emptyTitle: { color: colors.textMuted, fontSize: 17, fontWeight: '800', marginTop: space.lg },
  emptySub: { color: colors.placeholder, textAlign: 'center', marginTop: space.sm, paddingHorizontal: space.xl },
  cta: {
    marginTop: space.xl,
    backgroundColor: colors.primary,
    paddingHorizontal: space.xxl,
    paddingVertical: space.md,
    borderRadius: radius.lg,
    minHeight: touch.minHeight,
    justifyContent: 'center',
  },
  ctaText: { color: colors.onPrimary, fontWeight: '900', fontSize: 16 },
});
}
