import { COLORS } from "@/constants/colors";
import { Box, Typography, useTheme } from "@mui/material";

const ContactCard = ({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  
  return (
    <Box
      sx={{
        backgroundColor: isDark
          ? COLORS.BACKGROUND.PRIMARY_DARK
          : COLORS.BACKGROUND.PRIMARY_LIGHT,
        p: 3,
        borderRadius: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0px 2px 6px rgba(0,0,0,0.02)",
        border: `1px solid ${
          isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT
        }`,
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0px 4px 12px rgba(0,0,0,0.08)",
        },
      }}
    >
      <Box>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: "bold",
            mb: 0.5,
            color: isDark
              ? COLORS.TEXT.PRIMARY_DARK
              : COLORS.TEXT.PRIMARY_LIGHT,
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: isDark
              ? COLORS.TEXT.SECONDARY_DARK
              : COLORS.TEXT.SECONDARY_LIGHT,
          }}
        >
          {subtitle}
        </Typography>
      </Box>
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: isDark
            ? COLORS.ICON_GRADIENT.Dark.START
            : COLORS.ICON_GRADIENT.Light.START,
          backgroundImage: isDark
            ? `linear-gradient(135deg, ${COLORS.ICON_GRADIENT.Dark.START} 0%, ${COLORS.ICON_GRADIENT.Dark.END} 100%)`
            : `linear-gradient(135deg, ${COLORS.ICON_GRADIENT.Light.START} 0%, ${COLORS.ICON_GRADIENT.Light.END} 100%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
        }}
      >
        <Icon fontSize="small" />
      </Box>
    </Box>
  );
};

export default ContactCard;
