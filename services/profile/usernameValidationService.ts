import { GET, POST } from "../api";

export interface UsernameValidationResponse {
  status: "success" | "error";
  message: string;
  data?: {
    isAvailable: boolean;
    message: string;
  };
  statusCode?: number;
  errors?: Array<{
    field: string;
    message: string;
    code: string;
  }>;
}

class UsernameValidationService {
  async validateUsername(username: string): Promise<UsernameValidationResponse> {
    try {
      const response = await POST<UsernameValidationResponse>(
        "/profile/custom-username/validate",
        { username: username },
        {},
        true
      );
      
      // Handle both ApiResponse and direct response
      const apiResponse = response as unknown as UsernameValidationResponse;
      
      if ('data' in apiResponse && apiResponse.data) {
        return apiResponse;
      }
      
      return apiResponse;
    } catch (error: any) {
      // Handle error response
      if (error?.response?.data) {
        return error.response.data as UsernameValidationResponse;
      }
      
      // Return error format
      return {
        status: "error",
        message: error?.message || "Failed to validate username",
        errors: [
          {
            field: "username",
            message: error?.message || "Validation failed",
            code: "validation_error",
          },
        ],
      };
    }
  }
}

export const usernameValidationService = new UsernameValidationService();
