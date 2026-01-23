import React from "react";
import {
  HomeFilled,
  ArticleRounded,
  LocalMallRounded,
  Event,
  ShoppingBag,
  Chat,
} from "@mui/icons-material";
import { TranslationKey } from "@/features/i18n/TranslationContext";

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactElement;
}

export const getDesktopNavItems = (
  role: string | null,
  t: (key: TranslationKey) => string
): NavItem[] => {
  if (role === "SERVICE_PROVIDER") {
    return [
      { label: t("home"), href: "/" },
      { label: t("dashboard"), href: "/dashboard" },
      // { label: t("store"), href: "/store" },
      { label: t("services"), href: "/spr/servicesList" },
      // { label: t("events"), href: "/events" },
      { label: t("bookings"), href: "/spr/bookings" },
    ];
  }

  if (role === "CUSTOMER") {
    return [
      { label: t("home"), href: "/" },
      // { label: t("store"), href: "/store" },
      { label: t("services"), href: "/cus/servicesList" },
      // { label: t("events"), href: "/events" },
      { label: t("bookings"), href: "/cus/bookings" },
    ];
  }

  return [
    { label: t("home"), href: "/" },
    // { label: t("store"), href: "/store" },
    { label: t("services"), href: "/cus/servicesList" },
    // { label: t("events"), href: "/events" },
  ];
};

export const getMobileNavItems = (
  isAuthenticated: boolean,
  t: (key: TranslationKey) => string,
  role?: string | null
): NavItem[] => {
  const items: NavItem[] = [];

  if (!isAuthenticated) {
    items.push(
      { label: t("home"), href: "/", icon: <HomeFilled /> },
      {
        label: t("services"),
        href: "/cus/servicesList",
        icon: <ArticleRounded />,
      }
      // { label: t("store"), href: "/store", icon: <LocalMallRounded /> },
      // { label: t("events"), href: "/events", icon: <Event /> }
    );
  } else {
    const bookingsHref =
      role === "SERVICE_PROVIDER" ? "/spr/bookings" : "/cus/bookings";
    items.push(
      { label: t("home"), href: "/", icon: <HomeFilled /> },
      {
        label: t("services"),
        href: "/cus/servicesList",
        icon: <ArticleRounded />,
      },
      // { label: t("store"), href: "/store", icon: <LocalMallRounded /> },
      // { label: t("events"), href: "/events", icon: <Event /> },
      { label: t("bookings"), href: bookingsHref, icon: <ShoppingBag /> },
      // { label: t("chat"), href: "/chat", icon: <Chat /> }
    );
  }

  return items;
};
