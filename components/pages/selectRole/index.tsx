"use client";
import React from "react";
import Roles from "./components/Roles";
import { rolesData } from "./components/data";
import Link from "next/link";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import AuthCarouselWrapper from "@/components/auth/authCarouselWrapper";
import { useTranslate } from "@/hooks/useTranslate";

function SelectRole() {
  const { t } = useTranslate();
  const carouselItems = [
    {
      image: "/auth/Home.JPG",
      title: t("selectRoleHomeTitle"),
      subtitle: t("selectRoleHomeSubtitle"),
    },
    {
      image: "/auth/Home_Map.svg",
      title: t("selectRoleMapTitle"),
      subtitle: t("selectRoleMapSubtitle"),
    },
    {
      image: "/auth/Bookings.svg",
      title: t("selectRoleBookingTitle"),
      subtitle: t("selectRoleBookingSubtitle"),
    },
  ];
  return (
    <AuthCarouselWrapper carouselItems={carouselItems}>
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
    </AuthCarouselWrapper>
  );
}

export default SelectRole;
