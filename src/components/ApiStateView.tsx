import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useAppTheme, pressableRipple, radius, space, touch } from '../theme';

/** لوحة فاتحة — مطابقة الرئيسية / المشاريع (بيج) */
const BEIGE = {
  card: '#FFFFFF',
  border: '#E0D6C8',
  title: '#2a2520',
  subtitle: '#5c5348',
  iconMuted: '#7a6e62',
  danger: '#b91c1c',
  gold: '#a67c52',
  goldTint: 'rgba(166, 124, 82, 0.16)',
  navy: '#1a2b44',
} as const;

type Props = {
  mode: 'loading' | 'empty' | 'error';
  title: string;
  subtitle?: string;
  retryLabel?: string;
  onRetry?: () => void;
  /** default = ثيم التطبيق الداكن؛ beige = بطاقة بيضاء ونص داكن على خلفية بيج */
  tone?: 'default' | 'beige';
};

export function ApiStateView({
  mode,
  title,
  subtitle,
  retryLabel = 'إعادة المحاولة',
  onRetry,
  tone = 'default',
}: Props) {
  const { colors } = useAppTheme();
  const isLoading = mode === 'loading';
  const isError = mode === 'error';

  if (tone === 'beige') {
    return (
      <View style={[styles.wrap, { backgroundColor: BEIGE.card, borderColor: BEIGE.border }]}>
        {isLoading ? (
          <ActivityIndicator color={BEIGE.gold} />
        ) : (
          <Ionicons
            name={isError ? 'alert-circle-outline' : 'file-tray-outline'}
            size={42}
            color={isError ? BEIGE.danger : BEIGE.iconMuted}
          />
        )}
        <Text style={[styles.title, { color: BEIGE.title }]}>{title}</Text>
        {subtitle ? <Text style={[styles.subtitle, { color: BEIGE.subtitle }]}>{subtitle}</Text> : null}
        {!isLoading && onRetry ? (
          <Pressable
            accessibilityRole="button"
            onPress={onRetry}
            {...pressableRipple(BEIGE.goldTint)}
            style={[styles.retry, { borderColor: BEIGE.gold, backgroundColor: BEIGE.card }]}
          >
            <Text style={[styles.retryText, { color: BEIGE.navy }]}>{retryLabel}</Text>
          </Pressable>
        ) : null}
      </View>
    );
  }

  return (
    <View style={[styles.wrap, { backgroundColor: colors.surfaceMid, borderColor: colors.borderMuted }]}>
      {isLoading ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        <Ionicons
          name={isError ? 'alert-circle-outline' : 'file-tray-outline'}
          size={42}
          color={isError ? colors.danger : colors.textMuted}
        />
      )}
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {subtitle ? <Text style={[styles.subtitle, { color: colors.textMuted }]}>{subtitle}</Text> : null}
      {!isLoading && onRetry ? (
        <Pressable
          accessibilityRole="button"
          onPress={onRetry}
          {...pressableRipple(colors.primaryTint12)}
          style={[styles.retry, { borderColor: colors.borderMuted }]}
        >
          <Text style={[styles.retryText, { color: colors.text }]}>{retryLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: space.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: space.lg,
    minHeight: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginTop: space.sm,
    fontWeight: '900',
    fontSize: 16,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: space.xs,
    textAlign: 'center',
    lineHeight: 20,
  },
  retry: {
    marginTop: space.md,
    borderWidth: 1,
    borderRadius: radius.md,
    minHeight: touch.minHeight - 4,
    paddingHorizontal: space.lg,
    justifyContent: 'center',
  },
  retryText: { fontWeight: '800' },
});
