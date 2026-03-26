import React from "react";
import { Box, Typography, Button, CircularProgress, MenuItem, useTheme } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckIcon from "@mui/icons-material/Check";
import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import { useTranslate } from "@/hooks/useTranslate";
import { COLORS } from "@/constants/colors";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from "@/components/common/Input";
import { countries } from "@/data/countries";
import { useLeadVerification } from "@/hooks/useLeadVerification";
import VerificationModal from "./VerificationModal";
import ErrorMessage from "@/components/common/ErrorMessage";

const PURPLE = COLORS.PRIMARY_PURPLE;
const PURPLE_HOVER = COLORS.PURPLE_HOVER;
const PURPLE_ALPHA_04 = COLORS.PURPLE_ALPHA_04;

const heroSchema = (t: any) =>
    yup.object().shape({
        whatsapp_number: yup
            .string()
            .required(t("phoneNumberRequired"))
            .length(10, t("phoneNumberLength"))
            .matches(/^[0-9]+$/, t("phoneNumberInvalid")),
        whatsapp_country_code: yup.string().required(t("countryCodeRequired")),
    });

type HeroFormData = {
    whatsapp_number: string;
    whatsapp_country_code: string;
};

interface LeadCaptureFormProps {
    // Optional props for customizing styling if needed
    sx?: any;
}

