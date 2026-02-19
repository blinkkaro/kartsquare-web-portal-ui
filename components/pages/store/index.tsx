"use client";

import React, { useState, useEffect } from "react";
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
} from "@mui/icons-material";
import { COLORS } from "@/constants/colors";
import CategorySidebar from "./CategorySidebar";
import InquiryModal from "./InquiryModal";
import ProductDetails from "./ProductDetails";
import { useSearchParams, useRouter } from "next/navigation";

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
    trustSeal: boolean; // Similar to IndiaMART TrustSEAL
    responseRate: string;
    businessType: string;
    address: string;
  };
  specs: { [key: string]: string }; // Important specs for the card
  description: string;
  gst: string;
  category: string;
}

const StoreView: React.FC = () => {
  const theme = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDark = theme.palette.mode === "dark";

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"store" | "product">("store");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  useEffect(() => {
    const query = searchParams.get("q");
    if (query) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  // Update URL when search query changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (searchQuery) {
      params.set("q", searchQuery);
    } else {
      params.delete("q");
    }
    // Use replace to avoid cluttering history, but only if it's different
    const currentQ = searchParams.get("q") || "";
    if (currentQ !== searchQuery) {
      router.replace(`/store?${params.toString()}`);
    }
  }, [searchQuery, router, searchParams]);


  // Inquiry State
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  // Mock Products Data (IndiaMART style)
  const products: Product[] = [
    {
      id: "1",
      name: "1121 Golden Sella Basmati Rice",
      price: "₹ 65",
      unit: "Kg",
      image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=600&auto=format&fit=crop",
      images: ["https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=600&auto=format&fit=crop"],
      supplier: {
        name: "Shri Ram Exports",
        location: "Karnal, Haryana",
        rating: 4.2,
        reviews: 156,
        yearEstablished: 2010,
        gstVerified: true,
        trustSeal: true,
        responseRate: "92%",
        businessType: "Exporter",
        address: "Plot No. 45, Sector 28, Industrial Area, Karnal, Haryana - 132001",
      },
      specs: {
        "Packaging Size": "25 Kg, 50 Kg",
        "Type": "Golden Sella",
        "Grain Length": "8.35 mm",
        "Purity": "99.9%",
      },
      description: "High quality 1121 Golden Sella Basmati Rice for export. Double polished and sortex clean.",
      gst: "5%",
      category: "textiles", // Using textles just to map to something for now, ideally 'food'
    },
    {
      id: "2",
      name: "Heavy Duty CNC Lathe Machine",
      price: "₹ 4.5 Lakh",
      unit: "Unit",
      image: "https://images.unsplash.com/photo-1617575521317-d2974f3b56d2?q=80&w=600&auto=format&fit=crop",
      images: ["https://images.unsplash.com/photo-1617575521317-d2974f3b56d2?q=80&w=600&auto=format&fit=crop"],
      supplier: {
        name: "Marvel Machine Tools",
        location: "Rajkot, Gujarat",
        rating: 4.5,
        reviews: 42,
        yearEstablished: 1998,
        gstVerified: true,
        trustSeal: true,
        responseRate: "88%",
        businessType: "Manufacturer",
        address: "GIDC, Metoda, Rajkot, Gujarat - 360021",
      },
      specs: {
        "Automation Grade": "Automatic",
        "Max Swing Over Bed": "460 mm",
        "Max Spindle Speed": "2000 RPM",
        "Power Consumption": "5 HP",
      },
      description: "Industrial grade CNC Lathe Machine for precision turning operations. Comes with 1 year warranty and onsite support.",
      gst: "18%",
      category: "machinery",
    },
    {
      id: "3",
      name: "Cotton Lycra Fabric 220 GSM",
      price: "₹ 240",
      unit: "Kg",
      image: "https://images.unsplash.com/photo-1620799140408-ed5341cd2431?q=80&w=600&auto=format&fit=crop",
      images: ["https://images.unsplash.com/photo-1620799140408-ed5341cd2431?q=80&w=600&auto=format&fit=crop"],
      supplier: {
        name: "FabTex India",
        location: "Surat, Gujarat",
        rating: 4.0,
        reviews: 215,
        yearEstablished: 2015,
        gstVerified: true,
        trustSeal: false,
        responseRate: "75%",
        businessType: "Wholesaler",
        address: "Ring Road, Surat, Gujarat - 395002",
      },
      specs: {
        "Fabric": "Cotton Lycra",
        "GSM": "200-250",
        "Width": "58-60 Inch",
        "Pattern": "Plain",
      },
      description: "Premium quality 4-way lycra cotton fabric suitable for leggings and t-shirts. Available in all colors.",
      gst: "12%",
      category: "textiles",
    },
    {
      id: "4",
      name: "Industrial Safety Shoes",
      price: "₹ 450",
      unit: "Pair",
      image: "https://images.unsplash.com/photo-1605348532760-6753d5c43650?q=80&w=600&auto=format&fit=crop",
      images: ["https://images.unsplash.com/photo-1605348532760-6753d5c43650?q=80&w=600&auto=format&fit=crop"],
      supplier: {
        name: "SafeGuard Industries",
        location: "Kanpur, Uttar Pradesh",
        rating: 3.8,
        reviews: 89,
        yearEstablished: 2018,
        gstVerified: true,
        trustSeal: false,
        responseRate: "65%",
        businessType: "Manufacturer",
        address: "Jajmau, Kanpur, Uttar Pradesh - 208010",
      },
      specs: {
        "Size": "6-11",
        "Upper Material": "Leather",
        "Sole": "PU Double Density",
        "Toe Cap": "Steel",
      },
      description: "ISI marked industrial safety shoes with steel toe cap. Oil and acid resistant sole.",
      gst: "18%",
      category: "building",
    },
    {
      id: "5",
      name: "Solar Power Plant 5kW",
      price: "₹ 2.5 Lakh",
      unit: "Set",
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=600&auto=format&fit=crop",
      images: ["https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=600&auto=format&fit=crop"],
      supplier: {
        name: "Green Energy Solutions",
        location: "Jaipur, Rajasthan",
        rating: 4.8,
        reviews: 312,
        yearEstablished: 2012,
        gstVerified: true,
        trustSeal: true,
        responseRate: "98%",
        businessType: "Service Provider",
        address: "Sitapura Industrial Area, Jaipur, Rajasthan - 302022",
      },
      specs: {
        "Capacity": "5 kW",
        "Type": "On Grid",
        "Panel Type": "Mono PERC",
        "Warranty": "25 Years",
      },
      description: "Complete 5kW solar power plant installation for home and office. Includes net metering support.",
      gst: "12%",
      category: "electronics",
    },
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleProductClick = (productId: string) => {
    setSelectedProductId(productId);
    setViewMode("product");
  };

  const handleBackToStore = () => {
    setViewMode("store");
    setSelectedProductId(null);
    // Optional: Clear search when going back? No, keep context.
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

  return (
    <Box sx={{
      bgcolor: isDark ? COLORS.BACKGROUND.PRIMARY_DARK : COLORS.BACKGROUND.SECONDARY_LIGHT,
      minHeight: "100vh"
    }}>
      {/* Top Search Bar Area */}
      <Box sx={{
        bgcolor: isDark ? COLORS.BACKGROUND.PRIMARY_DARK : "white",
        py: 2,
        borderBottom: `1px solid ${isDark ? "rgba(255, 255, 255, 0.12)" : "#e0e0e0"}`
      }}>
        <Container maxWidth="xl">
          <TextField
            fullWidth
            placeholder="Search for products, suppliers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: isDark ? "text.secondary" : "inherit" }} />
                </InputAdornment>
              ),
              sx: {
                borderRadius: 1,
                bgcolor: isDark ? "rgba(255, 255, 255, 0.08)" : "#f5f5f5",
                color: isDark ? "text.primary" : "inherit",
              }
            }}
            size="small"
            sx={{ maxWidth: 800 }}
          />
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Grid container spacing={3}>
          {/* Left Sidebar */}
          <Grid size={{ xs: 12, md: 3, lg: 2.5 }} sx={{ display: { xs: "none", md: "block" } }}>
            <CategorySidebar
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </Grid>

          {/* Main Content */}
          <Grid size={{ xs: 12, md: 9, lg: 9.5 }}>
            <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="h6" fontWeight={700} color={isDark ? "text.primary" : "textPrimary"}>
                {selectedCategory === "all" ? "All Products" : "Filtered Rules"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {filteredProducts.length} Results found
              </Typography>
            </Box>

            <Stack spacing={2}>
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  elevation={0}
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    p: 2,
                    border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "#e0e0e0"}`,
                    borderRadius: 3,
                    bgcolor: isDark ? "rgba(255, 255, 255, 0.04)" : "white",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: isDark ? "0 12px 24px -10px rgba(0, 0, 0, 0.5)" : "0 12px 24px -10px rgba(0, 0, 0, 0.15)",
                      borderColor: COLORS.PRIMARY_PURPLE,
                    },
                  }}
                >
                  {/* Image Section */}
                  <Box
                    sx={{
                      width: { xs: "100%", sm: 240 },
                      height: 240,
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: isDark ? "rgba(255, 255, 255, 0.95)" : "#f4f6f8", // Kept light for better image visibility
                      borderRadius: 2,
                      overflow: "hidden",
                      cursor: "pointer",
                      position: "relative",
                    }}
                    onClick={() => handleProductClick(product.id)}
                  >
                    <Box
                      component="img"
                      src={product.image}
                      alt={product.name}
                      sx={{
                        maxWidth: "90%",
                        maxHeight: "90%",
                        objectFit: "contain",
                        mixBlendMode: "multiply"
                      }}
                    />
                    {product.supplier.trustSeal && (
                      <Box sx={{
                        position: "absolute",
                        top: 12,
                        left: 12,
                        bgcolor: "rgba(255, 255, 255, 0.9)",
                        backdropFilter: "blur(4px)",
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
                      }}>
                        <Verified sx={{ fontSize: 16, color: COLORS.PRIMARY_PURPLE }} />
                        <Typography variant="caption" fontWeight={700} color={COLORS.PRIMARY_PURPLE}>Trusted</Typography>
                      </Box>
                    )}
                  </Box>

                  {/* Content Section */}
                  <Box sx={{ flex: 1, px: { xs: 0, sm: 3 }, py: { xs: 2, sm: 0 }, display: "flex", flexDirection: "column" }}>
                    <Box sx={{ mb: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: isDark ? "text.primary" : "#1a1a2e",
                          lineHeight: 1.3,
                          mb: 1,
                          cursor: "pointer",
                          transition: "color 0.2s",
                          "&:hover": { color: COLORS.PRIMARY_PURPLE },
                        }}
                        onClick={() => handleProductClick(product.id)}
                      >
                        {product.name}
                      </Typography>

                      <Stack direction="row" alignItems="baseline" spacing={1}>
                        <Typography variant="h5" color={COLORS.PRIMARY_PURPLE} fontWeight={800}>
                          {product.price}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" fontWeight={500}>
                          / {product.unit}
                        </Typography>
                      </Stack>
                    </Box>

                    <Divider sx={{ my: 1.5, borderStyle: "dashed", borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.12)" }} />

                    {/* Specs Table (Mini) */}
                    <Box sx={{ mb: 2 }}>
                      {Object.entries(product.specs).slice(0, 3).map(([key, value]) => (
                        <Grid container key={key} sx={{ mb: 0.5 }}>
                          <Grid size={{ xs: 5 }}>
                            <Typography variant="body2" color="text.secondary">
                              {key}
                            </Typography>
                          </Grid>
                          <Grid size={{ xs: 7 }}>
                            <Typography variant="body2" color={isDark ? "text.primary" : "text.primary"} fontWeight={500}>
                              : {value}
                            </Typography>
                          </Grid>
                        </Grid>
                      ))}
                    </Box>

                    {/* Action Buttons */}
                    <Box sx={{ mt: "auto", display: "flex", gap: 1.5 }}>
                      <Button
                        variant="contained"
                        onClick={() => handleInquiry(product)}
                        startIcon={<Call />}
                        sx={{
                          bgcolor: COLORS.PRIMARY_PURPLE,
                          "&:hover": { bgcolor: COLORS.PURPLE_HOVER, boxShadow: "0 4px 12px rgba(94, 24, 233, 0.3)" },
                          textTransform: "none",
                          fontWeight: 600,
                          flex: 1,
                          borderRadius: 2
                        }}
                      >
                        Contact Supplier
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<WhatsApp />}
                        onClick={() => handleWhatsApp(product)}
                        sx={{
                          borderColor: "#25D366",
                          color: "#25D366",
                          "&:hover": { borderColor: "#128C7E", color: "#128C7E", bgcolor: "rgba(37, 211, 102, 0.08)" },
                          minWidth: "auto",
                          px: 2,
                          borderRadius: 2
                        }}
                      >
                        Chat
                      </Button>
                    </Box>
                  </Box>

                  {/* Right Supplier Section (Desktop) */}
                  <Box
                    sx={{
                      width: { xs: "100%", md: 260 },
                      bgcolor: isDark ? "rgba(255, 255, 255, 0.04)" : "#fafafa",
                      borderRadius: 2,
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                      border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "#f0f0f0"}`
                    }}
                  >
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="caption" sx={{ bgcolor: COLORS.PURPLE_ALPHA_10, color: COLORS.PRIMARY_PURPLE, px: 1, py: 0.5, borderRadius: 1, fontWeight: 600, fontSize: "0.7rem" }}>
                        {product.supplier.businessType}
                      </Typography>
                    </Box>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1.2, mb: 0.5, color: isDark ? "text.primary" : "text.primary" }}>
                      {product.supplier.name}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "start", mb: 2 }}>
                      <LocationOn sx={{ fontSize: 16, color: COLORS.SECONDARY_ORANGE, mr: 0.5, mt: 0.2 }} />
                      <Typography variant="body2" color="text.secondary">
                        {product.supplier.location}
                      </Typography>
                    </Box>

                    <Stack spacing={1.5} sx={{ mb: "auto" }}>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Typography variant="caption" color="text.secondary">Rating</Typography>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography variant="caption" fontWeight={700} sx={{ mr: 0.5, color: isDark ? "text.primary" : "text.primary" }}>{product.supplier.rating}</Typography>
                          <Star sx={{ fontSize: 14, color: "#faaf00" }} />
                        </Box>
                      </Box>

                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="caption" color="text.secondary">Member Since</Typography>
                        <Typography variant="caption" fontWeight={600} color={isDark ? "text.primary" : "text.primary"}>{product.supplier.yearEstablished}</Typography>
                      </Box>

                      {product.supplier.trustSeal && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <Verified sx={{ fontSize: 14, color: COLORS.PRIMARY_PURPLE }} />
                          <Typography variant="caption" fontWeight={600} color={COLORS.PRIMARY_PURPLE}>Verified Supplier</Typography>
                        </Box>
                      )}

                      <Box sx={{ mt: 1, p: 1, bgcolor: isDark ? "rgba(255, 255, 255, 0.04)" : "#f8f9fa", borderRadius: 1, border: `1px dashed ${isDark ? "rgba(255, 255, 255, 0.1)" : "#e0e0e0"}` }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5, fontSize: "0.7rem" }}>
                          Recent Activity
                        </Typography>
                        <Typography variant="caption" fontWeight={600} color={COLORS.PRIMARY_PURPLE}>
                          {product.supplier.responseRate} Response Rate
                        </Typography>
                      </Box>
                    </Stack>

                    <Button
                      fullWidth
                      size="small"
                      variant="text"
                      sx={{
                        mt: 2,
                        bgcolor: COLORS.PURPLE_ALPHA_10,
                        color: COLORS.PRIMARY_PURPLE,
                        "&:hover": { bgcolor: COLORS.PURPLE_ALPHA_20 }
                      }}
                    >
                      View Profile
                    </Button>
                  </Box>
                </Card>
              ))}
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
    </Box>
  );
};

export default StoreView;