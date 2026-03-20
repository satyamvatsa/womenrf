'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/TranslationContext';

function SocialIcon({ href, icon, label }: { href: string; icon: string; label: string }) {
  const paths: Record<string, React.ReactNode> = {
    linkedin: (
      <>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
      </>
    ),
    mail: (
      <>
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </>
    ),
  };
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-8 w-8 items-center justify-center bg-white/20 text-white transition-opacity duration-200 hover:bg-white/30"
      aria-label={label}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {paths[icon]}
      </svg>
    </a>
  );
}

export default function TeamPage() {
  const { t, locale } = useTranslation();

  const BOARD_MEMBERS = [
    {
      name: t('team.morten.name'),
      role: t('team.morten.role'),
      image: '/images/1-Panelist-Morten-Kjaerum-Picture-1.jpg',
      alt: 'Morten Kjaerum',
      bio: t('team.morten.bio'),
      links: [
        { label: 'LinkedIn', href: 'https://www.linkedin.com/in/morten-kjaerum-434b6a2', icon: 'linkedin' },
        { label: 'Email', href: 'mailto:', icon: 'mail' },
      ],
    },
    {
      name: t('team.saba.name'),
      role: t('team.saba.role'),
      image: '/images/Saba_Ghori.jpeg',
      alt: 'Saba Ghori',
      bio: t('team.saba.bio'),
      links: [
        { label: 'LinkedIn', href: 'https://www.linkedin.com/in/sabaghori', icon: 'linkedin' },
        { label: 'Email', href: 'mailto:', icon: 'mail' },
      ],
    },
  ];

  const [adminData, setAdminData] = useState<Record<string, any> | null>(null);
  useEffect(() => {
    fetch('/api/data/team', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => { if (d && Object.keys(d).length > 0) setAdminData(d); })
      .catch(() => {});
  }, []);

  const getLocalizedField = (member: any, field: string) => {
    if (locale !== 'en' && member.translations?.[locale]?.[field]) {
      return member.translations[locale][field];
    }
    return member[field] || '';
  };

  const displayMembers = adminData && adminData.members?.length > 0
    ? adminData.members
        .filter((m: any) => {
          const role = (m.role || '').toLowerCase();
          return role !== 'chief financial officer';
        })
        .map((m: any) => {
          const links: { label: string; href: string; icon: string }[] = [];
          if (m.linkedinUrl) links.push({ label: 'LinkedIn', href: m.linkedinUrl, icon: 'linkedin' });
          if (m.email) links.push({ label: 'Email', href: `mailto:${m.email}`, icon: 'mail' });
          return {
            name: getLocalizedField(m, 'name'),
            role: getLocalizedField(m, 'role'),
            image: m.imageUrl || '',
            alt: m.name,
            bio: getLocalizedField(m, 'bio'),
            links: links.length > 0 ? links : (m.links || []),
            categoryId: m.categoryId,
          };
        })
    : BOARD_MEMBERS;

  const teamSections = adminData && adminData.categories?.length > 0
    ? adminData.categories.map((cat: any) => ({
        title: cat.name,
        description: cat.description || '',
        bgColor: cat.colorClass || cat.color || 'bg-wrf-purple',
        members: displayMembers.filter((m: any) => m.categoryId === cat.id),
      }))
    : [{
        title: t('team.board.title'),
        description: t('team.board.description'),
        bgColor: 'bg-wrf-purple',
        members: displayMembers,
      }];

  return (
    <div className="bg-white">
      {/* Hero - no background behind Our Team (per reference); only the purple content block */}
      <section className="relative py-20 md:py-28">
        <div className="relative mx-auto max-w-7xl px-4 text-left sm:px-6 lg:px-8">
          <div className="inline-block bg-wrf-purple px-8 py-6">
            <h1 className="mb-4 text-4xl font-bold text-white lg:text-5xl">
              {t('team.hero.title')}
            </h1>
            <p className="mb-6 max-w-3xl text-lg leading-relaxed text-white/90">
              {t('team.hero.description')}
            </p>
            <Link
              href="/Vacancies"
              className="inline-flex h-11 items-center justify-center rounded-md bg-wrf-coral px-8 py-4 font-bold text-white transition-colors hover:bg-wrf-coral-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              {t('team.hero.cta')}
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-2">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Team sections */}
      <div className="bg-gray-50 py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {teamSections.map((section: any) =>
              section.members.length > 0 ? (
                <section key={section.title}>
                  <div className="mb-8">
                    <div className={`${section.bgColor} p-6 text-white`}>
                      <h2 className="mb-2 text-2xl font-bold">{section.title}</h2>
                      {section.description && (
                        <p className="max-w-4xl font-medium opacity-90">
                          {section.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {section.members.map((member: any) => (
                      <div
                        key={member.name}
                        className={`flex h-full flex-col ${section.bgColor} shadow-md transition-shadow duration-300 hover:shadow-xl`}
                      >
                        {member.image && (
                          <div className="relative">
                            <img
                              src={member.image}
                              alt={member.alt}
                              className="h-64 w-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex flex-grow flex-col p-4 text-white">
                          <p className="mb-1 text-xs font-semibold uppercase tracking-wide opacity-90">
                            {member.role}
                          </p>
                          <h3 className="mb-3 text-lg font-bold">{member.name}</h3>
                          {member.bio && (
                            <p className="mb-4 flex-grow text-sm leading-relaxed opacity-90">
                              {member.bio}
                            </p>
                          )}
                          {member.links?.length > 0 && (
                            <div className="mt-auto flex gap-2 pt-3">
                              {member.links.map((link: any) => (
                                <SocialIcon
                                  key={link.label}
                                  href={link.href}
                                  icon={link.icon}
                                  label={link.label}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
