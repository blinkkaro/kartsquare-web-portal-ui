import {
  AgenticSearchRequest,
  AgenticSearchResponse,
  AIBOTRESPONSE,
} from './aiInterface';
import { POST } from '../api';
const AI_ENDPOINTS = {
  AGENTIC_SEARCH: '/agentic-search',
  AIBOT: '/agentic-search/aibot',
};

export const aiService = {
  /**
   * Search for services using AI-powered agentic search
   * @param searchQuery - The user's search query describing their needs
   * @returns Promise with either matching services or suggested categories
   */
  async agenticSearch(
    searchQuery: string,
    sessionId?: string,
  ): Promise<AgenticSearchResponse> {
    const payload: AgenticSearchRequest = { searchQuery, sessionId };

    // apiClient.post returns ApiResponse<T> where data is T
    // The backend response is already in response.data
    const response = await POST<AgenticSearchResponse>(
      AI_ENDPOINTS.AGENTIC_SEARCH,
      payload,
    );
    // response.data contains the actual backend response
    return response.data;
  },

  async aibot(
    question: string,
  ): Promise<AIBOTRESPONSE> {
    const res =  await POST<AIBOTRESPONSE>(AI_ENDPOINTS.AIBOT, { question });
    return res.data;
  }    
};
