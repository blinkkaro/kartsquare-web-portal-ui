"use client";

import React from "react";
import Link from "next/link";
import { Box } from "@mui/material";
import { AddRounded, CampaignRounded, EventRounded } from "@mui/icons-material";
import Button from "@/components/common/Button";
import { useTranslate } from "@/hooks/useTranslate";
import { DASHBOARD_BUTTON_SX } from "./buttonSx";

/** One-tap shortcuts under the hero. Scrolls sideways on a phone instead of wrapping. */
const QuickActions: React.FC = () => {
  const { t } = useTranslate();
  const actions = [
    {
      key: "add",
      label: t("pd_qa_add_service"),
      href: "/spr/servicesList",
      icon: <AddRounded />,
      primary: true,
    },
    { key: "bookings", label: t("pd_qa_bookings"), href: "/spr/bookings", icon: <EventRounded /> },
    {
      key: "marketing",
      label: t("pd_qa_marketing"),
      href: "/spr/marketing-tools",
      icon: <CampaignRounded />,
    },
  ];

  return (
    <Box
      component="nav"
      aria-label={t("pd_qa_label")}
      sx={{
        display: "flex",
        gap: 1.5,
        overflowX: "auto",
        mb: 3,
        pb: 0.5,
        scrollSnapType: "x proximity",
      }}
    >
      {actions.map((a) => (
        <Button
          key={a.key}
          component={Link}
          href={a.href}
          variant={a.primary ? "contained" : "outlined"}
          startIcon={a.icon}
          sx={{ ...DASHBOARD_BUTTON_SX, flexShrink: 0, scrollSnapAlign: "start" }}
        >
          {a.label}
        </Button>
      ))}
    </Box>
  );
};

export default QuickActions;
