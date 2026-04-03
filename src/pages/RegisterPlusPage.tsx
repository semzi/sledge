import { useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PhoneInput from "../lib/phoneInput";
import { apiUrl } from "../lib/api";
import { usePaystackPayment } from "react-paystack";
import { useContent } from "../contexts/ContentContext";

type RegisterResponse = {
  checkout_url?: string;
  registration_id?: string | number;
  checkout_session_id?: string;
  payment_gateway?: "stripe" | "paystack";
  missing?: string[];
  invalid?: string[];
  message?: string;
};

import { CONFIG } from "../lib/config";

export default function RegisterPlusPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const canceled = searchParams.get("canceled");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [linkedInUrl, setLinkedInUrl] = useState("");
  const [currentStatus, setCurrentStatus] = useState("");
  const [institutionOrOrganization, setInstitutionOrOrganization] = useState("");
  const [fieldOrRole, setFieldOrRole] = useState("");
  const [highestEducation, setHighestEducation] = useState("");
  const [motivation, setMotivation] = useState("");
  const [previousExperience, setPreviousExperience] = useState("");
  const [clarityToolsExpectation, setClarityToolsExpectation] = useState("");
  const [confirmCommitment, setConfirmCommitment] = useState<"yes" | "no" | "">("");

  const [selectedCurrency, setSelectedCurrency] = useState<"USD" | "NGN" | null>(null);

  const { content, loading: loadingContent } = useContent();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const plusPricing = content?.programs?.plus;

  const pricing = useMemo(() => {
    if (!plusPricing || !selectedCurrency) return null;
    
    if (selectedCurrency === "USD") {
      const total = plusPricing.priceUsd;
      return { subtotal: total, tax: 0, total, symbol: "$", code: "USD" };
    } else if (selectedCurrency === "NGN") {
      const total = plusPricing.priceNgn;
      return { subtotal: total, tax: 0, total, symbol: "₦", code: "NGN" };
    }
    return null;
  }, [selectedCurrency, plusPricing]);

  // Paystack Configuration
  const paystackConfig = {
    reference: (new Date()).getTime().toString(),
    email: email,
    amount: (pricing?.total || 0) * 100, // Paystack expects amount in Kobo
    publicKey: CONFIG.PAYSTACK_PUBLIC_KEY,
    currency: "NGN",
  };

  const initializePaystack = usePaystackPayment(paystackConfig);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!fullName.trim()) errors.fullName = "Full name is required";
    if (!email.trim()) {
      errors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = "Please enter a valid email address";
    }
    
    if (!phone.trim()) errors.phone = "Phone number is required";
    if (!country.trim()) errors.country = "Country is required";
    
    if (!linkedInUrl.trim()) {
      errors.linkedInUrl = "LinkedIn profile URL is required";
    } else {
      try {
        const u = new URL(linkedInUrl.trim());
        if (!u.hostname.toLowerCase().includes("linkedin.com")) {
          errors.linkedInUrl = "Invalid LinkedIn URL";
        }
      } catch {
        errors.linkedInUrl = "Invalid URL";
      }
    }

    if (!currentStatus.trim()) errors.currentStatus = "Education level is required";
    if (!institutionOrOrganization.trim()) errors.institutionOrOrganization = "Institution/Organization is required";
    if (!fieldOrRole.trim()) errors.fieldOrRole = "Field of study/industry is required";
    if (!highestEducation.trim()) errors.highestEducation = "Highest degree is required";
    if (!motivation.trim()) errors.motivation = "Please provide your motivation";

    if (confirmCommitment !== "yes") errors.confirmCommitment = "You must confirm your commitment";
    if (!selectedCurrency) errors.selectedCurrency = "Please select a currency";

    return errors;
  };

  const handlePaystackSuccess = (registrationId: string | number) => {
    // Save minimal receipt info for success page
    sessionStorage.setItem(
      "sledge_receipt",
      JSON.stringify({
        name: fullName,
        email,
        cohort: new Date().getFullYear() + 1,
        subtotal: pricing?.subtotal,
        total: pricing?.total,
        symbol: pricing?.symbol,
        created_at: new Date().toISOString(),
      })
    );
    navigate(`/payment-success?rid=${registrationId}&gateway=paystack`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setFieldErrors({});

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError("Please fix the errors below to continue.");
      setSubmitting(false);
      return;
    }

    try {
      const payload = {
        full_name: fullName,
        email,
        phone,
        country,
        linkedin_url: linkedInUrl,
        current_status: currentStatus,
        institution_or_organization: institutionOrOrganization,
        field_or_role: fieldOrRole,
        highest_education: highestEducation,
        motivation,
        previous_experience: previousExperience,
        clarity_tools_expectation: clarityToolsExpectation,
        confirm_commitment: confirmCommitment,
        agree_payment: "yes",
        registration_status: "pending",
        mode: "plus",
        currency: selectedCurrency,
        amount: pricing?.total,
        success_url: `${CONFIG.SITE_URL}/payment-success`,
        cancel_url: `${CONFIG.SITE_URL}/register-plus?canceled=1`,
      };

      const res = await fetch(apiUrl("/register-plus.php"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as RegisterResponse;

      if (!res.ok) {
        // Handle backend field errors if any (mapping keys if different)
        setError(data.message || "Submission failed. Please check your entries.");
        setSubmitting(false);
        return;
      }

      // ── Handle Response based on Gateway ──────────────────────────
      if (data.payment_gateway === "stripe" && data.checkout_url) {
        // Stripe flow - redirect to their portal
        sessionStorage.setItem(
          "sledge_receipt",
          JSON.stringify({
            name: fullName,
            email,
            cohort: new Date().getFullYear() + 1,
            subtotal: pricing?.subtotal,
            total: pricing?.total,
            symbol: pricing?.symbol,
            created_at: new Date().toISOString(),
          })
        );
        window.location.href = data.checkout_url;
      } else if (data.payment_gateway === "paystack") {
        // Paystack flow - Initialize Popup
        initializePaystack({
          onSuccess: () => handlePaystackSuccess(data.registration_id!),
          onClose: () => setSubmitting(false)
        });
      } else {
        setError("Invalid payment configuration. Please contact support.");
        setSubmitting(false);
      }
    } catch {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative font-poppins bg-[#09090b] text-white animate-mesh">
      <Header />

      <main className="relative z-10 px-6 md:px-12 py-10">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl px-4 md:px-6 p-8">
            <div className="flex flex-col sm:items-start sm:justify-between gap-2 mb-2">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Application Form: {plusPricing?.title || "SLEDGE+ Membership"}
                </h2>
                <div className="mb-6 text-gray-300 text-sm leading-relaxed">
                  <strong>I. Program Introduction & Commitment</strong>
                  <p className="mt-2">
                    {plusPricing?.desc1 || "Loading..."}
                  </p>
                </div>
              </div>
            </div>

            {loadingContent ? (
              <div className="py-10 text-center text-white/50">Loading application details...</div>
            ) : (
              <>
                {canceled ? (
                  <div className="mt-4 rounded-xl border border-white/15 bg-black/30 p-4 text-sm text-white/80">
                    Payment was canceled. You can try again.
                  </div>
                ) : null}

                {error && (
                  <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 font-poppins">
                    <div className="text-sm text-red-200">{error}</div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4 font-poppins">
              {/* Form Fields: 1 to 10 */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/80 mb-2">1. Full Name *</label>
                  <input value={fullName} onChange={(e) => setFullName(e.target.value)} className={`w-full px-4 py-3 rounded-xl bg-black/30 border ${fieldErrors.fullName ? 'border-red-500' : 'border-white/10'} text-white focus:outline-none`} placeholder="Full name" />
                  {fieldErrors.fullName && <p className="mt-1 text-xs text-red-400">{fieldErrors.fullName}</p>}
                </div>
                <div>
                  <label className="block text-sm text-white/80 mb-2">2. Email Address *</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`w-full px-4 py-3 rounded-xl bg-black/30 border ${fieldErrors.email ? 'border-red-500' : 'border-white/10'} text-white focus:outline-none`} placeholder="you@example.com" />
                  {fieldErrors.email && <p className="mt-1 text-xs text-red-400">{fieldErrors.email}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/80 mb-2">3. Phone Number *</label>
                <div className={`w-full px-4 py-3 rounded-xl bg-black/30 border ${fieldErrors.phone ? 'border-red-500' : 'border-white/10'}`}>
                  <PhoneInput value={phone || undefined} onChange={(v) => setPhone(v || "")} />
                </div>
                {fieldErrors.phone && <p className="mt-1 text-xs text-red-400">{fieldErrors.phone}</p>}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/80 mb-2">4. Country of Residence *</label>
                  <input value={country} onChange={(e) => setCountry(e.target.value)} className={`w-full px-4 py-3 rounded-xl bg-black/30 border ${fieldErrors.country ? 'border-red-500' : 'border-white/10'} text-white focus:outline-none`} placeholder="Country" />
                  {fieldErrors.country && <p className="mt-1 text-xs text-red-400">{fieldErrors.country}</p>}
                </div>
                <div>
                  <label className="block text-sm text-white/80 mb-2">5. LinkedIn Profile URL *</label>
                  <input value={linkedInUrl} onChange={(e) => setLinkedInUrl(e.target.value)} className={`w-full px-4 py-3 rounded-xl bg-black/30 border ${fieldErrors.linkedInUrl ? 'border-red-500' : 'border-white/10'} text-white focus:outline-none`} placeholder="LinkedIn URL" />
                  {fieldErrors.linkedInUrl && <p className="mt-1 text-xs text-red-400">{fieldErrors.linkedInUrl}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/80 mb-2">6. Current Education Level *</label>
                <input value={currentStatus} onChange={(e) => setCurrentStatus(e.target.value)} className={`w-full px-4 py-3 rounded-xl bg-black/30 border ${fieldErrors.currentStatus ? 'border-red-500' : 'border-white/10'} text-white focus:outline-none`} placeholder='e.g. "final year"' />
                {fieldErrors.currentStatus && <p className="mt-1 text-xs text-red-400">{fieldErrors.currentStatus}</p>}
              </div>

              <div>
                <label className="block text-sm text-white/80 mb-2">7. Current Institution or Organization *</label>
                <input value={institutionOrOrganization} onChange={(e) => setInstitutionOrOrganization(e.target.value)} className={`w-full px-4 py-3 rounded-xl bg-black/30 border ${fieldErrors.institutionOrOrganization ? 'border-red-500' : 'border-white/10'} text-white focus:outline-none`} placeholder="University / Organization" />
                {fieldErrors.institutionOrOrganization && <p className="mt-1 text-xs text-red-400">{fieldErrors.institutionOrOrganization}</p>}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/80 mb-2">8. Field of Study / Industry *</label>
                  <input value={fieldOrRole} onChange={(e) => setFieldOrRole(e.target.value)} className={`w-full px-4 py-3 rounded-xl bg-black/30 border ${fieldErrors.fieldOrRole ? 'border-red-500' : 'border-white/10'} text-white focus:outline-none`} placeholder="e.g. Energy Analyst" />
                  {fieldErrors.fieldOrRole && <p className="mt-1 text-xs text-red-400">{fieldErrors.fieldOrRole}</p>}
                </div>
                <div>
                  <label className="block text-sm text-white/80 mb-2">9. Highest Degree *</label>
                  <input value={highestEducation} onChange={(e) => setHighestEducation(e.target.value)} className={`w-full px-4 py-3 rounded-xl bg-black/30 border ${fieldErrors.highestEducation ? 'border-red-500' : 'border-white/10'} text-white focus:outline-none`} placeholder="e.g. BSc" />
                  {fieldErrors.highestEducation && <p className="mt-1 text-xs text-red-400">{fieldErrors.highestEducation}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/80 mb-2">10. Why are you interested? *</label>
                <textarea value={motivation} onChange={(e) => setMotivation(e.target.value)} rows={3} className={`w-full px-4 py-3 rounded-xl bg-black/30 border ${fieldErrors.motivation ? 'border-red-500' : 'border-white/10'} text-white focus:outline-none`} />
                {fieldErrors.motivation && <p className="mt-1 text-xs text-red-400">{fieldErrors.motivation}</p>}
              </div>

              <div>
                <label className="block text-sm text-white/80 mb-2">11. Previous Experience / Projects</label>
                <textarea value={previousExperience} onChange={(e) => setPreviousExperience(e.target.value)} rows={2} className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white focus:outline-none" />
              </div>

              <div>
                <label className="block text-sm text-white/80 mb-2">12. What do you hope to gain?</label>
                <textarea value={clarityToolsExpectation} onChange={(e) => setClarityToolsExpectation(e.target.value)} rows={2} className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white focus:outline-none" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-4">Select Payment Currency *</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setSelectedCurrency("NGN")}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${selectedCurrency === "NGN" ? "bg-[#10d406]/20 border-[#10d406]" : "bg-white/5 border-white/10 hover:border-white/20"} ${fieldErrors.selectedCurrency ? 'border-red-500' : ''}`}
                  >
                    <span className="text-2xl mb-2">🇳🇬</span>
                    <span className="font-bold text-white">Naira (NGN)</span>
                    <span className="text-xs text-white/50">Paystack Secure</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedCurrency("USD")}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${selectedCurrency === "USD" ? "bg-[#10d406]/20 border-[#10d406]" : "bg-white/5 border-white/10 hover:border-white/20"} ${fieldErrors.selectedCurrency ? 'border-red-500' : ''}`}
                  >
                    <span className="text-2xl mb-2">🇺🇸</span>
                    <span className="font-bold text-white">US Dollars (USD)</span>
                    <span className="text-xs text-white/50">Stripe Checkout</span>
                  </button>
                </div>
                {fieldErrors.selectedCurrency && <p className="mt-2 text-xs text-red-400">{fieldErrors.selectedCurrency}</p>}
              </div>

              {selectedCurrency && (
                <div className="fade-in">
                  <div className={`mt-6 rounded-xl border ${fieldErrors.confirmCommitment ? 'border-red-500 bg-red-500/5' : 'border-white/10 bg-black/30'} p-4`}>
                    <label className="inline-flex items-center gap-3 cursor-pointer">
                      <input type="radio" checked={confirmCommitment === "yes"} onChange={() => setConfirmCommitment("yes")} className="w-4 h-4 accent-[#10d406]" />
                      <span className="text-sm text-white/90">I confirm that I can commit 6 weeks attend to all mentorship activities. *</span>
                    </label>
                    {fieldErrors.confirmCommitment && <p className="mt-2 text-xs text-red-400">{fieldErrors.confirmCommitment}</p>}
                  </div>

                  <div className="mt-8 rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-md">
                    <h3 className="text-lg font-bold text-white mb-4">Payment Summary</h3>
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-white/70 text-sm">
                        <span>Mentorship Fee</span>
                        <span>{pricing?.symbol}{pricing?.subtotal.toLocaleString()}</span>
                      </div>
                      {pricing?.tax ? (
                        <div className="flex justify-between text-white/70 text-sm">
                          <span>Processing Fee (Tax)</span>
                          <span>{pricing?.symbol}{pricing?.tax.toFixed(2)}</span>
                        </div>
                      ) : null}
                    </div>
                    <div className="border-t border-white/10 pt-4 flex justify-between items-center">
                      <span className="font-bold text-white">Total Amount</span>
                      <span className="text-2xl font-bold green-text">
                        {pricing?.symbol}{pricing?.total.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full mt-6 inline-flex items-center justify-center rounded-full bg-gradient-to-b from-[#10d406] to-[#1d5a05] text-white shadow-xl shadow-green-900/20 font-bold px-8 py-4 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {submitting ? "Processing..." : `Proceed with ${selectedCurrency}`}
                  </button>
                </div>
              )}
            </form>
            </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
