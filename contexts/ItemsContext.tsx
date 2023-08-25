import * as Haptics from "expo-haptics";
import { PropsWithChildren, createContext, useState } from "react";

export type Item = {
  key: string;
  isFavorite: boolean;
  price: string;
  location: "US" | "UAE" | "UK";
};

const locations: ("US" | "UAE" | "UK")[] = ["US", "UAE", "UK"];

const getRandomLocation = () => {
  return locations[Math.floor(Math.random() * locations.length)];
};

const getRandomPrice = () => {
  return Math.floor(1 + Math.random() * 100) * 1000;
};

const formatPrice = (price: number) => {
  return Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
};

export const ItemsContext = createContext<{
  items: Item[];
  setItems: (items: Item[]) => void;
  setItemAsFavorite: (item: Item, useHaptics?: boolean) => void;
} | null>(null);

export const ItemsProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [items, setItems] = useState<Item[]>([
    {
      key: "1",
      isFavorite: false,
      price: formatPrice(getRandomPrice()),
      location: getRandomLocation(),
    },
    {
      key: "2",
      isFavorite: false,
      price: formatPrice(getRandomPrice()),
      location: getRandomLocation(),
    },
    {
      key: "3",
      isFavorite: false,
      price: formatPrice(getRandomPrice()),
      location: getRandomLocation(),
    },
    {
      key: "4",
      isFavorite: false,
      price: formatPrice(getRandomPrice()),
      location: getRandomLocation(),
    },
    {
      key: "5",
      isFavorite: false,
      price: formatPrice(getRandomPrice()),
      location: getRandomLocation(),
    },
    {
      key: "6",
      isFavorite: false,
      price: formatPrice(getRandomPrice()),
      location: getRandomLocation(),
    },
    {
      key: "7",
      isFavorite: false,
      price: formatPrice(getRandomPrice()),
      location: getRandomLocation(),
    },
    {
      key: "8",
      isFavorite: false,
      price: formatPrice(getRandomPrice()),
      location: getRandomLocation(),
    },
  ]);

  const setItemAsFavorite = (item: Item, useHaptics?: boolean) => {
    if (useHaptics) {
      if (item.isFavorite) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }
    }

    const newItems = items.map((i) => {
      if (i.key === item.key) {
        return {
          ...i,
          isFavorite: !i.isFavorite,
        };
      }

      return i;
    });

    setItems(newItems);
  };

  return (
    <ItemsContext.Provider
      value={{
        items,
        setItems,
        setItemAsFavorite,
      }}
    >
      {children}
    </ItemsContext.Provider>
  );
};
