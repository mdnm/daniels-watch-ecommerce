import { Cart, StoreGetProductsParams } from "@medusajs/medusa";
import { ChevronLeft, Heart } from "@nandorojo/heroicons/20/solid";
import { Heart as HeartOutline } from "@nandorojo/heroicons/24/outline";
import { useQuery } from "@tanstack/react-query";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { formatAmount, useCart, useCartShippingOptions } from "medusa-react";
import { useMemo } from "react";
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import colors from "tailwindcss/colors";
import transformProductPreview from "../../../../../util/transformProductPreview";
import { useCustomer } from "../../../../contexts/CustomerContext";
import { useStore } from "../../../../contexts/StoreContext";
import { fetchProductsList, handleUpdateWishlist } from "../../../../data";

export default function WatchDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addItem } = useStore();
  const { customer, wishlist, refetch: refetchCustomer } = useCustomer();
  const { cart } = useCart();
  const queryParams = useMemo(() => {
    const p: StoreGetProductsParams = {};

    if (cart?.id) {
      p.cart_id = cart.id;
    }

    p.id = id;

    p.region_id = cart?.region_id;

    p.is_giftcard = false;

    return {
      ...p,
    };
  }, [cart?.id, cart?.region_id, id]);
  const { data, isLoading } = useQuery({
    queryFn: () =>
      fetchProductsList({
        pageParam: 0,
        queryParams,
      }),
    queryKey: ["product", id],
  });
  const router = useRouter();

  if (isLoading || !data?.response.products.length || !cart?.region) {
    return null;
  }

  const watch = transformProductPreview(
    data?.response.products[0],
    cart?.region,
    wishlist
  );

  const handleWishlist = async () => {
    await handleUpdateWishlist({
      watch,
      customer,
      useHapticFeedback: true,
    });
    refetchCustomer();
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <Stack.Screen
          options={{
            title: "Details",
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
                  onPress={() => router.push("/(tabs)/(discover)/")}
                >
                  <ChevronLeft width={28} height={28} color={colors.black} />
                </Pressable>
              );
            },
            headerRight: () => {
              return (
                <Pressable
                  hitSlop={{
                    top: 5,
                    left: 10,
                    bottom: 5,
                    right: 10,
                  }}
                  className="mr-1"
                  onPress={handleWishlist}
                >
                  {watch.is_wishlisted ? (
                    <Heart width={28} height={28} color={colors.yellow[500]} />
                  ) : (
                    <HeartOutline width={28} height={28} color={colors.black} />
                  )}
                </Pressable>
              );
            },
          }}
        />
        <View className="w-full h-40 relative mb-6 flex flex-row justify-center items-center">
          <Image
            source={{
              uri: watch.thumbnail || "",
            }}
            className="absolute w-full h-40"
            blurRadius={20}
          />
          <Image
            source={{
              uri: watch.thumbnail || "",
            }}
            className="h-full max-w-[160px] w-full"
          />
        </View>
        <View className="flex flex-column w-full px-4 mb-8">
          <View className="flex flex-col mb-6">
            <Text className="text-2xl font-bold">{watch?.title}</Text>
            <Text className="mt-2 text-lg">{watch?.subtitle}</Text>
          </View>
          <View className="flex flex-col mb-6">
            <Text className="text-2xl font-bold">
              {watch?.price?.calculated_price}
            </Text>
            <ShippingCost cart={cart} />
          </View>
          <Text className="text-lg mb-6">
            New{"  "}|{"  "}With original box{"  "}|{"  "}With original
            documents
          </Text>
          <Pressable
            className="rounded-md w-full h-12 flex justify-center items-center bg-yellow-500 active:bg-yellow-600 transition-all"
            hitSlop={{
              top: 0,
              left: 20,
              bottom: 0,
              right: 20,
            }}
            onPress={() => {
              if (!cart?.items.find((i) => i.variant_id === watch.variant_id)) {
                addItem({
                  variantId: watch.variant_id || "",
                  quantity: 1,
                });
              }

              router.push(`/(cart)/`);
            }}
          >
            <Text className="text-lg font-bold">Request this model</Text>
          </Pressable>
        </View>
        <View className="flex flex-col w-full">
          <Text className="px-4 text-2xl mb-4 font-bold">Watch Details</Text>
          <View className="px-4 flex flex-row mb-2 justify-between items-center">
            <Text className="max-w-[50%] text-base font-bold">Brand</Text>
            <Text className="max-w-[50%] text-base text-right">
              {watch.brand}
            </Text>
          </View>
          <View className="mb-6 w-full h-0.5 bg-gray-200" />
          <View className="px-4 flex flex-row mb-2 justify-between items-center">
            <Text className="max-w-[50%] text-base font-bold">Model</Text>
            <Text className="max-w-[50%] text-base text-right">
              {watch.title}
            </Text>
          </View>
          <View className="mb-6 w-full h-0.5 bg-gray-200" />
          <View className="px-4 flex flex-row mb-2 justify-between items-center">
            <Text className="max-w-[50%] text-base font-bold">
              Reference Number
            </Text>
            <Text className="max-w-[50%] text-base text-right">
              {watch.referenceNumber}
            </Text>
          </View>
          <View className="mb-6 w-full h-0.5 bg-gray-200" />
          <View className="px-4 flex flex-row mb-2 justify-between items-center">
            <Text className="max-w-[50%] text-base font-bold">Movement</Text>
            <Text className="max-w-[50%] text-base text-right">
              {watch.movement}
            </Text>
          </View>
          <View className="mb-6 w-full h-0.5 bg-gray-200" />
          <View className="px-4 flex flex-row mb-2 justify-between items-center">
            <Text className="max-w-[50%] text-base font-bold">
              Bracelet material
            </Text>
            <Text className="max-w-[50%] text-base text-right">
              Crocodile skin
            </Text>
          </View>
          <View className="mb-6 w-full h-0.5 bg-gray-200" />
          <View className="px-4 flex flex-row mb-2 justify-between items-center">
            <Text className="max-w-[50%] text-base font-bold">Year</Text>
            <Text className="max-w-[50%] text-base text-right">2019</Text>
          </View>
          <View className="mb-6 w-full h-0.5 bg-gray-200" />
          <View className="px-4 flex flex-row mb-2 justify-between items-center">
            <Text className="max-w-[50%] text-base font-bold">Condition</Text>
            <Text className="max-w-[50%] text-base text-right">
              New (Brand new, without any signs of wear)
            </Text>
          </View>
          <View className="mb-6 w-full h-0.5 bg-gray-200" />
          <View className="px-4 flex flex-row mb-2 justify-between items-center">
            <Text className="max-w-[50%] text-base font-bold">Location</Text>
            <Text className="max-w-[50%] text-base text-right">
              {watch?.origin_country}
            </Text>
          </View>
          <View className="mb-6 w-full h-0.5 bg-gray-200" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const ShippingCost = ({
  cart,
}: {
  cart: Omit<Cart, "refundable_amount" | "refunded_total">;
}) => {
  const { country } = useStore();
  const { shipping_options } = useCartShippingOptions("");

  if (!country || !shipping_options || shipping_options?.length === 0) {
    return null;
  }

  return (
    <Text className="mt-2 text-lg">
      {formatAmount({
        amount: shipping_options[0].amount ?? 0,
        region: cart.region,
        includeTaxes: false,
      })}{" "}
      shipping price to {country.name}
    </Text>
  );
};
