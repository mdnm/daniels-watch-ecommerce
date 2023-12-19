import { createContext, useContext, useEffect, useState } from "react";
import useToggleState from "../hooks/useToggleState";

interface CartDropdownContext {
  state: boolean;
  open: () => void;
  timedOpen: () => void;
  close: () => void;
}

export const CartDropdownContext = createContext<CartDropdownContext | null>(
  null
);

export const CartDropdownProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { state, close, open } = useToggleState();
  const [activeTimer, setActiveTimer] = useState<NodeJS.Timeout | undefined>(
    undefined
  );

  const timedOpen = () => {
    open();

    const timer = setTimeout(close, 5000);

    setActiveTimer(timer);
  };

  const openAndCancel = () => {
    if (activeTimer) {
      clearTimeout(activeTimer);
    }

    open();
  };

  // Clean up the timer when the component unmounts
  useEffect(() => {
    return () => {
      if (activeTimer) {
        clearTimeout(activeTimer);
      }
    };
  }, [activeTimer]);

  return (
    <CartDropdownContext.Provider
      value={{ state, close, open: openAndCancel, timedOpen }}
    >
      {children}
    </CartDropdownContext.Provider>
  );
};

export const useCartDropdown = () => {
  const context = useContext(CartDropdownContext);

  if (context === null) {
    throw new Error(
      "useCartDropdown must be used within a CartDropdownProvider"
    );
  }

  return context;
};
