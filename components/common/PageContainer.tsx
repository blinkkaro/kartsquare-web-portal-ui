"use client";
import React from "react";
import { Container, ContainerProps } from "@mui/material";

interface PageContainerProps extends Omit<ContainerProps, "maxWidth"> {
  maxWidth?: ContainerProps["maxWidth"];
  children: React.ReactNode;
}

/**
 * Standard page-level wrapper: consistent max-width and vertical padding.
 * Adopt incrementally on pages that currently hand-roll their own outer spacing.
 */
const PageContainer: React.FC<PageContainerProps> = ({
  maxWidth = "lg",
  children,
  sx,
  ...rest
}) => {
  return (
    <Container
      maxWidth={maxWidth}
      sx={{ py: { xs: 3, md: 4 }, ...sx }}
      {...rest}
    >
      {children}
    </Container>
  );
};

export default PageContainer;
