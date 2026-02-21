'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AdminShell, icons } from '@/components/AdminShell';

export default function AdminDashboard() {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const base = `/${locale}`;

  return (
    <AdminShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-primary mb-2">Admin Dashboard</h1>
          <p className="text-gray-600 font-body">Welcome to the WRF content management system</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Content Sections', value: '0', icon: 'file-text', color: 'text-blue-600' },
            { label: 'Active Programs', value: '0', icon: 'book-open', color: 'text-green-600' },
            { label: 'News Articles', value: '0', icon: 'mail', color: 'text-purple-600' },
            { label: 'Registered Users', value: '0', icon: 'users', color: 'text-indigo-600' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg border bg-card text-card-foreground shadow-sm border-l-4 border-l-secondary">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 font-body">{stat.label}</p>
                    <p className="text-3xl font-bold text-primary font-heading">{stat.value}</p>
                  </div>
                  <span className={stat.color}>{icons[stat.icon]}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2 font-heading">
              {icons.settings}
              Quick Actions
            </h3>
          </div>
          <div className="p-6 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href={`${base}/PageSettingManagement`} className="p-4 rounded-lg border border-gray-200 hover:border-secondary hover:shadow-md transition-all duration-200 group">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500 text-white group-hover:scale-110 transition-transform duration-200">{icons['file-text']}</div>
                  <div>
                    <h3 className="font-heading font-semibold text-primary">Add Content</h3>
                    <p className="text-sm text-gray-600 font-body">Update website sections</p>
                  </div>
                </div>
              </Link>
              <Link href={`${base}/ProgramManagement`} className="p-4 rounded-lg border border-gray-200 hover:border-secondary hover:shadow-md transition-all duration-200 group">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-500 text-white group-hover:scale-110 transition-transform duration-200">{icons['book-open']}</div>
                  <div>
                    <h3 className="font-heading font-semibold text-primary">New Program</h3>
                    <p className="text-sm text-gray-600 font-body">Create program</p>
                  </div>
                </div>
              </Link>
              <Link href={`${base}/BlogPostManagement`} className="p-4 rounded-lg border border-gray-200 hover:border-secondary hover:shadow-md transition-all duration-200 group">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500 text-white group-hover:scale-110 transition-transform duration-200">{icons.mail}</div>
                  <div>
                    <h3 className="font-heading font-semibold text-primary">Post News</h3>
                    <p className="text-sm text-gray-600 font-body">Share updates</p>
                  </div>
                </div>
              </Link>
              <Link href={base} className="p-4 rounded-lg border border-gray-200 hover:border-secondary hover:shadow-md transition-all duration-200 group">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-500 text-white group-hover:scale-110 transition-transform duration-200">{icons.globe}</div>
                  <div>
                    <h3 className="font-heading font-semibold text-primary">View Website</h3>
                    <p className="text-sm text-gray-600 font-body">See public site</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="space-y-1.5 p-6 flex flex-row items-center justify-between">
              <h3 className="text-2xl font-semibold leading-none tracking-tight font-heading">Recent Content</h3>
              <Link href={`${base}/BlogPostManagement`}>
                <button type="button" className="inline-flex items-center justify-center gap-1 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3">
                  View All
                </button>
              </Link>
            </div>
            <div className="p-6 pt-0">
              <div className="space-y-4" />
            </div>
          </div>
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="space-y-1.5 p-6 flex flex-row items-center justify-between">
              <h3 className="text-2xl font-semibold leading-none tracking-tight font-heading">Recent News</h3>
              <Link href={`${base}/BlogPostManagement`}>
                <button type="button" className="inline-flex items-center justify-center gap-1 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3">
                  View All
                </button>
              </Link>
            </div>
            <div className="p-6 pt-0">
              <div className="space-y-4" />
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
