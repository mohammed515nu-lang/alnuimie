import Constants from 'expo-constants';

/** Must match `scheme` in [app.config.ts](app.config.ts) and Stripe dashboard if required. */
const FALLBACK_SCHEME = 'bunyan-construction';

export function getStripeUrlScheme(): string {
  const raw = Constants.expoConfig?.scheme;
  const scheme = Array.isArray(raw) ? raw[0] : raw;
  return typeof scheme === 'string' && scheme.length > 0 ? scheme : FALLBACK_SCHEME;
}

/** Used by PaymentSheet for redirect after authentication (e.g. 3DS). */
export function getStripePaymentReturnURL(): string {
  return `${getStripeUrlScheme()}://stripe-redirect`;
}
