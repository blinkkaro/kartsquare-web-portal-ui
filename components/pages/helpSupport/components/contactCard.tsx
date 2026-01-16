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
  return (
    <Box
      sx={{
        backgroundColor: theme.palette.mode === "dark" ? COLORS.BACKGROUND.PRIMARY_DARK : COLORS.BACKGROUND.PRIMARY_LIGHT,
        p: 3,
        borderRadius: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0px 2px 6px rgba(0,0,0,0.02)",
      }}
    >
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 0.5 }}>
          {title}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {subtitle}
        </Typography>
      </Box>
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: COLORS.ICON_GRADIENT.Light.START, // Fallback or gradient
          backgroundImage: `linear-gradient(135deg, ${COLORS.ICON_GRADIENT.Light.START} 0%, ${COLORS.ICON_GRADIENT.Light.END} 100%)`,
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
