'use client';
import React, { ReactNode } from "react";
import {
  TextField,
  InputAdornment,
  TextFieldProps,
  useTheme,
} from "@mui/material";
import { Controller, Control } from "react-hook-form";

interface InputProps extends Omit<TextFieldProps, "name"> {
  name: string;
  control: Control<any>;
  label?: string; // Optional custom label handling if needed, though TextField has one
  startIcon?: ReactNode;
  endIcon?: ReactNode;
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

  const defaultInputSx = {
    borderRadius: "12px",
    bgcolor: "background.paper",
    "& input:-webkit-autofill": {
      WebkitBoxShadow: `0 0 0 1000px ${theme.palette.background.paper} inset`,
      WebkitTextFillColor: theme.palette.text.primary,
      caretColor: theme.palette.text.primary,
    },
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          {...props}
          fullWidth
          variant="outlined"
          error={!!error}
          helperText={error?.message}
          InputProps={{
            ...InputProps,
            startAdornment: startIcon ? (
              <InputAdornment position="start">{startIcon}</InputAdornment>
            ) : null,
            endAdornment: endIcon ? (
              <InputAdornment position="end">{endIcon}</InputAdornment>
            ) : null,
            sx: {
              ...defaultInputSx,
              ...(typeof InputProps?.sx === "object" ? InputProps.sx : {}),
            },
          }}
          sx={{
            ...sx,
          }}
        />
      )}
    />
  );
};

export default Input;
