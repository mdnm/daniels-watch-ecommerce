import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="user-update"
        options={{ headerTitle: "Update profile", presentation: "modal" }}
      />
    </Stack>
  );
};

export default Layout;
