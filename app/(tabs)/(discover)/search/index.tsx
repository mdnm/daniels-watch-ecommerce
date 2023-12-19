import { MagnifyingGlass } from "@nandorojo/heroicons/20/solid";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useCart } from "medusa-react";
import { useCallback, useState } from "react";
import { FlatList, RefreshControl, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "tailwindcss/colors";
import getNumberOfSkeletons from "../../../../../util/getNumberOfSkeletons";
import SkeletonList from "../../../../components/SkeletonList";
import WatchPreview from "../../../../components/WatchPreview";
import { useCustomer } from "../../../../contexts/CustomerContext";
import { useSearch } from "../../../../contexts/SearchContext";
import { fetchProductsSearch } from "../../../../data";
import usePreviews from "../../../../hooks/usePreviews";

export default function Search() {
  const { search, setSearch } = useSearch();
  const [isScrolling, setIsScrolling] = useState(false);
  const { cart } = useCart();

  const {
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading: isLoadingProducts,
    refetch: refetchProducts,
  } = useInfiniteQuery(
    [`infinite-products-search-store`, search, cart],
    ({ pageParam }) => fetchProductsSearch({ pageParam, search }),
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
    }
  );

  const {
    customer,
    isLoading: isLoadingCustomer,
    refetch: refetchCustomer,
    wishlist,
  } = useCustomer();

  const previews = usePreviews({
    pages: data?.pages,
    region: cart?.region,
    wishlist,
  });

  const isLoading = isLoadingProducts || isLoadingCustomer;
  const refetch = useCallback(() => {
    refetchCustomer();
    refetchProducts();
  }, [refetchProducts, refetchCustomer]);

  return (
    <SafeAreaView>
      <View className="w-full p-3">
        <View className="w-full flex flex-row items-center mb-3 sticky rounded-lg border border-gray-300 px-3 py-2">
          <MagnifyingGlass color={colors.gray[400]} />
          <TextInput
            className="flex-1 text-start ml-2"
            placeholder="Search"
            placeholderTextColor={colors.gray[600]}
            enterKeyHint="search"
            onEndEditing={(e) => {
              setSearch(e.nativeEvent.text);
            }}
          />
        </View>
        {!isLoading && (
          <FlatList
            refreshControl={
              <RefreshControl refreshing={isLoading} onRefresh={refetch} />
            }
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
            data={previews}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <WatchPreview
                watch={item}
                isScrolling={isScrolling}
                customer={customer}
                onWishlist={refetch}
              />
            )}
            onScrollBeginDrag={() => {
              setIsScrolling(true);
            }}
            onScrollEndDrag={() => {
              setIsScrolling(false);
            }}
            onEndReached={hasNextPage ? () => fetchNextPage() : undefined}
            onEndReachedThreshold={0.1}
            ListFooterComponent={
              isFetchingNextPage ? (
                <SkeletonList
                  numberOfItems={getNumberOfSkeletons(data?.pages)}
                />
              ) : null
            }
          />
        )}
        {isLoading && !previews.length && <SkeletonList />}
      </View>
    </SafeAreaView>
  );
}
