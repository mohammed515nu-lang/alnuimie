import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { ApiStateView } from '../../components/ApiStateView';
import { TopBar } from '../../components/TopBar';
import { useStore } from '../../store/useStore';
import { getApiErrorMessage } from '../../api/http';
import type { PortfolioItem } from '../../api/types';
import { pressableRipple, space, touch, useAppTheme } from '../../theme';
import { DASHBOARD_RADIUS, getDashboardPalette, type DashboardPalette } from '../../theme/dashboardLight';

export function PortfolioManageScreen() {
  const addPortfolioItem = useStore((s) => s.addPortfolioItem);
  const updatePortfolioItem = useStore((s) => s.updatePortfolioItem);
  const deletePortfolioItem = useStore((s) => s.deletePortfolioItem);
  const items = useStore((s) => s.portfolio);
  const insets = useSafeAreaInsets();
  const { resolved } = useAppTheme();
  const dash = useMemo(() => getDashboardPalette(resolved), [resolved]);
  const styles = useMemo(() => createStyles(dash), [dash]);
  const apiTone = resolved === 'light' ? 'beige' : 'default';

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    await useStore.getState().refreshPortfolio();
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        await load();
      } catch (e) {
        setError(getApiErrorMessage(e));
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
      setError(getApiErrorMessage(e));
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
        await updatePortfolioItem(editingId, {
          title: title.trim(),
          description: description.trim() || undefined,
          imageUris: parseImages(),
        });
        setEditingId(null);
      } else {
        await addPortfolioItem({
          title: title.trim(),
          description: description.trim() || undefined,
          imageUris: parseImages(),
        });
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
      <View style={styles.headerBlock}>
        <Text style={styles.lead}>الصور: ضع رابط/روابط مفصولة بفاصلة، أو data URL واحد (base64).</Text>
        <TextInput
          placeholder="العنوان"
          placeholderTextColor={dash.muted}
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          textAlign="right"
        />
        <TextInput
          placeholder="الوصف"
          placeholderTextColor={dash.muted}
          style={[styles.input, { minHeight: 88 }]}
          value={description}
          onChangeText={setDescription}
          multiline
          textAlign="right"
        />
        <TextInput
          placeholder="صور"
          placeholderTextColor={dash.muted}
          style={[styles.input, { minHeight: 76 }]}
          value={images}
          onChangeText={setImages}
          multiline
          textAlign="right"
        />
        <Pressable accessibilityRole="button" onPress={onSubmit} {...pressableRipple(dash.goldTint)} style={styles.primary}>
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
            {...pressableRipple(dash.navyTint)}
            style={styles.secondary}
          >
            <Text style={styles.secondaryText}>إلغاء التعديل</Text>
          </Pressable>
        ) : null}
      </View>
    ),
    [title, description, images, editingId, styles, dash]
  );

  const bottomPad = space.xxl + 6 + insets.bottom;

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <TopBar tone="beige" title="أعمالي المنجزة" />
        <View style={styles.center}>
          <ApiStateView tone={apiTone} mode="loading" title="جاري تحميل معرض الأعمال..." />
        </View>
      </SafeAreaView>
    );
  }

  if (error && items.length === 0) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <TopBar tone="beige" title="أعمالي المنجزة" />
        <View style={styles.center}>
          <ApiStateView
            tone={apiTone}
            mode="error"
            title="تعذر تحميل معرض الأعمال"
            subtitle={error}
            onRetry={() => void onRefresh()}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <TopBar tone="beige" title="أعمالي المنجزة" />
      <FlatList
        style={styles.list}
        data={items}
        keyExtractor={(x) => x.id}
        ListHeaderComponent={header}
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={dash.gold} />}
        contentContainerStyle={[styles.listContent, { paddingBottom: bottomPad }]}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            {item.description ? <Text style={styles.itemDesc}>{item.description}</Text> : null}
            <View style={styles.itemActions}>
              <Pressable
                accessibilityRole="button"
                onPress={() => onEdit(item)}
                {...pressableRipple(dash.navyTint)}
                style={styles.smallBtn}
              >
                <Text style={styles.smallBtnText}>تعديل</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={() => void onDelete(item)}
                {...pressableRipple('rgba(185, 28, 28, 0.1)')}
                style={styles.smallDanger}
              >
                <Text style={styles.smallDangerText}>حذف</Text>
              </Pressable>
            </View>
          </View>
        )}
        ListFooterComponent={
          error ? (
            <View style={styles.footerErr}>
              <ApiStateView
                tone={apiTone}
                mode="error"
                title="حدث خطأ أثناء التحديث"
                subtitle={error}
                onRetry={() => void onRefresh()}
              />
            </View>
          ) : null
        }
        ListEmptyComponent={<ApiStateView tone={apiTone} mode="empty" title="لا عناصر بعد" />}
      />
    </SafeAreaView>
  );
}

