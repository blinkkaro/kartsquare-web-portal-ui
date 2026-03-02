"use client";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  Box,
  Typography,
  Slide,
  useTheme,
  IconButton,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import { ArrowBack } from "@mui/icons-material";

import { useTranslate } from "@/hooks/useTranslate";
import { closeLoginModal } from "@/features/ui/loginModalSlice";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { authService } from "@/services/auth/auth.service";
import { secureStorage } from "@/helper/SecureStorage";

interface SafeAuthResponse {
  tokens?: { access_token: string; refresh_token: string };
  user?: { role: string; register_step: number };
  message?: string;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const schema = yup.object().shape({
  first_name: yup.string().required("First name is required").min(2, "Too short"),
  last_name: yup.string().required("Last name is required").min(2, "Too short"),
  email: yup.string().email("Invalid email").required("Email is required"),
  country_code: yup.string().required("Country code is required"),
  phone_number: yup.string().required("Phone number is required").matches(/^\d{8,15}$/, "Invalid phone number"),
  password: yup.string().required("Password is required").min(6, "Must be at least 6 characters"),
  country: yup.string().required("Country is required"),
});

function LoginModal() {
  const dispatch = useDispatch();
  const { isOpen } = useSelector((state: { loginModal: { isOpen: boolean } }) => state.loginModal);
  const { t } = useTranslate();
  const router = useRouter();
  const theme = useTheme();

  const [view, setView] = useState<"warning" | "guest">("warning");
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      country_code: "+91",
      phone_number: "",
      password: "",
      country: "India",
    },
  });

  const handleClose = () => {
    dispatch(closeLoginModal());
    // Reset state after transition
    setTimeout(() => {
      setView("warning");
      reset();
    }, 300);
  };

  const onSubmitGuest = async (data: yup.InferType<typeof schema>) => {
    try {
      setLoading(true);
      const res = await authService.guestLogin(data);
      const resData = (res as unknown as { data?: SafeAuthResponse }).data || (res as unknown as SafeAuthResponse);
      
      if (resData?.tokens) {
        secureStorage.setItem("token", resData.tokens.access_token);
        secureStorage.setItem("refreshToken", resData.tokens.refresh_token);
        secureStorage.setItem("role", resData.user?.role || "");
        secureStorage.setItem("register_step", resData.user?.register_step?.toString() || "0");
        secureStorage.setItem("user_details", JSON.stringify(resData.user || {}));
        
        toast.success(resData.message || res.message || "Guest Login Successful");
        handleClose();
        router.push("/");
      }
    } catch (error) {
      const err = error as { message?: string };
      toast.error(err.message || "Something went wrong during guest login");
    } finally {
      setLoading(false);
    }
  };

  const WarningView = () => (
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
            handleClose();
          }}
          sx={{ borderRadius: "50px", py: 1.5 }}
        >
          {t("login")}
        </Button>
        <Button
          variant="outlined"
          fullWidth
          onClick={() => setView("guest")}
          sx={{ borderRadius: "50px", py: 1.5 }}
        >
          Continue as Guest
        </Button>
      </Box>
    </Box>
  );

  const GuestFormView = () => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <IconButton onClick={() => setView("warning")} sx={{ ml: -1 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Guest Login
        </Typography>
      </Box>

      <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
        Provide your details quickly to explore as a guest.
      </Typography>

      <form onSubmit={handleSubmit(onSubmitGuest)}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 2 }}>
          <Box sx={{ gridColumn: 'span 6' }}>
            <Input
              name="first_name"
              control={control}
              placeholder="First Name"
              label="First Name"
            />
          </Box>
          <Box sx={{ gridColumn: 'span 6' }}>
            <Input
              name="last_name"
              control={control}
              placeholder="Last Name"
              label="Last Name"
            />
          </Box>
          <Box sx={{ gridColumn: 'span 12' }}>
            <Input
              name="email"
              control={control}
              placeholder="Email Address"
              label="Email"
              type="email"
            />
          </Box>
          <Box sx={{ gridColumn: 'span 4' }}>
            <Input
              name="country_code"
              control={control}
              placeholder="+91"
              label="Code"
            />
          </Box>
          <Box sx={{ gridColumn: 'span 8' }}>
            <Input
              name="phone_number"
              control={control}
              placeholder="Phone Number"
              label="Phone Number"
              type="tel"
            />
          </Box>
          <Box sx={{ gridColumn: 'span 12' }}>
            <Input
              name="country"
              control={control}
              placeholder="Country"
              label="Country"
            />
          </Box>
          <Box sx={{ gridColumn: 'span 12' }}>
            <Input
              name="password"
              control={control}
              placeholder="Password"
              label="Password"
              type="password"
            />
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
          <Button
            variant="contained"
            fullWidth
            type="submit"
            isLoading={loading || isSubmitting}
            sx={{ borderRadius: "50px", py: 1.5 }}
          >
            Submit
          </Button>
        </Box>
      </form>
    </Box>
  );

  return (
    <Dialog
      open={isOpen}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="auth-modal-description"
      PaperProps={{
        sx: {
          borderRadius: "24px",
          padding: { xs: "2rem 1.5rem", sm: "2rem 3rem" },
          maxWidth: "32rem",
          width: "100%",
          boxShadow: theme.palette.mode === "dark" 
            ? "0px 10px 40px rgba(0,0,0,0.5)" 
            : "0px 10px 40px rgba(0,0,0,0.1)",
          margin: "16px",
          backgroundImage: "none",
        },
      }}
    >
      <Slide direction="left" in={view === "guest"} mountOnEnter unmountOnExit>
       <Box style={{ display: view === "guest" ? "block" : "none" }}>
         {GuestFormView()}
       </Box>
      </Slide>
      
      <Slide direction="right" in={view === "warning"} mountOnEnter unmountOnExit>
        <Box style={{ display: view === "warning" ? "block" : "none" }}>
          {WarningView()}
        </Box>
      </Slide>
    </Dialog>
  );
}

export default LoginModal;
