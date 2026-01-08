"use client";
import React, { useRef, useState, KeyboardEvent, ClipboardEvent } from "react";
import { Box, styled } from "@mui/material";
import { COLORS } from "@/constants/colors";

const OTP_LENGTH = 6;

const StyledInput = styled("input")(({ theme }) => ({
  width: "5rem",
  height: "4rem",
  borderRadius: "45%",
  border: `1px solid ${theme.palette.divider}`,
  textAlign: "center",
  fontSize: "1.25rem",
  fontWeight: 600,
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.background.paper,
  outline: "none",
  transition: "all 0.2s ease-in-out",
  boxShadow: `0px 4px 8px ${COLORS.SHADOW.DEFAULT}`,
  "&:focus": {
    borderColor: COLORS.BORDER.BLUE,
    boxShadow: `0px 4px 8px ${COLORS.SHADOW.DEFAULT}`,
    transform: "translateY(-1px)",
  },
  // Hide number spinners
  "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
    WebkitAppearance: "none",
    margin: 0,
  },
  "&[type=number]": {
    MozAppearance: "textfield",
  },
}));

interface OtpInputProps {
  length?: number;
  onChange: (otp: string) => void;
}

function OtpInput({ length = OTP_LENGTH, onChange }: OtpInputProps) {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    // Take the last character if multiple are typed
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    const otpString = newOtp.join("");
    if (onChange) onChange(otpString);

    // Focus next input
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // Move to previous if current is empty
        inputRefs.current[index - 1]?.focus();
      } else if (otp[index]) {
        // If current has value, just clear it (default behavior) but we might want to ensure state updates
        // Note: handleChange handles the value update. Backspace on non-empty just clears it.
        // If we want backspace to clear AND move back if empty, we need to handle it carefully.
        // Standard behavior: Backspace clears current. 2nd Backspace moves back.
      }
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .slice(0, length)
      .split("");
    if (pastedData.every((char) => !isNaN(Number(char)))) {
      const newOtp = [...otp];
      pastedData.forEach((char, i) => {
        newOtp[i] = char;
      });
      setOtp(newOtp);

      const otpString = newOtp.join("");
      if (onChange) onChange(otpString);

      // Focus the last filled input or the first empty one
      const nextFocusIndex = Math.min(pastedData.length, length - 1);
      inputRefs.current[nextFocusIndex]?.focus();
    }
  };

  return (
    <Box sx={{ display: "flex", gap: 2, justifyContent: "center", py: 2 }}>
      {otp.map((digit, index) => (
        <StyledInput
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          autoComplete="one-time-code"
        />
      ))}
    </Box>
  );
}

export default OtpInput;
