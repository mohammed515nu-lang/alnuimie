import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useStore } from '../../store/useStore';
import type { RootStackParamList } from '../../navigation/types';
import { getApiErrorMessage } from '../../api/http';
import type { PublicProfile } from '../../api/types';
import { colors, pressableRipple, radius, space, touch } from '../../theme';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function SearchScreen() {
  const navigation = useNavigation<Nav>();
  const searchUsers = useStore((s) => s.searchUsers);
  const results = useStore((s) => s.searchResults);

  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const data = useMemo(() => results, [results]);

  const renderItem = ({ item }: { item: PublicProfile }) => (
    <Pressable
      accessibilityRole="button"
      style={styles.row}
      onPress={() => navigation.navigate('PublicProfile', { userId: item._id })}
      {...pressableRipple(colors.primaryTint12)}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.meta}>
          {item.role === 'contractor' ? 'مقاول' : item.role === 'client' ? 'عميل' : item.role}
          {item.city ? ` • ${item.city}` : ''}
        </Text>
      </View>
      <Text style={styles.chev}>›</Text>
    </Pressable>
  );

  return (
    <View style={styles.root}>
      <Text style={styles.title}>بحث المستخدمين</Text>
      <Text style={styles.hint}>افتح الملف العام → تواصل → بعد القبول يمكنك الدفع أو الدردشة.</Text>
      <TextInput
        placeholder="ابحث بالاسم/الإيميل/التخصص..."
        placeholderTextColor={colors.placeholder}
        style={styles.input}
        value={q}
        onChangeText={setQ}
        returnKeyType="search"
        clearButtonMode="while-editing"
      />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.error}>{error}</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => void run()}
            {...pressableRipple(colors.primaryTint12)}
            style={styles.retry}
          >
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
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<Text style={styles.empty}>لا نتائج</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background, padding: space.lg, paddingTop: space.lg + 2 },
  title: { color: colors.text, fontSize: 20, fontWeight: '900', marginBottom: space.sm - 2 },
  hint: { color: colors.placeholder, marginBottom: space.sm + 2, lineHeight: 18, fontSize: 13 },
  input: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
    paddingVertical: space.md,
    color: colors.textSecondary,
    marginBottom: space.sm + 2,
    minHeight: touch.minHeight,
  },
  list: { flex: 1 },
  listContent: { paddingBottom: space.xxl },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: space.md,
    paddingHorizontal: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardSoft,
    marginBottom: space.sm + 2,
    minHeight: touch.minHeight,
  },
  name: { color: colors.text, fontWeight: '900' },
  meta: { color: colors.textMuted, marginTop: space.xs },
  chev: { color: colors.textMuted, fontSize: 26, paddingLeft: space.sm },
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
