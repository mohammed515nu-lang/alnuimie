import { Stack } from 'expo-router';

const MAIN_BEIGE = '#F4EFE6';

export default function AdminStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: MAIN_BEIGE },
      }}
    />
  );
}
