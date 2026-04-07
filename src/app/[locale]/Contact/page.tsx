'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/TranslationContext';
import { useCmsData } from '@/lib/useCmsData';

const HERO_BG =
  '/images/8.jpeg';

const SOCIAL_LINKS = [
  { href: 'https://www.facebook.com', label: 'Facebook', icon: 'facebook' },
  { href: 'https://x.com/women_s24642', label: 'X (Twitter)', icon: 'twitter' },
  { href: 'https://www.instagram.com/womensrightsfirst/', label: 'Instagram', icon: 'instagram' },
  { href: 'https://www.linkedin.com/company/women-s-rights-first-wrf', label: 'LinkedIn', icon: 'linkedin' },
];

const QUOTE_IMAGE = '/images/Hanifa_Girowal.jpeg';

function SocialIcon({ name }: { name: string }) {
  const cls = 'h-6 w-6';
  switch (name) {
    case 'facebook':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      );
    case 'twitter':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
        </svg>
      );
    case 'instagram':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect width="4" height="12" x="2" y="9" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      );
    default:
      return null;
  }
}

export default function ContactPage() {
  const { t } = useTranslation();
  const adminFooter = useCmsData<Record<string, any>>('footer');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    try {
      await fetch('/api/submit/contact-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: contactName, email: contactEmail, subject: contactSubject, message: contactMessage }),
      });
      setFormStatus('success');
      setContactName('');
      setContactEmail('');
      setContactSubject('');
      setContactMessage('');
    } catch {
      setFormStatus('error');
    }
  };

  const phoneNumber = adminFooter?.phone || '+31 6 24578072';
  const phoneHref = `tel:${phoneNumber.replace(/\s/g, '')}`;
  const whatsappNumber = adminFooter?.phone ? adminFooter.phone.replace(/[^0-9]/g, '') : '31624578072';

  const socialLinks = adminFooter?.socialLinks && Array.isArray(adminFooter.socialLinks) && adminFooter.socialLinks.length > 0
    ? adminFooter.socialLinks.map((s: any) => ({
        href: s.url || s.href || '#',
        label: s.platform || s.label || '',
        icon: (s.platform || s.label || '').toLowerCase(),
      }))
    : SOCIAL_LINKS;

  return (
    <div className="bg-white">
      {/* Hero */}
      <section
        className="relative overflow-hidden bg-cover bg-center py-20 md:py-32"
        style={{ backgroundImage: `url(${HERO_BG})` }}
      >
        <div className="absolute inset-0 bg-black/60" aria-hidden />
        <div className="hidden md:block absolute top-0 right-0 h-full w-2/5 bg-cover bg-center opacity-90" style={{ clipPath: 'polygon(0% 100%, 100% 0%, 100% 100%)', backgroundImage: `url(${HERO_BG})` }} />
        <div className="relative z-10 mx-auto max-w-7xl px-4 text-left sm:px-6 lg:px-8">
          <div className="inline-block bg-wrf-purple px-8 py-6">
            <h1 className="mb-4 text-4xl font-bold text-white lg:text-6xl">
              {t('contact.hero.title')}
            </h1>
            <p className="max-w-3xl text-xl leading-relaxed text-white/90">
              {t('contact.hero.description')}
            </p>
          </div>
        </div>
      </section>

      {/* Quote section - desktop only */}
      <section className="hidden bg-gray-50 py-20 lg:block">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-wrf-black p-8">
            <div className="grid min-h-[320px] items-center gap-0 lg:grid-cols-3">
              <div className="flex flex-col justify-center pr-8 text-white lg:col-span-2">
                <div className="relative">
                  <span className="-mb-2 block text-6xl font-serif font-bold text-wrf-coral">&quot;</span>
                  <blockquote className="ml-8 mb-2 text-xl leading-relaxed">
                    {t('contact.quote')}
                  </blockquote>
                  <div className="-mt-2 text-right">
                    <span className="block text-6xl font-serif font-bold text-wrf-coral">&quot;</span>
                  </div>
                </div>
                <div className="ml-8 mt-4 bg-wrf-coral p-4">
                  <p className="text-lg font-bold text-white">{t('contact.quote.author')}</p>
                  <p className="font-body text-white/90">{t('contact.quote.role')}</p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -left-8 top-1/2 h-0.5 w-8 -translate-y-1/2 bg-wrf-coral" aria-hidden />
                <div className="bg-wrf-coral p-2">
                  <img
                    src={QUOTE_IMAGE}
                    alt="Sanga Siddiqi"
                    className="h-64 w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact cards */}
      <section className="bg-white py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Our Location */}
            <div className="flex h-80 flex-col justify-center bg-wrf-black p-8 text-white">
              <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-6 h-12 w-12">
                  <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <h3 className="mb-6 text-xl font-bold">{t('contact.location.title')}</h3>
                <div className="space-y-4 font-body">
                  <p className="text-sm leading-relaxed">
                    {t('contact.location.address')}
                  </p>
                  <div className="border-t border-white/20 pt-4">
                    <div className="mb-2 flex items-center justify-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                        <rect width="20" height="16" x="2" y="4" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                      <span className="text-sm font-medium">{t('contact.email.title')}</span>
                    </div>
                    <a href="mailto:info@womenrf.org" className="block text-sm transition-colors hover:text-wrf-coral">
                      {t('contact.email.address')}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Call or Message */}
            <div className="flex h-80 flex-col justify-center bg-wrf-purple p-8 text-white">
              <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-6 h-12 w-12">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <h3 className="mb-6 text-xl font-bold">{t('contact.phone.title')}</h3>
                <div className="space-y-4 font-body">
                  <p className="text-sm">{adminFooter?.phone || t('contact.phone.number')}</p>
                  <div className="space-y-3 pt-4">
                    <a
                      href={phoneHref}
                      className="inline-flex w-full items-center justify-center gap-1 rounded-none border border-white/30 bg-white/20 py-2 text-sm font-medium text-white transition-colors hover:bg-white/30"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2 h-4 w-4">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                      {t('contact.phone.call')}
                    </a>
                    <a
                      href={`https://wa.me/${whatsappNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-1 rounded-none bg-green-600 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2 h-4 w-4">
                        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                      </svg>
                      {t('contact.phone.whatsapp')}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Need Answers? */}
            <div className="flex h-80 flex-col justify-center bg-wrf-coral p-8 text-white">
              <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-6 h-12 w-12">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <path d="M12 17h.01" />
                </svg>
                <h3 className="mb-6 text-xl font-bold">{t('contact.faq.title')}</h3>
                <div className="space-y-4 font-body">
                  <p className="text-sm leading-relaxed">
                    {t('contact.faq.description')}
                  </p>
                  <Link
                    href="/FAQ"
                    className="mt-6 inline-flex w-full items-center justify-center gap-1 rounded-none border border-white/30 bg-white/20 py-2 text-sm font-medium text-white transition-colors hover:bg-white/30"
                  >
                    {t('contact.faq.link')}
                  </Link>
                </div>
              </div>
            </div>

            {/* Follow Us */}
            <div className="flex h-80 flex-col justify-center bg-wrf-footer-mauve p-8 text-white">
              <div className="text-center">
                <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-8 w-8">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </div>
                <h3 className="mb-6 text-xl font-bold">{t('contact.social.title')}</h3>
                <div className="space-y-4 font-body">
                  <p className="mb-6 text-sm leading-relaxed">{t('contact.social.description')}</p>
                  <div className="grid grid-cols-2 gap-4">
                    {socialLinks.map((s: any) => (
                      <a
                        key={s.label}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center bg-white/20 p-3 transition-colors hover:bg-white/30"
                        aria-label={s.label}
                      >
                        <SocialIcon name={s.icon} />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="bg-gray-50 py-12 md:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-left">
            <div className="inline-block bg-wrf-purple px-6 py-4">
              <h2 className="text-3xl font-bold text-white">{t('contact.form.title') || 'Send Us a Message'}</h2>
            </div>
            <p className="mt-4 text-lg text-gray-600">{t('contact.form.description') || 'Fill out the form below and we will get back to you as soon as possible.'}</p>
          </div>
          {formStatus === 'success' && (
            <div className="mb-6 bg-green-50 border border-green-200 p-4 text-green-800 text-sm">
              {t('contact.form.success') || 'Thank you! Your message has been sent successfully.'}
            </div>
          )}
          {formStatus === 'error' && (
            <div className="mb-6 bg-red-50 border border-red-200 p-4 text-red-800 text-sm">
              {t('contact.form.error') || 'Something went wrong. Please try again.'}
            </div>
          )}
          <form onSubmit={handleContactSubmit} className="space-y-6 bg-white p-8 shadow-xl">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="contact-name" className="text-sm font-medium">{t('contact.form.name') || 'Full Name'} *</label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="mt-1 h-10 w-full rounded-none border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-wrf-purple focus:ring-offset-0"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="text-sm font-medium">{t('contact.form.email') || 'Email'} *</label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="mt-1 h-10 w-full rounded-none border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-wrf-purple focus:ring-offset-0"
                />
              </div>
            </div>
            <div>
              <label htmlFor="contact-subject" className="text-sm font-medium">{t('contact.form.subject') || 'Subject'} *</label>
              <input
                id="contact-subject"
                type="text"
                required
                value={contactSubject}
                onChange={(e) => setContactSubject(e.target.value)}
                className="mt-1 h-10 w-full rounded-none border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-wrf-purple focus:ring-offset-0"
              />
            </div>
            <div>
              <label htmlFor="contact-message" className="text-sm font-medium">{t('contact.form.message') || 'Message'} *</label>
              <textarea
                id="contact-message"
                required
                rows={6}
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                className="mt-1 w-full rounded-none border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-wrf-purple focus:ring-offset-0"
              />
            </div>
            <button
              type="submit"
              disabled={formStatus === 'submitting'}
              className="inline-flex w-full items-center justify-center rounded-none bg-wrf-purple py-3 text-base font-semibold text-white transition-colors hover:bg-wrf-purple-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              {formStatus === 'submitting'
                ? (t('contact.form.submitting') || 'Sending...')
                : (t('contact.form.send') || 'Send Message')}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
