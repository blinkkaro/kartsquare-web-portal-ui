import React from "react";
import { AppUserType } from "@/services/auth/auth.interface";
import { TranslationKey } from "@/features/i18n/TranslationContext";
import PersonIcon from "@mui/icons-material/Person";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import TuneIcon from "@mui/icons-material/Tune";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import PostAddIcon from "@mui/icons-material/PostAdd";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import FolderSharedIcon from "@mui/icons-material/FolderShared";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import TagIcon from "@mui/icons-material/Tag";
import LockIcon from "@mui/icons-material/Lock";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import NotificationsIcon from "@mui/icons-material/Notifications";
import BlockIcon from "@mui/icons-material/Block";
import ListIcon from "@mui/icons-material/List";
import HelpIcon from "@mui/icons-material/Help";
import PolicyIcon from "@mui/icons-material/Policy";
import SecurityIcon from "@mui/icons-material/Security";
import DescriptionIcon from "@mui/icons-material/Description";

export interface myAccountNavInterface {
  label: string;
  href: string;
  icon: React.ReactElement;
  isLogout?: boolean;
}

export const myAccountNav = (
  role: AppUserType,
  t: (key: TranslationKey) => string
): myAccountNavInterface[] => {
  if (role === "SERVICE_PROVIDER") {
    return [
      {
        label: t("myPosts"),
        href: "#",
        icon: <PostAddIcon />,
      },
      {
        label: t("personalInfo"),
        href: "myAccount/personal-info",
        icon: <PersonIcon />,
      },
      {
        label: t("saved"),
        href: "#",
        icon: <BookmarkBorderIcon />,
      },
      {
        label: t("blogs"),
        href: "#",
        icon: <ArticleOutlinedIcon />,
      },
      {
        label: t("preferences"),
        href: "#",
        icon: <TuneIcon />,
      },
      {
        label: t("myDocuments"),
        href: "#",
        icon: <FolderSharedIcon />,
      },
      {
        label: t("mySchedule"),
        href: "#",
        icon: <CalendarMonthIcon />,
      },
      {
        label: t("logout"),
        href: "#",
        icon: <PowerSettingsNewIcon />,
        isLogout: true,
      },
    ];
  } else {
    // CUSTOMER
    return [
      {
        label: t("personalInfo"),
        href: "myAccount/personal-info",
        icon: <PersonIcon />,
      },
      {
        label: t("saved"),
        href: "#",
        icon: <BookmarkBorderIcon />,
      },
      {
        label: t("blogs"),
        href: "#",
        icon: <ArticleOutlinedIcon />,
      },
      {
        label: t("preferences"),
        href: "#",
        icon: <TuneIcon />,
      },
      {
        label: t("logout"),
        href: "#",
        icon: <PowerSettingsNewIcon />,
        isLogout: true,
      },
    ];
  }
};

export const myAccountSettingNav = (
  t: (key: TranslationKey) => string
): myAccountNavInterface[] => {
  return [
    {
      label: t("changePassword"),
      href: "#",
      icon: <LockIcon />,
    },
    {
      label: t("addresses"),
      href: "#",
      icon: <LocationOnIcon />,
    },
    {
      label: t("faqs"),
      href: "#",
      icon: <ListIcon />,
    },
    {
      label: t("helpSupport"),
      href: "#",
      icon: <HelpIcon />,
    },
    // {
    //   label: t("rcPolicy"),
    //   href: "#",
    //   icon: <PolicyIcon />,
    // },
    {
      label: t("privacySecurity"),
      href: "privacyPolicy",
      icon: <SecurityIcon />,
    },
    {
      label: t("termsConditions"),
      href: "termsConditions",
      icon: <DescriptionIcon />,
    },
  ];
};
