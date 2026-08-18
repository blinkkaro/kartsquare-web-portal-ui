"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  CircularProgress,
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  InputAdornment,
  Divider,
  Chip,
  useTheme,
  Paper,
  Stack,
  Rating,
  IconButton,
} from "@mui/material";
import {
  Search,
  Star,
  Verified,
  LocationOn,
  Call,
  WhatsApp,
  Business,
  CheckCircle,
  MoreVert,
  ArrowForward,
  KeyboardArrowRight,
  ArrowBack,
  Inventory,
  Engineering,
  Handyman,
  ElectricBolt,
  ThumbsUpDown,
  Circle,
  FormatQuote,
  TrendingUp,
  Public,
  Store,
  LocalShipping,
  Message,
} from "@mui/icons-material";
import { useRouter, useSearchParams } from "next/navigation";
import { COLORS } from "@/constants/colors";
import CategorySidebar from "./CategorySidebar";
import InquiryModal from "./InquiryModal";
import ProductDetails from "./ProductDetails";
import {
  Category,
  Brand,
  storeService,
  StoreHomeData,
  ApiProduct,
} from "@/services/store/store.service";
import CommonButton from "@/components/common/Button";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { useSearchSuggestions, Product } from "@/hooks/useSearchSuggestions";
import SearchSuggestions from "./SearchSuggestions";
import { useGetAllBrands } from "@/hooks/useProducts";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

