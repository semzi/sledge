import { useEffect, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { apiUrl } from "../lib/api";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const rid = searchParams.get("rid");
  const sessionId = searchParams.get("session_id");
  const bgUrl = "/hero.png";

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  useEffect(() => {
    const verify = async () => {
      if (!rid || !sessionId) {
        setStatus("error");
        return;
      }

      try {
        const url = new URL(apiUrl("/verify-payment.php"));
        url.searchParams.set("rid", rid);
        url.searchParams.set("session_id", sessionId);

        const res = await fetch(url.toString());
        await res.json().catch(() => ({}));
        setStatus(res.ok ? "success" : "error");
      } catch (err) {
        setStatus("error");
      }
    };

    verify();
  }, [rid, sessionId]);

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
          <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8">
            {status === "loading" ? (
              <div className="flex flex-col items-center text-center py-10">
                <img
                  src="/logo2.png"
                  alt="Sledge"
                  className="w-20 h-20 animate-pulse"
                />
                <h1 className="text-2xl md:text-3xl font-extrabold mt-6">
                  Verifying Payment...
                </h1>
                <p className="text-white/80 mt-2">
                  Please wait while we confirm your payment with Stripe.
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center py-6">
                {status === "success" ? (
                  <div className="w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-b from-[#10d406] to-[#1d5a05]">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-full flex items-center justify-center bg-red-500/20 border border-red-500/30">
                    <XCircle className="w-8 h-8 text-red-400" />
                  </div>
                )}

                <h1 className="text-2xl md:text-3xl font-extrabold mt-6">
                  {status === "success" ? "PAYMENT SUCCESSFUL" : "PAYMENT VERIFICATION FAILED"}
                </h1>

                <p className="text-white/80 mt-2">
                  {status === "success"
                    ? "Your payment has been verified."
                    : "We could not verify your payment. Please contact support if you were charged."}
                </p>

                <div className="mt-6 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <Link
                    to="/"
                    className="inline-flex items-center justify-center rounded-full bg-white text-black shadow font-medium px-6 py-3"
                  >
                    Back to Home
                  </Link>
                  {status === "success" && rid ? (
                    <Link
                      to={`/payment-receipt?rid=${encodeURIComponent(rid)}`}
                      className="inline-flex items-center justify-center rounded-full bg-gradient-to-b from-[#10d406] to-[#1d5a05] text-white shadow font-medium px-6 py-3"
                    >
                      View Receipt
                    </Link>
                  ) : null}
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center rounded-full bg-black/30 border border-white/15 text-white shadow font-medium px-6 py-3"
                  >
                    Contact Support
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
