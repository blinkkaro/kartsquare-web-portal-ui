import { Service } from '../serviceList/listInteraface';

// Request interface
export interface AgenticSearchRequest {
  searchQuery: string;
  sessionId?: string;
}

// Success response interface
export interface AgenticSearchSuccessResponse {
  status: 'success';
  success: true;
  message: string;
  services: Service[];
  totalServices: number;
}

// Category and subcategory interfaces for failure response
export interface SubCategory {
  id: string;
  name: string;
}

export interface SuggestedCategory {
  id: string;
  name: string;
  subcategories: SubCategory[];
}

// Failure response interface
export interface AgenticSearchFailureResponse {
  success: false;
  message: string;
  suggestedCategories: SuggestedCategory[];
}

// Union type for API response
export type AgenticSearchResponse =
  | AgenticSearchSuccessResponse
  | AgenticSearchFailureResponse;

// Chat message interface
export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  services?: Service[];
  suggestedCategories?: SuggestedCategory[];
}

// Helper type guard to check if response is success
export function isSuccessResponse(
  response: AgenticSearchResponse,
): response is AgenticSearchSuccessResponse {
  return 'status' in response && response.status === 'success';
}

// Helper type guard to check if response is failure
export function isFailureResponse(
  response: AgenticSearchResponse,
): response is AgenticSearchFailureResponse {
  return 'success' in response && response.success === false;
}

export interface AIBOTRESPONSE {
  answer: string;
}
  
