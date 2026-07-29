import JoinAsProviderView from "@/components/pages/JoinAsProvider";
import { seoAuth } from "@/lib/seo/buildMetadata";

export const metadata = seoAuth({
  title: "Join as an Automotive Service Provider | KartSquare",
  description:
    "Register your garage, EV service centre, car wash, or automotive business on KartSquare and reach millions of vehicle owners across India.",
});

export default function BecomeServiceProviderPage() {
  return <JoinAsProviderView />;
}
