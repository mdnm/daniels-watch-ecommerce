import { StoreGetProductsParams } from "@medusajs/medusa";
import { Heart, MapPin } from "@nandorojo/heroicons/20/solid";
import { useInfiniteQuery } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useCart } from "medusa-react";
import { useCallback, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  GestureResponderEvent,
  Image,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "tailwindcss/colors";
import { WatchPreviewType } from "../../../../types/global";
import getNumberOfSkeletons from "../../../../util/getNumberOfSkeletons";
import SkeletonFavoritePreview from "../../../components/SkeletonFavoritePreview";
import SkeletonList from "../../../components/SkeletonList";
import { useCustomer } from "../../../contexts/CustomerContext";
import { fetchProductsList, handleUpdateWishlist } from "../../../data";
import usePreviews from "../../../hooks/usePreviews";

export default function Favorites() {
  const [isScrolling, setIsScrolling] = useState(false);
  const router = useRouter();
  const { cart } = useCart();
  const {
    isLoading: isLoadingCustomer,
    refetch: refetchCustomer,
    wishlist,
  } = useCustomer();

  const queryParams = useMemo(() => {
    const p: StoreGetProductsParams = {};

    if (cart?.id) {
      p.cart_id = cart.id;
    }

    if (wishlist?.length) {
      p.id = wishlist.map((w) => w.variant.product_id);
    }

    p.region_id = cart?.region_id;

    p.is_giftcard = false;

    return {
      ...p,
    };
  }, [cart?.id, cart?.region_id, wishlist]);

  const hasWishlist = !!wishlist?.length;

  const {
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading: isLoadingProducts,
    refetch: refetchProducts,
  } = useInfiniteQuery(
    [`infinite-favorite-products-store`, queryParams, cart],
    ({ pageParam }) => fetchProductsList({ pageParam, queryParams }),
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
      enabled: hasWishlist,
    }
  );

  const previews = usePreviews({
    pages: hasWishlist ? data?.pages : [],
    region: cart?.region,
    wishlist,
  });

  const isLoading = hasWishlist && (isLoadingProducts || isLoadingCustomer);
  const refetch = useCallback(() => {
    refetchCustomer();
    refetchProducts();
  }, [refetchProducts, refetchCustomer]);

  return (
    <SafeAreaView>
      <Text className="text-2xl font-bold mt-2 mb-6 text-center">
        Favorites
      </Text>
      {!isLoading && (
        <FlatList
          ListEmptyComponent={
            <View className="flex flex-col p-10">
              <Text className="text-2xl font-bold mb-4 text-center">
                You don't have any favorite watches yet.
              </Text>
              <Text className="text-lg text-center mb-4">
                Tap the heart icon on a watch to add it to your favorites.
              </Text>
              <Pressable
                className="bg-blue-500 p-3 rounded-md active:bg-blue-600 transition-all"
                onPressOut={() => {
                  router.push("/(tabs)/(discover)/");
                }}
                hitSlop={{
                  top: 0,
                  left: 50,
                  bottom: 0,
                  right: 50,
                }}
              >
                <Text className="text-lg text-center text-white">
                  Browse watches
                </Text>
              </Pressable>
            </View>
          }
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={refetch} />
          }
          horizontal={false}
          contentContainerStyle={{
            width: "100%",
            paddingBottom: 100,
            paddingHorizontal: 12,
            paddingTop: 12,
            justifyContent: "center",
          }}
          scrollEnabled={true}
          numColumns={1}
          data={previews}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <FavoriteItem
              watch={item}
              isScrolling={isScrolling}
              onWishlist={refetch}
            />
          )}
          onScrollBeginDrag={() => {
            setIsScrolling(true);
          }}
          onScrollEndDrag={() => {
            setIsScrolling(false);
          }}
          onEndReached={
            hasWishlist && hasNextPage ? () => fetchNextPage() : undefined
          }
          onEndReachedThreshold={0.1}
          ListFooterComponent={
            isFetchingNextPage ? (
              <SkeletonList
                contentContainerStyle={{
                  width: "100%",
                  paddingBottom: 100,
                  paddingHorizontal: 12,
                  paddingTop: 12,
                  justifyContent: "center",
                }}
                numberOfColumns={1}
                SkeletonPreviewComponent={SkeletonFavoritePreview}
                numberOfItems={getNumberOfSkeletons(data?.pages)}
              />
            ) : null
          }
        />
      )}
      {isLoading && !previews?.length && (
        <SkeletonList
          contentContainerStyle={{
            width: "100%",
            paddingBottom: 100,
            paddingHorizontal: 12,
            paddingTop: 12,
            justifyContent: "center",
          }}
          numberOfColumns={1}
          SkeletonPreviewComponent={SkeletonFavoritePreview}
          numberOfItems={Math.max(wishlist?.length, 8)}
        />
      )}
    </SafeAreaView>
  );
}

function FavoriteItem({
  watch,
  isScrolling,
  onWishlist,
}: {
  watch: WatchPreviewType;
  isScrolling: boolean;
  onWishlist: () => void;
}) {
  const router = useRouter();
  const { customer } = useCustomer();
  const [isLoading, setIsLoading] = useState(false);

  const showConfirmUnfavoriteAlert = (e: GestureResponderEvent) => {
    if (isScrolling) return;

    e.stopPropagation();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    Alert.alert("Are you sure you want to unfavorite this watch?", undefined, [
      {
        text: "Cancel",
        style: "cancel",
        isPreferred: true,
      },
      {
        text: "OK",
        onPress: async () => {
          setIsLoading(true);
          await handleUpdateWishlist({
            watch,
            customer,
          });
          onWishlist();
          setIsLoading(false);
        },
        style: "default",
      },
    ]);
  };

  return (
    <SafeAreaView>
      <Pressable
        className="flex flex-row justify-between w-full px-3 mb-1"
        key={watch.id}
        onPress={() => {
          if (!isScrolling) {
            router.push(`/watches/${watch.id}`);
          }
        }}
        disabled={isLoading}
      >
        <View className="flex-1 mr-2">
          <Image
            source={{
              uri: watch.thumbnail || "",
            }}
            className="rounded-lg w-full h-44"
            resizeMode="cover"
            resizeMethod="scale"
          />
        </View>
        <View className="flex flex-col justify-between flex-1 py-2">
          <View className="flex flex-column w-full px-1">
            <View className="flex flex-row justify-between items-center w-full mb-1">
              <Text
                className="text-base max-w-[85%] font-bold"
                numberOfLines={1}
              >
                {watch.title}
              </Text>
              <Pressable
                hitSlop={{
                  top: 20,
                  left: 20,
                  bottom: 20,
                  right: 40,
                }}
                onPress={showConfirmUnfavoriteAlert}
                disabled={isLoading}
              >
                <Heart width={20} height={20} color={colors.yellow[500]} />
              </Pressable>
            </View>
            <Text
              className="text-sm max-w-full text-gray-500"
              numberOfLines={1}
            >
              {watch.subtitle}
            </Text>
          </View>
          <View className="flex flex-row justify-between items-center w-full px-1">
            <Text className="text-base font-bold">
              {watch.price?.calculated_price}
            </Text>
            <View className="flex flex-row items-center">
              <MapPin width={18} height={18} color={colors.black} />
              <Text className="text-base ml-1">{watch.origin_country}</Text>
            </View>
          </View>
        </View>
      </Pressable>
    </SafeAreaView>
  );
}
