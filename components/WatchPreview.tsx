import { Customer } from "@medusajs/medusa";
import { Heart, MapPin } from "@nandorojo/heroicons/20/solid";
import { Heart as HeartOutline } from "@nandorojo/heroicons/24/outline";
import clsx from "clsx";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import colors from "tailwindcss/colors";
import { handleUpdateWishlist } from "../data";
import { WatchPreviewType } from "../types/global";

export default function WatchPreview({
  watch,
  customer,
  isScrolling,
  onWishlist,
}: {
  watch: WatchPreviewType;
  customer?: Omit<Customer, "password_hash">;
  isScrolling: boolean;
  onWishlist: () => void;
}) {
  const { push } = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    await handleUpdateWishlist({
      watch,
      customer,
      useHapticFeedback: true,
    });
    onWishlist();
    setIsLoading(false);
  };

  return (
    <Pressable
      className="flex flex-col justify-center items-center w-full max-w-[48%]"
      key={watch.id}
      onPressOut={() => {
        if (!isScrolling) {
          push(`/watches/${watch.id}`);
        }
      }}
      disabled={isLoading}
    >
      <View className="relative mb-3 w-full rounded-lg border border-gray-300">
        <Image
          source={{
            uri: watch.thumbnail || "",
          }}
          className="rounded-md w-full h-48"
          resizeMode="cover"
          resizeMethod="scale"
        />
        <Pressable
          className="absolute bottom-2 right-2 bg-gray-100 rounded-md w-8 h-8 flex justify-center items-center shadow-md"
          hitSlop={{
            top: 20,
            left: 20,
            bottom: 20,
            right: 20,
          }}
          onPressOut={async (e) => {
            if (isScrolling) return;

            e.stopPropagation();
            await handleClick();
          }}
          disabled={isLoading}
        >
          {watch.is_wishlisted ? (
            <Heart height={20} width={20} color={colors.yellow[500]} />
          ) : (
            <HeartOutline height={20} width={20} color={colors.black} />
          )}
        </Pressable>
      </View>
      <View className="flex flex-col w-full px-2 mb-3 flex-1">
        <Text className="font-bold text-base flex-1 mb-1">{watch.title}</Text>
        <Text
          numberOfLines={1}
          className="text-sm max-w-full text-gray-500 flex-1"
        >
          {watch.subtitle}
        </Text>
      </View>
      <View className="flex flex-row justify-between w-full px-2 mb-8">
        <Text className="font-bold text-base">
          {watch.price ? (
            <>
              {watch.price.price_type === "sale" && (
                <Text className="text-gray-500 line-through">
                  {watch.price.original_price}
                </Text>
              )}
              <Text
                className={clsx("font-semibold", {
                  "text-rose-500": watch.price.price_type === "sale",
                })}
              >
                {watch.price.calculated_price}
              </Text>
            </>
          ) : (
            <View className="h-6 w-20 animate-pulse bg-gray-100"></View>
          )}
        </Text>
        <View className="flex flex-row items-center">
          <MapPin width={18} height={18} color={colors.black} />
          <Text className="ml-1 text-base">{watch.origin_country}</Text>
        </View>
      </View>
    </Pressable>
  );
}
