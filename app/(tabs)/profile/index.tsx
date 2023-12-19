import { ShoppingBag, ShoppingCart } from "@nandorojo/heroicons/20/solid";
import { Link, useRouter } from "expo-router";
import { useCart } from "medusa-react";
import { Pressable, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "tailwindcss/colors";
import { medusaClient } from "../../../config/medusa";
import { useCustomer } from "../../../contexts/CustomerContext";

export default function Profile() {
  const { customer } = useCustomer();
  const { cart } = useCart();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await medusaClient.auth.deleteSession();
      router.replace("/(auth)/");
    } catch (error) {
      console.log(error);
    }
  };

  console.log({
    orders: customer?.orders,
  });

  return (
    <SafeAreaView className="px-4 pb-4 flex flex-col min-h-full">
      <Text className="text-2xl font-bold mt-2 mb-6 text-center">
        {customer?.first_name} {customer?.last_name}
      </Text>

      <Link href="/(modal)/user-update" asChild>
        <Pressable className="p-3 active:opacity-50 mt-3 transition-all border-2 border-slate-700 rounded-md">
          <Text className="text-lg text-center">Update Profile</Text>
        </Pressable>
      </Link>

      <Link href="/(cart)/" asChild>
        <Pressable
          className={`p-3 active:opacity-50 mt-3 transition-all border-2 border-slate-700 rounded-md flex flex-row justify-center items-center ${
            !cart?.items.length ? "opacity-50" : ""
          }`}
          disabled={!cart?.items.length}
        >
          <ShoppingBag width={24} height={24} color={colors.black} />
          <Text className="text-lg text-center">
            View Cart ({cart?.items.length})
          </Text>
        </Pressable>
      </Link>

      <Link href="/(orders)/" asChild>
        <Pressable
          className={`p-3 active:opacity-50 mt-3 transition-all border-2 border-slate-700 rounded-md flex flex-row justify-center items-center`}
        >
          <ShoppingCart width={24} height={24} color={colors.black} />
          <Text className="text-lg text-center">Orders</Text>
        </Pressable>
      </Link>

      <Pressable
        className="bg-slate-900 p-3 rounded-md active:bg-slate-800 transition-all mt-auto mb-10"
        onPressOut={handleLogout}
        hitSlop={{
          top: 0,
          left: 50,
          bottom: 0,
          right: 50,
        }}
      >
        <Text className="text-lg text-center text-white">Logout</Text>
      </Pressable>
    </SafeAreaView>
  );
}
