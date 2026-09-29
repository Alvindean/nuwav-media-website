'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, CheckCircle, Lock, ShieldCheck, DollarSign, Clock } from 'lucide-react';
import { QUESTIONS, Question } from './questions';

// Google Apps Script web-app URL that appends answers to the sheet.
// Set NEXT_PUBLIC_SHEETS_WEBHOOK_URL at build time (see integrations/google-sheets/README.md).
const WEBHOOK_URL = process.env.NEXT_PUBLIC_SHEETS_WEBHOOK_URL || '';

type Answers = Record<string, string | string[]>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CURRENT_YEAR = new Date().getFullYear();

function otherKey(id: string) {
  return `${id}Other`;
}

function validate(q: Question, answers: Answers): string | null {
  const value = answers[q.id];
  if (q.type === 'multi') {
    const list = (value as string[]) || [];
    if (list.length === 0) return 'Pick at least one.';
    if (q.otherOption && list.includes(q.otherOption) && !String(answers[otherKey(q.id)] || '').trim()) {
      return 'Tell us which other tools.';
    }
    return null;
  }
  const text = String(value || '').trim();
  if (!text) return q.type === 'single' ? 'Pick one to continue.' : 'This one is required.';
  if (q.type === 'single' && q.otherOption && text === q.otherOption && !String(answers[otherKey(q.id)] || '').trim()) {
    return 'Please fill in the box.';
  }
  if (q.type === 'email' && !EMAIL_RE.test(text)) return 'That email does not look right.';
  if (q.type === 'year') {
    const year = Number(text);
    if (!/^\d{4}$/.test(text) || year < 1900 || year > CURRENT_YEAR) return `Enter a year between 1900 and ${CURRENT_YEAR}.`;
  }
  return null;
}

// Resolve "Other" to the typed-in value so the sheet gets real words.
function resolved(q: Question, answers: Answers): string {
  const value = answers[q.id];
  const other = String(answers[otherKey(q.id)] || '').trim();
  if (q.type === 'multi') {
    return ((value as string[]) || []).map((v) => (v === q.otherOption && other ? other : v)).join(', ');
  }
  if (q.type === 'single' && q.otherOption && value === q.otherOption && other) return other;
  return String(value || '').trim();
}

