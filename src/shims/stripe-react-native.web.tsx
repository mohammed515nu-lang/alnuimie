/**
 * بديل ويب لـ @stripe/stripe-react-native (الحزمة أصلية لا تدعم الويب).
 * يُحمّل عبر Metro resolver عند platform === 'web' فقط.
 */
import type { ReactNode } from 'react';

export function StripeProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

type SheetError = { code: string; message: string };

export async function initPaymentSheet(_options?: unknown): Promise<{ error?: SheetError }> {
  return { error: { code: 'Failed', message: 'Stripe متاح في تطبيق الجوال (iOS / Android) فقط.' } };
}

export async function presentPaymentSheet(): Promise<{ error?: SheetError }> {
  return { error: { code: 'Failed', message: 'Stripe متاح في تطبيق الجوال (iOS / Android) فقط.' } };
}
