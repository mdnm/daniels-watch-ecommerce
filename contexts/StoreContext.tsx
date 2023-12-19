import { Region } from "@medusajs/medusa";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  useCart,
  useCreateLineItem,
  useDeleteLineItem,
  useUpdateLineItem,
} from "medusa-react";
import React, { useEffect, useState } from "react";
import { medusaClient } from "../config/medusa";
import { useCartDropdown } from "./CartDropdownContext";

interface VariantInfoProps {
  variantId: string;
  quantity: number;
}

interface LineInfoProps {
  lineId: string;
  quantity: number;
}

interface StoreContext {
  country: Country | undefined;
  setRegion: (regionId: string, country: Country) => void;
  addItem: (item: VariantInfoProps) => void;
  updateItem: (item: LineInfoProps) => void;
  deleteItem: (lineId: string) => void;
  resetCart: () => void;
}

const StoreContext = React.createContext<StoreContext | null>(null);

export const useStore = () => {
  const context = React.useContext(StoreContext);
  if (context === null) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};

interface StoreProps {
  children: React.ReactNode;
}

const CART_KEY = "medusa_cart_id";
const REGION_KEY = "medusa_region";

const handleError = (error: Error) => {
  if (process.env.NODE_ENV === "development") {
    console.error(error);
  }

  // TODO: user facing error message
};

const mapCountryCodeToMedusaRegion: Record<string, string> = {
  US: "reg_01H9V24EWNVBSPENPCT3ZQ6J5J",
  AE: "reg_01HA7MMDSDJFR9WWFGS60H9738",
};

type Country = { code: string; name: string };

