import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useCallback, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { secureStorage } from "@/helper/SecureStorage";
import { publicRoutes } from "@/constants/PublicRoutes";
import { openLoginModal } from "@/features/ui/loginModalSlice";

export const useAuthModal = () => {
  const dispatch = useDispatch();
  const { isOpen } = useSelector((state: any) => state.loginModal);
  const router = useRouter();
  const pathname = usePathname();
  const token = secureStorage.getItem("token");
  const isBlockingRef = useRef<boolean>(false);

  const isAuthenticated = !!token;

  // Check if a route is public
  const isPublicRoute = useCallback((path: string) => {
    return publicRoutes.some((route) => {
      // Handle dynamic routes like /:username or /blog/:id
      if (route.includes(":")) {
        const routePattern = route.replace(/:[^/]+/g, "[^/]+");
        const regex = new RegExp(`^${routePattern}$`);
        return regex.test(path);
      }
      return route === path;
    });
  }, []);

  useEffect(() => {
    // If route changed to a protected route and user is not authenticated
    if (!isPublicRoute(pathname) && !isAuthenticated) {
      // Only block if we haven't already started blocking
      if (!isBlockingRef.current) {
        isBlockingRef.current = true;

        // Show login modal immediately
        dispatch(openLoginModal());

        // Navigate back to previous page
        try {
          router.back();
          // If there's no history to go back to, redirect to home after a brief delay
          setTimeout(() => {
            // Check if we're still on the protected route after attempting to go back
            if (window.location.pathname === pathname) {
              router.push("/");
            }
          }, 100);
        } catch (error) {
          // If router.back() fails, redirect to home page
          router.push("/");
        }
      }
    } else {
      // Reset blocking flag when on a valid route
      isBlockingRef.current = false;
    }
  }, [pathname, isAuthenticated]);

  return {
    isAuthenticated,
    isOpen,
  };
};
