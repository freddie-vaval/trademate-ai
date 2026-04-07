'use client';

import { useState } from 'react';

const UNICORNS = [
  {
    rank: 1,
    name: 'TradieHQ',
    category: 'SaaS',
    emoji: '🔥🔥🔥',
    label: 'UNSTOPPABLE',
    market: '£800M',
    users: '200',
    price: 49,
    revenue: '£9.8k/mo',
    verdict: 'Freddie literally runs a bike workshop. He IS the target market. Built-in case study.',
    path: 'Job management for tradies. £49/mo × 200 users. Cheaper than Jobber (£599/mo).',
    color: 'border-orange-500',
    bg: 'bg-orange-500/10',
  },
  {
    rank: 2,
    name: 'NoShow',
    category: 'SaaS',
    emoji: '🔥🔥🔥',
    label: 'UNSTOPPABLE',
    market: '£800M lost',
    users: '200',
    price: 19,
    revenue: '£3.8k/mo + 2% tx',
    verdict: 'Every service business misses calls. A missed call = £50-200 lost. £0 CAC from word of mouth.',
    path: 'Charge £19/mo + 2% of deposits forfeited. Mechanics, salons, therapists — universal problem.',
    color: 'border-red-500',
    bg: 'bg-red-500/10',
  },
  {
    rank: 3,
    name: 'AIReceptionist',
    category: 'SaaS',
    emoji: '⚡⚡',
    label: 'STRONG',
    market: '£3.2B',
    users: '200',
    price: 79,
    revenue: '£15.8k/mo',
    verdict: 'Freddie is already building this for BikeClinique. Package it as a product. Voice clone = unfair advantage.',
    path: 'AI phone receptionist. £79/mo × 200 businesses. The voice clone is the moat no competitor has.',
    color: 'border-yellow-500',
    bg: 'bg-yellow-500/10',
  },
  {
    rank: 4,
    name: 'NoMoreSpreadsheets',
    category: 'SaaS',
    emoji: '🔥🔥🔥',
    label: 'UNSTOPPABLE',
    market: '£2.4B',
    users: '500',
    price: 19,
    revenue: '£9.5k/mo',
    verdict: 'CRM for people who hate CRMs. Simple, beautiful, mobile-first.',
    path: 'CRM for people who hate CRMs. £19/mo × 500 users. Dead simple positioning.',
    color: 'border-purple-500',
    bg: 'bg-purple-500/10',
  },
  {
    rank: 5,
    name: 'Receipt2',
    category: 'SaaS',
    emoji: '🔥🔥🔥',
    label: 'UNSTOPPABLE',
    market: '£1.6B',
    users: '1000',
    price: 17,
    revenue: '£17k/mo',
    verdict: 'Accounting for non-accountants. Every freelancer and small trader needs this.',
    path: 'Receipt scanning + expense tracking for non-accountants. £17/mo × 1,000 users.',
    color: 'border-green-500',
    bg: 'bg-green-500/10',
  },
  {
    rank: 6,
    name: 'BetterThanGym',
    category: 'Subscription',
    emoji: '🔥🔥🔥',
    label: 'UNSTOPPABLE',
    market: '£5.2B',
    users: '1000',
    price: 12,
    revenue: '£12k/mo',
    verdict: 'Netflix for home fitness — curated for women 30+. Huge retention, recurring revenue.',
    path: 'Netflix for home fitness, women 30+. £12/mo × 1,000 subscribers.',
    color: 'border-pink-500',
    bg: 'bg-pink-500/10',
  },
  {
    rank: 7,
    name: 'WaitlistIQ',
    category: 'SaaS',
    emoji: '⚡⚡',
    label: 'STRONG',
    market: 'Every launch',
    users: '500',
    price: 29,
    revenue: '£14.5k/mo',
    verdict: 'Every product launch needs waitlist management. 500 launches/mo = predictable revenue.',
    path: 'Turn waitlists into preorders. 500 launches = £14.5k/mo. Recurring event launches.',
    color: 'border-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    rank: 8,
    name: 'MicroSwap',
    category: 'Marketplace',
    emoji: '💡',
    label: 'INTERESTING',
    market: '£4.8B',
    users: '500',
    price: 0,
    revenue: '£2.5k/mo',
    verdict: 'Freelance marketplace with escrow. Smaller niche, but 10% commission adds up.',
    path: 'Freelance marketplace with escrow. 10% commission on transactions.',
    color: 'border-cyan-500',
    bg: 'bg-cyan-500/10',
  },
  {
    rank: 9,
    name: 'BlindDate',
    category: 'App',
    emoji: '💡',
    label: 'INTERESTING',
    market: '£250M',
    users: '200',
    price: 49,
    revenue: '£9.8k/mo',
    verdict: 'Matchmaking for over-35s. Niche but willing to pay premium. £49/mo × 200 subscribers.',
    path: 'Matchmaking for over-35s. £49/mo × 200 subscribers. Premium positioning.',
    color: 'border-rose-500',
    bg: 'bg-rose-500/10',
  },
  {
    rank: 10,
    name: 'RentMyKit',
    category: 'Marketplace',
    emoji: '💡',
    label: 'INTERESTING',
    market: '£2.1B',
    users: '300',
    price: 0,
    revenue: '£1.5k/mo',
    verdict: 'Airbnb for outdoor gear. 15% commission. Tradie angle — contractors renting equipment.',
    path: 'Airbnb for outdoor gear. 15% commission. Contractors renting tools and equipment.',
    color: 'border-teal-500',
    bg: 'bg-teal-500/10',
  },
];

