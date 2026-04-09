'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ekzuplrsptshriwazeur.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrenVwbHJzcHRzaHJpd2F6ZXVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NjI4NTUsImV4cCI6MjA5MDUzODg1NX0.cAzLzlJUQSaYV8NtpEoZQoov39trGcELjt0G9GGNHzM'
);

type Opportunity = {
  id: string;
  name: string;
  email: string;
  phone: string;
  business: string;
  trade: string;
  source: string;
  status: 'new' | 'contacted' | 'quoted' | 'won' | 'lost';
  notes: string;
  created_at: string;
};

const STATUS_LABELS: Record<Opportunity['status'], string> = {
  new: 'New',
  contacted: 'Contacted',
  quoted: 'Quoted',
  won: 'Won',
  lost: 'Lost',
};

const STATUS_COLORS: Record<Opportunity['status'], string> = {
  new: 'background: #dbeafe; color: #1d4ed8;',
  contacted: 'background: #fef3c7; color: #92400e;',
  quoted: 'background: #ede9fe; color: #6d28d9;',
  won: 'background: #d1fae5; color: #065f46;',
  lost: 'background: #f3f4f6; color: #6b7280;',
};

const TRADE_LABELS: Record<string, string> = {
  plumber: 'Plumber',
  electrician: 'Electrician',
  builder: 'Builder',
  hvac: 'HVAC / Heating',
  roofer: 'Roofer',
  carpenter: 'Carpenter',
  painter: 'Painter',
  landscaper: 'Landscaper',
  other: 'Other',
};

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Opportunity['status'] | 'all'>('all');
  const [selected, setSelected] = useState<Opportunity | null>(null);
  const [note, setNote] = useState('');

  useEffect(() => {
    loadOpportunities();
  }, []);

  async function loadOpportunities() {
    setLoading(true);
    try {
      // Try to load from waitlist table (rename to opportunities conceptually)
      const { data, error } = await supabase
        .from('waitlist')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Map waitlist entries to opportunities format
      const mapped: Opportunity[] = (data || []).map((row: any) => ({
        id: row.id,
        name: row.name || '',
        email: row.email || '',
        phone: row.phone || '',
        business: row.business || '',
        trade: row.trade || '',
        source: row.source || 'website',
        status: (row.status as Opportunity['status']) || 'new',
        notes: row.notes || '',
        created_at: row.created_at || '',
      }));

      setOpportunities(mapped);
    } catch (err) {
      console.error('Error loading opportunities:', err);
      // Fall back to seed data
      setOpportunities(SEED_OPPORTUNITIES);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: Opportunity['status']) {
    try {
      const { error } = await supabase
        .from('waitlist')
        .update({ status })
        .eq('id', id);
      if (!error) {
        setOpportunities(prev => prev.map(o => o.id === id ? { ...o, status } : o));
        if (selected?.id === id) setSelected({ ...selected, status });
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  }

  async function addNote(id: string) {
    if (!note.trim()) return;
    try {
      const current = opportunities.find(o => o.id === id);
      const newNotes = `${current?.notes || ''}\n[${new Date().toLocaleDateString('en-GB')}] ${note.trim()}`;
      const { error } = await supabase
        .from('waitlist')
        .update({ notes: newNotes })
        .eq('id', id);
      if (!error) {
        setOpportunities(prev => prev.map(o => o.id === id ? { ...o, notes: newNotes } : o));
        if (selected?.id === id) setSelected({ ...selected, notes: newNotes });
        setNote('');
      }
    } catch (err) {
      console.error('Error adding note:', err);
    }
  }

  const filtered = filter === 'all' ? opportunities : opportunities.filter(o => o.status === filter);
  const counts = {
    all: opportunities.length,
    new: opportunities.filter(o => o.status === 'new').length,
    contacted: opportunities.filter(o => o.status === 'contacted').length,
    quoted: opportunities.filter(o => o.status === 'quoted').length,
    won: opportunities.filter(o => o.status === 'won').length,
    lost: opportunities.filter(o => o.status === 'lost').length,
  };

  return (
    <div style={{ padding: '24px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', background: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1a1a1a' }}>Leads & Opportunities</h1>
          <Link href="/app" style={{ fontSize: '14px', color: '#6b7280', textDecoration: 'none' }}>← Back to Dashboard</Link>
        </div>
        <p style={{ fontSize: '14px', color: '#6b7280' }}>
          {opportunities.length === 0 ? 'No leads yet — share your link to start generating leads' : `${opportunities.length} total leads`}
        </p>
      </div>

      {/* Status filters */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {(['all', 'new', 'contacted', 'quoted', 'won', 'lost'] as const).map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              border: 'none',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              background: filter === s ? '#ff6b35' : '#fff',
              color: filter === s ? '#fff' : '#6b7280',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}
          >
            {s === 'all' ? 'All' : STATUS_LABELS[s]} {counts[s] > 0 && `(${counts[s]})`}
          </button>
        ))}
      </div>

      {/* Kanban-style columns on desktop, list on mobile */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {(filter === 'all' ? (['new', 'contacted', 'quoted', 'won', 'lost'] as const) : [filter]).map(status => {
          const items = opportunities.filter(o => o.status === status);
          if (filter !== 'all' && items.length === 0) return null;
          return (
            <div key={status}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: status === 'new' ? '#3b82f6' : status === 'won' ? '#10b981' : status === 'lost' ? '#9ca3af' : '#f59e0b' }} />
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {STATUS_LABELS[status]}
                  </span>
                </div>
                <span style={{ fontSize: '12px', background: '#f3f4f6', color: '#6b7280', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>
                  {items.length}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {items.length === 0 && (
                  <div style={{ background: '#fff', border: '2px dashed #e5e7eb', borderRadius: '12px', padding: '20px', textAlign: 'center', color: '#9ca3af', fontSize: '13px' }}>
                    No leads
                  </div>
                )}
                {items.map(o => (
                  <div
                    key={o.id}
                    onClick={() => setSelected(o)}
                    style={{
                      background: '#fff',
                      borderRadius: '12px',
                      padding: '16px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                      cursor: 'pointer',
                      border: selected?.id === o.id ? '2px solid #ff6b35' : '2px solid transparent',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div>
                        <p style={{ fontWeight: 700, color: '#1a1a1a', fontSize: '15px', margin: 0 }}>{o.name || 'Unnamed'}</p>
                        {o.business && <p style={{ fontSize: '13px', color: '#6b7280', margin: '2px 0 0' }}>{o.business}</p>}
                      </div>
                      {o.trade && (
                        <span style={{ fontSize: '11px', background: '#f3f4f6', color: '#374151', padding: '2px 8px', borderRadius: '10px', fontWeight: 500 }}>
                          {TRADE_LABELS[o.trade] || o.trade}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '13px', color: '#6b7280' }}>
                      {o.phone && <div>📞 {o.phone}</div>}
                      {o.email && <div>✉️ {o.email}</div>}
                    </div>
                    <div style={{ marginTop: '8px', fontSize: '11px', color: '#9ca3af' }}>
                      {o.created_at ? new Date(o.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : ''}
                      {o.source !== 'website' && ` · ${o.source}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Lead detail sidebar */}
      {selected && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: '400px',
            height: '100vh',
            background: '#fff',
            boxShadow: '-4px 0 24px rgba(0,0,0,0.1)',
            padding: '24px',
            overflowY: 'auto',
            zIndex: 100,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1a1a1a' }}>{selected.name || 'Lead Details'}</h2>
            <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#9ca3af' }}>×</button>
          </div>

          {selected.business && (
            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontSize: '12px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Business</p>
              <p style={{ fontSize: '15px', color: '#1a1a1a', fontWeight: 600 }}>{selected.business}</p>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
            {selected.phone && (
              <div style={{ background: '#f9fafb', padding: '12px', borderRadius: '10px' }}>
                <p style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>PHONE</p>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a1a' }}>{selected.phone}</p>
              </div>
            )}
            {selected.email && (
              <div style={{ background: '#f9fafb', padding: '12px', borderRadius: '10px' }}>
                <p style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>EMAIL</p>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a1a', wordBreak: 'break-all' }}>{selected.email}</p>
              </div>
            )}
          </div>

          {selected.trade && (
            <div style={{ marginBottom: '20px' }}>
              <p style={{ fontSize: '12px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Trade</p>
              <p style={{ fontSize: '15px', color: '#1a1a1a' }}>{TRADE_LABELS[selected.trade] || selected.trade}</p>
            </div>
          )}

          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontSize: '12px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Status</p>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {(['new', 'contacted', 'quoted', 'won', 'lost'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => updateStatus(selected.id, s)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: selected.status === s ? '#ff6b35' : '#f3f4f6',
                    color: selected.status === s ? '#fff' : '#6b7280',
                  }}
                >
                  {STATUS_LABELS[s]}
                </button>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          {selected.email && (
            <div style={{ marginBottom: '20px' }}>
              <a
                href={`mailto:${selected.email}`}
                style={{ display: 'block', background: '#ff6b35', color: '#fff', textAlign: 'center', padding: '12px', borderRadius: '10px', textDecoration: 'none', fontWeight: 700, fontSize: '14px', marginBottom: '8px' }}
              >
                ✉️ Send Email
              </a>
              {selected.phone && (
                <a
                  href={`tel:${selected.phone}`}
                  style={{ display: 'block', background: '#1a1a1a', color: '#fff', textAlign: 'center', padding: '12px', borderRadius: '10px', textDecoration: 'none', fontWeight: 700, fontSize: '14px' }}
                >
                  📞 Call {selected.phone}
                </a>
              )}
            </div>
          )}

          {/* Notes */}
          <div>
            <p style={{ fontSize: '12px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Notes</p>
            {selected.notes && (
              <div style={{ background: '#f9fafb', borderRadius: '10px', padding: '12px', marginBottom: '12px', fontSize: '13px', color: '#374151', whiteSpace: 'pre-wrap' }}>
                {selected.notes}
              </div>
            )}
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={note}
                onChange={e => setNote(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addNote(selected.id)}
                placeholder="Add a note and press Enter..."
                style={{ flex: 1, padding: '10px 12px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', outline: 'none' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const SEED_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'seed-1',
    name: 'James Wilson',
    email: 'james@wplumbing.co.uk',
    phone: '07900 123456',
    business: 'Wilson Plumbing & Heating',
    trade: 'plumber',
    source: 'website',
    status: 'new',
    notes: '',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'seed-2',
    name: 'Sarah Chen',
    email: 'sarah@brightelec.co.uk',
    phone: '07800 654321',
    business: 'Bright Electrical',
    trade: 'electrician',
    source: 'Google Ads',
    status: 'contacted',
    notes: '[Apr 6] Called — voicemail. Will try again tomorrow.',
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'seed-3',
    name: 'Mike Thompson',
    email: 'mike@tomsbuild.co.uk',
    phone: '07500 111222',
    business: 'Thompson Builders',
    trade: 'builder',
    source: 'Facebook',
    status: 'quoted',
    notes: '[Apr 5] Sent Pro plan quote. Waiting for response.',
    created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
