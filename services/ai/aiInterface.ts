import { Service } from '../serviceList/listInteraface';

// Extra state sent with a search: chip choices, chosen place, optional real coordinates.
export interface AgenticSearchContext {
  /** "Change service" chip: skip language parsing and search this service */
  concept?: string;
  /** Category chip: browse a category directly */
  categoryId?: string;
  subcategoryId?: string;
  city?: string;
  locality?: string;
  latitude?: number;
  longitude?: number;
  /** e.g. "Split AC" */
  refinement?: string;
}

// Request interface
export interface AgenticSearchRequest {
  searchQuery: string;
  sessionId?: string;
  context?: AgenticSearchContext;
}

export type AIResultType = 'results' | 'clarify' | 'no_results' | 'unsupported';
export type AIConfidenceTier = 'high' | 'medium' | 'low' | 'very_low';

/** What the backend understood - rendered as the "Got it — AC Repair" summary. */
export interface AIUnderstanding {
  intent: 'service_search' | 'clarify' | 'unsupported';
  conceptKey: string | null;
  label: string | null;
  category: string | null;
  subcategory: string | null;
  service: string | null;
  problem: string | null;
  unknownSubject: string | null;
  location: {
    city: string | null;
    locality: string | null;
    localityKnown: boolean;
    nearMe: boolean;
    source: 'query' | 'context' | 'none';
  };
  language: 'english' | 'hinglish' | 'hindi';
  confidence: number;
  tier: AIConfidenceTier;
  fuzzy: boolean;
  method: 'rules' | 'llm' | 'user_choice';
}

/** Per-provider relevance facts. Only real data: nulls mean "not available". */
export interface AIMatchInfo {
  kind: 'exact' | 'related';
  score: number;
  cityMatch: 'yes' | 'unknown' | null;
  localityMatch: boolean;
  distanceKm: number | null;
  rating: number | null;
  reviewCount: number;
}

export type AIService = Service & { match?: AIMatchInfo };

export interface AIAlternative {
  key: string;
  label: string;
}

export interface AIRefinements {
  question: string;
  options: Array<{ label: string; count: number }>;
  selected: string | null;
}

/** Fields added by the intent-aware backend. All optional so older backends still parse. */
export interface AgenticSearchExtras {
  resultType?: AIResultType;
  understanding?: AIUnderstanding;
  alternatives?: AIAlternative[];
  refinements?: AIRefinements;
  explore?: { categoryId: string; categoryName: string; subcategoryId?: string };
  elsewhereCount?: number;
}

// Success response interface
export interface AgenticSearchSuccessResponse extends AgenticSearchExtras {
  status: 'success';
  success: true;
  message: string;
  services: AIService[];
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
export interface AgenticSearchFailureResponse extends AgenticSearchExtras {
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
  services?: AIService[];
  suggestedCategories?: SuggestedCategory[];
  /** The full backend response, kept so the newest reply can render its rich results panel. */
  response?: AgenticSearchResponse;
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
  
