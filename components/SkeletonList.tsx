import { FlatList, StyleProp, ViewStyle } from "react-native";
import repeat from "../util/repeat";
import SkeletonProductPreview from "./SkeletonProductPreview";

export default function SkeletonList({
  numberOfItems = 8,
  numberOfColumns = 2,
  contentContainerStyle = {
    width: "100%",
    paddingBottom: 100,
    paddingHorizontal: 12,
    paddingTop: 12,
    justifyContent: "center",
  },
  columnWrapperStyle = {
    justifyContent: "space-between",
    gap: 5,
  },
  SkeletonPreviewComponent = SkeletonProductPreview,
}: {
  numberOfItems?: number;
  numberOfColumns?: number;
  contentContainerStyle?: StyleProp<ViewStyle>;
  columnWrapperStyle?: StyleProp<ViewStyle>;
  SkeletonPreviewComponent?: React.FC;
}) {
  return (
    <FlatList
      horizontal={false}
      contentContainerStyle={contentContainerStyle}
      columnWrapperStyle={
        numberOfColumns === 1 ? undefined : columnWrapperStyle
      }
      scrollEnabled={true}
      numColumns={numberOfColumns}
      data={repeat(numberOfItems)}
      renderItem={({ item }) => <SkeletonPreviewComponent key={item} />}
    />
  );
}
