import { Stack } from "expo-router";

export default function SettingsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="page" />
      <Stack.Screen name="driver-license/page" />
      <Stack.Screen name="location/page" />
    </Stack>
  );
}
