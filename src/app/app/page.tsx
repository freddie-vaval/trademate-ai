'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://ekzuplrsptshriwazeur.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrenVwbHJzcHRzaHJpd2F6ZXVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NjI4NTUsImV4cCI6MjA5MDUzODg1NX0.cAzLzlJUQSaYV8NtpEoZQoov39trGcELjt0G9GGNHzM'
);

interface Job {
  id: string;
  customer_id: string;
  service_type: string;
  price: number;
  status: string;
  booked_date: string;
  created_at: string;
}

interface Call {
  id: string;
  customer_name: string;
  phone: string;
  status: string;
  duration_seconds: number;
  summary: string;
  created_at: string;
}

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
}

interface Stats {
  jobsThisMonth: number;
  revenue: number;
  pendingQuotes: number;
  callsToday: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({ jobsThisMonth: 0, revenue: 0, pendingQuotes: 0, callsToday: 0 });
  const [jobs, setJobs] = useState<Job[]>([]);
  const [customers, setCustomers] = useState<Record<string, Customer>>({});
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).toISOString();

        // Fetch jobs this month
        const { data: jobsData } = await supabase
          .from('jobs')
          .select('*')
          .gte('created_at', monthStart)
          .order('created_at', { ascending: false })
          .limit(10);

        // Fetch all customers to map names
        const { data: customersData } = await supabase
          .from('customers')
          .select('id, first_name, last_name')
          .limit(100);

        const customerMap: Record<string, Customer> = {};
        customersData?.forEach(c => { customerMap[c.id] = c; });
        setCustomers(customerMap);

        // Calculate stats
        const revenue = jobsData?.reduce((sum, j) => sum + (j.price || 0), 0) || 0;
        setStats({
          jobsThisMonth: jobsData?.length || 0,
          revenue,
          pendingQuotes: 0, // will add quote query
          callsToday: 0,   // will add call query
        });

        setJobs(jobsData || []);

        // Fetch calls
        const { data: callsData } = await supabase
          .from('calls')
          .select('*')
          .gte('created_at', todayStart)
          .order('created_at', { ascending: false })
          .limit(5);

        setCalls(callsData || []);

        // Update calls today stat
        setStats(prev => ({ ...prev, callsToday: callsData?.length || 0 }));

        // Fetch pending quotes
        const { count } = await supabase
          .from('quotes')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'sent');

        setStats(prev => ({ ...prev, pendingQuotes: count || 0 }));

      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getCallOutcome = (call: Call) => {
    if (call.status === 'completed') return 'Job Booked';
    if (call.status === 'missed') return 'Missed';
    return call.status;
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', href: '/' },
    { id: 'jobs', label: 'Jobs', href: '/jobs' },
    { id: 'calendar', label: 'Calendar', href: '/calendar' },
    { id: 'quotes', label: 'Quotes', href: '/quotes' },
    { id: 'invoices', label: 'Invoices', href: '/invoices' },
    { id: 'calls', label: 'Calls', href: '/calls' },
    { id: 'social', label: 'Social', href: '/social' },
    { id: 'customers', label: 'Customers', href: '/customers' },
  ];

  const statCards = [
    { label: 'Jobs This Month', value: stats.jobsThisMonth, change: '+12%', color: '#3b82f6' },
    { label: 'Revenue', value: `£${stats.revenue.toLocaleString()}`, change: '+8%', color: '#22c55e' },
    { label: 'Pending Quotes', value: stats.pendingQuotes, change: '3 new', color: '#f97316' },
    { label: 'Calls Today', value: stats.callsToday, change: 'AI active', color: '#ef4444' },
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
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>
            Loading your data...
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              {statCards.map((stat, i) => (
                <div key={i} style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>{stat.label}</p>
                  <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827' }}>{stat.value}</p>
                  <p style={{ fontSize: '0.875rem', marginTop: '0.5rem', color: stat.color }}>{stat.change}</p>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              <Link href="/calls" style={{ backgroundColor: '#2563eb', color: 'white', padding: '1.5rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none' }}>
                <div style={{ width: '3rem', height: '3rem', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>📞</div>
                <div>
                  <p style={{ fontWeight: '600' }}>View Calls</p>
                  <p style={{ fontSize: '0.875rem', color: '#bfdbfe' }}>AI Receptionist log</p>
                </div>
              </Link>

              <Link href="/quotes" style={{ backgroundColor: '#16a34a', color: 'white', padding: '1.5rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none' }}>
                <div style={{ width: '3rem', height: '3rem', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>📄</div>
                <div>
                  <p style={{ fontWeight: '600' }}>Create Quote</p>
                  <p style={{ fontSize: '0.875rem', color: '#bbf7d0' }}>Generate PDF in seconds</p>
                </div>
              </Link>

              <Link href="/jobs" style={{ backgroundColor: '#9333ea', color: 'white', padding: '1.5rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none' }}>
                <div style={{ width: '3rem', height: '3rem', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>➕</div>
                <div>
                  <p style={{ fontWeight: '600' }}>Add Job</p>
                  <p style={{ fontSize: '0.875rem', color: '#e9d5ff' }}>Quick job entry</p>
                </div>
              </Link>
            </div>

            {/* Jobs & Calls Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
              {/* Recent Jobs */}
              <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
                  <h2 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Recent Jobs</h2>
                </div>
                {jobs.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                    No jobs yet. <Link href="/jobs" style={{ color: '#2563eb' }}>Add your first job →</Link>
                  </div>
                ) : (
                  <div>
                    {jobs.map((job) => {
                      const customer = customers[job.customer_id];
                      return (
                        <div key={job.id} style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6' }}>
                          <div>
                            <p style={{ fontWeight: '500', color: '#111827' }}>{customer ? `${customer.first_name} ${customer.last_name}` : 'Unknown'}</p>
                            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{job.service_type}</p>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <span style={{ 
                              display: 'inline-block', 
                              padding: '0.25rem 0.75rem', 
                              borderRadius: '9999px', 
                              fontSize: '0.75rem', 
                              fontWeight: '500',
                              backgroundColor: job.status === 'booked-in' ? '#dbeafe' : job.status === 'in-repair' ? '#fef3c7' : '#dcfce7',
                              color: job.status === 'booked-in' ? '#1d4ed8' : job.status === 'in-repair' ? '#a16207' : '#15803d',
                            }}>
                              {job.status.replace('-', ' ')}
                            </span>
                            <p style={{ fontSize: '0.875rem', fontWeight: '500', marginTop: '0.25rem' }}>£{job.price}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Recent Calls */}
              <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ fontSize: '1.125rem', fontWeight: '600' }}>AI Phone Receptionist</h2>
                  <span style={{ fontSize: '0.875rem', color: '#16a34a', fontWeight: '500' }}>● Live</span>
                </div>
                {calls.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                    No calls today. AI is standing by.
                  </div>
                ) : (
                  <div>
                    {calls.map((call) => (
                      <div key={call.id} style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ width: '2.5rem', height: '2.5rem', backgroundColor: '#dbeafe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>📞</div>
                          <div>
                            <p style={{ fontWeight: '500', color: '#111827' }}>{call.customer_name}</p>
                            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{formatDuration(call.duration_seconds)}</p>
                          </div>
                        </div>
                        <span style={{ 
                          padding: '0.25rem 0.75rem', 
                          borderRadius: '9999px', 
                          fontSize: '0.75rem', 
                          fontWeight: '500',
                          backgroundColor: call.status === 'completed' ? '#dcfce7' : call.status === 'missed' ? '#fed7aa' : '#dbeafe',
                          color: call.status === 'completed' ? '#15803d' : call.status === 'missed' ? '#c2410c' : '#1d4ed8',
                        }}>
                          {getCallOutcome(call)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderTop: '1px solid #e5e7eb' }}>
                  <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>Today's Summary: <strong>{stats.callsToday} calls</strong> · <strong>{stats.jobsThisMonth} jobs</strong> · <strong>£{stats.revenue.toLocaleString()}</strong> revenue</p>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
