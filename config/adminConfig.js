// Centralized admin configuration
export const ADMIN_EMAILS = [
  'nanahsunuy@gmail.com',
  'noorly21118@gmail.com',
  // Add more admin emails here
];

export const isAdminEmail = (email) => {
  return ADMIN_EMAILS.includes(email?.toLowerCase());
};

export const getAdminEmails = () => {
  return [...ADMIN_EMAILS];
};
