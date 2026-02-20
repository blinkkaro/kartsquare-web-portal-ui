import { useQuery } from "@tanstack/react-query";
import leadService from "@/services/leads/lead.service";
import { GetLeadsResponse } from "@/services/leads/lead.interface";

export const useLeads = (
  page: number = 1,
  limit: number = 10,
  search?: string,
  enabled: boolean = true,
) => {
  return useQuery<GetLeadsResponse>({
    queryKey: ["leads", page, limit, search],
    queryFn: () => leadService.getLeads(page, limit, search),
    enabled: enabled,
  });
};
