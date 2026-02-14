import { service_address } from "@/services/providerDashboard/providerDashboard.interface";
import { TranslationKey } from "../features/i18n/TranslationContext";

export const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

export const formatTo12Hour = (time24: string): string => {
  if (!time24) return "";
  const [hours, minutes] = time24.split(":").map(Number);
  if (isNaN(hours) || isNaN(minutes)) return "";
  const period = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12 || 12;
  return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
};

export const formatDateToString = (date: Date) => {
  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  const dateValue = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return `${dateValue}, ${time}`;
};

export const formatDate = (dateString: string | Date): string => {
  if (!dateString) return "";
  const date =
    typeof dateString === "string" ? new Date(dateString) : dateString;

  if (isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatTimestamp = (dateString: string | Date): string => {
  let date: Date;

  if (typeof dateString === "string") {
    // Parse the date string directly - JavaScript handles ISO 8601 formats correctly
    date = new Date(dateString);
  } else {
    date = dateString;
  }

  if (isNaN(date.getTime())) {
    return "Invalid date";
  }

  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 0) return "Just now";

  let interval = seconds / 31536000;
  if (interval > 1) return `${Math.floor(interval)} years ago`;

  interval = seconds / 2592000;
  if (interval > 1) return `${Math.floor(interval)} months ago`;

  interval = seconds / 86400;
  if (interval > 1) return `${Math.floor(interval)} days ago`;

  interval = seconds / 3600;
  if (interval > 1) return `${Math.floor(interval)} hours ago`;

  interval = seconds / 60;
  if (interval > 1) return `${Math.floor(interval)} minutes ago`;

  return `Just now`;
};

export const formatCount = (count: number): string => {
  if (!count) return "0";
  if (count < 1000) return count.toString();
  if (count < 1000000) {
    return (count / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  }
  return (count / 1000000).toFixed(1).replace(/\.0$/, "") + "m";
};

export const convert12To24 = (time12: string): string => {
  if (!time12) return "";
  const [time, period] = time12.split(" ");
  if (!time || !period) return time12;
  let [hours, minutes] = time.split(":").map(Number);
  if (isNaN(hours) || isNaN(minutes)) return "";

  if (period.toUpperCase() === "PM" && hours !== 12) {
    hours += 12;
  } else if (period.toUpperCase() === "AM" && hours === 12) {
    hours = 0;
  }

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
};

export const sanitizeData = (data: any): any => {
  const sanitized = { ...data };
  Object.keys(sanitized).forEach((key) => {
    if (sanitized[key] === null || sanitized[key] === undefined) {
      sanitized[key] = "";
    }
  });
  return sanitized;
};
// Helper function to calculate distance between two coordinates (Haversine formula)
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};

export const formatStringTimeForReview = (timeStr: string | Date): string => {
  const date = new Date(timeStr);
  const formattedDate = formatDate(date);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12; // Handle 0 as 12
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
  return `${formattedDate} @ ${formattedHours}:${formattedMinutes} ${ampm}`;
};

// Helper function to truncate HTML content safely
export const truncateHTML = (html: string, maxLength: number): string => {
  // Create a temporary div to parse HTML
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  const textContent = tempDiv.textContent || tempDiv.innerText || "";

  // If text content is within limit, return original HTML
  if (textContent.length <= maxLength) {
    return html;
  }

  // Otherwise, truncate the text content and return plain text with ellipsis
  return textContent.slice(0, maxLength) + "...";
};

export const formatAddress = (
  address: service_address,
  t: (key: TranslationKey) => string,
): string => {
  const landmarkText = address.landmark
    ? `${t("near")} ${address.landmark}`
    : undefined;

  const parts = [
    address.building_no,
    address.floor,
    address.address,
    landmarkText,
    address.city_town,
    address.state,
    address.country,
  ]
    .filter((part) => part && part.trim().length > 0)
    .map((part) => part!.trim());

  let result = parts.join(", ");

  if (address.pincode) {
    result = result ? `${result} - ${address.pincode}` : `${address.pincode}`;
  }

  if (address.address) {
    result += ` (${address.address})`;
  }

  return result;
};

export const seededRandom = (seed: number) => {
  let m = 0x80000000;
  let a = 1103515245;
  let c = 12345;

  let state = seed || Math.floor(Math.random() * (m - 1));

  return function () {
    state = (a * state + c) % m;
    return state / (m - 1);
  };
};
