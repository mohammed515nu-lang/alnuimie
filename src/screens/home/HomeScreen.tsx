import { useEffect, useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { WalletCard } from '../../components/wallet/WalletCard';
import { navigateFromRoot } from '../../navigation/rootNavigation';
import { useStore } from '../../store/useStore';
import { useAppTheme, pressableRipple, radius, space, touch } from '../../theme';
import type { AppPalette } from '../../theme/palettes';

export function HomeScreen() {
  const router = useRouter();
  const user = useStore((s) => s.user);
  const isContractor = user?.role === 'contractor';
  const isClient = user?.role === 'client';
  const refreshMyProfile = useStore((s) => s.refreshMyProfile);
  const { colors, surfaceLift } = useAppTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createHomeStyles(colors, surfaceLift), [colors, surfaceLift]);

  useEffect(() => {
    void (async () => {
      try {
        await refreshMyProfile();
      } catch {
        // ignore
      }
    })();
  }, [refreshMyProfile]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={[
          styles.root,
          { paddingBottom: space.xxl + 4 + insets.bottom },
        ]}
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.hi}>مرحباً</Text>
            <Text style={styles.name}>{user?.name ?? ''}</Text>
            <Text style={styles.role}>{user?.role === 'contractor' ? 'مقاول' : user?.role === 'client' ? 'صاحب مشروع' : user?.role}</Text>
          </View>
        </View>

        <WalletCard
          subtitle={
            isClient
              ? 'مدفوعاتك وبطاقاتك — تابع الدفع للمقاولين من هنا.'
              : 'مقبوضاتك ودفعات الموردين — نظرة من الخادم.'
          }
        />

        <Text style={styles.section}>{isClient ? 'اختصارات صاحب المشروع' : 'اختصارات المقاول'}</Text>
        <View style={styles.grid}>
          <Pressable
            style={styles.tile}
            onPress={() => router.push('/(main)/(tabs)/accounting' as any)}
            {...pressableRipple(colors.primaryTint12)}
          >
            <Ionicons name="calculator-outline" size={28} color={colors.primary} />
            <Text style={styles.tileText}>{isClient ? 'المدفوعات والمحفظة' : 'المحاسبة والموقع'}</Text>
          </Pressable>
          <Pressable
            style={styles.tile}
            onPress={() => router.push('/(main)/(tabs)/projects' as any)}
            {...pressableRipple(colors.primaryTint12)}
          >
            <Ionicons name="folder-outline" size={28} color={colors.primary} />
            <Text style={styles.tileText}>{isClient ? 'مشاريعي' : 'مشاريع العمل'}</Text>
          </Pressable>
          <Pressable
            style={styles.tile}
            onPress={() => navigateFromRoot('DiscoverUsers')}
            {...pressableRipple(colors.primaryTint12)}
          >
            <Ionicons name="search" size={28} color={colors.aiPurple} />
            <Text style={styles.tileText}>{isClient ? 'البحث عن مقاولين' : 'البحث عن عملاء'}</Text>
          </Pressable>
          <Pressable
            style={styles.tile}
            onPress={() => router.push('/(main)/(tabs)/chats' as any)}
            {...pressableRipple(colors.primaryTint12)}
          >
            <Ionicons name="chatbubbles-outline" size={28} color={colors.link} />
            <Text style={styles.tileText}>المحادثات</Text>
          </Pressable>
          {isClient ? (
            <Pressable
              style={styles.tile}
              onPress={() => navigateFromRoot('PayContractor')}
              {...pressableRipple(colors.primaryTint12)}
            >
              <Ionicons name="card-outline" size={28} color={colors.success} />
              <Text style={styles.tileText}>دفع لمقاول</Text>
            </Pressable>
          ) : (
            <Pressable
              style={styles.tile}
              onPress={() => navigateFromRoot('ContractorPaySupplier')}
              {...pressableRipple(colors.primaryTint12)}
            >
              <Ionicons name="construct-outline" size={28} color={colors.success} />
              <Text style={styles.tileText}>دفع لمورد</Text>
            </Pressable>
          )}
          <Pressable
            style={styles.tile}
            onPress={() => navigateFromRoot('ConnectionRequests')}
            {...pressableRipple(colors.primaryTint12)}
          >
            <Ionicons name="people-outline" size={28} color={colors.reportValue} />
            <Text style={styles.tileText}>طلبات التواصل</Text>
          </Pressable>
        </View>

        <Text style={styles.section}>حسابي وملفي</Text>
        <View style={styles.card}>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/(main)/(tabs)/account' as any)}
            {...pressableRipple(colors.primaryTint12)}
            style={styles.rowBtn}
          >
            <Ionicons name="chevron-back" size={20} color={colors.textMuted} />
            <Text style={styles.rowBtnText}>فتح حسابي</Text>
            <Ionicons name="person-circle-outline" size={24} color={colors.primary} />
          </Pressable>
          <View style={styles.div} />
          <Pressable
            accessibilityRole="button"
            onPress={() => navigateFromRoot('EditProfile')}
            {...pressableRipple(colors.primaryTint12)}
            style={styles.rowBtn}
          >
            <Ionicons name="chevron-back" size={20} color={colors.textMuted} />
            <Text style={styles.rowBtnText}>تعديل ملفي العام</Text>
            <Ionicons name="create-outline" size={22} color={colors.link} />
          </Pressable>
          {isContractor ? (
            <>
              <View style={styles.div} />
              <Pressable
                accessibilityRole="button"
                onPress={() => navigateFromRoot('PortfolioManage')}
                {...pressableRipple(colors.primaryTint12)}
                style={styles.rowBtn}
              >
                <Ionicons name="chevron-back" size={20} color={colors.textMuted} />
                <Text style={styles.rowBtnText}>معرض أعمالي</Text>
                <Ionicons name="images-outline" size={22} color={colors.primary} />
              </Pressable>
            </>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function createHomeStyles(colors: AppPalette, surfaceLift: ViewStyle) {
  return StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  root: { padding: space.lg },
  header: { marginBottom: space.md },
  hi: { color: colors.textMuted, textAlign: 'right' },
  name: { color: colors.text, fontSize: 22, fontWeight: '900', textAlign: 'right', marginTop: space.xs },
  role: { color: colors.primary, marginTop: space.xs, fontWeight: '800', textAlign: 'right' },
  section: { color: colors.text, fontSize: 17, fontWeight: '900', textAlign: 'right', marginTop: space.lg, marginBottom: space.sm },
  grid: { flexDirection: 'row-reverse', flexWrap: 'wrap', justifyContent: 'space-between', gap: space.sm },
  tile: {
    ...surfaceLift,
    width: '48%',
    backgroundColor: colors.surfaceMid,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    padding: space.md,
    marginBottom: space.sm,
    alignItems: 'flex-end',
    minHeight: 100,
    justifyContent: 'space-between',
  },
  tileText: { color: colors.textSecondary, fontWeight: '800', textAlign: 'right', marginTop: space.sm },
  card: {
    ...surfaceLift,
    backgroundColor: colors.surfaceMid,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.borderMuted,
  },
  rowBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: space.md,
    gap: space.md,
    minHeight: touch.minHeight,
  },
  rowBtnText: { flex: 1, color: colors.text, fontWeight: '800', textAlign: 'right', fontSize: 15 },
  div: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border, marginHorizontal: space.md },
});
}
