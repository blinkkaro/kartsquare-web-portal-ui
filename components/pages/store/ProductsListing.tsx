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

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams.get("category"));
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(searchParams.get("sub_category"));
  const [selectedBrand, setSelectedBrand] = useState<string | null>(searchParams.get("brand"));
  const [selectedBusinessTypes, setSelectedBusinessTypes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);

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
      if (priceRange[1] < 1000000) { // Or some other max value
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
            specs:
              apiProd.specifications?.reduce((acc: any, spec: any) => {
                acc[spec.name] = spec.value.join(", ");
                return acc;
              }, {}) || {},
            supplier: {
              name: apiProd.supplier?.store_name || "Verified Supplier",
              location: apiProd.supplier?.store_address?.city_town || apiProd.product_origin || "Multiple Locations",
              rating: apiProd.supplier?.user_rating || 0,
              reviews: Math.floor(Math.random() * 50) + 10, // Simulated review count since not in API
              yearEstablished: parseInt(apiProd.supplier?.establishment_year) || 2024,
              gstVerified: !!apiProd.supplier?.gst_in,
              trustSeal: apiProd.supplier?.is_verified || apiProd.supplier?.verification_status === "APPROVED",
              responseRate: "98%",
              businessType: apiProd.supplier?.business_type || "Wholesaler",
              address: apiProd.supplier?.store_address?.address || "India",
              logo: apiProd.supplier?.logo_url,
              mobile: apiProd.supplier?.primary_mobile
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
  }, [selectedCategory, selectedSubCategory, selectedBrand, selectedBusinessTypes, priceRange]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleToggleBusinessType = (type: string) => {
    setSelectedBusinessTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
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
          <Grid size={{ xs: 12, md: 3.5, lg: 3 }} sx={{ display: { xs: "none", md: "block" } }}>
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
                        border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#e0e4e8"
                          }`,
                      }}
                    >
                      <Box
                        sx={{
                          width: "100%",
                          height: 200,
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
                            height: 16,
                            width: "80%",
                            bgcolor: isDark ? "rgba(255,255,255,0.05)" : "#f0f0f0",
                            borderRadius: 1,
                            mb: 1,
                          }}
                        />
                        <Box
                          sx={{
                            height: 20,
                            width: "40%",
                            bgcolor: isDark ? "rgba(255,255,255,0.08)" : "#e0e0e0",
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
                    <Zoom in={true} style={{ transitionDelay: `${index * 50}ms` }}>
                      <Card
                        elevation={0}
                        onMouseEnter={() => setHoveredProduct(product.id)}
                        onMouseLeave={() => setHoveredProduct(null)}
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          borderRadius: "16px",
                          border: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT}`,
                          bgcolor: isDark ? "rgba(255,255,255,0.02)" : "white",
                          cursor: "pointer",
                          position: "relative",
                          overflow: "hidden",
                          boxShadow: isDark
                            ? "0 4px 20px rgba(0, 0, 0, 0.3)"
                            : "0 4px 20px rgba(0,0,0,0.05)",
                          transition: "box-shadow 0.2s, transform 0.2s",
                          "&:hover": {
                            boxShadow: isDark
                              ? "0px 8px 30px rgba(94, 24, 233, 0.3)"
                              : "0px 8px 25px rgba(94, 24, 233, 0.15)",
                          },
                        }}
                        onClick={() => handleProductClick(product.id)}
                      >
                        {/* Favorite Button */}
                        <IconButton
                          onClick={(e) => toggleFavorite(product.id, e)}
                          sx={{
                            position: "absolute",
                            top: 10,
                            right: 10,
                            zIndex: 3,
                            bgcolor: "rgba(255,255,255,0.9)",
                            backdropFilter: "blur(4px)",
                            width: 32,
                            height: 32,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                            "&:hover": {
                              bgcolor: "white",
                              transform: "scale(1.1)",
                            },
                          }}
                          size="small"
                        >
                          {favorites.has(product.id) ? (
                            <Favorite sx={{ fontSize: 16, color: "#ff1744" }} />
                          ) : (
                            <FavoriteBorder sx={{ fontSize: 16, color: "#666" }} />
                          )}
                        </IconButton>

                        {/* Image Container */}
                        <Box
                          sx={{
                            position: "relative",
                            width: "100%",
                            paddingTop: "75%",
                            bgcolor: isDark ? "rgba(255,255,255,0.01)" : "#f8f9fc",
                            overflow: "hidden",
                          }}
                        >
                          <Box
                            component="img"
                            src={product.image}
                            alt={product.name}
                            sx={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />

                          {/* Top Left Badge: Verified */}
                          <Box
                            sx={{
                              position: "absolute",
                              top: 10,
                              left: 10,
                              bgcolor: "rgba(29, 78, 216, 0.95)",
                              color: "white",
                              padding: "3px 8px",
                              borderRadius: "20px",
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                              backdropFilter: "blur(4px)",
                              zIndex: 1,
                              boxShadow: "0 2px 8px rgba(29, 78, 216, 0.2)",
                            }}
                          >
                            <Verified sx={{ fontSize: 12 }} />
                            <Typography
                              variant="caption"
                              sx={{
                                fontWeight: 700,
                                fontSize: "0.6rem",
                                letterSpacing: "0.02em",
                              }}
                            >
                              VERIFIED
                            </Typography>
                          </Box>
                        </Box>

                        {/* Product Info */}
                        <CardContent sx={{ p: 2, flex: 1, display: "flex", flexDirection: "column", gap: 1.5 }}>
                          <Box>
                            {/* Product Name */}
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontWeight: 800,
                                lineHeight: 1.2,
                                // height: 28,
                                overflow: "hidden",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                color: isDark ? "white" : "#1a1a2e",
                                fontSize: "0.85rem",
                              }}
                            >
                              {product.name}
                            </Typography>

                            {/* Supplier Attribution */}
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                              <Avatar
                                src={product.supplier.logo}
                                sx={{ width: 26, height: 26, borderRadius: "6px" }}
                              >
                                {product.supplier.name.charAt(0)}
                              </Avatar>
                              <Box sx={{ minWidth: 0 }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, lineHeight: 1 }}>
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: "text.secondary",
                                      fontSize: "0.7rem",
                                      fontWeight: 500
                                    }}
                                  >
                                    by
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: isDark ? "white" : COLORS.TEXT.PRIMARY_LIGHT,
                                      fontWeight: 700,
                                      fontSize: "0.7rem",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap"
                                    }}
                                  >
                                    {product.supplier.name}
                                  </Typography>
                                  {product.supplier.trustSeal && (
                                    <Verified sx={{ fontSize: 13, color: "#1D4ED8" }} />
                                  )}
                                </Box>
                                {product.supplier.trustSeal && (
                                  <Box
                                    sx={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      bgcolor: isDark ? "rgba(29, 78, 216, 0.15)" : "rgba(29, 78, 216, 0.08)",
                                      color: "#1D4ED8",
                                      px: 0.6,
                                      py: 0.1,
                                      borderRadius: "4px",
                                      mt: 0.2
                                    }}
                                  >
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        fontSize: "0.55rem",
                                        fontWeight: 900,
                                        letterSpacing: "0.03em",
                                        textTransform: "uppercase"
                                      }}
                                    >
                                      Verified Supplier
                                    </Typography>
                                  </Box>
                                )}
                              </Box>
                            </Box>
                          </Box>

                          {/* Price */}
                          <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5, mt: 1 }}>
                            <Typography
                              variant="h6"
                              color={COLORS.PRIMARY_PURPLE}
                              fontWeight={800}
                              sx={{ lineHeight: 1, fontSize: "1.1rem" }}
                            >
                              {product.price}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              fontWeight={600}
                            >
                              / {product.unit}
                            </Typography>
                          </Box>

                          {/* Supplier Details (Location, Years) */}
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                              <LocationOn sx={{ fontSize: 12, color: "text.secondary" }} />
                              <Typography variant="caption" sx={{ fontSize: "0.65rem", color: "text.secondary" }}>
                                {product.supplier.location}
                              </Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                              <Business sx={{ fontSize: 12, color: "text.secondary" }} />
                              <Typography variant="caption" sx={{ fontSize: "0.65rem", color: "text.secondary" }}>
                                {getSupplierYears(product.supplier.yearEstablished)}+ Yrs
                              </Typography>
                            </Box>
                          </Stack>

                          {/* Primary CTA Buttons */}
                          <Stack direction="row" spacing={1} sx={{ mt: "auto", pt: 1.5 }}>
                            <CommonButton
                              variant="contained"
                              size="small"
                              onClick={(e) => handleInquiry(product, e)}
                              fullWidth
                              sx={{
                                py: 0.8,
                                fontSize: "0.75rem",
                                fontWeight: 800,
                                borderRadius: 2,
                                textTransform: "none",
                                boxShadow: "none",
                                background: COLORS.PRIMARY_PURPLE,
                                "&:hover": {
                                  background: COLORS.PURPLE_HOVER,
                                },
                              }}
                            >
                              Get Price
                            </CommonButton>
                            <IconButton
                              onClick={(e) => handleWhatsApp(product, e)}
                              sx={{
                                bgcolor: "#25D366",
                                color: "white",
                                borderRadius: 2,
                                width: 36,
                                height: 36,
                                flexShrink: 0,
                                "&:hover": {
                                  bgcolor: "#1ebe57",
                                },
                              }}
                            >
                              <WhatsApp sx={{ fontSize: 18 }} />
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
        productImage={activeProduct?.image}
        productPrice={activeProduct?.price}
      />
    </Box>
  );
};

export default ProductsListingView;
