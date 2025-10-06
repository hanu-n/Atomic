import admin from './firebaseAdmin.js';
import { isAdminEmail } from '../config/adminConfig.js';

/**
 * Assigns admin role to a user if their email is in the admin list
 * @param {string} firebaseUID - Firebase user ID
 * @param {string} email - User's email
 * @returns {Promise<boolean>} - Returns true if admin role was assigned, false otherwise
 */
export const assignAdminRoleIfEligible = async (firebaseUID, email) => {
  try {
    if (!isAdminEmail(email)) {
      console.log(`Email ${email} is not in admin list`);
      return false;
    }

    // Set Firebase custom claim
    await admin.auth().setCustomUserClaims(firebaseUID, { admin: true });
    console.log(`✅ Admin role assigned to ${email} (UID: ${firebaseUID})`);
    return true;
  } catch (error) {
    console.error(`❌ Error assigning admin role to ${email}:`, error);
    throw error;
  }
};

/**
 * Removes admin role from a user
 * @param {string} firebaseUID - Firebase user ID
 * @param {string} email - User's email
 * @returns {Promise<boolean>} - Returns true if admin role was removed
 */
export const removeAdminRole = async (firebaseUID, email) => {
  try {
    // Remove Firebase custom claim
    await admin.auth().setCustomUserClaims(firebaseUID, { admin: false });
    console.log(`✅ Admin role removed from ${email} (UID: ${firebaseUID})`);
    return true;
  } catch (error) {
    console.error(`❌ Error removing admin role from ${email}:`, error);
    throw error;
  }
};

/**
 * Checks if a user has admin role in Firebase
 * @param {string} firebaseUID - Firebase user ID
 * @returns {Promise<boolean>} - Returns true if user has admin role
 */
export const checkAdminRoleInFirebase = async (firebaseUID) => {
  try {
    const user = await admin.auth().getUser(firebaseUID);
    return user.customClaims?.admin === true;
  } catch (error) {
    console.error(`❌ Error checking admin role for UID ${firebaseUID}:`, error);
    return false;
  }
};
