"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Chip,
  useTheme,
  Stack,
  IconButton,
  Menu,
  MenuItem,
  Fade,
  Zoom,
  Paper,
  Avatar,
  Tooltip,
  Badge,
} from "@mui/material";
import {
  Search,
  Star,
  Verified,
  LocationOn,
  Call,
  WhatsApp,
  ArrowBack,
  Sort,
  FavoriteBorder,
  Favorite,
  CheckCircle,
  Business,
  TrendingUp,
  AccessTime,
  LocalShipping,
  Description,
  Speed,
  CorporateFare,
} from "@mui/icons-material";
import { useRouter, useSearchParams } from "next/navigation";
import { COLORS } from "@/constants/colors";
import CategorySidebar from "./CategorySidebar";
import InquiryModal from "./InquiryModal";
import { Product } from "./index";
import ProductCard from "./ProductCard";
import { storeService, StoreHomeData } from "@/services/store/store.service";
import CommonButton from "@/components/common/Button";
import { keyframes } from "@mui/system";

// Animation keyframes
const pulseGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(94, 24, 233, 0.4);
  }
  50% {
    box-shadow: 0 0 20px 10px rgba(94, 24, 233, 0);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const slideUp = keyframes`
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const scaleIn = keyframes`
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
`;

const ProductsListingView: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const router = useRouter();
  const searchParams = useSearchParams();

  // State
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get("category"),
  );
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(
    searchParams.get("sub_category"),
  );
  const [selectedBrand, setSelectedBrand] = useState<string | null>(
    searchParams.get("brand"),
  );
  const [selectedBusinessTypes, setSelectedBusinessTypes] = useState<string[]>(
    searchParams.get("business_types")?.split(",") || [],
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(searchParams.get("min_price")) || 0,
    Number(searchParams.get("max_price")) || 1000000,
  ]);

  const [homeData, setHomeData] = useState<StoreHomeData | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [sortAnchor, setSortAnchor] = useState<null | HTMLElement>(null);

  // Inquiry State
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [animatingContact, setAnimatingContact] = useState<string | null>(null);

  // Fetch Home Data (Categories/Brands)
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await storeService.getStoreHome();
        if (response.status === "success" && response.data) {
          setHomeData(response.data);
        }
      } catch (error) {
        console.error("Error fetching store home data:", error);
      } finally {
        setLoading(false); // Set loading to false after home data is fetched
      }
    };
    fetchHomeData();
  }, []);

  // Fetch Products
  const fetchProducts = React.useCallback(async () => {
    try {
      setProductsLoading(true);
      const filters: any = {
        page: 1,
        limit: 50,
        sort: "price_asc",
      };

      if (selectedSubCategory) {
        filters.sub_category_id = selectedSubCategory;
      } else if (selectedCategory && selectedCategory !== "all") {
        filters.category_id = selectedCategory;
      } else if (selectedBrand) {
        filters.brand_id = selectedBrand;
      }

      // Note: Backend might not support business_type or price range yet in POST /store/products
      // We are adding them to filters object for when it does
      if (selectedBusinessTypes.length > 0) {
        filters.business_type = selectedBusinessTypes;
      }
      // Assuming price range filter would be min_price and max_price
      if (priceRange[0] > 0) {
        filters.min_price = priceRange[0];
      }
      if (priceRange[1] < 1000000) {
        // Or some other max value
        filters.max_price = priceRange[1];
      }

      const response = await storeService.getProducts(filters);
      if (response.status === "success" && response.data) {
        const mappedProducts: Product[] = response.data.products.map(
          (apiProd: any) => ({
            id: apiProd.product_id || apiProd.id,
            name: apiProd.product_name,
            price: `${apiProd.currency === "INR" ? "₹" : "$"} ${apiProd.price}`,
            unit: "Piece",
            image: apiProd.product_images?.[0] || "",
            images: apiProd.product_images || [],
            description: apiProd.product_description,
            gst: "18%",
            category: apiProd.category_name || "General",
            categoryId: apiProd.product_category_id || selectedCategory || "",
            supplier_id:
              apiProd.supplier_id ||
              apiProd.supplier?.store_id ||
              apiProd.supplier?.id ||
              "",
            specs:
              apiProd.specifications?.reduce((acc: any, spec: any) => {
                acc[spec.name] = spec.value.join(", ");
                return acc;
              }, {}) || {},
            supplier: {
              name: apiProd.supplier?.store_name || "Verified Supplier",
              location:
                apiProd.supplier?.store_address?.city_town ||
                apiProd.product_origin ||
                "Multiple Locations",
              rating: apiProd.supplier?.user_rating || 0,
              reviews: Math.floor(Math.random() * 50) + 10, // Simulated review count since not in API
              yearEstablished:
                parseInt(apiProd.supplier?.establishment_year) || 2024,
              gstVerified: !!apiProd.supplier?.gst_in,
              trustSeal:
                apiProd.supplier?.is_verified ||
                apiProd.supplier?.verification_status === "APPROVED",
              responseRate: "98%",
              businessType: apiProd.supplier?.business_type || "Wholesaler",
              address: apiProd.supplier?.store_address?.address || "India",
              logo: apiProd.supplier?.logo_url,
              mobile: apiProd.supplier?.primary_mobile,
              id: apiProd.supplier?.store_id || apiProd.supplier?.id,
            },
          }),
        );
        setProducts(mappedProducts);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setProductsLoading(false);
    }
  }, [
    selectedCategory,
    selectedSubCategory,
    selectedBrand,
    selectedBusinessTypes,
    priceRange,
  ]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Sync state to URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedSubCategory) params.set("sub_category", selectedSubCategory);
    if (selectedBrand) params.set("brand", selectedBrand);
    if (searchQuery) params.set("search", searchQuery);
    if (selectedBusinessTypes.length > 0)
      params.set("business_types", selectedBusinessTypes.join(","));
    if (priceRange[0] > 0) params.set("min_price", priceRange[0].toString());
    if (priceRange[1] < 1000000)
      params.set("max_price", priceRange[1].toString());

    const queryString = params.toString();
    const url = `/store/products${queryString ? `?${queryString}` : ""}`;
    router.replace(url, { scroll: false });
  }, [
    selectedCategory,
    selectedSubCategory,
    selectedBrand,
    searchQuery,
    selectedBusinessTypes,
    priceRange,
    router,
  ]);

  const handleToggleBusinessType = (type: string) => {
    setSelectedBusinessTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const handleCategoryChange = (id: string | null) => {
    setSelectedCategory(id);
    setSelectedSubCategory(null); // Reset sub-category when main category changes
  };

  const handleSubCategoryChange = (id: string | null) => {
    setSelectedSubCategory(id);
    setSelectedCategory(null); // Reset main category when sub-category changes
  };

  const handleBrandChange = (id: string | null) => {
    setSelectedBrand(id);
  };

  const handlePriceRangeChange = (newValue: [number, number]) => {
    setPriceRange(newValue);
  };

  const filteredProducts = products.filter((product) => {
    return product.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleProductClick = (productId: string) => {
    router.push(`/store/product/${productId}`);
  };

  const handleBackToStore = () => {
    router.push("/store");
  };

  const handleInquiry = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    setAnimatingContact(product.id);
    setTimeout(() => {
      setActiveProduct(product);
      setInquiryOpen(true);
      setAnimatingContact(null);
    }, 600);
  };

  const handleWhatsApp = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    setAnimatingContact(`whatsapp-${product.id}`);
    setTimeout(() => {
      const cleanPhone = `${product.whatsapp_country_code}${product.whatsapp_number}`.replace(/\D/g, ''); 
      const message = `Hi, I found your listing for ${product.name} on KartSquare. I am interested to know more.`;
      const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank");
      setAnimatingContact(null);
    }, 600);
  };

  const toggleFavorite = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  const getCategoryTitle = () => {
    if (selectedSubCategory) {
      return (
        homeData?.categories
          .flatMap((c) => c.sub_categories)
          .find((s) => s.product_sub_category_id === selectedSubCategory)
          ?.sub_category_name || "Products"
      );
    } else if (selectedBrand) {
      return (
        homeData?.brands.find((b) => b.product_brand_id === selectedBrand)
          ?.brand_name || "Products"
      );
    } else if (selectedCategory === "all" || !selectedCategory) {
      return "All Products";
    } else {
      return (
        homeData?.categories.find(
          (c) => c.product_category_id === selectedCategory,
        )?.category_name || "Products"
      );
    }
  };

  const getKeySpecs = (specs: { [key: string]: string }) => {
    const entries = Object.entries(specs);
    return entries.slice(0, 3);
  };

  const getSupplierYears = (yearEstablished: number) => {
    return new Date().getFullYear() - yearEstablished;
  };

  return (
    <Box
      sx={{
        bgcolor: isDark
          ? COLORS.BACKGROUND.PRIMARY_DARK
          : COLORS.BACKGROUND.SECONDARY_LIGHT,
        minHeight: "100vh",
      }}
    >
      {/* Premium Sticky Header */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          bgcolor: isDark
            ? "rgba(10, 10, 10, 0.95)"
            : "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${
            isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)"
          }`,
          boxShadow: isDark
            ? "0 4px 24px rgba(0,0,0,0.4)"
            : "0 4px 24px rgba(0,0,0,0.06)",
        }}
      >
        <Container maxWidth="xl" sx={{ py: 2 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <IconButton
              onClick={handleBackToStore}
              sx={{
                bgcolor: isDark ? "rgba(255,255,255,0.05)" : "#f8f9fa",
                border: `1px solid ${
                  isDark ? "rgba(255,255,255,0.1)" : "#e0e4e8"
                }`,
                borderRadius: 3,
                transition: "all 0.3s",
                "&:hover": {
                  bgcolor: COLORS.PRIMARY_PURPLE,
                  color: "white",
                  transform: "translateX(-4px)",
                },
              }}
            >
              <ArrowBack />
            </IconButton>

            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: COLORS.PRIMARY_PURPLE }} />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: 4,
                    bgcolor: isDark ? "rgba(255,255,255,0.05)" : "#f8f9fc",
                    border: `1px solid ${
                      isDark ? "rgba(255,255,255,0.1)" : "#e0e4e8"
                    }`,
                    transition: "all 0.3s",
                    "&:focus-within": {
                      borderColor: COLORS.PRIMARY_PURPLE,
                      boxShadow: `0 0 0 4px ${COLORS.PRIMARY_PURPLE}15`,
                      bgcolor: isDark ? "rgba(255,255,255,0.08)" : "white",
                    },
                    "& fieldset": { border: "none" },
                  },
                }}
              />
            </Box>

            {/* <IconButton
              onClick={(e) => setSortAnchor(e.currentTarget)}
              sx={{
                bgcolor: isDark ? "rgba(255,255,255,0.05)" : "#f8f9fa",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e0e4e8"
                  }`,
                borderRadius: 3,
              }}
            >
              <Sort />
            </IconButton> */}
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          {/* Sidebar - Hidden on mobile */}
          <Grid
            size={{ xs: 12, md: 3.5, lg: 3 }}
            sx={{ display: { xs: "none", md: "block" } }}
          >
            <CategorySidebar
              selectedCategory={selectedCategory}
              onSelectCategory={handleCategoryChange}
              selectedSubCategory={selectedSubCategory}
              onSelectSubCategory={handleSubCategoryChange}
              categories={homeData?.categories}
              searchQuery={searchQuery}
              selectedBusinessTypes={selectedBusinessTypes}
              onToggleBusinessType={handleToggleBusinessType}
              priceRange={priceRange}
              onPriceRangeChange={handlePriceRangeChange}
            />
          </Grid>

          {/* Main Products Grid */}
          <Grid size={{ xs: 12, md: 8.5, lg: 9 }}>
            {/* Header */}
            <Box
              sx={{
                mb: 4,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography
                  variant="h4"
                  fontWeight={800}
                  sx={{
                    color: isDark ? "text.primary" : "#1a1a2e",
                    mb: 0.5,
                  }}
                >
                  {getCategoryTitle()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {productsLoading
                    ? "Loading products..."
                    : `${filteredProducts.length} products available`}
                </Typography>
              </Box>
            </Box>

            {/* Products Grid */}
            {productsLoading ? (
              <Grid container spacing={2}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={n}>
                    <Card
                      elevation={0}
                      sx={{
                        borderRadius: "16px",
                        overflow: "hidden",
                        border: `1px solid ${
                          isDark ? "rgba(255,255,255,0.08)" : "#e0e4e8"
                        }`,
                      }}
                    >
                      <Box
                        sx={{
                          width: "100%",
                          height: 200,
                          background: `linear-gradient(90deg, ${
                            isDark ? "rgba(255,255,255,0.03)" : "#f0f0f0"
                          } 0%, ${
                            isDark ? "rgba(255,255,255,0.08)" : "#e0e0e0"
                          } 50%, ${
                            isDark ? "rgba(255,255,255,0.03)" : "#f0f0f0"
                          } 100%)`,
                          backgroundSize: "1000px 100%",
                          animation: `${shimmer} 2s infinite`,
                        }}
                      />
                      <Box sx={{ p: 2 }}>
                        <Box
                          sx={{
                            height: 16,
                            width: "80%",
                            bgcolor: isDark
                              ? "rgba(255,255,255,0.05)"
                              : "#f0f0f0",
                            borderRadius: 1,
                            mb: 1,
                          }}
                        />
                        <Box
                          sx={{
                            height: 20,
                            width: "40%",
                            bgcolor: isDark
                              ? "rgba(255,255,255,0.08)"
                              : "#e0e0e0",
                            borderRadius: 1,
                            mb: 2,
                          }}
                        />
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : filteredProducts.length > 0 ? (
              <Grid container spacing={2}>
                {filteredProducts.map((product, index) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product.id}>
                    <ProductCard
                      product={product}
                      index={index}
                      isFavorite={favorites.has(product.id)}
                      onToggleFavorite={toggleFavorite}
                      onProductClick={handleProductClick}
                      onInquiry={handleInquiry}
                      onWhatsApp={handleWhatsApp}
                    />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box
                sx={{
                  textAlign: "center",
                  py: 12,
                  px: 3,
                }}
              >
                <Typography
                  variant="h5"
                  color="text.secondary"
                  fontWeight={700}
                  sx={{ mb: 2 }}
                >
                  No products found
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  Try adjusting your filters or search terms
                </Typography>
                <CommonButton
                  variant="outlined"
                  onClick={handleBackToStore}
                  startIcon={<ArrowBack />}
                >
                  Back to Store
                </CommonButton>
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>

      {/* Sort Menu */}
      <Menu
        anchorEl={sortAnchor}
        open={Boolean(sortAnchor)}
        onClose={() => setSortAnchor(null)}
        TransitionComponent={Fade}
      >
        <MenuItem onClick={() => setSortAnchor(null)}>
          Price: Low to High
        </MenuItem>
        <MenuItem onClick={() => setSortAnchor(null)}>
          Price: High to Low
        </MenuItem>
        <MenuItem onClick={() => setSortAnchor(null)}>Newest First</MenuItem>
        <MenuItem onClick={() => setSortAnchor(null)}>Most Popular</MenuItem>
      </Menu>

      {/* Inquiry Modal */}
      <InquiryModal
        open={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        productName={activeProduct?.name}
        supplierName={activeProduct?.supplier.name}
        productImage={activeProduct?.image}
        productPrice={activeProduct?.price}
        supplierId={activeProduct?.supplier_id}
        productId={activeProduct?.id}
      />
    </Box>
  );
};

export default ProductsListingView;
