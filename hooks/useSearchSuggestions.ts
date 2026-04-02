import { useQuery } from "@tanstack/react-query";
import {
  Category,
  StoreHomeData,
  storeService,
} from "@/services/store/store.service";
import { useDebounce } from "./useDebounce";

export interface Product {
  id: string;
  name: string;
  price: string;
  unit: string;
  image: string;
  images: string[];
  supplier: {
    username?: string;
    name: string;
    location: string;
    rating: number;
    reviews: number;
    yearEstablished: number;
    gstVerified: boolean;
    trustSeal: boolean;
    responseRate: string;
    businessType: string;
    address: string;
    logo?: string;
    mobile?: string;
    gstNumber?: string;
    latitude?: number;
    longitude?: number;
    id?: string;
  };
  supplier_id: string;
  specs: { [key: string]: string };
  description: string;
  gst: string;
  category: string;
  categoryId: string;
  whatsapp_number?: string;
  whatsapp_country_code?: string;
}

export const useSearchSuggestions = (
  searchQuery: string,
  homeData: StoreHomeData | null,
) => {
  const query = searchQuery.trim().toLowerCase();
  const debouncedQuery = useDebounce(query, 500); // 500ms debounce
  const minChars = 3;

  // 1. Local filtering for categories (always instant)
  const filteredCategories = (homeData?.categories || []).filter((cat) =>
    cat.category_name.toLowerCase().includes(query),
  );

  // 2. Fetch products matching search query using TanStack Query
  const { data: productSuggestions = [], isLoading: isFetching } = useQuery({
    queryKey: ["product-suggestions", debouncedQuery],
    queryFn: async () => {
      const response = await storeService.getProducts({
        limit: 6,
        search: debouncedQuery,
      });

      const products =
        response.data?.products ||
        (Array.isArray(response.data) ? response.data : []);

      return products.map((p: any) => ({
        id: p.product_id,
        name: p.product_name,
        price: `${p.currency === "INR" ? "₹" : "$"} ${p.price}`,
        unit: "Piece",
        image: p.product_images?.[0] || "",
        images: p.product_images || [],
        description: p.product_description,
        gst: "18%",
        category: p.category_name || "General",
        categoryId: p.product_category_id || "",
        supplier_id:
          p.supplier_id || p.supplier?.store_id || p.supplier?.id || "",
        specs: {},
        supplier: {
          name: p.supplier?.store_name || "Verified Supplier",
          location: p.supplier?.store_address?.city_town || "India",
          rating: p.supplier?.user_rating || 0,
          reviews: 25,
          yearEstablished: 2020,
          gstVerified: !!p.supplier?.gst_in,
          trustSeal: p.supplier?.is_verified || false,
          responseRate: "95%",
          businessType: "Manufacturer",
          address: p.supplier?.store_address?.address || "",
          id: p.supplier?.store_id || p.supplier?.id || "",
        },
        whatsapp_number: p.supplier?.whatsapp_number || p.supplier?.primary_mobile || p.supplier?.contact_phone || "",
        whatsapp_country_code: p.supplier?.country_code || "91",
      }));
    },
    enabled: debouncedQuery.length >= minChars,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  // Calculate if we should show searching state
  // We are searching if:
  // 1. The typed query is long enough but hasn't been debounced yet
  // 2. The debounced query is long enough and we are currently fetching
  const isWaitingForDebounce =
    query.length >= minChars && query !== debouncedQuery;
  const isSearching = isWaitingForDebounce || isFetching;

  return {
    categories: filteredCategories,
    products: debouncedQuery.length >= minChars ? productSuggestions : [],
    isSearching,
    isEmpty:
      query.length > 0 &&
      !isSearching &&
      filteredCategories.length === 0 &&
      (query.length < minChars ||
        (debouncedQuery.length >= minChars && productSuggestions.length === 0)),
  };
};
