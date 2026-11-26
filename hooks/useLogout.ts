import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/features/ui/authSlice";
import { authService } from "@/services/auth/auth.service";
import { useAppDispatch } from "@/store/hooks";
import { getTokens } from "@/utils/auth";

export interface LogoutOptions {
  /** Where to send the person afterwards. Default: the homepage. */
  redirectTo?: string;
}

/**
 * The one sign-out flow. Every logout button, "back" out of registration and account deletion uses it.
 *
 * 1. Ask the backend to revoke this session's refresh token (best effort; never blocks signing out).
 * 2. `logout()` resets Redux and `clearSession()` wipes everything stored about the person. That also clears
 *    the TanStack Query cache, through `onSessionEnd` (see app/providers.tsx).
 * 3. Replace the current history entry, so Back does not return to a signed-in page.
 */
export const useLogout = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = useCallback(
    async ({ redirectTo = "/" }: LogoutOptions = {}) => {
      try {
        const { accessToken, refreshToken } = getTokens();
        if (accessToken || refreshToken) {
          await authService.logout(refreshToken);
        }
      } catch {
        // Revoking is best effort; the local sign-out below always runs.
      } finally {
        dispatch(logout());
        router.replace(redirectTo);
      }
    },
    [dispatch, router],
  );

  return { handleLogout };
};
