import { Region } from "@medusajs/medusa";
import { useMemo } from "react";
import {
  InfiniteProductPage,
  PricedProduct,
  WatchPreviewType,
} from "../types/global";
import { Wishlist } from "../types/medusa";
import transformProductPreview from "../util/transformProductPreview";

type UsePreviewProps<T> = {
  pages?: T[];
  region?: Region;
  wishlist?: Wishlist;
};

const usePreviews = <T extends InfiniteProductPage>({
  pages,
  region,
  wishlist,
}: UsePreviewProps<T>) => {
  const previews: WatchPreviewType[] = useMemo(() => {
    if (!pages || !region) {
      return [];
    }

    const products: PricedProduct[] = [];

    for (const page of pages) {
      products.push(...page.response.products);
    }

    const transformedProducts = products.map((p) =>
      transformProductPreview(p, region, wishlist)
    );

    return transformedProducts;
  }, [pages, region, wishlist]);

  return previews;
};

export default usePreviews;
