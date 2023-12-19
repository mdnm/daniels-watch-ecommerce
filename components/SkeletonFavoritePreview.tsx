import { View } from "react-native";

const SkeletonFavoritePreview = () => {
  return (
    <View className="animate-pulse flex flex-row justify-between w-full px-3 mb-1">
      <View className="flex-1 mr-2">
        <View className="animate-pulse rounded-lg w-full h-44 bg-gray-500" />
      </View>
      <View className="flex flex-col justify-between flex-1 py-2">
        <View className="animate-pulse w-full px-1 h-8 bg-gray-400"></View>
        <View className="animate-pulse w-full px-1 h-8 bg-gray-500"></View>
      </View>
    </View>
  );
};

export default SkeletonFavoritePreview;
