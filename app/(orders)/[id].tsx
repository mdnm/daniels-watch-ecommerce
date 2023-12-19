import { FulfillmentStatus, PaymentStatus } from "@medusajs/medusa";
import { MapPin } from "@nandorojo/heroicons/20/solid";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { formatAmount, useOrder } from "medusa-react";
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import colors from "tailwindcss/colors";
import { mapStatusToDisplayText } from ".";
import { useStore } from "../../contexts/StoreContext";
import { fetchCart } from "../../data";

export const mapPaymentStatusToDisplayText: Record<PaymentStatus, string> = {
  awaiting: "Pending payment",
  canceled: "Canceled",
  captured: "Paid",
  not_paid: "Not paid",
  partially_refunded: "Refunded",
  refunded: "Refunded",
  requires_action: "Requires Action",
};

export const mapShippingStatusToDisplayText: Record<FulfillmentStatus, string> =
  {
    canceled: "Canceled",
    shipped: "Shipped",
    fulfilled: "In Transit",
    not_fulfilled: "Awaiting fulfillment",
    returned: "Returned",
    requires_action: "Requires Action",
    partially_shipped: "Partially Shipped",
    partially_returned: "Partially Returned",
    partially_fulfilled: "In Transit",
  };

export default function Order() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { order } = useOrder(id);
  const { country } = useStore();

  if (!order) {
    return null;
  }

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
    <SafeAreaView>
      <ScrollView className="w-full px-3 py-5 flex flex-col">
        <View className="pb-36">
          {order.items.map((item) => (
            <View key={item.id} className="flex flex-row mb-5">
              <View className="flex-[0.7] h-40 mr-3">
                <Image
                  source={{
                    uri: item.thumbnail || "",
                  }}
                  className="h-full w-full rounded-md"
                />
              </View>
              <View className="flex-1 flex flex-col justify-between">
                <View className="flex flex-row justify-between items-center">
                  <Text className="flex-1 text-xl font-bold" numberOfLines={2}>
                    {item.title}
                  </Text>
                </View>
                <View className="flex flex-row justify-between items-center">
                  <Text className="text-lg">{formatPrice(item.total)}</Text>
                  <View className="flex flex-row items-center">
                    <MapPin width={18} height={18} color={colors.black} />
                    <Text className="text-base ml-1">
                      {item.variant.origin_country}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
          <Text className="mt-3 text-xl font-bold">Billing Address</Text>
          <View className="mt-2 flex flex-col">
            <Text className="text-lg">
              {order.billing_address?.first_name}{" "}
              {order.billing_address?.last_name}
            </Text>
            <Text className="text-lg">{order.billing_address?.phone}</Text>
            <Text className="text-lg">{order.billing_address?.address_1}</Text>
            {order.billing_address?.address_2 && (
              <Text className="text-lg">
                {order.billing_address?.address_2}
              </Text>
            )}
            <Text className="text-lg">
              {order.billing_address?.postal_code}
            </Text>
            <Text className="text-lg">
              {order.billing_address?.city} ({order.billing_address?.province})
              -{" "}
              {country?.code === order.billing_address?.country_code
                ? country?.name
                : order.billing_address?.country_code}
            </Text>
          </View>
          <Text className="mt-3 text-xl font-bold">Shipping Address</Text>
          <View className="mt-2 flex flex-col">
            <Text className="text-lg">
              {order.shipping_address?.first_name}{" "}
              {order.shipping_address?.last_name}
            </Text>
            <Text className="text-lg">{order.shipping_address?.phone}</Text>
            <Text className="text-lg">{order.shipping_address?.address_1}</Text>
            {order.shipping_address?.address_2 && (
              <Text className="text-lg">
                {order.shipping_address?.address_2}
              </Text>
            )}
            <Text className="text-lg">
              {order.shipping_address?.postal_code}
            </Text>
            <Text className="text-lg">
              {order.shipping_address?.city} ({order.shipping_address?.province}
              ) -{" "}
              {country?.code === order.shipping_address?.country_code
                ? country?.name
                : order.shipping_address?.country_code}
            </Text>
          </View>
          <Text className="mt-3 text-xl font-bold">Order Summary</Text>
          <View className="mt-2 p-3 flex flex-col rounded-md bg-zinc-200">
            <View className="flex flex-row justify-between items-center">
              <Text className="text-lg">Items total</Text>
              <Text className="text-lg">
                {formatPrice(order.subtotal, false)}
              </Text>
            </View>
            <View className="flex flex-row justify-between items-center mt-1">
              <Text className="text-lg">Shipping costs</Text>
              <Text className="text-lg">
                {formatPrice(order.shipping_total, false)}
              </Text>
            </View>
            {Boolean(order.tax_total) && (
              <View className="flex flex-row justify-between items-center">
                <Text className="text-lg">Taxes</Text>
                <Text className="text-lg">
                  {formatPrice(order.tax_total, false)}
                </Text>
              </View>
            )}
            <View className="my-5 w-full h-0.5 bg-gray-300" />
            <View className="flex flex-row justify-between items-center">
              <Text className="text-lg font-bold">Total price</Text>
              <Text className="text-lg font-bold">
                {formatPrice(order.total)}
              </Text>
            </View>
          </View>
          <Text className="mt-3 text-xl font-bold">Order Status</Text>
          <Text className={`text-lg uppercase mt-2`}>
            {mapStatusToDisplayText[order.status]}
          </Text>
          <Text className="mt-3 text-xl font-bold">Payment Status</Text>
          <View className="flex flex-row justify-between items-center mt-2">
            <Text className={`text-lg uppercase`}>
              {mapPaymentStatusToDisplayText[order.payment_status]}
            </Text>
            {order.payment_status === "awaiting" && (
              <InvoiceUrl cartId={order.cart_id} />
            )}
          </View>
          <Text className="mt-3 text-xl font-bold">Shipping Status</Text>
          <Text className={`text-lg uppercase mt-2`}>
            {mapShippingStatusToDisplayText[order.fulfillment_status]}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const InvoiceUrl = ({ cartId }: { cartId: string }) => {
  const { data: cart } = useQuery({
    queryFn: () => fetchCart(cartId),
    queryKey: ["order", "cart", cartId],
  });

  const invoiceUrl = cart?.payment_session?.data?.invoice_url;

  if (typeof invoiceUrl !== "string") {
    return null;
  }

  const handleOpenInvoiceLink = async () => {
    await WebBrowser.openBrowserAsync(invoiceUrl);
  };

  return (
    <Pressable onPressOut={handleOpenInvoiceLink}>
      <Text className="text-lg underline text-blue-700">Invoice URL</Text>
    </Pressable>
  );
};
