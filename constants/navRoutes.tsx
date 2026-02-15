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
import { UserRole } from "@/utils/auth";

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactElement;
}

export const getDesktopNavItems = (
  role: UserRole | null | string,
  t: (key: TranslationKey) => string
): NavItem[] => {
  switch (role) {
    case UserRole.SERVICE_PROVIDER:
      return [
        { label: t("home"), href: "/" },
        { label: t("dashboard"), href: "/dashboard" },
        // { label: t("store"), href: "/store" },
        { label: t("services"), href: "/spr/servicesList" },
        // { label: t("events"), href: "/events" },
        { label: t("bookings"), href: "/spr/bookings" },
      ];
    case UserRole.CUSTOMER:
      return [
        { label: t("home"), href: "/" },
        { label: t("store"), href: "/store" },
        { label: t("services"), href: "/cus/servicesList" },
        { label: t("bookings"), href: "/cus/bookings" },
      ];
    case UserRole.SUPPLIER:
      return [
        { label: t("home"), href: "/" },
        { label: t("my_store"), href: "/sup/myStore" },
      ];
    default:
      return [
        { label: t("home"), href: "/" },
        { label: t("store"), href: "/store" },
        { label: t("services"), href: "/cus/servicesList" },
        // { label: t("events"), href: "/events" },
      ];
  }
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
      { label: t("store"), href: "/store", icon: <LocalMallRounded /> }
      // { label: t("events"), href: "/events", icon: <Event /> }
    );
  } else {
    const bookingsHref =
      role === UserRole.SERVICE_PROVIDER ? "/spr/bookings" : "/cus/bookings";
    items.push(
      { label: t("home"), href: "/", icon: <HomeFilled /> },
      {
        label: t("services"),
        href: "/cus/servicesList",
        icon: <ArticleRounded />,
      },

      // { label: t("events"), href: "/events", icon: <Event /> },
      { label: t("bookings"), href: bookingsHref, icon: <ShoppingBag /> }
      // { label: t("chat"), href: "/chat", icon: <Chat /> }
    );
    switch (role) {
      case UserRole.SERVICE_PROVIDER:
        items.push({
          label: t("dashboard"),
          href: "/dashboard",
          icon: <Dashboard />,
        });
        break;
      case UserRole.SUPPLIER:
        items.push({
          label: t("my_store"),
          href: "/sup/myStore",
          icon: <LocalMallRounded />,
        });
        break;
      default:
        items.push({
          label: t("store"),
          href: "/store",
          icon: <LocalMallRounded />,
        });
        break;
    }
  }

  return items;
};
