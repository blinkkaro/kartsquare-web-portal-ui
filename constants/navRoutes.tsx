import React from "react";
import {
  HomeFilled,
  ArticleRounded,
  LocalMallRounded,
  Event,
  ShoppingBag,
  Chat,
  Dashboard,
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

  if (role === "SUPPLIER") {
    return [
      { label: t("home"), href: "/" },
      { label: "My Store", href: "/store" },
    ];
  }

  if (role === "CUSTOMER") {
    return [
      { label: t("home"), href: "/" },
      { label: t("store"), href: "/store" },
      { label: t("services"), href: "/cus/servicesList" },
      // { label: t("events"), href: "/events" },
      { label: t("bookings"), href: "/cus/bookings" },
    ];
  }

  return [
    { label: t("home"), href: "/" },
    { label: t("store"), href: "/store" },
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
      },
      { label: t("store"), href: "/store", icon: <LocalMallRounded /> },
      // { label: t("events"), href: "/events", icon: <Event /> }
    );
  } else {
    if (role === "SUPPLIER") {
      return [
        { label: t("home"), href: "/", icon: <HomeFilled /> },
        { label: "My Store", href: "/store", icon: <LocalMallRounded /> },
      ];
    }

    const bookingsHref =
      role === "SERVICE_PROVIDER" ? "/spr/bookings" : "/cus/bookings";
    items.push(
      { label: t("home"), href: "/", icon: <HomeFilled /> },
      {
        label: t("services"),
        href: "/cus/servicesList",
        icon: <ArticleRounded />,
      },

      // { label: t("events"), href: "/events", icon: <Event /> },
      { label: t("bookings"), href: bookingsHref, icon: <ShoppingBag /> },
      // { label: t("chat"), href: "/chat", icon: <Chat /> }
    );
    if (role === "SERVICE_PROVIDER") {
      items.push({ label: t("dashboard"), href: "/dashboard", icon: <Dashboard /> });
    } else {
      items.push({ label: t("store"), href: "/store", icon: <LocalMallRounded /> });
    }
  }

  return items;
};
