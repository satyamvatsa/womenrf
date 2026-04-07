'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from '@/lib/TranslationContext';
import { useCmsData } from '@/lib/useCmsData';

const PAYPAL_CLIENT_ID = typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID : '';

const HERO_BG = '/images/GettyImages-1232002648.jpg';

const AMOUNTS = [25, 50, 100, 250];

const HERO_TITLE_BG_MAP: Record<string, string> = {
  'bg-wrf-black': 'bg-wrf-black',
  'bg-primary': 'bg-primary',
  'bg-secondary': 'bg-secondary',
  'bg-accent': 'bg-accent',
  'bg-support-1': 'bg-support-1',
};
const HERO_TITLE_TEXT_MAP: Record<string, string> = {
  'text-white': 'text-white',
  'text-primary': 'text-primary',
};
const HERO_SUBTITLE_TEXT_MAP: Record<string, string> = {
  'text-white/90': 'text-white/90',
  'text-white': 'text-white',
  'text-gray-600': 'text-gray-600',
};

type OtherWayItem = {
  id: string;
  title: string;
  bgClass: string;
  icon: string | null;
  content: React.ReactNode;
};

function OtherWayIcon({ name }: { name: string }) {
  const paths: Record<string, React.ReactNode> = {
    mail: (
      <>
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </>
    ),
    gift: (
      <>
        <rect x="3" y="8" width="18" height="4" rx="1" />
        <path d="M12 8v13" />
        <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
        <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
      </>
    ),
    'trending-up': (
      <>
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </>
    ),
    phone: (
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    ),
  };
  const path = paths[name];
  if (!path) return null;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
      {path}
    </svg>
  );
}

