import Stripe from "stripe";

declare global {
  var stripe: Stripe;
}

const SECRET_KEY = process.env.STRIPE_SECRET_KEY!;

if (!SECRET_KEY) {
  throw new Error(
    "Please define the STRIPE_SECRET_KEY environment variable inside .env.local"
  );
}

let cached = global.stripe;

if (!cached) {
  cached = global.stripe = new Stripe(SECRET_KEY);
}

export const initStripe = () => {
  if (!cached) {
    cached = global.stripe = new Stripe(SECRET_KEY);
  }
  return cached;
};

export default cached;
