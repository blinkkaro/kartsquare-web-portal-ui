import { GET } from "../api";
import { SearchApiResponse } from "./searchInterface";

class SearchService {
  async search(
    query: string,
    limit: number = 5,
    page: number = 1
  ): Promise<SearchApiResponse> {
    if (!query || query.trim().length === 0) {
      return {
        status: "success",
        message: "Empty query",
        data: {
          users: [],
          services: [],
        },
      };
    }

    try {
      const response = await GET<SearchApiResponse>(
        "/homepage/search",
        {
          q: query.trim(),
          limit,
          page,
        },
        false // Search doesn't require auth
      );

      return response;
    } catch (error) {
      console.error("Search error:", error);
      return {
        status: "error",
        message: "Failed to fetch search results",
        data: {
          users: [],
          services: [],
        },
      };
    }
  }
}

export const searchService = new SearchService();
