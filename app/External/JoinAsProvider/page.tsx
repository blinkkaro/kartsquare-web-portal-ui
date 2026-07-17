import JoinAsProviderView from "@/components/pages/JoinAsProvider";
import { seoAuth } from "@/lib/seo/buildMetadata";


export const metadata = seoAuth({
  title: "Join as a Service Provider | KartSquare",
  description:
    "Register your business on KartSquare and reach millions of customers across India.",
});

export default function JoinAsProvider() {
  return <JoinAsProviderView />;
}