const StoreView: React.FC = () => {
  const theme = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDark = theme.palette.mode === "dark";
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);
  const [homeData, setHomeData] = useState<StoreHomeData | null>(null);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [showAllBrands, setShowAllBrands] = useState(false);
  const {
    data: brandsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: brandsLoading,
  } = useGetAllBrands("", 15); // Use a fixed limit for stability
  
  const allBrands = brandsData?.pages.flatMap((page: any) => {
    if (Array.isArray(page)) return page;
    return page?.brands || [];
  }).filter(Boolean) || [];
  
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastBrandElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (brandsLoading || isFetchingNextPage) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [brandsLoading, isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  // Use TanStack Query based search suggestions hook
  const { categories, products, isSearching, isEmpty } = useSearchSuggestions(
    searchQuery,
    homeData,
  );

  // Handle click away to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Inquiry State
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  // Fetch Home Data
  React.useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const response = await storeService.getStoreHome();
        if (response.status === "success" && response.data) {
          setHomeData(response.data);
        }
      } catch (error) {
        console.error("Error fetching store home data:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchFeaturedProducts = async () => {
      try {
        setProductsLoading(true);
        const response = await storeService.getProducts({ limit: 8 });
        // Corrected path for products in the response
        const products =
          response.data?.products ||
          (Array.isArray(response.data) ? response.data : []);

        let mapped: Product[] = [];

        if (products && products.length > 0) {
          const mapped: Product[] = products.map((p: any) => ({
            id: p.product_id,
            name: p.product_name,
            price: `${p.currency === "INR" ? "₹" : "$"} ${p.price}`,
            unit: "Piece",
            image: p.product_images?.[0] || "",
            images: p.product_images || [],
            description: p.product_description,
            gst: "18%",
            category: "General",
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
          setFeaturedProducts(mapped);
        }
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchHomeData();
    fetchFeaturedProducts();
  }, []);

  const bannerSlides = [
    {
      title: "Premium Industrial Machinery",
      subtitle: "High performance equipment for your manufacturing needs.",
      tag: "EQUIPMENT EXCELLENCE",
      image:
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1470&auto=format&fit=crop",
      buttonText: "Explore Machinery",
    },
    {
      title: "Global Logistics & Supplies",
      subtitle: "Smart inventory solutions for efficient warehousing.",
      tag: "WAREHOUSING PRO",
      image:
        "https://images.unsplash.com/photo-1586528116311-ad86d7c7ce80?q=80&w=1470&auto=format&fit=crop",
      buttonText: "Browse Supplies",
    },
    {
      title: "Advanced Electronics & Tech",
      subtitle: "Cutting-edge components for your next technical project.",
      tag: "TECH INNOVATION",
      image:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1470&auto=format&fit=crop",
      buttonText: "Check Tech",
    },
  ];

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/store/products?category=${categoryId}`);
  };

  const handleSubCategoryClick = (subCategoryId: string) => {
    router.push(`/store/products?sub_category=${subCategoryId}`);
  };

  const handleBrandClick = (brandId: string) => {
    router.push(`/store/products?brand=${brandId}`);
  };

  const handleProductClick = (productId: string) => {
    router.push(`/store/product/${productId}`);
  };

  return (
    <Box
      sx={{
        bgcolor: isDark
          ? COLORS.BACKGROUND.PRIMARY_DARK
          : COLORS.BACKGROUND.SECONDARY_LIGHT,
        minHeight: "100vh",
        pb: 8,
      }}
    >
      <Container maxWidth="xl" sx={{ pt: 4 }}>
        {/* Banner Section - Myntra style Carousel */}
        <Box
          sx={{
            mb: { xs: 4, md: 8 },
            borderRadius: "32px",
            overflow: "hidden",
            position: "relative",
            "& .swiper-pagination-bullet": {
              backgroundColor: "rgba(255, 255, 255, 0.5)",
              opacity: 1,
              width: "8px",
              height: "8px",
            },
            "& .swiper-pagination-bullet-active": {
              backgroundColor: "white",
              width: "24px",
              borderRadius: "4px",
              transition: "all 0.3s ease",
            },
          }}
        >
          <Swiper
            modules={[Autoplay, Pagination]}
            slidesPerView={1}
            loop
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            pagination={{ clickable: true }}
            style={{ borderRadius: "32px" }}
          >
            {bannerSlides.map((slide, index) => (
              <SwiperSlide key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    height: { xs: 220, md: 320 },
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    background: `#000`,
                    overflow: "hidden",
                  }}
                >
                  {/* Background Image with Overlay */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundImage: `url(${slide.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background:
                          "linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)",
                      },
                    }}
                  />

                  <Box
                    sx={{
                      p: { xs: 3, md: 6 },
                      color: "white",
                      maxWidth: 700,
                      position: "relative",
                      zIndex: 10,
                    }}
                  >
                    <Typography
                      variant="overline"
                      sx={{
                        letterSpacing: 3,
                        fontWeight: 900,
                        opacity: 0.95,
                        backgroundColor: `${COLORS.PRIMARY_PURPLE}dd`,
                        px: 2,
                        py: 0.8,
                        borderRadius: "100px",
                        fontSize: { xs: "0.6rem", md: "0.75rem" },
                      }}
                    >
                      {slide.tag}
                    </Typography>
                    <Typography
                      variant="h2"
                      fontWeight={900}
                      sx={{
                        mt: 2,
                        mb: 1,
                        lineHeight: 1.1,
                        letterSpacing: -1,
                        textShadow: "0 2px 10px rgba(0,0,0,0.3)",
                      }}
                    >
                      {slide.title}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 3,
                        opacity: 0.9,
                        fontWeight: 500,
                        maxWidth: 500,
                      }}
                    >
                      {slide.subtitle}
                    </Typography>
                    <CommonButton
                      variant="contained"
                      sx={{
                        bgcolor: "white",
                        color: COLORS.PRIMARY_PURPLE,
                        "&:hover": {
                          bgcolor: "#f5f5f5",
                          transform: "scale(1.02)",
                        },
                        px: { xs: 4, md: 6 },
                        py: { xs: 1, sm: 1.5 },
                        fontWeight: 800,
                        borderRadius: "14px",
                        transition: "all 0.3s ease",
                        boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
                      }}
                    >
                      {slide.buttonText}
                    </CommonButton>
                  </Box>
                </Paper>
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>

        {/* Search Header - Refined */}
        <Box sx={{ mb: { xs: 6, md: 10 }, textAlign: "center" }}>
          <Typography
            variant="h4"
            component="h1"
            fontWeight={900}
            sx={{
              mb: 2,
              color: isDark ? "text.primary" : "#0f172a",
              letterSpacing: -1,
            }}
          >
            Search Across{" "}
            <span style={{ color: COLORS.PRIMARY_PURPLE }}>Global Markets</span>
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            fontWeight={500}
            sx={{ mb: 5, opacity: 0.7, maxWidth: 600, mx: "auto" }}
          >
            Connect with trusted sellers for raw materials, machinery, and
            finished goods instantly.
          </Typography>

          <Box
            ref={searchRef}
            sx={{
              maxWidth: 850,
              mx: "auto",
              px: 2,
              position: "relative",
            }}
          >
            <TextField
              fullWidth
              placeholder="What would you like to source today?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search
                      sx={{ color: COLORS.PRIMARY_PURPLE, fontSize: 32, ml: 1 }}
                    />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: "24px",
                  bgcolor: isDark ? "rgba(255, 255, 255, 0.04)" : "white",
                  p: 1.5,
                  fontSize: { xs: "1rem", md: "1.25rem" },
                  fontWeight: 500,
                  boxShadow: isDark
                    ? "0 10px 40px rgba(0,0,0,0.3)"
                    : "0 20px 60px rgba(15, 23, 42, 0.08)",
                  border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "#e2e8f0"}`,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: COLORS.PRIMARY_PURPLE,
                  },
                  "&:focus-within": {
                    borderColor: COLORS.PRIMARY_PURPLE,
                    boxShadow: `0 20px 60px ${COLORS.PRIMARY_PURPLE}20`,
                  },
                },
              }}
              onFocus={() => {
                setShowSuggestions(true);
              }}
            />

            {/* Suggestions Dropdown */}
            {showSuggestions && searchQuery.trim() !== "" && (
              <SearchSuggestions
                isSearching={isSearching}
                categories={categories}
                products={products}
                searchQuery={searchQuery}
                onCategoryClick={(id) => {
                  handleCategoryClick(id);
                  setShowSuggestions(false);
                }}
                onProductClick={(id) => {
                  handleProductClick(id);
                  setShowSuggestions(false);
                }}
              />
            )}
          </Box>
        </Box>

        {/* Top Categories Static Section */}
        <Box sx={{ mb: { xs: 6, md: 10 } }}>
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h5"
              fontWeight={800}
              sx={{
                color: isDark ? "text.primary" : "#30263E",
                letterSpacing: -0.5,
              }}
            >
              Top Industry Categories
            </Typography>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              Explore the most active business sectors
            </Typography>
          </Box>
          <Grid container spacing={{ xs: 1.5, sm: 2 }}>
            {(homeData?.categories || []).slice(0, 5).map((cat) => (
              <Grid
                size={{ xs: 6, sm: 6, md: 4, lg: 2.4 }}
                key={cat.product_category_id}
              >
                <Paper
                  elevation={0}
                  onClick={() =>
                    router.push(
                      `/store/products?category=${cat.product_category_id}`,
                    )
                  }
                  sx={{
                    p: 3,
                    borderRadius: 5,
                    bgcolor: isDark ? "rgba(255,255,255,0.02)" : "white",
                    border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "#f0f2f5"}`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      transform: "translateY(-10px)",
                      boxShadow: `0 20px 40px rgba(94, 24, 233, 0.1)`,
                      borderColor: COLORS.PRIMARY_PURPLE,
                      "& .cat-img-box": {
                        transform: "scale(1.1)",
                      },
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 70,
                      height: 70,
                      borderRadius: 4,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: isDark ? "rgba(255,255,255,0.03)" : "#f8f9fc",
                      mb: 2,
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      component="img"
                      className="cat-img-box"
                      src={cat.category_image}
                      alt={cat.category_name}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.3s ease",
                      }}
                    />
                  </Box>
                  <Typography
                    variant="subtitle1"
                    fontWeight={800}
                    sx={{
                      mb: 0.5,
                      display: "-webkit-box",
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {cat.category_name}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary", fontWeight: 600 }}
                  >
                    {cat.sub_categories?.length || 0} Departments
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Top Products Section */}
        <Box
          sx={{
            mb: { xs: 8, md: 12 },
            bgcolor: isDark
              ? "rgba(94, 24, 233, 0.15)"
              : "rgba(94, 24, 233, 0.07)",
            p: { xs: 2, md: 8 },
            borderRadius: { xs: 4, md: 8 },
            border: `1px solid ${isDark ? "rgba(94, 24, 233, 0.25)" : "rgba(94, 24, 233, 0.12)"}`,
            boxShadow: isDark ? "none" : "0 25px 90px rgba(94, 24, 233, 0.08)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "flex-end" },
              gap: { xs: 2, sm: 0 },
              mb: 4,
            }}
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight={800}
                sx={{
                  color: isDark ? "text.primary" : "#30263E",
                  letterSpacing: -0.5,
                }}
              >
                Handpicked Products
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={500}
              >
                Quality items from our most trusted partners
              </Typography>
            </Box>
            <CommonButton
              variant="outlined"
              endIcon={<ArrowForward />}
              sx={{ borderRadius: 2, fontWeight: 700 }}
              onClick={() => router.push("/store/products")}
            >
              View All Products
            </CommonButton>
          </Box>
          <Grid container spacing={{ xs: 1.5, sm: 3 }}>
            {productsLoading
              ? [1, 2, 3, 4].map((n) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={n}>
                    <Box
                      sx={{
                        height: 350,
                        bgcolor: "rgba(0,0,0,0.05)",
                        borderRadius: 5,
                      }}
                    />
                  </Grid>
                ))
              : featuredProducts.map((product) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product.id}>
                    <Card
                      elevation={0}
                      onClick={() => handleProductClick(product.id)}
                      sx={{
                        borderRadius: 5,
                        border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "#f0f2f5"}`,
                        bgcolor: isDark ? "rgba(255, 255, 255, 0.02)" : "white",
                        transition: "all 0.3s",
                        cursor: "pointer",
                        "&:hover": {
                          transform: "translateY(-8px)",
                          boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
                          borderColor: COLORS.PRIMARY_PURPLE,
                        },
                      }}
                    >
                      <Box sx={{ height: 220, overflow: "hidden", p: 2 }}>
                        <Box
                          component="img"
                          src={product.image}
                          alt={product.name}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: 4,
                          }}
                        />
                      </Box>
                      <CardContent sx={{ pt: 1, px: 3, pb: 3 }}>
                        <Typography
                          variant="caption"
                          sx={{
                            color: COLORS.PRIMARY_PURPLE,
                            fontWeight: 800,
                            textTransform: "uppercase",
                            letterSpacing: 1,
                          }}
                        >
                          {product.supplier.businessType}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          fontWeight={800}
                          noWrap
                          sx={{ mt: 0.5, mb: 1 }}
                        >
                          {product.name}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography
                            variant="h6"
                            fontWeight={900}
                            color={
                              isDark
                                ? COLORS.ACCENT_BLUE_DARK
                                : COLORS.PRIMARY_PURPLE
                            }
                          >
                            {product.price}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                              bgcolor: "rgba(5, 150, 105, 0.08)",
                              px: 1,
                              py: 0.3,
                              borderRadius: 1,
                            }}
                          >
                            <Verified sx={{ fontSize: 14, color: "#059669" }} />
                            <Typography
                              variant="caption"
                              sx={{ color: "#059669", fontWeight: 800 }}
                            >
                              Trusted
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
          </Grid>
        </Box>

        {/* Categories Grid Section */}
        <Box sx={{ mb: { xs: 6, md: 10 } }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "flex-end" },
              gap: { xs: 2, sm: 0 },
              mb: 4,
            }}
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight={800}
                sx={{
                  color: isDark ? "text.primary" : "#30263E",
                  letterSpacing: -0.5,
                }}
              >
                All Categories
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={500}
              >
                Browse our complete inventory by department
              </Typography>
            </Box>
            {/* <CommonButton
              variant="text"
              endIcon={<ArrowForward />}
              sx={{ fontWeight: 700 }}
            >
              Browse Everything
            </CommonButton> */}
          </Box>

          <Grid container spacing={{ xs: 1.5, sm: 3 }}>
            {loading
              ? // Simple skeleton loader
                [1, 2, 3, 4].map((n) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={n}>
                    <Box
                      sx={{
                        height: 300,
                        bgcolor: "rgba(0,0,0,0.05)",
                        borderRadius: 3,
                      }}
                    />
                  </Grid>
                ))
              : homeData?.categories.map((cat) => (
                  <Grid
                    size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                    key={cat.product_category_id}
                  >
                    <Card
                      elevation={0}
                      sx={{
                        height: "100%",
                        borderRadius: 4,
                        border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "#eef2f6"}`,
                        bgcolor: isDark ? "rgba(255, 255, 255, 0.03)" : "white",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        cursor: "pointer",
                        overflow: "hidden",
                        "&:hover": {
                          transform: "translateY(-10px)",
                          boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                          borderColor: COLORS.PRIMARY_PURPLE,
                          "& .cat-image": {
                            transform: "scale(1.1)",
                          },
                          "& .arrow-icon": {
                            transform: "translateX(5px)",
                            color: COLORS.PRIMARY_PURPLE,
                          },
                        },
                      }}
                      onClick={() =>
                        handleCategoryClick(cat.product_category_id)
                      }
                    >
                      <Box
                        sx={{
                          height: 200,
                          p: 3,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor: isDark
                            ? "rgba(255, 255, 255, 0.02)"
                            : "#f8f9fa",
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src={cat.category_image}
                          alt={cat.category_name}
                          className="cat-image"
                          style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contain",
                            transition: "transform 0.5s ease",
                          }}
                        />
                      </Box>
                      <CardContent sx={{ p: 3 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            mb: 1,
                          }}
                        >
                          <Typography
                            variant="h6"
                            fontWeight={700}
                            sx={{
                              flex: 1,
                              pr: 1,
                              color: isDark ? "text.primary" : "#1a1a2e",
                            }}
                          >
                            {cat.category_name}
                          </Typography>
                          <KeyboardArrowRight
                            className="arrow-icon"
                            sx={{
                              color: "text.disabled",
                              transition: "all 0.3s",
                            }}
                          />
                        </Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mb: 2,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            minHeight: 40,
                          }}
                        >
                          {cat.category_des}
                        </Typography>
                        <Stack direction="row" flexWrap="wrap" gap={0.5}>
                          {cat.sub_categories.slice(0, 2).map((sub) => (
                            <Chip
                              key={sub.product_sub_category_id}
                              label={sub.sub_category_name}
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSubCategoryClick(
                                  sub.product_sub_category_id,
                                );
                              }}
                              sx={{
                                height: 24,
                                fontSize: "0.7rem",
                                bgcolor: isDark
                                  ? "rgba(255,255,255,0.05)"
                                  : "rgba(0,0,0,0.03)",
                                fontWeight: 500,
                                "&:hover": {
                                  bgcolor: COLORS.PRIMARY_PURPLE,
                                  color: "white",
                                },
                              }}
                            />
                          ))}
                          {cat.sub_categories.length > 2 && (
                            <Typography
                              variant="caption"
                              sx={{
                                mt: 0.5,
                                color: COLORS.PRIMARY_PURPLE,
                                fontWeight: 600,
                              }}
                            >
                              +{cat.sub_categories.length - 2} more
                            </Typography>
                          )}
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
          </Grid>
        </Box>

        {/* Recent Activity & Reviews Section - Premium UI Refresh */}
        <Grid container spacing={{ xs: 4, md: 6 }} sx={{ mt: { xs: 8, md: 15 }, mb: { xs: 6, md: 10 } }}>
          {/* Recent Activity */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 5 }}>
              <Box
                sx={{
                  bgcolor: COLORS.PURPLE_ALPHA_10,
                  p: 1.5,
                  borderRadius: "16px",
                  color: COLORS.PRIMARY_PURPLE,
                  boxShadow: `0 8px 20px ${COLORS.PURPLE_ALPHA_20}`,
                }}
              >
                <TrendingUp />
              </Box>
              <Box>
                <Typography
                  variant="h5"
                  fontWeight={900}
                  sx={{
                    color: isDark ? "text.primary" : "#1e293b",
                    letterSpacing: -0.5,
                  }}
                >
                  Live Business Activity
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight={500}
                >
                  Real-time updates from our marketplace
                </Typography>
              </Box>
            </Box>

            <Box sx={{ position: "relative", pl: 1 }}>
              {/* Timeline Connector Line */}
              <Box
                sx={{
                  position: "absolute",
                  left: 20,
                  top: 0,
                  bottom: 0,
                  width: 2,
                  bgcolor: isDark ? "rgba(255,255,255,0.05)" : "#f1f5f9",
                  borderRadius: 1,
                }}
              />

              <Stack spacing={{ xs: 2.5, md: 4 }}>
                {[
                  {
                    text: "Rahul from Delhi",
                    sub: "Inquired about Industrial Centrifugal Pump",
                    time: "2 mins ago",
                    type: "inquiry",
                    icon: <Message sx={{ fontSize: 16 }} />,
                    color: "#059669",
                  },
                  {
                    text: "New Catalog Update",
                    sub: "Brand 'Tata Steel' added 50+ new products",
                    time: "1 hour ago",
                    type: "update",
                    icon: <Store sx={{ fontSize: 16 }} />,
                    color: COLORS.PRIMARY_PURPLE,
                  },
                  {
                    text: "Logistics Update",
                    sub: "Global Logistics Pro joined as a Premier Supplier",
                    time: "3 hours ago",
                    type: "join",
                    icon: <LocalShipping sx={{ fontSize: 16 }} />,
                    color: "#0284c7",
                  },
                  {
                    text: "International Trade",
                    sub: "Export inquiry received for Solar Panels from Dubai",
                    time: "5 hours ago",
                    type: "export",
                    icon: <Public sx={{ fontSize: 16 }} />,
                    color: "#ea580c",
                  },
                ].map((activity, i) => (
                  <Box
                    key={i}
                    sx={{
                      display: "flex",
                      gap: { xs: 2, sm: 3 },
                      position: "relative",
                      transition: "all 0.3s",
                      "&:hover": { transform: "translateX(8px)" },
                    }}
                  >
                    {/* Activity Icon Circle */}
                    <Box
                      sx={{
                        width: 42,
                        height: 42,
                        borderRadius: "50%",
                        bgcolor: isDark ? "rgba(0,0,0,0.3)" : "white",
                        border: `2px solid ${activity.color}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: activity.color,
                        zIndex: 2,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                      }}
                    >
                      {activity.icon}
                    </Box>

                    <Box
                      sx={{
                        flex: 1,
                        p: { xs: 2, sm: 2.5 },
                        borderRadius: "20px",
                        bgcolor: isDark ? "rgba(255,255,255,0.02)" : "white",
                        border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "#f1f5f9"}`,
                        boxShadow: isDark
                          ? "none"
                          : "0 10px 30px rgba(0,0,0,0.02)",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 0.5,
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          fontWeight={800}
                          sx={{ color: isDark ? "text.primary" : "#1e293b" }}
                        >
                          {activity.text}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: "text.secondary", fontWeight: 600 }}
                        >
                          {activity.time}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.secondary",
                          fontWeight: 500,
                          lineHeight: 1.5,
                        }}
                      >
                        {activity.sub}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Grid>

          {/* Customer Reviews */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 5 }}>
              <Box
                sx={{
                  bgcolor: COLORS.PURPLE_ALPHA_10,
                  p: 1.5,
                  borderRadius: "16px",
                  color: COLORS.PRIMARY_PURPLE,
                  boxShadow: `0 8px 20px ${COLORS.PURPLE_ALPHA_20}`,
                }}
              >
                <ThumbsUpDown />
              </Box>
              <Box>
                <Typography
                  variant="h5"
                  fontWeight={900}
                  sx={{
                    color: isDark ? "text.primary" : "#1e293b",
                    letterSpacing: -0.5,
                  }}
                >
                  Success Stories
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight={500}
                >
                  What our global partners say about us
                </Typography>
              </Box>
            </Box>

            <Stack spacing={{ xs: 2.5, md: 4 }}>
              {[
                {
                  name: "Amit Sharma",
                  role: "Factory Owner, Jaipur",
                  text: "Amazing platform for bulk sourcing. Found reliable suppliers for my factory in less than a day. The verification process is top-notch and builds real trust.",
                  rating: 5,
                  initial: "AS",
                },
                {
                  name: "Priya Patel",
                  role: "Procurement Head, Jaipur",
                  text: "The verified supplier badge gives a lot of confidence for high-value orders. Highly recommended for those looking for quality machinery.",
                  rating: 5,
                  initial: "PP",
                },
                {
                  name: "Vikram Singh",
                  role: "Business Consultant, Jaipur",
                  text: "Quick response from the inquiry team. The interface is very intuitive and much better than other platforms I've used previously for my clients.",
                  rating: 4.5,
                  initial: "VS",
                },
              ].map((review, i) => (
                <Card
                  key={i}
                  elevation={0}
                  sx={{
                    p: { xs: 2.5, sm: 4 },
                    borderRadius: "24px",
                    bgcolor: isDark ? "rgba(255,255,255,0.03)" : "#ffffff",
                    border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#f1f5f9"}`,
                    boxShadow: isDark ? "none" : "0 20px 50px rgba(0,0,0,0.03)",
                    position: "relative",
                    overflow: "visible",
                  }}
                >
                  {/* Decorative Quote Icon */}
                  <FormatQuote
                    sx={{
                      position: "absolute",
                      top: -15,
                      right: 30,
                      fontSize: 50,
                      color: COLORS.PURPLE_ALPHA_20,
                      transform: "rotate(180deg)",
                    }}
                  />

                  <Box sx={{ display: "flex", gap: 2.5, mb: 3 }}>
                    <Box
                      sx={{
                        width: 54,
                        height: 54,
                        borderRadius: "16px",
                        background: `linear-gradient(135deg, ${COLORS.PRIMARY_PURPLE} 0%, #a855f7 100%)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: 800,
                        boxShadow: "0 8px 16px rgba(94, 24, 233, 0.2)",
                      }}
                    >
                      {review.initial}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          fontWeight={900}
                          sx={{ color: isDark ? "text.primary" : "#1e293b" }}
                        >
                          {review.name}
                        </Typography>
                        <Rating
                          value={review.rating}
                          precision={0.5}
                          readOnly
                          size="small"
                        />
                      </Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight={700}
                        sx={{ letterSpacing: 0.5, textTransform: "uppercase" }}
                      >
                        {review.role}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography
                    variant="body1"
                    sx={{
                      color: isDark ? "text.secondary" : "#64748b",
                      lineHeight: 1.8,
                      fontWeight: 500,
                      fontStyle: "italic",
                      position: "relative",
                    }}
                  >
                    "{review.text}"
                  </Typography>
                </Card>
              ))}
            </Stack>
          </Grid>
        </Grid>

        {/* Brands Section - Restored */}
        {!brandsLoading && allBrands.length > 0 && (
          <Box sx={{ mt: { xs: 8, md: 15 }, mb: { xs: 6, md: 10 } }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "flex-end" },
                gap: { xs: 2, sm: 0 },
                mb: 4,
              }}
            >
              <Typography
                variant="h5"
                fontWeight={800}
                sx={{ color: isDark ? "text.primary" : "#30263E", letterSpacing: -0.5 }}
              >
                Top Brands in Store
              </Typography>
              <CommonButton
                variant="outlined"
                endIcon={showAllBrands ? undefined : <ArrowForward />}
                sx={{ borderRadius: 2, fontWeight: 700 }}
                onClick={() => setShowAllBrands(!showAllBrands)}
              >
                {showAllBrands ? "Show Less" : "See All"}
              </CommonButton>
            </Box>
            <Grid container spacing={3}>
              {(showAllBrands ? allBrands : allBrands.slice(0, 5)).map((brand, index) => {
                const isLast = index === allBrands.length - 1;
                return (
                  <Grid
                    size={{ xs: 6, sm: 4, md: 2.4, lg: 2.4 }}
                    key={`${brand.product_brand_id}-${index}`}
                    ref={showAllBrands && isLast ? lastBrandElementRef : null}
                  >
                    <Paper
                    elevation={0}
                    onClick={() => handleBrandClick(brand.product_brand_id)}
                    sx={{
                      p: 4,
                      height: 160,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 4,
                      border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "#eef2f6"}`,
                      transition: "all 0.3s",
                      cursor: "pointer",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                        borderColor: COLORS.PRIMARY_PURPLE,
                        bgcolor: isDark
                          ? "rgba(255, 255, 255, 0.05)"
                          : "rgba(94, 24, 233, 0.02)",
                      },
                    }}
                  >
                    <img
                      src={brand.brand_image}
                      alt={brand.brand_name}
                      style={{
                        width: "100%",
                        height: 80,
                        objectFit: "contain",
                        marginBottom: 16,
                      }}
                    />
                    <Typography variant="subtitle2" fontWeight={700}>
                      {brand.brand_name}
                    </Typography>
                  </Paper>
                </Grid>
                );
              })}
              {isFetchingNextPage && (
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 6, gap: 2 }}>
                    <CircularProgress size={48} sx={{ color: isDark ? 'primary.main' : COLORS.PRIMARY_PURPLE }} />
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      Loading more brands...
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default StoreView;
