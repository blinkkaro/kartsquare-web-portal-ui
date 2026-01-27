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

      <Container maxWidth="xl">
        <Grid container spacing={4}>
          {/* Left: Images (Sticky) */}
          <Grid size={{ xs: 12, md: 4 }} sx={{ position: "relative" }}>
            <Box sx={{ position: "sticky", top: 100 }}>
              <Box
                sx={{
                  width: "100%",
                  height: { xs: 300, md: 450 },
                  border: "1px solid #e0e0e0",
                  borderRadius: 3,
                  overflow: "hidden",
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "#f8f9fa",
                  position: "relative"
                }}
              >
                <Box
                  component="img"
                  src={product.images[selectedImage]}
                  alt={product.name}
                  sx={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", mixBlendMode: "multiply" }}
                />
                {product.supplier.trustSeal && (
                  <Box sx={{
                    position: "absolute",
                    top: 16,
                    left: 16,
                    bgcolor: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(4px)",
                    px: 1.5,
                    py: 0.75,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
                  }}>
                    <Verified sx={{ fontSize: 18, color: COLORS.PRIMARY_PURPLE }} />
                    <Typography variant="subtitle2" fontWeight={700} color={COLORS.PRIMARY_PURPLE}>Trusted Supplier</Typography>
                  </Box>
                )}
              </Box>
              <Stack direction="row" spacing={2} sx={{ overflowX: "auto", pb: 1 }}>
                {product.images.map((img, idx) => (
                  <Box
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    sx={{
                      width: 80,
                      height: 80,
                      border: selectedImage === idx ? `2px solid ${COLORS.PRIMARY_PURPLE}` : "1px solid #e0e0e0",
                      borderRadius: 2,
                      cursor: "pointer",
                      flexShrink: 0,
                      p: 0.5,
                      bgcolor: "#fff"
                    }}
                  >
                    <Box
                      component="img"
                      src={img}
                      sx={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 1 }}
                    />
                  </Box>
                ))}
              </Stack>
            </Box>
          </Grid>

          {/* Right: Details (Scrollable) */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Box component={Paper} elevation={0} sx={{ p: { xs: 2, md: 4 }, borderRadius: 4, border: "1px solid #e0e0e0", display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Header Section */}
              <Box>
                <Typography variant="h4" fontWeight={800} sx={{ mb: 1.5, color: "#1a1a2e", lineHeight: 1.3 }}>
                  {product.name}
                </Typography>
                <Stack direction="row" alignItems="baseline" spacing={1} sx={{ mb: 2 }}>
                  <Typography variant="h4" color={COLORS.PRIMARY_PURPLE} fontWeight={800}>
                    {product.price}
                  </Typography>
                  <Typography variant="h6" color="text.secondary" fontWeight={500}>
                    / {product.unit} (plus {product.gst} GST)
                  </Typography>
                </Stack>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<Email />}
                    onClick={() => setInquiryOpen(true)}
                    sx={{
                      bgcolor: COLORS.PRIMARY_PURPLE,
                      fontSize: "1.05rem",
                      py: 1.5,
                      px: 4,
                      fontWeight: 700,
                      borderRadius: 2,
                      boxShadow: "0 8px 20px rgba(94, 24, 233, 0.25)",
                      "&:hover": { bgcolor: COLORS.PURPLE_HOVER, transform: "translateY(-2px)", boxShadow: "0 10px 25px rgba(94, 24, 233, 0.35)" },
                      transition: "all 0.2s",
                      flex: 1
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
                      fontSize: "1.05rem",
                      py: 1.5,
                      px: 4,
                      fontWeight: 700,
                      borderRadius: 2,
                      "&:hover": { borderColor: COLORS.PURPLE_HOVER, bgcolor: COLORS.PURPLE_ALPHA_04 },
                      flex: 1
                    }}
                  >
                    Call Supplier
                  </Button>
                </Stack>
              </Box>

              <Divider sx={{ borderStyle: "dashed" }} />

              {/* Supplier Info Section (Integrated) */}
              <Box sx={{ p: 3, bgcolor: "#fafafa", borderRadius: 3, border: "1px dashed #e0e0e0" }}>
                <Stack direction={{ xs: "column", md: "row" }} alignItems={{ md: "center" }} justifyContent="space-between" spacing={2}>
                  <Box>
                    <Typography variant="caption" sx={{ textTransform: "uppercase", letterSpacing: 1, color: "text.secondary", fontWeight: 700, display: "block", mb: 0.5 }}>
                      Sold By
                    </Typography>
                    <Typography variant="h6" fontWeight={700} sx={{ color: "#1a1a2e", mb: 0.5 }}>
                      {product.supplier.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center" }}>
                      <LocationOn fontSize="small" sx={{ mr: 0.5, color: COLORS.SECONDARY_ORANGE }} /> {product.supplier.location}
                    </Typography>
                  </Box>

                  <Stack spacing={0.5} sx={{ minWidth: 200 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography variant="body2" color="text.secondary">Response Rate</Typography>
                      <Typography variant="body2" fontWeight={700} color={COLORS.PRIMARY_PURPLE}>{product.supplier.responseRate}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography variant="body2" color="text.secondary">Est. Year</Typography>
                      <Typography variant="body2" fontWeight={700}>{product.supplier.yearEstablished}</Typography>
                    </Box>
                    {product.supplier.trustSeal && (
                      <Chip
                        icon={<Verified sx={{ fontSize: "16px !important" }} />}
                        label="TrustSEAL Verified"
                        size="small"
                        sx={{ bgcolor: COLORS.PURPLE_ALPHA_10, color: COLORS.PRIMARY_PURPLE, fontWeight: 600, mt: 1, border: "none" }}
                      />
                    )}
                  </Stack>
                </Stack>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  <Box component="span" fontWeight={600} color="text.primary">Address: </Box>
                  {product.supplier.address}
                </Typography>
              </Box>

              {/* Specs Section */}
              <Box>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2, display: "flex", alignItems: "center" }}>
                  Product Specifications
                </Typography>
                <TableContainer sx={{ border: "1px solid #f0f0f0", borderRadius: 2 }}>
                  <Table>
                    <TableBody>
                      {Object.entries(product.specs).map(([key, value], index) => (
                        <TableRow key={key} sx={{ bgcolor: index % 2 === 0 ? "#fafafa" : "white" }}>
                          <TableCell sx={{ color: "text.secondary", fontWeight: 600, width: "35%", borderBottom: "1px solid #f0f0f0", py: 1.5 }}>{key}</TableCell>
                          <TableCell sx={{ fontWeight: 500, color: "#333", borderBottom: "1px solid #f0f0f0", py: 1.5 }}>{value}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>

              {/* Description Section */}
              <Box>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                  Product Description
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: "pre-line", color: "#444", lineHeight: 1.8 }}>
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