export const StoreProvider = ({ children }: StoreProps) => {
  const { cart, setCart, createCart, updateCart } = useCart();
  const [country, setCountry] = useState<Country | undefined>(undefined);
  const { timedOpen } = useCartDropdown();
  const addLineItem = useCreateLineItem(cart?.id!);
  const removeLineItem = useDeleteLineItem(cart?.id!);
  const adjustLineItem = useUpdateLineItem(cart?.id!);

  const storeRegion = async (regionId: string, country: Country) => {
    await AsyncStorage.setItem(
      REGION_KEY,
      JSON.stringify({ regionId, country })
    );

    setCountry(country);
  };

  useEffect(() => {
    (async () => {
      const storedRegion = await AsyncStorage.getItem(REGION_KEY);
      if (storedRegion) {
        const { country } = JSON.parse(storedRegion) as { country: Country };
        if (country.code && country.name) {
          setCountry(country);
        } else {
          const url = `http://api.ipstack.com/check?access_key=${process.env.EXPO_PUBLIC_IP_STACK_API_KEY}&format=1`;

          const response = await fetch(url);
          const data = (await response.json()) as {
            country_code: string;
            country_name: string;
          };

          setCountry({
            code: data?.country_code,
            name: data?.country_name,
          });
        }
      }
    })();
  }, []);

  const getRegion = async () => {
    const region = await AsyncStorage.getItem(REGION_KEY);
    if (region) {
      return JSON.parse(region) as { regionId: string; country: Country };
    }
  };

  const setRegion = async (regionId: string, country: Country) => {
    await updateCart.mutateAsync(
      {
        region_id: regionId,
      },
      {
        onSuccess: async ({ cart }) => {
          setCart(cart);
          await storeCart(cart.id);
          await storeRegion(regionId, country);
        },
        onError: (error) => {
          if (process.env.NODE_ENV === "development") {
            console.error(error);
          }
        },
      }
    );
  };

  const ensureRegion = async (region: Region, country?: Country | null) => {
    const { regionId, country: defaultCountry } = (await getRegion()) || {
      regionId: region.id,
      country: {
        code: region.countries[0].iso_2,
        name: region.countries[0].display_name,
      },
    };

    const finalCountry =
      country?.name && country?.code
        ? country
        : defaultCountry?.code && defaultCountry?.name
        ? defaultCountry
        : {
            code: region.countries[0].iso_2,
            name: region.countries[0].display_name,
          };

    if (regionId !== region.id) {
      await setRegion(region.id, finalCountry);
    }

    await storeRegion(region.id, finalCountry);
    setCountry(finalCountry);
  };

  const storeCart = async (id: string) => {
    await AsyncStorage.setItem(CART_KEY, id);
  };

  const getCart = async () => {
    return await AsyncStorage.getItem(CART_KEY);
  };

  const deleteCart = async () => {
    await AsyncStorage.removeItem(CART_KEY);
  };

  const deleteRegion = async () => {
    await AsyncStorage.removeItem(REGION_KEY);
  };

  const createNewCart = async (regionId?: string) => {
    let finalRegionId = regionId;
    let finalCountry: Country | null = null;

    if (!regionId) {
      const url = `http://api.ipstack.com/check?access_key=${process.env.EXPO_PUBLIC_IP_STACK_API_KEY}&format=1`;

      const response = await fetch(url);
      const data = (await response.json()) as {
        country_code: string;
        country_name: string;
      };

      finalCountry = {
        code: data.country_code,
        name: data.country_name,
      };
      finalRegionId =
        mapCountryCodeToMedusaRegion[data.country_code] ??
        mapCountryCodeToMedusaRegion["US"];
    }

    await createCart.mutateAsync(
      { region_id: finalRegionId },
      {
        onSuccess: async ({ cart }) => {
          setCart(cart);
          await storeCart(cart.id);
          await ensureRegion(
            cart.region,
            finalCountry ?? cart.shipping_address
              ? {
                  code: cart.shipping_address?.country_code || "",
                  name: cart.shipping_address?.country?.display_name || "",
                }
              : null
          );
        },
        onError: (error) => {
          if (process.env.NODE_ENV === "development") {
            console.error(error);
          }
        },
      }
    );
  };

  const resetCart = async () => {
    await deleteCart();

    const savedRegion = await getRegion();

    createCart.mutate(
      {
        region_id: savedRegion?.regionId,
      },
      {
        onSuccess: async ({ cart }) => {
          setCart(cart);
          await storeCart(cart.id);
          await ensureRegion(cart.region, savedRegion?.country);
        },
        onError: (error) => {
          if (process.env.NODE_ENV === "development") {
            console.error(error);
          }
        },
      }
    );
  };

  useEffect(() => {
    const ensureCart = async () => {
      const cartId = await getCart();
      const region = await getRegion();

      if (cartId) {
        const cartRes = await medusaClient.carts
          .retrieve(cartId)
          .then(({ cart }: { cart: any }) => {
            return cart;
          })
          .catch(async (_: any) => {
            return null;
          });

        if (!cartRes || cartRes.completed_at) {
          await deleteCart();
          await deleteRegion();
          await createNewCart();
          return;
        }

        setCart(cartRes);
        await ensureRegion(cartRes.region);
      } else {
        await createNewCart(region?.regionId);
      }
    };

    if (!cart?.id) {
      ensureCart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addItem = ({
    variantId,
    quantity,
  }: {
    variantId: string;
    quantity: number;
  }) => {
    addLineItem.mutate(
      {
        variant_id: variantId,
        quantity: quantity,
      },
      {
        onSuccess: async ({ cart }) => {
          setCart(cart);
          await storeCart(cart.id);
          timedOpen();
        },
        onError: (error) => {
          handleError(error);
        },
      }
    );
  };

  const deleteItem = (lineId: string) => {
    removeLineItem.mutate(
      {
        lineId,
      },
      {
        onSuccess: async ({ cart }) => {
          setCart(cart);
          await storeCart(cart.id);
        },
        onError: (error) => {
          handleError(error);
        },
      }
    );
  };

  const updateItem = ({
    lineId,
    quantity,
  }: {
    lineId: string;
    quantity: number;
  }) => {
    adjustLineItem.mutate(
      {
        lineId,
        quantity,
      },
      {
        onSuccess: async ({ cart }) => {
          setCart(cart);
          await storeCart(cart.id);
        },
        onError: (error) => {
          handleError(error);
        },
      }
    );
  };

  return (
    <StoreContext.Provider
      value={{
        country,
        setRegion,
        addItem,
        deleteItem,
        updateItem,
        resetCart,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};
