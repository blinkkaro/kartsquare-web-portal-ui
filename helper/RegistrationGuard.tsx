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

import GlobalLoading from "@/components/common/Loader/GlobalLoading";

// 1. Move static constants outside the component to avoid recreation on re-renders
const RESTRICTED_AUTH_PATHS = [
  "/login",
  "/signUp",
  "/selectRole",
  "/forgotPassword",
  "/resetPassword",
];

const ONBOARDING_PATHS = [
  "/emailVerfication",
  "/businessInfo",
  "/verifyDocuments",
  "/schedule",
  "/preferences",
  "/supplier/onboarding",
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
    (state) => state.auth,
  );

  useEffect(() => {
    // 3. All logic and localStorage access happens safely inside useEffect
    const checkAccess = () => {
      // Safely access storage here (guaranteed client-side)
      const token = secureStorage.getItem("token");
      const isAuthenticated = !!token || isAuthRedux;

      const isRestrictedPath = RESTRICTED_AUTH_PATHS.some((path) =>
        pathname.startsWith(path),
      );

      const isOnboardingPath = ONBOARDING_PATHS.some((path) =>
        pathname.startsWith(path),
      );

      // --- UNAUTHENTICATED: allow them to stay on any public/auth page ---
      if (!isAuthenticated) {
        setIsChecking(false);
        return;
      }

      // --- AUTHENTICATED: resolve registration state ---
      const registerStepFromStorage = secureStorage.getItem("register_step");
      const roleFromStorage = secureStorage.getItem("role");

      const currentRegisterStep =
        user?.register_step !== undefined && user?.register_step !== null
          ? user.register_step
          : registerStepFromStorage !== null && registerStepFromStorage !== undefined
          ? parseInt(registerStepFromStorage, 10)
          : null;

      const currentRole = (user?.role ?? roleFromStorage) as AppUserType | null;

      // Determine if onboarding is fully complete
      const isCompleted =
        currentRegisterStep !== null &&
        (currentRegisterStep === UserRegisterSteps.COMPLETED ||
          currentRegisterStep === UserRegisterSteps.PREFERENCES_ADDED ||
          (currentRole === AppUserType.SUPPLIER &&
            currentRegisterStep === UserRegisterSteps.SUPPLIER_KYC_SUBMITTED));

      // --- SCENARIO 1: Authenticated on a restricted auth page ---
      // Only redirect to home if registration is actually complete.
      // If it's incomplete, let them stay (e.g. /signUp during onboarding).
      if (isAuthenticated && isRestrictedPath) {
        if (isCompleted) {
          router.replace("/");
          return;
        }
        // Not complete: allow them to proceed (e.g. complete /signUp)
        setIsChecking(false);
        return;
      }

      // If data is missing, assume still loading — let them pass
      if (currentRegisterStep === null || !currentRole) {
        setIsChecking(false);
        return;
      }

      // If already completed but on onboarding paths, redirect to home
      if (isCompleted && isOnboardingPath) {
        router.replace("/");
        return;
      }

      if (isCompleted) {
        setIsChecking(false);
        return;
      }

      // Determine where they SHOULD be
      const roleMap = registrationStepMap[currentRole];
      if (roleMap && currentRegisterStep !== UserRegisterSteps.ANONYMOUS) {
        const requiredScreen =
          roleMap[currentRegisterStep as UserRegisterSteps];
        
        if (requiredScreen) {
          const requiredPath = getPathForScreen(requiredScreen);
          const basePath = requiredPath.split("?")[0];

          // If a required path exists and we aren't there, redirect to enforce onboarding step
          if (requiredPath !== "/" && pathname !== basePath) {
            router.replace(requiredPath);
            return;
          }
        }
      }

      // If we made it here, the user is allowed to see the current page
      setIsChecking(false);
    };

    checkAccess();
  }, [isAuthRedux, pathname, router, user]);

  // 4. Show nothing (or a spinner) while we are verifying where the user belongs
  if (isChecking) {
    return <GlobalLoading open={true} />;
  }

  return <>{children}</>;
}
