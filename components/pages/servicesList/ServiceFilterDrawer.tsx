"use client";

import React from "react";
import {
  Box,
  Typography,
  useTheme,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Grid as MuiGrid,
  Zoom,

  Divider,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  Rating
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { Close, Tune, Sort, Star, Widgets } from "@mui/icons-material";
import { Category } from "../../../services/serviceList/listInteraface";
import { COLORS } from "../../../constants/colors";
import { useTranslate } from "@/hooks/useTranslate";

interface ServiceFilterDrawerProps {
  categories: Category[];
  selectedCategory: string | null;
  loading: boolean;
  onCategoryClick: (categoryId: string | null) => void;
  open: boolean;
  onClose: () => void;
}

const getCategoryIcon = (categoryName: string) => {
  const name = categoryName.toLowerCase();
  if (name.includes("business") || name.includes("finance")) return "💼";
  if (name.includes("car") || name.includes("automotive") || name.includes("vehicle")) return "🚗";
  if (name.includes("event") || name.includes("entertainment") || name.includes("party")) return "🎭";
  if (name.includes("health") || name.includes("medical") || name.includes("wellness")) return "🩺";
  if (name.includes("it") || name.includes("software") || name.includes("tech") || name.includes("computer")) return "💻";
  if (name.includes("legal") || name.includes("compliance") || name.includes("law")) return "⚖️";
  if (name.includes("lifestyle")) return "🏡";
  if (name.includes("fitness") || name.includes("gym")) return "💪";
  if (name.includes("beauty") || name.includes("salon") || name.includes("spa")) return "💄";
  if (name.includes("sport")) return "⚽";
  if (name.includes("fashion") || name.includes("clothing")) return "👗";
  if (name.includes("cleaning")) return "🧹";
  if (name.includes("home") || name.includes("repair") || name.includes("maintenance")) return "🛠️";
  if (name.includes("education") || name.includes("learning") || name.includes("tutor")) return "🎓";
  if (name.includes("food") || name.includes("dining") || name.includes("restaurant")) return "🍴";
  if (name.includes("travel") || name.includes("tour")) return "✈️";
  return "📋";
};

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement<any, any> },
  ref: React.Ref<unknown>,
) {
  return <Zoom ref={ref} {...props} />;
});

