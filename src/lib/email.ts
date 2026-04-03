import { apiUrl } from './api';

// ── Types ─────────────────────────────────────────────────────────────────────

export type EmailType = 'verification' | 'reminder' | 'receipt' | 'custom';

interface BaseEmailPayload {
  to: string;
  name?: string;
}

export interface VerificationEmailPayload extends BaseEmailPayload {
  type: 'verification';
  data: {
    code: string;
  };
}

export interface ReminderEmailPayload extends BaseEmailPayload {
  type: 'reminder';
  data: {
    session_date: string; // e.g. "April 5, 2026"
    session_time: string; // e.g. "3:00 PM WAT"
    topic?: string;
    meet_link?: string;
  };
}

export interface ReceiptEmailPayload extends BaseEmailPayload {
  type: 'receipt';
  data: {
    amount: string | number;
    currency?: string; // default: "USD"
    reference?: string;
    plan?: string;
    paid_at?: string;
  };
}

export interface CustomEmailPayload extends BaseEmailPayload {
  type: 'custom';
  data: {
    subject: string;
    header?: string;
    content: string; // raw HTML allowed
  };
}

export type EmailPayload =
  | VerificationEmailPayload
  | ReminderEmailPayload
  | ReceiptEmailPayload
  | CustomEmailPayload;

// ── Response ──────────────────────────────────────────────────────────────────

export interface EmailResponse {
  success: boolean;
  message: string;
  type?: EmailType;
  error?: string;
}

// ── Core helper ───────────────────────────────────────────────────────────────

/**
 * Send a branded email via the Sledge backend.
 *
 * @example — Verification
 * await sendEmail({ type: 'verification', to: user.email, name: user.name, data: { code: '482910' } });
 *
 * @example — Session Reminder
 * await sendEmail({ type: 'reminder', to: user.email, name: user.name, data: { session_date: 'April 5, 2026', session_time: '3:00 PM WAT', meet_link: meetUrl } });
 *
 * @example — Receipt
 * await sendEmail({ type: 'receipt', to: user.email, name: user.name, data: { amount: '32.00', currency: 'USD', reference: txRef, plan: 'Sledge Mentorship' } });
 *
 * @example — Custom
 * await sendEmail({ type: 'custom', to: user.email, data: { subject: 'Welcome!', content: '<p>We are glad to have you.</p>' } });
 */
export async function sendEmail(payload: EmailPayload): Promise<EmailResponse> {
  const res = await fetch(apiUrl('/email.php'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const json: EmailResponse = await res.json();

  if (!res.ok) {
    throw new Error(json.message || `Email send failed (HTTP ${res.status})`);
  }

  return json;
}
