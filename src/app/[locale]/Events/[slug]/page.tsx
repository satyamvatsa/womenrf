'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslation } from '@/lib/TranslationContext';

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

type EventDetail = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  eventType?: string;
  date: string;
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

export default function EventDetailPage() {
  const { t } = useTranslation();
  const params = useParams();
  const slug = params?.slug as string;
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/data/events', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        const found = d?.events?.find((e: EventDetail) => e.slug === slug);
        setEvent(found || null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-wrf-coral border-t-transparent" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">{t('events.notFound')}</h1>
        <Link href="/Events" className="text-wrf-coral hover:underline">&larr; {t('events.backToEvents')}</Link>
      </div>
    );
  }

  const eventDate = new Date(event.date);
  const formattedDate = `${eventDate.toLocaleString('en', { month: 'short' })} ${eventDate.getDate()} ${eventDate.getFullYear()}`;
  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';

  const allSidebarSpeakers = [
    ...(event.speakers || []).map((s) => s.name),
  ];

  const prefix = 'event.afghan';
  const tx = (key: string, fallback: string) => {
    const val = t(`${prefix}.${key}`);
    return val !== `${prefix}.${key}` ? val : fallback;
  };

  const topicKeys: Record<string, string> = {
    "Women's Rights": 'topic.womensRights',
    'Access to Justice': 'topic.accessToJustice',
    'Human Rights': 'topic.humanRights',
    'Afghanistan': 'topic.afghanistan',
    'Gender Equality': 'topic.genderEquality',
    'Rule of Law': 'topic.ruleOfLaw',
    'International Development': 'topic.internationalDevelopment',
    'Race, Gender, Identity': 'topic.raceGenderIdentity',
  };

  const translatedBody = [
    tx('background', 'Background'),
    tx('body.p1', event.body.split('\n\n')[1] || ''),
    tx('body.p2', event.body.split('\n\n')[2] || ''),
    tx('body.p3', event.body.split('\n\n')[3] || ''),
    tx('body.p4', event.body.split('\n\n')[4] || ''),
    tx('body.p5', event.body.split('\n\n')[5] || ''),
    tx('body.p6', event.body.split('\n\n')[6] || ''),
    tx('body.p7', event.body.split('\n\n')[7] || ''),
  ];

  const translatedObjectives = event.objectives?.map((obj, i) =>
    tx(`objective${i + 1}`, obj)
  ) || [];

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
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <p className="mb-8 text-xs font-medium uppercase tracking-wider text-gray-500">
          <Link href="/" className="hover:underline">{t('events.breadcrumb.home')}</Link>
          {' / '}
          <Link href="/Events" className="hover:underline">{t('events.breadcrumb.events')}</Link>
        </p>

        <div className="grid gap-12 lg:grid-cols-[240px_1fr]">
          {/* ── LEFT SIDEBAR ── */}
          <aside className="order-2 lg:order-1">
            {/* Event poster image */}
            {event.image && (
              <div className="mb-6">
                <img src={event.image} alt={tx('title', event.title)} className="w-full object-contain" />
              </div>
            )}

            {/* Date & Time */}
            <div className="border-l-[3px] border-amber-600 py-3 pl-4">
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-600">{t('events.detail.dateTime')}</h3>
              <p className="text-lg font-bold italic text-gray-900">{formattedDate}</p>
              <p className="text-sm text-gray-700">{event.time}</p>
            </div>

            {/* Location */}
            <div className="border-l-[3px] border-amber-600 py-3 pl-4">
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-600">{t('events.detail.location')}</h3>
              <p className="text-sm leading-relaxed text-gray-900">{tx('location', event.location)}</p>
            </div>

            {/* Topics */}
            {event.topics && event.topics.length > 0 && (
              <div className="border-l-[3px] border-amber-600 py-3 pl-4">
                <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-600">{t('events.detail.topics')}</h3>
                <div className="flex flex-wrap gap-1.5">
                  {event.topics.map((topic) => (
                    <span key={topic} className="inline-block rounded border border-gray-300 bg-white px-2.5 py-1 text-xs text-gray-700">
                      {topicKeys[topic] ? tx(topicKeys[topic], topic) : topic}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Department */}
            {event.department && (
              <div className="border-l-[3px] border-amber-600 py-3 pl-4">
                <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-600">{t('events.detail.department')}</h3>
                <span className="inline-block rounded border border-gray-300 bg-white px-2.5 py-1 text-xs text-gray-700">{tx('department', event.department)}</span>
              </div>
            )}

            {/* Speakers */}
            {allSidebarSpeakers.length > 0 && (
              <div className="border-l-[3px] border-amber-600 py-3 pl-4">
                <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-600">{t('events.detail.speakers')}</h3>
                <ul className="space-y-0.5">
                  {allSidebarSpeakers.map((name) => (
                    <li key={name} className="text-sm text-gray-900">{name.replace(/^(Ms\.?\s*|Mr\.?\s*|Dr\.?\s*)/, '')}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Audience */}
            {event.audience && (
              <div className="border-l-[3px] border-amber-600 py-3 pl-4">
                <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-600">{t('events.detail.audience')}</h3>
                <p className="text-sm text-gray-900">{tx('audience', event.audience)}</p>
              </div>
            )}

            {/* Link */}
            {event.registrationLink && (
              <div className="border-l-[3px] border-amber-600 py-3 pl-4">
                <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-600">{t('events.detail.link')}</h3>
                <a href={event.registrationLink} target="_blank" rel="noopener noreferrer" className="inline-block rounded border border-gray-300 bg-white px-2.5 py-1 text-xs text-gray-700 hover:bg-gray-50">
                  {t('events.detail.registrationLink')}
                </a>
              </div>
            )}

            {/* Share */}
            <div className="border-l-[3px] border-amber-600 py-3 pl-4">
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-600">{t('events.detail.share')}</h3>
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
          </aside>

          {/* ── MAIN CONTENT ── */}
          <div className="order-1 lg:order-2">
            {/* Title */}
            <h1 className="mb-2 text-3xl font-bold leading-tight text-gray-900 lg:text-[2.5rem] lg:leading-[1.2]">
              {tx('title', event.title)}
            </h1>
            {event.subtitle && (
              <p className="mb-10 text-lg italic text-gray-600">{tx('subtitle', event.subtitle)}</p>
            )}

            {/* Body with drop-cap */}
            <div className="text-lg leading-[1.8] text-gray-800">
              {translatedBody.map((paragraph, i) => {
                if (i === 0) {
                  return <h2 key={i} className="mb-4 mt-10 text-2xl font-bold text-gray-900">{paragraph}</h2>;
                }
                if (i === 1) {
                  const firstLetter = paragraph.charAt(0);
                  const rest = paragraph.slice(1);
                  return (
                    <p key={i} className="mb-6">
                      <span className="float-left mr-2 mt-1 text-5xl font-bold leading-[0.8] text-gray-900">{firstLetter}</span>
                      {rest}
                    </p>
                  );
                }
                return paragraph ? <p key={i} className="mb-6">{paragraph}</p> : null;
              })}
            </div>

            {/* Objectives */}
            {translatedObjectives.length > 0 && (
              <div className="mt-8 text-lg leading-[1.8] text-gray-800">
                <h2 className="mb-2 text-2xl font-bold text-gray-900">{t('events.detail.objectives')}</h2>
                <p className="mb-4">{tx('objectivesIntro', (event as any).objectivesIntro || '')}</p>
                <ul className="space-y-4">
                  {translatedObjectives.map((obj, i) => {
                    const boldMatch = obj.match(/^\*\*(.+?)\*\*(.*)$/);
                    return (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-[0.6rem] flex-shrink-0">&bull;</span>
                        <span>
                          {boldMatch ? (
                            <><strong>{boldMatch[1]}</strong>{boldMatch[2]}</>
                          ) : (
                            obj
                          )}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* Run of Show */}
            {event.runOfShow && event.runOfShow.length > 0 && (() => {
              const rosTitleKeys: Record<string, string> = {
                'Opening Session (10:00 \u2013 10:25)': 'ros.openingTitle',
                'Keynote Address (10:25 \u2013 10:30)': 'ros.keynoteTitle',
                'Panel Discussion (10:30 \u2013 11:00) \u2013 Moderator:': 'ros.panelTitle',
                'Q&A / Floor Interventions (11:00 \u2013 11:15)': 'ros.qaTitle',
                'Closing Remarks (if time permits)': 'ros.closingTitle',
              };
              const rosItemKeys: Record<string, string[]> = {
                'Opening Session (10:00 \u2013 10:25)': ['ros.opening.item1', 'ros.opening.item2', 'ros.opening.item3'],
                'Keynote Address (10:25 \u2013 10:30)': ['ros.keynote.item1'],
                'Panel Discussion (10:30 \u2013 11:00) \u2013 Moderator:': ['ros.panel.item1', 'ros.panel.item2', 'ros.panel.item3', 'ros.panel.item4', 'ros.panel.item5'],
                'Q&A / Floor Interventions (11:00 \u2013 11:15)': ['ros.qa.item1'],
                'Closing Remarks (if time permits)': ['ros.closing.item1'],
              };
              const rosSubKeys: Record<string, string[]> = {
                'Q&A / Floor Interventions (11:00 \u2013 11:15)': ['ros.qa.sub1', 'ros.qa.sub2', 'ros.qa.sub3', 'ros.qa.sub4'],
              };

              return (
                <div className="mt-12">
                  <h2 className="mb-6 text-center text-xl font-bold italic text-gray-900">{tx('runOfShow', 'Run of Show')}</h2>
                  <div className="space-y-6">
                    {event.runOfShow.map((section) => {
                      const isItalic = section.style === 'underline-italic';
                      const isUnderline = section.style === 'underline' || isItalic;
                      const titleKey = rosTitleKeys[section.title];
                      const translatedTitle = titleKey ? tx(titleKey, section.title) : section.title;
                      const suffixKey = section.title.includes('Moderator') ? 'ros.panelSuffix' : '';
                      const translatedSuffix = suffixKey ? tx(suffixKey, section.titleSuffix || '') : section.titleSuffix;
                      const labelKey = section.preLabel === 'Panelists' ? 'ros.panelLabel' : '';
                      const translatedLabel = labelKey ? tx(labelKey, section.preLabel || '') : section.preLabel;
                      const itemKeys = rosItemKeys[section.title] || [];
                      const translatedItems = section.items.map((item, i) =>
                        itemKeys[i] ? tx(itemKeys[i], item) : item
                      );
                      const subKeys = rosSubKeys[section.title] || [];
                      const translatedSubItems = section.subItems?.map((item, i) =>
                        subKeys[i] ? tx(subKeys[i], item) : item
                      );

                      return (
                        <div key={section.title}>
                          <h3 className="text-base text-gray-900">
                            <span className={`font-bold ${isUnderline ? 'underline' : ''} ${isItalic ? 'italic' : ''}`}>
                              {translatedTitle}
                            </span>
                            {translatedSuffix && (
                              <span className="font-normal"> {translatedSuffix}</span>
                            )}
                          </h3>

                          {translatedLabel && (
                            <p className="mt-1 font-bold text-gray-900">{translatedLabel}</p>
                          )}

                          {section.listStyle === 'bullet' && (
                            <ul className="mt-2 space-y-1 pl-6">
                              {translatedItems.map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-gray-800">
                                  <span className="mt-1.5 flex-shrink-0 text-[8px]">&#9679;</span>
                                  <span><RichText text={item} /></span>
                                </li>
                              ))}
                            </ul>
                          )}

                          {section.listStyle === 'numbered' && (
                            <ol className="mt-2 list-decimal space-y-3 pl-10">
                              {translatedItems.map((item, i) => (
                                <li key={i} className="text-gray-800 pl-1">
                                  <RichText text={item} />
                                </li>
                              ))}
                            </ol>
                          )}

                          {section.listStyle === 'none' && (
                            <div className="mt-1">
                              {translatedItems.map((item, i) => (
                                <p key={i} className="text-gray-800">
                                  <RichText text={item} />
                                </p>
                              ))}
                            </div>
                          )}

                          {section.listStyle === 'dash-nested' && (
                            <div className="mt-2">
                              {translatedItems.map((item, i) => (
                                <p key={i} className="flex items-start gap-3 text-gray-800 pl-6">
                                  <span className="flex-shrink-0">-</span>
                                  <span><RichText text={item} /></span>
                                </p>
                              ))}
                              {translatedSubItems && (
                                <div className="pl-16 mt-1 space-y-0.5">
                                  {translatedSubItems.map((item, i) => (
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
              );
            })()}

            {/* Co-sponsors */}
            {event.cosponsors && event.cosponsors.length > 0 && (
              <div className="mt-12">
                <h2 className="mb-6 text-center text-xl font-bold text-gray-900 underline">
                  {tx('cosponsorsTitle', (event as any).cosponsorsTitle || 'Cosponsors or co-organizers:')}
                </h2>
                <ul className="space-y-1">
                  {event.cosponsors.map((c, i) => (
                    <li key={c} className="text-base text-gray-800">
                      <RichText text={tx(`cosponsor${i + 1}`, c)} />
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* And - Organizations */}
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
                            <a href={org.link} target="_blank" rel="noopener noreferrer" className="font-bold underline text-gray-900 hover:text-amber-700">{translatedName}</a>
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
              <div className="mt-12">
                <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
                  {(event as any).sponsorLogos.map((logo: { src: string; alt: string }, i: number) => (
                    <img key={i} src={logo.src} alt={logo.alt} className="h-12 w-auto object-contain md:h-16" />
                  ))}
                </div>
              </div>
            )}

            {/* Speakers, Panellists and Moderator Biography */}
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
                          {bioSubtitle && (
                            <em className="text-gray-700"> {bioSubtitle}</em>
                          )}
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

          </div>
        </div>
      </div>
    </div>
  );
}
