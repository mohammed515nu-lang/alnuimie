import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { pushStackRoute } from '../../navigation/href';
import { useStore } from '../../store/useStore';
import { getApiErrorMessage } from '../../api/http';
import type { PublicProfile } from '../../api/types';
import { useAppTheme, pressableRipple, radius, space, touch } from '../../theme';
import type { AppPalette } from '../../theme/palettes';
import { hapticLight } from '../../utils/haptics';
import { isIOS } from '../../utils/platformEnv';

type RoleFilter = 'all' | 'contractor' | 'client';

type SearchListStyles = ReturnType<typeof createSearchStyles>;

type SearchResultRowProps = {
  userId: string;
  name: string;
  roleLabel: string;
  roleIcon: 'hammer' | 'person';
  onOpenProfile: (userId: string) => void;
  listStyles: SearchListStyles;
  colors: AppPalette;
};

const SearchResultRow = memo(function SearchResultRow({
  userId,
  name,
  roleLabel,
  roleIcon,
  onOpenProfile,
  listStyles,
  colors,
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
      {...pressableRipple(colors.primaryTint12)}
    >
      <Ionicons name="chevron-back" size={18} color={colors.textMuted} />
      <View style={listStyles.rowText}>
        <Text style={listStyles.name}>{name}</Text>
        <Text style={listStyles.meta}>{roleLabel}</Text>
      </View>
      <View style={listStyles.roleIcon}>
        <Ionicons name={roleIcon} size={18} color={colors.onPrimary} />
      </View>
    </Pressable>
  );
});

export function SearchScreen() {
  const navigation = useNavigation();
  const myRole = useStore((s) => s.user?.role);
  const searchUsers = useStore((s) => s.searchUsers);
  const results = useStore((s) => s.searchResults);
  const { colors } = useAppTheme();
  const styles = useMemo(() => createSearchStyles(colors), [colors]);

  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  /** العميل يبحث عن مقاولين افتراضياً، والمقاول عن عملاء */
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');

  useLayoutEffect(() => {
    if (myRole === 'client') setRoleFilter('contractor');
    else if (myRole === 'contractor') setRoleFilter('client');
    else setRoleFilter('all');
  }, [myRole]);

  useLayoutEffect(() => {
    if (!isIOS) return;
    navigation.setOptions({
      headerSearchBar: {
        placeholder: 'ابحث بالاسم، المدينة، التخصص...',
        onChangeText: (e: { nativeEvent: { text: string } }) => setQ(e.nativeEvent.text),
        autoCapitalize: 'none',
      },
    } as never);
  }, [navigation]);

  const run = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      await searchUsers(q);
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [q, searchUsers]);

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
    hapticLight();
    pushStackRoute('PublicProfile', { userId });
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: PublicProfile }) => {
      const roleLabel =
        item.role === 'contractor' ? 'مقاول' : item.role === 'client' ? 'عميل' : item.role;
      const roleIcon: 'hammer' | 'person' = item.role === 'contractor' ? 'hammer' : 'person';
      return (
        <SearchResultRow
          userId={item._id}
          name={item.name}
          roleLabel={roleLabel}
          roleIcon={roleIcon}
          onOpenProfile={openProfile}
          listStyles={styles}
          colors={colors}
        />
      );
    },
    [openProfile, styles, colors]
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
        {...pressableRipple(colors.primaryTint12)}
      >
        <Text style={[styles.chipText, on && styles.chipTextOn]}>{label}</Text>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.root}>
        {!isIOS ? (
          <View style={styles.searchWrap}>
            <Ionicons name="search" size={20} color={colors.textMuted} style={styles.searchIcon} />
            <TextInput
              placeholder="ابحث بالاسم، المدينة، التخصص..."
              placeholderTextColor={colors.placeholder}
              style={styles.input}
              value={q}
              onChangeText={setQ}
              returnKeyType="search"
              textAlign="right"
            />
          </View>
        ) : null}

        <View style={styles.chipsRow}>
          {chip('all', 'الكل')}
          {chip('contractor', 'المقاولون')}
          {chip('client', 'العملاء')}
        </View>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : error ? (
          <View style={styles.center}>
            <Text style={styles.error} selectable>
              {error}
            </Text>
            <Pressable accessibilityRole="button" onPress={() => void run()} {...pressableRipple(colors.primaryTint12)} style={styles.retry}>
              <Text style={styles.retryText}>إعادة المحاولة</Text>
            </Pressable>
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
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={<Text style={styles.empty}>لا نتائج</Text>}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

function createSearchStyles(colors: AppPalette) {
  return StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  root: { flex: 1, paddingHorizontal: space.lg, paddingTop: space.sm },
  searchWrap: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: colors.surfaceMid,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    paddingHorizontal: space.md,
    marginBottom: space.md,
  },
  searchIcon: { marginLeft: space.sm },
  input: {
    flex: 1,
    paddingVertical: space.md,
    color: colors.textSecondary,
    minHeight: touch.minHeight - 4,
  },
  chipsRow: { flexDirection: 'row-reverse', gap: space.sm, marginBottom: space.md },
  chip: {
    paddingHorizontal: space.md,
    paddingVertical: space.sm + 2,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMid,
    borderWidth: 1,
    borderColor: colors.borderMuted,
  },
  chipOn: { borderColor: colors.primary, backgroundColor: colors.primaryTint12 },
  chipText: { color: colors.textMuted, fontWeight: '800' },
  chipTextOn: { color: colors.primary },
  list: { flex: 1 },
  listContent: { paddingBottom: space.xxl },
  row: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingVertical: space.md,
    paddingHorizontal: space.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    backgroundColor: colors.surfaceMid,
    marginBottom: space.sm + 2,
    minHeight: touch.minHeight,
    gap: space.md,
  },
  rowText: { flex: 1 },
  roleIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { color: colors.text, fontWeight: '900', textAlign: 'right', fontSize: 16 },
  meta: { color: colors.textMuted, marginTop: 4, textAlign: 'right', fontWeight: '600' },
  center: { flex: 1, paddingTop: space.xxl + 6, alignItems: 'center' },
  error: { color: colors.error, textAlign: 'center', paddingHorizontal: space.md },
  retry: {
    marginTop: space.md,
    paddingHorizontal: space.md - 2,
    paddingVertical: space.sm + 2,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    minHeight: touch.minHeight,
    justifyContent: 'center',
  },
  retryText: { color: colors.textSecondary, fontWeight: '800' },
  empty: { color: colors.placeholder, textAlign: 'center', marginTop: space.lg + 2 },
});
}
