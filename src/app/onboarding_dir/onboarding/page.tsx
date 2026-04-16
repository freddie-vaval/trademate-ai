'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ekzuplrsptshriwazeur.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrenVwbHJzcHRzaHJpd2F6ZXVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NjI4NTUsImV4cCI6MjA5MDUzODg1NX0.cAzLzlJUQSaYV8NtpEoZQoov39trGcELjt0G9GGNHzM'
);

// ─── Step components ─────────────────────────────────────────────────────────

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '32px' }}>
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          style={{
            width: i === current ? '32px' : '8px',
            height: '8px',
            borderRadius: '4px',
            background: i <= current ? '#ff6b35' : '#e5e7eb',
            transition: 'all 0.3s ease',
          }}
        />
      ))}
    </div>
  );
}

function StepTitle({ step, total, title, subtitle }: { step: number; total: number; title: string; subtitle?: string }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
      <StepIndicator current={step} total={total} />
      <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#1a1a1a', marginBottom: '8px' }}>{title}</h2>
      {subtitle && <p style={{ color: '#6b7280', fontSize: '16px' }}>{subtitle}</p>}
    </div>
  );
}

function OptionCard({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: '100%',
        padding: '20px 24px',
        border: selected ? '2px solid #ff6b35' : '2px solid #e5e7eb',
        borderRadius: '12px',
        background: selected ? '#fff5f0' : '#fff',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.2s ease',
        marginBottom: '12px',
      }}
    >
      {children}
    </button>
  );
}

function OptionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ fontSize: '16px', fontWeight: 600, color: '#1a1a1a', display: 'block' }}>{children}</span>
  );
}

function OptionSub({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ fontSize: '13px', color: '#6b7280', display: 'block', marginTop: '2px' }}>{children}</span>
  );
}

function NavButtons({ back, next, canNext, nextLabel = 'Continue', loading = false }: {
  back?: () => void; next?: () => void; canNext?: boolean; nextLabel?: string; loading?: boolean;
}) {
  return (
    <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
      {back && (
        <button
          type="button"
          onClick={back}
          style={{
            flex: 1,
            padding: '16px',
            border: '2px solid #e5e7eb',
            borderRadius: '10px',
            background: '#fff',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '16px',
            color: '#6b7280',
          }}
        >
          Back
        </button>
      )}
      {next && (
        <button
          type="button"
          onClick={next}
          disabled={canNext === false || loading}
          style={{
            flex: 2,
            padding: '16px',
            border: 'none',
            borderRadius: '10px',
            background: canNext === false ? '#d1d5db' : '#ff6b35',
            cursor: canNext === false ? 'not-allowed' : 'pointer',
            fontWeight: 600,
            fontSize: '16px',
            color: '#fff',
            transition: 'all 0.2s ease',
          }}
        >
          {loading ? 'Processing...' : nextLabel}
        </button>
      )}
    </div>
  );
}

// ─── Step 1: Account ─────────────────────────────────────────────────────────

