'use client';

import { useTranslation } from '@/lib/TranslationContext';
import { useCmsData } from '@/lib/useCmsData';

export default function Testimonials() {
  const { t } = useTranslation();
  const adminData = useCmsData<Record<string, any>>('homepage');
  const testimonialData = useCmsData<Record<string, any>>('testimonials');

  const showTestimonials = adminData?.showTestimonials !== undefined ? adminData.showTestimonials : true;
  const title = adminData?.testimonialTitle || t('testimonials.title');
  const subtitle = adminData?.testimonialSubtitle || t('testimonials.subtitle');
  const titleBg = adminData?.testimonialTitleBg || 'bg-primary';

  const BG_MAP: Record<string, string> = {
    'bg-primary': 'bg-wrf-black',
    'bg-secondary': 'bg-wrf-purple',
    'bg-accent': 'bg-wrf-coral',
    'bg-support-1': 'bg-wrf-footer-mauve',
  };
  const titleBgClass = BG_MAP[titleBg] || 'bg-wrf-black';

  if (!showTestimonials) return null;

  const FALLBACK_TESTIMONIALS = [
    { quote: 'WRF has been a beacon of hope for Afghan women everywhere.', authorName: 'Community Member', authorRole: 'Supporter', authorImageUrl: '' },
    { quote: 'Their programs have empowered countless women to take control of their futures.', authorName: 'Partner Organization', authorRole: 'Collaborator', authorImageUrl: '' },
    { quote: 'The dedication and impact of this organization is truly inspiring.', authorName: 'Volunteer', authorRole: 'Event Coordinator', authorImageUrl: '' },
  ];

  const testimonials = testimonialData?.testimonials?.length
    ? testimonialData.testimonials
    : FALLBACK_TESTIMONIALS;

  const CARD_COLORS = ['bg-wrf-black', 'bg-wrf-coral', 'bg-wrf-purple'];

  return (
    <section id="testimonials" className="bg-gray-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-left">
          <div className={`mb-4 inline-block ${titleBgClass} px-8 py-6`}>
            <h2 className="text-4xl font-bold text-white">{title}</h2>
          </div>
          <p className="text-lg text-gray-600">{subtitle}</p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.slice(0, 6).map((t: any, i: number) => (
            <div key={i} className={`${CARD_COLORS[i % 3]} p-8 text-white shadow-lg`}>
              <div className="mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="mb-4 h-8 w-8 opacity-40">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-lg italic leading-relaxed">&quot;{t.quote}&quot;</p>
              </div>
              <div className="flex items-center gap-4">
                {t.authorImageUrl && (
                  <img src={t.authorImageUrl} alt={t.authorName} className="h-12 w-12 rounded-full object-cover" />
                )}
                <div>
                  <p className="font-bold">{t.authorName}</p>
                  {t.authorRole && <p className="text-sm opacity-90">{t.authorRole}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
