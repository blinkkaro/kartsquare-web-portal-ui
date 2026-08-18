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
    name: "Rajesh Kumar",
    role: "Kirana Store Owner",
    tagline: "Since listing on kartsquare, my daily footfall has doubled. People in my locality now find my shop easily when they search for groceries online.",
    image:
      "https://images.unsplash.com/photo-1596484552834-6a58f84cc235?w=500&auto=format&fit=crop&q=60", // Indian man smiling
  },
  {
    name: "Priya Sharma",
    role: "Freelance Makeup Artist",
    tagline: "I used to rely only on referrals. Now, I get consistent booking inquiries directly through my profile. It's completely free and so easy to use.",
    image:
      "https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?w=500&auto=format&fit=crop&q=60", // Indian woman smiling
  },
  {
    name: "Amit Patel",
    role: "Electronics Dealer",
    tagline: "The platform connecting suppliers with local customers is a game-changer. My bulk orders have increased significantly since joining.",
    image:
      "https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?w=500&auto=format&fit=crop&q=60", // generic professional/shop owner
  },
  {
    name: "Sneha Reddy",
    role: "Boutique Owner",
    tagline: "Uploading photos of our latest collections brings so many walk-ins. Customers love seeing what we have before they even visit.",
    image:
      "https://images.unsplash.com/photo-1615585093557-caaa0f5abe5e?w=500&auto=format&fit=crop&q=60", // Indian woman looking confident
  },
  {
    name: "Vikram Singh",
    role: "AC Repair & Service",
    tagline: "Summer is our peak time, and being on this directory means when an AC breaks down in the neighborhood, my phone rings first.",
    image:
      "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=500&auto=format&fit=crop&q=60", // man working/service
  },
  {
    name: "Anjali Desai",
    role: "Home Baker",
    tagline: "Starting my baking business from home was tough until I created my free profile. The local visibility gave me the initial boost I truly needed.",
    image:
      "https://images.unsplash.com/photo-1525543907410-b2562b6796d6?w=500&auto=format&fit=crop&q=60", // woman cooking/smiling
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