function StepAccount({ data, update }: { data: FormData; update: (d: Partial<FormData>) => void }) {
  return (
    <div>
      <StepTitle step={0} total={6} title="Create your account" subtitle="Start your 14-day free trial" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Full name</label>
          <input
            type="text"
            value={data.name}
            onChange={e => update({ name: e.target.value })}
            placeholder="Freddie Smith"
            style={{ width: '100%', padding: '14px 16px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '16px', outline: 'none' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Business name</label>
          <input
            type="text"
            value={data.business}
            onChange={e => update({ business: e.target.value })}
            placeholder="Smith Plumbing & Heating"
            style={{ width: '100%', padding: '14px 16px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '16px', outline: 'none' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Email</label>
          <input
            type="email"
            value={data.email}
            onChange={e => update({ email: e.target.value })}
            placeholder="freddie@smithplumbing.co.uk"
            style={{ width: '100%', padding: '14px 16px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '16px', outline: 'none' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Phone number</label>
          <input
            type="tel"
            value={data.phone}
            onChange={e => update({ phone: e.target.value })}
            placeholder="07700 900 000"
            style={{ width: '100%', padding: '14px 16px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '16px', outline: 'none' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Password</label>
          <input
            type="password"
            value={data.password}
            onChange={e => update({ password: e.target.value })}
            placeholder="At least 8 characters"
            style={{ width: '100%', padding: '14px 16px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '16px', outline: 'none' }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Step 2: Trade ────────────────────────────────────────────────────────────

const TRADES = [
  { value: 'plumber', label: 'Plumber', sub: 'Including emergency plumbing, heating, and gas' },
  { value: 'electrician', label: 'Electrician', sub: 'Domestic, commercial, and industrial' },
  { value: 'builder', label: 'Builder', sub: 'General building, renovations, and extensions' },
  { value: 'hvac', label: 'HVAC / Heating Engineer', sub: 'Air conditioning, ventilation, heating' },
  { value: 'roofer', label: 'Roofer', sub: 'Flat roofs, pitched roofs, gutters' },
  { value: 'carpenter', label: 'Carpenter', sub: 'Joinery, bespoke furniture, first fix' },
  { value: 'painter', label: 'Painter & Decorator', sub: 'Interior and exterior painting' },
  { value: 'landscaper', label: 'Landscaper', sub: 'Gardens, patios, fencing' },
  { value: 'other', label: 'Other trade', sub: 'Other specialist trade' },
];

function StepTrade({ data, update }: { data: FormData; update: (d: Partial<FormData>) => void }) {
  return (
    <div>
      <StepTitle step={1} total={6} title="What's your trade?" subtitle="We'll tailor everything to how you work" />
      <div>
        {TRADES.map(t => (
          <OptionCard key={t.value} selected={data.trade === t.value} onClick={() => update({ trade: t.value })}>
            <OptionLabel>{t.label}</OptionLabel>
            <OptionSub>{t.sub}</OptionSub>
          </OptionCard>
        ))}
      </div>
    </div>
  );
}

// ─── Step 3: Team ─────────────────────────────────────────────────────────────

const TEAM_SIZES = [
  { value: '1', label: 'Just me', sub: 'Sole trader, no employees' },
  { value: '2-5', label: '2 to 5 people', sub: 'Small team, one or two vans' },
  { value: '6-10', label: '6 to 10 people', sub: 'Growing business, multiple teams' },
  { value: '11+', label: '11 or more', sub: 'Established business' },
];

function StepTeam({ data, update }: { data: FormData; update: (d: Partial<FormData>) => void }) {
  return (
    <div>
      <StepTitle step={2} total={6} title="How big is your team?" subtitle="Helps us recommend the right plan" />
      <div>
        {TEAM_SIZES.map(t => (
          <OptionCard key={t.value} selected={data.teamSize === t.value} onClick={() => update({ teamSize: t.value })}>
            <OptionLabel>{t.label}</OptionLabel>
            <OptionSub>{t.sub}</OptionSub>
          </OptionCard>
        ))}
      </div>
    </div>
  );
}

// ─── Step 4: Current Software ─────────────────────────────────────────────────

const CURRENT_TOOLS = [
  { value: 'none', label: 'Nothing formal', sub: 'Phone, WhatsApp, notebooks, spreadsheets' },
  { value: 'whatsapp', label: 'WhatsApp + phone', sub: 'Managing everything through WhatsApp' },
  { value: 'spreadsheets', label: 'Spreadsheets', sub: 'Excel or Google Sheets for job tracking' },
  { value: 'jobber', label: 'Jobber', sub: 'Currently on the Jobber subscription' },
  { value: 'tradify', label: 'Tradify', sub: 'Currently using Tradify' },
  { value: 'other', label: 'Other software', sub: 'Different job management tool' },
];

function StepTools({ data, update }: { data: FormData; update: (d: Partial<FormData>) => void }) {
  return (
    <div>
      <StepTitle step={3} total={6} title="What do you use now?" subtitle="We'll migrate your data for free if you're switching" />
      <div>
        {CURRENT_TOOLS.map(t => (
          <OptionCard key={t.value} selected={data.currentTools === t.value} onClick={() => update({ currentTools: t.value })}>
            <OptionLabel>{t.label}</OptionLabel>
            <OptionSub>{t.sub}</OptionSub>
          </OptionCard>
        ))}
      </div>
    </div>
  );
}

// ─── Step 5: Main Challenge ────────────────────────────────────────────────────

const CHALLENGES = [
  { value: 'missed_calls', label: 'Missed calls', sub: 'Losing jobs because I am on another job and cannot answer' },
  { value: 'admin', label: 'Too much admin', sub: 'Chasing quotes, following up, paperwork eating my time' },
  { value: 'late_payments', label: 'Late payments', sub: 'Customers not paying on time, cash flow stress' },
  { value: 'all', label: 'All of the above', sub: 'Everything needs sorting — I need the full system' },
];

function StepChallenge({ data, update }: { data: FormData; update: (d: Partial<FormData>) => void }) {
  return (
    <div>
      <StepTitle step={4} total={6} title="What's your biggest challenge?" subtitle="We'll prioritise the features that solve it" />
      <div>
        {CHALLENGES.map(c => (
          <OptionCard key={c.value} selected={data.challenge === c.value} onClick={() => update({ challenge: c.value })}>
            <OptionLabel>{c.label}</OptionLabel>
            <OptionSub>{c.sub}</OptionSub>
          </OptionCard>
        ))}
      </div>
    </div>
  );
}

// ─── Step 6: Plan ─────────────────────────────────────────────────────────────

const PLANS = [
  {
    value: 'starter',
    label: 'Starter',
    price: '£99',
    period: '/month',
    desc: 'For sole traders getting started',
    features: ['AI phone receptionist', 'Job management', 'Quotes & invoices', 'Customer database', '1 user'],
    highlight: false,
  },
  {
    value: 'pro',
    label: 'Pro',
    price: '£199',
    period: '/month',
    desc: 'For small teams who need more',
    features: ['Everything in Starter', 'Up to 5 users', 'AI voice for all engineers', 'Priority support', 'SMS notifications'],
    highlight: true,
  },
  {
    value: 'business',
    label: 'Business',
    price: '£499',
    period: '/month',
    desc: 'For established trade businesses',
    features: ['Everything in Pro', 'Unlimited users', 'Custom branding', 'API access', 'Dedicated account manager', 'White-label options'],
    highlight: false,
  },
];

function StepPlan({ data, update }: { data: FormData; update: (d: Partial<FormData>) => void }) {
  return (
    <div>
      <StepTitle step={5} total={6} title="Choose your plan" subtitle="14-day free trial. No credit card required to start." />
      <div>
        {PLANS.map(p => (
          <button
            key={p.value}
            type="button"
            onClick={() => update({ plan: p.value })}
            style={{
              width: '100%',
              padding: '20px 24px',
              border: p.highlight ? '2px solid #ff6b35' : '2px solid #e5e7eb',
              borderRadius: '12px',
              background: p.highlight ? (data.plan === p.value ? '#fff5f0' : '#fff') : (data.plan === p.value ? '#f9fafb' : '#fff'),
              cursor: 'pointer',
              textAlign: 'left',
              marginBottom: '12px',
              position: 'relative',
              boxShadow: p.highlight ? '0 4px 12px rgba(255,107,53,0.15)' : 'none',
            }}
          >
            {p.highlight && (
              <div style={{ position: 'absolute', top: '-10px', left: '16px', background: '#ff6b35', color: '#fff', fontSize: '11px', fontWeight: 700, padding: '2px 10px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Most Popular
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '18px', fontWeight: 700, color: '#1a1a1a' }}>{p.label}</span>
                <span style={{ fontSize: '13px', color: '#6b7280', marginLeft: '8px' }}>{p.desc}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '24px', fontWeight: 800, color: '#ff6b35' }}>{p.price}</span>
                <span style={{ fontSize: '13px', color: '#6b7280' }}>{p.period}</span>
              </div>
            </div>
            <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {p.features.map(f => (
                <span key={f} style={{ fontSize: '12px', background: '#f3f4f6', color: '#374151', padding: '3px 10px', borderRadius: '20px' }}>{f}</span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Success screen ────────────────────────────────────────────────────────────

function StepSuccess({ data }: { data: FormData }) {
  return (
    <div style={{ textAlign: 'center', padding: '40px 0' }}>
      <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
      <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#1a1a1a', marginBottom: '12px' }}>You're in!</h2>
      <p style={{ fontSize: '18px', color: '#6b7280', marginBottom: '32px', maxWidth: '400px', margin: '0 auto 32px' }}>
        Welcome{data.name ? `, ${data.name.split(' ')[0]}` : ''}. Your 14-day trial is active. Check your email for login details.
      </p>
      <div style={{ background: '#f3f4f6', borderRadius: '16px', padding: '24px', maxWidth: '400px', margin: '0 auto 32px', textAlign: 'left' }}>
        <p style={{ fontSize: '14px', fontWeight: 700, color: '#374151', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>What happens next</p>
        <ul style={{ fontSize: '14px', color: '#6b7280', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <li style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <span style={{ color: '#ff6b35', fontWeight: 700, flexShrink: 0 }}>1.</span>
            Check your email — your login is ready
          </li>
          <li style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <span style={{ color: '#ff6b35', fontWeight: 700, flexShrink: 0 }}>2.</span>
            Set up your AI phone in /app/settings
          </li>
          <li style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <span style={{ color: '#ff6b35', fontWeight: 700, flexShrink: 0 }}>3.</span>
            We'll send you a test call to verify everything
          </li>
          <li style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <span style={{ color: '#ff6b35', fontWeight: 700, flexShrink: 0 }}>4.</span>
            Start getting leads and managing jobs
          </li>
        </ul>
      </div>
      <Link href="/app" style={{ display: 'inline-block', background: '#ff6b35', color: '#fff', padding: '16px 40px', borderRadius: '10px', fontWeight: 700, fontSize: '16px', textDecoration: 'none' }}>
        Go to your dashboard →
      </Link>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

interface FormData {
  name: string;
  business: string;
  email: string;
  phone: string;
  password: string;
  trade: string;
  teamSize: string;
  currentTools: string;
  challenge: string;
  plan: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState<FormData>({
    name: '',
    business: '',
    email: '',
    phone: '',
    password: '',
    trade: '',
    teamSize: '',
    currentTools: '',
    challenge: '',
    plan: 'pro',
  });

  const update = (d: Partial<FormData>) => setData(prev => ({ ...prev, ...d }));

  const canNext = () => {
    switch (step) {
      case 0: return !!(data.name && data.email && data.phone && data.password.length >= 8);
      case 1: return !!data.trade;
      case 2: return !!data.teamSize;
      case 3: return !!data.currentTools;
      case 4: return !!data.challenge;
      case 5: return !!data.plan;
      default: return true;
    }
  };

  const next = () => {
    if (step < 5) setStep(step + 1);
  };
  const back = () => { if (step > 0) setStep(step - 1); };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const nameParts = data.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // 1. Create customer record in Supabase
      const { data: customerData, error: customerError } = await supabase.from('customers').insert([{
        first_name: firstName,
        last_name: lastName,
        email: data.email,
        phone: data.phone,
        business_name: data.business,
        address_line_1: '',
        city: '',
        postcode: '',
        status: 'prospect',
      }]).select('id').single();
      if (customerError) throw new Error(customerError.message);

      // 2. Create onboarding profile with all trade/business data
      const { error: profileError } = await supabase.from('onboarding_profiles').insert([{
        customer_id: customerData.id,
        trade: data.trade,
        team_size: data.teamSize,
        current_tools: data.currentTools,
        challenge: data.challenge,
        plan: data.plan,
        trial_ends: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        onboarding_completed: true,
      }]);
      if (profileError) console.error('Profile error:', profileError.message);
      // Don't throw — customer was created successfully

      // 3. TODO: Create Stripe subscription (after Freddie adds Stripe keys)
      // For now: redirect to dashboard

      setStep(7); // success step
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: '#f9fafb',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
  };

  const cardStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '560px',
    background: '#fff',
    borderRadius: '24px',
    padding: '40px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
  };

  return (
    <div style={containerStyle}>
      <div style={{ marginBottom: '24px', textAlign: 'center' }}>
        <Link href="/" style={{ fontSize: '22px', fontWeight: 800, color: '#ff6b35', textDecoration: 'none' }}>
          Trademate<span style={{ color: '#1a1a1a' }}>AI</span>
        </Link>
      </div>
      <div style={cardStyle}>
        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>
            {error}
          </div>
        )}
        {step === 0 && <StepAccount data={data} update={update} />}
        {step === 1 && <StepTrade data={data} update={update} />}
        {step === 2 && <StepTeam data={data} update={update} />}
        {step === 3 && <StepTools data={data} update={update} />}
        {step === 4 && <StepChallenge data={data} update={update} />}
        {step === 5 && <StepPlan data={data} update={update} />}
        {step === 7 && <StepSuccess data={data} />}
        {step < 6 && (
          <NavButtons
            back={step > 0 ? back : undefined}
            next={step < 5 ? next : handleSubmit}
            canNext={canNext()}
            nextLabel={step === 5 ? `Start 14-Day Free Trial →` : 'Continue'}
            loading={loading}
          />
        )}
        {step === 5 && (
          <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '12px', color: '#9ca3af' }}>
            By starting your trial you agree to our Terms of Service. No card required — you'll be asked for payment details after 14 days.
          </p>
        )}
      </div>
    </div>
  );
}