const ServiceFilterDrawer: React.FC<ServiceFilterDrawerProps> = ({
  categories,
  selectedCategory,
  loading,
  onCategoryClick,
  open,
  onClose
}) => {
  const theme = useTheme();
  const { t } = useTranslate();
  const isDark = theme.palette.mode === "dark";
  const textPrimary = isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT;
  const borderColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";

  const [sortBy, setSortBy] = React.useState("relevance");
  const [minRating, setMinRating] = React.useState<number | null>(0);

  const handleApply = () => {
    onClose();
  };

  const handleClear = () => {
    onCategoryClick(null);
    setSortBy("relevance");
    setMinRating(0);
  };

const SectionTitle = ({ icon, title }: { icon: any, title: string }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, mt: 1 }}>
        {icon}
        <Typography variant="subtitle1" sx={{ 
            fontWeight: 800, 
            color: textPrimary, 
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
            fontSize: '0.75rem'
        }}>
            {title}
        </Typography>
    </Box>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "28px",
          bgcolor: isDark ? "#0f0f0f" : "#fff",
          backgroundImage: "none",
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          fontWeight: 900,
          fontSize: "1.25rem",
          p: 3,
          pb: 2,
          borderBottom: `1px solid ${borderColor}`
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Tune sx={{ color: COLORS.PRIMARY_PURPLE }} />
            FILTERS
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ bgcolor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)" }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column', maxHeight: '75vh' }}>
        <Box sx={{ p: 3, overflowY: 'auto' }}>
            {/* Sort Section */}
            <SectionTitle icon={<Sort sx={{ fontSize: 18, color: COLORS.PRIMARY_PURPLE }} />} title="SORT BY" />
            <RadioGroup value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {['relevance', 'rating', 'newest'].map((item) => (
                        <FormControlLabel 
                            key={item}
                            value={item} 
                            control={<Radio size="small" sx={{ color: COLORS.PRIMARY_PURPLE, '&.Mui-checked': { color: COLORS.PRIMARY_PURPLE } }} />} 
                            label={<Typography sx={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'capitalize' }}>{item}</Typography>} 
                        />
                    ))}
                </Box>
            </RadioGroup>

            <Divider sx={{ my: 3, borderColor }} />

            {/* Rating Section */}
            <SectionTitle icon={<Star sx={{ fontSize: 18, color: "#FFC107" }} />} title="MINIMUM RATING" />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 1 }}>
                <Rating 
                    value={minRating} 
                    onChange={(_, val) => setMinRating(val)}
                    sx={{ color: "#FFC107" }}
                />
                <Typography sx={{ fontWeight: 800, color: textPrimary, fontSize: '1.1rem' }}>{minRating}+</Typography>
            </Box>

            <Divider sx={{ my: 3, borderColor }} />

            {/* Categories Section */}
            <SectionTitle icon={<Widgets sx={{ fontSize: 18, color: COLORS.PRIMARY_PURPLE }} />} title="CATEGORIES" />
            <Box sx={{ 
                display: 'flex', 
                gap: 2, 
                overflowX: 'auto', 
                pb: 2,
                px: 0.5,
                "&::-webkit-scrollbar": { display: "none" },
                msOverflowStyle: "none",
                scrollbarWidth: "none",
            }}>
                {categories.map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    return (
                        <Box
                            key={cat.id}
                            onClick={() => onCategoryClick(cat.id)}
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 1.5,
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                minWidth: 80,
                                p: 1.5,
                                borderRadius: "20px",
                                bgcolor: isSelected ? COLORS.PURPLE_ALPHA_10 : (isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)"),
                                border: `2px solid ${isSelected ? COLORS.PRIMARY_PURPLE : "transparent"}`,
                                "&:hover": { transform: "translateY(-4px)", bgcolor: isSelected ? COLORS.PURPLE_ALPHA_10 : (isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)") }
                            }}
                        >
                            <Box sx={{
                                width: 52,
                                height: 52,
                                borderRadius: "16px",
                                bgcolor: isDark ? "rgba(255,255,255,0.05)" : "#fff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "1.75rem",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                            }}>
                                {getCategoryIcon(cat.name)}
                            </Box>
                            <Typography sx={{ 
                                fontSize: "0.75rem", 
                                fontWeight: isSelected ? 800 : 600, 
                                textAlign: "center",
                                color: isSelected ? COLORS.PRIMARY_PURPLE : textPrimary,
                                lineHeight: 1.2,
                                maxWidth: 90,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}>
                                {cat.name}
                            </Typography>
                        </Box>
                    );
                })}
            </Box>
        </Box>

        {/* Footer Actions */}
        <Box sx={{ 
            p: 3, 
            display: 'flex', 
            gap: 2, 
            borderTop: `1px solid ${borderColor}`,
            bgcolor: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)"
        }}>
            <Button 
                fullWidth 
                variant="text" 
                onClick={handleClear}
                sx={{ color: "text.secondary", fontWeight: 700, textTransform: 'none', fontSize: '0.95rem' }}
            >
                Clear All
            </Button>
            <Button 
                fullWidth 
                variant="contained" 
                onClick={handleApply}
                sx={{ 
                    bgcolor: COLORS.PRIMARY_PURPLE, 
                    fontWeight: 900, 
                    borderRadius: '16px',
                    textTransform: 'none',
                    py: 1.5,
                    fontSize: '0.95rem',
                    boxShadow: `0 8px 20px ${COLORS.PURPLE_ALPHA_20}`,
                    '&:hover': { bgcolor: COLORS.PURPLE_HOVER }
                }}
            >
                Apply Filters
            </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceFilterDrawer;
