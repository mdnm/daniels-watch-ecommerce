import { StoreProductsListRes } from "@medusajs/medusa";

export type WatchPreviewType = {
  id: string;
  key: string;
  title?: string;
  subtitle?: string | null;
  handle?: string | null;
  thumbnail?: string | null;
  origin_country?: string | null;
  variant_id?: string;
  is_wishlisted?: boolean;
  brand?: string;
  referenceNumber?: string;
  movement?: string;
  price?: {
    calculated_price: string;
    original_price: string;
    difference: string;
    price_type: string;
  };
};

export type PricedProduct = StoreProductsListRes["products"][0];
export type InfiniteProductPage = {
  response: {
    products: PricedProduct[];
    count: number;
  };
  nextPage: number | null;
};
