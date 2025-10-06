import { assignAdminRoleIfEligible } from './adminRoleManager.js';
import { getAdminEmails } from '../config/adminConfig.js';

// Function to set admin role for all admin emails
const setAdminRolesForAllEmails = async () => {
  const adminEmails = getAdminEmails();
  console.log(`Setting admin roles for ${adminEmails.length} admin emails...`);
  
  for (const email of adminEmails) {
    try {
      // Note: This requires the user to already exist in Firebase
      // You might want to handle this differently in production
      console.log(`Attempting to set admin role for ${email}...`);
      // This would need the Firebase UID, which we don't have here
      // Consider running this as a one-time setup script with proper UIDs
    } catch (error) {
      console.error(`Error setting admin role for ${email}:`, error);
    }
  }
};

// Export for manual execution
export { setAdminRolesForAllEmails };