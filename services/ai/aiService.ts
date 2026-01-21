import {
  AgenticSearchRequest,
  AgenticSearchResponse,
} from './aiInterface';
import { POST } from '../api';
const AI_ENDPOINTS = {
  AGENTIC_SEARCH: '/agentic-search',
};

export const aiService = {
  /**
   * Search for services using AI-powered agentic search
   * @param searchQuery - The user's search query describing their needs
   * @returns Promise with either matching services or suggested categories
   */
  async agenticSearch(
    searchQuery: string,
  ): Promise<AgenticSearchResponse> {
    const payload: AgenticSearchRequest = { searchQuery };
    
    // apiClient.post returns ApiResponse<T> where data is T
    // The backend response is already in response.data
    const response = await POST<AgenticSearchResponse>(
      AI_ENDPOINTS.AGENTIC_SEARCH,
      payload,
    );
    console.log(response);
    // response.data contains the actual backend response
    return response.data;
  },
};
