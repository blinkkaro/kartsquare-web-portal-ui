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
