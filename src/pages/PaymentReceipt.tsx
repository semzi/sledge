import React, { useEffect, useRef, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import jsPDF from "jspdf";
import {
  CheckCircle2, Download, Mail, ArrowLeft,
  Loader2, AlertCircle, Copy, Check
} from "lucide-react";
import Header from "../components/Header";
import { apiUrl } from "../lib/api";

type Receipt = {
  registration_id: string;
  name: string | null;
  email: string | null;
  plan: string;
  mode: string;
  date_time: string;
  cohort: string | null;
  total: string;
  currency: string;
  payment_reference: string | null;
  registration_status: string | null;
};

const currencySymbol = (c: string) => c === "NGN" ? "₦" : "$";

const PaymentReceipt: React.FC = () => {
  const [searchParams] = useSearchParams();
  const rid = searchParams.get("rid");
  const receiptRef = useRef<HTMLDivElement>(null);

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<"idle" | "sent" | "error">("idle");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!rid) { setStatus("error"); setErrorMsg("No receipt ID found."); return; }
    (async () => {
      try {
        const res = await fetch(apiUrl("/receipt.php"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rid }),
        });
        const data = await res.json().catch(() => null);
        if (!res.ok || !data) { setStatus("error"); setErrorMsg("Could not load receipt."); return; }
        setReceipt(data as Receipt);
        setStatus("success");
      } catch {
        setStatus("error");
        setErrorMsg("Network error. Please try again.");
      }
    })();
  }, [rid]);

  const dateText = receipt?.date_time
    ? new Date(receipt.date_time).toLocaleString("en-US", { dateStyle: "long", timeStyle: "short" })
    : "—";

  const amt = Number.parseFloat(receipt?.total ?? "0");
  const sym = currencySymbol(receipt?.currency ?? "USD");

  const downloadPdf = async () => {
    if (status !== "success" || !receipt) return;
    setDownloading(true);
    try {
      const pdf = new jsPDF({ orientation: "p", unit: "pt", format: "a4" });
      const pw = pdf.internal.pageSize.getWidth();   // 595
      const margin = 52;
      const cardW = pw - margin * 2;
      let y = margin;

      // ── Background ────────────────────────────────────────────────────────
      pdf.setFillColor(9, 9, 11);
      pdf.rect(0, 0, pw, pdf.internal.pageSize.getHeight(), "F");

      // ── Card ─────────────────────────────────────────────────────────────
      pdf.setFillColor(15, 26, 15);
      pdf.roundedRect(margin, y, cardW, 420, 10, 10, "F");

      // Border
      pdf.setDrawColor(255, 255, 255, 0.08);
      pdf.setLineWidth(0.5);
      pdf.roundedRect(margin, y, cardW, 420, 10, 10, "S");

      // ── Logo text ─────────────────────────────────────────────────────────
      y += 36;
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(16);
      pdf.setTextColor(255, 255, 255);
      pdf.text("THE SLEDGE", margin + 20, y);

      // Status badge
      const statusText = receipt.registration_status === "verified" ? "PAID" : (receipt.registration_status ?? "PENDING").toUpperCase();
      pdf.setFillColor(34, 197, 94, 0.15);
      pdf.setFontSize(8);
      const badgeW = pdf.getTextWidth(statusText) + 16;
      pdf.roundedRect(margin + cardW - 20 - badgeW, y - 12, badgeW, 16, 4, 4, "F");
      pdf.setTextColor(34, 197, 94);
      pdf.text(statusText, margin + cardW - 20 - badgeW / 2, y - 2, { align: "center" });

      // ── Amount hero ───────────────────────────────────────────────────────
      y += 28;
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(120, 120, 120);
      pdf.text("AMOUNT PAID", margin + 20, y);

      y += 18;
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(32);
      pdf.setTextColor(255, 255, 255);
      const formattedAmt = `${sym}${Number.isFinite(amt) ? amt.toLocaleString("en-US", { minimumFractionDigits: 2 }) : "0.00"}`;
      pdf.text(formattedAmt, margin + 20, y);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);
      pdf.setTextColor(100, 100, 100);
      pdf.text(receipt.currency, margin + 20 + pdf.getTextWidth(formattedAmt) + 8, y);

      // ── Divider ────────────────────────────────────────────────────────────
      y += 22;
      pdf.setDrawColor(50, 50, 50);
      pdf.setLineWidth(0.5);
      pdf.line(margin + 20, y, margin + cardW - 20, y);

      // ── Fields ─────────────────────────────────────────────────────────────
      const fields: [string, string][] = [
        ["Name", receipt.name ?? "—"],
        ["Email", receipt.email ?? "—"],
        ["Plan", receipt.plan],
        ["Cohort", receipt.cohort ?? "2026"],
        ["Date", dateText],
        ["Reference", receipt.payment_reference ?? rid ?? "—"],
      ];

      y += 20;
      fields.forEach(([label, value]) => {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        pdf.setTextColor(100, 100, 100);
        pdf.text(label.toUpperCase(), margin + 20, y);

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        pdf.setTextColor(210, 210, 210);
        const lines = pdf.splitTextToSize(value, cardW - 80);
        pdf.text(lines, margin + cardW - 20, y, { align: "right" });
        y += lines.length > 1 ? 14 * lines.length : 26;
      });

      // ── Tearline ───────────────────────────────────────────────────────────
      y += 4;
      pdf.setLineDashPattern([4, 4], 0);
      pdf.setDrawColor(60, 60, 60);
      pdf.line(margin + 20, y, margin + cardW - 20, y);
      pdf.setLineDashPattern([], 0);

      // ── Footer note ────────────────────────────────────────────────────────
      y += 20;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.setTextColor(80, 80, 80);
      const note = `This receipt confirms your registration for the Sledge Mentorship Program ${receipt.cohort ?? "2026"} cohort.`;
      const noteLines = pdf.splitTextToSize(note, cardW - 40);
      pdf.text(noteLines, margin + 20, y);

      // ── Page footer ────────────────────────────────────────────────────────
      pdf.setFontSize(8);
      pdf.setTextColor(60, 60, 60);
      pdf.text("sledgementorship.com  ·  © " + new Date().getFullYear() + " Sledge", pw / 2, 800, { align: "center" });

      const safeName = (receipt.name ?? "User").replace(/[\\/:*?"<>|]+/g, "").trim();
      pdf.save(`${safeName} - Sledge Receipt.pdf`);
    } catch(e) {
      console.error("PDF generation failed", e);
    } finally {
      setDownloading(false);
    }
  };

  const sendToEmail = async () => {
    if (!receipt?.email) return;
    setSending(true);
    setSendStatus("idle");
    try {
      const res = await fetch(apiUrl("/email.php"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "receipt",
          to: receipt.email,
          name: receipt.name ?? "there",
          data: {
            amount: receipt.total,
            currency: receipt.currency,
            reference: receipt.payment_reference ?? rid,
            plan: receipt.plan,
            date: dateText,
          },
        }),
      });
      const d = await res.json().catch(() => ({}));
      setSendStatus(d.success ? "sent" : "error");
    } catch {
      setSendStatus("error");
    } finally {
      setSending(false);
    }
  };

  const copyRef = () => {
    const ref = receipt?.payment_reference ?? rid ?? "";
    navigator.clipboard.writeText(ref);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-green-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-emerald-400/4 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10">
        <Header />
      </div>

      <main className="relative z-10 px-4 py-10 flex flex-col items-center gap-6 min-h-[calc(100vh-80px)]">

        {/* Back */}
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-white/35 hover:text-white/60 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
        </div>

        <AnimatePresence mode="wait">
          {/* ── LOADING ── */}
          {status === "loading" && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4 py-20 text-white/40">
              <Loader2 className="w-8 h-8 animate-spin text-green-500/60" />
              <p className="text-sm">Loading receipt…</p>
            </motion.div>
          )}

          {/* ── ERROR ── */}
          {status === "error" && (
            <motion.div key="error" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-md flex flex-col items-center gap-4 py-16 text-center">
              <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
              <p className="text-sm text-white/50">{errorMsg ?? "Could not load receipt."}</p>
              <Link to="/" className="text-xs text-green-400 hover:underline">Go home</Link>
            </motion.div>
          )}

          {/* ── RECEIPT ── */}
          {status === "success" && receipt && (
            <motion.div key="receipt" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
              className="w-full max-w-md flex flex-col gap-4">

              {/* ── The receipt card (captured for PDF) ── */}
              <div ref={receiptRef} className="rounded-2xl overflow-hidden"
                style={{ background: "linear-gradient(160deg, #0f1a0f 0%, #0a0f0a 60%, #060a06 100%)", border: "1px solid rgba(255,255,255,0.08)" }}>

                {/* Header strip */}
                <div className="px-7 pt-8 pb-6 border-b border-white/8">
                  <div className="flex items-center justify-between mb-6">
                    <img src="/logo2.png" alt="Sledge" className="h-8 opacity-90" />
                    <span className={`text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                      receipt.registration_status === "verified"
                        ? "text-green-400 bg-green-500/10 border-green-500/20"
                        : "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
                    }`}>
                      {receipt.registration_status === "verified" ? "Paid" : receipt.registration_status ?? "Pending"}
                    </span>
                  </div>

                  {/* Amount hero */}
                  <div>
                    <p className="text-[11px] text-white/35 uppercase tracking-widest mb-1">Amount Paid</p>
                    <p className="text-4xl font-bold text-white tracking-tight">
                      {sym}{Number.isFinite(amt) ? amt.toLocaleString("en-US", { minimumFractionDigits: 2 }) : "0.00"}
                      <span className="text-base font-normal text-white/30 ml-2">{receipt.currency}</span>
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="px-7 py-6 space-y-4">
                  {[
                    { label: "Name", value: receipt.name ?? "—" },
                    { label: "Email", value: receipt.email ?? "—" },
                    { label: "Plan", value: receipt.plan },
                    { label: "Cohort", value: receipt.cohort ?? "2026" },
                    { label: "Date", value: dateText },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-start justify-between gap-4">
                      <span className="text-[11px] text-white/35 uppercase tracking-wider flex-shrink-0 pt-0.5">{label}</span>
                      <span className="text-sm text-white/80 text-right break-all">{value}</span>
                    </div>
                  ))}

                  {/* Reference */}
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-[11px] text-white/35 uppercase tracking-wider flex-shrink-0 pt-0.5">Reference</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-white/50 font-mono break-all text-right">
                        {receipt.payment_reference ?? rid ?? "—"}
                      </span>
                      <button onClick={copyRef} className="p-1 rounded hover:bg-white/5 transition-colors flex-shrink-0">
                        {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3 text-white/25 hover:text-white/50" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Divider tearline */}
                <div className="relative h-5">
                  <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-white/10" />
                  <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#09090b]" />
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#09090b]" />
                </div>

                {/* Footer */}
                <div className="px-7 py-5 flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <p className="text-[11px] text-white/35 leading-relaxed">
                    This receipt confirms your registration for the Sledge Mentorship Program {receipt.cohort ?? "2026"} cohort.
                  </p>
                </div>
              </div>

              {/* ── Action buttons ── */}
              <div className="flex gap-2">
                <button onClick={downloadPdf} disabled={downloading}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold bg-green-500 hover:bg-green-400 disabled:opacity-50 text-black transition-colors shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                  {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  {downloading ? "Generating…" : "Download PDF"}
                </button>

                <button onClick={sendToEmail} disabled={sending || !receipt.email}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold bg-white/[0.06] border border-white/10 hover:bg-white/10 disabled:opacity-40 text-white/70 hover:text-white transition-all">
                  {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                  {sending ? "Sending…" : "Send to Email"}
                </button>
              </div>

              {/* Send feedback */}
              <AnimatePresence>
                {sendStatus !== "idle" && (
                  <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className={`flex items-center gap-2 text-xs px-4 py-3 rounded-xl border ${
                      sendStatus === "sent"
                        ? "text-green-400 bg-green-500/8 border-green-500/15"
                        : "text-red-400 bg-red-500/8 border-red-500/15"
                    }`}>
                    {sendStatus === "sent"
                      ? <><CheckCircle2 className="w-3.5 h-3.5" /> Receipt sent to <strong>{receipt.email}</strong></>
                      : <><AlertCircle className="w-3.5 h-3.5" /> Failed to send email. Please try again.</>}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Support note */}
              <p className="text-center text-[11px] text-white/25 pb-4">
                Need help?{" "}
                <Link to="/contact" className="text-white/40 hover:text-white/60 underline underline-offset-2 transition-colors">Contact Support</Link>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default PaymentReceipt;