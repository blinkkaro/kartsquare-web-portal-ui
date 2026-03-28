"use client";

import React from "react";
import {
  Box,
  Typography,
  Grid,
  useTheme,
  MenuItem,
  Dialog,
  IconButton,
  Slide,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";
import { Close, RequestQuote } from "@mui/icons-material";
import { TranslationKey } from "@/features/i18n/TranslationContext";
import { countries } from "@/data/countries";
import LeadService from "@/services/leads/lead.service";
import SuccessModel from "@/components/common/SuccessModel";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const schema = (t: (key: TranslationKey) => string) =>
  yup.object().shape({
    first_name: yup
      .string()
      .trim()
      .max(100, t("valNameMax"))
      .required(t("firstNameRequired")),
    last_name: yup
      .string()
      .trim()
      .max(100, t("valNameMax"))
      .required(t("lastNameRequired")),
    email: yup
      .string()
      .trim()
      .email(t("emailInvalid"))
      .lowercase()
      .max(255, t("valEmailMax"))
      .required(t("emailRequired")),
    phone_number: yup
      .string()
      .trim()
      .matches(/^[0-9]+$/, t("phoneNumberInvalid"))
      .length(10, t("valPhoneExact"))
      .required(t("phoneNumberRequired")),
    message: yup
      .string()
      .trim()
      .required(t("messageRequired"))
      .min(10, t("messageIsTooShort"))
      .max(2000, t("valDescMax")),
    country_code: yup.string().trim().required(t("countryCodeRequired")),
  });

type ContactFormValues = {
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  message: string;
  country_code: string;
};

interface GetQuoteModalProps {
  open: boolean;
  onClose: () => void;
  providerId: string;
  serviceName?: string;
  businessName?: string;
}

const GetQuoteModal: React.FC<GetQuoteModalProps> = ({
  open,
  onClose,
  providerId,
  serviceName,
  businessName,
}) => {
  const theme = useTheme();
  const { t } = useTranslate();
  const isDark = theme.palette.mode === "dark";
  const [successModalOpen, setSuccessModalOpen] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: yupResolver(schema(t)),
    defaultValues: {
      first_name: "",
      last_name: "",
      country_code: "+91",
      phone_number: "",
      email: "",
      message: serviceName
        ? `Hi, I am interested in getting a quote for: ${serviceName}`
        : "",
    },
  });

  const selectedCountryCode = watch("country_code");
  const selectedCountry = countries.find(
    (c) => c.phone_code === selectedCountryCode,
  );

  const onSubmit = async (data: ContactFormValues) => {
    try {
      setError(null);
      if (providerId) {
        await LeadService.createLead({
          ...data,
          provider_id: providerId,
        });
        setSuccessModalOpen(true);
        reset();
      } else {
        setError("Provider ID is missing. Please try again later.");
      }
    } catch (err) {
      console.error("Error submitting lead:", err);
      setError("Failed to send message. Please try again.");
    }
  };

  const handleSuccessClose = () => {
    setSuccessModalOpen(false);
    onClose();
  };

  const textPrimary = isDark
    ? COLORS.TEXT.PRIMARY_DARK
    : COLORS.TEXT.PRIMARY_LIGHT;
  const textSecondary = isDark
    ? COLORS.TEXT.SECONDARY_DARK
    : COLORS.TEXT.SECONDARY_LIGHT;

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        TransitionComponent={Transition}
        keepMounted
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "28px",
            bgcolor: isDark ? COLORS.BACKGROUND.SECONDARY_DARK : COLORS.WHITE,
            backgroundImage: "none",
            p: { xs: 3, sm: 5 },
            overflow: "visible",
            boxShadow: isDark
              ? "0 20px 50px rgba(0,0,0,0.5)"
              : "0 20px 50px rgba(94, 24, 233, 0.15)",
          },
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 20,
            top: 20,
            color: textSecondary,
            bgcolor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
            "&:hover": {
              bgcolor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)",
              color: COLORS.PRIMARY_PURPLE,
            },
          }}
        >
          <Close />
        </IconButton>

        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "20px",
              bgcolor: COLORS.PURPLE_ALPHA_10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              boxShadow: `0 8px 16px ${COLORS.PURPLE_ALPHA_10}`,
            }}
          >
            <RequestQuote sx={{ color: COLORS.PRIMARY_PURPLE, fontSize: 36 }} />
          </Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: textPrimary,
              mb: 1,
              fontSize: { xs: "1.5rem", sm: "1.75rem" },
            }}
          >
            {t("getQuote")}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: textSecondary,
              maxWidth: "340px",
              mx: "auto",
              lineHeight: 1.6,
            }}
          >
            {businessName ? `Contact ${businessName} ` : "Send a message "}
            to receive a personalized quote for your needs.
          </Typography>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Input
                name="first_name"
                control={control}
                label={t("first_name")}
                placeholder="John"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Input
                name="last_name"
                control={control}
                label={t("last_name")}
                placeholder="Doe"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Input
                name="email"
                control={control}
                label={t("email")}
                placeholder="john@example.com"
                type="email"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Input
                  name="country_code"
                  control={control}
                  select
                  sx={{ width: "95px" }}
                >
                  {countries.map((option) => (
                    <MenuItem key={option.code} value={option.phone_code}>
                      <Box
                        sx={{ display: "flex", gap: 1, alignItems: "center" }}
                      >
                        <span>{option.flag}</span>
                        <span>{option.phone_code}</span>
                      </Box>
                    </MenuItem>
                  ))}
                </Input>
                <Input
                  name="phone_number"
                  control={control}
                  label={t("phone_number")}
                  placeholder="98765 43210"
                  sx={{ flex: 1 }}
                />
              </Box>
            </Grid>
            <Grid size={12}>
              <Input
                name="message"
                control={control}
                label={t("message")}
                placeholder="Tell us about your requirements..."
                multiline
                minRows={4}
              />
            </Grid>
            {error && (
              <Grid size={12}>
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ fontWeight: 600 }}
                >
                  {error}
                </Typography>
              </Grid>
            )}
            <Grid size={12} sx={{ mt: 1 }}>
              <Button
                type="submit"
                isLoading={isSubmitting}
                fullWidth
                variant="contained"
                sx={{
                  py: 1.8,
                  borderRadius: "12px",
                  bgcolor: COLORS.PRIMARY_PURPLE,
                  fontSize: "1rem",
                  fontWeight: 700,
                  boxShadow: "0 8px 20px rgba(94, 24, 233, 0.3)",
                  "&:hover": {
                    bgcolor: COLORS.PURPLE_HOVER,
                    boxShadow: "0 12px 28px rgba(94, 24, 233, 0.5)",
                  },
                }}
              >
                {t("submit_request")}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Dialog>

      <SuccessModel
        open={successModalOpen}
        onClose={handleSuccessClose}
        title={t("request_sent_successfully")}
        description={t("quote_request_description")}
        actionLabel={t("close")}
        onAction={handleSuccessClose}
      />
    </>
  );
};

export default GetQuoteModal;
