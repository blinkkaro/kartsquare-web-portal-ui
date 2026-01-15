export interface RegisterResponse {
  status: string;
  message: string;
  data: {
    user: {
      id: string;
      email: string;
      first_name: string;
      last_name: string;
      phone_number: string;
      country_code: string;
      country: string;
      birth_date: string;
      gender: string;
      role: string;
      is_verified: boolean;
      last_login_at: string | null;
      created_at: string;
      updated_at: string;
      register_step: number;
      profile_pic: string | null;
      verification_pending_config: {
        email_otp: {
          otp: string;
          sentAt: string;
          attempts: number;
          verified: boolean;
          expiresAt: string;
        };
      };
      preferences: any;
      register_method: string;
      account_type: string;
      is_active: boolean;
      status: string;
      is_deleted: boolean;
      user_rating: number;
      rejected_reason: string | null;
      is_approved: boolean;
      bio: string | null;
    };
    tokens: {
      access_token: string;
      refresh_token: string;
    };
  };
}

// User roles from backend
export enum UserRole {
  ADMIN = "ADMIN",
  CUSTOMER = "CUSTOMER",
  SERVICE_PROVIDER = "SERVICE_PROVIDER",
  SUPPLIER = "SUPPLIER",
  MANAGER = "MANAGER",
  SUPPORT = "SUPPORT",
}

export const storeTokens = (response: RegisterResponse): void => {
  if (typeof window !== 'undefined' && response.data?.tokens) {
    localStorage.setItem('token', response.data.tokens.access_token);
    localStorage.setItem('refreshToken', response.data.tokens.refresh_token);
  }
};

export const getTokens = () => {
  if (typeof window !== 'undefined') {
    return {
      accessToken: localStorage.getItem('token'),
      refreshToken: localStorage.getItem('refreshToken'),
    };
  }
  return { accessToken: null, refreshToken: null };
};

export const clearTokens = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }
};

/**
 * Store user details and tokens in localStorage (login/signup)
 */
export const storeAuthData = (response: RegisterResponse): void => {
  if (typeof window !== 'undefined' && response.data) {
    // Store tokens
    storeTokens(response);
    // Store user details
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
};

/**
 * Get user details from localStorage
 */
export const getUserDetails = (): RegisterResponse['data']['user'] | null => {
  if (typeof window !== 'undefined') {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return null;
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error getting user details:', error);
      return null;
    }
  }
  return null;
};

/**
 * Get user role from localStorage
 */
export const getUserRole = (): string | null => {
  const user = getUserDetails();
  return user?.role || null;
};

/**
 * Get user ID from localStorage
 */
export const getUserId = (): string | null => {
  const user = getUserDetails();
  return user?.id || null;
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    return !!token;
  }
  return false;
};

/**
 * Check if user has a specific role
 */
export const hasRole = (role: UserRole): boolean => {
  const userRole = getUserRole();
  return userRole === role;
};

/**
 * Clear all auth data from localStorage (logout)
 */
export const clearAuthData = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }
};

/**
 * Update user details in localStorage
 */
export const updateUserDetails = (user: Partial<RegisterResponse['data']['user']>): void => {
  if (typeof window !== 'undefined') {
    try {
      const currentUser = getUserDetails();
      if (currentUser) {
        const updatedUser = { ...currentUser, ...user };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Error updating user details:', error);
    }
  }
};