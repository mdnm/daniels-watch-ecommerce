import { Cart as CartType } from "@medusajs/medusa";
import { MapPin, Trash } from "@nandorojo/heroicons/20/solid";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { formatAmount, useCart, useCartShippingOptions } from "medusa-react";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import colors from "tailwindcss/colors";
import { useCustomer } from "../../contexts/CustomerContext";
import { useStore } from "../../contexts/StoreContext";
import { createInvoice, updatePayment } from "../../data";

type FormData = {
  billing_address: {
    first_name: string | undefined;
    last_name: string | undefined;
    address_1: string;
    address_2: string;
    city: string;
    country_code: string;
    province: string;
    postal_code: string;
    phone: string;
  };
  shipping_address: {
    first_name: string | undefined;
    last_name: string | undefined;
    address_1: string;
    address_2: string;
    city: string;
    country_code: string;
    province: string;
    postal_code: string;
    phone: string;
  };
};

export default function Cart() {
  const { cart } = useCart();
  const { customer } = useCustomer();
  const { resetCart, deleteItem } = useStore();
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    billing_address: {
      first_name: customer?.first_name,
      last_name: customer?.last_name,
      address_1: customer?.billing_address?.address_1 ?? "",
      address_2: customer?.billing_address?.address_2 ?? "",
      city: customer?.billing_address?.city ?? "",
      country_code: customer?.billing_address?.country_code ?? "",
      province: customer?.billing_address?.province ?? "",
      postal_code: customer?.billing_address?.postal_code ?? "",
      phone: customer?.billing_address?.phone ?? "",
    },
    shipping_address: {
      first_name: customer?.first_name,
      last_name: customer?.last_name,
      address_1: customer?.shipping_addresses[0]?.address_1 ?? "",
      address_2: customer?.shipping_addresses[0]?.address_2 ?? "",
      city: customer?.shipping_addresses[0]?.city ?? "",
      country_code: customer?.shipping_addresses[0]?.country_code ?? "",
      province: customer?.shipping_addresses[0]?.province ?? "",
      postal_code: customer?.shipping_addresses[0]?.postal_code ?? "",
      phone: customer?.shipping_addresses[0]?.phone ?? "",
    },
  });
  const [useBillingAddressAsShipping, setUseBillingAddressAsShipping] =
    useState(true);

  if (!cart?.region || !cart?.items.length || !customer) {
    return null;
  }

  const formatPrice = (
    price: number | null | undefined,
    includeTaxes?: boolean
  ) => {
    return formatAmount({
      amount: price ?? 0,
      region: cart.region,
      includeTaxes: includeTaxes ?? false,
    });
  };

  const handleRemoveItem = (lineId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    Alert.alert("Are you sure you want to remove this item?", undefined, [
      {
        text: "Cancel",
        style: "cancel",
        isPreferred: true,
      },
      {
        text: "OK",
        onPress: () => {
          deleteItem(lineId);

          if (cart.items.length === 1) {
            router.replace("/(tabs)/(discover)/");
          }
        },
        style: "default",
      },
    ]);
  };

  const handleEmptyCart = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    Alert.alert("Are you sure you want to empty this cart?", undefined, [
      {
        text: "Cancel",
        style: "cancel",
        isPreferred: true,
      },
      {
        text: "OK",
        onPress: () => {
          resetCart();
          router.replace("/(tabs)/(discover)/");
        },
        style: "default",
      },
    ]);
  };

  return (
    <SafeAreaView>
      <ScrollView className="w-full px-3 py-5 flex flex-col">
        <View className="pb-36">
          {cart.items.map((item) => (
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
                  <Pressable
                    onPressOut={() => {
                      handleRemoveItem(item.id);
                    }}
                    className="flex-[0.2] ml-3 flex flex-row items-center"
                    hitSlop={{
                      top: 20,
                      right: 20,
                      bottom: 20,
                      left: 20,
                    }}
                  >
                    <Trash width={24} height={24} color={colors.red[500]} />
                  </Pressable>
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
          <View className="flex flex-col justify-center items-center mt-3">
            <TextInput
              className="border-2 border-gray-300 rounded-md p-2 pt-0 w-full h-12 mb-3 text-base"
              placeholderTextColor={colors.gray[600]}
              placeholder="First name"
              textContentType="givenName"
              keyboardType="default"
              onChangeText={(text) => {
                setFormData({
                  ...formData,
                  billing_address: {
                    ...formData.billing_address,
                    first_name: text,
                  },
                });
              }}
              value={formData.billing_address.first_name}
            />
            <TextInput
              className="border-2 border-gray-300 rounded-md p-2 pt-0 w-full h-12 mb-3 text-base"
              placeholderTextColor={colors.gray[600]}
              placeholder="Last Name"
              textContentType="familyName"
              keyboardType="default"
              onChangeText={(text) => {
                setFormData({
                  ...formData,
                  billing_address: {
                    ...formData.billing_address,
                    last_name: text,
                  },
                });
              }}
              value={formData.billing_address.last_name}
            />
            <TextInput
              className="border-2 border-gray-300 rounded-md p-2 pt-0 w-full h-12 mb-3 text-base"
              placeholderTextColor={colors.gray[600]}
              placeholder="Phone"
              textContentType="telephoneNumber"
              keyboardType="phone-pad"
              onChangeText={(text) => {
                setFormData({
                  ...formData,
                  billing_address: { ...formData.billing_address, phone: text },
                });
              }}
              value={formData.billing_address.phone}
            />
            <TextInput
              className="border-2 border-gray-300 rounded-md p-2 pt-0 w-full h-12 mb-3 text-base"
              placeholderTextColor={colors.gray[600]}
              placeholder="Address 1"
              textContentType="streetAddressLine1"
              keyboardType="default"
              onChangeText={(text) => {
                setFormData({
                  ...formData,
                  billing_address: {
                    ...formData.billing_address,
                    address_1: text,
                  },
                });
              }}
              value={formData.billing_address.address_1}
            />
            <TextInput
              className="border-2 border-gray-300 rounded-md p-2 pt-0 w-full h-12 mb-3 text-base"
              placeholderTextColor={colors.gray[600]}
              placeholder="Address 2"
              textContentType="streetAddressLine2"
              keyboardType="default"
              onChangeText={(text) => {
                setFormData({
                  ...formData,
                  billing_address: {
                    ...formData.billing_address,
                    address_2: text,
                  },
                });
              }}
              value={formData.billing_address.address_2}
            />
            <TextInput
              className="border-2 border-gray-300 rounded-md p-2 pt-0 w-full h-12 mb-3 text-base"
              placeholderTextColor={colors.gray[600]}
              placeholder="City"
              textContentType="addressCity"
              keyboardType="default"
              onChangeText={(text) => {
                setFormData({
                  ...formData,
                  billing_address: { ...formData.billing_address, city: text },
                });
              }}
              value={formData.billing_address.city}
            />
            {cart.region.countries.map((c) => (
              <Pressable
                key={c.id}
                className={`border-2 border-gray-300 bg-gray-300 rounded-md p-2 w-full h-12 mb-3 text-base flex flex-row items-center`}
              >
                <Text className="text-base capitalize">{c.name}</Text>
              </Pressable>
            ))}
            <TextInput
              className="border-2 border-gray-300 rounded-md p-2 pt-0 w-full h-12 mb-3 text-base"
              placeholderTextColor={colors.gray[600]}
              placeholder="State/Province"
              textContentType="addressState"
              keyboardType="default"
              onChangeText={(text) => {
                setFormData({
                  ...formData,
                  billing_address: {
                    ...formData.billing_address,
                    province: text,
                  },
                });
              }}
              value={formData.billing_address.province}
            />
            <TextInput
              className="border-2 border-gray-300 rounded-md p-2 pt-0 w-full h-12 text-base"
              placeholderTextColor={colors.gray[600]}
              placeholder="Postal code"
              textContentType="postalCode"
              keyboardType="default"
              onChangeText={(text) => {
                setFormData({
                  ...formData,
                  billing_address: {
                    ...formData.billing_address,
                    postal_code: text,
                  },
                });
              }}
              value={formData.billing_address.postal_code}
            />
          </View>
          <Text className="mt-3 text-xl font-bold">Shipping Address</Text>
          <View className="mt-2 flex flex-row items-center">
            <Switch
              onValueChange={setUseBillingAddressAsShipping}
              value={useBillingAddressAsShipping}
            />
            <Text className="text-lg ml-2">Same as billing address</Text>
          </View>
          {!useBillingAddressAsShipping && (
            <View className="flex flex-col justify-center items-center mt-3">
              <TextInput
                className="border-2 border-gray-300 rounded-md p-2 pt-0 w-full h-12 mb-3 text-base"
                placeholderTextColor={colors.gray[600]}
                placeholder="First name"
                textContentType="givenName"
                keyboardType="default"
                onChangeText={(text) => {
                  setFormData({
                    ...formData,
                    shipping_address: {
                      ...formData.shipping_address,
                      first_name: text,
                    },
                  });
                }}
                value={formData.shipping_address.first_name}
              />
              <TextInput
                className="border-2 border-gray-300 rounded-md p-2 pt-0 w-full h-12 mb-3 text-base"
                placeholderTextColor={colors.gray[600]}
                placeholder="Last Name"
                textContentType="familyName"
                keyboardType="default"
                onChangeText={(text) => {
                  setFormData({
                    ...formData,
                    shipping_address: {
                      ...formData.shipping_address,
                      last_name: text,
                    },
                  });
                }}
                value={formData.shipping_address.last_name}
              />
              <TextInput
                className="border-2 border-gray-300 rounded-md p-2 pt-0 w-full h-12 mb-3 text-base"
                placeholderTextColor={colors.gray[600]}
                placeholder="Phone"
                textContentType="telephoneNumber"
                keyboardType="phone-pad"
                onChangeText={(text) => {
                  setFormData({
                    ...formData,
                    shipping_address: {
                      ...formData.shipping_address,
                      phone: text,
                    },
                  });
                }}
                value={formData.shipping_address.phone}
              />
              <TextInput
                className="border-2 border-gray-300 rounded-md p-2 pt-0 w-full h-12 mb-3 text-base"
                placeholderTextColor={colors.gray[600]}
                placeholder="Address 1"
                textContentType="streetAddressLine1"
                keyboardType="default"
                onChangeText={(text) => {
                  setFormData({
                    ...formData,
                    shipping_address: {
                      ...formData.shipping_address,
                      address_1: text,
                    },
                  });
                }}
                value={formData.shipping_address.address_1}
              />
              <TextInput
                className="border-2 border-gray-300 rounded-md p-2 pt-0 w-full h-12 mb-3 text-base"
                placeholderTextColor={colors.gray[600]}
                placeholder="Address 2"
                textContentType="streetAddressLine2"
                keyboardType="default"
                onChangeText={(text) => {
                  setFormData({
                    ...formData,
                    shipping_address: {
                      ...formData.shipping_address,
                      address_2: text,
                    },
                  });
                }}
                value={formData.shipping_address.address_2}
              />
              <TextInput
                className="border-2 border-gray-300 rounded-md p-2 pt-0 w-full h-12 mb-3 text-base"
                placeholderTextColor={colors.gray[600]}
                placeholder="City"
                textContentType="addressCity"
                keyboardType="default"
                onChangeText={(text) => {
                  setFormData({
                    ...formData,
                    shipping_address: {
                      ...formData.shipping_address,
                      city: text,
                    },
                  });
                }}
                value={formData.shipping_address.city}
              />
              {cart.region.countries.map((c) => (
                <Pressable
                  key={c.id}
                  className={`border-2 border-gray-300 bg-gray-300 rounded-md p-2 w-full h-12 mb-3 text-base flex flex-row items-center`}
                >
                  <Text className="text-base capitalize">{c.name}</Text>
                </Pressable>
              ))}
              <TextInput
                className="border-2 border-gray-300 rounded-md p-2 pt-0 w-full h-12 mb-3 text-base"
                placeholderTextColor={colors.gray[600]}
                placeholder="State/Province"
                textContentType="addressState"
                keyboardType="default"
                onChangeText={(text) => {
                  setFormData({
                    ...formData,
                    shipping_address: {
                      ...formData.shipping_address,
                      province: text,
                    },
                  });
                }}
                value={formData.shipping_address.province}
              />
              <TextInput
                className="border-2 border-gray-300 rounded-md p-2 pt-0 w-full h-12 text-base"
                placeholderTextColor={colors.gray[600]}
                placeholder="Postal code"
                textContentType="postalCode"
                keyboardType="default"
                onChangeText={(text) => {
                  setFormData({
                    ...formData,
                    shipping_address: {
                      ...formData.shipping_address,
                      postal_code: text,
                    },
                  });
                }}
                value={formData.shipping_address.postal_code}
              />
            </View>
          )}
          <Text className="mt-3 text-xl font-bold">Order Summary</Text>
          <View className="mt-2 p-3 flex flex-col rounded-md bg-zinc-200">
            <View className="flex flex-row justify-between items-center">
              <Text className="text-lg">Items total</Text>
              <Text className="text-lg">
                {formatPrice(cart.subtotal, false)}
              </Text>
            </View>
            <View className="flex flex-row justify-between items-center mt-1">
              <Text className="text-lg">Shipping costs</Text>
              <Text className="text-lg">
                {formatPrice(cart.shipping_total, false)}
              </Text>
            </View>
            {Boolean(cart.tax_total) && (
              <View className="flex flex-row justify-between items-center">
                <Text className="text-lg">Taxes</Text>
                <Text className="text-lg">
                  {formatPrice(cart.tax_total, false)}
                </Text>
              </View>
            )}
            <View className="my-5 w-full h-0.5 bg-gray-300" />
            <View className="flex flex-row justify-between items-center">
              <Text className="text-lg font-bold">Total price</Text>
              <Text className="text-lg font-bold">
                {formatPrice(cart.total)}
              </Text>
            </View>
          </View>

          <CheckoutButton
            cart={cart}
            formData={formData}
            useBillingAddressAsShipping={useBillingAddressAsShipping}
          />
          <Pressable
            onPressOut={handleEmptyCart}
            className="w-full p-3 rounded-md border-red-500 border active:bg-red-200 transition-all mt-6"
          >
            <Text className="text-lg text-center text-red-500">Empty cart</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

type CheckoutButtonProps = {
  cart: Omit<CartType, "refundable_amount" | "refunded_total">;
  formData: FormData;
  useBillingAddressAsShipping: boolean;
};

const CheckoutButton = ({
  cart,
  formData,
  useBillingAddressAsShipping,
}: CheckoutButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { shipping_options } = useCartShippingOptions(cart.id);
  const {
    updateCart,
    addShippingMethod,
    startCheckout,
    pay,
    completeCheckout,
  } = useCart();
  const { resetCart } = useStore();
  const router = useRouter();

  useEffect(() => {
    async function addShippingMethodToCart() {
      setIsLoading(true);
      try {
        if (!cart?.payment_session?.is_initiated) {
          await addShippingMethod.mutateAsync({
            option_id: shipping_options?.[0]?.id ?? "",
          });
          await startCheckout.mutateAsync();
        }

        if (!cart?.payment_session?.is_selected) {
          await pay.mutateAsync({
            provider_id: "now_payments",
          });
        }
      } catch (e) {
        console.log(e);
      }
      setIsLoading(false);
    }

    if (cart?.shipping_methods.length === 0 && shipping_options?.length) {
      addShippingMethodToCart();
    }
  }, [cart, shipping_options]);

  const handleCheckout = async () => {
    const isBillingAddressFilled =
      Boolean(formData.billing_address.first_name) &&
      Boolean(formData.billing_address.last_name) &&
      Boolean(formData.billing_address.address_1) &&
      Boolean(formData.billing_address.city) &&
      Boolean(formData.billing_address.province) &&
      Boolean(formData.billing_address.postal_code) &&
      Boolean(formData.billing_address.phone);

    if (!isBillingAddressFilled) {
      return;
    }

    const isShippingAddressFilled =
      useBillingAddressAsShipping ||
      (Boolean(formData.shipping_address.first_name) &&
        Boolean(formData.shipping_address.last_name) &&
        Boolean(formData.shipping_address.address_1) &&
        Boolean(formData.shipping_address.city) &&
        Boolean(formData.shipping_address.province) &&
        Boolean(formData.shipping_address.postal_code) &&
        Boolean(formData.shipping_address.phone));

    if (!isShippingAddressFilled) {
      return;
    }

    setIsLoading(true);
    try {
      const billingCountryCode = formData.billing_address.country_code
        ? formData.billing_address.country_code
        : cart?.region.countries[0].iso_2 ?? "";
      const shippingCountryCode = formData.shipping_address.country_code
        ? formData.shipping_address.country_code
        : cart?.region.countries[0].iso_2 ?? "";

      const billingAddress = {
        ...formData.billing_address,
        country_code: billingCountryCode,
      };
      const shippingAddress = {
        ...formData.shipping_address,
        country_code: shippingCountryCode,
      };

      await updateCart.mutateAsync({
        billing_address: billingAddress,
        shipping_address: useBillingAddressAsShipping
          ? billingAddress
          : shippingAddress,
      });

      if (!cart?.payment_session?.is_initiated) {
        await addShippingMethod.mutateAsync({
          option_id: shipping_options?.[0]?.id ?? "",
        });
        await startCheckout.mutateAsync();
      }

      if (!cart?.payment_session?.is_selected) {
        await pay.mutateAsync({
          provider_id: "now_payments",
        });
      }

      const order = await completeCheckout.mutateAsync();

      if (order.type !== "order") {
        throw new Error("Something went wrong");
      }

      const data = await createInvoice({
        price_amount: order.data.total / 100,
        price_currency: order.data.currency_code,
        order_id: order.data.id,
        order_description: order.data.items.map((i) => i.title).join(", "),
      });

      await updatePayment({
        cart_id: order.data.cart_id,
        provider_id: "now_payments",
        data: {
          invoice_id: data.invoice_id,
          invoice_url: data.invoice_url,
        },
      });
      setIsLoading(false);

      await WebBrowser.openBrowserAsync(data.invoice_url);
      resetCart();
      router.replace("/(tabs)/(discover)/");
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <Pressable
      onPressOut={handleCheckout}
      className={`w-full p-3 rounded-md bg-green-600 disabled:opacity-50 active:bg-green-700 transition-all mt-3`}
      disabled={isLoading}
    >
      <Text className="text-lg text-center text-white">
        Checkout{" "}
        {isLoading && <ActivityIndicator size="small" color={colors.white} />}
      </Text>
    </Pressable>
  );
};
