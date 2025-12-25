import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import PhoneInput from "../lib/phoneInput";

type RegisterResponse = {
  checkout_url?: string;
  registration_id?: string | number;
  checkout_session_id?: string;
  missing?: string[];
  invalid?: string[];
  message?: string;
};

export default function RegisterPage() {
  const [searchParams] = useSearchParams();
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
  const [energyInterest, setEnergyInterest] = useState<string[]>([]);
  const [previousExperience, setPreviousExperience] = useState("");
  const [clarityToolsExpectation, setClarityToolsExpectation] = useState("");
  const [confirmCommitment, setConfirmCommitment] = useState<"yes" | "no" | "">("");
  const [agreePayment, setAgreePayment] = useState<"yes" | "no" | "">("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ missing?: string[]; invalid?: string[] }>({});

  const bgUrl = "/hero.png";

  const subtotal = 30;
  const tax = 0;
  const total = 30;

  const interestOptions = useMemo(
    () => ["Renewable Energy", "Hydrogen", "E-mobility", "Energy Policy", "Clean Technologies", "Other"],
    []
  );

  const toggleInterest = (value: string) => {
    setEnergyInterest((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const validateForm = () => {
    const missing: string[] = [];
    const invalid: string[] = [];

    const requiredText = [
      { label: "Full Name", value: fullName },
      { label: "Email Address", value: email },
      { label: "Phone Number", value: phone },
      { label: "Country of Residence", value: country },
      { label: "LinkedIn Profile URL", value: linkedInUrl },
      { label: "Current Status", value: currentStatus },
      { label: "University/Institution or Organization", value: institutionOrOrganization },
      { label: "Field of Study or Current Role/Industry", value: fieldOrRole },
      { label: "Highest Level of Education", value: highestEducation },
      { label: "Motivation", value: motivation },
    ];

    for (const item of requiredText) {
      if (!item.value.trim()) missing.push(item.label);
    }

    if (email.trim()) {
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
      if (!emailOk) invalid.push("Email Address");
    }

    if (linkedInUrl.trim()) {
      try {
        const u = new URL(linkedInUrl.trim());
        const host = u.hostname.toLowerCase();
        if (!host.includes("linkedin.com")) invalid.push("LinkedIn Profile URL");
      } catch {
        invalid.push("LinkedIn Profile URL");
      }
    }

    if (confirmCommitment !== "yes") missing.push("Commitment Confirmation");
    if (agreePayment !== "yes") missing.push("Payment Agreement");

    return { missing, invalid };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setFieldErrors({});

    const validation = validateForm();
    if (validation.missing.length || validation.invalid.length) {
      setFieldErrors({ missing: validation.missing, invalid: validation.invalid });
      setError("Please review the form and try again.");
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
        energy_interest: energyInterest.join(", "),
        previous_experience: previousExperience,
        clarity_tools_expectation: clarityToolsExpectation,
        confirm_commitment: confirmCommitment,
        agree_payment: agreePayment,
        registration_status: "pending",
        success_url: "http://localhost:5173/payment-success",
        cancel_url: "http://localhost:5173/register?canceled=1",
      };

      const res = await fetch("https://api.sledgementorship.com/api/register.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as RegisterResponse;

      if (!res.ok) {
        setFieldErrors({ missing: data.missing, invalid: data.invalid });
        setError(data.message || "We couldn't submit your application. Please check your entries and try again.");
        return;
      }

      if (!data.checkout_url) {
        setError("We couldn't start the payment checkout. Please try again.");
        return;
      }

      sessionStorage.setItem(
        "sledge_receipt",
        JSON.stringify({
          name: fullName,
          email,
          cohort: new Date().getFullYear() + 1,
          subtotal,
          total,
          created_at: new Date().toISOString(),
        })
      );

      window.location.href = data.checkout_url;
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative font-poppins bg-[#09090b] text-white">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgUrl})` }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-black/70" aria-hidden />

      <Header />

      <main className="relative z-10 px-6 md:px-12 py-10">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl px-4 md:px-6 p-8">
            <div className="flex flex-col  sm:items-start sm:justify-between gap-2 mb-2">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Application Form: The Sledge Mentorship Program
                </h2>
                <div className="mb-6 text-gray-300 text-sm leading-relaxed">
                  <strong>I. Program Introduction & Commitment</strong>
                  <p className="mt-2">
                    The Sledge is a six-week mentorship and capacity-building program
                    designed to help young energy enthusiasts discover and pursue
                    their professional purpose in the energy and climate sector. The
                    program focuses on six critical pathways to excelling in the
                    energy space, featuring guided mentorship, interactive sessions,
                    and one-on-one coaching.
                  </p>
                </div>
              </div>
              <Link
                to="/program"
                className="text-sm text-white/80 hover:text-white underline sm:mt-2"
              >
                View Program
              </Link>
            </div>

            {canceled ? (
              <div className="mt-4 rounded-xl border border-white/15 bg-black/30 p-4 text-sm text-white/80">
                Payment was canceled. You can try again.
              </div>
            ) : null}

            {!!(fieldErrors.missing?.length || fieldErrors.invalid?.length || error) && (
              <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                <div className="font-semibold">Please fix the following:</div>
                {error ? <div className="mt-2 text-sm text-white/80">{error}</div> : null}
                {fieldErrors.missing?.length ? (
                  <div className="mt-2 text-sm text-white/80">
                    <div className="font-medium">Missing</div>
                    <div className="mt-1">{fieldErrors.missing.join(", ")}</div>
                  </div>
                ) : null}
                {fieldErrors.invalid?.length ? (
                  <div className="mt-3 text-sm text-white/80">
                    <div className="font-medium">Invalid</div>
                    <div className="mt-1">{fieldErrors.invalid.join(", ")}</div>
                  </div>
                ) : null}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
              <div>
                <label className="block text-sm text-white/80 mb-2">
                  1. Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white focus:outline-none"
                  placeholder="Full name"
                />
              </div>

              <div>
                <label className="block text-sm text-white/80 mb-2">
                  2. Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white focus:outline-none"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm text-white/80 mb-2">
                  3. Phone Number (Including Country Code) <span className="text-red-400">*</span>
                </label>
                <div className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10">
                  <PhoneInput value={phone || undefined} onChange={(v) => setPhone(v || "")} />
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/80 mb-2">
                  4. Country of Residence <span className="text-red-400">*</span>
                </label>
                <input
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white focus:outline-none"
                  placeholder="Country"
                />
              </div>

              <div>
                <label className="block text-sm text-white/80 mb-2">
                  5. LinkedIn Profile URL <span className="text-red-400">*</span>
                </label>
                <input
                  value={linkedInUrl}
                  onChange={(e) => setLinkedInUrl(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white focus:outline-none"
                  placeholder="https://www.linkedin.com/in/yourprofile"
                />
              </div>

              <div>
                <label className="block text-sm text-white/80 mb-2">
                  6. Current Status <span className="text-red-400">*</span>
                </label>
                <input
                  value={currentStatus}
                  onChange={(e) => setCurrentStatus(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white focus:outline-none"
                  placeholder='e.g. "final" / "early" / "other"'
                />
              </div>

              <div>
                <label className="block text-sm text-white/80 mb-2">
                  7. Current University/Institution or Organization <span className="text-red-400">*</span>
                </label>
                <input
                  value={institutionOrOrganization}
                  onChange={(e) => setInstitutionOrOrganization(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white focus:outline-none"
                  placeholder="University / Organization"
                />
              </div>

              <div>
                <label className="block text-sm text-white/80 mb-2">
                  8. Field of Study or Current Role/Industry <span className="text-red-400">*</span>
                </label>
                <input
                  value={fieldOrRole}
                  onChange={(e) => setFieldOrRole(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white focus:outline-none"
                  placeholder="e.g. Mechanical Engineering / Energy Analyst"
                />
              </div>

              <div>
                <label className="block text-sm text-white/80 mb-2">
                  9. Highest Level of Education (Completed or In Progress) <span className="text-red-400">*</span>
                </label>
                <input
                  value={highestEducation}
                  onChange={(e) => setHighestEducation(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white focus:outline-none"
                  placeholder="e.g. BSc, MSc, HND, PhD"
                />
              </div>

              <div>
                <label className="block text-sm text-white/80 mb-2">
                  10. Why are you interested in The Sledge Mentorship Program? (Max 250 words) <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white focus:outline-none"
                  placeholder="Focus on career direction, professional development, and mentorship."
                />
              </div>

              <div>
                <label className="block text-sm text-white/80 mb-2">
                  11. In which area(s) of the energy transition are you most interested? (Select all that apply)
                </label>
                <div className="grid md:grid-cols-2 sm:grid-cols-3 gap-2">
                  {interestOptions.map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-2 rounded-xl bg-black/30 border border-white/10 px-3 py-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={energyInterest.includes(opt)}
                        onChange={() => toggleInterest(opt)}
                      />
                      <span className="text-white/80">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/80 mb-2">
                  12. Briefly describe any previous experience, projects, or self-learning in energy, sustainability, or climate sector (Max 150 words)
                </label>
                <textarea
                  value={previousExperience}
                  onChange={(e) => setPreviousExperience(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white focus:outline-none"
                  placeholder=""
                />
              </div>

              <div>
                <label className="block text-sm text-white/80 mb-2">
                  13. What specific "clarity" or "tools" do you hope to gain from this 6-week program? (Max 150 words)
                </label>
                <textarea
                  value={clarityToolsExpectation}
                  onChange={(e) => setClarityToolsExpectation(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white focus:outline-none"
                  placeholder=""
                />
              </div>

              <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                <div className="text-sm font-semibold">Confirmations</div>

                <div className="mt-3">
                  <div className="text-sm text-white/80 mb-2">I can commit to attend * </div>
                  <div className="flex gap-6 text-sm">
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="radio"
                        name="commit"
                        checked={confirmCommitment === "yes"}
                        onChange={() => setConfirmCommitment("yes")}
                      />
                      <span>Yes</span>
                    </label>
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="radio"
                        name="commit"
                        checked={confirmCommitment === "no"}
                        onChange={() => setConfirmCommitment("no")}
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-sm text-white/80 mb-2">I agree to the $30 payment * </div>
                  <div className="flex gap-6 text-sm">
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="radio"
                        name="agree"
                        checked={agreePayment === "yes"}
                        onChange={() => setAgreePayment("yes")}
                      />
                      <span>Yes</span>
                    </label>
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="radio"
                        name="agree"
                        checked={agreePayment === "no"}
                        onChange={() => setAgreePayment("no")}
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-b from-[#10d406] to-[#1d5a05] text-white shadow font-medium px-6 py-3 disabled:opacity-60"
              >
                {submitting ? "Redirecting to Stripe..." : "Proceed to Payment"}
              </button>
            </form>

            <div className="mt-8 rounded-2xl border border-white/15 bg-black/30 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Payment Summary</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-white/90">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white/90">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              </div>
              <div className="border-t border-white/15 pt-4 flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Total Due Amount</h3>
                <span className="text-2xl font-bold text-white flex items-center gap-2">
                  ${total.toFixed(2)}
                  <span className="text-base text-white/50">USD</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
