"use client";
import React from "react";
import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
  styled,
} from "@mui/material";
import LogoLoader from "./Loader/LogoLoader";
import { COLORS } from "../../constants/colors";

interface ButtonProps extends MuiButtonProps {
  isLoading?: boolean;
  variant?: "contained" | "outlined" | "text";
}

const StyledButton = styled(MuiButton)<ButtonProps>(
  ({ theme, variant, fullWidth }) => ({
    borderRadius: "30px", // Rounded shape as per design
    textTransform: "none",
    fontWeight: 600,
    fontSize: "0.875rem",
    padding: "8px 20px",
    [theme.breakpoints.up("xl")]: {
      fontSize: "1rem",
      padding: "10px 24px",
    },
    transition: "all 0.2s ease-in-out",
    ...(fullWidth && { width: "100%" }),
    boxShadow:
      variant === "contained" ? "0px 4px 12px rgba(94, 24, 233, 0.2)" : "none",

    ...(variant === "contained" && {
      backgroundColor: COLORS.PRIMARY_PURPLE,
      color: COLORS.WHITE,
      "&:hover": {
        backgroundColor: COLORS.PRIMARY_PURPLE, // Slightly darker shade
        boxShadow: "0px 6px 16px rgba(94, 24, 233, 0.3)",
      },
      "&:disabled": {
        backgroundColor: theme.palette.action.disabledBackground,
        color: theme.palette.text.disabled,
        opacity: 0.7,
      },
    }),

    ...(variant === "outlined" && {
      borderColor: COLORS.PRIMARY_PURPLE,
      color: COLORS.PRIMARY_PURPLE,
      "&:hover": {
        backgroundColor: COLORS.PURPLE_ALPHA_04,
        borderColor: theme.palette.primary.dark,
      },
    }),

    ...(variant === "text" && {
      color: COLORS.PRIMARY_PURPLE,
      "&:hover": {
        backgroundColor: COLORS.PURPLE_ALPHA_04,
      },
    }),
  })
);

const Button: React.FC<ButtonProps> = ({
  children,
  isLoading,
  disabled,
  variant = "contained",
  ...props
}) => {
  return (
    <StyledButton variant={variant} disabled={disabled || isLoading} {...props}>
      {isLoading ? (
        <LogoLoader size={24} />
      ) : (
        children
      )}
    </StyledButton>
  );
};

export default Button;
