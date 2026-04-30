import 'react-native-gesture-handler';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, type ReactNode } from 'react';

WebBrowser.maybeCompleteAuthSession();
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SecureStore from 'expo-secure-store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { setAuthToken } from '../src/api/http';
import { authAPI } from '../src/api/services/auth';
import { getStripeUrlScheme } from '../src/config/stripeDeepLink';
import { AppStripeProvider } from '../src/wallet/AppStripeProvider';
import { getStripePublishableKey } from '../src/wallet/stripeEnv';
import { NotificationBootstrap } from '../src/notifications/NotificationBootstrap';
import { useStore } from '../src/store/useStore';
import { ThemeProvider, useAppTheme } from '../src/theme';

function ThemedStatusBar() {
  const { resolved } = useAppTheme();
  return <StatusBar style={resolved === 'light' ? 'dark' : 'light'} />;
}

function SessionAndAuthShell({ children }: { children: ReactNode }) {
  const user = useStore((s) => s.user);
  const router = useRouter();
  const segments = useSegments();
  const hydrated = useStore.persist.hasHydrated();

  useEffect(() => {
    let cancelled = false;

    const restoreSession = async () => {
      const hydrate = useStore.getState().setUser;
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
  }, []);

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

  useEffect(() => {
    if (!user) return;
    const ping = () => void useStore.getState().pingPresence();
    ping();
    const id = setInterval(ping, 45_000);
    return () => clearInterval(id);
  }, [user?._id]);

  return <>{children}</>;
}

const pk = getStripePublishableKey();
const stripeScheme = getStripeUrlScheme();

function RootWithProviders() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AppStripeProvider
            publishableKey={pk}
            urlScheme={stripeScheme}
            setReturnUrlSchemeOnAndroid
          >
            <SessionAndAuthShell>
              <NotificationBootstrap />
              <Stack screenOptions={{ headerShown: false }} />
              <ThemedStatusBar />
            </SessionAndAuthShell>
          </AppStripeProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  return <RootWithProviders />;
}
