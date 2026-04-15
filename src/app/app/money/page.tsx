'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useCustomers, useQuotes, useInvoices, formatMoney, fullName } from '@/lib/data-store';
import { Quote, Invoice } from '@/lib/types';

const tabs = [
  { id: 'app', label: '📋 Jobs', href: '/app' },
  { id: 'customers', label: '👥 Customers', href: '/app/customers' },
  { id: 'money', label: '💰 Money', href: '/app/money' },
];

const servicePresets = [
  { label: 'Full Service', price: 220 },
  { label: 'MOT', price: 49.99 },
  { label: 'Custom', price: 0 },
];

export default function MoneyPage() {
  const [customers, , customersHydrated] = useCustomers();
  const [quotes, setQuotes, quotesHydrated] = useQuotes();
  const [invoices, setInvoices, invoicesHydrated] = useInvoices();
  const [loading, setLoading] = useState(true);
  const [showQuickQuote, setShowQuickQuote] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [customPrice, setCustomPrice] = useState('');

  useEffect(() => {
    if (customersHydrated && quotesHydrated && invoicesHydrated) setLoading(false);
  }, [customersHydrated, quotesHydrated, invoicesHydrated]);

  // Merge quotes + invoices
  const allItems = useMemo(() => {
    const quoteItems: Array<{ id: string; type: 'quote'; date: string; customerId: string; amount: number; status: string; label: string }> = quotes.map(q => ({
      id: q.id,
      type: 'quote' as const,
      date: q.createdAt,
      customerId: q.customerId,
      amount: q.total,
      status: q.status,
      label: `Quote: ${q.serviceType}`,
    }));
    const invoiceItems: Array<{ id: string; type: 'invoice'; date: string; customerId: string; amount: number; status: string; label: string }> = invoices.map(i => ({
      id: i.id,
      type: 'invoice' as const,
      date: i.createdAt,
      customerId: i.customerId,
      amount: i.total,
      status: i.status,
      label: `Invoice: ${i.notes || 'Service'}`,
    }));
    return [...quoteItems, ...invoiceItems].sort((a, b) => b.date.localeCompare(a.date));
  }, [quotes, invoices]);

  const unpaid = allItems.filter(i => i.status !== 'paid');
  const paid = allItems.filter(i => i.status === 'paid');

  const customerMap = new Map(customers.map(c => [c.id, c]));

  const sendQuickQuote = () => {
    if (!selectedCustomerId) return;
    const preset = servicePresets[selectedPreset];
    const price = selectedPreset === 2 ? parseFloat(customPrice) || 0 : preset.price;
    if (price <= 0) return;

    const now = new Date();
    const validUntil = new Date(now);
    validUntil.setDate(validUntil.getDate() + 30);
    const subtotal = price;
    const vatRate = 20;
    const total = subtotal * (1 + vatRate / 100);

    const newQuote: Quote = {
      id: `QT-${Date.now()}`,
      customerId: selectedCustomerId,
      serviceType: preset.label === 'Custom' ? 'Custom Service' : preset.label,
      details: '',
      status: 'sent',
      items: [{ description: `${preset.label === 'Custom' ? 'Custom Service' : preset.label} labour`, quantity: 1, unitPrice: subtotal }],
      subtotal,
      vatRate,
      total,
      validUntil: validUntil.toISOString().slice(0, 10),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    setQuotes([newQuote, ...quotes]);
    setShowQuickQuote(false);
    setSelectedCustomerId('');
    setSelectedPreset(0);
    setCustomPrice('');
  };

  const markPaid = (item: typeof allItems[0]) => {
    if (item.type === 'quote') {
      setQuotes(quotes.map(q => q.id === item.id ? { ...q, status: 'accepted' as const, updatedAt: new Date().toISOString() } : q));
    } else {
      setInvoices(invoices.map(i => i.id === item.id ? { ...i, status: 'paid' as const, updatedAt: new Date().toISOString() } : i));
    }
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
            <Link key={tab.id} href={tab.href} style={{ padding: '1rem 0.5rem', fontWeight: '500', borderBottom: '2px solid #e5e7eb', color: '#6b7280', textDecoration: 'none' }}>
              {tab.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ maxWidth: '80rem', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Quick Quote button */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={() => setShowQuickQuote(true)}
            style={{ backgroundColor: '#2563eb', color: 'white', padding: '0.625rem 1.25rem', borderRadius: '0.5rem', fontWeight: '500', border: 'none', cursor: 'pointer', fontSize: '0.875rem' }}
          >
            + Quick Quote
          </button>
        </div>

        {/* Unpaid section */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', marginBottom: '0.75rem' }}>UNPAID ({unpaid.length})</h2>
          {unpaid.length === 0 ? (
            <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Nothing owed — all clear! ✅</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {unpaid.map(item => {
                const customer = customerMap.get(item.customerId);
                return (
                  <div key={`${item.type}-${item.id}`} style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '0.875rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
                    <div>
                      <p style={{ fontWeight: '500', color: '#374151', fontSize: '0.875rem' }}>
                        {customer ? fullName(customer) : 'Unknown'} · {item.label}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.125rem' }}>
                        {item.type === 'quote' ? 'Quote' : 'Invoice'} · {item.date.slice(0, 10)}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontWeight: '600', color: '#dc2626', fontSize: '0.875rem' }}>{formatMoney(item.amount)}</span>
                      <button
                        onClick={() => markPaid(item)}
                        style={{ fontSize: '0.75rem', fontWeight: '500', color: '#16a34a', background: 'none', border: '1px solid #bbf7d0', borderRadius: '0.375rem', padding: '0.25rem 0.625rem', cursor: 'pointer' }}
                      >
                        Mark Paid
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Paid section */}
        <div>
          <h2 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', marginBottom: '0.75rem' }}>PAID ({paid.length})</h2>
          {paid.length === 0 ? (
            <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>No payments recorded yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {paid.map(item => {
                const customer = customerMap.get(item.customerId);
                return (
                  <div key={`${item.type}-${item.id}`} style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e5e7eb' }}>
                    <div>
                      <p style={{ fontWeight: '500', color: '#374151', fontSize: '0.875rem' }}>
                        {customer ? fullName(customer) : 'Unknown'} · {item.label}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.125rem' }}>
                        {item.date.slice(0, 10)}
                      </p>
                    </div>
                    <span style={{ fontWeight: '600', color: '#16a34a', fontSize: '0.875rem' }}>{formatMoney(item.amount)}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Quick Quote Modal */}
      {showQuickQuote && (
        <div style={{ position: 'fixed', inset: '0', zIndex: '50', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', padding: '1rem' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', maxWidth: '28rem', width: '100%' }}>
            <div style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#111827' }}>Quick Quote</h2>
              <button onClick={() => setShowQuickQuote(false)} style={{ borderRadius: '0.375rem', padding: '0.25rem 0.5rem', color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.375rem' }}>Customer</label>
                <select
                  value={selectedCustomerId}
                  onChange={e => setSelectedCustomerId(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                >
                  <option value=''>Select customer...</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{fullName(c)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.375rem' }}>Service</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {servicePresets.map((preset, i) => (
                    <button
                      key={preset.label}
                      onClick={() => setSelectedPreset(i)}
                      style={{ flex: 1, padding: '0.5rem', borderRadius: '0.5rem', fontWeight: '500', fontSize: '0.875rem', border: '1px solid', borderColor: selectedPreset === i ? '#2563eb' : '#d1d5db', backgroundColor: selectedPreset === i ? '#eff6ff' : 'white', color: selectedPreset === i ? '#2563eb' : '#6b7280', cursor: 'pointer' }}
                    >
                      {preset.label}<br />
                      <span style={{ fontSize: '0.75rem', fontWeight: '400' }}>{preset.price > 0 ? `£${preset.price}` : '£--'}</span>
                    </button>
                  ))}
                </div>
              </div>

              {selectedPreset === 2 && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.375rem' }}>Custom Price (£)</label>
                  <input
                    type='number'
                    value={customPrice}
                    onChange={e => setCustomPrice(e.target.value)}
                    placeholder='0.00'
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                  />
                </div>
              )}

              <button
                onClick={sendQuickQuote}
                disabled={!selectedCustomerId}
                style={{ marginTop: '0.5rem', padding: '0.625rem', borderRadius: '0.5rem', backgroundColor: selectedCustomerId ? '#2563eb' : '#d1d5db', color: 'white', fontWeight: '600', fontSize: '0.875rem', border: 'none', cursor: selectedCustomerId ? 'pointer' : 'not-allowed' }}
              >
                Send Quote
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
