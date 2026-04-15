'use client';

import Link from 'next/link';

const tabs = [
  { id: 'app', label: '📋 Jobs', href: '/app' },
  { id: 'customers', label: '👥 Customers', href: '/app/customers' },
  { id: 'money', label: '💰 Money', href: '/app/money' },
];

export default function MorePage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <header style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', padding: '1rem' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '2.5rem', height: '2.5rem', backgroundColor: '#2563eb', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontWeight: 'bold', fontSize: '1.25rem' }}>T</span>
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>TradeMate AI</h1>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', display: 'flex', gap: '2rem' }}>
          {tabs.map((tab) => (
            <Link key={tab.id} href={tab.href} style={{ padding: '1rem 0.5rem', fontWeight: '500', borderBottom: '2px solid #e5e7eb', color: '#6b7280', textDecoration: 'none' }}>
              {tab.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ maxWidth: '80rem', margin: '0 auto', padding: '2rem 1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151', marginBottom: '1.5rem' }}>More</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '400px' }}>
          {[
            { label: '📅 Calendar', href: '/calendar', desc: 'Schedule and appointments' },
            { label: '📞 Calls', href: '/calls', desc: 'AI call log and recordings' },
            { label: '📱 Social', href: '/social', desc: 'Social media and marketing' },
          ].map(item => (
            <a
              key={item.href}
              href={item.href}
              style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textDecoration: 'none', border: '1px solid #e5e7eb', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
            >
              <div>
                <p style={{ fontWeight: '600', color: '#111827', fontSize: '0.875rem' }}>{item.label}</p>
                <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.125rem' }}>{item.desc}</p>
              </div>
              <span style={{ color: '#9ca3af', fontSize: '1rem' }}>→</span>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}
