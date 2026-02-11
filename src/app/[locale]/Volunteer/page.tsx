'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/TranslationContext';

const HERO_BG =
  '/images/7.jpeg';

function RoleIcon({ name }: { name: string }) {
  const cls = 'mb-4 h-12 w-12';
  switch (name) {
    case 'calendar':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" />
        </svg>
      );
    case 'megaphone':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <path d="m3 11 18-5v12L3 14v-3z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
        </svg>
      );
    case 'book':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <path d="M12 7v14" /><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
        </svg>
      );
    case 'target':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
        </svg>
      );
    case 'users':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case 'heart':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <path d="M11 14h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 16" />
          <path d="m7 20 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9" />
          <path d="m2 15 6 6" />
          <path d="M19.5 8.5c.7-.7 1.5-1.6 1.5-2.7A2.73 2.73 0 0 0 16 4a2.78 2.78 0 0 0-5 1.8c0 1.2.8 2 1.5 2.8L16 12Z" />
        </svg>
      );
    default:
      return null;
  }
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21.801 10A10 10 0 1 1 17 3.335" /><path d="m9 11 3 3L22 4" />
    </svg>
  );
}

export default function VolunteerPage() {
  const { t } = useTranslation();

  const [adminData, setAdminData] = useState<Record<string, any> | null>(null);
  const [testimonialData, setTestimonialData] = useState<Record<string, any> | null>(null);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  useEffect(() => {
    fetch('/api/data/volunteers', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => { if (d && Object.keys(d).length > 0) setAdminData(d); })
      .catch(() => {});
    fetch('/api/data/testimonials', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => { if (d && Object.keys(d).length > 0) setTestimonialData(d); })
      .catch(() => {});
  }, []);

  const SCROLL_LINKS = [
    { label: t('volunteer.nav.why'), id: 'why-volunteer' },
    { label: t('volunteer.nav.roles'), id: 'volunteer-roles' },
    { label: t('volunteer.nav.testimonials'), id: 'testimonials' },
    { label: t('volunteer.nav.apply'), id: 'application-form' },
  ];

  const ROLES = [
    {
      title: t('volunteer.roles.events'),
      description: t('volunteer.roles.eventsDesc'),
      bg: 'bg-wrf-purple',
      icon: 'calendar',
    },
    {
      title: t('volunteer.roles.comms'),
      description: t('volunteer.roles.commsDesc'),
      bg: 'bg-wrf-coral',
      icon: 'megaphone',
    },
    {
      title: t('volunteer.roles.admin'),
      description: t('volunteer.roles.adminDesc'),
      bg: 'bg-wrf-coral',
      icon: 'book',
    },
    {
      title: t('volunteer.roles.adminFull'),
      description: t('volunteer.roles.adminFullDesc'),
      bg: 'bg-wrf-black',
      icon: 'target',
    },
    {
      title: t('volunteer.roles.program'),
      description: t('volunteer.roles.programDesc'),
      bg: 'bg-wrf-black',
      icon: 'users',
    },
    {
      title: t('volunteer.roles.engagement'),
      description: t('volunteer.roles.engagementDesc'),
      bg: 'bg-wrf-coral',
      icon: 'users',
    },
    {
      title: t('volunteer.roles.special'),
      description: t('volunteer.roles.specialDesc'),
      bg: 'bg-wrf-coral',
      icon: 'heart',
    },
  ];

  const TESTIMONIALS = [
    {
      quote: t('volunteer.testimonials.1'),
      name: t('volunteer.testimonials.1.author'),
      role: t('volunteer.testimonials.1.role'),
      bg: 'bg-wrf-black',
      image: null,
    },
    {
      quote: t('volunteer.testimonials.2'),
      name: t('volunteer.testimonials.2.author'),
      role: t('volunteer.testimonials.2.role'),
      bg: 'bg-wrf-coral',
      image: null,
    },
    {
      quote: t('volunteer.testimonials.3'),
      name: t('volunteer.testimonials.3.author'),
      role: t('volunteer.testimonials.3.role'),
      bg: 'bg-wrf-purple',
      image: null,
    },
  ];

  const WE_PROVIDE = [
    t('volunteer.commitment.training'),
    t('volunteer.commitment.coordinator'),
    t('volunteer.commitment.flexible'),
    t('volunteer.commitment.recognition'),
    t('volunteer.commitment.safe'),
    t('volunteer.commitment.events'),
  ];

  const AREAS_OF_INTEREST = [
    t('volunteer.form.eventSupport'),
    t('volunteer.form.programAssistance'),
    t('volunteer.form.adminOffice'),
    t('volunteer.form.fundraising'),
    t('volunteer.form.communications'),
    t('volunteer.form.other'),
  ];

  const HOURS_OPTIONS = [
    t('volunteer.form.hours1'),
    t('volunteer.form.hours2'),
    t('volunteer.form.hours3'),
    t('volunteer.form.hours4'),
  ];

  const [step, setStep] = useState(1);
  const totalSteps = 3;
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [contactMethod, setContactMethod] = useState<'Email' | 'Phone'>('Email');
  const [areasOfInterest, setAreasOfInterest] = useState<string[]>([]);
  const [otherInterest, setOtherInterest] = useState('');
  const [skills, setSkills] = useState('');
  const [hoursPerWeek, setHoursPerWeek] = useState('');
  const [commitmentType, setCommitmentType] = useState<'one-off' | 'ongoing'>('ongoing');
  const [motivation, setMotivation] = useState('');
  const [hearAbout, setHearAbout] = useState('');
  const [consent, setConsent] = useState(false);

  const isPersonalInfoComplete =
    fullName.trim() !== '' &&
    email.trim() !== '' &&
    city.trim() !== '' &&
    country.trim() !== '';

  const isInterestsStepComplete =
    areasOfInterest.length > 0 &&
    hoursPerWeek.trim() !== '';

  const isMotivationStepComplete =
    motivation.trim() !== '' &&
    consent === true;

  const toggleArea = (area: string) => {
    setAreasOfInterest((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-white">
      {/* Hero */}
      <section
        className="relative overflow-hidden bg-cover bg-center py-20 md:py-32"
        style={{ backgroundImage: `url(${HERO_BG})` }}
      >
        <div className="hidden md:block absolute top-0 right-0 h-full w-2/5 bg-cover bg-center opacity-90" style={{ clipPath: 'polygon(0% 100%, 100% 0%, 100% 100%)', backgroundImage: `url(${HERO_BG})` }} />
        <div className="relative z-10 mx-auto max-w-7xl px-4 text-left sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="bg-wrf-coral px-8 py-6">
              <h1 className="mb-4 text-4xl font-bold text-white lg:text-5xl">
                {t('volunteer.hero.title')}
              </h1>
              <p className="text-xl leading-relaxed text-white/90">
                {t('volunteer.hero.description')}
              </p>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
              {SCROLL_LINKS.map(({ label, id }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => scrollTo(id)}
                  className="bg-wrf-coral px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-wrf-coral-light"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Volunteer */}
      <section id="why-volunteer" className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 text-left sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="mb-4 inline-block bg-wrf-purple px-6 py-4">
              <h2 className="text-4xl font-bold text-white">{t('volunteer.why.title')}</h2>
            </div>
            <p className="text-lg text-gray-600">
              {t('volunteer.why.description')}
            </p>
          </div>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p>
              {t('volunteer.why.detail')}
            </p>
            <ul>
              <li><strong>{t('volunteer.why.impact')}</strong></li>
              <li><strong>{t('volunteer.why.experience')}</strong></li>
              <li><strong>{t('volunteer.why.community')}</strong></li>
              <li><strong>{t('volunteer.why.growth')}</strong></li>
            </ul>
          </div>
        </div>
      </section>

      {/* Volunteer Roles */}
      <section id="volunteer-roles" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 text-left sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="mb-4 inline-block bg-wrf-coral px-6 py-4">
              <h2 className="text-4xl font-bold text-white">{t('volunteer.roles.title')}</h2>
            </div>
            <p className="text-lg text-gray-600">
              {t('volunteer.roles.description')}
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {(adminData?.roles && Array.isArray(adminData.roles) && adminData.roles.length > 0
              ? adminData.roles.map((r: any) => ({
                  title: r.title,
                  description: r.description,
                  bg: r.colorClass || 'bg-wrf-purple',
                  icon: r.iconName || 'users',
                }))
              : ROLES
            ).map((role: any) => (
              <div key={role.icon + role.bg + role.title} className={`${role.bg} p-8 text-white`}>
                <RoleIcon name={role.icon} />
                <h3 className="mb-3 text-xl font-bold">{role.title}</h3>
                <p className="text-sm leading-relaxed opacity-90">{role.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 text-left sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="mb-4 inline-block bg-wrf-black px-6 py-4">
              <h2 className="text-4xl font-bold text-white">{t('volunteer.testimonials.title')}</h2>
            </div>
            <p className="text-lg text-gray-600">{t('volunteer.testimonials.description')}</p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {(testimonialData?.testimonials && testimonialData.testimonials.length > 0
              ? testimonialData.testimonials.map((t: any, i: number) => ({
                  quote: t.quote,
                  name: t.authorName,
                  role: t.authorRole || '',
                  bg: ['bg-wrf-black', 'bg-wrf-coral', 'bg-wrf-purple'][i % 3],
                  image: t.authorImageUrl || null,
                }))
              : TESTIMONIALS
            ).map((testimonial: any) => (
              <div key={testimonial.name} className={`${testimonial.bg} p-8 text-white shadow-lg`}>
                <div className="mb-6">
                  <p className="text-lg italic leading-relaxed">&quot;{testimonial.quote}&quot;</p>
                </div>
                <div className="flex items-center gap-4">
                  {testimonial.image && (
                    <img src={testimonial.image} alt={testimonial.name} className="h-12 w-12 rounded-full object-cover" />
                  )}
                  <div>
                    <p className="font-bold">{testimonial.name}</p>
                    <p className="text-sm opacity-90">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commitment */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="mb-8 text-left">
                <div className="mb-4 inline-block bg-wrf-footer-mauve px-6 py-4 text-white">
                  <h2 className="text-4xl font-bold">{t('volunteer.commitment.title')}</h2>
                </div>
                <p className="text-lg text-gray-600">{t('volunteer.commitment.subtitle')}</p>
              </div>
              <div className="prose prose-lg max-w-none text-gray-700">
                <p>{t('volunteer.commitment.description')}</p>
                <p>{t('volunteer.commitment.detail')}</p>
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="border-l-4 border-wrf-footer-mauve bg-gray-50 p-8">
                <h3 className="mb-6 text-xl font-bold text-wrf-black">{t('volunteer.commitment.provide')}</h3>
                <div className="space-y-4">
                  {WE_PROVIDE.map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-wrf-footer-mauve" />
                      <span className="text-sm leading-relaxed text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="application-form" className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-12 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <div className="mb-6 bg-wrf-coral px-6 py-5">
                <h2 className="font-heading text-3xl font-bold leading-tight text-white md:text-4xl">
                  {t('volunteer.apply.title')}
                </h2>
              </div>
              <p className="font-body mb-4 text-lg font-semibold text-gray-800">
                {t('volunteer.apply.subtitle')}
              </p>
              <div className="font-body space-y-3 text-base leading-relaxed text-gray-700">
                <p>
                  {t('volunteer.apply.description')}
                </p>
                <p>
                  {t('volunteer.apply.timeline')}
                </p>
              </div>
            </div>
            <div className="lg:col-span-3">
              <div className="bg-white p-8 shadow-xl">
                {/* Step indicator */}
                <div className="mb-8">
                  <div className="flex items-start justify-between gap-2">
                    {[
                      { n: 1, title: t('volunteer.form.personalInfo'), subtitle: t('volunteer.apply.step1.desc') },
                      { n: 2, title: t('volunteer.form.interests'), subtitle: t('volunteer.apply.step2.desc') },
                      { n: 3, title: t('volunteer.form.motivation'), subtitle: t('volunteer.apply.step3.desc') },
                    ].map(({ n, title, subtitle }) => {
                      const isActive = step === n;
                      const isPast = step > n;
                      const isPurple = isActive || isPast;
                      return (
                        <div key={n} className="flex flex-1 flex-col items-center">
                          <div className="flex w-full items-center">
                            {n > 1 && (
                              <div
                                className={`h-0.5 flex-1 ${isPast ? 'bg-wrf-purple' : 'bg-gray-200'}`}
                                aria-hidden
                              />
                            )}
                            <div
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-semibold ${isPurple ? 'bg-wrf-purple text-white' : 'bg-gray-200 text-gray-500'}`}
                            >
                              {isPast ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              ) : (
                                n
                              )}
                            </div>
                            {n < 3 && (
                              <div
                                className={`h-0.5 flex-1 ${isPast ? 'bg-wrf-purple' : 'bg-gray-200'}`}
                                aria-hidden
                              />
                            )}
                          </div>
                          <div className="mt-2 text-center">
                            <p className={`text-sm font-bold ${isPurple ? 'text-wrf-purple' : 'text-gray-600'}`}>
                              {title}
                            </p>
                            <p className="text-xs text-gray-500">{subtitle}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {formStatus === 'success' && (
                  <div className="mb-6 bg-green-50 border border-green-200 p-4 text-green-800 text-sm">
                    {t('volunteer.form.successMessage') || 'Thank you! Your volunteer application has been submitted successfully.'}
                  </div>
                )}
                {formStatus === 'error' && (
                  <div className="mb-6 bg-red-50 border border-red-200 p-4 text-red-800 text-sm">
                    {t('volunteer.form.errorMessage') || 'Something went wrong. Please try again.'}
                  </div>
                )}
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setFormStatus('submitting');
                    try {
                      const formData = {
                        fullName,
                        email,
                        phone,
                        city,
                        country,
                        contactMethod,
                        areasOfInterest,
                        otherInterest,
                        skills,
                        hoursPerWeek,
                        commitmentType,
                        motivation,
                        hearAbout,
                      };
                      await fetch('/api/submit/volunteer-applications', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(formData),
                      });
                      setFormStatus('success');
                    } catch {
                      setFormStatus('error');
                    }
                  }}
                  className="space-y-6"
                >
                  {step === 1 && (
                    <>
                      <div>
                        <h3 className="font-heading mb-6 text-2xl font-bold text-wrf-purple">{t('volunteer.form.personalInfo')}</h3>
                        <div className="grid gap-6 md:grid-cols-2">
                          <div className="space-y-1">
                            <label htmlFor="fullName" className="font-body text-sm font-medium text-gray-800">{t('volunteer.form.fullName')} *</label>
                            <input
                              id="fullName"
                              type="text"
                              required
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              className="h-11 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-wrf-purple focus:outline-none focus:ring-1 focus:ring-wrf-purple"
                            />
                          </div>
                          <div className="space-y-1">
                            <label htmlFor="email" className="font-body text-sm font-medium text-gray-800">{t('volunteer.form.email')} *</label>
                            <input
                              id="email"
                              type="email"
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="h-11 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-wrf-purple focus:outline-none focus:ring-1 focus:ring-wrf-purple"
                            />
                          </div>
                        </div>
                        <div className="mt-4 grid gap-6 md:grid-cols-2">
                          <div className="space-y-1">
                            <label htmlFor="phone" className="font-body text-sm font-medium text-gray-800">{t('volunteer.form.phone')}</label>
                            <input
                              id="phone"
                              type="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              className="h-11 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-wrf-purple focus:outline-none focus:ring-1 focus:ring-wrf-purple"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="font-body text-sm font-medium text-gray-800">{t('volunteer.form.contactMethod')}</label>
                            <div className="flex gap-6 pt-2">
                              <label className="flex cursor-pointer items-center gap-2">
                                <input
                                  type="radio"
                                  name="contactMethod"
                                  value="Email"
                                  checked={contactMethod === 'Email'}
                                  onChange={() => setContactMethod('Email')}
                                  className="h-4 w-4 border-gray-300 text-wrf-purple focus:ring-wrf-purple"
                                />
                                <span className="text-sm text-gray-700">{t('volunteer.form.contactEmail')}</span>
                              </label>
                              <label className="flex cursor-pointer items-center gap-2">
                                <input
                                  type="radio"
                                  name="contactMethod"
                                  value="Phone"
                                  checked={contactMethod === 'Phone'}
                                  onChange={() => setContactMethod('Phone')}
                                  className="h-4 w-4 border-gray-300 text-wrf-purple focus:ring-wrf-purple"
                                />
                                <span className="text-sm text-gray-700">{t('volunteer.form.contactPhone')}</span>
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 grid gap-6 md:grid-cols-2">
                          <div className="space-y-1">
                            <label htmlFor="city" className="font-body text-sm font-medium text-gray-800">{t('volunteer.form.city')} *</label>
                            <input
                              id="city"
                              type="text"
                              required
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                              className="h-11 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-wrf-purple focus:outline-none focus:ring-1 focus:ring-wrf-purple"
                            />
                          </div>
                          <div className="space-y-1">
                            <label htmlFor="country" className="font-body text-sm font-medium text-gray-800">{t('volunteer.form.country')} *</label>
                            <input
                              id="country"
                              type="text"
                              required
                              value={country}
                              onChange={(e) => setCountry(e.target.value)}
                              className="h-11 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-wrf-purple focus:outline-none focus:ring-1 focus:ring-wrf-purple"
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  {step === 2 && (
                    <div className="space-y-6">
                      <h3 className="font-heading text-2xl font-bold text-wrf-purple">{t('volunteer.form.interests')}</h3>
                      <div>
                        <label className="font-body mb-2 block text-sm font-medium text-gray-800">{t('volunteer.form.areasOfInterest')} *</label>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                          {AREAS_OF_INTEREST.map((area) => {
                            const selected = areasOfInterest.includes(area);
                            return (
                              <label
                                key={area}
                                className={`relative flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2.5 text-sm font-medium transition-colors ${
                                  selected
                                    ? 'border-gray-300 bg-gray-100 text-gray-800'
                                    : 'border-gray-300 bg-white text-gray-900 hover:bg-gray-50'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={selected}
                                  onChange={() => toggleArea(area)}
                                  className="sr-only"
                                />
                                {!selected && (
                                  <span className="h-4 w-4 shrink-0 rounded border-2 border-gray-400 bg-white" aria-hidden />
                                )}
                                <span className={selected ? 'pr-6' : ''}>{area}</span>
                                {selected && (
                                  <span className="absolute right-2 top-2 flex items-center justify-center text-wrf-purple" aria-hidden>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                                      <path d="M21.801 10A10 10 0 1 1 17 3.335" />
                                      <path d="m9 11 3 3L22 4" />
                                    </svg>
                                  </span>
                                )}
                              </label>
                            );
                          })}
                        </div>
                        {areasOfInterest.includes(t('volunteer.form.other')) && (
                          <input
                            type="text"
                            placeholder={t('volunteer.form.otherPlaceholder')}
                            value={otherInterest}
                            onChange={(e) => setOtherInterest(e.target.value)}
                            className="mt-3 h-11 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-wrf-purple focus:outline-none focus:ring-1 focus:ring-wrf-purple"
                          />
                        )}
                      </div>
                      <div>
                        <label htmlFor="skills" className="font-body mb-2 block text-sm font-medium text-gray-800">{t('volunteer.form.skills')}</label>
                        <textarea
                          id="skills"
                          rows={4}
                          placeholder={t('volunteer.form.skillsPlaceholder')}
                          value={skills}
                          onChange={(e) => setSkills(e.target.value)}
                          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-wrf-purple focus:outline-none focus:ring-1 focus:ring-wrf-purple"
                        />
                      </div>
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                          <label htmlFor="hours" className="font-body block text-sm font-medium text-gray-800">{t('volunteer.form.hours')}</label>
                          <select
                            id="hours"
                            value={hoursPerWeek}
                            onChange={(e) => setHoursPerWeek(e.target.value)}
                            className="h-11 w-full appearance-none rounded-md border border-wrf-purple bg-white px-3 py-2 text-sm text-gray-700 focus:border-wrf-purple focus:outline-none focus:ring-1 focus:ring-wrf-purple"
                          >
                            <option value="">{t('volunteer.form.hoursPlaceholder')}</option>
                            {HOURS_OPTIONS.map((opt) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="font-body block text-sm font-medium text-gray-800">{t('volunteer.form.commitmentType')}</label>
                          <div className="flex flex-wrap items-center gap-6 pt-0">
                            <label className="flex cursor-pointer items-center gap-2">
                              <input
                                type="radio"
                                name="commitmentType"
                                checked={commitmentType === 'one-off'}
                                onChange={() => setCommitmentType('one-off')}
                                className="h-4 w-4 border-gray-300 text-wrf-purple focus:ring-wrf-purple"
                              />
                              <span className="text-sm text-gray-700">{t('volunteer.form.oneOff')}</span>
                            </label>
                            <label className="flex cursor-pointer items-center gap-2">
                              <input
                                type="radio"
                                name="commitmentType"
                                checked={commitmentType === 'ongoing'}
                                onChange={() => setCommitmentType('ongoing')}
                                className="h-4 w-4 border-gray-300 text-wrf-purple focus:ring-wrf-purple"
                              />
                              <span className="text-sm text-gray-700">{t('volunteer.form.ongoing')}</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {step === 3 && (
                    <div className="space-y-6">
                      <h3 className="font-heading text-2xl font-bold text-wrf-purple">{t('volunteer.form.motivation')}</h3>
                      <div>
                        <label htmlFor="motivation" className="font-body mb-2 block text-sm font-medium text-gray-800">{t('volunteer.form.whyVolunteer')} *</label>
                        <textarea
                          id="motivation"
                          rows={4}
                          required={step === 3}
                          placeholder={t('volunteer.form.whyPlaceholder')}
                          value={motivation}
                          onChange={(e) => setMotivation(e.target.value)}
                          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-wrf-purple focus:outline-none focus:ring-1 focus:ring-wrf-purple"
                        />
                      </div>
                      <div>
                        <label htmlFor="hearAbout" className="font-body mb-2 block text-sm font-medium text-gray-800">{t('volunteer.form.howHeard')}</label>
                        <input
                          id="hearAbout"
                          type="text"
                          placeholder={t('volunteer.form.howHeardPlaceholder')}
                          value={hearAbout}
                          onChange={(e) => setHearAbout(e.target.value)}
                          className="h-11 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-wrf-purple focus:outline-none focus:ring-1 focus:ring-wrf-purple"
                        />
                      </div>
                      <div className="rounded-md bg-amber-50/80 p-4">
                        <label className="flex cursor-pointer items-start gap-3">
                          <input
                            type="checkbox"
                            required
                            checked={consent}
                            onChange={(e) => setConsent(e.target.checked)}
                            className="mt-1 h-4 w-4 rounded border-gray-300 text-wrf-purple focus:ring-wrf-purple"
                          />
                          <span className="font-body text-sm text-gray-800">
                            {t('volunteer.form.consent')} *
                          </span>
                        </label>
                      </div>
                    </div>
                  )}

                  <div className="mt-8 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep((s) => Math.max(1, s - 1))}
                      disabled={step === 1}
                      className="flex items-center gap-2 rounded-md border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                        <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
                      </svg>
                      {t('volunteer.form.previous')}
                    </button>
                    {step < totalSteps ? (
                      <button
                        type="button"
                        onClick={() => setStep((s) => s + 1)}
                        disabled={
                          (step === 1 && !isPersonalInfoComplete) ||
                          (step === 2 && !isInterestsStepComplete)
                        }
                        className="flex items-center gap-2 rounded-md bg-wrf-purple px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-wrf-purple-dark disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-wrf-purple"
                      >
                        {t('volunteer.form.next')}
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                          <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                        </svg>
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={!isMotivationStepComplete || formStatus === 'submitting'}
                        className="flex items-center gap-2 rounded-md bg-wrf-coral px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-wrf-coral-light disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-wrf-coral"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                          <path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" />
                        </svg>
                        {t('volunteer.form.submit')}
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
