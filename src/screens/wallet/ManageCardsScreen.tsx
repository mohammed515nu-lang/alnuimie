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
import { useFocusEffect } from '@react-navigation/native';

import { useStore } from '../../store/useStore';
import { getApiErrorMessage } from '../../api/http';
import type { PaymentCard } from '../../api/types';
import { useAppTheme, pressableRipple, radius, space, touch } from '../../theme';
import type { AppPalette } from '../../theme/palettes';

export function ManageCardsScreen() {
  const refreshPaymentCards = useStore((s) => s.refreshPaymentCards);
  const setDefaultPaymentCard = useStore((s) => s.setDefaultPaymentCard);
  const removePaymentCard = useStore((s) => s.removePaymentCard);
  const cards = useStore((s) => s.paymentCards);
  const { colors } = useAppTheme();
  const styles = useMemo(() => createManageCardsStyles(colors), [colors]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    await refreshPaymentCards();
  }, [refreshPaymentCards]);

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
      <View style={{ flexDirection: 'row', gap: space.sm + 2, marginTop: space.sm + 2 }}>
        <Pressable
          accessibilityRole="button"
          onPress={async () => {
            try {
              await setDefaultPaymentCard(item.id);
            } catch (e) {
              Alert.alert('تعذر التعيين', getApiErrorMessage(e));
            }
          }}
          {...pressableRipple(colors.primaryTint12)}
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
          {...pressableRipple('rgba(248,113,113,0.25)')}
          style={styles.danger}
        >
          <Text style={styles.dangerText}>حذف</Text>
        </Pressable>
      </View>
    </View>
    ),
    [colors, styles, removePaymentCard, setDefaultPaymentCard]
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
      data={cards}
      keyExtractor={(x) => x.id}
      renderItem={renderItem}
      keyboardShouldPersistTaps="handled"
      contentInsetAdjustmentBehavior="automatic"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      contentContainerStyle={styles.listContent}
      ListEmptyComponent={<Text style={styles.empty}>لا بطاقات</Text>}
    />
  );
}

function createManageCardsStyles(colors: AppPalette) {
  return StyleSheet.create({
  center: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
  listContent: { padding: space.lg, paddingBottom: space.xxl + 6, backgroundColor: colors.background },
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.xl,
    padding: space.md,
    marginBottom: space.sm + 2,
  },
  title: { color: colors.text, fontWeight: '900', fontSize: 16 },
  meta: { color: colors.textMuted, marginTop: space.sm - 2, fontWeight: '700' },
  secondary: {
    flex: 1,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    paddingVertical: space.sm + 2,
    minHeight: touch.minHeight - 4,
    justifyContent: 'center',
  },
  secondaryText: { color: colors.textSecondary, textAlign: 'center', fontWeight: '800' },
  danger: {
    flex: 1,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.dangerBorder,
    paddingVertical: space.sm + 2,
    backgroundColor: colors.dangerBg,
    minHeight: touch.minHeight - 4,
    justifyContent: 'center',
  },
  dangerText: { color: colors.dangerText, textAlign: 'center', fontWeight: '900' },
  empty: { color: colors.placeholder, textAlign: 'center', marginTop: space.lg + 2 },
});
}
