'use client';

import { useTranslation } from '@/lib/TranslationContext';
import { useCmsData } from '@/lib/useCmsData';

const PARTNERS = [
  { name: 'Google', url: 'https://google.com', logo: '/images/partners/google.svg' },
  { name: 'Microsoft', url: 'https://microsoft.com', logo: '/images/partners/microsoft.svg' },
  { name: 'Salesforce', url: 'https://salesforce.com', logo: '/images/partners/salesforce.svg' },
  { name: 'Amazon', url: 'https://amazon.com', logo: '/images/partners/amazon.svg' },
  { name: 'Shopify', url: 'https://shopify.com', logo: '/images/partners/shopify.svg' },
  { name: 'Netflix', url: 'https://netflix.com', logo: '/images/partners/netflix.svg' },
  { name: 'Meta', url: 'https://meta.com', logo: '/images/partners/meta.svg' },
  { name: 'Slack', url: 'https://slack.com', logo: '/images/partners/slack.svg' },
  { name: 'Asana', url: 'https://asana.com', logo: '/images/partners/asana.svg' },
  { name: 'Trello', url: 'https://trello.com', logo: '/images/partners/trello.svg' },
];

export default function Partners() {
  const { t } = useTranslation();
  const adminData = useCmsData<Record<string, any>>('homepage');

  const partners = adminData?.partnersList?.length
    ? adminData.partnersList.map((p: any) => ({
        name: p.name,
        url: p.url || p.websiteUrl || '#',
        logo: p.logo || p.logoUrl || '',
      }))
    : PARTNERS;

  const showPartners = adminData?.showPartners !== undefined ? adminData.showPartners : true;
  const partnersTitle = adminData?.partnersTitle || t('partners.title');
  const partnersSubtitle = adminData?.partnersSubtitle || t('partners.description');
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
