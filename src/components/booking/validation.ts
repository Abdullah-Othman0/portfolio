export interface BookingFormData {
  name: string;
  email: string;
  company?: string;
  subject: string;
  preferredDate: string;
  preferredTime: string;
  message?: string;
  _honey?: string;
}

export interface ValidationErrors {
  [field: string]: string;
}

export const FIELD_LIMITS = {
  name: { max: 100, required: true },
  email: { max: 254, required: true },
  company: { max: 200, required: false },
  subject: { max: 200, required: true },
  preferredDate: { max: 10, required: true },
  preferredTime: { max: 5, required: true },
  message: { max: 2000, required: false },
} as const;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function get24HoursFromNow(): Date {
  const now = new Date();
  now.setHours(now.getHours() + 24);
  return now;
}

export function isAtLeast24HoursAhead(dateStr: string, timeStr: string): boolean {
  const combined = new Date(`${dateStr}T${timeStr}:00`);
  return combined.getTime() >= get24HoursFromNow().getTime();
}

export function validateField(field: string, value: string): string | null {
  const limits = FIELD_LIMITS[field as keyof typeof FIELD_LIMITS];
  if (!limits) return null;

  if (limits.required && !value.trim()) {
    const label = field === "preferredDate" ? "Preferred Date"
      : field === "preferredTime" ? "Preferred Time"
      : field.charAt(0).toUpperCase() + field.slice(1);
    return `${label} is required`;
  }

  if (!value.trim()) return null;

  if (value.length > limits.max) {
    return `${field} must be ${limits.max} characters or less`;
  }

  if (field === "email" && !EMAIL_REGEX.test(value)) {
    return "Please enter a valid email address";
  }

  return null;
}

export function validateForm(data: BookingFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  for (const field of Object.keys(FIELD_LIMITS)) {
    if (field === "preferredDate" || field === "preferredTime") continue;
    const value = data[field as keyof BookingFormData] || "";
    const error = validateField(field, value);
    if (error) errors[field] = error;
  }

  const dateError = validateField("preferredDate", data.preferredDate || "");
  if (dateError) errors.preferredDate = dateError;

  const timeError = validateField("preferredTime", data.preferredTime || "");
  if (timeError) errors.preferredTime = timeError;

  if (!errors.preferredDate && !errors.preferredTime && data.preferredDate && data.preferredTime) {
    if (!isAtLeast24HoursAhead(data.preferredDate, data.preferredTime)) {
      errors.preferredDate = "Meeting must be booked at least 24 hours in advance";
    }
  }

  return errors;
}

export function sanitizeInput(value: string): string {
  return value
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}
