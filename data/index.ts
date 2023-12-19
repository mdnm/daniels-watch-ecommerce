import { Customer, StoreGetProductsParams } from "@medusajs/medusa";
import * as Haptics from "expo-haptics";
import { medusaClient } from "../config/medusa";
import { PricedProduct, WatchPreviewType } from "../types/global";
import { Wishlist } from "../types/medusa";

type FetchProductListParams = {
  pageParam?: number;
  queryParams: StoreGetProductsParams;
};

export const fetchProductsList = async ({
  pageParam = 0,
  queryParams,
}: FetchProductListParams) => {
  const { products, count, offset } = await medusaClient.products.list({
    limit: 12,
    offset: pageParam,
    ...queryParams,
  });

  return {
    response: { products, count },
    nextPage: count > offset + 12 ? offset + 12 : null,
  };
};

export const fetchProduct = async (id: string) => {
  const { product } = await medusaClient.products.retrieve(id, {});

  return {
    product,
  };
};

type FetchProductSearchParams = {
  pageParam?: number;
  search: string;
};

export const fetchProductsSearch = async ({
  pageParam = 0,
  search,
}: FetchProductSearchParams) => {
  const offset = pageParam;
  const { hits } = await medusaClient.products.search({
    q: search,
    limit: 12,
    offset,
  });

  const count = hits.length;

  return {
    response: { products: hits as PricedProduct[], count },
    nextPage: count > offset + 12 ? offset + 12 : null,
  };
};

export const handleUpdateWishlist = async ({
  watch,
  customer,
  useHapticFeedback = false,
}: {
  watch: WatchPreviewType;
  customer?: Omit<Customer, "password_hash">;
  useHapticFeedback?: boolean;
}) => {
  try {
    if (watch.is_wishlisted) {
      if (useHapticFeedback) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      const wishlist = customer?.metadata?.wishlist as Wishlist;
      const index = wishlist.findIndex(
        (w) => w.variant_id === watch.variant_id
      );

      console.log({
        wishlist,
        index,
      });

      await medusaClient.client.request(
        `DELETE`,
        `/store/customers/${customer?.id}/wishlist`,
        {
          index,
        }
      );

      return false;
    }

    if (useHapticFeedback) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    await medusaClient.client.request(
      `POST`,
      `/store/customers/${customer?.id}/wishlist`,
      {
        variant_id: watch.variant_id,
        quantity: 1,
      }
    );
    return true;
  } catch (error) {
    console.error(error);
    return watch.is_wishlisted;
  }
};

type CreateInvoiceBody = {
  price_amount: number;
  price_currency: string;
  order_id: string;
  order_description: string;
};

export const createInvoice = async (body: CreateInvoiceBody) => {
  const data = await medusaClient.client.request(
    `POST`,
    `/store/now-payments/invoice`,
    {
      ...body,
    }
  );

  return data;
};

type UpdatePaymentBody = {
  cart_id: string;
  provider_id: string;
  data: {
    invoice_id: string;
    invoice_url: string;
  };
};

export const updatePayment = async (body: UpdatePaymentBody) => {
  const data = await medusaClient.carts.updatePaymentSession(
    body.cart_id,
    body.provider_id,
    { data: body.data }
  );

  return data;
};

export const fetchCart = async (id: string) => {
  const { cart } = await medusaClient.carts.retrieve(id);

  return cart;
};
