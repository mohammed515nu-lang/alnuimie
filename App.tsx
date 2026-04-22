import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StripeProvider } from '@stripe/stripe-react-native';
import * as SecureStore from 'expo-secure-store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AppNavigator } from './src/navigation/AppNavigator';
import { setAuthToken } from './src/api/http';
import { authAPI } from './src/api/services/auth';
import { useStore } from './src/store/useStore';
import { getStripePublishableKey } from './src/wallet/stripeEnv';

export default function App() {
  const hydrate = useStore((s) => s.setUser);

  useEffect(() => {
    (async () => {
      const token = await SecureStore.getItemAsync('auth_token');
      if (!token) return;
      try {
        const user = await authAPI.me();
        hydrate(user);
        useStore.setState({ isAuthenticated: true });
      } catch {
        await setAuthToken(null);
        hydrate(null);
        useStore.setState({ isAuthenticated: false });
      }
    })();
  }, [hydrate]);

  const pk = getStripePublishableKey();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StripeProvider publishableKey={pk || 'pk_test_placeholder'}>
        <AppNavigator />
        <StatusBar style="light" />
      </StripeProvider>
    </GestureHandlerRootView>
  );
}
