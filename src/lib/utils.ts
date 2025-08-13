import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date string or Date object into a nice, readable format
 * @param date - Date string (ISO format) or Date object
 * @param options - Formatting options
 * @returns Formatted date string
 */
export function formatDate(
  date: string | Date,
  options: {
    includeTime?: boolean;
    relative?: boolean;
    format?: "short" | "medium" | "long";
  } = {}
): string {
  const { includeTime = false, relative = false, format = "medium" } = options;

  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;

    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return "Invalid date";
    }

    // Return relative time if requested
    if (relative) {
      return formatRelativeTime(dateObj);
    }

    // Format based on the format option
    const formatOptions: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: format === "short" ? "short" : format === "long" ? "long" : "short",
      day: "numeric",
    };

    if (includeTime) {
      formatOptions.hour = "2-digit";
      formatOptions.minute = "2-digit";
    }

    return dateObj.toLocaleDateString("en-US", formatOptions);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
}

/**
 * Format a date as relative time (e.g., "2 days ago", "in 3 hours")
 * @param date - Date to format
 * @returns Relative time string
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (Math.abs(seconds) < 60) {
    return "just now";
  } else if (Math.abs(minutes) < 60) {
    return `${minutes} minute${Math.abs(minutes) !== 1 ? "s" : ""} ago`;
  } else if (Math.abs(hours) < 24) {
    return `${hours} hour${Math.abs(hours) !== 1 ? "s" : ""} ago`;
  } else if (Math.abs(days) < 30) {
    return `${days} day${Math.abs(days) !== 1 ? "s" : ""} ago`;
  } else if (Math.abs(months) < 12) {
    return `${months} month${Math.abs(months) !== 1 ? "s" : ""} ago`;
  } else {
    return `${years} year${Math.abs(years) !== 1 ? "s" : ""} ago`;
  }
}

/**
 * Format a deadline date with urgency indication
 * @param deadline - Deadline date string or Date object
 * @returns Object with formatted date and urgency level
 */
export function formatDeadline(deadline: string | Date): {
  formatted: string;
  urgency: "expired" | "urgent" | "soon" | "normal";
  daysLeft: number;
} {
  const deadlineDate = typeof deadline === "string" ? new Date(deadline) : deadline;
  const now = new Date();
  const diff = deadlineDate.getTime() - now.getTime();
  const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));

  let urgency: "expired" | "urgent" | "soon" | "normal";
  if (daysLeft < 0) {
    urgency = "expired";
  } else if (daysLeft <= 3) {
    urgency = "urgent";
  } else if (daysLeft <= 7) {
    urgency = "soon";
  } else {
    urgency = "normal";
  }

  const formatted = daysLeft < 0 
    ? `Expired ${Math.abs(daysLeft)} day${Math.abs(daysLeft) !== 1 ? "s" : ""} ago`
    : daysLeft === 0
    ? "Due today"
    : daysLeft === 1
    ? "Due tomorrow"
    : `${daysLeft} days left`;

  return {
    formatted,
    urgency,
    daysLeft,
  };
}
