import LoginView from "@/components/pages/Login";
import { seoAuth } from "@/lib/seo/buildMetadata";

export const metadata = seoAuth({
  title: "Login",
  description:
    "Sign in to your kartsquare account to book services, manage orders, chat with suppliers, and update your business profile.",
});

export default function LoginPage() {
  return <LoginView />;
}
