"use client";
import React from "react";
import Roles from "./components/Roles";
import { rolesData } from "./components/data";
import Link from "next/link";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import AuthWrapper from "@/components/auth/authWrapper";
import { COLORS } from "@/constants/colors";

function SelectRole() {
  return (
    <AuthWrapper>
      <Box
        sx={{
          display: { xs: "flex", lg: "none" },
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          mb: "2rem",
        }}
      >
        <Image src="/logo.svg" alt="auth" width={150} height={150} priority />
        <Typography
          variant="h4"
          sx={{ fontWeight: 500, color: "text.primary" }}
        >
          kartsquare
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {rolesData.map((role) => (
          <Link
            href={`/login?role=${role.name}`}
            key={role.name}
            style={{ textDecoration: "none" }}
          >
            <Roles rolesData={role} />
          </Link>
        ))}
      </Box>
    </AuthWrapper>
  );
}

export default SelectRole;
