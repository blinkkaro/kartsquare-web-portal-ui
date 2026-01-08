"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import {
  registrationStepMap,
  UserRegisterSteps,
  getPathForScreen,
} from "@/types/resgistrationFlow";
import { AppUserType } from "@/services/auth/auth.interface";

export default function RegistrationGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated: isAuthRedux } = useAppSelector(
    (state) => state.auth
  );

  // Safely access localStorage
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const isAuthenticated: boolean = !!token || isAuthRedux;

  // Get registration step and role from localStorage as fallback
  const registerStepFromStorage =
    typeof window !== "undefined"
      ? localStorage.getItem("register_step")
      : null;
  const roleFromStorage =
    typeof window !== "undefined" ? localStorage.getItem("role") : null;

  useEffect(() => {
    // List of paths restricted for authenticated users
    const restrictedPaths = [
      "/login",
      "/signUp",
      "/selectRole",
      "/forgotPassword",
      "/resetPassword",
    ];

    const isRestrictedPath = restrictedPaths.some((path) =>
      pathname.startsWith(path)
    );

    // PRIORITY 1: Block ALL authenticated users from restricted auth pages
    // This ensures fully registered users cannot access login/signup even by manual URL change
    if (isAuthenticated && isRestrictedPath) {
      router.replace("/");
      return;
    }

    // If not authenticated, allow normal access
    if (!isAuthenticated) {
      return;
    }

    // Get registration step and role (from user object or localStorage)
    const currentRegisterStep =
      user?.register_step ??
      (registerStepFromStorage ? parseInt(registerStepFromStorage, 10) : null);
    const currentRole = (user?.role ?? roleFromStorage) as AppUserType | null;

    // If we don't have registration step or role, allow access (will be handled by API)
    if (!currentRegisterStep || !currentRole) {
      return;
    }

    // PRIORITY 2: If registration is complete, allow free navigation (except restricted paths handled above)
    if (
      currentRegisterStep === UserRegisterSteps.COMPLETED ||
      currentRegisterStep === UserRegisterSteps.PREFERENCES_ADDED
    ) {
      return;
    }

    // PRIORITY 3: Block home page access for users with incomplete registration
    // This prevents URL manipulation to bypass registration flow
    if (pathname === "/") {
      const roleMap = registrationStepMap[currentRole];

      if (roleMap) {
        const requiredScreen =
          roleMap[currentRegisterStep as UserRegisterSteps];
        const requiredPath = getPathForScreen(requiredScreen);

        if (requiredPath) {
          router.replace(requiredPath);
          return;
        }
      }
    }

    // PRIORITY 4: Handle incomplete registration - redirect to required step
    const roleMap = registrationStepMap[currentRole];

    if (!roleMap) {
      return;
    }

    const requiredScreen = roleMap[currentRegisterStep as UserRegisterSteps];

    if (requiredScreen) {
      const requiredPath = getPathForScreen(requiredScreen);

      // Prevent infinite redirect if we are already on the required path
      if (requiredPath && pathname !== requiredPath) {
        router.replace(requiredPath);
      }
    }
  }, [
    isAuthenticated,
    user,
    pathname,
    router,
    registerStepFromStorage,
    roleFromStorage,
  ]);

  // Prevent flashing of protected content
  const restrictedPaths = [
    "/login",
    "/signUp",
    "/selectRole",
    "/forgotPassword",
    "/resetPassword",
  ];
  const isRestrictedPath = restrictedPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (isAuthenticated && isRestrictedPath) {
    return null;
  }

  return <>{children}</>;
}
