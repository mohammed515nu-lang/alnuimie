import { Stack } from 'expo-router';

const MAIN_BEIGE = '#F4EFE6';

export default function MainGroupLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: MAIN_BEIGE },
      }}
    >
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
