"use client";
import React from "react";
import { Box, Link, Typography } from "@mui/material";
import Image from "next/image";
import NextLink from "next/link";
import BackButton from "@/components/common/BackButton";
import { useTranslate } from "@/hooks/useTranslate";

interface AuthHeaderProps {
  showBack?: boolean;
  onBack?: () => void;
  showSkip?: boolean;
  skipHref?: string;
}

function AuthHeader({ showBack, onBack, showSkip, skipHref = "/" }: AuthHeaderProps) {
  const { t } = useTranslate();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 1,
        mb: { xs: 3, lg: 10 },
        mt: { xs: 0, lg: 8 },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        {showBack && <BackButton onClick={onBack} />}
        <Box
          sx={{
            display: { xs: "flex", lg: "none" },
            alignItems: "center",
            gap: 1,
          }}
        >
          <Image
            src="/logo.svg"
            alt="Kartsquare"
            width={28}
            height={28}
            priority
          />
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: "1.1rem",
              letterSpacing: "-0.02em",
            }}
          >
            Kartsquare
          </Typography>
        </Box>
      </Box>

      {showSkip && (
        <Link
          component={NextLink}
          href={skipHref}
          style={{
            textDecoration: "none",
            color: "inherit",
            fontWeight: 700,
            borderBottom: "1px solid",
          }}
          sx={{
            fontSize: { xs: "0.875rem", sm: "1rem" },
          }}
        >
          {t("skip")}
        </Link>
      )}
    </Box>
  );
}

export default AuthHeader;
