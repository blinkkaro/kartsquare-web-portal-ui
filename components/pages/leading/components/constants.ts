import { COLORS } from "@/constants/colors";
import PeopleIcon from "@mui/icons-material/People";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import BusinessIcon from "@mui/icons-material/Business";
import LaptopIcon from "@mui/icons-material/Laptop";
import PlaceIcon from "@mui/icons-material/Place";
import ScheduleIcon from "@mui/icons-material/Schedule";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import StorefrontIcon from "@mui/icons-material/Storefront";
import CategoryIcon from "@mui/icons-material/Category";


export const getHeroBenefits = (t: any) => [
  t("heroBenefit1"),
  t("heroBenefit2"),
  t("heroBenefit3"),
];

export const getStatCards = (t: any) => [
  {
    value: "10K+",
    label: t("statLabel1"),
    icon: BusinessIcon,
    color: COLORS.PRIMARY_PURPLE,
  },
  {
    value: "50K+",
    label: t("statLabel2"),
    icon: EmojiEmotionsIcon,
    color: COLORS.SUCCESS_GREEN,
  },
  {
    value: "1M+",
    label: "Searches every month",
    icon: PeopleIcon,
    color: COLORS.PRIMARY_BLUE,
  },
];

export const getSuccessStories = (t: any) => [
  {
    name: "Ramesh Gupta",
    role: t("roleTailor"),
    tagline: t("successStoryTagline1"),
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60",
  },
  {
    name: "Priya Sharma",
    role: t("roleKiranaOwner"),
    tagline: t("successStoryTagline2"),
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&auto=format&fit=crop&q=60",
  },
  {
    name: "Vikram Singh",
    role: t("roleElectrician"),
    tagline: t("successStoryTagline3"),
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&auto=format&fit=crop&q=60",
  },
];

import FactCheckIcon from "@mui/icons-material/FactCheck";

// Google-style 3 steps: Claim, Personalise, Manage
export const getSteps = (t: any) => [
  {
    step: "one",
    title: t("stepClaim"),
    desc: t("stepClaimDesc"),
    Icon: LaptopIcon,
  },
  {
    step: "two",
    title: t("stepPersonalise"),
    desc: t("stepPersonaliseDesc"),
    Icon: StorefrontIcon,
    subIcons: [PlaceIcon, StorefrontIcon, ScheduleIcon, PhotoCameraIcon],
  },
  {
    step: "three",
    title: t("stepManage"),
    desc: t("stepManageDesc"),
    Icon: FactCheckIcon,
  },
];

export const getFreeListingBenefits = (t: any) => [
  t("freeListingBenefit1"),
  t("freeListingBenefit2"),
  t("freeListingBenefit3"),
];

export const getBoostBenefits = (t: any) => [
  t("boostBenefit1"),
  t("boostBenefit2"),
  t("boostBenefit3"),
];

export const getFaqItems = (t: any) => [
  { question: t("faq1Question"), answer: t("faq1Answer") },
  { question: t("faq2Question"), answer: t("faq2Answer") },
  { question: t("faq3Question"), answer: t("faq3Answer") },
  { question: t("faq4Question"), answer: t("faq4Answer") },
];
