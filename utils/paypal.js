import checkoutNodeJssdk from '@paypal/checkout-server-sdk';
import dotenv from 'dotenv';

dotenv.config();

// Validate environment variables
const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_MODE } = process.env;
if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
  throw new Error('Missing PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET in .env');
}

// Set up PayPal environment
const environment = PAYPAL_MODE === 'sandbox'
  ? new checkoutNodeJssdk.core.SandboxEnvironment(PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET)
  : new checkoutNodeJssdk.core.LiveEnvironment(PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET);

const client = new checkoutNodeJssdk.core.PayPalHttpClient(environment);

export default client;