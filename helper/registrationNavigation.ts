import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { AppUserType } from "@/services/auth/auth.interface";
import {
  registrationStepMap,
  UserRegisterSteps,
  getPathForScreen,
} from "@/types/resgistrationFlow";
import { updateUser } from "@/features/ui/authSlice";
import { Dispatch } from "@reduxjs/toolkit";
import { secureStorage } from "./SecureStorage";

export const handleRegistrationStepNavigation = (
  dispatch: Dispatch,
  router: AppRouterInstance,
  newStep: UserRegisterSteps,
) => {
  const role = secureStorage.getItem("role");
  const register_step = secureStorage.getItem("register_step");

  if (!register_step || !role) {
    // router.replace("/");
    return;
  }

  // 1. Update LocalStorage
  secureStorage.setItem("register_step", newStep.toString());

  // 2. Update Redux State (Critical for RegistrationGuard)
  dispatch(updateUser({ register_step: newStep }));

  // 3. Determine Next Screen based on Role and Step
  const roleMap = registrationStepMap[role as AppUserType];
  if (!roleMap) {
    console.error("No role map found for role:", role);
    // router.replace("/");
    return;
  }

  const nextScreen = roleMap[newStep];
  const nextPath = getPathForScreen(nextScreen);

  console.log(`Navigating to next path: ${nextPath} for step: ${newStep}`);
  if(nextPath){
    setTimeout(() => {
      router.push(nextPath);
    }, 200);
  }
};
