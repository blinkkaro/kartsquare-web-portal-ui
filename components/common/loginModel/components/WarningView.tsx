import React from "react";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslate } from "@/hooks/useTranslate";
import Button from "@/components/common/Button";

interface WarningViewProps {
  onClose: () => void;
  onContinueAsGuest: () => void;
}

export const WarningView: React.FC<WarningViewProps> = ({
  onClose,
  onContinueAsGuest,
}) => {
  const { t } = useTranslate();
  const router = useRouter();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: 2,
        py: 2,
      }}
    >
      <Box sx={{ position: "relative", width: 80, height: 80, mb: 1 }}>
        <Image
          src="/warning.svg"
          alt="Warning"
          fill
          style={{ objectFit: "contain" }}
          priority
        />
      </Box>

      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          color: "text.primary",
          lineHeight: 1.3,
          fontSize: { xs: "1.5rem", sm: "1.8rem" },
        }}
      >
        {t("auth_required_title")}
      </Typography>

      <Typography
        variant="body1"
        sx={{
          color: "text.secondary",
          lineHeight: 1.5,
          maxWidth: "90%",
          mx: "auto",
          mb: 2,
        }}
      >
        {t("auth_required_description")}
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, width: "100%" }}>
        <Button
          variant="contained"
          fullWidth
          onClick={() => {
            router.push("/login?role=customer");
            onClose();
          }}
          sx={{ borderRadius: "50px", py: 1.5 }}
        >
          {t("login")}
        </Button>
        <Button
          variant="outlined"
          fullWidth
          onClick={onContinueAsGuest}
          sx={{ borderRadius: "50px", py: 1.5 }}
        >
          {t("continue_as_guest")}
        </Button>
      </Box>
    </Box>
  );
};

export default WarningView;
