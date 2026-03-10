"use client";
import React, { useState } from "react";
import { useTranslate } from "@/hooks/useTranslate";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  Box,
  Slide,
  useTheme,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";

import { closeLoginModal } from "@/features/ui/loginModalSlice";
import { authService } from "@/services/auth/auth.service";
import { secureStorage } from "@/helper/SecureStorage";

import WarningView from "./components/WarningView";
import GuestFormView from "./components/GuestFormView";
import { guestLoginSchema, GuestLoginFormData } from "./guestLogin.schema";

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

function LoginModal() {
  const dispatch = useDispatch();
  const { isOpen } = useSelector((state: { loginModal: { isOpen: boolean } }) => state.loginModal);
  const theme = useTheme();
  const { t } = useTranslate();

  const [view, setView] = useState<"warning" | "guest">("warning");
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<GuestLoginFormData>({
    mode: "onChange",
    resolver: yupResolver(guestLoginSchema(t as any)),
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

  const onSubmitGuest = async (data: GuestLoginFormData) => {
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
        
        toast.success(resData.message || (res as any).message || "Guest Login Successful");
        handleClose();
        window.location.href = "/"; // Refresh and redirect
      }
    } catch (error) {
      console.log(error);
      const err = error as {response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Something went wrong during guest login");
    } finally {
      setLoading(false);
    }
  };

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
         <GuestFormView
            control={control}
            handleSubmit={handleSubmit}
            onSubmitGuest={onSubmitGuest}
            loading={loading}
            isSubmitting={isSubmitting}
            onBack={() => setView("warning")}
         />
       </Box>
      </Slide>
      
      <Slide direction="right" in={view === "warning"} mountOnEnter unmountOnExit>
        <Box style={{ display: view === "warning" ? "block" : "none" }}>
          <WarningView
            onClose={handleClose}
            onContinueAsGuest={() => setView("guest")}
          />
        </Box>
      </Slide>
    </Dialog>
  );
}

export default LoginModal;