export default function DonatePage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<'one-time' | 'monthly'>('one-time');
  const [amount, setAmount] = useState<number | null>(50);
  const [otherAmount, setOtherAmount] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [otherWaysExpandedId, setOtherWaysExpandedId] = useState<string | null>(null);
  const [intentStatus, setIntentStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [monthlyAmount, setMonthlyAmount] = useState<number | null>(25);
  const [monthlyOtherAmount, setMonthlyOtherAmount] = useState('');
  const [monthlyName, setMonthlyName] = useState('');
  const [monthlyEmail, setMonthlyEmail] = useState('');
  const [monthlyIntentStatus, setMonthlyIntentStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [paypalStatus, setPaypalStatus] = useState<'idle' | 'processing' | 'success' | 'error' | 'cancelled'>('idle');
  const [paypalOrderId, setPaypalOrderId] = useState<string | null>(null);
  const paypalContainerRef = useRef<HTMLDivElement>(null);
  const amountRef = useRef<{ amount: number | null; otherAmount: string }>({ amount: 50, otherAmount: '' });
  amountRef.current = { amount, otherAmount };
  const paypalStatusRef = useRef(setPaypalStatus);
  paypalStatusRef.current = setPaypalStatus;
  const paypalOrderIdRef = useRef(setPaypalOrderId);
  paypalOrderIdRef.current = setPaypalOrderId;

  const adminDonations = useCmsData<Record<string, any>>('donations');
  const adminOptions = useCmsData<Record<string, any>>('donation-options');

  // Load PayPal Donate button when client ID is set
  useEffect(() => {
    if (!PAYPAL_CLIENT_ID || !paypalContainerRef.current) return;
    const src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD&intent=capture`;
    const runRender = () => {
      const w = window as unknown as { paypal?: { Buttons: (opts: unknown) => { render: (el: HTMLElement) => void } } };
      if (!w.paypal?.Buttons || !paypalContainerRef.current) return;
      paypalContainerRef.current.innerHTML = '';
      w.paypal.Buttons({
        style: { label: 'donate', layout: 'vertical' },
        createOrder(_data: unknown, actions: { order: { create: (opts: { purchase_units: unknown[] }) => Promise<string> } }) {
          paypalStatusRef.current('processing');
          const { amount: amt, otherAmount: other } = amountRef.current;
          const value = other.trim()
            ? Math.max(0, parseFloat(other) || 0)
            : (amt ?? 0);
          const finalValue = value > 0 ? value : 25;
          return actions.order.create({
            purchase_units: [{
              amount: { currency_code: 'USD', value: finalValue.toFixed(2) },
              description: "One-time donation to Women's Rights First",
            }],
          });
        },
        onApprove(_data: unknown, actions: { order: { capture: () => Promise<{ id: string; status: string }> } }) {
          return actions.order.capture().then((details: { id: string; status: string }) => {
            paypalOrderIdRef.current(details.id);
            paypalStatusRef.current('success');
          });
        },
        onCancel() {
          paypalStatusRef.current('cancelled');
        },
        onError() {
          paypalStatusRef.current('error');
        },
      }).render(paypalContainerRef.current);
    };
    const existing = document.querySelector('script[src*="paypal.com/sdk/js"]');
    if (existing) {
      runRender();
      return () => { if (paypalContainerRef.current) paypalContainerRef.current.innerHTML = ''; };
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = runRender;
    document.body.appendChild(script);
    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
      if (paypalContainerRef.current) paypalContainerRef.current.innerHTML = '';
    };
  }, [tab]);

  const OTHER_WAYS: OtherWayItem[] = [
    {
      id: 'contact',
      title: t('donate.otherWays.contact'),
      bgClass: 'bg-wrf-black',
      icon: null,
      content: (
        <p className="text-white/90">
          {t('donate.otherWays.contactDesc')}
        </p>
      ),
    },
    {
      id: 'check',
      title: t('donate.otherWays.check'),
      bgClass: 'bg-wrf-black',
      icon: 'mail',
      content: (
        <p className="text-white/90">
          {t('donate.otherWays.checkDesc')}
        </p>
      ),
    },
    {
      id: 'legacy',
      title: t('donate.otherWays.legacy'),
      bgClass: 'bg-wrf-purple',
      icon: 'gift',
      content: (
        <p className="text-white/90">
          {t('donate.otherWays.legacyDesc')}
        </p>
      ),
    },
    {
      id: 'stocks',
      title: t('donate.otherWays.stocks'),
      bgClass: 'bg-wrf-coral',
      icon: 'trending-up',
      content: (
        <p className="text-white/90">
          {t('donate.otherWays.stocksDesc')}
        </p>
      ),
    },
    {
      id: 'phone',
      title: t('donate.otherWays.phone'),
      bgClass: 'bg-wrf-footer-mauve',
      icon: 'phone',
      content: (
        <p className="text-white/90">
          {t('donate.otherWays.phoneDesc')}
        </p>
      ),
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero — full-width background, dark overlay, diagonal reveal, title box left */}
      <section
        className="relative min-h-[420px] overflow-hidden bg-cover bg-center py-20 md:py-32"
        style={{ backgroundImage: `url(${adminDonations?.heroBackgroundImageUrl || HERO_BG})` }}
      >
        <div className="absolute inset-0 bg-black/60" aria-hidden />
        <div
          className="absolute right-0 top-0 hidden h-full w-2/5 bg-cover bg-center md:block"
          style={{
            clipPath: 'polygon(0% 100%, 100% 0%, 100% 100%)',
            backgroundImage: `url(${adminDonations?.heroTriangleImageUrl || adminDonations?.heroBackgroundImageUrl || HERO_BG})`,
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-7xl px-4 text-left sm:px-6 lg:px-8">
          <div
            className={`inline-block px-8 py-6 ${HERO_TITLE_BG_MAP[adminDonations?.titleBackgroundColor as string] || 'bg-wrf-black'}`}
          >
            <h1
              className={`mb-4 text-4xl font-bold leading-tight lg:text-6xl ${HERO_TITLE_TEXT_MAP[adminDonations?.titleTextColor as string] || 'text-white'}`}
            >
              {adminDonations?.pageTitle || t('donate.hero.title')}
            </h1>
            <p
              className={`max-w-3xl text-xl leading-relaxed ${HERO_SUBTITLE_TEXT_MAP[adminDonations?.subtitleTextColor as string] || 'text-white/90'}`}
            >
              {adminDonations?.subtitle || t('donate.hero.description')}
            </p>
          </div>
        </div>
      </section>

      {/* Make a Secure Donation */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-left">
            <div className="inline-block bg-wrf-coral px-8 py-6">
              <h2 className="text-3xl font-bold text-white">{t('donate.form.title')}</h2>
            </div>
            <p className="mt-4 text-lg text-gray-600">
              {t('donate.form.description')}
            </p>
          </div>

          <div className="bg-white p-8 shadow-xl">
            {/* Tabs */}
            <div role="tablist" className="mb-8 grid w-full grid-cols-2 gap-1 rounded-none">
              <button
                type="button"
                role="tab"
                aria-selected={tab === 'one-time'}
                onClick={() => setTab('one-time')}
                className={`inline-flex items-center justify-center rounded-none px-8 py-6 text-lg font-semibold transition-all ${
                  tab === 'one-time' ? 'bg-white text-wrf-black shadow-lg' : 'bg-wrf-coral text-white'
                }`}
              >
                {t('donate.form.oneTime')}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={tab === 'monthly'}
                onClick={() => setTab('monthly')}
                className={`inline-flex items-center justify-center rounded-none px-8 py-6 text-lg font-semibold transition-all ${
                  tab === 'monthly' ? 'bg-white text-wrf-black shadow-lg' : 'bg-wrf-purple text-white'
                }`}
              >
                {t('donate.form.monthly')}
              </button>
            </div>

            {/* One-Time panel */}
            {tab === 'one-time' && (
              <div className="space-y-6" role="tabpanel">
                <div className="border-l-4 border-wrf-purple bg-gray-50 p-6">
                  <h3 className="mb-2 text-lg font-semibold text-wrf-purple">{t('donate.form.oneTimeSupport')}</h3>
                  <p className="text-gray-700">{t('donate.form.oneTimeDesc')}</p>
                </div>

                <div>
                  <label className="text-lg font-bold">{t('donate.form.chooseAmount')}</label>
                  <div className="mt-2 grid grid-cols-2 gap-3 md:grid-cols-5">
                    {AMOUNTS.map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setAmount(value)}
                        className={`inline-flex h-16 items-center justify-center rounded-none text-xl font-medium transition-all ${
                          amount === value
                            ? 'bg-wrf-purple text-white'
                            : 'bg-gray-100 text-wrf-black hover:bg-wrf-coral hover:text-white'
                        }`}
                      >
                        ${value}
                      </button>
                    ))}
                    <input
                      type="number"
                      placeholder={t('donate.form.other')}
                      value={otherAmount}
                      onChange={(e) => {
                        setOtherAmount(e.target.value);
                        setAmount(null);
                      }}
                      className="h-16 rounded-none border-2 border-gray-300 text-center text-xl focus:border-wrf-purple focus:outline-none focus:ring-2 focus:ring-wrf-purple/20"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="donor-name" className="text-sm font-medium">
                      {t('donate.form.fullName')}
                    </label>
                    <input
                      id="donor-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 h-10 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-wrf-purple focus:outline-none focus:ring-2 focus:ring-wrf-purple/20"
                    />
                  </div>
                  <div>
                    <label htmlFor="donor-email" className="text-sm font-medium">
                      {t('donate.form.email')}
                    </label>
                    <input
                      id="donor-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 h-10 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-wrf-purple focus:outline-none focus:ring-2 focus:ring-wrf-purple/20"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  {PAYPAL_CLIENT_ID ? (
                    <div className="rounded border border-gray-200 bg-gray-50/50 p-6">
                      {paypalStatus === 'success' ? (
                        <div className="rounded-lg bg-green-50 border border-green-200 p-6 text-center">
                          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><path d="M20 6 9 17l-5-5"/></svg>
                          </div>
                          <h4 className="text-lg font-bold text-green-800">Thank you for your donation!</h4>
                          <p className="mt-1 text-sm text-green-700">
                            Your payment has been processed successfully.{paypalOrderId && <> Order ID: <span className="font-mono">{paypalOrderId}</span></>}
                          </p>
                          <button type="button" onClick={() => { setPaypalStatus('idle'); setPaypalOrderId(null); }} className="mt-4 text-sm font-medium text-green-700 underline hover:text-green-900">Make another donation</button>
                        </div>
                      ) : paypalStatus === 'error' ? (
                        <div className="rounded-lg bg-red-50 border border-red-200 p-6 text-center">
                          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-red-600"><circle cx="12" cy="12" r="10"/><line x1="15" x2="9" y1="9" y2="15"/><line x1="9" x2="15" y1="9" y2="15"/></svg>
                          </div>
                          <h4 className="text-lg font-bold text-red-800">Payment failed</h4>
                          <p className="mt-1 text-sm text-red-700">Something went wrong while processing your payment. Please try again.</p>
                          <button type="button" onClick={() => setPaypalStatus('idle')} className="mt-4 text-sm font-medium text-red-700 underline hover:text-red-900">Try again</button>
                        </div>
                      ) : paypalStatus === 'cancelled' ? (
                        <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-6 text-center">
                          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-600"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
                          </div>
                          <h4 className="text-lg font-bold text-yellow-800">Payment cancelled</h4>
                          <p className="mt-1 text-sm text-yellow-700">You cancelled the payment. No charges were made.</p>
                          <button type="button" onClick={() => setPaypalStatus('idle')} className="mt-4 text-sm font-medium text-yellow-700 underline hover:text-yellow-900">Try again</button>
                        </div>
                      ) : (
                        <>
                          <p className="mb-4 text-sm text-gray-600">
                            Select an amount above, then use the button below to pay securely with PayPal.
                          </p>
                          {paypalStatus === 'processing' && (
                            <div className="mb-4 flex items-center justify-center gap-2 text-sm text-gray-500">
                              <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                              Processing your payment...
                            </div>
                          )}
                          <div ref={paypalContainerRef} className="min-h-[120px]" />
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="rounded border-2 border-dashed border-gray-200 bg-gray-50/50 p-6">
                      <p className="mb-4 text-gray-600">
                        {t('donate.form.paypalNote')}
                      </p>
                      {intentStatus === 'success' ? (
                        <div className="rounded bg-green-50 p-4 text-green-800">
                          Thank you. We have received your donation request and will contact you shortly to complete your gift.
                        </div>
                      ) : intentStatus === 'error' ? (
                        <div className="rounded bg-red-50 p-4 text-red-800">
                          Something went wrong. Please try again or contact us.
                        </div>
                      ) : (
                        <form
                          onSubmit={async (e) => {
                            e.preventDefault();
                            const value = otherAmount.trim()
                              ? parseFloat(otherAmount) || 0
                              : (amount ?? 0);
                            if (value <= 0) return;
                            setIntentStatus('sending');
                            try {
                              const res = await fetch('/api/submit/donation-intents', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  type: 'one-time',
                                  amount: value,
                                  currency: 'CAD',
                                  fullName: name,
                                  email,
                                }),
                              });
                              if (res.ok) setIntentStatus('success');
                              else setIntentStatus('error');
                            } catch {
                              setIntentStatus('error');
                            }
                          }}
                          className="space-y-4"
                        >
                          <p className="text-sm text-gray-600">
                            Submit your details and we will contact you to complete your donation (e.g. by link or phone).
                          </p>
                          <button
                            type="submit"
                            disabled={
                              intentStatus === 'sending' ||
                              !name.trim() ||
                              !email.trim() ||
                              (otherAmount.trim() ? parseFloat(otherAmount) || 0 : amount ?? 0) <= 0
                            }
                            className="inline-flex items-center justify-center rounded-none bg-wrf-purple px-8 py-3 font-semibold text-white transition-colors hover:bg-wrf-purple/90 disabled:opacity-50"
                          >
                            {intentStatus === 'sending' ? 'Sending…' : 'Submit donation request'}
                          </button>
                        </form>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Monthly panel */}
            {tab === 'monthly' && (
              <div className="space-y-6" role="tabpanel">
                <div className="border-l-4 border-wrf-coral bg-gray-50 p-6">
                  <h3 className="mb-2 text-lg font-semibold text-wrf-coral">{t('donate.form.monthlyTitle')}</h3>
                  <p className="text-gray-700">{t('donate.form.monthlyDesc')}</p>
                </div>

                <div>
                  <label className="text-lg font-bold">Choose a Monthly Amount (CAD)</label>
                  <div className="mt-2 grid grid-cols-2 gap-3 md:grid-cols-5">
                    {[10, 25, 50, 100].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => { setMonthlyAmount(value); setMonthlyOtherAmount(''); }}
                        className={`inline-flex h-16 items-center justify-center rounded-none text-xl font-medium transition-all ${
                          monthlyAmount === value && !monthlyOtherAmount.trim()
                            ? 'bg-wrf-coral text-white'
                            : 'bg-gray-100 text-wrf-black hover:bg-wrf-purple hover:text-white'
                        }`}
                      >
                        ${value}/mo
                      </button>
                    ))}
                    <input
                      type="number"
                      placeholder={t('donate.form.other')}
                      value={monthlyOtherAmount}
                      onChange={(e) => {
                        setMonthlyOtherAmount(e.target.value);
                        setMonthlyAmount(null);
                      }}
                      className="h-16 rounded-none border-2 border-gray-300 text-center text-xl focus:border-wrf-coral focus:outline-none focus:ring-2 focus:ring-wrf-coral/20"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="monthly-donor-name" className="text-sm font-medium">
                      {t('donate.form.fullName')}
                    </label>
                    <input
                      id="monthly-donor-name"
                      type="text"
                      required
                      value={monthlyName}
                      onChange={(e) => setMonthlyName(e.target.value)}
                      className="mt-1 h-10 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-wrf-coral focus:outline-none focus:ring-2 focus:ring-wrf-coral/20"
                    />
                  </div>
                  <div>
                    <label htmlFor="monthly-donor-email" className="text-sm font-medium">
                      {t('donate.form.email')}
                    </label>
                    <input
                      id="monthly-donor-email"
                      type="email"
                      required
                      value={monthlyEmail}
                      onChange={(e) => setMonthlyEmail(e.target.value)}
                      className="mt-1 h-10 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-wrf-coral focus:outline-none focus:ring-2 focus:ring-wrf-coral/20"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <div className="rounded border-2 border-dashed border-gray-200 bg-gray-50/50 p-6">
                    {monthlyIntentStatus === 'success' ? (
                      <div className="rounded bg-green-50 p-4 text-green-800">
                        Thank you! We have received your monthly donation request. We will contact you shortly to set up your recurring gift.
                      </div>
                    ) : monthlyIntentStatus === 'error' ? (
                      <div className="rounded bg-red-50 p-4 text-red-800">
                        Something went wrong. Please try again or contact us.
                      </div>
                    ) : (
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          const value = monthlyOtherAmount.trim()
                            ? parseFloat(monthlyOtherAmount) || 0
                            : (monthlyAmount ?? 0);
                          if (value <= 0) return;
                          setMonthlyIntentStatus('sending');
                          try {
                            const res = await fetch('/api/submit/donation-intents', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                type: 'monthly',
                                amount: value,
                                currency: 'CAD',
                                fullName: monthlyName,
                                email: monthlyEmail,
                              }),
                            });
                            if (res.ok) setMonthlyIntentStatus('success');
                            else setMonthlyIntentStatus('error');
                          } catch {
                            setMonthlyIntentStatus('error');
                          }
                        }}
                        className="space-y-4"
                      >
                        <p className="text-sm text-gray-600">
                          Submit your details and we will contact you to set up your monthly recurring donation.
                        </p>
                        <button
                          type="submit"
                          disabled={
                            monthlyIntentStatus === 'sending' ||
                            !monthlyName.trim() ||
                            !monthlyEmail.trim() ||
                            (monthlyOtherAmount.trim() ? parseFloat(monthlyOtherAmount) || 0 : monthlyAmount ?? 0) <= 0
                          }
                          className="inline-flex items-center justify-center rounded-none bg-wrf-coral px-8 py-3 font-semibold text-white transition-colors hover:bg-wrf-coral/90 disabled:opacity-50"
                        >
                          {monthlyIntentStatus === 'sending' ? 'Sending…' : 'Start monthly giving'}
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Bank Wire Transfer */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-left">
            <div className="inline-block bg-wrf-black px-8 py-6">
              <h2 className="text-3xl font-bold text-white">{t('donate.bank.title')}</h2>
            </div>
            <p className="mt-4 text-lg text-gray-600">
              {t('donate.bank.description')}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Account Details */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-wrf-purple text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <line x1="2" x2="22" y1="10" y2="10" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">{t('donate.bank.accountDetails')}</h3>
              </div>
              <dl className="space-y-3">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-gray-500">{t('donate.bank.accountName')}</dt>
                  <dd className="mt-0.5 text-base font-medium text-gray-900">Women&apos;s Rights First</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-gray-500">{t('donate.bank.accountNumber')}</dt>
                  <dd className="mt-0.5 font-mono text-base font-medium text-gray-900">435062707479</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-gray-500">{t('donate.bank.accountAddress')}</dt>
                  <dd className="mt-0.5 text-base text-gray-900">3783 Tonbridge Pl, Woodbridge, VA 22192</dd>
                </div>
              </dl>
            </div>

            {/* Bank Details */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-wrf-coral text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="3" x2="21" y1="22" y2="22" />
                    <line x1="6" x2="6" y1="18" y2="11" />
                    <line x1="10" x2="10" y1="18" y2="11" />
                    <line x1="14" x2="14" y1="18" y2="11" />
                    <line x1="18" x2="18" y1="18" y2="11" />
                    <polygon points="12 2 20 7 4 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">{t('donate.bank.bankDetails')}</h3>
              </div>
              <dl className="space-y-3">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-gray-500">{t('donate.bank.bankName')}</dt>
                  <dd className="mt-0.5 text-base font-medium text-gray-900">Bank of America, N.A.</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-gray-500">{t('donate.bank.bankAddress')}</dt>
                  <dd className="mt-0.5 text-base text-gray-900">222 Broadway, New York, NY 10038</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-gray-500">{t('donate.bank.swiftCode')}</dt>
                  <dd className="mt-0.5 font-mono text-base font-bold text-wrf-purple">BOFAUS3N</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-gray-500">{t('donate.bank.routingCode')}</dt>
                  <dd className="mt-0.5 font-mono text-base font-bold text-wrf-purple">051000017</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="mt-8 rounded-lg border-l-4 border-wrf-purple bg-purple-50 p-6">
            <p className="text-sm text-gray-700">
              {t('donate.bank.note')}
            </p>
          </div>
        </div>
      </section>

      {/* Other Ways to Give */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-12 lg:grid-cols-5">
            <div className="lg:col-span-3 text-left">
              <div className="mb-6 inline-block rounded-l-lg bg-wrf-coral px-6 py-5">
                <h2 className="text-3xl font-bold text-white">
                  {adminDonations?.otherWaysTitle ?? t('donate.otherWays.title')}
                </h2>
              </div>
              <p className="max-w-lg text-lg leading-relaxed text-gray-700">
                {adminDonations?.otherWaysDescription ?? t('donate.otherWays.description')}
              </p>
            </div>
            <div className="lg:col-span-2 space-y-0 overflow-hidden rounded-lg shadow-md">
              {(adminOptions?.options && Array.isArray(adminOptions.options) && adminOptions.options.length > 0
                ? adminOptions.options
                    .filter((opt: any) => opt.isActive !== false)
                    .sort((a: any, b: any) => (a.displayOrder ?? a.order ?? 0) - (b.displayOrder ?? b.order ?? 0))
                    .map((opt: any) => {
                      const ICON_MAP: Record<string, string> = {
                        Mail: 'mail', mail: 'mail',
                        Gift: 'gift', gift: 'gift',
                        TrendingUp: 'trending-up', 'trending-up': 'trending-up',
                        Phone: 'phone', phone: 'phone',
                      };
                      const DONATION_BG_MAP: Record<string, string> = {
                        'bg-primary': 'bg-wrf-black',
                        'bg-secondary': 'bg-wrf-purple',
                        'bg-accent': 'bg-wrf-coral',
                        'bg-support-1': 'bg-wrf-footer-mauve',
                      };
                      const icon = ICON_MAP[opt.iconName] || opt.iconName?.toLowerCase() || null;
                      const bgClass = DONATION_BG_MAP[opt.colorClass] || opt.colorClass || 'bg-wrf-black';
                      const contentHtml = (opt.content && String(opt.content).trim()) ? (
                        <div className="text-white/90 prose prose-invert prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: String(opt.content) }} />
                      ) : null;
                      return {
                        id: String(opt.id ?? opt.title ?? ''),
                        title: opt.title,
                        bgClass,
                        icon,
                        content: contentHtml,
                      };
                    })
                : OTHER_WAYS
              ).map((item: OtherWayItem) => {
                const isExpanded = otherWaysExpandedId === item.id;
                return (
                  <div key={item.id} className={`${item.bgClass}`}>
                    <button
                      type="button"
                      onClick={() => setOtherWaysExpandedId(isExpanded ? null : item.id)}
                      className="flex w-full items-center justify-between gap-3 px-6 py-5 text-left text-white transition-colors hover:opacity-95"
                      aria-expanded={isExpanded}
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-3">
                        {item.icon && (
                          <span className="shrink-0 text-white">
                            <OtherWayIcon name={item.icon} />
                          </span>
                        )}
                        <h3 className="text-xl font-bold">{item.title}</h3>
                      </div>
                      <span className="shrink-0" aria-hidden>
                        {isExpanded ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                            <path d="m18 15-6-6-6 6" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                            <path d="m6 9 6 6 6-6" />
                          </svg>
                        )}
                      </span>
                    </button>
                    {isExpanded && (
                      <div className="border-t border-white/20 px-6 pb-5 pt-2">
                        <div className={item.icon ? 'pl-9' : ''}>
                          {item.content}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
