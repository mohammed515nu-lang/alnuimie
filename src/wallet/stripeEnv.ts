import Constants from 'expo-constants';
import { STRIPE_PUBLISHABLE_KEY } from '../config/env';

export function getStripePublishableKey(): string {
  return STRIPE_PUBLISHABLE_KEY || (Constants.expoConfig?.extra as { stripePublishableKey?: string } | undefined)?.stripePublishableKey || '';
}
