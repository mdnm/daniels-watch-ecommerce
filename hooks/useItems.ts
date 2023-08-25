import { useContext } from "react";
import { ItemsContext } from "../contexts/ItemsContext";

export function useItems() {
  const items = useContext(ItemsContext);

  if (!items) {
    throw new Error("useItems must be used within a ItemsProvider");
  }

  return items;
}
