'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const stats = [
    { label: 'Jobs This Month', value: '24', change: '+12%', color: '#3b82f6' },
    { label: 'Revenue', value: '£8,420', change: '+8%', color: '#22c55e' },
    { label: 'Pending Quotes', value: '7', change: '3 new', color: '#f97316' },
    { label: 'Missed Calls (Today)', value: '2', change: 'AI answered 15', color: '#ef4444' },
  ];

  const jobs = [
    { id: 1, customer: 'John Smith', service: 'Boiler Service', status: 'booked', price: '£120' },
    { id: 2, customer: 'Sarah Jones', service: 'Plumbing Repair', status: 'in-progress', price: '£85' },
    { id: 3, customer: 'Mike Brown', service: 'Gas Safety Check', status: 'completed', price: '£150' },
    { id: 4, customer: 'Emma Wilson', service: 'New Radiator', status: 'booked', price: '£350' },
  ];

  const recentCalls = [
    { id: 1, from: '07700 900123', duration: '2m 34s', outcome: 'Job Booked', time: '14:32' },
    { id: 2, from: '07700 900456', duration: '0m 45s', outcome: 'Quote Sent', time: '13:15' },
    { id: 3, from: '07700 900789', duration: '1m 12s', outcome: 'Callback Needed', time: '11:45' },
  ];

  const navigateTo = (page: string) => {
    window.location.href = '/' + page;
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', href: '/' },
    { id: 'jobs', label: 'Jobs', href: '/jobs' },
    { id: 'calendar', label: 'Calendar', href: '/calendar' },
    { id: 'quotes', label: 'Quotes', href: '/quotes' },
    { id: 'calls', label: 'Calls', href: '/calls' },
    { id: 'customers', label: 'Customers', href: '/customers' },
  ];

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>AI Receptionist: <span style={{ color: '#16a34a', fontWeight: '500' }}>Active</span></span>
            <div style={{ width: '2.5rem', height: '2.5rem', backgroundColor: '#e5e7eb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#4b5563', fontWeight: '500' }}>JD</span>
            </div>
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
        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {stats.map((stat, i) => (
            <div key={i} style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>{stat.label}</p>
              <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827' }}>{stat.value}</p>
              <p style={{ fontSize: '0.875rem', marginTop: '0.5rem', color: stat.color }}>{stat.change}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <button 
            onClick={() => navigateTo('calls')}
            style={{ backgroundColor: '#2563eb', color: 'white', padding: '1.5rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', gap: '1rem', border: 'none', cursor: 'pointer', textAlign: 'left' }}
          >
            <div style={{ width: '3rem', height: '3rem', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '1.5rem' }}>📞</span>
            </div>
            <div>
              <p style={{ fontWeight: '600' }}>Simulate Call</p>
              <p style={{ fontSize: '0.875rem', color: '#bfdbfe' }}>Test AI Receptionist</p>
            </div>
          </button>

          <button 
            onClick={() => navigateTo('quotes')}
            style={{ backgroundColor: '#16a34a', color: 'white', padding: '1.5rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', gap: '1rem', border: 'none', cursor: 'pointer', textAlign: 'left' }}
          >
            <div style={{ width: '3rem', height: '3rem', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '1.5rem' }}>📄</span>
            </div>
            <div>
              <p style={{ fontWeight: '600' }}>Create Quote</p>
              <p style={{ fontSize: '0.875rem', color: '#bbf7d0' }}>Generate PDF in seconds</p>
            </div>
          </button>

          <button 
            onClick={() => navigateTo('jobs')}
            style={{ backgroundColor: '#9333ea', color: 'white', padding: '1.5rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', gap: '1rem', border: 'none', cursor: 'pointer', textAlign: 'left' }}
          >
            <div style={{ width: '3rem', height: '3rem', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '1.5rem' }}>➕</span>
            </div>
            <div>
              <p style={{ fontWeight: '600' }}>Add Job</p>
              <p style={{ fontSize: '0.875rem', color: '#e9d5ff' }}>Quick job entry</p>
            </div>
          </button>
        </div>

        {/* Jobs & Calls Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
          {/* Recent Jobs */}
          <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Recent Jobs</h2>
            </div>
            <div>
              {jobs.map((job) => (
                <div key={job.id} style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6' }}>
                  <div>
                    <p style={{ fontWeight: '500', color: '#111827' }}>{job.customer}</p>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{job.service}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ 
                      display: 'inline-block', 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '9999px', 
                      fontSize: '0.75rem', 
                      fontWeight: '500',
                      backgroundColor: job.status === 'booked' ? '#dbeafe' : job.status === 'in-progress' ? '#fef3c7' : '#dcfce7',
                      color: job.status === 'booked' ? '#1d4ed8' : job.status === 'in-progress' ? '#a16207' : '#15803d',
                    }}>
                      {job.status.replace('-', ' ')}
                    </span>
                    <p style={{ fontSize: '0.875rem', fontWeight: '500', marginTop: '0.25rem' }}>{job.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Calls */}
          <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: '600' }}>AI Phone Receptionist</h2>
              <span style={{ fontSize: '0.875rem', color: '#16a34a', fontWeight: '500' }}>● Live</span>
            </div>
            <div>
              {recentCalls.map((call) => (
                <div key={call.id} style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '2.5rem', height: '2.5rem', backgroundColor: '#dbeafe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '1.25rem' }}>📞</span>
                    </div>
                    <div>
                      <p style={{ fontWeight: '500', color: '#111827' }}>{call.from}</p>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{call.duration} • {call.time}</p>
                    </div>
                  </div>
                  <span style={{ 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '9999px', 
                    fontSize: '0.75rem', 
                    fontWeight: '500',
                    backgroundColor: call.outcome === 'Job Booked' ? '#dcfce7' : call.outcome === 'Quote Sent' ? '#dbeafe' : '#fed7aa',
                    color: call.outcome === 'Job Booked' ? '#15803d' : call.outcome === 'Quote Sent' ? '#1d4ed8' : '#c2410c',
                  }}>
                    {call.outcome}
                  </span>
                </div>
              ))}
            </div>
            <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderTop: '1px solid #e5e7eb' }}>
              <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>Today's Summary: <strong>15 calls</strong> answered, <strong>4 jobs</strong> booked, <strong>£680</strong> in new jobs</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
