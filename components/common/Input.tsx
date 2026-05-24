"use client";
import React, { ReactNode, useState } from "react";
import {
  TextField,
  InputAdornment,
  TextFieldProps,
  useTheme,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Controller, Control } from "react-hook-form";
import { COLORS } from "@/constants/colors";

interface InputProps extends Omit<TextFieldProps, "name"> {
  name: string;
  control: Control<any>;
  label?: string; // Optional custom label handling if needed, though TextField has one
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  disableUnderline?: boolean;
  children?: ReactNode;
}

const Input: React.FC<InputProps> = ({
  name,
  control,
  startIcon,
  endIcon,
  sx,
  InputProps,
  children,
  ...props
}) => {
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  const isPassword = props.type === "password";
  const inputType = isPassword
    ? showPassword
      ? "text"
      : "password"
    : props.type;

  const defaultInputSx = {
    borderRadius: "12px",
    bgcolor: "transparent",
    "& input:-webkit-autofill": {
      WebkitBoxShadow: `0 0 0 1000px ${theme.palette.background.paper} inset`,
      WebkitTextFillColor: theme.palette.text.primary,
      caretColor: theme.palette.text.primary,
    },
    "& .MuiInputBase-input": {
      padding: "10px 14px",
      [theme.breakpoints.up("lg")]: {
        fontSize: "0.875rem",
      },
      [theme.breakpoints.up("xl")]: {
        fontSize: "1rem",
      },
    },
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          variant="outlined"
          fullWidth
          {...field}
          value={field.value ?? ""}
          {...props}
          type={inputType}
          error={!!error}
          helperText={error?.message}
          FormHelperTextProps={{
            sx: {
              position: error ? "absolute" : "relative",
              bottom: error ? "-18px" : "auto",
              left: 0,
              margin: 0,
              fontSize: "0.75rem",
              lineHeight: 1,
            },
          }}
          InputProps={{
            ...InputProps,
            startAdornment: startIcon ? (
              <InputAdornment position="start" sx={{ mr: 0.5 }}>
                {startIcon}
              </InputAdornment>
            ) : (
              InputProps?.startAdornment
            ),
            endAdornment: isPassword ? (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ) : endIcon ? (
              <InputAdornment position="end">{endIcon}</InputAdornment>
            ) : (
              InputProps?.endAdornment
            ),
            sx: {
              ...defaultInputSx,
              ...(typeof InputProps?.sx === "object" ? InputProps.sx : {}),
            },
          }}
          sx={{
            "& .MuiInputLabel-root": {
              transform: "translate(14px, 10px) scale(1)",
              "&.Mui-focused, &.MuiFormLabel-filled": {
                transform: "translate(14px, -9px) scale(0.75)",
              },
            },
            "& .MuiInputBase-input[type='date'], & .MuiInputBase-input[type='time'], & .MuiInputBase-input[type='datetime-local']":
              {
                colorScheme: theme.palette.mode === "dark" ? "dark" : "light",
              },
            bgcolor: theme.palette.mode === "dark" ? COLORS.BACKGROUND.PRIMARY_DARK : COLORS.WHITE,
            borderRadius: "12px",
            ...sx,
          }}
        >
          {children}
        </TextField>
      )}
    />
  );
};

export default Input;
