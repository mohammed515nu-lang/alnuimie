import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

import { useStore } from '../src/store/useStore';

export default function Index() {
  const user = useStore((s) => s.user);
  const hydrated = useStore.persist.hasHydrated();

  if (!hydrated) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="small" />
      </View>
    );
  }
  if (user) {
    return <Redirect href="/(main)/(tabs)" />;
  }
  return <Redirect href="/login" />;
}
