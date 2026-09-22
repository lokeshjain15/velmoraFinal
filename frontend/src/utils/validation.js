// ==========================================
// COMMON FORM VALIDATION UTILITIES
// ==========================================

export const isRequired = (value) => {
  return String(value ?? "").trim().length > 0;
};

// Email validation
export const isValidEmail = (email) => {
  const value = String(email ?? "").trim();

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  return emailRegex.test(value);
};

// Name validation
// Allows letters and spaces.
// Also supports common characters such as apostrophe and hyphen.
export const isValidName = (name) => {
  const value = String(name ?? "").trim();

  const nameRegex =
    /^[A-Za-z][A-Za-z\s'-]{1,49}$/;

  return nameRegex.test(value);
};

// Indian mobile number
// Exactly 10 digits and starts with 6, 7, 8 or 9.
export const isValidPhone = (phone) => {
  const value = String(phone ?? "")
    .replace(/\D/g, "");

  const phoneRegex = /^[6-9]\d{9}$/;

  return phoneRegex.test(value);
};

// Indian PIN code
// 6 digits and cannot start with 0.
export const isValidIndianPostalCode = (postalCode) => {
  const value = String(postalCode ?? "")
    .trim();

  const postalCodeRegex = /^[1-9]\d{5}$/;

  return postalCodeRegex.test(value);
};

// Password validation
// Minimum 8 characters
// At least one uppercase letter
// At least one lowercase letter
// At least one number
// At least one special character
export const isValidPassword = (password) => {
  const value = String(password ?? "");

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

  return passwordRegex.test(value);
};

// Message validation
export const isValidMessage = (message) => {
  const value = String(message ?? "").trim();

  return value.length >= 10 && value.length <= 1000;
};