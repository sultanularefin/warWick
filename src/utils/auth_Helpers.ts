import {
  EMAIL_REGEX,
  PASSWORD_REGEX,
  USERNAME_REGEX,
} from '../constants/regex_constants.ts';
import { Country } from '../types/auth_Types.ts';
import { COUNTRIES } from '../constants/auth_Constants.ts';

const validateEmail = (email: string): boolean =>
  EMAIL_REGEX.test(email.trim());
const validateUsername = (username: string): boolean =>
  USERNAME_REGEX.test(username.trim());
const validatePassword = (password: string): boolean =>
  PASSWORD_REGEX.test(password);

const validatePhone = (phone: string, country: Country): boolean => {
  const cleaned = phone.replace(/[\s\-()]/g, '');
  if (!/^\+?\d{6,15}$/.test(cleaned)) {
    console.log('1 for phone and country:', phone, country);
    return false;
  }

  // Country-specific dial code check
  if (country.dialCode) {
    const digitsOnly = cleaned.replace(/\+/g, '');
    const dialDigits = country.dialCode.replace(/\+/g, '');
    if (!digitsOnly.startsWith(dialDigits)) return false;

    const localPart = digitsOnly.slice(dialDigits.length);
    // Simple length checks per country (extendable)
    if (country.code === 'BD') return /^1\d{9}$/.test(localPart);
    if (country.code === 'US' || country.code === 'CA')
      return /^\d{10}$/.test(localPart);
    if (country.code === 'GB') return /^\d{9,10}$/.test(localPart);
    if (country.code === 'IN') return /^\d{10}$/.test(localPart);
    return localPart.length >= 6 && localPart.length <= 13;
  }
  return true;
};

const validateCountry = (code: string): boolean =>
  COUNTRIES.some(c => c.code === code);

export {
  validateEmail,
  validateUsername,
  validateCountry,
  validatePassword,
  validatePhone,
};
