"use client";

import LoginForm from "./components/LoginForm";
import { useSearchParams } from "next/navigation";
import AuthWrapper from "@/components/auth/authWrapper";
import { LoginFormData } from "./loginSchema";
import { authService } from "@/services/auth/auth.service";
import { useState } from "react";

export default function LoginView() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const OnSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      setError(null);
      const Role = role!.toString().toUpperCase();
      await authService.login({ ...data, role: Role });
    } catch (error: any) {
      setError(error.response?.data?.message || "Login failed");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthWrapper>
      <LoginForm
        role={role!}
        onSubmit={OnSubmit}
        loading={loading}
        error={error}
      />
    </AuthWrapper>
  );
}
