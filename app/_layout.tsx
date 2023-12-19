import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { QueryClient } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { CartProvider, MedusaProvider } from "medusa-react";
import { useEffect } from "react";
import "../assets/global.css";
import { CartDropdownProvider } from "../contexts/CartDropdownContext";
import { CustomerProvider } from "../contexts/CustomerContext";
import { SearchProvider } from "../contexts/SearchContext";
import { StoreProvider } from "../contexts/StoreContext";
import { ThemeProvider } from "../contexts/ThemeContext";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "/(tabs)/discover",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...Ionicons.font,
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <MedusaProvider
        queryClientProviderProps={{ client: queryClient }}
        baseUrl="https://danielsapp.com"
        publishableApiKey={"pk_01H9V6JJDNZJA8ZJ2HH5ES8WAJ"}
      >
        <CartProvider>
          <CartDropdownProvider>
            <StoreProvider>
              <CustomerProvider>
                <SearchProvider>
                  <RootLayoutNav />
                  <StatusBar style="dark" animated />
                </SearchProvider>
              </CustomerProvider>
            </StoreProvider>
          </CartDropdownProvider>
        </CartProvider>
      </MedusaProvider>
    </ThemeProvider>
  );
}

function RootLayoutNav() {
  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(cart)" options={{ headerShown: false }} />
      <Stack.Screen name="(orders)" options={{ headerShown: false }} />
      <Stack.Screen
        name="(modal)"
        options={{ headerShown: false, presentation: "modal" }}
      />
    </Stack>
  );
}
