import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/auth/auth.service";
import { logout } from "@/features/ui/authSlice";
import { secureStorage } from "@/helper/SecureStorage";

export const useLogout = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    try {
      // 1. Call API logout
      await authService.logout();
    } catch (error) {
      console.error("Logout API failed", error);
    } finally {
      // clear profile
      dispatch(logout());

      // 3. Clear React Query Cache (Critical for removing persisted data like stories)
      queryClient.clear();

      // 4. Force clear remaining localStorage items
      secureStorage.removeItem("token");
      secureStorage.removeItem("refreshToken");
      secureStorage.removeItem("role");
      secureStorage.removeItem("register_step");

      // 5. Navigate to home
      router.push("/");
    }
  };

  return { handleLogout };
};
