'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

const APPLICATION_LINK = 'https://docs.google.com/forms/d/e/1FAIpQLSeIOe382YD2bmhV1lAQ1kEg5Qw3ax4QHA7thUr8arI0yw-utQ/viewform';

export default function FellowshipPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  return (
    <div className="bg-white min-h-screen">

      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-wrf-purple via-[#7d6aa5] to-wrf-coral overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>
        <div className="relative max-w-5xl mx-auto px-6 py-20 md:py-28 text-center">
          <div className="inline-block bg-white/20 backdrop-blur-sm text-white text-sm font-semibold tracking-widest uppercase px-4 py-2 rounded-full mb-6">
            2026 Cohort
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-6">
            Digital Futures Fellowship
            <span className="block text-[#f5d0d0] text-2xl md:text-3xl font-medium mt-2">
              for Afghan Women and Girls
            </span>
          </h1>
          <p className="text-white/90 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-4">
            Women&apos;s Rights First is pleased to launch the Digital Futures Fellowship for Afghan Women and Girls inside Afghanistan.
          </p>
          <p className="text-white/80 text-base md:text-lg max-w-3xl mx-auto leading-relaxed mb-10">
            This four-month online fellowship will run from July 2026 to October 2026 and is designed to equip Afghan women and girls with practical digital skills in content creation, AI tools, website development, digital marketing, and online entrepreneurship.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={APPLICATION_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white text-wrf-purple font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              Apply Now
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <button
              onClick={() => document.getElementById('eligibility')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center justify-center gap-2 border-2 border-white text-white font-semibold px-8 py-4 rounded-full hover:bg-white/10 transition-all duration-200"
            >
              Check Eligibility
            </button>
          </div>
        </div>
      </section>

      {/* Timeline Banner */}
      <section className="bg-wrf-purple text-white">
        <div className="max-w-5xl mx-auto px-6 py-5 flex flex-wrap justify-center gap-x-10 gap-y-3 text-center text-sm font-medium">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-wrf-coral inline-block" />
            Fellowship runs: <strong className="ml-1">July – October 2026</strong>
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-300 inline-block" />
            Applications open: <strong className="ml-1">May 3, 2026</strong>
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-yellow-300 inline-block" />
            Applications close: <strong className="ml-1">May 30, 2026</strong>
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-300 inline-block" />
            Fellows notified: <strong className="ml-1">End of June 2026</strong>
          </span>
        </div>
      </section>

      {/* What Fellows Receive */}
      <section className="py-16 md:py-24 bg-[#f9f7ff]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-wrf-purple mb-4">Selected Fellows Will Receive</h2>
            <p className="text-wrf-gray-text max-w-2xl mx-auto">
              This fellowship is fully funded and provides comprehensive support to ensure your success throughout the program.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                ),
                title: 'Practical Digital Skills Training',
                desc: 'Hands-on training in content creation, AI tools, website development, digital marketing, and online entrepreneurship.',
                color: 'bg-wrf-purple',
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
                title: 'Mentorship & Technical Support',
                desc: 'Guidance from experienced mentors and dedicated technical support throughout the fellowship.',
                color: 'bg-wrf-coral',
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                  </svg>
                ),
                title: 'Internet / Connectivity Support',
                desc: 'Where needed, internet and connectivity support will be provided to ensure full participation.',
                color: 'bg-[#7d6aa5]',
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: 'Small Grants Opportunity',
                desc: 'Opportunity to apply for small grants to launch pilot digital projects at the end of the fellowship.',
                color: 'bg-wrf-footer-mauve',
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex gap-4 hover:shadow-md transition-shadow duration-200">
                <div className={`${item.color} text-white rounded-xl p-3 h-fit flex-shrink-0`}>
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-bold text-wrf-black text-lg mb-2">{item.title}</h3>
                  <p className="text-wrf-gray-text text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility */}
      <section id="eligibility" className="py-16 md:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-wrf-coral/10 text-wrf-coral text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full mb-4">
                Who Can Apply
              </div>
              <h2 className="text-2xl md:text-4xl font-bold text-wrf-purple mb-6">Eligibility Requirements</h2>
              <ul className="space-y-4">
                {[
                  'Must currently reside inside Afghanistan',
                  'Must be at least 18 years old',
                  'Must be Afghan women or girls',
                  'Must have intermediate English skills',
                  'Must be able to participate fully in online sessions from July–October 2026',
                ].map((req) => (
                  <li key={req} className="flex items-start gap-3">
                    <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-wrf-purple/10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-wrf-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-wrf-black leading-relaxed">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-center">
              <div className="relative max-w-sm w-full">
                <Image
                  src="/images/fellowship-eligibility.png"
                  alt="Eligibility Requirements"
                  width={500}
                  height={500}
                  className="rounded-2xl shadow-xl w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Apply */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-[#f9f7ff] to-[#fff0f0]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-wrf-purple mb-4">How to Apply?</h2>
            <p className="text-wrf-gray-text max-w-xl mx-auto">
              Applications are open now. Apply before May 30, 2026 to be considered for the 2026 cohort.
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
            {/* QR Code card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center gap-5 max-w-xs w-full border border-gray-100">
              <div className="text-wrf-purple font-bold text-lg">Scan the QR Code</div>
              <Image
                src="/images/fellowship-how-to-apply.png"
                alt="QR Code to apply"
                width={220}
                height={220}
                className="rounded-xl"
              />
              <p className="text-wrf-gray-text text-sm text-center">Scan with your phone camera to open the application form</p>
            </div>

            {/* Divider */}
            <div className="flex md:flex-col items-center gap-3 text-wrf-gray-text font-semibold">
              <div className="flex-1 h-px md:h-16 md:w-px w-16 bg-gray-200" />
              <span className="bg-white border border-gray-200 rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold text-wrf-purple shadow-sm">
                OR
              </span>
              <div className="flex-1 h-px md:h-16 md:w-px w-16 bg-gray-200" />
            </div>

            {/* Link card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center gap-5 max-w-xs w-full border border-gray-100">
              <div className="text-wrf-purple font-bold text-lg">Click the Link</div>
              <div className="w-16 h-16 rounded-full bg-wrf-purple/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-wrf-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <p className="text-wrf-gray-text text-sm text-center">Access the application form directly via the link below</p>
              <a
                href={APPLICATION_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center bg-wrf-purple text-white font-bold py-3 px-6 rounded-full hover:bg-wrf-purple-dark transition-colors duration-200"
              >
                Open Application Form
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Key Dates */}
      <section className="py-16 md:py-20 bg-wrf-purple text-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-10">Important Dates</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { label: 'Applications Open', date: 'May 3, 2026', icon: '🟢', sub: 'Applications are now open!' },
              { label: 'Applications Close', date: 'May 30, 2026', icon: '🔴', sub: 'Last day to apply' },
              { label: 'Fellows Notified', date: 'End of June 2026', icon: '📬', sub: 'Final selections announced' },
            ].map((d) => (
              <div key={d.label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-3xl mb-3">{d.icon}</div>
                <div className="text-white/70 text-sm font-medium uppercase tracking-wider mb-1">{d.label}</div>
                <div className="text-white font-bold text-xl mb-2">{d.date}</div>
                <div className="text-white/60 text-xs">{d.sub}</div>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <a
              href={APPLICATION_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-wrf-purple font-bold px-10 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 text-lg"
            >
              Apply Before May 30
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* About WRF */}
      <section className="py-14 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-wrf-gray-text text-base leading-relaxed">
            The Digital Futures Fellowship is an initiative by{' '}
            <Link href="/en/About" className="text-wrf-purple font-semibold hover:underline">
              Women&apos;s Rights First (WRF)
            </Link>
            , an organization dedicated to advancing the rights, dignity, and empowerment of women and girls worldwide.
          </p>
          <p className="text-wrf-gray-text text-sm mt-4">
            For inquiries, visit{' '}
            <a href="https://www.womenrf.org" className="text-wrf-coral hover:underline" target="_blank" rel="noopener noreferrer">
              www.womenrf.org
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
