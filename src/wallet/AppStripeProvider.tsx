import type { ReactElement } from 'react';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Platform } from 'react-native';

type Props = {
  /** Must match StripeProvider child type when native Stripe is used. */
  children: ReactElement | ReactElement[];
  publishableKey: string;
  urlScheme?: string;
  setReturnUrlSchemeOnAndroid?: boolean;
};

/** True when the JS runs in Expo Go — native Stripe module is not in the binary. */
function shouldSkipStripeNativeModule(): boolean {
  if (Platform.OS === 'web') return true;
  return Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
}

/**
 * Wraps the app with Stripe's provider only when a dev/standalone build includes
 * the native Stripe SDK. Avoids top-level `import` from `@stripe/stripe-react-native`
 * so Expo Go does not crash on `TurboModuleRegistry.getEnforcing('StripeSdk')`.
 */
export function AppStripeProvider({
  children,
  publishableKey,
  urlScheme,
  setReturnUrlSchemeOnAndroid,
}: Props) {
  if (!publishableKey || shouldSkipStripeNativeModule()) {
    return <>{children}</>;
  }

  // Lazy require so the native module is only evaluated when supported.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { StripeProvider } = require('@stripe/stripe-react-native') as typeof import('@stripe/stripe-react-native');

  return (
    <StripeProvider
      publishableKey={publishableKey}
      urlScheme={urlScheme}
      setReturnUrlSchemeOnAndroid={setReturnUrlSchemeOnAndroid}
    >
      {children}
    </StripeProvider>
  );
}
