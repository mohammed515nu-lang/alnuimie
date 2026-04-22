import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useStore } from '../../store/useStore';
import { getApiErrorMessage } from '../../api/http';
import type { PortfolioItem } from '../../api/types';

export function PortfolioManageScreen() {
  const refreshPortfolio = useStore((s) => s.refreshPortfolio);
  const addPortfolioItem = useStore((s) => s.addPortfolioItem);
  const updatePortfolioItem = useStore((s) => s.updatePortfolioItem);
  const deletePortfolioItem = useStore((s) => s.deletePortfolioItem);
  const items = useStore((s) => s.portfolio);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState(''); // comma separated URLs or one data URL
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    await refreshPortfolio();
  }, [refreshPortfolio]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        await load();
      } catch (e) {
        Alert.alert('تعذر التحميل', getApiErrorMessage(e));
      } finally {
        setLoading(false);
      }
    })();
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await load();
    } catch (e) {
      Alert.alert('تعذر التحديث', getApiErrorMessage(e));
    } finally {
      setRefreshing(false);
    }
  };

  const parseImages = () => {
    const raw = images.trim();
    if (!raw) return [] as string[];
    if (raw.includes(',')) return raw.split(',').map((s) => s.trim()).filter(Boolean);
    return [raw];
  };

  const onSubmit = async () => {
    try {
      if (!title.trim()) return Alert.alert('تنبيه', 'العنوان مطلوب');
      if (editingId) {
        await updatePortfolioItem(editingId, { title: title.trim(), description: description.trim() || undefined, imageUris: parseImages() });
        setEditingId(null);
      } else {
        await addPortfolioItem({ title: title.trim(), description: description.trim() || undefined, imageUris: parseImages() });
      }
      setTitle('');
      setDescription('');
      setImages('');
    } catch (e) {
      Alert.alert('تعذر الحفظ', getApiErrorMessage(e));
    }
  };

  const onEdit = (it: PortfolioItem) => {
    setEditingId(it.id);
    setTitle(it.title);
    setDescription(it.description ?? '');
    setImages((it.imageUris ?? []).join(','));
  };

  const onDelete = async (it: PortfolioItem) => {
    Alert.alert('حذف', 'هل تريد حذف هذا العنصر؟', [
      { text: 'إلغاء', style: 'cancel' },
      {
        text: 'حذف',
        style: 'destructive',
        onPress: async () => {
          try {
            await deletePortfolioItem(it.id);
            if (editingId === it.id) {
              setEditingId(null);
              setTitle('');
              setDescription('');
              setImages('');
            }
          } catch (e) {
            Alert.alert('تعذر الحذف', getApiErrorMessage(e));
          }
        },
      },
    ]);
  };

  const header = useMemo(
    () => (
      <View style={{ marginBottom: 12 }}>
        <Text style={styles.title}>معرض الأعمال</Text>
        <Text style={styles.hint}>الصور: ضع رابط/روابط مفصولة بفاصلة، أو data URL واحد (base64).</Text>
        <TextInput placeholder="العنوان" placeholderTextColor="#64748B" style={styles.input} value={title} onChangeText={setTitle} />
        <TextInput placeholder="الوصف" placeholderTextColor="#64748B" style={[styles.input, { minHeight: 80 }]} value={description} onChangeText={setDescription} multiline />
        <TextInput placeholder="صور" placeholderTextColor="#64748B" style={[styles.input, { minHeight: 70 }]} value={images} onChangeText={setImages} multiline />
        <Pressable onPress={onSubmit} style={styles.primary}>
          <Text style={styles.primaryText}>{editingId ? 'تحديث' : 'إضافة'}</Text>
        </Pressable>
        {editingId ? (
          <Pressable
            onPress={() => {
              setEditingId(null);
              setTitle('');
              setDescription('');
              setImages('');
            }}
            style={styles.secondary}
          >
            <Text style={styles.secondaryText}>إلغاء التعديل</Text>
          </Pressable>
        ) : null}
      </View>
    ),
    [title, description, images, editingId]
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(x) => x.id}
      ListHeaderComponent={header}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      contentContainerStyle={{ padding: 16, paddingBottom: 30, backgroundColor: '#0B1220' }}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          {item.description ? <Text style={styles.itemDesc}>{item.description}</Text> : null}
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
            <Pressable onPress={() => onEdit(item)} style={styles.smallBtn}>
              <Text style={styles.smallBtnText}>تعديل</Text>
            </Pressable>
            <Pressable onPress={() => void onDelete(item)} style={styles.smallDanger}>
              <Text style={styles.smallDangerText}>حذف</Text>
            </Pressable>
          </View>
        </View>
      )}
      ListEmptyComponent={<Text style={styles.empty}>لا عناصر بعد</Text>}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, backgroundColor: '#0B1220', alignItems: 'center', justifyContent: 'center' },
  title: { color: '#F8FAFC', fontSize: 18, fontWeight: '900' },
  hint: { color: '#94A3B8', marginTop: 8, marginBottom: 10 },
  input: {
    backgroundColor: '#0B1220',
    borderColor: '#1F2937',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: '#E2E8F0',
    marginBottom: 10,
    textAlignVertical: 'top',
  },
  primary: { backgroundColor: '#38BDF8', borderRadius: 12, paddingVertical: 12 },
  primaryText: { color: '#0B1220', textAlign: 'center', fontWeight: '900' },
  secondary: { marginTop: 10, borderRadius: 12, paddingVertical: 12, borderWidth: 1, borderColor: '#334155' },
  secondaryText: { color: '#E2E8F0', textAlign: 'center', fontWeight: '800' },
  card: {
    backgroundColor: 'rgba(15,23,42,0.72)',
    borderColor: '#1F2937',
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
  },
  itemTitle: { color: '#F8FAFC', fontWeight: '900' },
  itemDesc: { color: '#CBD5E1', marginTop: 6 },
  smallBtn: { flex: 1, borderRadius: 12, borderWidth: 1, borderColor: '#334155', paddingVertical: 10 },
  smallBtnText: { color: '#E2E8F0', textAlign: 'center', fontWeight: '800' },
  smallDanger: { flex: 1, borderRadius: 12, borderWidth: 1, borderColor: '#7F1D1D', paddingVertical: 10, backgroundColor: 'rgba(127,29,29,0.15)' },
  smallDangerText: { color: '#FCA5A5', textAlign: 'center', fontWeight: '900' },
  empty: { color: '#64748B', textAlign: 'center', marginTop: 10 },
});
