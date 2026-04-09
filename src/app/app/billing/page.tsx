'use client';

import { useState } from 'react';
import Link from 'next/link';

const PLANS = [
  { id: 'starter', name: 'Starter', price: 99, features: ['AI phone receptionist', 'Job management', 'Quotes & invoices', 'Customer database', '1 user'] },
  { id: 'pro', name: 'Pro', price: 199, features: ['Everything in Starter', 'Up to 5 users', 'AI voice for all engineers', 'Priority support', 'SMS notifications'], popular: true },
  { id: 'business', name: 'Business', price: 499, features: ['Everything in Pro', 'Unlimited users', 'Custom branding', 'API access', 'Dedicated account manager', 'White-label options'] },
];

export default function BillingPage() {
  const [currentPlan] = useState('pro'); // TODO: load from user profile
  const [showCancel, setShowCancel] = useState(false);

  return (
    <div style={{ padding: '24px', fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif', background: '#f9fafb', minHeight: '100vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <Link href="/app" style={{ fontSize: '13px', color: '#6b7280', textDecoration: 'none', display: 'block', marginBottom: '4px' }}>← Back to Dashboard</Link>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#1a1a1a', margin: 0 }}>Billing & Plan</h1>
          </div>
        </div>

        {/* Current plan */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <p style={{ fontSize: '13px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Current Plan</p>
              <p style={{ fontSize: '32px', fontWeight: 800, color: '#ff6b35', margin: 0 }}>
                {PLANS.find(p => p.id === currentPlan)?.name || 'Pro'}
                <span style={{ fontSize: '16px', color: '#9ca3af', fontWeight: 400 }}> — £{PLANS.find(p => p.id === currentPlan)?.price || 199}/month</span>
              </p>
            </div>
            <div style={{ background: '#d1fae5', color: '#065f46', fontSize: '13px', fontWeight: 700, padding: '6px 14px', borderRadius: '20px' }}>
              Active — 14 days left on trial
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', padding: '20px', background: '#f9fafb', borderRadius: '12px', marginBottom: '20px' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '24px', fontWeight: 800, color: '#1a1a1a', margin: '0 0 2px' }}>£99</p>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>Next payment</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '24px', fontWeight: 800, color: '#1a1a1a', margin: '0 0 2px' }}>Apr 23</p>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>Trial ends</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '24px', fontWeight: 800, color: '#1a1a1a', margin: '0 0 2px' }}>5</p>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>Team members</p>
            </div>
          </div>

          <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px' }}>
            No payment required until your trial ends. Add payment details to continue automatically.
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button style={{ padding: '12px 24px', background: '#ff6b35', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>
              Add Payment Details
            </button>
            <button
              onClick={() => setShowCancel(true)}
              style={{ padding: '12px 24px', background: 'none', color: '#9ca3af', border: 'none', fontSize: '14px', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Cancel trial
            </button>
          </div>
        </div>

        {/* Plan comparison */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#1a1a1a', marginBottom: '20px' }}>All Plans</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {PLANS.map(plan => (
              <div
                key={plan.id}
                style={{
                  border: plan.popular ? '2px solid #ff6b35' : '2px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '20px',
                  position: 'relative',
                  background: plan.popular ? '#fff5f0' : '#fff',
                }}
              >
                {plan.popular && (
                  <div style={{ position: 'absolute', top: '-10px', left: '16px', background: '#ff6b35', color: '#fff', fontSize: '11px', fontWeight: 700, padding: '2px 10px', borderRadius: '20px' }}>
                    Current Plan
                  </div>
                )}
                <p style={{ fontSize: '18px', fontWeight: 800, color: '#1a1a1a', marginBottom: '4px' }}>{plan.name}</p>
                <p style={{ fontSize: '28px', fontWeight: 800, color: '#ff6b35', marginBottom: '16px' }}>£{plan.price}<span style={{ fontSize: '14px', color: '#9ca3af', fontWeight: 400 }}>/month</span></p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px' }}>
                  {plan.features.map(f => (
                    <li key={f} style={{ fontSize: '13px', color: '#374151', padding: '4px 0', display: 'flex', gap: '8px' }}>
                      <span style={{ color: '#10b981', fontWeight: 700 }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <button
                  disabled={plan.id === currentPlan}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: plan.id === currentPlan ? '2px solid #e5e7eb' : '2px solid #ff6b35',
                    background: plan.id === currentPlan ? '#f3f4f6' : '#ff6b35',
                    color: plan.id === currentPlan ? '#9ca3af' : '#fff',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: plan.id === currentPlan ? 'default' : 'pointer',
                  }}
                >
                  {plan.id === currentPlan ? 'Current Plan' : 'Switch to ' + plan.name}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Payment method */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#1a1a1a', marginBottom: '16px' }}>Payment Method</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', border: '2px dashed #e5e7eb', borderRadius: '12px', color: '#9ca3af', fontSize: '14px' }}>
            💳 No payment method added yet. Add one to continue after your trial.
          </div>
        </div>

        {showCancel && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
            <div style={{ background: '#fff', borderRadius: '20px', padding: '32px', maxWidth: '440px', width: '90%' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#1a1a1a', marginBottom: '12px' }}>Cancel your trial?</h3>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>
                You'll lose access to the AI phone, job management, and all features at the end of your 14-day trial. Your data will be kept for 30 days in case you change your mind.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setShowCancel(false)}
                  style={{ flex: 1, padding: '12px', border: '2px solid #e5e7eb', borderRadius: '10px', background: '#fff', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}
                >
                  Keep my trial
                </button>
                <button
                  onClick={() => setShowCancel(false)}
                  style={{ flex: 1, padding: '12px', border: 'none', borderRadius: '10px', background: '#ef4444', color: '#fff', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}
                >
                  Cancel trial
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
