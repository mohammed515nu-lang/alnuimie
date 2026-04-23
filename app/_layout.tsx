import 'react-native-gesture-handler';
import { useEffect, type ReactNode } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StripeProvider } from '@stripe/stripe-react-native';
import * as SecureStore from 'expo-secure-store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { setAuthToken } from '../src/api/http';
import { authAPI } from '../src/api/services/auth';
import { getStripeUrlScheme } from '../src/config/stripeDeepLink';
import { getStripePublishableKey } from '../src/wallet/stripeEnv';
import { useStore } from '../src/store/useStore';
import { ThemeProvider, useAppTheme } from '../src/theme';

function ThemedStatusBar() {
  const { resolved } = useAppTheme();
  return <StatusBar style={resolved === 'light' ? 'dark' : 'light'} />;
}

function SessionAndAuthShell({ children }: { children: ReactNode }) {
  const hydrate = useStore((s) => s.setUser);
  const user = useStore((s) => s.user);
  const router = useRouter();
  const segments = useSegments();
  const hydrated = useStore.persist.hasHydrated();

  useEffect(() => {
    let cancelled = false;

    const restoreSession = async () => {
      const token = await SecureStore.getItemAsync('auth_token');
      if (!token) {
        if (useStore.getState().user) hydrate(null);
        return;
      }
      try {
        const u = await authAPI.me();
        if (!cancelled) hydrate(u);
      } catch {
        if (!cancelled) {
          await setAuthToken(null);
          hydrate(null);
        }
      }
    };

    const unsub = useStore.persist.onFinishHydration(() => {
      void restoreSession();
    });
    if (useStore.persist.hasHydrated()) void restoreSession();

    return () => {
      cancelled = true;
      unsub();
    };
  }, [hydrate]);

  useEffect(() => {
    if (!hydrated) return;
    const inAuth = segments[0] === '(auth)';
    const inMain = segments[0] === '(main)';
    if (!user && inMain) {
      router.replace('/login');
    } else if (user && inAuth) {
      router.replace('/(main)/(tabs)');
    }
  }, [user, segments, router, hydrated]);

  return <>{children}</>;
}

const pk = getStripePublishableKey();
const stripeScheme = getStripeUrlScheme();

function RootWithProviders() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <StripeProvider
            publishableKey={pk || 'pk_test_placeholder'}
            urlScheme={stripeScheme}
            setReturnUrlSchemeOnAndroid
          >
            <SessionAndAuthShell>
              <Stack screenOptions={{ headerShown: false }} />
              <ThemedStatusBar />
            </SessionAndAuthShell>
          </StripeProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  return <RootWithProviders />;
}
