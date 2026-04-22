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
    <Pressable style={styles.row} onPress={() => navigation.navigate('PublicProfile', { userId: item._id })}>
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
      <TextInput
        placeholder="ابحث بالاسم/الإيميل/التخصص..."
        placeholderTextColor="#64748B"
        style={styles.input}
        value={q}
        onChangeText={setQ}
      />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.error}>{error}</Text>
          <Pressable onPress={() => void run()} style={styles.retry}>
            <Text style={styles.retryText}>إعادة المحاولة</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(x) => x._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 24 }}
          ListEmptyComponent={<Text style={styles.empty}>لا نتائج</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0B1220', padding: 16, paddingTop: 18 },
  title: { color: '#F8FAFC', fontSize: 20, fontWeight: '900', marginBottom: 10 },
  input: {
    backgroundColor: '#0B1220',
    borderColor: '#1F2937',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: '#E2E8F0',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1F2937',
    backgroundColor: 'rgba(15,23,42,0.55)',
    marginBottom: 10,
  },
  name: { color: '#F8FAFC', fontWeight: '900' },
  meta: { color: '#94A3B8', marginTop: 4 },
  chev: { color: '#94A3B8', fontSize: 26, paddingLeft: 8 },
  center: { paddingTop: 30, alignItems: 'center' },
  error: { color: '#FB7185', textAlign: 'center' },
  retry: { marginTop: 12, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: '#334155' },
  retryText: { color: '#E2E8F0', fontWeight: '800' },
  empty: { color: '#64748B', textAlign: 'center', marginTop: 18 },
});
