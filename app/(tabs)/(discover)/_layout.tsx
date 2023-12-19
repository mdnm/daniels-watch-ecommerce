import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="watches" />
      <Stack.Screen name="search" />
    </Stack>
  );
};

export default Layout;
