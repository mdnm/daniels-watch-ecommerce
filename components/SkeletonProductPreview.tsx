import { View } from "react-native";

const SkeletonProductPreview = () => {
  return (
    <View className="animate-pulse flex flex-col justify-center items-center w-full max-w-[48%]">
      <View className="relative mb-3 w-full rounded-lg">
        <View className="animate-pulse rounded-md w-full h-48 bg-gray-500" />
      </View>
      <View className="animate-pulse w-full px-2 mb-3 h-12 bg-gray-400"></View>
      <View className="animate-pulse w-full px-2 mb-8 h-12 bg-gray-500"></View>
    </View>
  );
};

export default SkeletonProductPreview;
