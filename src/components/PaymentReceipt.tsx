import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

type ReceiptResponse = {
  registration_id?: string;
  name?: string | null;
  email?: string | null;
  date_time: string;
  cohort?: string | null;
  subtotal: string; // e.g. "30.00"
  total: string; // e.g. "30.00"
  currency: string; // e.g. "USD"
  registration_status?: string | null;
};

const PaymentReceipt: React.FC = () => {
  const [searchParams] = useSearchParams();
  const rid = searchParams.get("rid");
  const sessionId = searchParams.get("session_id"); // optional (only needed if you want to verify here)

  const receiptRef = useRef<HTMLDivElement>(null);

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const [receipt, setReceipt] = useState<null | {
    name: string | null;
    email: string | null;
    date_time: string;
    cohort: string | null;
    subtotal: string;
    total: string;
    currency: string;
    registration_status: string | null;
  }>(null);

  useEffect(() => {
    const load = async () => {
      if (!rid) {
        setStatus("error");
        setStatusMessage("Missing receipt id (rid). Please open the receipt from the payment success page.");
        return;
      }

      setStatus("loading");
      setStatusMessage(null);

      try {
        // Optional verify step (recommended on success page)
        // If you don't want verification here, you can remove this block.
        if (sessionId) {
          const verifyRes = await fetch(
            `http://api.sledgementorship.com/api/verify-payment.php?rid=${encodeURIComponent(rid)}&session_id=${encodeURIComponent(sessionId)}`
          );

          const verifyJson = (await verifyRes.json().catch(() => null)) as unknown;

          if (!verifyRes.ok) {
            setStatus("error");
            setStatusMessage(
              typeof verifyJson === "object" && verifyJson && "message" in (verifyJson as any)
                ? String((verifyJson as any).message)
                : "Could not verify payment."
            );
            return;
          }
        }

        // Fetch receipt from DB (POST rid only)
        const res = await fetch("http://api.sledgementorship.com/api/receipt.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rid }),
        });

        const data = (await res.json().catch(() => null)) as unknown;

        if (!res.ok || !data || typeof data !== "object") {
          setStatus("error");
          setStatusMessage("Could not load your receipt. Please try again.");
          return;
        }

        const d = data as ReceiptResponse;

        // Validate shape (match your PHP response types)
        const ok =
          (typeof d.name === "string" || d.name === null || typeof d.name === "undefined") &&
          (typeof d.email === "string" || d.email === null || typeof d.email === "undefined") &&
          typeof d.date_time === "string" &&
          (typeof d.cohort === "string" || d.cohort === null || typeof d.cohort === "undefined") &&
          typeof d.subtotal === "string" &&
          typeof d.total === "string" &&
          typeof d.currency === "string" &&
          (typeof d.registration_status === "string" || d.registration_status === null || typeof d.registration_status === "undefined");

        if (!ok) {
          setStatus("error");
          setStatusMessage("Receipt response was not in the expected format.");
          return;
        }

        setReceipt({
          name: d.name ?? null,
          email: d.email ?? null,
          date_time: d.date_time,
          cohort: d.cohort ?? "2026",
          subtotal: d.subtotal,
          total: d.total,
          currency: d.currency,
          registration_status: d.registration_status ?? null,
        });

        setStatus("success");
      } catch {
        setStatus("error");
        setStatusMessage("Network error. Please try again.");
      }
    };

    load();
  }, [rid, sessionId]);

  const createdAt = receipt?.date_time ? new Date(receipt.date_time) : new Date();
  const name = receipt?.name ?? "-";
  const email = receipt?.email ?? "-";
  const cohort = receipt?.cohort ?? "-";

  const subtotalNum = Number.parseFloat(receipt?.subtotal ?? "0");
  const totalNum = Number.parseFloat(receipt?.total ?? "0");
  const currency = receipt?.currency ?? "USD";

  const downloadReceipt = async () => {
    if (!receiptRef.current || status !== "success") return;

    const canvas = await html2canvas(receiptRef.current, {
      scale: 2,
      backgroundColor: "#111827",
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "p", unit: "pt", format: "a4" });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    pdf.setFillColor(17, 24, 39);
    pdf.rect(0, 0, pageWidth, pageHeight, "F");

    const maxWidth = pageWidth;
    const maxHeight = pageHeight;

    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    const scale = Math.min(maxWidth / imgWidth, maxHeight / imgHeight);
    const renderWidth = imgWidth * scale;
    const renderHeight = imgHeight * scale;

    const x = (pageWidth - renderWidth) / 2;
    const y = (pageHeight - renderHeight) / 2;

    pdf.addImage(imgData, "PNG", x, y, renderWidth, renderHeight);
    pdf.save(`payment-receipt-${Date.now()}.pdf`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-gray-900">
      <div className="w-full px-4 py-12">
        <div className="w-[420px] max-w-full mx-auto origin-top scale-[0.98] sm:scale-100">
          {status === "loading" ? (
            <div className="w-full rounded-[28px] border border-white/10 bg-black/30 p-10 text-center text-white/80">
              Loading receipt...
            </div>
          ) : status === "error" ? (
            <div className="w-full rounded-[28px] border border-red-500/30 bg-red-500/10 p-6 text-sm text-white/90">
              {statusMessage ?? "Could not load receipt."}
            </div>
          ) : (
            <div
              ref={receiptRef}
              className="relative w-full overflow-hidden rounded-[28px]"
              style={{
                border: "1px solid rgba(255,255,255,0.10)",
                background: "linear-gradient(180deg, #0b1220 0%, #0b1020 55%, #070a12 100%)",
                color: "#ffffff",
                boxShadow: "0 24px 60px rgba(0,0,0,0.55)",
              }}
            >
              <div className="relative z-10 px-8 pt-9 pb-28">
                <div className="flex flex-col items-center text-center">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(52, 211, 153, 0.30)" }}
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "rgba(52, 211, 153, 0.20)" }}
                    >
                      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 6L9 17l-5-5" stroke="#6ee7b7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-4 text-sm" style={{ color: "rgba(255,255,255,0.70)" }}>
                    Payment Success
                  </div>
                </div>

                <div className="mt-7 space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <div style={{ color: "rgba(255,255,255,0.60)" }}>Name</div>
                    <div style={{ color: "rgba(255,255,255,0.90)", maxWidth: 220, textAlign: "right" }} className="truncate">
                      {name}
                    </div>
                  </div>
                  <div className="border-t border-dashed" style={{ borderColor: "rgba(255,255,255,0.15)" }} />
                  <div className="flex items-center justify-between text-xs">
                    <div style={{ color: "rgba(255,255,255,0.60)" }}>Email</div>
                    <div style={{ color: "rgba(255,255,255,0.90)", maxWidth: 220, textAlign: "right" }} className="truncate">
                      {email}
                    </div>
                  </div>
                  <div className="border-t border-dashed" style={{ borderColor: "rgba(255,255,255,0.15)" }} />
                  <div className="flex items-center justify-between text-xs">
                    <div style={{ color: "rgba(255,255,255,0.60)" }}>Date & time</div>
                    <div style={{ color: "rgba(255,255,255,0.90)" }}>{createdAt.toLocaleString()}</div>
                  </div>
                  <div className="border-t border-dashed" style={{ borderColor: "rgba(255,255,255,0.15)" }} />
                  <div className="flex items-center justify-between text-xs">
                    <div style={{ color: "rgba(255,255,255,0.60)" }}>Cohort</div>
                    <div style={{ color: "rgba(255,255,255,0.90)" }}>{cohort}</div>
                  </div>
                </div>

                <div className="mt-7 space-y-4">
                  <div className="border-t border-dashed" style={{ borderColor: "rgba(255,255,255,0.15)" }} />
                  <div className="flex items-center justify-between text-xs">
                    <div style={{ color: "rgba(255,255,255,0.60)" }}>Subtotal</div>
                    <div style={{ color: "rgba(255,255,255,0.90)" }}>${Number.isFinite(subtotalNum) ? subtotalNum.toFixed(2) : "0.00"}</div>
                  </div>
                  <div className="border-t border-dashed" style={{ borderColor: "rgba(255,255,255,0.15)" }} />
                  <div className="flex items-center justify-between pt-1">
                    <div className="text-sm font-semibold">Total</div>
                    <div className="text-sm font-semibold">
                      ${Number.isFinite(totalNum) ? totalNum.toFixed(2) : "0.00"}{" "}
                      <span className="text-xs" style={{ color: "rgba(255,255,255,0.50)" }}>
                        {currency}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pointer-events-none absolute -left-3 top-[92px] h-6 w-6 rounded-full" style={{ backgroundColor: "#111827" }} />
              <div className="pointer-events-none absolute -right-3 top-[92px] h-6 w-6 rounded-full" style={{ backgroundColor: "#111827" }} />

              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 z-0" style={{ transform: "translateY(52px)" }}>
                <div className="absolute inset-0" style={{ backgroundColor: "#111827" }} />
                <div className="absolute inset-x-0 -top-3 flex justify-between px-3">
                  {Array.from({ length: 14 }).map((_, i) => (
                    <div key={i} className="h-6 w-6 rounded-full" style={{ backgroundColor: "#111827" }} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={downloadReceipt}
        disabled={status !== "success"}
        className="px-6 py-2 rounded-lg bg-white text-gray-900 text-sm font-medium hover:bg-gray-200 transition disabled:opacity-60"
      >
        Download Receipt (PDF)
      </button>
    </div>
  );
};

export default PaymentReceipt;