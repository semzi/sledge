import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setStatus("idle");
    setStatusMessage(null);

    if (!name || !email || !message) {
      setStatus("error");
      setStatusMessage("Please fill in all fields before sending.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("https://api.sledgementorship.com/api/contact.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: name,
          email,
          message,
        }),
      });

      if (!res.ok) {
        setStatus("error");
        setStatusMessage("We couldn't send your message. Please try again.");
        return;
      }

      setStatus("success");
      setStatusMessage("Message sent successfully. We'll get back to you soon.");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
      setStatusMessage("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative font-poppins bg-[#09090b] text-white">
      <Header />

      <main className="relative z-10 max-w-7xl mx-auto px-6 pb-10">
        <div className="pt-6 md:pt-10">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Contact Us
          </h1>
          <p className="mt-3 text-white/70 max-w-3xl">
            Have questions about the program, fees, or schedule? Send a message
            and we’ll respond.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="rounded-2xl bg-white/5 border border-white/10 p-6">
            <h2 className="text-xl font-semibold">Send a message</h2>

            {statusMessage ? (
              <div
                className={`mt-4 rounded-xl border p-4 text-sm ${
                  status === "success"
                    ? "border-emerald-500/30 bg-emerald-500/10 text-white/90"
                    : "border-red-500/30 bg-red-500/10 text-white/90"
                }`}
              >
                {statusMessage}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm text-white/80 mb-2">
                  Full name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg bg-black/20 border border-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm text-white/80 mb-2">
                  Email address
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  className="w-full rounded-lg bg-black/20 border border-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                  placeholder="you@company.com"
                />
              </div>

              <div>
                <label className="block text-sm text-white/80 mb-2">
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  className="w-full rounded-lg bg-black/20 border border-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                  placeholder="Tell us how we can help..."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-[#10d406] to-[#1d5a05] text-white font-medium px-5 py-3"
              >
                <span>{submitting ? "Sending..." : "Send"}</span>
                <span className="w-8 h-8 rounded-full bg-white text-black inline-flex items-center justify-center">
                  <Send className="w-4 h-4" />
                </span>
              </button>
            </form>
          </section>

          <section className="rounded-2xl bg-white/5 border border-white/10 p-6">
            <h2 className="text-xl font-semibold">Contact details</h2>
            <p className="mt-2 text-white/70">
              You can also reach us using the details below.
            </p>

            <div className="mt-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm text-white/60">Email</div>
                  <div className="text-white"> <a href="mailto:info@sledgementorship.com" >info@sledgementorship.com</a></div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm text-white/60">Phone</div>
                  <div className="text-white">(258) 525–2353</div>
                </div>
              </div>

            </div>

            <div className="mt-8 rounded-xl bg-black/20 border border-white/10 p-4 text-sm text-white/70">
              We typically respond within 24–48 hours.
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
