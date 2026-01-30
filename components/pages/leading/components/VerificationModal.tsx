import React from "react";
import {
  Dialog,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Slide,
  useTheme,
  IconButton,
} from "@mui/material";
import { LockOutlined, Close } from "@mui/icons-material";
import type { TransitionProps } from "@mui/material/transitions";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface VerificationModalProps {
  open: boolean;
  onClose: () => void;
  onVerify: (otp: string) => void;
  loading: boolean;
}

const VerificationModal: React.FC<VerificationModalProps> = ({
  open,
  onClose,
  onVerify,
  loading,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { t } = useTranslate();
  const [otp, setOtp] = React.useState("");

  const handleClose = () => {
    if (!loading) {
      setOtp("");
      onClose();
    }
  };

  const handleVerify = () => {
    if (otp.length === 6) {
      onVerify(otp);
    }
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      PaperProps={{
        sx: {
          borderRadius: "24px",
          padding: { xs: "2rem 1.5rem", sm: "2rem 4rem" },
          maxWidth: "28rem",
          width: "100%",
          boxShadow: "0px 10px 40px rgba(0,0,0,0.1)",
          margin: "16px",
          position: "relative",
        },
      }}
    >
      <IconButton
        onClick={handleClose}
        disabled={loading}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: "text.secondary",
        }}
      >
        <Close />
      </IconButton>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            bgcolor: `${COLORS.PRIMARY_PURPLE}10`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 1,
          }}
        >
          <LockOutlined sx={{ fontSize: 40, color: COLORS.PRIMARY_PURPLE }} />
        </Box>

        <Typography
          variant="h5"
          sx={{ fontWeight: 800, color: "text.primary" }}
        >
          {t("otp_verification")}
        </Typography>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", mb: 2, px: 2 }}
        >
          {t("enter_otp_description")}
        </Typography>

        <TextField
          autoFocus 
          fullWidth
          variant="outlined"
          value={otp}
          onChange={(e) => {
            const val = e.target.value.replace(/[^0-9]/g, "");
            if (val.length <= 6) setOtp(val);
          }}
          disabled={loading}
          inputProps={{
            maxLength: 6,
            style: {
              textAlign: "center",
              fontSize: "1.5rem",
              fontWeight: 700,
              letterSpacing: "8px",
              padding: "12px",
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "16px",
              bgcolor: isDark ? "rgba(255,255,255,0.03)" : "#F9FAFB",
              "& fieldset": {
                borderColor: isDark ? "rgba(255,255,255,0.1)" : "#E5E7EB",
              },
              "&.Mui-focused fieldset": {
                borderColor: COLORS.PRIMARY_PURPLE,
                borderWidth: "2px",
              },
            },
            mb: 3,
          }}
        />

        <Box sx={{ width: "100%", display: "flex", gap: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleClose}
            disabled={loading}
            sx={{
              borderRadius: "12px",
              py: 1.5,
              textTransform: "none",
              fontWeight: 600,
              borderColor: isDark ? "rgba(255,255,255,0.1)" : "#E5E7EB",
              color: isDark ? "white" : "#4B5563",
            }}
          >
            {t("cancel")}
          </Button>
          <Button
            fullWidth
            variant="contained"
            onClick={handleVerify}
            disabled={loading || otp.length < 6}
            sx={{
              borderRadius: "12px",
              py: 1.5,
              textTransform: "none",
              fontWeight: 600,
              bgcolor: COLORS.PRIMARY_PURPLE,
              "&:hover": { bgcolor: COLORS.PURPLE_HOVER },
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              t("verify")
            )}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default VerificationModal;
