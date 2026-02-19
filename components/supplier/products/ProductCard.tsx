"use client";
import React from "react";
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Box,
    IconButton,
    Chip,
    Tooltip,
    useTheme,
    alpha
} from "@mui/material";
import {
    FavoriteBorder,
    Favorite,
    ShoppingCartOutlined,
    Verified as VerifiedIcon,
    Star as StarIcon
} from "@mui/icons-material";
import { COLORS } from "@/constants/colors";
import { motion } from "framer-motion";

interface ProductCardProps {
    product: any;
    onClick: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const [isFavorite, setIsFavorite] = React.useState(false);

    const images = product.product_images || [];
    const mainImage = images.length > 0 ? images[0] : "https://via.placeholder.com/300";
    const supplier = product.supplier || {};

    return (
        <motion.div
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{ height: '100%' }}
        >
            <Card
                onClick={() => onClick(product.product_id)}
                sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 4,
                    overflow: "hidden",
                    position: "relative",
                    cursor: "pointer",
                    border: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT}`,
                    bgcolor: isDark ? alpha(COLORS.BACKGROUND.SECONDARY_DARK, 0.6) : "white",
                    boxShadow: isDark
                        ? "none"
                        : "0 4px 20px rgba(0, 0, 0, 0.05)",
                    "&:hover": {
                        boxShadow: isDark
                            ? `0 0 20px ${alpha(COLORS.PRIMARY_PURPLE, 0.2)}`
                            : "0 10px 30px rgba(94, 24, 233, 0.1)",
                        "& .MuiCardMedia-root": {
                            transform: "scale(1.05)",
                        }
                    }
                }}
            >
                {/* Top Badges */}
                <Box
                    sx={{
                        position: "absolute",
                        top: 12,
                        left: 12,
                        zIndex: 2,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1
                    }}
                >
                    {supplier.is_verified && (
                        <Chip
                            icon={<VerifiedIcon sx={{ fontSize: '14px !important', color: 'white !important' }} />}
                            label="Verified"
                            size="small"
                            sx={{
                                bgcolor: COLORS.SUCCESS_GREEN,
                                color: "white",
                                fontWeight: 600,
                                fontSize: "10px",
                                height: 22,
                                backdropFilter: "blur(4px)"
                            }}
                        />
                    )}
                    {supplier.user_rating >= 4 && (
                        <Chip
                            icon={<StarIcon sx={{ fontSize: '14px !important', color: '#ffb400 !important' }} />}
                            label="Top Rated"
                            size="small"
                            sx={{
                                bgcolor: "rgba(255, 255, 255, 0.9)",
                                color: COLORS.BLACK,
                                fontWeight: 600,
                                fontSize: "10px",
                                height: 22,
                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                            }}
                        />
                    )}
                </Box>

                {/* Wishlist Button */}
                <IconButton
                    size="small"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsFavorite(!isFavorite);
                    }}
                    sx={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        zIndex: 2,
                        bgcolor: "rgba(255, 255, 255, 0.8)",
                        backdropFilter: "blur(4px)",
                        "&:hover": { bgcolor: "white" }
                    }}
                >
                    {isFavorite ? (
                        <Favorite sx={{ color: "#ff4444", fontSize: 18 }} />
                    ) : (
                        <FavoriteBorder sx={{ color: COLORS.TEXT.SECONDARY_LIGHT, fontSize: 18 }} />
                    )}
                </IconButton>

                {/* Product Image */}
                <Box sx={{ overflow: 'hidden', height: 200, position: 'relative' }}>
                    <CardMedia
                        component="img"
                        image={mainImage}
                        alt={product.product_name}
                        sx={{
                            height: "100%",
                            transition: "transform 0.5s ease",
                        }}
                    />
                </Box>

                <CardContent sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Supplier Info */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                        <Typography variant="caption" sx={{ color: COLORS.PRIMARY_PURPLE, fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            {supplier.store_name}
                        </Typography>
                        {supplier.verification_status === "TRUSTED" && (
                            <Tooltip title="Trusted Seller">
                                <VerifiedIcon sx={{ fontSize: 12, color: COLORS.PRIMARY_BLUE }} />
                            </Tooltip>
                        )}
                    </Box>

                    <Typography
                        variant="subtitle1"
                        fontWeight="700"
                        sx={{
                            lineHeight: 1.3,
                            mb: 1,
                            height: 42,
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxVertical: 'vertical'
                        }}
                    >
                        {product.product_name}
                    </Typography>

                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1, height: 32, overflow: 'hidden' }}>
                        {product.product_description}
                    </Typography>

                    <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            <Typography variant="h6" sx={{ color: COLORS.PRIMARY_PURPLE, fontWeight: 800 }}>
                                {product.currency === "USD" ? "$" : "₹"}{product.price}
                            </Typography>
                        </Box>

                        <Chip
                            label={product.is_available ? "In Stock" : "Out of Stock"}
                            size="small"
                            sx={{
                                height: 20,
                                fontSize: '0.65rem',
                                bgcolor: product.is_available ? `${COLORS.SUCCESS_GREEN}15` : 'rgba(0,0,0,0.05)',
                                color: product.is_available ? COLORS.SUCCESS_GREEN : 'text.secondary',
                                fontWeight: 700,
                                border: 'none'
                            }}
                        />
                    </Box>
                </CardContent>

                {/* View Details Overlay logic or Button */}
                <Box sx={{ p: 2, pt: 0 }}>
                    <motion.div whileTap={{ scale: 0.95 }}>
                        <Box
                            sx={{
                                width: '100%',
                                bgcolor: COLORS.PRIMARY_PURPLE,
                                color: 'white',
                                py: 1.2,
                                borderRadius: 2,
                                textAlign: 'center',
                                fontWeight: 600,
                                fontSize: '0.85rem',
                                transition: 'all 0.2s',
                                "&:hover": {
                                    bgcolor: COLORS.PURPLE_HOVER,
                                    boxShadow: `0 4px 12px ${alpha(COLORS.PRIMARY_PURPLE, 0.3)}`
                                }
                            }}
                        >
                            View Details
                        </Box>
                    </motion.div>
                </Box>
            </Card>
        </motion.div>
    );
};

export default ProductCard;
