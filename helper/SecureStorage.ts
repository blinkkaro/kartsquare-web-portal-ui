// Only the AES cipher and UTF-8 encoder, not the whole crypto-js bundle (SHA-3, RIPEMD, other
// ciphers). Output is byte-for-byte the same as CryptoJS.AES, so stored values still decrypt.
import AES from "crypto-js/aes";
import Utf8 from "crypto-js/enc-utf8";

const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY || "your-fallback-secret-key";

export const secureStorage = {
  // 1. Encrypt and Save
  setItem: (key: string, value: unknown) => {
    if (typeof window === "undefined") return; // Guard for server-side

    if (!SECRET_KEY) {
      console.warn(
        "SecureStorage: SECRET_KEY is not defined. Data will not be encrypted properly.",
      );
      return;
    }

    try {
      // Encrypt the value
      const encrypted = AES.encrypt(JSON.stringify(value), SECRET_KEY).toString();

      // Save to local storage
      localStorage.setItem(key, encrypted);
    } catch (error) {
      console.error("Encryption error:", error);
    }
  },

  // 2. Decrypt and Read
  getItem: (key: string) => {
    if (typeof window === "undefined") return null;

    if (!SECRET_KEY) {
      console.warn("SecureStorage: SECRET_KEY is missing, cannot decrypt.");
      return null;
    }

    try {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) return null;

      // Decrypt the value
      const bytes = AES.decrypt(encrypted, SECRET_KEY);
      const decrypted = bytes.toString(Utf8);

      if (!decrypted) {
        // Handle case where decryption fails (unavailable key or bad data)
        return null;
      }

      return JSON.parse(decrypted);
    } catch {
      console.warn("SecureStorage: Decryption failed for key:", key, "clearing item.");
      localStorage.removeItem(key); // Clear invalid data
      return null;
    }
  },

  // 3. Remove Item
  removeItem: (key: string) => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(key);
    }
  },

  clear: () => {
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
  },
};
