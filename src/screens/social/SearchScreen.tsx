import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { ApiStateView } from '../../components/ApiStateView';
import { TopBar } from '../../components/TopBar';
import { pushStackRoute } from '../../navigation/href';
import { useStore } from '../../store/useStore';
import { getApiErrorMessage } from '../../api/http';
import type { PublicProfile } from '../../api/types';
import { pressableRipple, space, touch, useAppTheme } from '../../theme';
import { DASHBOARD_RADIUS, getDashboardPalette, type DashboardPalette } from '../../theme/dashboardLight';
import { hapticLight } from '../../utils/haptics';

type RoleFilter = 'all' | 'contractor' | 'client';

type SearchListStyles = ReturnType<typeof createStyles>;

type SearchResultRowProps = {
  userId: string;
  name: string;
  roleLabel: string;
  roleIcon: keyof typeof Ionicons.glyphMap;
  onOpenProfile: (userId: string) => void;
  listStyles: SearchListStyles;
  dash: DashboardPalette;
};

const SearchResultRow = memo(function SearchResultRow({
  userId,
  name,
  roleLabel,
  roleIcon,
  onOpenProfile,
  listStyles,
  dash,
}: SearchResultRowProps) {
  const onPress = useCallback(() => {
    onOpenProfile(userId);
  }, [userId, onOpenProfile]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`فتح الملف: ${name}`}
      style={listStyles.row}
      onPress={onPress}
      {...pressableRipple(dash.navyTint)}
    >
      <Ionicons name="chevron-back" size={18} color={dash.muted} />
      <View style={listStyles.rowText}>
        <Text style={listStyles.name}>{name}</Text>
        <Text style={listStyles.meta}>{roleLabel}</Text>
      </View>
      <View style={listStyles.roleIcon}>
        <Ionicons name={roleIcon} size={20} color={dash.navy} />
      </View>
    </Pressable>
  );
});