function createStyles(dash: DashboardPalette) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: dash.pageBg },
    list: { flex: 1 },
    center: { flex: 1, paddingHorizontal: 16, paddingTop: 24, alignItems: 'stretch', justifyContent: 'center' },
    listContent: { paddingHorizontal: 16, paddingTop: 4 },
    headerBlock: { marginBottom: space.md },
    lead: {
      color: dash.muted,
      fontSize: 13,
      lineHeight: 20,
      textAlign: 'right',
      marginBottom: space.sm + 2,
    },
    input: {
      backgroundColor: dash.white,
      borderColor: dash.border,
      borderWidth: 1,
      borderRadius: DASHBOARD_RADIUS,
      paddingHorizontal: space.md,
      paddingVertical: space.md,
      color: dash.darkText,
      marginBottom: space.sm + 2,
      textAlignVertical: 'top',
      minHeight: touch.minHeight,
    },
    primary: {
      backgroundColor: dash.gold,
      borderRadius: DASHBOARD_RADIUS,
      paddingVertical: space.md,
      minHeight: touch.minHeight,
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: dash.gold,
    },
    primaryText: { color: dash.onGold, textAlign: 'center', fontWeight: '900' },
    secondary: {
      marginTop: space.sm + 2,
      borderRadius: DASHBOARD_RADIUS,
      paddingVertical: space.md,
      borderWidth: 1,
      borderColor: dash.border,
      minHeight: touch.minHeight,
      justifyContent: 'center',
      backgroundColor: dash.white,
    },
    secondaryText: { color: dash.darkText, textAlign: 'center', fontWeight: '800' },
    card: {
      backgroundColor: dash.white,
      borderColor: dash.border,
      borderWidth: 1,
      borderRadius: DASHBOARD_RADIUS,
      padding: space.md,
      marginBottom: space.sm + 2,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
    },
    itemTitle: { color: dash.navy, fontWeight: '900', textAlign: 'right' },
    itemDesc: { color: dash.muted, marginTop: space.sm - 2, lineHeight: 20, textAlign: 'right' },
    itemActions: { flexDirection: 'row-reverse', gap: space.sm + 2, marginTop: space.sm + 2 },
    smallBtn: {
      flex: 1,
      borderRadius: DASHBOARD_RADIUS,
      borderWidth: 1,
      borderColor: dash.border,
      paddingVertical: space.sm + 2,
      minHeight: touch.minHeight - 4,
      justifyContent: 'center',
      backgroundColor: dash.white,
    },
    smallBtnText: { color: dash.darkText, textAlign: 'center', fontWeight: '800' },
    smallDanger: {
      flex: 1,
      borderRadius: DASHBOARD_RADIUS,
      borderWidth: 1,
      borderColor: dash.danger,
      paddingVertical: space.sm + 2,
      backgroundColor: 'rgba(185, 28, 28, 0.08)',
      minHeight: touch.minHeight - 4,
      justifyContent: 'center',
    },
    smallDangerText: { color: dash.danger, textAlign: 'center', fontWeight: '900' },
    footerErr: { marginTop: space.sm },
  });
}
