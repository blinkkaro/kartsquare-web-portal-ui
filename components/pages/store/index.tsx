"use client";

import React, { useState } from "react";
import {
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
} from "@mui/icons-material";
import { COLORS } from "@/constants/colors";
import CategorySidebar from "./CategorySidebar";
import InquiryModal from "./InquiryModal";
import ProductDetails from "./ProductDetails";
import { Category, Brand, storeService, StoreHomeData, ApiProduct } from "@/services/store/store.service";
import CommonButton from "@/components/common/Button";

// Interface Definitions
export interface Product {
  id: string;
  name: string;
  price: string;
  unit: string;
  image: string;
  images: string[];
  supplier: {
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
  };
  specs: { [key: string]: string };
  description: string;
  gst: string;
  category: string;
  categoryId: string;
}

const StoreView: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"home" | "listing" | "product">("home");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [homeData, setHomeData] = useState<StoreHomeData | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);

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
    fetchHomeData();
  }, []);

  // Fetch Products based on active filter
  const fetchProducts = React.useCallback(async () => {
    if (viewMode !== "listing") return;

    try {
      setProductsLoading(true);
      const filters: any = {
        page: 1,
        limit: 20,
        sort: "price_asc"
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
        const mappedProducts: Product[] = response.data.products.map(apiProd => ({
          id: apiProd.product_id,
          name: apiProd.product_name,
          price: `${apiProd.currency === 'INR' ? '₹' : '$'} ${apiProd.price}`,
          unit: "Piece",
          image: apiProd.product_images?.[0] || "",
          images: apiProd.product_images || [],
          description: apiProd.product_description,
          gst: "18%",
          category: "General",
          categoryId: selectedCategory || "",
          specs: apiProd.specifications?.reduce((acc: any, spec) => {
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
            address: "Industrial Area, Phase 1, India"
          }
        }));
        setProducts(mappedProducts);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setProductsLoading(false);
    }
  }, [viewMode, selectedCategory, selectedSubCategory, selectedBrand]);

  React.useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = products.filter((product) => {
    return product.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleProductClick = (productId: string) => {
    setSelectedProductId(productId);
    setViewMode("product");
  };

  const handleBackToStore = () => {
    setViewMode("listing");
    setSelectedProductId(null);
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubCategory(null);
    setSelectedBrand(null);
    setViewMode("listing");
  };

  const handleSubCategoryClick = (subCategoryId: string) => {
    setSelectedSubCategory(subCategoryId);
    setSelectedCategory(null);
    setSelectedBrand(null);
    setViewMode("listing");
  };

  const handleBrandClick = (brandId: string) => {
    setSelectedBrand(brandId);
    setSelectedCategory(null);
    setSelectedSubCategory(null);
    setViewMode("listing");
  };

  const handleInquiry = (product: Product) => {
    setActiveProduct(product);
    setInquiryOpen(true);
  };

  const handleWhatsApp = (product: Product) => {
    const message = `Hi, I found your listing for ${product.name} on KartSquare. I am interested to know more.`;
    const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  if (viewMode === "product" && selectedProductId) {
    return (
      <ProductDetails
        product={products.find(p => p.id === selectedProductId) || null}
        onBack={handleBackToStore}
      />
    );
  }

  if (viewMode === "home") {
    return (
      <Box sx={{
        bgcolor: isDark ? COLORS.BACKGROUND.PRIMARY_DARK : COLORS.BACKGROUND.SECONDARY_LIGHT,
        minHeight: "100vh",
        pb: 8
      }}>
        <Container maxWidth="xl" sx={{ pt: 4 }}>
          {/* Banner Section */}
          <Paper
            elevation={0}
            sx={{
              mb: 6,
              height: { xs: 200, md: 350 },
              borderRadius: 4,
              overflow: 'hidden',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              background: `linear-gradient(135deg, ${COLORS.PRIMARY_PURPLE} 0%, ${COLORS.PURPLE_HOVER} 100%)`,
            }}
          >
            <Box sx={{ p: { xs: 4, md: 8 }, color: 'white', maxWidth: 600, position: 'relative', zIndex: 1 }}>
              <Typography variant="overline" sx={{ letterSpacing: 2, fontWeight: 700, opacity: 0.8 }}>
                LIMITED TIME OFFER
              </Typography>
              <Typography variant="h2" fontWeight={800} sx={{ mb: 2, lineHeight: 1.1 }}>
                Summer Collection 2026
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                Get up to 40% off on industrial machinery and warehouse equipment.
              </Typography>
              <CommonButton variant="contained" sx={{ bgcolor: 'white', color: COLORS.PRIMARY_PURPLE, '&:hover': { bgcolor: '#f5f5f5' }, px: 4, py: 1.5 }}>
                View Deals
              </CommonButton>
            </Box>
            {/* Abstract Design Elements */}
            <Box sx={{
              position: 'absolute',
              right: -50,
              top: -50,
              width: 400,
              height: 400,
              borderRadius: '50%',
              bgcolor: 'rgba(255,255,255,0.1)',
            }} />
          </Paper>

          {/* Search Header */}
          <Box sx={{
            py: 6,
            mb: 6,
            textAlign: 'center',
            bgcolor: isDark ? "rgba(255, 255, 255, 0.03)" : "white",
            borderRadius: 4,
            border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.12)" : "#e0e0e0"}`,
            boxShadow: '0 4px 24px rgba(0,0,0,0.04)'
          }}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h3" fontWeight={800} sx={{ mb: 1, color: isDark ? "text.primary" : "#1a1a2e" }}>
                Find Your <span style={{ color: COLORS.PRIMARY_PURPLE }}>Perfect Product</span>
              </Typography>
              <Typography variant="h6" color="text.secondary" fontWeight={400}>
                Search from thousands of verified suppliers across India
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', px: 3 }}>
              <TextField
                fullWidth
                placeholder="What are you looking for?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: COLORS.PRIMARY_PURPLE, fontSize: 28 }} />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: 3,
                    bgcolor: isDark ? "rgba(255, 255, 255, 0.08)" : "#f5f5f5",
                    p: 1,
                    fontSize: '1.1rem',
                  }
                }}
                sx={{ maxWidth: 800 }}
              />
            </Box>
          </Box>

          {/* Categories Grid Section */}
          <Box sx={{ mb: 8 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Box>
                <Typography variant="h4" fontWeight={800} sx={{ color: isDark ? "text.primary" : "#1a1a2e" }}>
                  Browse Categories
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Top trending categories this week
                </Typography>
              </Box>
              <CommonButton variant="text" endIcon={<ArrowForward />}>View All</CommonButton>
            </Box>

            <Grid container spacing={3}>
              {loading ? (
                // Simple skeleton loader
                [1, 2, 3, 4].map(n => (
                  <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={n}>
                    <Box sx={{ height: 300, bgcolor: 'rgba(0,0,0,0.05)', borderRadius: 3 }} />
                  </Grid>
                ))
              ) : (
                homeData?.categories.map((cat) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={cat.product_category_id}>
                    <Card
                      elevation={0}
                      sx={{
                        height: '100%',
                        borderRadius: 4,
                        border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "#eef2f6"}`,
                        bgcolor: isDark ? "rgba(255, 255, 255, 0.03)" : "white",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        cursor: 'pointer',
                        overflow: 'hidden',
                        "&:hover": {
                          transform: "translateY(-10px)",
                          boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                          borderColor: COLORS.PRIMARY_PURPLE,
                          "& .cat-image": {
                            transform: "scale(1.1)",
                          },
                          "& .arrow-icon": {
                            transform: "translateX(5px)",
                            color: COLORS.PRIMARY_PURPLE
                          }
                        },
                      }}
                      onClick={() => handleCategoryClick(cat.product_category_id)}
                    >
                      <Box sx={{
                        height: 200,
                        p: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: isDark ? "rgba(255, 255, 255, 0.02)" : "#f8f9fa",
                        overflow: 'hidden'
                      }}>
                        <img
                          src={cat.category_image}
                          alt={cat.category_name}
                          className="cat-image"
                          style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain',
                            transition: 'transform 0.5s ease'
                          }}
                        />
                      </Box>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Typography variant="h6" fontWeight={700} sx={{ flex: 1, pr: 1, color: isDark ? "text.primary" : "#1a1a2e" }}>
                            {cat.category_name}
                          </Typography>
                          <KeyboardArrowRight className="arrow-icon" sx={{ color: 'text.disabled', transition: 'all 0.3s' }} />
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{
                          mb: 2,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          minHeight: 40
                        }}>
                          {cat.category_des}
                        </Typography>
                        <Stack direction="row" flexWrap="wrap" gap={0.5}>
                          {cat.sub_categories.slice(0, 2).map(sub => (
                            <Chip
                              key={sub.product_sub_category_id}
                              label={sub.sub_category_name}
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSubCategoryClick(sub.product_sub_category_id);
                              }}
                              sx={{
                                height: 24,
                                fontSize: '0.7rem',
                                bgcolor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
                                fontWeight: 500,
                                '&:hover': {
                                  bgcolor: COLORS.PRIMARY_PURPLE,
                                  color: 'white'
                                }
                              }}
                            />
                          ))}
                          {cat.sub_categories.length > 2 && (
                            <Typography variant="caption" sx={{ mt: 0.5, color: COLORS.PRIMARY_PURPLE, fontWeight: 600 }}>
                              +{cat.sub_categories.length - 2} more
                            </Typography>
                          )}
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              )}
            </Grid>
          </Box>

          {/* Brands Section */}
          {!loading && homeData?.brands && homeData.brands.length > 0 && (
            <Box sx={{ mb: 10 }}>
              <Typography variant="h5" fontWeight={800} sx={{ mb: 4, color: isDark ? "text.primary" : "#1a1a2e" }}>
                Top Brands in Store
              </Typography>
              <Grid container spacing={3}>
                {homeData.brands.map((brand) => (
                  <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2 }} key={brand.product_brand_id}>
                    <Paper
                      elevation={0}
                      onClick={() => handleBrandClick(brand.product_brand_id)}
                      sx={{
                        p: 3,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 3,
                        border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "#eef2f6"}`,
                        transition: 'all 0.3s',
                        cursor: 'pointer',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                          borderColor: COLORS.PRIMARY_PURPLE,
                          bgcolor: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(94, 24, 233, 0.02)"
                        }
                      }}
                    >
                      <img src={brand.brand_image} alt={brand.brand_name} style={{ width: '80%', height: 60, objectFit: 'contain', marginBottom: 8 }} />
                      <Typography variant="subtitle2" fontWeight={700}>{brand.brand_name}</Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{
      bgcolor: isDark ? COLORS.BACKGROUND.PRIMARY_DARK : COLORS.BACKGROUND.SECONDARY_LIGHT,
      minHeight: "100vh"
    }}>
      {/* Sticky Premium Search Header */}
      <Box sx={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        bgcolor: isDark ? "rgba(10, 10, 10, 0.8)" : "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(20px)",
        py: 1.5,
        borderBottom: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)"}`,
        boxShadow: "0 4px 20px rgba(0,0,0,0.03)"
      }}>
        <Container maxWidth="xl" sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 3 } }}>
          <IconButton
            onClick={() => setViewMode("home")}
            sx={{
              bgcolor: isDark ? "rgba(255,255,255,0.03)" : "#f8f9fa",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#eeeeee"}`,
              borderRadius: 3,
              p: 1.2
            }}
          >
            <ArrowBack fontSize="small" />
          </IconButton>

          <Box sx={{ flex: 1, position: 'relative' }}>
            <TextField
              fullWidth
              placeholder="Search by product name, category or brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: COLORS.PRIMARY_PURPLE, ml: 1 }} />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 4,
                  bgcolor: isDark ? "#000" : "#fff",
                  color: isDark ? "text.primary" : "#1a1a2e",
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.15)" : "#e0e4e8"}`,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  padding: '4px 8px',
                  '&:focus-within': {
                    borderColor: COLORS.PRIMARY_PURPLE,
                    boxShadow: `0 0 0 4px ${COLORS.PRIMARY_PURPLE}15`,
                    transform: 'scale(1.005)'
                  },
                  '& fieldset': { border: 'none' }
                }
              }}
              size="medium"
              sx={{ maxWidth: 800 }}
            />
          </Box>

          <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', lg: 'flex' } }}>
            <CommonButton variant="text" size="small" sx={{ fontWeight: 700 }}>Quick Help</CommonButton>
            <Divider orientation="vertical" flexItem sx={{ height: 20, my: 'auto' }} />
            <CommonButton variant="text" size="small" sx={{ color: COLORS.PRIMARY_PURPLE, fontWeight: 800 }}>Sell on KartSquare</CommonButton>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Grid container spacing={3}>
          {/* Left Sidebar */}
          <Grid size={{ xs: 12, md: 3, lg: 2.5 }} sx={{ display: { xs: "none", md: "block" } }}>
            <CategorySidebar
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              categories={homeData?.categories}
              searchQuery={searchQuery}
            />
          </Grid>

          {/* Main Content */}
          <Grid size={{ xs: 12, md: 9, lg: 9.5 }}>
            <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="h6" fontWeight={700} color={isDark ? "text.primary" : "textPrimary"}>
                {selectedSubCategory ? (
                  homeData?.categories.flatMap(c => c.sub_categories).find(s => s.product_sub_category_id === selectedSubCategory)?.sub_category_name || "Sub-Category"
                ) : selectedBrand ? (
                  homeData?.brands.find(b => b.product_brand_id === selectedBrand)?.brand_name || "Brand"
                ) : (selectedCategory === "all" || !selectedCategory) ? "All Products" : (
                  homeData?.categories.find(c => c.product_category_id === selectedCategory)?.category_name || "Filtered Results"
                )}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {productsLoading ? "Loading..." : `${filteredProducts.length} Results found`}
              </Typography>
            </Box>

            <Stack spacing={2}>
              {productsLoading ? (
                // Product Skeletons
                [1, 2, 3].map(n => (
                  <Card key={n} elevation={0} sx={{ p: 2, display: 'flex', gap: 2, borderRadius: 3, border: '1px solid #e0e0e0' }}>
                    <Box sx={{ width: 240, height: 240, bgcolor: 'rgba(0,0,0,0.05)', borderRadius: 2 }} />
                    <Box sx={{ flex: 1, py: 1 }}>
                      <Box sx={{ width: '60%', height: 24, bgcolor: 'rgba(0,0,0,0.05)', mb: 2 }} />
                      <Box sx={{ width: '30%', height: 32, bgcolor: 'rgba(0,0,0,0.05)', mb: 2 }} />
                      <Box sx={{ width: '80%', height: 16, bgcolor: 'rgba(0,0,0,0.05)', mb: 1 }} />
                      <Box sx={{ width: '70%', height: 16, bgcolor: 'rgba(0,0,0,0.05)' }} />
                    </Box>
                  </Card>
                ))
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <Card
                    key={product.id}
                    elevation={0}
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", lg: "row" },
                      border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "#f0f0f0"}`,
                      borderRadius: 6,
                      bgcolor: isDark ? "#121212" : "white",
                      transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1)",
                      overflow: "visible", // For badges that might pop out
                      position: 'relative',
                      mb: 1,
                      "&:hover": {
                        transform: "translateY(-6px)",
                        boxShadow: isDark
                          ? "0 20px 40px rgba(0,0,0,0.6)"
                          : "0 20px 40px rgba(0,0,0,0.06)",
                        borderColor: COLORS.PRIMARY_PURPLE,
                        "& .product-image": { transform: "scale(1.08)" }
                      },
                    }}
                  >
                    {/* Image Section - Premium Container */}
                    <Box
                      sx={{
                        width: { xs: "100%", lg: 280 },
                        position: "relative",
                        p: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: isDark ? "rgba(255,255,255,0.02)" : "#f8f9fc",
                        borderRadius: { xs: "24px 24px 0 0", lg: "24px 0 0 24px" },
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        component="img"
                        className="product-image"
                        src={product.image}
                        alt={product.name}
                        sx={{
                          maxWidth: "85%",
                          maxHeight: "220px",
                          objectFit: "contain",
                          transition: "transform 0.5s ease",
                          zIndex: 1
                        }}
                      />

                      {/* Premium Floating Badges */}
                      {product.supplier.trustSeal && (
                        <Box sx={{
                          position: "absolute",
                          top: 16,
                          left: 16,
                          bgcolor: "rgba(255, 255, 255, 0.85)",
                          backdropFilter: "blur(12px)",
                          p: "4px 10px",
                          borderRadius: "100px",
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                          zIndex: 2,
                          border: "1px solid rgba(94, 24, 233, 0.1)"
                        }}>
                          <Verified sx={{ fontSize: 16, color: COLORS.PRIMARY_PURPLE }} />
                          <Typography variant="caption" sx={{ fontWeight: 800, color: COLORS.PRIMARY_PURPLE, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            Trusted
                          </Typography>
                        </Box>
                      )}

                      <Box sx={{
                        position: "absolute",
                        bottom: 12,
                        right: 12,
                        bgcolor: "rgba(0, 0, 0, 0.6)",
                        backdropFilter: "blur(4px)",
                        color: "white",
                        p: "2px 8px",
                        borderRadius: 1,
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        zIndex: 2
                      }}>
                        {product.id.startsWith('e') ? 'Global' : 'Domestic'}
                      </Box>
                    </Box>

                    {/* Content Section - High Hierarchy */}
                    <Box sx={{ flex: 1, p: { xs: 3, lg: 4 }, display: "flex", flexDirection: "column" }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                        <Box>
                          <Typography
                            variant="h5"
                            sx={{
                              fontWeight: 800,
                              color: isDark ? "white" : "#1a1a2e",
                              lineHeight: 1.2,
                              mb: 1,
                              cursor: "pointer",
                              letterSpacing: '-0.01em',
                              "&:hover": { color: COLORS.PRIMARY_PURPLE },
                            }}
                            onClick={() => handleProductClick(product.id)}
                          >
                            {product.name}
                          </Typography>

                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                            <Typography variant="h4" color={COLORS.PRIMARY_PURPLE} sx={{ fontWeight: 900 }}>
                              {product.price}
                            </Typography>
                            <Divider orientation="vertical" flexItem sx={{ height: 20, my: 'auto' }} />
                            <Typography variant="subtitle1" color="text.secondary" sx={{ fontWeight: 600 }}>
                              / {product.unit}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      {/* Specs Tags - Modern Horizontal Layout */}
                      <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 3, gap: 1 }}>
                        {Object.entries(product.specs).slice(0, 4).map(([key, value]) => (
                          <Box
                            key={key}
                            sx={{
                              px: 1.5,
                              py: 0.6,
                              borderRadius: 2,
                              bgcolor: isDark ? "rgba(255,255,255,0.05)" : "#f0f2f5",
                              border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#eef0f2"}`,
                              display: 'flex',
                              flexDirection: 'column'
                            }}
                          >
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', mb: -0.2 }}>
                              {key}
                            </Typography>
                            <Typography variant="caption" sx={{ fontSize: '0.75rem', fontWeight: 700, color: isDark ? "white" : "#444" }}>
                              {value}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>

                      {/* Primary Actions - High Impact */}
                      <Box sx={{ mt: "auto", display: "flex", gap: 2 }}>
                        <CommonButton
                          variant="contained"
                          onClick={() => handleInquiry(product)}
                          startIcon={<Call />}
                          sx={{
                            flex: 1.5,
                            borderRadius: 3,
                            py: 1.8,
                            fontSize: '0.9rem',
                            fontWeight: 700,
                            boxShadow: `0 8px 20px ${COLORS.PRIMARY_PURPLE}20`
                          }}
                        >
                          Contact Supplier
                        </CommonButton>
                        <IconButton
                          onClick={() => handleWhatsApp(product)}
                          sx={{
                            bgcolor: "#25D36615",
                            color: "#25D366",
                            borderRadius: 3,
                            width: 56,
                            height: 56,
                            "&:hover": { bgcolor: "#25D36625" }
                          }}
                        >
                          <WhatsApp />
                        </IconButton>
                      </Box>
                    </Box>

                    {/* Right Section - Supplier "Business Card" */}
                    <Box
                      sx={{
                        width: { xs: "100%", lg: 280 },
                        bgcolor: isDark ? "rgba(255, 255, 255, 0.03)" : "#fcfdfe",
                        borderLeft: { lg: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "#f0f0f0"}` },
                        borderTop: { xs: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "#f0f0f0"}`, lg: 'none' },
                        p: 3,
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: { lg: "0 24px 24px 0" }
                      }}
                    >
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Chip
                            label={product.supplier.businessType}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: '0.6rem',
                              fontWeight: 800,
                              bgcolor: COLORS.PURPLE_ALPHA_10,
                              color: COLORS.PRIMARY_PURPLE,
                              borderRadius: 1
                            }}
                          />
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Star sx={{ fontSize: 14, color: "#faaf00", mr: 0.3 }} />
                            <Typography variant="caption" fontWeight={800}>{product.supplier.rating}</Typography>
                          </Box>
                        </Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.3, mb: 1 }}>
                          {product.supplier.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <LocationOn sx={{ fontSize: 14, color: "text.secondary", mr: 0.5 }} />
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                            {product.supplier.location}
                          </Typography>
                        </Box>
                      </Box>

                      <Stack spacing={1} sx={{ mt: 'auto' }}>
                        <Box sx={{ bgcolor: isDark ? "#ffffff05" : "white", p: 1.5, borderRadius: 3, border: `1px solid ${isDark ? "#ffffff10" : "#f0f0f0"}` }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="caption" color="text.secondary" fontWeight={500}>Response Rate</Typography>
                            <Typography variant="caption" fontWeight={700} color={COLORS.PRIMARY_PURPLE}>{product.supplier.responseRate}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="caption" color="text.secondary" fontWeight={500}>Experience</Typography>
                            <Typography variant="caption" fontWeight={700}>{new Date().getFullYear() - product.supplier.yearEstablished} Years</Typography>
                          </Box>
                        </Box>

                        <CommonButton
                          variant="text"
                          size="small"
                          fullWidth
                          sx={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: "text.secondary",
                            "&:hover": { color: COLORS.PRIMARY_PURPLE, bgcolor: 'transparent' }
                          }}
                        >
                          View Full Profile
                        </CommonButton>
                      </Stack>
                    </Box>
                  </Card>
                ))
              ) : (
                <Box sx={{ textAlign: 'center', py: 10 }}>
                  <Typography variant="h6" color="text.secondary">No products found in this category.</Typography>
                  <CommonButton variant="text" onClick={() => setViewMode("home")} sx={{ mt: 2 }}>Browse Other Categories</CommonButton>
                </Box>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Container>

      {/* Reusable Inquiry Modal */}
      <InquiryModal
        open={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        productName={activeProduct?.name}
        supplierName={activeProduct?.supplier.name}
      />
    </Box >
  );
};

export default StoreView;