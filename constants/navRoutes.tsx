import {
  HomeFilled,
  ArticleRounded,
  LocalMallRounded,
  Event,
  ShoppingBag,
  Chat,
  Dashboard,
  HomeRepairService,
} from "@mui/icons-material";
import { TranslationKey } from "@/features/i18n/TranslationContext";
import { UserRole } from "@/utils/auth";
import { SvgIcon } from "@mui/material";

function PlaySquareIcon(props: any) {
  return (
    <SvgIcon {...props}>
      {/* square outline */}
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      
      {/* play triangle */}
      <polygon
        points="10,8 16,12 10,16"
        fill="currentColor"
      />
    </SvgIcon>
  );
}

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactElement;
}

export const getDesktopNavItems = (
  role: UserRole | null | string,
  t: (key: TranslationKey) => string,
): NavItem[] => {
  switch (role) {
    case UserRole.SERVICE_PROVIDER:
      return [
        { label: t("home"), href: "/", icon: <HomeFilled sx={{ fontSize: 18 }} /> },
        { label: t("dashboard"), href: "/dashboard", icon: <Dashboard sx={{ fontSize: 18 }} /> },
        {
          label: t("services"),
          href: "/spr/servicesList",
          icon: <HomeRepairService sx={{ fontSize: 18 }} />,
        },
        {
          label: t("bookings"),
          href: "/spr/bookings",
          icon: <Event sx={{ fontSize: 18 }} />,
        },
      ];
    case UserRole.CUSTOMER:
      return [
        { label: t("home"), href: "/", icon: <HomeFilled sx={{ fontSize: 18 }} /> },
        { label: t("store"), href: "/store", icon: <ShoppingBag sx={{ fontSize: 18 }} /> },
        {
          label: t("services"),
          href: "/cus/servicesList",
          icon: <HomeRepairService sx={{ fontSize: 18 }} />,
        },
        {
          label: t("reels"),
          href: "/cus/reels",
          icon: <PlaySquareIcon sx={{ fontSize: 18 }} />,
        },
        {
          label: t("bookings"),
          href: "/cus/bookings",
          icon: <Event sx={{ fontSize: 18 }} />,
        },
      ];
    case UserRole.SUPPLIER:
      return [
        { label: t("home"), href: "/", icon: <HomeFilled sx={{ fontSize: 18 }} /> },
        { label: t("dashboard"), href: "/dashboard", icon: <Dashboard sx={{ fontSize: 18 }} /> },
        {
          label: t("my_store"),
          href: "/sup/myStore",
          icon: <ShoppingBag sx={{ fontSize: 18 }} />,
        },
        {
          label: t("enquiries"),
          href: "/sup/orders",
          icon: <Chat sx={{ fontSize: 18 }} />,
        },
      ];
    default:
      return [
        { label: t("home"), href: "/", icon: <HomeFilled sx={{ fontSize: 18 }} /> },
        { label: t("store"), href: "/store", icon: <ShoppingBag sx={{ fontSize: 18 }} /> },
        {
          label: t("services"),
          href: "/cus/servicesList",
          icon: <HomeRepairService sx={{ fontSize: 18 }} />,
        },
        {
          label: t("reels"),
          href: "/cus/reels",
          icon: <PlaySquareIcon sx={{ fontSize: 18 }} />,
        },
      ];
  }
};

export const getMobileNavItems = (
  isAuthenticated: boolean,
  t: (key: TranslationKey) => string,
  role?: string | null,
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
      {
        label: t("reels"),
        href: "/cus/reels",
        icon: <PlaySquareIcon />,
      },
      { label: t("store"), href: "/store", icon: <LocalMallRounded /> },
      // { label: t("events"), href: "/events", icon: <Event /> }
    );
  } else {
    if (role === UserRole.SUPPLIER) {
      return [
        { label: t("home"), href: "/", icon: <HomeFilled /> },
        { label: t("dashboard"), href: "/dashboard", icon: <Dashboard /> },
        {
          label: t("my_store"),
          href: "/sup/myStore",
          icon: <LocalMallRounded />,
        },
        {
          label: t("enquiries"),
          href: "/sup/orders",
          icon: <ShoppingBag />,
        },
      ];
    }

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
      { label: t("bookings"), href: bookingsHref, icon: <ShoppingBag /> },
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
      default:
        items.push({
          label: t("store"),
          href: "/store",
          icon: <LocalMallRounded />,
        });
        items.push({
          label: t("reels"),
          href: "/cus/reels",
          icon: <PlaySquareIcon />,
        });
        break;
    }
  }

  return items;
};
