import { notificationService } from "@/services/notifications/notifcationService";
import { useQuery } from "@tanstack/react-query";

export const getNotification = () => {
  return useQuery({
    queryKey: ["notification"],
    queryFn: () => notificationService.getNotifications(),
  });
};
