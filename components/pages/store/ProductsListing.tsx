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

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get("category")
  );
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(
    searchParams.get("sub_category")
  );
  const [selectedBrand, setSelectedBrand] = useState<string | null>(
    searchParams.get("brand")
  );
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

  // Fetch Home Data
  useEffect(() => {
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

      const response = await storeService.getProducts(filters);
      if (response.status === "success" && response.data) {
        const mappedProducts: Product[] = response.data.products.map(
          (apiProd) => ({
            id: apiProd.product_id,
            name: apiProd.product_name,
            price: `${apiProd.currency === "INR" ? "₹" : "$"} ${apiProd.price}`,
            unit: "Piece",
            image: apiProd.product_images?.[0] || "",
            images: apiProd.product_images || [],
            description: apiProd.product_description,
            gst: "18%",
            category: "General",
            categoryId: selectedCategory || "",
            specs:
              apiProd.specifications?.reduce((acc: any, spec) => {
                acc[spec.name] = spec.value.join(", ");
                return acc;
              }, {}) || {},
            supplier: {
              name: "Premium Supplier",
              location: apiProd.product_origin || "Multiple Locations",
              rating: 4.5,
              reviews: 120,
              yearEstablished: 2015,
              gstVerified: true,
              trustSeal: true,
              responseRate: "95%",
              businessType: "Manufacturer",
              address: "Industrial Area, Phase 1, India",
            },
          })
        );
        setProducts(mappedProducts);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setProductsLoading(false);
    }
  }, [selectedCategory, selectedSubCategory, selectedBrand]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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
      const message = `Hi, I found your listing for ${product.name} on KartSquare. I am interested to know more.`;
      const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(
        message
      )}`;
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
          (c) => c.product_category_id === selectedCategory
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
          bgcolor: isDark ? "rgba(10, 10, 10, 0.95)" : "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)"
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
                border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e0e4e8"
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
                    border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e0e4e8"
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

            <IconButton
              onClick={(e) => setSortAnchor(e.currentTarget)}
              sx={{
                bgcolor: isDark ? "rgba(255,255,255,0.05)" : "#f8f9fa",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e0e4e8"
                  }`,
                borderRadius: 3,
              }}
            >
              <Sort />
            </IconButton>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          {/* Sidebar - Hidden on mobile */}
          <Grid size={{ xs: 12, md: 3, lg: 2.5 }} sx={{ display: { xs: "none", md: "block" } }}>
            <CategorySidebar
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              categories={homeData?.categories}
              searchQuery={searchQuery}
            />
          </Grid>

          {/* Main Products Grid */}
          <Grid size={{ xs: 12, md: 9, lg: 9.5 }}>
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
              <Grid container spacing={3}>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }} key={n}>
                    <Card
                      elevation={0}
                      sx={{
                        borderRadius: 4,
                        overflow: "hidden",
                        border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#e0e4e8"
                          }`,
                      }}
                    >
                      <Box
                        sx={{
                          width: "100%",
                          height: 300,
                          background: `linear-gradient(90deg, ${isDark ? "rgba(255,255,255,0.03)" : "#f0f0f0"
                            } 0%, ${isDark ? "rgba(255,255,255,0.08)" : "#e0e0e0"
                            } 50%, ${isDark ? "rgba(255,255,255,0.03)" : "#f0f0f0"
                            } 100%)`,
                          backgroundSize: "1000px 100%",
                          animation: `${shimmer} 2s infinite`,
                        }}
                      />
                      <Box sx={{ p: 2 }}>
                        <Box
                          sx={{
                            height: 20,
                            width: "80%",
                            bgcolor: isDark ? "rgba(255,255,255,0.05)" : "#f0f0f0",
                            borderRadius: 1,
                            mb: 1,
                          }}
                        />
                        <Box
                          sx={{
                            height: 24,
                            width: "40%",
                            bgcolor: isDark ? "rgba(255,255,255,0.08)" : "#e0e0e0",
                            borderRadius: 1,
                            mb: 2,
                          }}
                        />
                        <Box
                          sx={{
                            height: 40,
                            width: "100%",
                            bgcolor: isDark ? "rgba(255,255,255,0.03)" : "#f5f5f5",
                            borderRadius: 2,
                          }}
                        />
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : filteredProducts.length > 0 ? (
              <Grid container spacing={3}>
                {filteredProducts.map((product, index) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }} key={product.id}>
                    <Zoom in={true} style={{ transitionDelay: `${index * 50}ms` }}>
                      <Card
                        elevation={0}
                        onMouseEnter={() => setHoveredProduct(product.id)}
                        onMouseLeave={() => setHoveredProduct(null)}
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          borderRadius: 3,
                          border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#e0e4e8"
                            }`,
                          bgcolor: isDark ? "rgba(255,255,255,0.02)" : "white",
                          cursor: "pointer",
                          position: "relative",
                          overflow: "hidden",
                          boxShadow: isDark 
                            ? "0 2px 8px rgba(0,0,0,0.3)" 
                            : "0 1px 3px rgba(0,0,0,0.05)",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: isDark
                              ? "0 12px 24px rgba(94, 24, 233, 0.25), 0 0 0 1px rgba(94, 24, 233, 0.4)"
                              : "0 8px 24px rgba(94, 24, 233, 0.15), 0 0 0 1px rgba(94, 24, 233, 0.2)",
                            borderColor: COLORS.PRIMARY_PURPLE,
                            "& .hover-overlay": {
                              opacity: 1,
                              transform: "translateY(0)",
                            },
                          },
                        }}
                        onClick={() => handleProductClick(product.id)}
                      >
                        {/* Favorite Button */}
                        <IconButton
                          onClick={(e) => toggleFavorite(product.id, e)}
                          sx={{
                            position: "absolute",
                            top: 12,
                            right: 12,
                            zIndex: 3,
                            bgcolor: "rgba(255,255,255,0.95)",
                            backdropFilter: "blur(8px)",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                            transition: "all 0.3s",
                            "&:hover": {
                              bgcolor: "white",
                              transform: "scale(1.15)",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                            },
                          }}
                          size="small"
                        >
                          {favorites.has(product.id) ? (
                            <Favorite sx={{ fontSize: 18, color: "#ff1744" }} />
                          ) : (
                            <FavoriteBorder sx={{ fontSize: 18, color: "#666" }} />
                          )}
                        </IconButton>

                        {/* Trust Badges */}
                        <Stack
                          direction="row"
                          spacing={0.5}
                          sx={{
                            position: "absolute",
                            top: 12,
                            left: 12,
                            zIndex: 3,
                          }}
                        >
                          {product.supplier.trustSeal && (
                            <Chip
                              icon={<Verified sx={{ fontSize: 12 }} />}
                              label="Verified"
                              size="small"
                              sx={{
                                height: 22,
                                bgcolor: "rgba(94, 24, 233, 0.95)",
                                backdropFilter: "blur(8px)",
                                color: "white",
                                fontWeight: 800,
                                fontSize: "0.6rem",
                                boxShadow: "0 2px 8px rgba(94, 24, 233, 0.3)",
                                "& .MuiChip-icon": {
                                  color: "white",
                                },
                              }}
                            />
                          )}
                          {product.supplier.gstVerified && (
                            <Chip
                              label="GST"
                              size="small"
                              sx={{
                                height: 22,
                                bgcolor: "rgba(76, 175, 80, 0.95)",
                                backdropFilter: "blur(8px)",
                                color: "white",
                                fontWeight: 800,
                                fontSize: "0.6rem",
                                boxShadow: "0 2px 8px rgba(76, 175, 80, 0.3)",
                              }}
                            />
                          )}
                        </Stack>

                        {/* Image Container - 4:3 Ratio */}
                        <Box
                          sx={{
                            position: "relative",
                            width: "100%",
                            paddingTop: "75%", // 4:3 aspect ratio
                            bgcolor: isDark ? "rgba(255,255,255,0.02)" : "#f8f9fc",
                            overflow: "hidden",
                          }}
                        >
                          <Box
                            component="img"
                            src={product.image}
                            alt={product.name}
                            className="product-image"
                            sx={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              maxWidth: "80%",
                              maxHeight: "80%",
                              objectFit: "contain",
                            }}
                          />

                          {/* Hover Overlay - Supplier Info */}
                          <Box
                            className="hover-overlay"
                            sx={{
                              position: "absolute",
                              bottom: 0,
                              left: 0,
                              right: 0,
                              background: `linear-gradient(180deg, transparent 0%, ${isDark ? "rgba(0,0,0,0.95)" : "rgba(255,255,255,0.98)"
                                } 40%)`,
                              backdropFilter: "blur(12px)",
                              p: 2,
                              opacity: 0,
                              transform: "translateY(10px)",
                              transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                            }}
                          >
                            <Stack spacing={1}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Avatar
                                  sx={{
                                    width: 32,
                                    height: 32,
                                    bgcolor: COLORS.PRIMARY_PURPLE,
                                    fontSize: "0.75rem",
                                    fontWeight: 800,
                                  }}
                                >
                                  {product.supplier.name.charAt(0)}
                                </Avatar>
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                  <Typography
                                    variant="caption"
                                    fontWeight={800}
                                    sx={{
                                      display: "block",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                      color: isDark ? "white" : "#1a1a2e",
                                    }}
                                  >
                                    {product.supplier.name}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      fontSize: "0.65rem",
                                      color: "text.secondary",
                                      fontWeight: 600,
                                    }}
                                  >
                                    Verified Supplier
                                  </Typography>
                                </Box>
                              </Box>

                              <Stack direction="row" spacing={2} sx={{ fontSize: "0.65rem" }}>
                                <Tooltip title="Years in Business" arrow>
                                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}>
                                    <Business sx={{ fontSize: 13, color: COLORS.PRIMARY_PURPLE }} />
                                    <Typography variant="caption" fontWeight={700} sx={{ fontSize: "0.7rem" }}>
                                      {getSupplierYears(product.supplier.yearEstablished)}+ Yrs
                                    </Typography>
                                  </Box>
                                </Tooltip>
                                <Tooltip title="Response Rate" arrow>
                                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}>
                                    <TrendingUp sx={{ fontSize: 13, color: "#4caf50" }} />
                                    <Typography variant="caption" fontWeight={700} sx={{ fontSize: "0.7rem" }}>
                                      {product.supplier.responseRate}
                                    </Typography>
                                  </Box>
                                </Tooltip>
                              </Stack>
                            </Stack>
                          </Box>
                        </Box>

                        {/* Product Info */}
                        <CardContent sx={{ p: 2.5, flex: 1, display: "flex", flexDirection: "column", gap: 1.5 }}>
                          {/* Supplier Name - Always Visible */}
                          <Box>
                            <Typography
                              variant="caption"
                              sx={{
                                color: COLORS.PRIMARY_PURPLE,
                                fontWeight: 800,
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                                fontSize: "0.7rem",
                                letterSpacing: "0.02em",
                              }}
                            >
                              <CorporateFare sx={{ fontSize: 13 }} />
                              {product.supplier.name}
                            </Typography>
                          </Box>

                          {/* Product Name - Max 2 lines */}
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 800,
                              lineHeight: 1.3,
                              height: 48,
                              overflow: "hidden",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              color: isDark ? "white" : "#1a1a2e",
                              fontSize: "1rem",
                              letterSpacing: "-0.01em",
                            }}
                          >
                            {product.name}
                          </Typography>

                          {/* Price - Big and Bold */}
                          <Box>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "baseline",
                                gap: 0.5,
                              }}
                            >
                              <Typography
                                variant="h4"
                                color={COLORS.PRIMARY_PURPLE}
                                fontWeight={900}
                                sx={{ lineHeight: 1, fontSize: "1.75rem" }}
                              >
                                {product.price}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                fontWeight={600}
                                sx={{ fontSize: "0.8rem" }}
                              >
                                / {product.unit}
                              </Typography>
                            </Box>
                          </Box>

                          {/* Divider */}
                          <Box
                            sx={{
                              width: "100%",
                              height: "1px",
                              background: `linear-gradient(90deg, transparent 0%, ${
                                isDark ? "rgba(255,255,255,0.1)" : "#e8ecef"
                              } 50%, transparent 100%)`,
                            }}
                          />

                          {/* Supplier Info - Clean & Minimal */}
                          <Stack spacing={1}>
                            {/* Rating */}
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.5,
                                  bgcolor: isDark ? "rgba(255,255,255,0.05)" : "#fff9e6",
                                  px: 1,
                                  py: 0.4,
                                  borderRadius: 1.5,
                                  border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#ffe58f"}`,
                                }}
                              >
                                <Star sx={{ fontSize: 14, color: "#faaf00" }} />
                                <Typography
                                  variant="caption"
                                  fontWeight={800}
                                  sx={{ fontSize: "0.75rem", color: "#faaf00" }}
                                >
                                  {product.supplier.rating}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{ fontSize: "0.7rem" }}
                                >
                                  ({product.supplier.reviews})
                                </Typography>
                              </Box>
                            </Box>

                            {/* Location */}
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              <LocationOn
                                sx={{
                                  fontSize: 14,
                                  color: "text.secondary",
                                }}
                              />
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  fontSize: "0.75rem",
                                  fontWeight: 600,
                                }}
                              >
                                {product.supplier.location}
                              </Typography>
                            </Box>
                          </Stack>

                          {/* Primary CTA Buttons */}
                          <Stack direction="row" spacing={1.5} sx={{ mt: "auto", pt: 1 }}>
                            <CommonButton
                              variant="contained"
                              size="medium"
                              startIcon={<Call sx={{ fontSize: 16 }} />}
                              onClick={(e) => handleInquiry(product, e)}
                              fullWidth
                              sx={{
                                py: 1.3,
                                fontSize: "0.8rem",
                                fontWeight: 800,
                                borderRadius: 2.5,
                                textTransform: "none",
                                boxShadow: `0 4px 12px ${COLORS.PRIMARY_PURPLE}30`,
                                background: `linear-gradient(135deg, ${COLORS.PRIMARY_PURPLE} 0%, ${COLORS.PURPLE_HOVER} 100%)`,
                                animation:
                                  animatingContact === product.id
                                    ? `${pulseGlow} 0.6s ease-out`
                                    : "none",
                                "&:hover": {
                                  transform: "translateY(-2px)",
                                  boxShadow: `0 6px 16px ${COLORS.PRIMARY_PURPLE}40`,
                                  background: `linear-gradient(135deg, ${COLORS.PURPLE_HOVER} 0%, ${COLORS.PRIMARY_PURPLE} 100%)`,
                                },
                              }}
                            >
                              Get Best Price
                            </CommonButton>
                            <IconButton
                              onClick={(e) => handleWhatsApp(product, e)}
                              sx={{
                                bgcolor: "#25D366",
                                color: "white",
                                borderRadius: 2.5,
                                width: 48,
                                height: 48,
                                boxShadow: "0 4px 12px rgba(37, 211, 102, 0.3)",
                                flexShrink: 0,
                                animation:
                                  animatingContact === `whatsapp-${product.id}`
                                    ? `${pulseGlow} 0.6s ease-out, ${float} 0.6s ease-out`
                                    : "none",
                                "&:hover": {
                                  bgcolor: "#1ebe57",
                                  transform: "translateY(-2px) rotate(5deg)",
                                  boxShadow: "0 6px 16px rgba(37, 211, 102, 0.4)",
                                },
                              }}
                            >
                              <WhatsApp sx={{ fontSize: 20 }} />
                            </IconButton>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Zoom>
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
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
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
        <MenuItem onClick={() => setSortAnchor(null)}>Price: Low to High</MenuItem>
        <MenuItem onClick={() => setSortAnchor(null)}>Price: High to Low</MenuItem>
        <MenuItem onClick={() => setSortAnchor(null)}>Newest First</MenuItem>
        <MenuItem onClick={() => setSortAnchor(null)}>Most Popular</MenuItem>
      </Menu>

      {/* Inquiry Modal */}
      <InquiryModal
        open={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        productName={activeProduct?.name}
        supplierName={activeProduct?.supplier.name}
      />
    </Box>
  );
};

export default ProductsListingView;
