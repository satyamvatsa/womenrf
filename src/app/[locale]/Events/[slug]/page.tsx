'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslation } from '@/lib/TranslationContext';
import { useCmsData } from '@/lib/useCmsData';

type Speaker = { name: string; title: string };
type SpeakerBio = { name: string; role: string; roleSubtitle?: string; bio: string };
type RunOfShowItem = {
  title: string;
  titleSuffix?: string;
  style?: string;
  listStyle?: string;
  preLabel?: string;
  items: string[];
  subItems?: string[];
};
type Organization = { name: string; link?: string; description: string };
type EventDocument = { label: string; url: string; fileName?: string };
type EventPhoto = { url: string; alt?: string };

type EventDetail = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  status?: 'draft' | 'published';
  eventType?: string;
  publishedAt?: string;
  date: string;
  endDate?: string;
  time: string;
  location: string;
  image?: string;
  topics?: string[];
  department?: string;
  speakers?: Speaker[];
  keynote?: Speaker;
  moderator?: Speaker;
  audience?: string;
  registrationLink?: string;
  body: string;
  documents?: EventDocument[];
  gallery?: EventPhoto[];
  objectives?: string[];
  runOfShow?: RunOfShowItem[];
  cosponsors?: string[];
  organizations?: Organization[];
  speakerBios?: SpeakerBio[];
};

function RichText({ text, className }: { text: string; className?: string }) {
  const parts = text.split(/(\*\*.*?\*\*|\*[^*]+?\*)/g);
  return (
    <span className={className}>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**')) {
          return <em key={i}>{part.slice(1, -1)}</em>;
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}

function ShareButton({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} aria-label={label} className="flex h-9 w-9 items-center justify-center rounded-full text-white transition-opacity hover:opacity-80">
      {icon}
    </button>
  );
}

