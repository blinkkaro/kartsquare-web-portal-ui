"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  Button,
  IconButton,
  Divider,
  Chip,
  Breadcrumbs,
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from "@mui/material";
import {
  WhatsApp,
  Email,
  Phone,
  ArrowBack,
  Star,
  Verified,
  LocationOn,
  Share,
  FavoriteBorder,
  CheckCircle,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { COLORS } from "../../../constants/colors";
import InquiryModal from "./InquiryModal";
import { Product } from "./index";

interface ProductDetailsProps {
  product: Product | null;
  onBack: () => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product, onBack }) => {
  const router = useRouter();
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  // Reset selected image when product changes
  useEffect(() => {
    setSelectedImage(0);
  }, [product]);

  if (!product) return null;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fff" }}>
      {/* Top Bar / Breadcrumbs */}
      <Box sx={{ borderBottom: "1px solid #eee", py: 2, mb: 4, bgcolor: "#f9fafb" }}>
        <Container maxWidth="xl">
          <Stack direction="row" alignItems="center" spacing={2}>
            <IconButton onClick={onBack} size="small">
              <ArrowBack />
            </IconButton>
            <Breadcrumbs aria-label="breadcrumb">
              <Link color="inherit" href="/" onClick={(e) => { e.preventDefault(); onBack(); }} sx={{ cursor: "pointer" }}>
                Store
              </Link>
              <Link color="inherit" href="/" onClick={(e) => { e.preventDefault(); }} sx={{ cursor: "pointer" }}>
                {product.category}
              </Link>
              <Typography color="text.primary">{product.name}</Typography>
            </Breadcrumbs>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ pt: 4 }}>
        <Grid container spacing={6}>
          {/* Left: Images - High End Gallery Container */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box sx={{ position: "sticky", top: 120 }}>
              <Box
                sx={{
                  width: "100%",
                  height: { xs: 350, md: 500 },
                  borderRadius: 6,
                  overflow: "hidden",
                  mb: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "#fcfdfe",
                  position: "relative",
                  border: "1px solid #f0f0f0",
                  transition: 'all 0.3s ease',
                  '&:hover': { boxShadow: '0 24px 48px rgba(0,0,0,0.08)' }
                }}
              >
                <Box
                  component="img"
                  src={product.images[selectedImage]}
                  alt={product.name}
                  sx={{ maxWidth: "85%", maxHeight: "85%", objectFit: "contain", mixBlendMode: "multiply" }}
                />

                {product.supplier.trustSeal && (
                  <Box sx={{
                    position: "absolute",
                    top: 24,
                    left: 24,
                    bgcolor: "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(12px)",
                    px: 2,
                    py: 1,
                    borderRadius: 3,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    boxShadow: "0 8px 16px rgba(0,0,0,0.06)",
                    border: "1px solid rgba(0,0,0,0.03)"
                  }}>
                    <Verified sx={{ fontSize: 20, color: COLORS.PRIMARY_PURPLE }} />
                    <Typography variant="subtitle2" fontWeight={800} color={COLORS.PRIMARY_PURPLE} sx={{ letterSpacing: 0.5, textTransform: 'uppercase', fontSize: '0.7rem' }}>
                      Verified Supplier
                    </Typography>
                  </Box>
                )}
              </Box>

              <Stack direction="row" spacing={2} sx={{ overflowX: "auto", pb: 2, '&::-webkit-scrollbar': { display: 'none' } }}>
                {product.images.map((img, idx) => (
                  <Box
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    sx={{
                      width: 90,
                      height: 90,
                      border: selectedImage === idx ? `2px solid ${COLORS.PRIMARY_PURPLE}` : "1px solid #eee",
                      borderRadius: 4,
                      cursor: "pointer",
                      flexShrink: 0,
                      p: 1,
                      bgcolor: "#fff",
                      transition: 'all 0.2s',
                      transform: selectedImage === idx ? 'scale(1.05)' : 'scale(1)',
                      boxShadow: selectedImage === idx ? `0 8px 16px ${COLORS.PRIMARY_PURPLE}20` : 'none'
                    }}
                  >
                    <Box
                      component="img"
                      src={img}
                      sx={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: 2 }}
                    />
                  </Box>
                ))}
              </Stack>
            </Box>
          </Grid>

          {/* Right: Details - High Hierarchy Content */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {/* Product Info Header */}
              <Box>
                <Typography variant="overline" sx={{ color: COLORS.PRIMARY_PURPLE, fontWeight: 800, letterSpacing: 2, display: 'block', mb: 1 }}>
                  {product.category}
                </Typography>
                <Typography variant="h3" fontWeight={900} sx={{ mb: 2, color: "#1a1a2e", lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                  {product.name}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
                  <Box sx={{
                    bgcolor: COLORS.PURPLE_ALPHA_04,
                    px: 3,
                    py: 1.5,
                    borderRadius: 4,
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 1,
                    border: `1px solid ${COLORS.PRIMARY_PURPLE}15`
                  }}>
                    <Typography variant="h3" color={COLORS.PRIMARY_PURPLE} fontWeight={900}>
                      {product.price}
                    </Typography>
                    <Typography variant="h6" color="text.secondary" fontWeight={600}>
                      / {product.unit}
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    + {product.gst} GST
                  </Typography>
                </Box>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<Email />}
                    onClick={() => setInquiryOpen(true)}
                    sx={{
                      bgcolor: COLORS.PRIMARY_PURPLE,
                      fontSize: "1.1rem",
                      py: 2.2,
                      px: 5,
                      fontWeight: 800,
                      borderRadius: 4,
                      boxShadow: `0 12px 24px ${COLORS.PRIMARY_PURPLE}30`,
                      "&:hover": { bgcolor: COLORS.PURPLE_HOVER, transform: "translateY(-3px)", boxShadow: `0 16px 32px ${COLORS.PRIMARY_PURPLE}40` },
                      transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                      flex: 1.5
                    }}
                  >
                    Get Best Quote
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<Phone />}
                    sx={{
                      borderColor: COLORS.PRIMARY_PURPLE,
                      color: COLORS.PRIMARY_PURPLE,
                      fontSize: "1.1rem",
                      py: 2.2,
                      px: 5,
                      fontWeight: 800,
                      borderRadius: 4,
                      borderWidth: 2,
                      "&:hover": { borderWidth: 2, borderColor: COLORS.PURPLE_HOVER, bgcolor: COLORS.PURPLE_ALPHA_04 },
                      flex: 1
                    }}
                  >
                    Talk to Us
                  </Button>
                </Stack>
              </Box>

              {/* Supplier Profile - Premium Widget */}
              <Box sx={{
                p: 4,
                bgcolor: "#fcfdfe",
                borderRadius: 6,
                border: "1px solid #f0f3f6",
                boxShadow: '0 12px 32px rgba(0,0,0,0.03)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <Box sx={{ position: 'absolute', top: 0, right: 0, width: 120, height: 120, background: `radial-gradient(circle at top right, ${COLORS.PRIMARY_PURPLE}10 0%, transparent 70%)` }} />

                <Stack direction={{ xs: "column", md: "row" }} spacing={4} alignItems="start">
                  <Box sx={{ flex: 1 }}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                      <Chip label="Manufacturer" size="small" sx={{ height: 20, bgcolor: COLORS.PURPLE_ALPHA_10, color: COLORS.PRIMARY_PURPLE, fontWeight: 800, fontSize: '0.6rem', borderRadius: 1 }} />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Star sx={{ fontSize: 16, color: "#faaf00" }} />
                        <Typography variant="caption" fontWeight={800}>{product.supplier.rating}</Typography>
                      </Box>
                    </Stack>
                    <Typography variant="h5" fontWeight={900} sx={{ color: "#1a1a2e", mb: 1.5 }}>
                      {product.supplier.name}
                    </Typography>
                    <Typography variant="body2" sx={{ display: "flex", alignItems: "center", color: "text.secondary", fontWeight: 500 }}>
                      <LocationOn fontSize="small" sx={{ mr: 1, color: COLORS.SECONDARY_ORANGE }} /> {product.supplier.location}
                    </Typography>
                  </Box>

                  <Box sx={{ minWidth: 220, p: 2, bgcolor: 'white', borderRadius: 4, border: '1px solid #f0f0f0' }}>
                    <Stack spacing={1.5}>
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>Responsive</Typography>
                        <Typography variant="caption" fontWeight={800} color={COLORS.PRIMARY_PURPLE}>{product.supplier.responseRate}</Typography>
                      </Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>GST Verified</Typography>
                        <CheckCircle sx={{ fontSize: 14, color: "#00c853" }} />
                      </Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>Est. Area</Typography>
                        <Typography variant="caption" fontWeight={800}>5000+ sq.ft</Typography>
                      </Box>
                    </Stack>
                  </Box>
                </Stack>
              </Box>

              {/* Tabs / Content Sections */}
              <Box>
                <Typography variant="h6" fontWeight={900} sx={{ mb: 3, color: '#1a1a2e', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  Technical Specifications
                </Typography>
                <Grid container spacing={2}>
                  {Object.entries(product.specs).map(([key, value], index) => (
                    <Grid size={{ xs: 12, sm: 6 }} key={key}>
                      <Box sx={{
                        p: 2.5,
                        borderRadius: 3,
                        bgcolor: index % 2 === 0 ? "#f8f9fc" : "white",
                        border: '1px solid #f0f0f0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 600 }}>{key}</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 800, color: "#1a1a2e" }}>{value}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {/* Description Section */}
              <Box sx={{ pb: 8 }}>
                <Typography variant="h6" fontWeight={900} sx={{ mb: 3, color: '#1a1a2e' }}>
                  Product Insights
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: "pre-line", color: "#475569", lineHeight: 1.8, fontSize: '1.05rem', fontWeight: 500 }}>
                  {product.description}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>

      <InquiryModal
        open={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        productName={product.name}
        supplierName={product.supplier.name}
      />
    </Box>
  );
};

export default ProductDetails;