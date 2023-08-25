import { FontAwesome, Ionicons } from "@expo/vector-icons";
import {
  Box,
  HStack,
  Heading,
  Image,
  Text,
  VStack,
  config,
} from "@gluestack-ui/themed";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, FlatList, GestureResponderEvent } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Item as ItemType } from "../../../contexts/ItemsContext";
import { useItems } from "../../../hooks/useItems";

export default function Favorites() {
  const { items } = useItems();
  const [isScrolling, setIsScrolling] = useState(false);

  const favoriteItems = items.filter((item) => item.isFavorite);

  return (
    <SafeAreaView>
      {favoriteItems.length === 0 && (
        <VStack p={"$3"} gap={"$4"} justifyContent="center" alignItems="center">
          <Heading textAlign="center">
            You don't have any favorite watches yet.
          </Heading>
          <Text textAlign="center">
            Tap the heart icon on a watch to add it to your favorites.
          </Text>
        </VStack>
      )}
      <FlatList
        horizontal={false}
        contentContainerStyle={{
          width: "100%",
          paddingBottom: 100,
          paddingHorizontal: 12,
          paddingTop: 12,
          justifyContent: "center",
          gap: 48,
        }}
        scrollEnabled={true}
        numColumns={1}
        data={favoriteItems}
        renderItem={({ item }) => (
          <FavoriteItem item={item} isScrolling={isScrolling} />
        )}
        onScrollBeginDrag={() => {
          setIsScrolling(true);
        }}
        onScrollEndDrag={() => {
          setIsScrolling(false);
        }}
      />
    </SafeAreaView>
  );
}

function FavoriteItem({
  item,
  isScrolling,
}: {
  item: ItemType;
  isScrolling: boolean;
}) {
  const { setItemAsFavorite } = useItems();
  const router = useRouter();

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
        onPress: () => {
          setItemAsFavorite(item);
        },
        style: "default",
      },
    ]);
  };

  return (
    <HStack
      gap={"$1.5"}
      w={"$full"}
      key={item.key}
      onTouchEnd={() => {
        if (!isScrolling) {
          router.push({
            pathname: `/watch/`,
            params: { id: item.key },
          } as any);
        }
      }}
    >
      <Box maxWidth={"50%"}>
        <Image
          source={require("../../../assets/images/rolex.png")}
          rounded={"$lg"}
        />
      </Box>
      <VStack justifyContent="space-between" maxWidth={"50%"}>
        <VStack gap="$1" w={"$full"} px={"$3"}>
          <HStack justifyContent="space-between" alignItems="center">
            <Text
              fontSize={"$md"}
              bold
              color="$black"
              isTruncated
              maxWidth={"85%"}
            >
              Day-Date {item.key}
            </Text>
            <FontAwesome
              name={"heart"}
              size={20}
              color={config.theme.tokens.colors.green600}
              onTouchEnd={showConfirmUnfavoriteAlert}
            />
          </HStack>
          <Text fontSize={"$sm"} color="$gray" isTruncated maxWidth={"$full"}>
            Oyster, 36mm, yellow gold
          </Text>
        </VStack>
        <HStack justifyContent="space-between" w={"$full"} px={"$3"} mb={"$8"}>
          <Text fontSize={"$md"} bold color="$black">
            {item.price}
          </Text>
          <HStack gap={"$0.5"} alignItems="center">
            <Ionicons
              name="location-sharp"
              size={18}
              color={config.theme.tokens.colors.black}
            />
            <Text fontSize={"$md"} color="$black">
              {item.location}
            </Text>
          </HStack>
        </HStack>
      </VStack>
    </HStack>
  );
}
