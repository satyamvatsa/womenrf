'use client';

import { useState, useEffect } from 'react';

const PARTNERS = [
  { name: 'Google', url: 'https://google.com', logo: 'https://logo.clearbit.com/google.com' },
  { name: 'Microsoft', url: 'https://microsoft.com', logo: 'https://logo.clearbit.com/microsoft.com' },
  { name: 'Salesforce', url: 'https://salesforce.com', logo: 'https://logo.clearbit.com/salesforce.com' },
  { name: 'Amazon', url: 'https://amazon.com', logo: 'https://logo.clearbit.com/amazon.com' },
  { name: 'Shopify', url: 'https://shopify.com', logo: 'https://logo.clearbit.com/shopify.com' },
  { name: 'Netflix', url: 'https://netflix.com', logo: 'https://logo.clearbit.com/netflix.com' },
  { name: 'Meta', url: 'https://meta.com', logo: 'https://logo.clearbit.com/meta.com' },
  { name: 'Slack', url: 'https://slack.com', logo: 'https://logo.clearbit.com/slack.com' },
  { name: 'Asana', url: 'https://asana.com', logo: 'https://logo.clearbit.com/asana.com' },
  { name: 'Trello', url: 'https://trello.com', logo: 'https://logo.clearbit.com/trello.com' },
];

export default function Partners() {
  const [adminData, setAdminData] = useState<Record<string, any> | null>(null);
  useEffect(() => {
    fetch('/api/data/homepage', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => { if (d && Object.keys(d).length > 0) setAdminData(d); })
      .catch(() => {});
  }, []);

  const partners = adminData?.partnersList?.length
    ? adminData.partnersList.map((p: any) => ({
        name: p.name,
        url: p.url || p.websiteUrl || '#',
        logo: p.logo || p.logoUrl || '',
      }))
    : PARTNERS;

  // Read admin settings with fallbacks
  const showPartners = adminData?.showPartners !== undefined ? adminData.showPartners : true;
  const partnersTitle = adminData?.partnersTitle || 'Our Partners & Collaborators';
  const partnersSubtitle = adminData?.partnersSubtitle || 'Working together to create lasting change';
  const partnersTitleBg = adminData?.partnersTitleBg || 'bg-primary';

  const TITLE_BG_MAP: Record<string, string> = {
    'bg-primary': 'bg-wrf-black',
    'bg-secondary': 'bg-wrf-purple',
    'bg-accent': 'bg-wrf-coral',
    'bg-support-1': 'bg-wrf-footer-mauve',
  };
  const titleBgClass = TITLE_BG_MAP[partnersTitleBg] || 'bg-wrf-black';

  if (!showPartners) return null;

  return (
    <section id="partners" className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-left">
          <div className={`mb-4 inline-block ${titleBgClass} px-8 py-6`}>
            <h2 className="text-4xl font-bold text-white">
              {partnersTitle}
            </h2>
          </div>
          <p className="text-lg text-gray-600">
            {partnersSubtitle}
          </p>
        </div>
        <div className="grid grid-cols-2 items-center gap-8 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {partners.map(({ name, url, logo }: { name: string; url: string; logo: string }) => (
            <div
              key={name}
              className="group flex items-center justify-center transition-transform duration-300 hover:scale-105"
            >
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full"
                title={name}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logo}
                  alt={name}
                  className="max-h-16 w-full object-contain grayscale transition-all duration-300 hover:grayscale-0"
                />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
