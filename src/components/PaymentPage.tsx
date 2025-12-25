import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";
import PhoneInput from "../lib/phoneInput";

export default function PaymentPage() {
  const bgUrl = "/hero.png";

  // Personal & contact
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [country, setCountry] = useState("");
  const [linkedIn, setLinkedIn] = useState("");

  // Education / professional
  const [currentStatus, setCurrentStatus] = useState<
    "final" | "early" | "other" | ""
  >("");
  const [statusOther, setStatusOther] = useState("");
  const [institution, setInstitution] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [educationLevel, setEducationLevel] = useState("");

  // Interest & alignment
  const [whyInterested, setWhyInterested] = useState("");
  const [areas, setAreas] = useState<string[]>([]);
  const [areasOther, setAreasOther] = useState("");
  const [previousExperience, setPreviousExperience] = useState("");
  const [clarityTools, setClarityTools] = useState("");

  // Commitment & payment acknowledgement
  const [canCommit, setCanCommit] = useState<"yes" | "no" | "">("");
  const [agreeCost, setAgreeCost] = useState<"yes" | "no" | "">("");

  const toggleArea = (value: string) => {
    setAreas((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic required validation per spec
    const requiredMissing =
      !name ||
      !email ||
      !phoneNumber ||
      !country ||
      !linkedIn ||
      !currentStatus ||
      !institution ||
      !fieldOfStudy ||
      !educationLevel ||
      !whyInterested ||
      !canCommit ||
      !agreeCost;

    if (requiredMissing) {
      alert("Please complete all required fields (marked) before proceeding.");
      return;
    }

    if (canCommit !== "yes" || agreeCost !== "yes") {
      alert(
        "You must confirm your commitment to attend and acknowledge the cost to proceed."
      );
      return;
    }

    // Collect payload (replace with real submit logic)
    const payload = {
      name,
      email,
      phoneNumber,
      country,
      linkedIn,
      currentStatus: currentStatus === "other" ? statusOther : currentStatus,
      institution,
      fieldOfStudy,
      educationLevel,
      whyInterested,
      areas: areas.concat(areasOther ? [areasOther] : []),
      previousExperience,
      clarityTools,
      canCommit,
      agreeCost,
    };

    console.log("Application payload:", payload);
    alert("Application saved. Proceeding to payment (stub).");
    // TODO: route to payment processor / payment page
  };

  return (
    <div className="min-h-screen relative font-poppins bg-[#09090b]">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgUrl})` }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-black/80" aria-hidden />

      <Header />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 flex flex-col gap-6 items-center justify-center p-6"
      >
        <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 max-w-3xl w-full">
          {/* Program intro */}
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

          {/* II. Personal and Contact Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">
              II. Personal and Contact Information (Required)
            </h3>

            <label className="block text-sm text-gray-300 mb-2">
              1. Full Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="w-full pl-3 pr-3 py-3 bg-gray-700/20 border border-gray-600/10 rounded-lg text-white mb-3 focus:outline-none"
            />

            <label className="block text-sm text-gray-300 mb-2">
              2. Email Address <span className="text-red-400">*</span>
            </label>
            <div className="relative mb-3">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-3 py-3 bg-gray-700/20 border border-gray-600/10 rounded-lg text-white focus:outline-none"
              />
            </div>

            <label className="block text-sm text-gray-300 mb-2">
              3. Phone Number (Including Country Code) <span className="text-red-400">*</span>
            </label>
            <div className="relative mb-3 w-full pl-10 pr-3 py-3 flex items-center bg-gray-700/20 border border-gray-600/10 rounded-lg text-white">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <div className="w-full my-auto">
                <PhoneInput
                  value={phoneNumber || undefined}
                  onChange={(val) => setPhoneNumber(val || "")}
                />
              </div>
            </div>

            <label className="block text-sm text-gray-300 mb-2">
              4. Country of Residence <span className="text-red-400">*</span>
            </label>
            <div className="relative mb-3">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Country"
                className="w-full pl-10 pr-3 py-3 bg-gray-700/20 border border-gray-600/10 rounded-lg text-white focus:outline-none"
              />
            </div>

            <label className="block text-sm text-gray-300 mb-2">
              5. LinkedIn Profile URL <span className="text-red-400">*</span>
            </label>
            <div className="relative mb-3">
              <input
                type="url"
                value={linkedIn}
                onChange={(e) => setLinkedIn(e.target.value)}
                placeholder="https://www.linkedin.com/in/yourprofile"
                className="w-full pl-3 pr-3 py-3 bg-gray-700/20 border border-gray-600/10 rounded-lg text-white focus:outline-none"
              />
            </div>
          </div>

          {/* III. Educational and Professional Background */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">
              III. Educational and Professional Background
            </h3>

            <label className="block text-sm text-gray-300 mb-2">
              6. Current Status <span className="text-red-400">*</span>
            </label>
            <div className="flex flex-col gap-2 mb-3 text-white">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="status"
                  checked={currentStatus === "final"}
                  onChange={() => setCurrentStatus("final")}
                  className="form-radio"
                />
                <span className="ml-2">Final-Year Student</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="status"
                  checked={currentStatus === "early"}
                  onChange={() => setCurrentStatus("early")}
                  className="form-radio"
                />
                <span className="ml-2">Early-Career Professional</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="status"
                  checked={currentStatus === "other"}
                  onChange={() => setCurrentStatus("other")}
                  className="form-radio"
                />
                <span className="ml-2">Other (please specify)</span>
              </label>

              {currentStatus === "other" && (
                <input
                  type="text"
                  value={statusOther}
                  onChange={(e) => setStatusOther(e.target.value)}
                  placeholder="Please specify"
                  className="mt-2 w-full pl-3 pr-3 py-2 bg-gray-700/20 border border-gray-600/10 rounded-lg text-white focus:outline-none"
                />
              )}
            </div>

            <label className="block text-sm text-gray-300 mb-2">
              7. Current University/Institution or Organization <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              placeholder="University / Organization"
              className="w-full pl-3 pr-3 py-3 bg-gray-700/20 border border-gray-600/10 rounded-lg text-white mb-3 focus:outline-none"
            />

            <label className="block text-sm text-gray-300 mb-2">
              8. Field of Study or Current Role/Industry <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={fieldOfStudy}
              onChange={(e) => setFieldOfStudy(e.target.value)}
              placeholder="e.g. Mechanical Engineering / Energy Analyst"
              className="w-full pl-3 pr-3 py-3 bg-gray-700/20 border border-gray-600/10 rounded-lg text-white mb-3 focus:outline-none"
            />

            <label className="block text-sm text-gray-300 mb-2">
              9. Highest Level of Education (Completed or In Progress) <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={educationLevel}
              onChange={(e) => setEducationLevel(e.target.value)}
              placeholder="e.g. BSc, MSc, HND, PhD"
              className="w-full pl-3 pr-3 py-3 bg-gray-700/20 border border-gray-600/10 rounded-lg text-white mb-3 focus:outline-none"
            />
          </div>

          {/* IV. Interest and Program Alignment */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">
              IV. Interest and Program Alignment
            </h3>

            <label className="block text-sm text-gray-300 mb-2">
              10. Why are you interested in The Sledge Mentorship Program?
              (Max 250 words) <span className="text-red-400">*</span>
            </label>
            <textarea
              value={whyInterested}
              onChange={(e) => setWhyInterested(e.target.value)}
              maxLength={1800}
              rows={6}
              placeholder="Focus on career direction, professional development, and mentorship."
              className="w-full pl-3 pr-3 py-3 bg-gray-700/20 border border-gray-600/10 rounded-lg text-white mb-3 focus:outline-none"
            />

            <label className="block text-sm text-gray-300 mb-2">
              11. In which area(s) of the energy transition are you most
              interested? (Select all that apply)
            </label>
            <div className="grid grid-cols-2 gap-2 mb-3 text-white">
              {[
                "Renewable Energy",
                "Hydrogen",
                "E-mobility",
                "Energy Policy",
                "Clean Technologies",
              ].map((opt) => (
                <label key={opt} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={areas.includes(opt)}
                    onChange={() => toggleArea(opt)}
                    className="form-checkbox"
                  />
                  <span className="ml-2">{opt}</span>
                </label>
              ))}
              <label className="inline-flex items-center col-span-2">
                <input
                  type="checkbox"
                  checked={areas.includes("Other")}
                  onChange={() => toggleArea("Other")}
                  className="form-checkbox"
                />
                <span className="ml-2">Other (please specify)</span>
              </label>
              {areas.includes("Other") && (
                <input
                  type="text"
                  value={areasOther}
                  onChange={(e) => setAreasOther(e.target.value)}
                  placeholder="Specify other area"
                  className="mt-2 w-full pl-3 pr-3 py-2 bg-gray-700/20 border border-gray-600/10 rounded-lg text-white focus:outline-none"
                />
              )}
            </div>

            <label className="block text-sm text-gray-300 mb-2">
              12. Briefly describe any previous experience, projects, or
              self-learning in energy, sustainability, or climate sector (Max
              150 words)
            </label>
            <textarea
              value={previousExperience}
              onChange={(e) => setPreviousExperience(e.target.value)}
              maxLength={1000}
              rows={4}
              className="w-full pl-3 pr-3 py-3 bg-gray-700/20 border border-gray-600/10 rounded-lg text-white mb-3 focus:outline-none"
            />

            <label className="block text-sm text-gray-300 mb-2">
              13. What specific "clarity" or "tools" do you hope to gain from
              this 6-week program? (Max 150 words)
            </label>
            <textarea
              value={clarityTools}
              onChange={(e) => setClarityTools(e.target.value)}
              maxLength={1000}
              rows={4}
              className="w-full pl-3 pr-3 py-3 bg-gray-700/20 border border-gray-600/10 rounded-lg text-white mb-3 focus:outline-none"
            />
          </div>

          {/* V. Commitment and Signature */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">
              V. Commitment and Signature
            </h3>

            <label className="block text-sm text-gray-300 mb-2">
              14. I confirm that I can commit to actively participating in the
              weekly virtual sessions for the entire 6-week duration of the
              program. (Required)
            </label>
            <div className="flex gap-6 mb-3 text-white">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="commit"
                  checked={canCommit === "yes"}
                  onChange={() => setCanCommit("yes")}
                  className="form-radio"
                />
                <span className="ml-2">Yes</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="commit"
                  checked={canCommit === "no"}
                  onChange={() => setCanCommit("no")}
                  className="form-radio"
                />
                <span className="ml-2">No</span>
              </label>
            </div>

            <label className="block text-sm text-gray-300 mb-2">
              15. I understand and agree that the cost of participation is $30
              per participant. (Required)
            </label>
            <div className="flex gap-6 mb-6 text-white">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="cost"
                  checked={agreeCost === "yes"}
                  onChange={() => setAgreeCost("yes")}
                  className="form-radio"
                />
                <span className="ml-2">Yes</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="cost"
                  checked={agreeCost === "no"}
                  onChange={() => setAgreeCost("no")}
                  className="form-radio"
                />
                <span className="ml-2">No</span>
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="w-full bg-gradient-to-b from-[#10d406] to-[#1d5a05]  hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition duration-200"
              >
                Save & Proceed to Payment
              </button>
            </div>
          </div>
        </div>

        {/* Order Summary Section (kept) */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 max-w-3xl w-full">
          <h3 className="text-xl font-bold text-white mb-4">Order Summary</h3>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-white">
              <span>Subtotal</span>
              <span>$30.00</span>
            </div>
            <div className="flex justify-between text-white">
              <span>Tax (10%)</span>
              <span>$3.00</span>
            </div>
            <div className="flex justify-between text-white">
              <span>Shipping Fee</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between text-white">
              <span>Discount</span>
              <span>-$0.00</span>
            </div>
          </div>
          <div className="border-t border-white pt-4 flex justify-between items-center">
            <h3 className="text-xl font-bold text-white">Total Due Amount</h3>
            <span className="text-2xl font-bold text-white flex items-center gap-2">
              $33.00<span className="text-base text-white/50">USD</span>
            </span>
          </div>
        </div>
      </form>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}