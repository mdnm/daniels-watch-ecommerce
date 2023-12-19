import { Customer } from "@medusajs/medusa";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import { medusaClient } from "../config/medusa";
import { WatchPreviewType } from "../types/global";
import { Wishlist } from "../types/medusa";

export default function useWishlistActions({
  watch,
  customer,
}: {
  watch: WatchPreviewType;
  customer?: Omit<Customer, "password_hash">;
}) {
  const [isWishlisted, setIsWishlisted] = useState(watch.is_wishlisted);

  const handleUpdateWishlist = async ({ useHapticFeedback = false } = {}) => {
    const currentValue = isWishlisted;

    try {
      setIsWishlisted(!currentValue);

      if (watch.is_wishlisted) {
        if (useHapticFeedback) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        const wishlist = customer?.metadata?.wishlist as Wishlist;
        const index = wishlist.findIndex(
          (w) => w.variant_id === watch.variant_id
        );

        await medusaClient.client.request(
          `DELETE`,
          `/store/customers/${customer?.id}/wishlist`,
          {
            index,
          }
        );

        return;
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
    } catch (error) {
      console.error(error);
      setIsWishlisted(currentValue);
    }
  };

  return {
    isWishlisted,
    handleUpdateWishlist,
  };
}
