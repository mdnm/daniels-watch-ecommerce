import { Region } from "@medusajs/medusa";
import { formatAmount } from "medusa-react";
import { PricedProduct, WatchPreviewType } from "../types/global";
import { Wishlist } from "../types/medusa";
import { getPercentageDiff } from "./getPercentageDiff";

const transformProductPreview = (
  product: PricedProduct,
  region: Region,
  wishlist?: Wishlist
): WatchPreviewType => {
  const cheapestVariant = product.variants.reduce(
    (acc: any, curr: any) => {
      if (
        curr.calculated_price &&
        acc.calculated_price &&
        acc.calculated_price > curr.calculated_price
      ) {
        return curr;
      }
      return acc;
    },
    product.variants[0] ?? {
      calculated_price: 0,
    }
  );

  const metadata = getMetadata(product.metadata);

  return {
    id: product.id as string,
    key: product.id as string,
    title: product.title,
    subtitle: product.subtitle,
    handle: product.handle,
    thumbnail: product.thumbnail,
    origin_country: product.origin_country,
    variant_id: cheapestVariant.id,
    is_wishlisted: wishlist?.some((w) => w.variant_id === cheapestVariant.id),
    brand: product.collection?.title,
    referenceNumber: metadata?.referenceNumber,
    movement: metadata?.movement,
    price: {
      calculated_price: formatAmount({
        amount: cheapestVariant?.calculated_price || 0,
        region: region,
        includeTaxes: false,
      }),
      original_price: formatAmount({
        amount: cheapestVariant?.original_price || 0,
        region: region,
        includeTaxes: false,
      }),
      difference: getPercentageDiff(
        cheapestVariant?.original_price || 0,
        cheapestVariant?.calculated_price || 0
      ),
      price_type: cheapestVariant?.calculated_price_type || "default",
    },
  };
};

function getMetadata(metadata?: Record<string, unknown> | null) {
  if (!metadata || Object.keys(metadata).length === 0) {
    return null;
  }

  return {
    referenceNumber: metadata["Reference number"] as string,
    movement: metadata["Movement"] as string,
  } as {
    referenceNumber: string;
    movement: string;
  };
}

export default transformProductPreview;