export function SearchScreen() {
  const myRole = useStore((s) => s.user?.role);
  const searchUsers = useStore((s) => s.searchUsers);
  const results = useStore((s) => s.searchResults);
  const insets = useSafeAreaInsets();
  const { resolved } = useAppTheme();
  const dash = useMemo(() => getDashboardPalette(resolved), [resolved]);
  const styles = useMemo(() => createStyles(dash), [dash]);
  const apiTone = resolved === 'light' ? 'beige' : 'default';

  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');

  useEffect(() => {
    if (myRole === 'client') setRoleFilter('contractor');
    else if (myRole === 'contractor') setRoleFilter('client');
    else setRoleFilter('all');
  }, [myRole]);

  const run = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const scopedRole = roleFilter === 'all' ? undefined : roleFilter;
      await searchUsers(q, scopedRole);
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [q, roleFilter, searchUsers]);

  useEffect(() => {
    const t = setTimeout(() => {
      void run();
    }, 350);
    return () => clearTimeout(t);
  }, [run]);

  const data = useMemo(() => {
    if (roleFilter === 'all') return results;
    return results.filter((u) => u.role === roleFilter);
  }, [results, roleFilter]);

  const openProfile = useCallback((userId: string) => {
    const safeUserId = String(userId ?? '').trim();
    if (!safeUserId) return;
    hapticLight();
    pushStackRoute('PublicProfile', { userId: safeUserId });
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: PublicProfile }) => {
      const roleLabel =
        item.role === 'contractor' ? 'مقاول' : item.role === 'client' ? 'عميل' : item.role;
      const roleIcon: keyof typeof Ionicons.glyphMap =
        item.role === 'contractor' ? 'construct-outline' : 'person-outline';
      return (
        <SearchResultRow
          userId={item._id}
          name={item.name}
          roleLabel={roleLabel}
          roleIcon={roleIcon}
          onOpenProfile={openProfile}
          listStyles={styles}
          dash={dash}
        />
      );
    },
    [openProfile, styles, dash]
  );

  const chip = (key: RoleFilter, label: string) => {
    const on = roleFilter === key;
    return (
      <Pressable
        key={key}
        onPress={() => {
          hapticLight();
          setRoleFilter(key);
        }}
        style={[styles.chip, on && styles.chipOn]}
        {...pressableRipple(dash.goldTint)}
      >
        <Text style={[styles.chipText, on && styles.chipTextOn]}>{label}</Text>
      </Pressable>
    );
  };

  const bottomPad = 24 + insets.bottom;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <TopBar tone="beige" title="ابدأ محادثة" />
      <View style={styles.root}>
        <Text style={styles.lead}>ابحث بالاسم أو المدينة أو التخصص، ثم افتح الملف لإرسال طلب تواصل أو متابعة المحادثة.</Text>

        <View style={styles.searchWrap}>
          <Ionicons name="search-outline" size={20} color={dash.muted} style={{ marginLeft: 8 }} />
          <TextInput
            placeholder="ابحث بالاسم، المدينة، التخصص..."
            placeholderTextColor={dash.muted}
            style={styles.input}
            value={q}
            onChangeText={setQ}
            returnKeyType="search"
            textAlign="right"
          />
        </View>

        <View style={styles.chipsRow}>
          {chip('all', 'الكل')}
          {chip('contractor', 'المقاولون')}
          {chip('client', 'العملاء')}
        </View>

        {loading ? (
          <View style={styles.center}>
            <ApiStateView tone={apiTone} mode="loading" title="جاري البحث..." />
          </View>
        ) : error ? (
          <View style={styles.center}>
            <ApiStateView
              tone={apiTone}
              mode="error"
              title="تعذر تنفيذ البحث"
              subtitle={error}
              onRetry={() => void run()}
            />
          </View>
        ) : (
          <FlatList
            style={styles.list}
            data={data}
            keyExtractor={(x) => x._id}
            renderItem={renderItem}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            contentInsetAdjustmentBehavior="automatic"
            contentContainerStyle={[styles.listContent, { paddingBottom: bottomPad }]}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <ApiStateView
                tone={apiTone}
                mode="empty"
                title="لا نتائج"
                subtitle="جرّب كلمات أخرى أو غيّر تصفية الدور."
              />
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

function createStyles(dash: DashboardPalette) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: dash.pageBg },
    root: { flex: 1, paddingHorizontal: 16, paddingTop: 4 },
    lead: {
      color: dash.muted,
      fontSize: 14,
      lineHeight: 22,
      textAlign: 'right',
      marginBottom: 14,
    },
    searchWrap: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      backgroundColor: dash.white,
      borderRadius: DASHBOARD_RADIUS,
      borderWidth: 1,
      borderColor: dash.border,
      paddingHorizontal: 12,
      marginBottom: 12,
      minHeight: touch.minHeight - 4,
    },
    input: {
      flex: 1,
      paddingVertical: 12,
      color: dash.darkText,
      minHeight: touch.minHeight - 4,
      fontSize: 15,
    },
    chipsRow: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
    chip: {
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 12,
      backgroundColor: dash.white,
      borderWidth: 1,
      borderColor: dash.border,
    },
    chipOn: { borderColor: dash.gold, backgroundColor: dash.goldTint },
    chipText: { color: dash.muted, fontWeight: '800' },
    chipTextOn: { color: dash.navy, fontWeight: '900' },
    list: { flex: 1 },
    listContent: { paddingTop: 4 },
    row: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 12,
      borderRadius: DASHBOARD_RADIUS,
      borderWidth: 1,
      borderColor: dash.border,
      backgroundColor: dash.white,
      marginBottom: 10,
      minHeight: touch.minHeight,
      gap: 12,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
    },
    rowText: { flex: 1 },
    roleIcon: {
      width: 48,
      height: 48,
      borderRadius: 14,
      backgroundColor: dash.goldTint,
      alignItems: 'center',
      justifyContent: 'center',
    },
    name: { color: dash.darkText, fontWeight: '900', textAlign: 'right', fontSize: 16 },
    meta: { color: dash.muted, marginTop: 4, textAlign: 'right', fontWeight: '600', fontSize: 13 },
    center: { flex: 1, paddingTop: 24, alignItems: 'stretch' },
  });
}
