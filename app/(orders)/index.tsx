import { Order, OrderStatus } from "@medusajs/medusa";
import { Link } from "expo-router";
import { formatAmount, useCustomerOrders } from "medusa-react";
import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";

export const mapStatusToColor: Record<OrderStatus, string> = {
  pending: "text-slate-700",
  archived: "text-black",
  canceled: "text-red-500",
  completed: "text-green-600",
  requires_action: "text-slate-900",
};

export const mapStatusToDisplayText: Record<OrderStatus, string> = {
  pending: "Pending",
  archived: "Archived",
  canceled: "Canceled",
  completed: "Completed",
  requires_action: "Requires Action",
};

export default function Orders() {
  const { orders } = useCustomerOrders();

  if (!orders || !orders.length) {
    return null;
  }

  return (
    <SafeAreaView>
      <ScrollView className="w-full px-3 py-5 flex flex-col">
        <View className="w-full flex flex-col pb-12">
          {orders.map((order) => (
            <OrderListItem key={order.id} order={order} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const OrderListItem = ({ order }: { order: Order }) => {
  const formatPrice = (
    price: number | null | undefined,
    includeTaxes?: boolean
  ) => {
    return formatAmount({
      amount: price ?? 0,
      region: order.region,
      includeTaxes: includeTaxes ?? false,
    });
  };

  return (
    <Link href={`/(orders)/${order.id}`} asChild>
      <Pressable className="w-full p-3 active:opacity-50 mt-2 transition-all border-b-2 border-slate-300 rounded-md">
        <View className="flex flex-row justify-between items-center">
          <Text className="text-lg max-w-[150px]" numberOfLines={1}>
            {`#${order.display_id}`} - {order.items[0].title}
          </Text>
          <Text
            className={`text-lg uppercase ${mapStatusToColor[order.status]}`}
          >
            {mapStatusToDisplayText[order.status]}
          </Text>
        </View>
        <Text className="text-xl font-bold mt-2">
          {formatPrice(order.total)}
        </Text>
      </Pressable>
    </Link>
  );
};
