/**
 * Sledge Application Configuration
 * Change the MODE to 'production' for live deployment, or 'development' for local testing.
 */
const MODE: 'development' | 'production' = 'development';

const development = {
  API_BASE: "http://localhost/sledge/api",
  SITE_URL: "http://localhost:5173",
  STRIPE_PUBLIC_KEY: "pk_test_51SeDqp2ayVYz5QmxI4tE4p99n1Slnm7qpxJof17pLrkfH4W6pU2uV2i6I6pS7Z8o6V9H", // Replace with your test key
  PAYSTACK_PUBLIC_KEY: "pk_test_1e566a7dc7986976288652153dde39f8ff406ea4",
};

const production = {
  API_BASE: "https://api.sledgementorship.com/api",
  SITE_URL: "https://sledgementorship.com",
  STRIPE_PUBLIC_KEY: "pk_test_51SeDqp2ayVYz5QmxI4tE4p99n1Slnm7qpxJof17pLrkfH4W6pU2uV2i6I6pS7Z8o6V9H", // REPLACE WITH YOUR LIVE KEY
  PAYSTACK_PUBLIC_KEY: "pk_test_1e566a7dc7986976288652153dde39f8ff406ea4", // REPLACE WITH YOUR LIVE KEY
};

export const CONFIG = MODE === 'development' ? development : production;
export default CONFIG;
