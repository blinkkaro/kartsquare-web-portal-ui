import SignUpView from "@/components/pages/signUpPage";
import { seoAuth } from "@/lib/seo/buildMetadata";

export const metadata = seoAuth({
  title: "Create account",
  description:
    "Join kartsquare to book trusted services, buy from verified suppliers, and list your business on India's B2B marketplace.",
});

export default function SignUp() {
  return <SignUpView />;
}
