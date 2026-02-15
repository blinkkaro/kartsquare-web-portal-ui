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
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [homeData, setHomeData] = useState<StoreHomeData | null>(null);
  const [loading, setLoading] = useState(true);

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

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/store/products?category=${categoryId}`);
  };

  const handleSubCategoryClick = (subCategoryId: string) => {
    router.push(`/store/products?sub_category=${subCategoryId}`);
  };

  const handleBrandClick = (brandId: string) => {
    router.push(`/store/products?brand=${brandId}`);
  };

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
};

export default StoreView;