function formatLongDate(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function EventDetailPage() {
  const { t } = useTranslation();
  const params = useParams();
  const slug = params?.slug as string;
  const eventsData = useCmsData<Record<string, any>>('events');
  const event: EventDetail | null = eventsData?.events?.find((e: EventDetail) => e.slug === slug) ?? null;
  const loading = eventsData === null;
  const [lightbox, setLightbox] = useState<EventPhoto | null>(null);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-wrf-coral border-t-transparent" />
      </div>
    );
  }

  // Drafts are not reachable from the public site.
  if (!event || event.status === 'draft') {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">{t('events.notFound')}</h1>
        <Link href="/Events" className="text-wrf-coral hover:underline">&larr; {t('events.backToEvents')}</Link>
      </div>
    );
  }

  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';

  // The pre-CMS event carries hand-written `event.afghan.*` UI strings for fa/ps. Those keys are
  // global, so they must only be consulted for that event — otherwise every CMS event would
  // render the legacy event's title, subtitle and location. CMS events are translated upstream
  // by /api/data/[section]?locale=, so they need no key lookup at all.
  const isLegacyEvent = Boolean(
    event.speakerBios?.length || event.runOfShow?.length || event.organizations?.length
  );
  const prefix = 'event.afghan';
  const tx = (key: string, fallback: string) => {
    if (!isLegacyEvent) return fallback;
    const val = t(`${prefix}.${key}`);
    return val !== `${prefix}.${key}` ? val : fallback;
  };

  const bodyParagraphs = (event.body || '').split('\n\n').map((p) => p.trim()).filter(Boolean);
  const documents = event.documents ?? [];
  const gallery = event.gallery ?? [];

  const translatedObjectives = event.objectives?.map((obj, i) => tx(`objective${i + 1}`, obj)) || [];
  const orgKeys = ['aja', 'wrf', 'wcran', 'shahmama'];
  const bioKeyMap: Record<string, string> = {
    'Richard Bennett': 'bennett',
    'Dr. Homira Rezai': 'rezai',
    'Ms. Zarqa Yaftali': 'yaftali',
    'Hanifa Girowal': 'girowal',
    'Metra Mehran': 'mehran',
    'Mr. Mahboob Shah Darabi': 'darabi',
    'Meetra Alokozay': 'alokozay',
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <p className="mb-10 text-xs font-medium uppercase tracking-wider text-gray-500">
          <Link href="/" className="hover:underline">{t('events.breadcrumb.home')}</Link>
          {' / '}
          <Link href="/Events" className="hover:underline">{t('events.breadcrumb.events')}</Link>
        </p>

        {/* ── TITLE ── */}
        <h1 className="text-center text-2xl font-bold leading-snug text-wrf-purple sm:text-3xl">
          {tx('title', event.title)}
        </h1>
        {event.subtitle && (
          <p className="mt-2 text-center text-lg italic text-gray-600">{tx('subtitle', event.subtitle)}</p>
        )}

        {/* ── PUBLISHED ON ── */}
        {event.publishedAt && (
          <p className="mt-8 text-gray-800">
            <strong className="text-gray-900">{t('events.detail.publishedOn')}</strong>{' '}
            {formatLongDate(event.publishedAt)}
          </p>
        )}

        {/* ── EVENT META ── */}
        {(event.date || event.time || event.location) && (
          <dl className="mt-3 space-y-1 text-gray-800">
            {event.date && (
              <div className="flex gap-2">
                <dt className="font-bold text-gray-900">{t('events.detail.dateTime')}:</dt>
                <dd>
                  {formatLongDate(event.date)}
                  {event.endDate && ` – ${formatLongDate(event.endDate)}`}
                  {event.time && ` · ${event.time}`}
                </dd>
              </div>
            )}
            {event.location && (
              <div className="flex gap-2">
                <dt className="font-bold text-gray-900">{t('events.detail.location')}:</dt>
                <dd>{tx('location', event.location)}</dd>
              </div>
            )}
          </dl>
        )}

        {/* ── BODY ── */}
        {bodyParagraphs.length > 0 && (
          <div className="mt-8 space-y-5 text-[1.0625rem] leading-[1.75] text-gray-800">
            {bodyParagraphs.map((paragraph, i) => (
              <p key={i}><RichText text={paragraph} /></p>
            ))}
          </div>
        )}

        {/* ── DOCUMENT LINKS ── */}
        {documents.length > 0 && (
          <div className="mt-10 space-y-4">
            {documents.map((doc, i) => (
              <p key={`${doc.url}-${i}`}>
                <a href={doc.url} target="_blank" rel="noopener noreferrer"
                  className="font-semibold text-wrf-purple underline underline-offset-4 hover:text-wrf-purple-dark">
                  {doc.label || doc.fileName}
                </a>
              </p>
            ))}
          </div>
        )}

        {/* ── PHOTO GALLERY ── */}
        {gallery.length > 0 && (
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {gallery.map((photo, i) => (
              <button key={`${photo.url}-${i}`} type="button" onClick={() => setLightbox(photo)}
                className="group block overflow-hidden focus:outline-none focus:ring-2 focus:ring-wrf-purple">
                <img src={photo.url} alt={photo.alt || `${event.title} — ${i + 1}`}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
              </button>
            ))}
          </div>
        )}

        {/* ── REGISTRATION ── */}
        {event.registrationLink && (
          <div className="mt-12 text-center">
            <a href={event.registrationLink} target="_blank" rel="noopener noreferrer"
              className="inline-block bg-wrf-purple px-8 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-wrf-purple-dark">
              {t('events.detail.register')}
            </a>
          </div>
        )}

        {/* ── TOPICS ── */}
        {event.topics && event.topics.length > 0 && (
          <div className="mt-12 flex flex-wrap justify-center gap-2">
            {event.topics.map((topic) => (
              <span key={topic} className="inline-block rounded border border-gray-300 bg-white px-2.5 py-1 text-xs text-gray-700">
                {topic}
              </span>
            ))}
          </div>
        )}

        {/* ──────────────────────────────────────────────────────────── */}
        {/* Extended sections — rendered only for events that carry them */}
        {/* ──────────────────────────────────────────────────────────── */}

        {/* Objectives */}
        {translatedObjectives.length > 0 && (
          <div className="mt-12 text-[1.0625rem] leading-[1.75] text-gray-800">
            <h2 className="mb-2 text-2xl font-bold text-gray-900">{t('events.detail.objectives')}</h2>
            <p className="mb-4">{tx('objectivesIntro', (event as any).objectivesIntro || '')}</p>
            <ul className="space-y-4">
              {translatedObjectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-[0.6rem] flex-shrink-0">&bull;</span>
                  <span><RichText text={obj} /></span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Run of Show */}
        {event.runOfShow && event.runOfShow.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-6 text-center text-xl font-bold italic text-gray-900">{tx('runOfShow', 'Run of Show')}</h2>
            <div className="space-y-6">
              {event.runOfShow.map((section) => {
                const isItalic = section.style === 'underline-italic';
                const isUnderline = section.style === 'underline' || isItalic;
                return (
                  <div key={section.title}>
                    <h3 className="text-base text-gray-900">
                      <span className={`font-bold ${isUnderline ? 'underline' : ''} ${isItalic ? 'italic' : ''}`}>{section.title}</span>
                      {section.titleSuffix && <span className="font-normal"> {section.titleSuffix}</span>}
                    </h3>

                    {section.preLabel && <p className="mt-1 font-bold text-gray-900">{section.preLabel}</p>}

                    {section.listStyle === 'bullet' && (
                      <ul className="mt-2 space-y-1 pl-6">
                        {section.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-gray-800">
                            <span className="mt-1.5 flex-shrink-0 text-[8px]">&#9679;</span>
                            <span><RichText text={item} /></span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {section.listStyle === 'numbered' && (
                      <ol className="mt-2 list-decimal space-y-3 pl-10">
                        {section.items.map((item, i) => (
                          <li key={i} className="pl-1 text-gray-800"><RichText text={item} /></li>
                        ))}
                      </ol>
                    )}

                    {section.listStyle === 'none' && (
                      <div className="mt-1">
                        {section.items.map((item, i) => (
                          <p key={i} className="text-gray-800"><RichText text={item} /></p>
                        ))}
                      </div>
                    )}

                    {section.listStyle === 'dash-nested' && (
                      <div className="mt-2">
                        {section.items.map((item, i) => (
                          <p key={i} className="flex items-start gap-3 pl-6 text-gray-800">
                            <span className="flex-shrink-0">-</span>
                            <span><RichText text={item} /></span>
                          </p>
                        ))}
                        {section.subItems && (
                          <div className="mt-1 space-y-0.5 pl-16">
                            {section.subItems.map((item, i) => (
                              <p key={i} className="flex items-start gap-3 text-gray-800">
                                <span className="flex-shrink-0">-</span>
                                <span><RichText text={item} /></span>
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Co-sponsors */}
        {event.cosponsors && event.cosponsors.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-6 text-center text-xl font-bold text-gray-900 underline">
              {tx('cosponsorsTitle', (event as any).cosponsorsTitle || 'Cosponsors or co-organizers:')}
            </h2>
            <ul className="space-y-1">
              {event.cosponsors.map((c, i) => (
                <li key={c} className="text-base text-gray-800"><RichText text={tx(`cosponsor${i + 1}`, c)} /></li>
              ))}
            </ul>
          </div>
        )}

        {/* Organizations */}
        {event.organizations && event.organizations.length > 0 && (
          <div className="mt-6">
            <p className="mb-4 font-bold text-gray-900">{tx('and', 'And')}</p>
            <div className="space-y-5">
              {event.organizations.map((org, idx) => {
                const orgKey = orgKeys[idx] || '';
                const translatedName = orgKey ? tx(`org.${orgKey}.name`, org.name) : org.name;
                const translatedDesc = orgKey ? tx(`org.${orgKey}.desc`, org.description) : org.description;
                const desc1 = orgKey ? tx(`org.${orgKey}.desc1`, '') : '';
                const desc2 = orgKey ? tx(`org.${orgKey}.desc2`, '') : '';
                const hasMultiDesc = desc1 && desc1 !== `${prefix}.org.${orgKey}.desc1`;
                const paragraphs = hasMultiDesc ? [desc1, desc2] : translatedDesc.split('\n\n');
                return (
                  <div key={org.name} className="text-base leading-[1.8] text-gray-800">
                    <p>
                      {org.link ? (
                        <a href={org.link} target="_blank" rel="noopener noreferrer" className="font-bold text-gray-900 underline hover:text-amber-700">{translatedName}</a>
                      ) : (
                        <strong>{translatedName}</strong>
                      )}{' '}{paragraphs[0]}
                    </p>
                    {paragraphs.slice(1).map((p, i) => (
                      <p key={i} className="mt-4">{p}</p>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Sponsor Logos */}
        {(event as any).sponsorLogos && (event as any).sponsorLogos.length > 0 && (
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 md:gap-8">
            {(event as any).sponsorLogos.map((logo: { src: string; alt: string }, i: number) => (
              <img key={i} src={logo.src} alt={logo.alt} className="h-12 w-auto object-contain md:h-16" />
            ))}
          </div>
        )}

        {/* Speaker biographies */}
        {event.speakerBios && event.speakerBios.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-8 text-center text-xl font-bold text-gray-900 underline">
              {tx('biosTitle', 'Speakers, Panellists and Moderator Biography')}
            </h2>
            <div className="space-y-10">
              {event.speakerBios.map((s, idx) => {
                const isKeynote = s.role === 'Keynote';
                const isModerator = s.role === 'Moderator';
                const isPanellist = s.role === 'Panellist';
                const prevIsKeynote = idx > 0 && event.speakerBios![idx - 1].role === 'Keynote';
                const bKey = bioKeyMap[s.name] || '';
                const bioName = bKey ? tx(`bio.${bKey}.name`, s.name) : s.name;
                const bioSubtitle = bKey && s.roleSubtitle ? tx(`bio.${bKey}.roleSubtitle`, s.roleSubtitle) : s.roleSubtitle;
                const bioText = bKey ? tx(`bio.${bKey}.bio`, s.bio) : s.bio;

                return (
                  <div key={s.name}>
                    {isKeynote && idx === 0 && (
                      <p className="mb-3 font-bold text-gray-900">{tx('keynoteLabel', 'Keynote speaker')}</p>
                    )}
                    {prevIsKeynote && isPanellist && (
                      <p className="mb-4 mt-10 font-bold text-gray-900">{tx('panellistsLabel', 'Panellists')}</p>
                    )}
                    {isModerator && (
                      <p className="mb-3 mt-10 font-bold text-gray-900">{tx('moderatorLabel', 'Moderator:')}</p>
                    )}

                    <p className="mb-2">
                      <strong className="text-gray-900">{bioName}:</strong>
                      {bioSubtitle && <em className="text-gray-700"> {bioSubtitle}</em>}
                    </p>

                    <div className="text-base leading-[1.8] text-gray-800">
                      {bioText.split('\n\n').map((p, i) => (
                        <p key={i} className="mb-4">{p}</p>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── SHARE ── */}
        <div className="mt-14 border-t border-gray-200 pt-6">
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-600">{t('events.detail.share')}</h3>
          <div className="flex gap-2">
            <ShareButton label="Share" onClick={() => { if (navigator.share) navigator.share({ url: pageUrl }); }}
              icon={<svg className="h-9 w-9 rounded-full bg-green-600 p-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>} />
            <ShareButton label="X" onClick={() => window.open(`https://x.com/intent/tweet?url=${encodeURIComponent(pageUrl)}`, '_blank')}
              icon={<svg className="h-9 w-9 rounded-full bg-black p-2" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>} />
            <ShareButton label="LinkedIn" onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`, '_blank')}
              icon={<svg className="h-9 w-9 rounded-full bg-blue-700 p-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>} />
            <ShareButton label="Facebook" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`, '_blank')}
              icon={<svg className="h-9 w-9 rounded-full bg-blue-600 p-2" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>} />
          </div>
        </div>
      </div>

      {/* Gallery lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setLightbox(null)}>
          <img src={lightbox.url} alt={lightbox.alt || ''} className="max-h-full max-w-full object-contain" onClick={(e) => e.stopPropagation()} />
          <button onClick={() => setLightbox(null)} aria-label="Close"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-xl font-bold text-gray-900 hover:bg-white">
            &times;
          </button>
        </div>
      )}
    </div>
  );
}