const LeadCaptureForm: React.FC<LeadCaptureFormProps> = ({ sx }) => {
    const { t } = useTranslate();
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const [role, setRole] = React.useState<"SERVICE_PROVIDER" | "SUPPLIER">("SERVICE_PROVIDER");
    const {
        loading,
        isOtpOpen,
        error,
        handleCheckUser,
        handleVerifyOtp,
        closeOtpModal,
    } = useLeadVerification();

    const { control, handleSubmit } = useForm<HeroFormData>({
        resolver: yupResolver(heroSchema(t)),
        defaultValues: {
            whatsapp_number: "",
            whatsapp_country_code: "+91",
        },
    });

    const onSubmit = (data: HeroFormData) => {
        handleCheckUser({
            whatsapp_number: data.whatsapp_number,
            whatsapp_country_code: data.whatsapp_country_code,
            source: "WEB",
            source_type: role,
        });
    };

    const businessTypes = [
        {
            value: "SERVICE_PROVIDER" as const,
            label: t("service_provider"),
            examples: t("serviceProviderExamples"),
            Icon: BuildOutlinedIcon,
        },
        {
            value: "SUPPLIER" as const,
            label: t("supplier"),
            examples: t("supplierExamples"),
            Icon: Inventory2OutlinedIcon,
        },
    ];

    return (
        <Box sx={{ width: "100%", ...sx }}>
            <ErrorMessage isVisible={!!error} error={error || ""} />

            <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                    alignItems: "stretch",
                }}
            >
                {/* Phone Input Layer */}
                <Box>
                    <Typography
                        variant="subtitle2"
                        sx={{
                            display: "block",
                            mb: 1,
                            color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                            fontWeight: 600,
                        }}
                    >
                        {t("mobileNumber")}
                    </Typography>
                    <Box
                        sx={{
                            display: "flex",
                            gap: 1.5,
                            alignItems: "stretch",
                            flexWrap: { xs: "wrap", sm: "nowrap" },
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                border: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : "rgba(94, 24, 233, 0.15)"}`,
                                borderRadius: 2,
                                overflow: "hidden",
                                bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : "#fff",
                                minHeight: 52,
                                flexShrink: 0,
                                "&:focus-within": {
                                    borderColor: PURPLE,
                                    boxShadow: `0 0 0 3px ${PURPLE_ALPHA_04}`,
                                },
                                transition: "border-color 0.2s, box-shadow 0.2s",
                            }}
                        >
                            <Input
                                name="whatsapp_country_code"
                                control={control}
                                select
                                variant="standard"
                                InputProps={{
                                    disableUnderline: true,
                                    sx: {
                                        minWidth: 100,
                                        "& .MuiSelect-select": {
                                            py: 1.5,
                                            pl: 2,
                                            pr: "32px !important",
                                            fontWeight: 600,
                                            fontSize: "1rem",
                                            color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                                        },
                                    },
                                }}
                            >
                                {countries.map((country) => (
                                    <MenuItem key={country.code} value={country.phone_code}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <span>{country.flag}</span>
                                            <span>{country.phone_code}</span>
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Input>
                        </Box>
                        <Box
                            sx={{
                                flex: 1,
                                minWidth: 0,
                                display: "flex",
                                alignItems: "center",
                                border: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : "rgba(94, 24, 233, 0.15)"}`,
                                borderRadius: 2,
                                px: 2,
                                minHeight: 52,
                                bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : "#fff",
                                "&:focus-within": {
                                    borderColor: PURPLE,
                                    boxShadow: `0 0 0 3px ${PURPLE_ALPHA_04}`,
                                },
                                transition: "border-color 0.2s, box-shadow 0.2s",
                            }}
                        >
                            <Input
                                name="whatsapp_number"
                                control={control}
                                placeholder={t("yourNumber") || "Your Phone number"}
                                variant="standard"
                                type="tel"
                                inputMode="numeric"
                                inputProps={{ maxLength: 10 }}
                                InputProps={{
                                    disableUnderline: true,
                                    sx: {
                                        py: 0.5,
                                        color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                                        fontSize: "1rem",
                                        fontWeight: 500,
                                    },
                                }}
                                sx={{ "& .MuiInputBase-root": { width: "100%" } }}
                            />
                        </Box>
                    </Box>
                </Box>

                {/* Business type Selection Layer */}
                <Box>
                    <Typography
                        variant="subtitle2"
                        sx={{
                            display: "block",
                            mb: 1.5,
                            color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                            fontWeight: 600,
                        }}
                    >
                        {t("chooseBusinessType") || "What describes you best?"}
                    </Typography>
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                            gap: 2,
                        }}
                    >
                        {businessTypes.map((opt) => {
                            const isSelected = role === opt.value;
                            const Icon = opt.Icon;
                            return (
                                <Box
                                    key={opt.value}
                                    component="button"
                                    type="button"
                                    onClick={() => setRole(opt.value)}
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "stretch",
                                        gap: 1.5,
                                        textAlign: "left",
                                        px: 2,
                                        py: 2,
                                        borderRadius: 3,
                                        border: `1px solid ${isSelected ? "transparent" : isDark ? COLORS.BORDER.DEFAULT_DARK : "rgba(94, 24, 233, 0.12)"}`,
                                        bgcolor: isSelected
                                            ? (isDark ? "rgba(94, 24, 233, 0.12)" : "#F2E8FF") // Light purple as seen in screenshot
                                            : isDark
                                                ? COLORS.BACKGROUND.PAPER_DARK
                                                : "#fff",
                                        cursor: "pointer",
                                        outline: "none",
                                        transition: "all 0.25s ease",
                                        position: "relative",
                                        overflow: "hidden",
                                        boxShadow: isSelected
                                            ? (isDark ? "0 4px 20px rgba(94, 24, 233, 0.15)" : "none")
                                            : "none",
                                        "&::before": {
                                            content: '""',
                                            position: "absolute",
                                            left: 0,
                                            top: 0,
                                            bottom: 0,
                                            width: isSelected ? 4 : 0,
                                            bgcolor: PURPLE,
                                            transition: "width 0.2s ease",
                                        },
                                        "&:hover": {
                                            borderColor: isSelected ? "transparent" : PURPLE,
                                            transform: "translateY(-2px)",
                                            boxShadow: isDark ? "none" : "0 8px 24px rgba(94, 24, 233, 0.08)",
                                        },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            gap: 2,
                                        }}
                                    >
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1, minWidth: 0 }}>
                                            <Box
                                                sx={{
                                                    width: 48,
                                                    height: 48,
                                                    borderRadius: "14px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    flexShrink: 0,
                                                    bgcolor: isSelected
                                                        ? "rgba(94, 24, 233, 0.12)"
                                                        : isDark
                                                            ? "rgba(255,255,255,0.06)"
                                                            : "rgba(94, 24, 233, 0.06)",
                                                    color: isSelected ? PURPLE : (isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT),
                                                    transition: "background-color 0.25s ease, color 0.25s ease",
                                                }}
                                            >
                                                <Icon sx={{ fontSize: 26 }} />
                                            </Box>
                                            <Typography
                                                sx={{
                                                    fontWeight: 700,
                                                    fontSize: "1.125rem",
                                                    color: isSelected ? PURPLE : (isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT),
                                                    fontFamily: "var(--font-heading)",
                                                }}
                                            >
                                                {opt.label}
                                            </Typography>
                                        </Box>
                                        <Box
                                            sx={{
                                                width: 24,
                                                height: 24,
                                                borderRadius: "50%",
                                                border: `2px solid ${isSelected ? PURPLE : isDark ? COLORS.BORDER.DEFAULT_DARK : "rgba(94, 24, 233, 0.25)"}`,
                                                bgcolor: isSelected ? PURPLE : "transparent",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                flexShrink: 0,
                                                transition: "all 0.2s ease",
                                                color: "#fff",
                                            }}
                                        >
                                            {isSelected && <CheckIcon sx={{ fontSize: 16, strokeWidth: 2 }} />}
                                        </Box>
                                    </Box>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontSize: "0.875rem",
                                            lineHeight: 1.5,
                                            color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                                            display: "block",
                                            pl: 0.5,
                                        }}
                                    >
                                        {opt.examples}
                                    </Typography>
                                </Box>
                            );
                        })}
                    </Box>
                </Box>

                {/* Action Layer */}
                <Box sx={{ mt: 1 }}>
                    <Button
                        type="submit"
                        disabled={loading}
                        variant="contained"
                        endIcon={loading ? <CircularProgress size={22} color="inherit" /> : <ArrowForwardIcon sx={{ fontSize: 22 }} />}
                        fullWidth
                        sx={{
                            bgcolor: PURPLE,
                            color: "#fff",
                            py: 2,
                            borderRadius: 2.5,
                            textTransform: "none",
                            fontWeight: 700,
                            fontSize: "1.125rem",
                            fontFamily: "var(--font-heading)",
                            boxShadow: `0 8px 24px ${PURPLE}40`,
                            "&:hover": {
                                bgcolor: PURPLE_HOVER,
                                boxShadow: `0 12px 32px ${PURPLE}60`,
                                transform: "translateY(-2px)",
                            },
                            transition: "all 0.25s ease",
                        }}
                    >
                        {t("startNow")}
                    </Button>
                    <Typography
                        variant="body2"
                        sx={{
                            textAlign: "center",
                            mt: 2.5,
                            color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                            fontSize: "0.875rem",
                        }}
                    >
                        {t("freeForever") || "Free forever • No credit card required"}
                    </Typography>
                </Box>
            </Box>

            <VerificationModal
                open={isOtpOpen}
                onClose={closeOtpModal}
                onVerify={handleVerifyOtp}
                loading={loading}
            />
        </Box>
    );
};

export default LeadCaptureForm;
