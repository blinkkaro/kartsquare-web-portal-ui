import HomeRepairServiceIcon from "@mui/icons-material/HomeRepairService";
import FaceRetouchingNaturalIcon from "@mui/icons-material/FaceRetouchingNatural";
import DevicesOtherIcon from "@mui/icons-material/DevicesOther";
import SpaIcon from "@mui/icons-material/Spa";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import SchoolIcon from "@mui/icons-material/School";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import CelebrationIcon from "@mui/icons-material/Celebration";
import GavelIcon from "@mui/icons-material/Gavel";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import CheckroomIcon from "@mui/icons-material/Checkroom";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import FlightIcon from "@mui/icons-material/Flight";
import { COLORS } from "@/constants/colors";

/** Category name -> icon component, matched in order (first match wins). */
const CATEGORY_ICON_MATCHERS: Array<[RegExp, React.ElementType]> = [
  [/beaut|makeup|salon|spa/i, FaceRetouchingNaturalIcon],
  [/tech|electronic|gadget|repair.*device|it\b|software|computer/i, DevicesOtherIcon],
  [/wellness|health|medical|yoga/i, SpaIcon],
  [/clean/i, CleaningServicesIcon],
  [/tutor|educat|class|learning/i, SchoolIcon],
  [/business|finance/i, BusinessCenterIcon],
  [/car|automotive|vehicle/i, DirectionsCarIcon],
  [/event|entertainment|party/i, CelebrationIcon],
  [/legal|compliance|law/i, GavelIcon],
  [/fitness|gym|sport/i, FitnessCenterIcon],
  [/fashion|clothing|jewellery|accessor/i, CheckroomIcon],
  [/food|dining|restaurant/i, RestaurantIcon],
  [/travel|tour/i, FlightIcon],
];

/** Falls back to a generic services icon when no keyword matches. */
export const getCategoryIconComponent = (name: string): React.ElementType => {
  const match = CATEGORY_ICON_MATCHERS.find(([re]) => re.test(name));
  return match ? match[1] : HomeRepairServiceIcon;
};

/** Rotating background/foreground palette for category icon tiles. */
export const CATEGORY_TILE_COLORS = [
  { bg: "#e7ecfd", fg: COLORS.PRIMARY_PURPLE },
  { bg: "#fde7ea", fg: "#e0446b" },
  { bg: "#e2f8ee", fg: "#1fa971" },
  { bg: "#e6f2ff", fg: COLORS.PRIMARY_BLUE },
];

export const getCategoryTileColor = (index: number) =>
  CATEGORY_TILE_COLORS[index % CATEGORY_TILE_COLORS.length];
