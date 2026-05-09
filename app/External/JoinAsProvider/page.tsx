import JoinAsProviderView from "@/components/pages/JoinAsProvider";
import { seoPublic } from "@/lib/seo/buildMetadata";

export const metadata = seoPublic({
  title: "Join as a Service Provider | KartSquare",
  description:
    "Register your business on KartSquare and reach millions of customers across India.",
  path: "/External/JoinAsProvider",
});

export default function JoinAsProvider() {
  return <JoinAsProviderView />;
}
