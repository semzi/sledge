import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Calendar, Clock, User, ArrowLeft, CheckCircle2, Loader2, DollarSign, Mail, RefreshCw, AlertCircle, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiUrl } from '../lib/api';
import { useContent } from "../contexts/ContentContext";
import { usePaystackPayment } from "react-paystack";
import { CONFIG } from "../lib/config";

const STEPS = ["Date & Time", "Details", "Verify", "Payment"];

const formatDateToLocal = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const ConfettiRibbon = ({ delay }: { delay: number }) => {
  const colors = ['#22c55e', '#16a34a', '#4ade80', '#ffffff', '#fbbf24', '#f472b6'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const xStart = Math.random() * 100;
  const xEnd = xStart + (Math.random() * 40 - 20);
  return (
    <motion.div
      initial={{ top: -20, left: `${xStart}%`, opacity: 1, rotate: 0, scale: Math.random() * 0.5 + 0.5 }}
      animate={{ top: '110%', left: `${xEnd}%`, rotate: 720, opacity: [1, 1, 0] }}
      transition={{ duration: Math.random() * 2 + 3, delay, ease: "linear", repeat: Infinity, repeatDelay: Math.random() * 5 }}
      className="absolute pointer-events-none z-[100]"
      style={{ width: Math.random() * 8 + 4, height: Math.random() * 20 + 10, backgroundColor: color, borderRadius: '2px' }}
    />
  );
};

const Confetti = () => createPortal(
  <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
    {[...Array(60)].map((_, i) => <ConfettiRibbon key={i} delay={i * 0.15} />)}
  </div>,
  document.body
);



export default function SessionBookingStepper({ onCancel, onConfirmed }: { onCancel: () => void, onConfirmed: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('naira');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', purpose: '' });
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [dynamicSettings, setDynamicSettings] = useState<any>({ available_days: [], available_times: [], weeks_ahead: 4 });
  const [bookedSessions, setBookedSessions] = useState<any[]>([]);
  const { content } = useContent();
  const [showCalendarOptions, setShowCalendarOptions] = useState(false);

  const oneOnOne = content?.programs?.oneOnOne;
  const pricing = React.useMemo(() => {
    if (!oneOnOne) return { USD: 30, NGN: 30000 };
    return {
      USD: oneOnOne.priceUsd || oneOnOne.price || 30,
      NGN: oneOnOne.priceNgn || 30000
    };
  }, [oneOnOne]);

  // Paystack Configuration
  const paystackConfig = {
    reference: (new Date()).getTime().toString(),
    email: formData.email,
    amount: (paymentMethod === 'naira' ? pricing.NGN : pricing.USD) * 100,
    publicKey: CONFIG.PAYSTACK_PUBLIC_KEY,
    currency: "NGN",
  };

  const initializePaystack = usePaystackPayment(paystackConfig);
  const isConfirmed = currentStep === 4;

  // ── OTP state ──────────────────────────────────────────────────────────────
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpSuccess, setOtpSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);   // seconds left before code expires
  const [resendCooldown, setResendCooldown] = useState(0); // seconds before resend allowed
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resendRef    = useRef<ReturnType<typeof setInterval> | null>(null);

  React.useEffect(() => { if (currentStep === 4) onConfirmed(); }, [currentStep, onConfirmed]);

  React.useEffect(() => {
    fetch(apiUrl('/session_settings.php')).then(r => r.json()).then(d => { if (d && !d.error) setDynamicSettings(d); }).catch(console.error);
  }, []);

  React.useEffect(() => {
    if (!selectedDate) return;
    const dateStr = formatDateToLocal(selectedDate);
    fetch(apiUrl(`/sessions.php?startDate=${dateStr}&endDate=${dateStr}`))
      .then(r => r.json()).then(d => {
        setBookedSessions(d.items || []);
        if (selectedTime && !isTimeAvailable(selectedTime, d.items || [])) setSelectedTime(null);
      }).catch(console.error);
  }, [selectedDate]);

  const timeToMinutes = (t: string) => {
    const p = t.match(/(\d+):(\d+)\s?(AM|PM)/i);
    if (!p) return 0;
    let h = parseInt(p[1]), m = parseInt(p[2]);
    if (p[3].toUpperCase() === 'PM' && h !== 12) h += 12;
    if (p[3].toUpperCase() === 'AM' && h === 12) h = 0;
    return h * 60 + m;
  };

  const isTimeAvailable = (t: string, bookings = bookedSessions) => {
    const tv = timeToMinutes(t), end = tv + 120;
    return !bookings.some(s => {
      if (s.status === 'cancelled') return false;
      const bs = timeToMinutes(s.session_time), be = bs + 120;
      return end > bs && tv < be;
    });
  };

  const upcomingDates = (() => {
    const dates: Date[] = [], today = new Date(), max = (dynamicSettings.weeks_ahead || 4) * 7;
    for (let i = 1; i <= max; i++) {
      const d = new Date(today); d.setDate(today.getDate() + i);
      if (dynamicSettings.available_days?.includes(d.toLocaleDateString('en-US', { weekday: 'long' }))) dates.push(d);
    }
    return dates;
  })();

  // ── OTP helpers ────────────────────────────────────────────────────────────
  const startCountdown = useCallback((seconds: number) => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    setCountdown(seconds);
    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(countdownRef.current!); return 0; }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const startResendCooldown = useCallback((seconds = 30) => {
    if (resendRef.current) clearInterval(resendRef.current);
    setResendCooldown(seconds);
    resendRef.current = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) { clearInterval(resendRef.current!); return 0; }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const sendOtp = useCallback(async (isResend = false) => {
    setOtpSending(true);
    setOtpError(null);
    try {
      const res = await fetch(apiUrl('/otp.php'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, name: formData.name }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to send code');
      startCountdown(json.expires_in ?? 600);
      startResendCooldown(30);
      if (isResend) setVerificationCode(['', '', '', '', '', '']);
    } catch (err: any) {
      setOtpError(err.message);
    } finally {
      setOtpSending(false);
    }
  }, [formData.email, formData.name, startCountdown, startResendCooldown]);

  // Auto-send OTP when entering step 2
  useEffect(() => {
    if (currentStep === 2) {
      setOtpSuccess(false);
      setOtpError(null);
      sendOtp();
    }
    // Cleanup timers when leaving step 2
    return () => {
      if (currentStep === 2) {
        if (countdownRef.current) clearInterval(countdownRef.current);
        if (resendRef.current)    clearInterval(resendRef.current);
      }
    };
  }, [currentStep]); // eslint-disable-line react-hooks/exhaustive-deps

  const verifyOtp = async (): Promise<boolean> => {
    setOtpVerifying(true);
    setOtpError(null);
    try {
      const code = verificationCode.join('');
      const res = await fetch(apiUrl('/otp.php'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, code }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || 'Invalid code');
      setOtpSuccess(true);
      if (countdownRef.current) clearInterval(countdownRef.current);
      return true;
    } catch (err: any) {
      setOtpError(err.message);
      return false;
    } finally {
      setOtpVerifying(false);
    }
  };

  // ── Navigation ─────────────────────────────────────────────────────────────
  const nextStep = async () => {
    // Step 2 → verify
    if (currentStep === 2) {
      const ok = await verifyOtp();
      if (!ok) return;
    }
    if (currentStep === 3) {
      setIsSaving(true);
      try {
        const selectedCurrency = paymentMethod === 'naira' ? 'NGN' : 'USD';
        
        // 1. Initial request to get session/intent from backend
        const res = await fetch(apiUrl('/payment.php'), { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify({ 
            currency: selectedCurrency,
            type: 'session',
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            purpose: formData.purpose,
            session_date: selectedDate ? formatDateToLocal(selectedDate) : null,
            session_time: selectedTime,
            success_url: window.location.origin + "/payment-success?session_id={CHECKOUT_SESSION_ID}",
            cancel_url: window.location.href
          }) 
        });
        
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Payment initiation failed');

        // 2. Handle Gateway
        if (data.payment_gateway === 'stripe' && data.url) {
          // Stripe flow
          window.location.href = data.url;
        } else if (data.payment_gateway === 'paystack') {
          // Paystack flow
          initializePaystack({
             onSuccess: (refObj: any) => handleBookingSuccess(refObj.reference, 'paystack'),
             onClose: () => setIsSaving(false)
          });
        } else {
          throw new Error('Invalid payment gateway configuration');
        }
      } catch (err: any) { 
        alert(err.message || 'There was an error saving your booking. Please try again.'); 
        setIsSaving(false);
      }
      return;
    }
    if (currentStep < STEPS.length) setCurrentStep(c => c + 1);
  };

  const handleBookingSuccess = async (reference: string, gateway: string) => {
    setIsSaving(true);
    try {
      const selectedCurrency = paymentMethod === 'naira' ? 'NGN' : 'USD';
      const paidAmount = paymentMethod === 'naira' ? pricing.NGN : pricing.USD;

      // Finalize booking — save to DB, create calendar event, send receipt
      const body = { 
        session_type: 'mentorship-2h',
        title: 'Private Mentorship Session',
        name: formData.name, 
        email: formData.email, 
        phone: formData.phone, 
        purpose: formData.purpose, 
        session_date: selectedDate ? formatDateToLocal(selectedDate) : null, 
        session_time: selectedTime,
        program: 'mentorship',
        payment_currency: selectedCurrency,
        amount: paidAmount,
        gateway: gateway,
        payment_reference: reference,
        status: 'confirmed' 
      };

      const res = await fetch(apiUrl('/sessions.php'), { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(body) 
      });
      
      if (!res.ok) throw new Error();
      setCurrentStep(4);
    } catch {
      alert('Payment verified but failed to register the session. Please contact support.');
    } finally {
      setIsSaving(false);
    }
  };

  const prevStep = () => { if (currentStep > 0) setCurrentStep(c => c - 1); else onCancel(); };

  const isStepValid = () => {
    if (currentStep === 0) return selectedDate !== null && selectedTime !== null;
    if (currentStep === 1) return formData.name.trim() !== '' && formData.email.includes('@');
    if (currentStep === 2) return verificationCode.every(d => d !== '');
    if (currentStep === 3) return paymentMethod !== '';
    return true;
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleCode = (i: number, v: string) => {
    if (!/^\d?$/.test(v)) return;
    const c = [...verificationCode]; c[i] = v; setVerificationCode(c);
    if (v && i < 5) document.getElementById(`code-${i + 1}`)?.focus();
  };

  const handleCodeKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !verificationCode[i] && i > 0) document.getElementById(`code-${i - 1}`)?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasteData = e.clipboardData.getData('text').trim().slice(0, 6).split('');
    if (pasteData.length > 0 && pasteData.every(char => /^\d$/.test(char))) {
      const newCode = [...verificationCode];
      pasteData.forEach((char, index) => {
        if (index < 6) newCode[index] = char;
      });
      setVerificationCode(newCode);
      // Focus the last filled input or the first one if empty
      const focusIndex = Math.min(pasteData.length, 5);
      document.getElementById(`code-${focusIndex}`)?.focus();
    }
  };

  /* ── Step content ── */
  const renderStep = () => {
    switch (currentStep) {

      /* Step 0 – Date & Time */
      case 0: return (
        <div className="flex flex-col gap-4 flex-1 min-h-0">
          <div>
            <p className="text-[10px] font-semibold text-white/40 uppercase tracking-widest mb-1.5">Available Dates</p>
            <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
              {upcomingDates.map((date, idx) => {
                const sel = selectedDate?.toDateString() === date.toDateString();
                return (
                  <button key={idx} onClick={() => setSelectedDate(date)}
                    className={`flex flex-col items-center justify-center min-w-[56px] h-16 rounded-xl border flex-shrink-0 transition-all text-sm ${sel ? 'bg-green-500 text-black border-green-500 shadow-lg shadow-green-500/20 font-bold' : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'}`}>
                    <span className="text-[10px] opacity-70">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                    <span className="text-base font-bold leading-none">{date.getDate()}</span>
                    <span className="text-[9px] opacity-70">{date.toLocaleDateString('en-US', { month: 'short' })}</span>
                  </button>
                );
              })}
              {upcomingDates.length === 0 && (
                <p className="text-white/30 text-sm py-4">No available dates configured yet.</p>
              )}
            </div>
          </div>

          <AnimatePresence>
            {selectedDate && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="border-t border-white/10 pt-3">
                <div className="flex justify-between items-center mb-1.5">
                  <p className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">Available Times</p>
                  <p className="text-[10px] text-white/30">All times in GMT+1</p>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {(dynamicSettings.available_times || []).map((time: string, idx: number) => {
                    const avail = isTimeAvailable(time);
                    return (
                      <button key={idx} disabled={!avail} onClick={() => setSelectedTime(time)}
                        className={`py-1.5 text-xs rounded-lg border transition-all ${selectedTime === time ? 'bg-white text-black border-white font-bold' : avail ? 'border-white/15 text-white/60 hover:border-white/30 hover:text-white/90' : 'border-white/5 text-white/15 cursor-not-allowed line-through'}`}>
                        {time}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );

      /* Step 1 – Details */
      case 1: return (
        <div className="flex flex-col gap-3">
          {[
            { label: 'Full Name', name: 'name', type: 'text', placeholder: 'John Doe', required: true, icon: <User className="w-3.5 h-3.5" /> },
            { label: 'Email Address', name: 'email', type: 'email', placeholder: 'john@example.com', required: true, icon: <Mail className="w-3.5 h-3.5" /> },
            { label: 'Phone (Optional)', name: 'phone', type: 'tel', placeholder: '+1 555 000 0000', required: false, icon: null },
          ].map(f => (
            <div key={f.name}>
              <label className="block text-[10px] uppercase tracking-widest text-white/40 font-semibold mb-1">{f.label}{f.required && <span className="text-green-400 ml-0.5">*</span>}</label>
              <div className="relative">
                {f.icon && <span className="absolute inset-y-0 left-3 flex items-center text-white/25 pointer-events-none">{f.icon}</span>}
                <input type={f.type} name={f.name} value={(formData as any)[f.name]} onChange={handleInput} placeholder={f.placeholder}
                  className={`w-full bg-white/[0.04] border border-white/10 rounded-xl py-2.5 ${f.icon ? 'pl-9' : 'pl-3.5'} pr-3.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-green-500/60 focus:bg-white/[0.06] transition-all`} />
              </div>
            </div>
          ))}
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-white/40 font-semibold mb-1">Purpose <span className="normal-case text-white/25">(optional)</span></label>
            <textarea name="purpose" rows={2} value={formData.purpose} onChange={handleInput} placeholder="What would you like to discuss?"
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl py-2.5 px-3.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-green-500/60 focus:bg-white/[0.06] transition-all resize-none" />
          </div>
        </div>
      );

      /* Step 2 – Verify Email */
      case 2: {
        const fmtTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
        const isExpired = countdown === 0 && !otpSending;
        return (
          <div className="flex flex-col items-center gap-4 py-1">
            {/* Icon */}
            <motion.div
              animate={otpSuccess ? { scale: [1, 1.15, 1], borderColor: ['rgba(34,197,94,0.3)', 'rgba(34,197,94,0.8)', 'rgba(34,197,94,0.3)'] } : {}}
              transition={{ duration: 0.5 }}
              className="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center"
            >
              {otpSuccess
                ? <ShieldCheck className="w-6 h-6 text-green-400" />
                : otpSending
                  ? <Loader2 className="w-6 h-6 text-green-400 animate-spin" />
                  : <Mail className="w-6 h-6 text-green-400" />}
            </motion.div>

            {/* Heading */}
            <div className="text-center">
              <h4 className="text-base font-semibold text-white mb-1">
                {otpSending ? 'Sending code…' : 'Check your inbox'}
              </h4>
              <p className="text-sm text-white/45 leading-relaxed">
                {otpSending
                  ? 'Sending a verification code to your email…'
                  : <>We sent a 6-digit code to <span className="text-white/80 font-medium">{formData.email}</span></>}
              </p>
            </div>

            {/* Code inputs */}
            <div className="flex gap-2">
              {verificationCode.map((digit, i) => (
                <input key={i} id={`code-${i}`} type="text" inputMode="numeric" maxLength={1} value={digit}
                  disabled={otpSending || otpSuccess}
                  onChange={e => handleCode(i, e.target.value)} 
                  onKeyDown={e => handleCodeKey(i, e)}
                  onPaste={handlePaste}
                  className={`w-10 h-12 bg-white/[0.04] border rounded-xl text-center text-lg font-bold focus:outline-none transition-all
                    ${ otpError ? 'border-red-500/50 text-red-400 focus:border-red-500'
                      : otpSuccess ? 'border-green-500/60 text-green-400'
                      : 'border-white/10 text-green-400 focus:border-green-500 focus:bg-white/[0.07]'}`} />
              ))}
            </div>

            {/* Error message */}
            <AnimatePresence>
              {otpError && (
                <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg w-full">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{otpError}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Countdown + Resend */}
            <div className="text-center space-y-2">
              {!otpSuccess && (
                <>
                  {countdown > 0 && (
                    <p className={`text-[11px] font-mono px-3 py-1.5 rounded-lg inline-block border ${
                      countdown < 60
                        ? 'text-red-400/80 bg-red-500/5 border-red-500/15'
                        : 'text-green-500/60 bg-green-500/5 border-green-500/10'
                    }`}>
                      ⏱ Code expires in {fmtTime(countdown)}
                    </p>
                  )}
                  {isExpired && !otpError && (
                    <p className="text-[11px] text-red-400/70 bg-red-500/5 border border-red-500/15 px-3 py-1.5 rounded-lg inline-block">
                      ⚠ Code expired — please resend
                    </p>
                  )}
                  <p className="text-xs text-white/35">
                    Didn't get it?{' '}
                    <button
                      disabled={resendCooldown > 0 || otpSending}
                      onClick={() => sendOtp(true)}
                      className="inline-flex items-center gap-1 text-green-400 hover:underline disabled:text-white/25 disabled:no-underline transition-colors"
                    >
                      {otpSending ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                      {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
                    </button>
                  </p>
                </>
              )}
              {otpSuccess && (
                <p className="text-xs text-green-400/80 bg-green-500/5 border border-green-500/15 px-3 py-1.5 rounded-lg inline-block">
                  ✓ Email verified — continuing…
                </p>
              )}
            </div>
          </div>
        );
      }

      /* Step 3 – Payment */
      case 3: {
        // session details are shown from CMS content (oneOnOne)
        return (
          <div className="flex flex-col gap-3">
            {/* Mini summary */}
            <div className="flex items-center justify-between bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3">
              <div>
                <p className="text-xs font-semibold text-white/80">{oneOnOne?.title || "Private Mentorship"}</p>
                <div className="flex gap-3 mt-0.5 text-[11px] text-white/40">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{selectedDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{selectedTime}</span>
                </div>
              </div>
              <span className="text-green-400 font-bold text-base">
                {paymentMethod === 'naira' ? `₦${pricing.NGN.toLocaleString()}` : `$${pricing.USD}`}
              </span>
            </div>

            {/* Currency cards */}
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/40 font-semibold mb-2">Select currency</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'naira', label: 'Pay in Naira', sub: 'NGN · Local transfer', symbol: '₦', isText: true },
                  { key: 'usd',   label: 'Pay in USD',   sub: 'USD · International', symbol: null, isText: false },
                ].map(opt => {
                  const active = paymentMethod === opt.key;
                  return (
                    <button key={opt.key} onClick={() => setPaymentMethod(opt.key)}
                      className={`relative flex flex-col items-center gap-2.5 p-5 rounded-2xl border transition-all duration-300 ${active ? 'border-green-500 bg-green-500/10 shadow-[0_0_20px_rgba(34,197,94,0.12)]' : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/20'}`}>
                      {active && (
                        <span className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-black" />
                        </span>
                      )}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold transition-all ${active ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-white/40'}`}>
                        {opt.isText ? opt.symbol : <DollarSign className="w-5 h-5" />}
                      </div>
                      <div className="text-center">
                        <p className={`text-sm font-semibold ${active ? 'text-white' : 'text-white/60'}`}>{opt.label}</p>
                        <p className="text-[10px] text-white/35 mt-0.5">{opt.sub}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );
      }

      /* Step 4 – Confirmed */
      case 4: return (
        <div className="flex flex-col items-center justify-center gap-5 py-6 text-center relative">
          <Confetti />
          <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="w-20 h-20 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.3)]">
            <CheckCircle2 className="w-10 h-10 text-green-400" />
          </motion.div>
          <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="space-y-1">
            <h3 className="text-2xl font-bold text-white tracking-tight">Booking Confirmed!</h3>
            <p className="text-sm text-white/50 max-w-xs mx-auto">
              {formData.name.split(' ')[0]}, your session is set for <span className="text-white/90 font-medium">{selectedDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span> at <span className="text-white/90 font-medium">{selectedTime}</span>.
            </p>
          </motion.div>
          {/* Calendar buttons */}
          <AnimatePresence>
            {showCalendarOptions && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }} 
                animate={{ height: 'auto', opacity: 1 }} 
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden w-full"
              >
                <div className="grid grid-cols-3 gap-2 w-full">
                  <a href={`https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent("Mentorship Session")}&details=${encodeURIComponent(formData.purpose || "Mentorship session with Sledge")}&location=${encodeURIComponent("Google Meet")}&dates=${selectedDate?.toISOString().replace(/-|:|\.\d\d\d/g, "")}/${selectedDate?.toISOString().replace(/-|:|\.\d\d\d/g, "")}`} target="_blank" rel="noopener noreferrer" 
                     className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all gap-1.5 grayscale hover:grayscale-0">
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#4285F4]">
                       <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z"/>
                     </svg>
                     <span className="text-[10px] text-white/60">Google</span>
                  </a>
                  <a href={`https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent("Mentorship Session")}&body=${encodeURIComponent(formData.purpose || "Mentorship session with Sledge")}&startdt=${selectedDate?.toISOString()}&enddt=${selectedDate?.toISOString()}`} target="_blank" rel="noopener noreferrer"
                     className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all gap-1.5 grayscale hover:grayscale-0">
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 23" fill="currentColor" className="w-5 h-5 text-[#0078d4]">
                       <path d="M0 0h11v11H0zm12 0h11v11H12zM0 12h11v11H0zm12 0h11v11H12z"/>
                     </svg>
                     <span className="text-[10px] text-white/60">Outlook</span>
                  </a>
                  <button onClick={() => {
                    const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:Mentorship Session\nDTSTART:${selectedDate?.toISOString().replace(/-|:|\.\d\d\d/g, "")}\nDESCRIPTION:${formData.purpose || "Mentorship session with Sledge"}\nEND:VEVENT\nEND:VCALENDAR`;
                    const blob = new Blob([icsContent], { type: 'text/calendar' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'session.ics';
                    link.click();
                  }} className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all gap-1.5 grayscale hover:grayscale-0">
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="currentColor" className="w-5 h-5 text-white">
                       <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                     </svg>
                     <span className="text-[10px] text-white/60">Apple</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }}
            className="bg-white/[0.04] border border-white/10 rounded-xl px-5 py-3 w-full text-center">
            <p className="text-[10px] uppercase tracking-widest text-white/35 mb-1">Confirmation sent to</p>
            <p className="text-sm font-semibold text-white">{formData.email}</p>
            <p className="text-[10px] text-white/25 mt-1">Check your inbox or spam folder</p>
          </motion.div>
        </div>
      );

      default: return null;
    }
  };

  /* ── STEPPER DOTS ── */
  const progressPct = (currentStep / (STEPS.length - 1)) * 100;

  return (
    <div className="flex flex-col flex-1 min-h-0 w-full">

      {/* ── Header: step indicator ── */}
      {!isConfirmed && (
        <div className="flex-shrink-0 px-1 pb-3">
          {/* Labels */}
          <div className="flex justify-between mb-3">
            {STEPS.map((s, i) => (
              <span key={i} className={`text-[10px] font-semibold uppercase tracking-wider transition-colors ${i === currentStep ? 'text-green-400' : i < currentStep ? 'text-white/50' : 'text-white/20'}`}>{s}</span>
            ))}
          </div>
          {/* Track */}
          <div className="relative h-[3px] bg-white/8 rounded-full overflow-hidden">
            <motion.div className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-600 to-green-400 rounded-full" animate={{ width: `${progressPct}%` }} transition={{ duration: 0.4, ease: 'easeInOut' }} />
          </div>
          {/* Dots */}
          <div className="flex justify-between mt-[-5px]">
            {STEPS.map((_, i) => (
              <button key={i} onClick={() => i < currentStep && setCurrentStep(i)} disabled={i >= currentStep}
                className={`w-[11px] h-[11px] rounded-full border-2 transition-all duration-300 ${i < currentStep ? 'bg-green-500 border-green-500 cursor-pointer hover:scale-125' : i === currentStep ? 'bg-[#050505] border-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]' : 'bg-[#050505] border-white/15'}`} />
            ))}
          </div>
        </div>
      )}

      {/* ── Scrollable Content ── */}
      <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0">
        {/* Step heading */}
        {!isConfirmed && (
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-white leading-tight">
              {currentStep === 0 && 'Pick a Date & Time'}
              {currentStep === 1 && 'Your Details'}
              {currentStep === 2 && 'Verify Your Email'}
              {currentStep === 3 && 'Choose Payment'}
            </h3>
            <p className="text-xs text-white/40 mt-0.5">
              {currentStep === 0 && 'Select an available slot for your session.'}
              {currentStep === 1 && 'Tell us a bit about you.'}
              {currentStep === 2 && 'Enter the code we sent to your email.'}
              {currentStep === 3 && 'Select your preferred currency.'}
            </p>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div key={currentStep}
            initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}>
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Footer Nav ── */}
      <div className="flex-shrink-0 pt-3 mt-1 border-t border-white/8 flex justify-between items-center">
        {isConfirmed ? (
          <div className="w-full grid grid-cols-2 gap-3">
            <button 
              onClick={() => setShowCalendarOptions(!showCalendarOptions)}
              className="py-2.5 px-4 rounded-xl text-sm font-medium text-white/60 bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
              {showCalendarOptions ? 'Hide Calendar' : 'Add to Calendar'}
            </button>
            <Link to="/" className="py-2.5 px-4 rounded-xl text-sm font-medium text-black bg-green-400 hover:bg-green-300 transition-all text-center shadow-[0_0_15px_rgba(34,197,94,0.25)]">
              Go to Homepage
            </Link>
          </div>
        ) : (
          <>
            <button onClick={prevStep} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-all text-sm font-medium">
              <ArrowLeft className="w-4 h-4" />
              {currentStep === 0 ? 'Cancel' : 'Back'}
            </button>
            <button onClick={nextStep} disabled={!isStepValid() || isSaving || otpVerifying || otpSending}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-semibold transition-all ${
                (isStepValid() && !isSaving && !otpVerifying && !otpSending)
                  ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.25)] hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(34,197,94,0.35)]'
                  : 'bg-white/5 text-white/25 cursor-not-allowed border border-white/5'
              }`}>
              {isSaving    ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
              : otpVerifying ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying…</>
              : currentStep === 2 ? 'Verify & Continue'
              : currentStep === 3 ? 'Confirm & Pay'
              : 'Continue'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
