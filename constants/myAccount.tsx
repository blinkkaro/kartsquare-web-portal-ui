import React from "react";
import { AppUserType } from "@/services/auth/auth.interface";
import { TranslationKey } from "@/features/i18n/TranslationContext";
import PersonIcon from "@mui/icons-material/Person";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import TuneIcon from "@mui/icons-material/Tune";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import PostAddIcon from "@mui/icons-material/PostAdd";
import FolderSharedIcon from "@mui/icons-material/FolderShared";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LockIcon from "@mui/icons-material/Lock";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ListIcon from "@mui/icons-material/List";
import HelpIcon from "@mui/icons-material/Help";
import SecurityIcon from "@mui/icons-material/Security";
import DescriptionIcon from "@mui/icons-material/Description";

export interface myAccountNavInterface {
  label: string;
  href: string;
  icon: React.ReactElement;
  isLogout?: boolean;
  isChangePassword?: boolean;
  isPosts?: boolean;
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
        isPosts: true,
      },
      {
        label: t("personalInfo"),
        href: "myAccount/personal-info",
        icon: <PersonIcon />,
      },
      {
        label: t("saved"),
        href: "myAccount/saved",
        icon: <BookmarkBorderIcon />,
      },
      {
        label: t("blogs"),
        href: "myAccount/blog",
        icon: <ArticleOutlinedIcon />,
      },
      {
        label: t("preferences"),
        href: "#",
        icon: <TuneIcon />,
      },
      {
        label: t("myDocuments"),
        href: "myAccount/myDocuments",
        icon: <FolderSharedIcon />,
      },
      {
        label: t("mySchedule"),
        href: "myAccount/mySchedule",
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
        href: "myAccount/saved",
        icon: <BookmarkBorderIcon />,
      },
      {
        label: t("blogs"),
        href: "myAccount/blog",
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
      isChangePassword: true,
    },
    {
      label: t("addresses"),
      href: "myAccount/address",
      icon: <LocationOnIcon />,
    },
    {
      label: t("faqs"),
      href: "myAccount/FAQ",
      icon: <ListIcon />,
    },
    {
      label: t("helpSupport"),
      href: "myAccount/helpSupport",
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