export default function SellDataFunnel() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [error, setError] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'failed'>('idle');
  const inputRef = useRef<HTMLInputElement>(null);

  const q = QUESTIONS[step];
  const isLast = step === QUESTIONS.length - 1;
  const progress = useMemo(() => Math.round((step / QUESTIONS.length) * 100), [step]);

  useEffect(() => {
    if (started) inputRef.current?.focus();
  }, [step, started]);

  const set = (key: string, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setError(null);
  };

  const next = () => {
    const problem = validate(q, answers);
    if (problem) return setError(problem);
    if (isLast) return submit();
    setStep((s) => s + 1);
  };

  const back = () => {
    setError(null);
    if (step === 0) setStarted(false);
    else setStep((s) => s - 1);
  };

  const pickSingle = (option: string) => {
    set(q.id, option);
    // Auto-advance unless the pick needs a follow-up text box.
    if (!(q.type === 'single' && option === q.otherOption)) {
      setTimeout(() => setStep((s) => Math.min(s + 1, QUESTIONS.length - 1)), 220);
    }
  };

  const toggleMulti = (option: string) => {
    const list = (answers[q.id] as string[]) || [];
    set(q.id, list.includes(option) ? list.filter((v) => v !== option) : [...list, option]);
  };

  const submit = async () => {
    if (!consent) return setError('Please check the box to continue.');
    if (honeypot) return setStatus('done'); // bot filled the hidden field

    const params = new URLSearchParams(window.location.search);
    const payload: Record<string, string> = {
      submittedAt: new Date().toISOString(),
      pageUrl: window.location.href,
      referrer: document.referrer,
      utmSource: params.get('utm_source') || '',
      utmMedium: params.get('utm_medium') || '',
      utmCampaign: params.get('utm_campaign') || '',
      ref: params.get('ref') || '',
    };
    QUESTIONS.forEach((question) => {
      payload[question.id] = resolved(question, answers);
    });

    if (!WEBHOOK_URL) {
      console.error('NEXT_PUBLIC_SHEETS_WEBHOOK_URL is not set; answers were not saved.', payload);
      return setStatus('failed');
    }

    setStatus('sending');
    try {
      // text/plain + no-cors avoids a CORS preflight, which Apps Script cannot answer.
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
      });
      setStatus('done');
    } catch {
      setStatus('failed');
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !(e.target instanceof HTMLButtonElement)) {
      e.preventDefault();
      next();
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1020] text-white">
      <header className="px-4 sm:px-8 py-5 flex items-center justify-between max-w-5xl mx-auto">
        <a href="/" className="font-bold tracking-wide text-lg">
          NU <span className="text-[#FFD700]">WAV</span> MEDIA
        </a>
        <span className="flex items-center gap-2 text-xs text-white/60">
          <Lock size={14} /> Private &amp; confidential
        </span>
      </header>

      <main className="px-4 sm:px-8 pb-16 max-w-3xl mx-auto">
        {status === 'done' ? (
          <ThankYou name={String(answers.contactName || '').split(' ')[0]} />
        ) : !started ? (
          <Landing onStart={() => setStarted(true)} />
        ) : (
          <section className="pt-6 sm:pt-10" onKeyDown={onKeyDown}>
            <div className="mb-8">
              <div className="flex justify-between text-xs text-white/60 mb-2">
                <span>
                  Question {step + 1} of {QUESTIONS.length}
                </span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-[#FFD700] transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold leading-tight">{q.title}</h1>
            {q.help && <p className="mt-2 text-white/60">{q.help}</p>}

            <div className="mt-8">
              {(q.type === 'single' || q.type === 'multi') && (
                <div className={`grid gap-3 ${q.options.length > 6 ? 'sm:grid-cols-2' : ''}`}>
                  {q.options.map((option) => {
                    const selected =
                      q.type === 'multi'
                        ? ((answers[q.id] as string[]) || []).includes(option)
                        : answers[q.id] === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => (q.type === 'multi' ? toggleMulti(option) : pickSingle(option))}
                        className={`flex items-center gap-3 text-left px-4 py-4 rounded-xl border transition ${
                          selected
                            ? 'border-[#FFD700] bg-[#FFD700]/10'
                            : 'border-white/15 bg-white/5 hover:border-white/40'
                        }`}
                      >
                        <span
                          className={`flex-none w-5 h-5 flex items-center justify-center border ${
                            q.type === 'multi' ? 'rounded' : 'rounded-full'
                          } ${selected ? 'bg-[#FFD700] border-[#FFD700] text-black' : 'border-white/40'}`}
                        >
                          {selected && <Check size={14} strokeWidth={3} />}
                        </span>
                        <span>{option}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {(q.type === 'single' || q.type === 'multi') &&
                q.otherOption &&
                (q.type === 'multi'
                  ? ((answers[q.id] as string[]) || []).includes(q.otherOption)
                  : answers[q.id] === q.otherOption) && (
                  <input
                    ref={inputRef}
                    type="text"
                    value={String(answers[otherKey(q.id)] || '')}
                    onChange={(e) => set(otherKey(q.id), e.target.value)}
                    placeholder="Please specify"
                    className="mt-4 w-full px-4 py-4 rounded-xl bg-white/5 border border-white/20 focus:border-[#FFD700] outline-none"
                  />
                )}

              {(q.type === 'text' || q.type === 'email' || q.type === 'year') && (
                <input
                  ref={inputRef}
                  key={q.id}
                  type={q.type === 'email' ? 'email' : 'text'}
                  inputMode={q.type === 'year' ? 'numeric' : undefined}
                  maxLength={q.type === 'year' ? 4 : 200}
                  autoComplete={q.autoComplete}
                  value={String(answers[q.id] || '')}
                  onChange={(e) => set(q.id, e.target.value)}
                  placeholder={q.placeholder}
                  className="w-full px-4 py-4 text-lg rounded-xl bg-white/5 border border-white/20 focus:border-[#FFD700] outline-none"
                />
              )}

              {isLast && (
                <>
                  <label className="mt-6 flex items-start gap-3 text-sm text-white/70 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => {
                        setConsent(e.target.checked);
                        setError(null);
                      }}
                      className="mt-1 w-4 h-4 accent-[#FFD700]"
                    />
                    <span>
                      I agree to be contacted about a data offer. Sharing these answers does not commit me to sell
                      anything, and no company data is collected on this page.
                    </span>
                  </label>
                  {/* Honeypot: hidden from people, filled in by bots. */}
                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    className="hidden"
                    aria-hidden="true"
                  />
                </>
              )}
            </div>

            {error && <p className="mt-4 text-red-400">{error}</p>}
            {status === 'failed' && (
              <p className="mt-4 text-red-400">
                Something went wrong saving your answers. Please try again, or email hello@nuwavmedia.com.
              </p>
            )}

            <div className="mt-10 flex items-center justify-between">
              <button type="button" onClick={back} className="flex items-center gap-2 text-white/60 hover:text-white">
                <ArrowLeft size={18} /> Back
              </button>
              <button
                type="button"
                onClick={next}
                disabled={status === 'sending'}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FFD700] text-black font-semibold hover:bg-[#ffe44d] disabled:opacity-60"
              >
                {isLast ? (status === 'sending' ? 'Sending…' : 'Get my offer') : 'Next'} <ArrowRight size={18} />
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function Landing({ onStart }: { onStart: () => void }) {
  return (
    <section className="pt-10 sm:pt-16 text-center">
      <p className="inline-block px-3 py-1 rounded-full bg-[#FFD700]/10 text-[#FFD700] text-sm font-medium">
        For founders, owners &amp; executives
      </p>
      <h1 className="mt-6 text-4xl sm:text-5xl font-bold leading-tight text-balance">
        Your company&apos;s old data could be worth real money.
      </h1>
      <p className="mt-5 text-lg text-white/70 max-w-2xl mx-auto">
        Emails, chats, CRM records and documents from years of work are in demand. Answer 10 quick questions to see if
        your company qualifies for an offer.
      </p>
      <button
        type="button"
        onClick={onStart}
        className="mt-10 inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#FFD700] text-black text-lg font-semibold hover:bg-[#ffe44d]"
      >
        See if I qualify <ArrowRight size={20} />
      </button>
      <p className="mt-3 text-sm text-white/50">Takes about 2 minutes. No obligation.</p>

      <div className="mt-14 grid sm:grid-cols-3 gap-4 text-left">
        {[
          { icon: DollarSign, title: 'Get paid for what you have', body: 'Data from active, closed or acquired companies can qualify.' },
          { icon: ShieldCheck, title: 'You stay in control', body: 'Nothing is shared or sold without your written approval.' },
          { icon: Clock, title: 'Fast answer', body: 'We review every submission and follow up by email.' },
        ].map(({ icon: Icon, title, body }) => (
          <div key={title} className="p-5 rounded-xl bg-white/5 border border-white/10">
            <Icon className="text-[#FFD700]" size={22} />
            <h2 className="mt-3 font-semibold">{title}</h2>
            <p className="mt-1 text-sm text-white/60">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ThankYou({ name }: { name: string }) {
  return (
    <section className="pt-16 text-center">
      <CheckCircle className="mx-auto text-[#FFD700]" size={56} />
      <h1 className="mt-6 text-3xl sm:text-4xl font-bold">Thanks{name ? `, ${name}` : ''}. You&apos;re in.</h1>
      <p className="mt-4 text-lg text-white/70 max-w-xl mx-auto">
        We&apos;re reviewing your answers now. If your company is a fit, you&apos;ll get an email with next steps and
        what an offer could look like.
      </p>
      <a href="/" className="mt-10 inline-block text-[#FFD700] hover:underline">
        Back to NU WAV Media
      </a>
    </section>
  );
}
