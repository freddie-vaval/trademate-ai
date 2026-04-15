'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useJobs, useCustomers, formatMoney, fullName } from '@/lib/data-store';
import { Job } from '@/lib/types';

const tabs = [
  { id: 'app', label: '📋 Jobs', href: '/app' },
  { id: 'bikes', label: '🚲 Bikes', href: '/app/bikes' },
  { id: 'customers', label: '👥 Customers', href: '/app/customers' },
  { id: 'money', label: '💰 Money', href: '/app/money' },
];

export default function AppDashboard() {
  const [jobs, setJobs, jobsHydrated] = useJobs();
  const [customers, , customersHydrated] = useCustomers();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (jobsHydrated && customersHydrated) setLoading(false);
  }, [jobsHydrated, customersHydrated]);

  // Next job = most recent job that isn't collected
  const activeJobs = jobs.filter(j => j.status !== 'collected');
  const nextJob = activeJobs[0] ?? null;

  const customerMap = new Map(customers.map(c => [c.id, c]));

  const markDone = () => {
    if (!nextJob) return;
    setJobs(jobs.map(j => j.id === nextJob.id ? { ...j, status: 'collected' as const } : j));
  };

  const reschedule = () => {
    if (!nextJob) return;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().slice(0, 10);
    setJobs(jobs.map(j => j.id === nextJob.id ? { ...j, bookedDate: dateStr } : j));
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#6b7280' }}>Loading...</p>
      </div>
    );
  }

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
            <Link
              key={tab.id}
              href={tab.href}
              style={{
                padding: '1rem 0.5rem',
                fontWeight: '500',
                borderBottom: '2px solid #e5e7eb',
                color: '#6b7280',
                textDecoration: 'none',
              }}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ maxWidth: '80rem', margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151', marginBottom: '1.5rem' }}>What do I do next?</h2>
        </div>

        {activeJobs.length === 0 ? (
          <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '3rem', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <p style={{ fontSize: '1.125rem', color: '#6b7280', marginBottom: '1rem' }}>No active jobs.</p>
            <Link href='/app/jobs' style={{ color: '#2563eb', fontWeight: '500' }}>Go to Jobs →</Link>
          </div>
        ) : nextJob ? (
          <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            {/* Next job header */}
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #f3f4f6' }}>
              <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '0.5rem' }}>NEXT JOB</p>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827' }}>
                {fullName(customerMap.get(nextJob.customerId)!) || 'Unknown'}
              </h3>
              <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>{nextJob.serviceType}</p>
            </div>

            {/* Details */}
            <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem' }}>DATE</p>
                <p style={{ fontWeight: '500', color: '#374151' }}>{nextJob.bookedDate} at {nextJob.bookedTime}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem' }}>PRICE</p>
                <p style={{ fontWeight: '600', color: '#2563eb' }}>{formatMoney(nextJob.price)}</p>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem' }}>STATUS</p>
                <span style={{
                  display: 'inline-block',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  backgroundColor: '#dbeafe',
                  color: '#1d4ed8',
                }}>
                  {nextJob.status.replace('-', ' ')}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div style={{ padding: '1.5rem', borderTop: '1px solid #f3f4f6', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                onClick={markDone}
                style={{ backgroundColor: '#2563eb', color: 'white', padding: '0.625rem 1.25rem', borderRadius: '0.5rem', fontWeight: '500', border: 'none', cursor: 'pointer', fontSize: '0.875rem' }}
              >
                ✓ Mark Done
              </button>
              <button
                onClick={reschedule}
                style={{ backgroundColor: 'white', color: '#374151', padding: '0.625rem 1.25rem', borderRadius: '0.5rem', fontWeight: '500', border: '1px solid #d1d5db', cursor: 'pointer', fontSize: '0.875rem' }}
              >
                ↺ Reschedule
              </button>
              <a
                href={`tel:${customerMap.get(nextJob.customerId)?.phone ?? ''}`}
                style={{ backgroundColor: 'white', color: '#374151', padding: '0.625rem 1.25rem', borderRadius: '0.5rem', fontWeight: '500', border: '1px solid #d1d5db', textDecoration: 'none', fontSize: '0.875rem' }}
              >
                📞 Call
              </a>
            </div>
          </div>
        ) : null}

        {/* Queue preview */}
        {activeJobs.length > 1 && (
          <div style={{ marginTop: '1.5rem' }}>
            <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '0.75rem', fontWeight: '500' }}>ALSO PENDING ({activeJobs.length - 1})</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {activeJobs.slice(1, 6).map(job => (
                <div key={job.id} style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '0.875rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                  <div>
                    <p style={{ fontWeight: '500', color: '#374151', fontSize: '0.875rem' }}>
                      {fullName(customerMap.get(job.customerId)!) || 'Unknown'}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{job.serviceType} · {job.bookedDate}</p>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280', backgroundColor: '#f3f4f6', padding: '0.2rem 0.6rem', borderRadius: '9999px' }}>
                    {job.status.replace('-', ' ')}
                  </span>
                </div>
              ))}
            </div>
            <Link href='/app/jobs' style={{ display: 'block', marginTop: '0.75rem', fontSize: '0.875rem', color: '#2563eb', fontWeight: '500' }}>
              View all {activeJobs.length} jobs →
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
