import SelectRoleView from "@/components/pages/selectRole";
import { seoAuth } from "@/lib/seo/buildMetadata";

export const metadata = seoAuth({
  title: "Choose account type",
  description:
    "Select how you will use KartSquare — customer, service provider, or supplier — to personalize your experience.",
});

export default function SelectRole() {
  return <SelectRoleView />;
}
