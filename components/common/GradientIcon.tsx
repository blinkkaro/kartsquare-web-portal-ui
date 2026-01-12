"use client";
import React from "react";
import { SvgIcon, SvgIconProps, useTheme } from "@mui/material";
import { COLORS } from "../../constants/colors";

interface GradientIconProps extends Omit<SvgIconProps, "children"> {
  children: React.ReactNode;
  gradientId?: string;
  startColor?: string;
  endColor?: string;
}

const GradientIcon: React.FC<GradientIconProps> = ({
  children,
  gradientId,
  startColor = COLORS.ICON_GRADIENT.Light.START,
  endColor = COLORS.ICON_GRADIENT.Light.END,
  sx,
  ...props
}) => {
  const generatedId = React.useId();
  const uniqueId = gradientId || `gradient-${generatedId.replace(/:/g, "")}`;
  const theme = useTheme();
  return (
    <>
      <svg
        width={0}
        height={0}
        style={{
          position: "absolute",
          visibility: "hidden",
          pointerEvents: "none",
        }}
      >
        <defs>
          <linearGradient id={uniqueId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={theme.palette.mode === "dark" ? COLORS.ICON_GRADIENT.Dark.START : COLORS.ICON_GRADIENT.Light.START} />
            <stop offset="100%" stopColor={theme.palette.mode === "dark" ? COLORS.ICON_GRADIENT.Dark.END : COLORS.ICON_GRADIENT.Light.END} />
          </linearGradient>
        </defs>
      </svg>
      {React.isValidElement(children) &&
        React.cloneElement(children as React.ReactElement<any>, {
          ...props,
          sx: {
            ...(children as React.ReactElement<any>).props.sx,
            ...sx,
            fill: `url(#${uniqueId})`,
            // Also target internal paths just in case the icon uses currentColor on paths
            "& path": {
              fill: `url(#${uniqueId})`,
            },
          },
        })}
    </>
  );
};

export default GradientIcon;
