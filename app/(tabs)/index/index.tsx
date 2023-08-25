import { FontAwesome, Ionicons } from "@expo/vector-icons";
import {
  Box,
  Center,
  HStack,
  Image,
  Input,
  InputField,
  InputIcon,
  Text,
  VStack,
  config,
} from "@gluestack-ui/themed";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDebounce } from "use-debounce";
import { Item as ItemType } from "../../../contexts/ItemsContext";
import { useItems } from "../../../hooks/useItems";

export default function Discover() {
  const { items } = useItems();
  const [filter, setFilter] = useState("");
  const [debouncedFilter] = useDebounce(filter, 500);
  const [isScrolling, setIsScrolling] = useState(false);

  const filteredItems = useMemo(() => {
    if (!filter) return items;

    return items.filter(
      (item) =>
        item.key.toLowerCase().includes(debouncedFilter.toLowerCase()) ||
        item.price.toLowerCase().includes(debouncedFilter.toLowerCase()) ||
        item.location.toLowerCase().includes(debouncedFilter.toLowerCase())
    );
  }, [items, debouncedFilter]);

  return (
    <SafeAreaView>
      <Box width="$full" p={"$3"}>
        <Input
          variant="outline"
          size="lg"
          width="$full"
          alignItems="center"
          px={"$3"}
          py={9}
          mb={"$3"}
          rounded="$lg"
          position="sticky"
        >
          <InputIcon>
            <FontAwesome
              name="search"
              size={24}
              color={config.theme.tokens.colors.light400}
            />
          </InputIcon>
          <InputField
            placeholder="Search"
            value={filter}
            onChangeText={setFilter}
          />
        </Input>
        <FlatList
          horizontal={false}
          contentContainerStyle={{
            paddingTop: 8,
            paddingBottom: 100,
          }}
          columnWrapperStyle={{
            justifyContent: "space-between",
            gap: 5,
          }}
          scrollEnabled={true}
          numColumns={2}
          data={filteredItems}
          renderItem={({ item }) => (
            <Item item={item} isScrolling={isScrolling} />
          )}
          onScrollBeginDrag={() => {
            setIsScrolling(true);
          }}
          onScrollEndDrag={() => {
            setIsScrolling(false);
          }}
        />
      </Box>
    </SafeAreaView>
  );
}

function Item({ item, isScrolling }: { item: ItemType; isScrolling: boolean }) {
  const { setItemAsFavorite } = useItems();
  const router = useRouter();

  return (
    <Box
      w={"$full"}
      maxWidth={"50%"}
      onTouchEnd={() => {
        if (!isScrolling) {
          router.push({
            pathname: `/watch/`,
            params: { id: item.key },
          } as any);
        }
      }}
    >
      <VStack
        gap={"$2.5"}
        w={"$full"}
        maxWidth={170}
        justifyContent="center"
        alignItems="center"
        key={item.key}
      >
        <Box position="relative">
          <Image
            source={require("../../../assets/images/rolex.png")}
            rounded={"$lg"}
          />
          <Center
            position="absolute"
            bottom={"$2"}
            right={"$2"}
            bgColor="#f2f2f2"
            rounded={"$md"}
            w={"$8"}
            h={"$8"}
            onTouchEnd={(e) => {
              if (isScrolling) return;

              e.stopPropagation();
              setItemAsFavorite(item, true);
            }}
          >
            <FontAwesome
              name={item.isFavorite ? "heart" : "heart-o"}
              size={20}
              color={
                item.isFavorite
                  ? config.theme.tokens.colors.green600
                  : config.theme.tokens.colors.black
              }
            />
          </Center>
        </Box>
        <VStack gap="$1" w={"$full"} px={"$3"}>
          <Text fontSize={"$md"} bold color="$black">
            Day-Date {item.key}
          </Text>
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
    </Box>
  );
}