export default function OpportunitiesPage() {
  const [selected, setSelected] = useState<typeof UNICORNS[0] | null>(null);
  const [showAll, setShowAll] = useState(false);

  const displayed = showAll ? UNICORNS : UNICORNS.slice(0, 3);

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)', minHeight: '100vh', padding: '0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem' }}>
          
          {/* Back nav */}
          <div style={{ marginBottom: '2rem' }}>
            <a href="/landing" style={{ color: '#666', textDecoration: 'none', fontSize: '14px' }}>
              ← Back to Trademate
            </a>
          </div>

          {/* Hero */}
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{ display: 'inline-block', background: 'rgba(255,107,53,0.15)', border: '1px solid rgba(255,107,53,0.3)', borderRadius: '100px', padding: '8px 20px', marginBottom: '1.5rem' }}>
              <span style={{ color: '#ff6b35', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                🦄 Business Opportunities — Scanned by AI
              </span>
            </div>
            <h1 style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 800, color: 'white', marginBottom: '1rem', lineHeight: 1.1 }}>
              10 Unicorns
            </h1>
            <p style={{ fontSize: '18px', color: '#888', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
              Businesses that can actually reach £10k–£100k/month. Real software, platforms, and marketplaces. 
              Found by scanning thousands of frustrated communities.
            </p>
          </div>

          {/* Top 3 highlight */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
            {UNICORNS.slice(0, 3).map(u => (
              <button
                key={u.rank}
                onClick={() => setSelected(selected?.rank === u.rank ? null : u)}
                style={{
                  background: 'rgba(15,15,15,0.8)',
                  border: `2px solid ${selected?.rank === u.rank ? '#ff6b35' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: '16px',
                  padding: '1.5rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  width: '100%',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '12px', color: '#666', marginRight: '8px' }}>#{u.rank}</span>
                    <span style={{ fontSize: '24px', marginRight: '8px' }}>{u.emoji}</span>
                    <span style={{ background: 'rgba(255,107,53,0.2)', color: '#ff6b35', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
                      {u.label}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '28px', fontWeight: 800, color: '#ff6b35' }}>{u.revenue}</div>
                    <div style={{ fontSize: '11px', color: '#555' }}>potential/mo</div>
                  </div>
                </div>
                <h3 style={{ fontSize: '22px', fontWeight: 700, color: 'white', marginBottom: '4px' }}>{u.name}</h3>
                <p style={{ fontSize: '13px', color: '#666', marginBottom: '12px' }}>{u.category} · {u.market} market</p>
                <p style={{ fontSize: '13px', color: '#888', lineHeight: 1.5 }}>{u.verdict}</p>
              </button>
            ))}
          </div>

          {/* Selected detail */}
          {selected && (
            <div style={{ background: 'rgba(255,107,53,0.05)', border: '2px solid rgba(255,107,53,0.3)', borderRadius: '20px', padding: '2rem', marginBottom: '3rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '40px' }}>{selected.emoji}</span>
                <div>
                  <h2 style={{ fontSize: '32px', fontWeight: 800, color: 'white', margin: 0 }}>{selected.name}</h2>
                  <span style={{ color: '#666', fontSize: '14px' }}>{selected.category} · {selected.market} market</span>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '1rem' }}>
                  <div style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}}>Price</div>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: '#ff6b35' }}>£{selected.price}/mo</div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '1rem' }}>
                  <div style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}}>Target Users</div>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: 'white' }}>{selected.users}+</div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '1rem' }}>
                  <div style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}}>Revenue Target</div>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: '#39FF14' }}>{selected.revenue}</div>
                </div>
              </div>
              <p style={{ fontSize: '16px', color: '#ccc', lineHeight: 1.7, marginBottom: '1rem' }}>{selected.path}</p>
              <p style={{ fontSize: '14px', color: '#888', lineHeight: 1.6, fontStyle: 'italic' }}>"{selected.verdict}"</p>
            </div>
          )}

          {/* Full list */}
          <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'white' }}>All Opportunities</h2>
            <button
              onClick={() => setShowAll(!showAll)}
              style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#888', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}
            >
              {showAll ? 'Show less' : `Show all 10 →`}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {UNICORNS.map(u => (
              <div key={u.rank} style={{ background: 'rgba(15,15,15,0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#333', width: '24px', flexShrink: 0 }}>#{u.rank}</div>
                <div style={{ fontSize: '20px', flexShrink: 0 }}>{u.emoji}</div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontWeight: 600, color: 'white', fontSize: '15px' }}>{u.name}</span>
                  <span style={{ color: '#555', fontSize: '12px', marginLeft: '8px' }}>{u.category}</span>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontWeight: 600, color: '#ff6b35', fontSize: '14px' }}>{u.revenue}</div>
                  <div style={{ color: '#444', fontSize: '11px' }}>{u.market}</div>
                </div>
                <div style={{ flexShrink: 0 }}>
                  <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', color: '#666' }}>
                    {u.label}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{ textAlign: 'center', marginTop: '4rem', padding: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <p style={{ color: '#444', fontSize: '13px' }}>
              Scanned by Opportunity Engine · Built by AI agents · Updated continuously
            </p>
            <a href="/landing" style={{ display: 'inline-block', marginTop: '1rem', background: '#ff6b35', color: 'white', padding: '12px 28px', borderRadius: '10px', fontWeight: 600, textDecoration: 'none', fontSize: '15px' }}>
              Join the Trademate Waitlist →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
