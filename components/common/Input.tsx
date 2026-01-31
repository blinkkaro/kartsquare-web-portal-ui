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

interface InputProps extends Omit<TextFieldProps, "name"> {
  name: string;
  control: Control<any>;
  label?: string; // Optional custom label handling if needed, though TextField has one
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  disableUnderline?: boolean;
}

const Input: React.FC<InputProps> = ({
  name,
  control,
  startIcon,
  endIcon,
  sx,
  InputProps,
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
    bgcolor: "background.paper",
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
          InputProps={{
            ...InputProps,
            startAdornment: startIcon ? (
              <InputAdornment position="start" sx={{ mr: 0.5 }}>
                {startIcon}
              </InputAdornment>
            ) : null,
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
            ) : null,
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
            ...sx,
          }}
        />
      )}
    />
  );
};

export default Input;
