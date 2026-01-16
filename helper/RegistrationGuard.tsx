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
import { secureStorage } from "./SecureStorage";

// 1. Move static constants outside the component to avoid recreation on re-renders
const RESTRICTED_AUTH_PATHS = [
  "/login",
  "/signUp",
  "/selectRole",
  "/forgotPassword",
  "/resetPassword",
];

export default function RegistrationGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  // 2. State to handle "checking" status to prevent content flash
  const [isChecking, setIsChecking] = useState(true);

  const { user, isAuthenticated: isAuthRedux } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    // 3. All logic and localStorage access happens safely inside useEffect
    const checkAccess = () => {
      // Safely access storage here (guaranteed client-side)
      const token = secureStorage.getItem("token");
      const isAuthenticated = !!token || isAuthRedux;

      const isRestrictedPath = RESTRICTED_AUTH_PATHS.some((path) =>
        pathname.startsWith(path)
      );

      // --- SCENARIO 1: Authenticated user trying to access Auth pages ---
      if (isAuthenticated && isRestrictedPath) {
        router.replace("/");
        return;
      }

      // --- SCENARIO 2: Unauthenticated user ---
      if (!isAuthenticated) {
        // If they are on a public page (or auth page), let them stay.
        // If you have protected routes that REQUIRE login, add that logic here.
        setIsChecking(false);
        return;
      }

      // --- SCENARIO 3: Authenticated but Incomplete Registration ---

      // Get data with fallbacks
      const registerStepFromStorage = secureStorage.getItem("register_step");
      const roleFromStorage = secureStorage.getItem("role");

      const currentRegisterStep =
        user?.register_step ??
        (registerStepFromStorage
          ? parseInt(registerStepFromStorage, 10)
          : null);

      const currentRole = (user?.role ?? roleFromStorage) as AppUserType | null;

      // If data is missing, we assume API/Auth slice is still loading or valid, let them pass
      if (!currentRegisterStep || !currentRole) {
        setIsChecking(false);
        return;
      }

      // If registration is fully complete, allow access
      if (
        currentRegisterStep === UserRegisterSteps.COMPLETED ||
        currentRegisterStep === UserRegisterSteps.PREFERENCES_ADDED
      ) {
        setIsChecking(false);
        return;
      }

      // Determine where they SHOULD be
      const roleMap = registrationStepMap[currentRole];
      if (roleMap) {
        const requiredScreen =
          roleMap[currentRegisterStep as UserRegisterSteps];
        const requiredPath = getPathForScreen(requiredScreen);

        // If a required path exists and we aren't there, redirect
        if (requiredPath && pathname !== requiredPath) {
          router.replace(requiredPath);
          return;
        }
      }

      // If we made it here, the user is allowed to see the current page
      setIsChecking(false);
    };

    checkAccess();
  }, [isAuthRedux, pathname, router, user]);

  // 4. Show nothing (or a spinner) while we are verifying where the user belongs
  if (isChecking) {
    return null; // Or return <LoadingSpinner />
  }

  return <>{children}</>;
}
