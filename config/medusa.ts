import Medusa from "@medusajs/medusa-js";
import { QueryClient } from "@tanstack/react-query";
import "react-native-get-random-values";

const MEDUSA_BACKEND_URL = "https://danielsapp.com";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 60 * 24,
      retry: 1,
    },
  },
});

const medusaClient = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 });

export { MEDUSA_BACKEND_URL, medusaClient, queryClient };
