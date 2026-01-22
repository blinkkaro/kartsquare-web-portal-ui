import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  SuggestedCategory,
  AgenticSearchResponse,
  isSuccessResponse,
  isFailureResponse,
} from "@/services/ai/aiInterface";
import { Service } from "@/services/serviceList/listInteraface";
import { aiService } from "@/services/ai/aiService";

interface UseAISearchReturn {
  services: Service[];
  suggestedCategories: SuggestedCategory[];
  isLoading: boolean;
  error: string | null;
  search: (query: string) => Promise<AgenticSearchResponse | undefined>;
  messages: string;
}

export const useAISearch = (): UseAISearchReturn => {
  const [services, setServices] = useState<Service[]>([]);
  const [suggestedCategories, setSuggestedCategories] = useState<
    SuggestedCategory[]
  >([]);
  const [messages, setMessages] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (query: string) => aiService.agenticSearch(query),
    onSuccess: (data: AgenticSearchResponse) => {
      setError(null);
      if (isSuccessResponse(data)) {
        setServices(data.services);
        setSuggestedCategories([]);
        setMessages(data.message);
      } else if (isFailureResponse(data)) {
        setServices([]);
        setSuggestedCategories(data.suggestedCategories);
        setMessages(data.message);
      }
    },
    onError: (err: any) => {
      setError(err.message || "An error occurred while searching");
      setServices([]);
      setSuggestedCategories([]);
      setMessages("");
    },
  });

  const search = async (query: string) => {
    if (!query.trim()) return;
    return await mutation.mutateAsync(query);
  };

  return {
    services,
    suggestedCategories,
    isLoading: mutation.isPending,
    error,
    search,
    messages,
  };
};
