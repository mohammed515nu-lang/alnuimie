import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { useStore } from '../../store/useStore';
import { getApiErrorMessage } from '../../api/http';
import type { PaymentCard } from '../../api/types';
import { TopBar } from '../../components/TopBar';
import { pushStackRoute } from '../../navigation/href';
import { pressableRipple, space, touch, useAppTheme } from '../../theme';
import { DASHBOARD_RADIUS, getDashboardPalette, type DashboardPalette } from '../../theme/dashboardLight';

export function ManageCardsScreen() {
  const setDefaultPaymentCard = useStore((s) => s.setDefaultPaymentCard);
  const removePaymentCard = useStore((s) => s.removePaymentCard);
  const cards = useStore((s) => s.paymentCards);
  const insets = useSafeAreaInsets();
  const { resolved } = useAppTheme();
  const dash = useMemo(() => getDashboardPalette(resolved), [resolved]);
  const styles = useMemo(() => createStyles(dash), [dash]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    await useStore.getState().refreshPaymentCards();
  }, []);

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

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

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

  const renderItem = useCallback(
    ({ item }: { item: PaymentCard }) => (
      <View style={styles.card}>
        <Text style={styles.title}>
          {item.brand.toUpperCase()} •••• {item.last4} {item.isDefault ? '(افتراضية)' : ''}
        </Text>
        <Text style={styles.meta}>
          {String(item.expMonth).padStart(2, '0')}/{item.expYear}
        </Text>
        <View style={styles.btnRow}>
          <Pressable
            accessibilityRole="button"
            onPress={async () => {
              try {
                await setDefaultPaymentCard(item.id);
              } catch (e) {
                Alert.alert('تعذر التعيين', getApiErrorMessage(e));
              }
            }}
            {...pressableRipple(dash.goldTint)}
            style={styles.secondary}
          >
            <Text style={styles.secondaryText}>تعيين افتراضي</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={async () => {
              Alert.alert('حذف', 'حذف البطاقة؟', [
                { text: 'إلغاء', style: 'cancel' },
                {
                  text: 'حذف',
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      await removePaymentCard(item.id);
                    } catch (e) {
                      Alert.alert('تعذر الحذف', getApiErrorMessage(e));
                    }
                  },
                },
              ]);
            }}
            {...pressableRipple('rgba(185, 28, 28, 0.12)')}
            style={styles.danger}
          >
            <Text style={styles.dangerText}>حذف</Text>
          </Pressable>
        </View>
      </View>
    ),
    [styles, removePaymentCard, setDefaultPaymentCard]
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <TopBar tone="beige" title="إدارة البطاقات" />
        <View style={styles.center}>
          <ActivityIndicator color={dash.gold} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <TopBar
        tone="beige"
        title="إدارة البطاقات"
        leftAction={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="إضافة بطاقة"
            onPress={() => pushStackRoute('AddCard')}
            hitSlop={12}
            style={styles.headerAddWrap}
          >
            <Ionicons name="add" size={26} color={dash.navy} />
          </Pressable>
        }
      />
      <FlatList
        data={cards}
        keyExtractor={(x) => x.id}
        renderItem={renderItem}
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={dash.gold} />}
        contentContainerStyle={[styles.listContent, { paddingBottom: 24 + insets.bottom }]}
        ListEmptyComponent={<Text style={styles.empty}>لا بطاقات محفوظة بعد.</Text>}
      />
    </SafeAreaView>
  );
}

function createStyles(dash: DashboardPalette) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: dash.pageBg },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    headerAddWrap: {
      width: 40,
      height: 40,
      borderRadius: DASHBOARD_RADIUS,
      backgroundColor: dash.white,
      borderWidth: 1,
      borderColor: dash.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    listContent: { paddingHorizontal: 16, paddingTop: 4, flexGrow: 1 },
    card: {
      backgroundColor: dash.white,
      borderColor: dash.border,
      borderWidth: 1,
      borderRadius: DASHBOARD_RADIUS,
      padding: space.md,
      marginBottom: 10,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
    },
    title: { color: dash.darkText, fontWeight: '900', fontSize: 16, textAlign: 'right' },
    meta: { color: dash.muted, marginTop: 6, fontWeight: '700', textAlign: 'right' },
    btnRow: { flexDirection: 'row-reverse', gap: 10, marginTop: 12 },
    secondary: {
      flex: 1,
      borderRadius: 14,
      borderWidth: 1.5,
      borderColor: dash.gold,
      backgroundColor: dash.white,
      paddingVertical: space.sm + 2,
      minHeight: touch.minHeight - 4,
      justifyContent: 'center',
    },
    secondaryText: { color: dash.navy, textAlign: 'center', fontWeight: '800' },
    danger: {
      flex: 1,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: dash.danger,
      paddingVertical: space.sm + 2,
      backgroundColor: 'rgba(185, 28, 28, 0.06)',
      minHeight: touch.minHeight - 4,
      justifyContent: 'center',
    },
    dangerText: { color: dash.danger, textAlign: 'center', fontWeight: '900' },
    empty: { color: dash.muted, textAlign: 'center', marginTop: 32, paddingHorizontal: 24, lineHeight: 22 },
  });
}
