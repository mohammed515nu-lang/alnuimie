import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { WalletCard } from '../../components/wallet/WalletCard';
import { useStore } from '../../store/useStore';
import type { RootStackParamList } from '../../navigation/types';
import { colors, pressableRipple, radius, space, touch } from '../../theme';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function WalletHomeScreen() {
  const navigation = useNavigation<Nav>();
  const user = useStore((s) => s.user);

  return (
    <ScrollView contentContainerStyle={styles.root} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>المحفظة</Text>
      <WalletCard />

      <View style={styles.card}>
        <Text style={styles.cardTitle}>إجراءات</Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.navigate('ManageCards')}
          {...pressableRipple(colors.primaryTint18)}
          style={styles.primary}
        >
          <Text style={styles.primaryText}>إدارة البطاقات</Text>
        </Pressable>
        {user?.role === 'client' ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => navigation.navigate('PayContractor')}
            {...pressableRipple(colors.primaryTint12)}
            style={styles.secondary}
          >
            <Text style={styles.secondaryText}>دفع لمقاول متصل</Text>
          </Pressable>
        ) : null}
        {user?.role === 'contractor' ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => navigation.navigate('ContractorPaySupplier')}
            {...pressableRipple(colors.primaryTint12)}
            style={styles.secondary}
          >
            <Text style={styles.secondaryText}>دفع للمورد</Text>
          </Pressable>
        ) : null}
        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.navigate('Transfers')}
          {...pressableRipple(colors.primaryTint12)}
          style={styles.secondary}
        >
          <Text style={styles.secondaryText}>قائمة التحويلات</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { padding: space.lg, paddingBottom: space.xxl + 4, backgroundColor: colors.background },
  title: { color: colors.text, fontSize: 20, fontWeight: '900', marginBottom: space.md },
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.xl,
    padding: space.md - 2,
    marginBottom: space.md,
  },
  cardTitle: { color: colors.text, fontWeight: '900', marginBottom: space.sm + 2 },
  primary: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: space.md,
    marginTop: space.sm,
    minHeight: touch.minHeight,
    justifyContent: 'center',
  },
  primaryText: { color: colors.onPrimary, textAlign: 'center', fontWeight: '900' },
  secondary: {
    borderRadius: radius.md,
    paddingVertical: space.md,
    marginTop: space.sm + 2,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    minHeight: touch.minHeight,
    justifyContent: 'center',
  },
  secondaryText: { color: colors.textSecondary, textAlign: 'center', fontWeight: '800' },
});
