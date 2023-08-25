import { FontAwesome } from "@expo/vector-icons";
import { Text, config } from "@gluestack-ui/themed";
import { Tabs } from "expo-router";

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return (
    <FontAwesome
      size={22}
      style={{ margin: 0, padding: 0, marginBottom: -5 }}
      {...props}
    />
  );
}

function TabBarLabel({
  color,
  children,
}: {
  color: string;
  children: React.ReactNode;
}) {
  return (
    <Text color={color} fontSize={12}>
      {children}
    </Text>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: config.theme.tokens.colors.light800,
        tabBarStyle: {
          height: 50,
          justifyContent: "center",
        },
        headerShown: false,
      }}
      initialRouteName="index"
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Discover",
          tabBarLabelPosition: "below-icon",
          tabBarLabel: TabBarLabel,
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
          tabBarLabelPosition: "below-icon",
          tabBarLabel: TabBarLabel,
          tabBarIcon: ({ color }) => <TabBarIcon name="heart" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarLabelPosition: "below-icon",
          tabBarLabel: TabBarLabel,
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}
