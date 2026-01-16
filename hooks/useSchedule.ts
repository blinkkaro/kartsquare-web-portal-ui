import { getWorkingHour, IUpdateWorkingHour, IWorkingHour } from '@/services/ProviderworkingHours/workingHoursInterfaces';
import { providerWorkingHoursService } from '@/services/ProviderworkingHours/workingServices';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useSchedule = () => {
  const queryClient = useQueryClient();

  const {
    data: workingHours,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['workingHours'],
    queryFn: () => providerWorkingHoursService.getWorkingHours(),
  });

  const updateMutation = useMutation({
    mutationFn: (data: IWorkingHour[]) =>
      providerWorkingHoursService.bulkUpdateWorkingHours(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workingHours'] });
    },
  });

  const addMutation = useMutation({
    mutationFn: (data: IWorkingHour) =>
      providerWorkingHoursService.addWorkingHours(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workingHours'] });
    },
  });

  const deleteAllMutation = useMutation({
    mutationFn: () => providerWorkingHoursService.deleteAllWorkingHours(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workingHours'] });
    },
  });

  // Helper to group hours by weekday (0-6)
  const getGroupedHours = () => {
    const grouped: { [key: number]: getWorkingHour[] } = {};
    // Initialize empty arrays for 0-6
    for (let i = 0; i <= 6; i++) {
      grouped[i] = [];
    }

    if (workingHours) {
      workingHours.forEach(hour => {
        if (hour.is_active) {
          if (!grouped[hour.weekday]) {
            grouped[hour.weekday] = [];
          }
          grouped[hour.weekday].push(hour);
        }
      });
    }

    // Sort by start time for each day
    for (let i = 0; i <= 6; i++) {
      grouped[i].sort((a, b) => a.start_time.localeCompare(b.start_time));
    }

    return grouped;
  };

  return {
    workingHours: getGroupedHours(),
    isLoading,
    error,
    updateSlot: updateMutation.mutate,
    addSlot: addMutation.mutate,
    deleteAll: deleteAllMutation.mutate,
    refetch: queryClient.refetchQueries({ queryKey: ['workingHours'] }),
  };
};
