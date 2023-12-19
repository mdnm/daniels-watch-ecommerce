import { Customer } from "@medusajs/medusa";
import { useMeCustomer } from "medusa-react";
import React, { PropsWithChildren, createContext, useContext } from "react";
import { Wishlist } from "../types/medusa";

export const CustomerContext = createContext<{
  customer: Omit<Customer, "password_hash"> | undefined;
  isLoading: boolean;
  refetch: () => void;
  wishlist: Wishlist;
} | null>(null);

export const CustomerProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { customer, isLoading, refetch } = useMeCustomer();
  const wishlist = Array.isArray(customer?.metadata?.wishlist)
    ? (customer?.metadata?.wishlist as Wishlist)
    : [];

  return (
    <CustomerContext.Provider
      value={{
        customer,
        isLoading,
        refetch,
        wishlist,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomer = () => {
  const context = useContext(CustomerContext);
  if (context === null) {
    throw new Error("useCustomer must be used within a CustomerProvider");
  }
  return context;
};
