/**
 * Sledge Application Configuration
 * Change the MODE to 'production' for live deployment, or 'development' for local testing.
 */
const MODE: string = 'production'; // 'development' | 'production'

const development = {
  API_BASE: "http://localhost/sledge/api",
  SITE_URL: "http://localhost:5173",
  STRIPE_PUBLIC_KEY: "pk_test_51SeDqp2ayVYz5QmxI4tE4p99n1Slnm7qpxJof17pLrkfH4W6pU2uV2i6I6pS7Z8o6V9H", // Replace with your test key
  PAYSTACK_PUBLIC_KEY: "pk_test_1e566a7dc7986976288652153dde39f8ff406ea4",
};

const production = {
  API_BASE: "https://api.sledgementorship.com/api",
  SITE_URL: "https://sledgementorship.com",
  STRIPE_PUBLIC_KEY: "pk_live_51SeDqp2ayVYz5QmxLkxRcGXKDP8hH8NcYmw1rHstq7m7HxLWNWEKSrgtXXKhSMQNssWRHmGwFHRM3e28ShvgJdej00kjTiUyTT", // REPLACE WITH YOUR LIVE KEY
  PAYSTACK_PUBLIC_KEY: "pk_live_295b6fbafda97e7bfae68b6e4a26784d706fe6e7", // REPLACE WITH YOUR LIVE KEY
};

export const CONFIG = MODE === 'production' ? production : development;
export default CONFIG;
