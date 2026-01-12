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