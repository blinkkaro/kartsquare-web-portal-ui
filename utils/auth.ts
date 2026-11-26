import { AI_LOCATION_STORAGE_KEY } from "@/constants/aiSearch";
import { secureStorage } from "@/helper/SecureStorage";
import type { User } from "@/services/auth/auth.interface";

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
      preferences: unknown;
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

/**
 * Session storage keys. Every read or write of the signed-in session goes through the helpers below, never
 * through `secureStorage` with a hand-typed key.
 */
export const SESSION_KEYS = {
  accessToken: "token",
  refreshToken: "refreshToken",
  user: "user_details",
  role: "role",
  registerStep: "register_step",
} as const;

/**
 * Everything the browser keeps about the signed-in person, wiped on every sign-out. Device settings (theme,
 * language, cached app config) are not about the person and stay.
 */
/** The address a password reset was requested for, handed from /forgotPassword to /resetPassword (never in the URL). */
export const PASSWORD_RESET_EMAIL_KEY = "password_reset_email";

/** `?role=<role>` for auth links, or nothing when there is no role (never `role=null`). */
export const roleQuery = (role?: string | null): string =>
  role && role !== "null" && role !== "undefined" ? `?role=${encodeURIComponent(role)}` : "";

const PERSONAL_LOCAL_STORAGE_KEYS: readonly string[] = [
  ...Object.values(SESSION_KEYS),
  "user", // legacy copy of the user, still read by myPreferences
  "otp_expiry_timestamp", // email-verification resend timer (emailVerfication)
  AI_LOCATION_STORAGE_KEY, // the place the person picked for Kart AI
  "kartsquare_location_prompted", // whether this person was asked for location (useAILocation)
];
const PERSONAL_SESSION_STORAGE_KEYS: readonly string[] = [
  "bus_lead_id", // business-listing lead being registered (useLeadVerification)
  PASSWORD_RESET_EMAIL_KEY,
];

export interface SessionTokens {
  access_token: string;
  refresh_token: string;
}

/** Save a freshly signed-in (or registered) session. */
export const persistSession = (user: User, tokens?: SessionTokens): void => {
  if (typeof window === "undefined") return;
  if (tokens) {
    secureStorage.setItem(SESSION_KEYS.accessToken, tokens.access_token);
    secureStorage.setItem(SESSION_KEYS.refreshToken, tokens.refresh_token);
  }
  secureStorage.setItem(SESSION_KEYS.user, user);
  secureStorage.setItem(SESSION_KEYS.role, user.role);
  secureStorage.setItem(SESSION_KEYS.registerStep, user.register_step);
};

/** Save tokens returned by the refresh endpoint. */
export const persistTokens = (tokens: SessionTokens): void => {
  if (typeof window === "undefined") return;
  secureStorage.setItem(SESSION_KEYS.accessToken, tokens.access_token);
  secureStorage.setItem(SESSION_KEYS.refreshToken, tokens.refresh_token);
};

export const storeTokens = (response: RegisterResponse): void => {
  if (response.data?.tokens) persistTokens(response.data.tokens);
};

export const getTokens = () => {
  if (typeof window !== "undefined") {
    return {
      accessToken: secureStorage.getItem(SESSION_KEYS.accessToken) as string | null,
      refreshToken: secureStorage.getItem(SESSION_KEYS.refreshToken) as string | null,
    };
  }
  return { accessToken: null, refreshToken: null };
};

/**
 * Wipe everything stored about the signed-in person. This is the storage half of signing out; the whole flow
 * (backend revoke, Redux, query cache, redirect) is `useLogout`.
 */
export const clearSession = (): void => {
  if (typeof window === "undefined") return;
  PERSONAL_LOCAL_STORAGE_KEYS.forEach((key) => secureStorage.removeItem(key));
  try {
    PERSONAL_SESSION_STORAGE_KEYS.forEach((key) => window.sessionStorage.removeItem(key));
  } catch {
    // sessionStorage can be blocked (private mode, sandboxed frame); nothing to clear then.
  }
  sessionEndListeners.forEach((listener) => listener());
};

/** @deprecated Use `clearSession`; kept so older imports keep compiling. */
export const clearTokens = clearSession;

type SessionEndListener = () => void;
const sessionEndListeners = new Set<SessionEndListener>();

/**
 * Run `listener` whenever the session is cleared, whatever triggered it (the logout button, a failed token
 * refresh, abandoning registration). Used to drop in-memory caches. Returns the unsubscribe.
 */
export const onSessionEnd = (listener: SessionEndListener): (() => void) => {
  sessionEndListeners.add(listener);
  return () => {
    sessionEndListeners.delete(listener);
  };
};

export const getUserRole = (): string | null => {
  if (typeof window !== "undefined") {
    const userDetails = secureStorage.getItem(SESSION_KEYS.user);
    return userDetails?.role || null;
  }
  return null;
};

export const getUserId = (): string | null => {
  if (typeof window !== "undefined") {
    const userDetails = secureStorage.getItem(SESSION_KEYS.user);
    return userDetails?.id || null;
  }
  return null;
};

/**
 * Who may create posts, reels and stories: service providers only, for now. Everyone else can read, like and
 * comment, but never sees the create or upload controls. (The backend must enforce this too; hiding a button is
 * not security.)
 */
export const canCreatePosts = (role?: string | null): boolean =>
  role?.toUpperCase() === UserRole.SERVICE_PROVIDER;
