import { ChevronLeft } from "@nandorojo/heroicons/20/solid";
import { Stack, useRouter } from "expo-router";
import { Pressable, Text } from "react-native";
import colors from "tailwindcss/colors";

const Layout = () => {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerTitle: (e) => <Text className="text-lg font-semibold">Cart</Text>,
        headerLeft: (e) => {
          return (
            <Pressable
              hitSlop={{
                top: 5,
                left: 10,
                bottom: 5,
                right: 10,
              }}
              className="ml-1"
              onPress={() => router.back()}
            >
              <ChevronLeft width={28} height={28} color={colors.black} />
            </Pressable>
          );
        },
      }}
    />
  );
};
export default Layout;
