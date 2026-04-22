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
import { colors, pressableRipple, radius, space, touch } from '../../theme';

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
  const [images, setImages] = useState('');
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
      <View style={{ marginBottom: space.md }}>
        <Text style={styles.title}>معرض الأعمال</Text>
        <Text style={styles.hint}>الصور: ضع رابط/روابط مفصولة بفاصلة، أو data URL واحد (base64).</Text>
        <TextInput placeholder="العنوان" placeholderTextColor={colors.placeholder} style={styles.input} value={title} onChangeText={setTitle} />
        <TextInput
          placeholder="الوصف"
          placeholderTextColor={colors.placeholder}
          style={[styles.input, { minHeight: 88 }]}
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <TextInput
          placeholder="صور"
          placeholderTextColor={colors.placeholder}
          style={[styles.input, { minHeight: 76 }]}
          value={images}
          onChangeText={setImages}
          multiline
        />
        <Pressable accessibilityRole="button" onPress={onSubmit} {...pressableRipple(colors.primaryTint18)} style={styles.primary}>
          <Text style={styles.primaryText}>{editingId ? 'تحديث' : 'إضافة'}</Text>
        </Pressable>
        {editingId ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              setEditingId(null);
              setTitle('');
              setDescription('');
              setImages('');
            }}
            {...pressableRipple(colors.primaryTint12)}
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
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(x) => x.id}
      ListHeaderComponent={header}
      keyboardShouldPersistTaps="handled"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          {item.description ? <Text style={styles.itemDesc}>{item.description}</Text> : null}
          <View style={{ flexDirection: 'row', gap: space.sm + 2, marginTop: space.sm + 2 }}>
            <Pressable
              accessibilityRole="button"
              onPress={() => onEdit(item)}
              {...pressableRipple(colors.primaryTint12)}
              style={styles.smallBtn}
            >
              <Text style={styles.smallBtnText}>تعديل</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => void onDelete(item)}
              {...pressableRipple('rgba(248,113,113,0.2)')}
              style={styles.smallDanger}
            >
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
  center: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
  listContent: { padding: space.lg, paddingBottom: space.xxl + 6, backgroundColor: colors.background },
  title: { color: colors.text, fontSize: 18, fontWeight: '900' },
  hint: { color: colors.textMuted, marginTop: space.sm, marginBottom: space.sm + 2, lineHeight: 20 },
  input: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
    paddingVertical: space.md,
    color: colors.textSecondary,
    marginBottom: space.sm + 2,
    textAlignVertical: 'top',
    minHeight: touch.minHeight,
  },
  primary: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: space.md,
    minHeight: touch.minHeight,
    justifyContent: 'center',
  },
  primaryText: { color: colors.onPrimary, textAlign: 'center', fontWeight: '900' },
  secondary: {
    marginTop: space.sm + 2,
    borderRadius: radius.md,
    paddingVertical: space.md,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    minHeight: touch.minHeight,
    justifyContent: 'center',
  },
  secondaryText: { color: colors.textSecondary, textAlign: 'center', fontWeight: '800' },
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.xl,
    padding: space.md,
    marginBottom: space.sm + 2,
  },
  itemTitle: { color: colors.text, fontWeight: '900' },
  itemDesc: { color: colors.textSubtle, marginTop: space.sm - 2, lineHeight: 20 },
  smallBtn: {
    flex: 1,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    paddingVertical: space.sm + 2,
    minHeight: touch.minHeight - 4,
    justifyContent: 'center',
  },
  smallBtnText: { color: colors.textSecondary, textAlign: 'center', fontWeight: '800' },
  smallDanger: {
    flex: 1,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.dangerBorder,
    paddingVertical: space.sm + 2,
    backgroundColor: colors.dangerBg,
    minHeight: touch.minHeight - 4,
    justifyContent: 'center',
  },
  smallDangerText: { color: colors.dangerText, textAlign: 'center', fontWeight: '900' },
  empty: { color: colors.placeholder, textAlign: 'center', marginTop: space.sm + 2 },
});
