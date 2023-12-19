import { Heart, Home, User } from "@nandorojo/heroicons/20/solid";
import { Tabs } from "expo-router";
import { useEffect } from "react";
import { Text } from "react-native";
import colors from "tailwindcss/colors";
import { useCustomer } from "../../contexts/CustomerContext";

function TabBarLabel({
  color,
  children,
}: {
  color: string;
  children: React.ReactNode;
}) {
  return <Text className="text-xs">{children}</Text>;
}

export default function TabLayout() {
  const { customer, refetch } = useCustomer();

  useEffect(() => {
    if (!customer) {
      refetch();
    }
  }, [customer]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.gray[800],
        headerShown: false,
      }}
      initialRouteName="index"
    >
      <Tabs.Screen
        name="(discover)"
        options={{
          title: "Discover",
          tabBarLabelPosition: "below-icon",
          tabBarLabel: TabBarLabel,
          tabBarIcon: ({ color }) => (
            <Home
              width={28}
              style={{ marginTop: 5 }}
              height={28}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
          tabBarLabelPosition: "below-icon",
          tabBarLabel: TabBarLabel,
          tabBarIcon: ({ color }) => (
            <Heart
              width={28}
              style={{ marginTop: 5 }}
              height={28}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarLabelPosition: "below-icon",
          tabBarLabel: TabBarLabel,
          tabBarIcon: ({ color }) => (
            <User
              width={28}
              style={{ marginTop: 5 }}
              height={28}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
