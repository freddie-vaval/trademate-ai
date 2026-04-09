'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ekzuplrsptshriwazeur.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrenVwbHJzcHRzaHJpd2F6ZXVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NjI4NTUsImV4cCI6MjA5MDUzODg1NX0.cAzLzlJUQSaYV8NtpEoZQoov39trGcELjt0G9GGNHzM'
);

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  read: boolean;
  created_at: string;
}

const PRIORITY_COLORS = {
  high: { bg: '#fef2f2', border: '#fecaca', text: '#dc2626' },
  medium: { bg: '#fffbeb', border: '#fde68a', text: '#d97706' },
  low: { bg: '#f9fafb', border: '#e5e7eb', text: '#6b7280' },
};

const TYPE_ICONS: Record<string, string> = {
  new_lead: '📞',
  subscription_activated: '💳',
  subscription_cancelled: '❌',
  payment_failed: '⚠️',
  callback_requested: '📲',
  call_failed: '📵',
  job_completed: '✅',
  quote_sent: '📄',
  quote_accepted: '🎉',
  payment_received: '💰',
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    loadNotifications();
  }, [filter]);

  async function loadNotifications() {
    setLoading(true);
    try {
      let query = supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (filter === 'unread') {
        query = query.eq('read', false);
      }

      const { data, error } = await query;
      if (error) throw error;
      setNotifications(data || []);
    } catch (err) {
      console.error('Error loading notifications:', err);
    } finally {
      setLoading(false);
    }
  }

  async function markAsRead(id: string) {
    await supabase.from('notifications').update({ read: true }).eq('id', id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }

  async function markAllAsRead() {
    await supabase.from('notifications').update({ read: true }).eq('read', false);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div style={{ padding: '24px', fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif', background: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <Link href="/app" style={{ fontSize: '13px', color: '#6b7280', textDecoration: 'none', display: 'block', marginBottom: '4px' }}>← Back to Dashboard</Link>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#1a1a1a', margin: 0 }}>Notifications</h1>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            style={{ background: '#fff', border: '2px solid #e5e7eb', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', color: '#374151' }}
          >
            Mark all as read ({unreadCount})
          </button>
        )}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {(['all', 'unread'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '6px 16px',
              borderRadius: '20px',
              border: 'none',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              background: filter === f ? '#ff6b35' : '#fff',
              color: filter === f ? '#fff' : '#6b7280',
            }}
          >
            {f === 'all' ? 'All' : 'Unread'}
          </button>
        ))}
      </div>

      {/* Notifications list */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#9ca3af' }}>Loading...</div>
      ) : notifications.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#9ca3af' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔔</div>
          <p style={{ fontSize: '16px', fontWeight: 600, color: '#374151', margin: '0 0 8px' }}>All clear!</p>
          <p style={{ fontSize: '14px', margin: 0 }}>No notifications to show.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {notifications.map(notif => {
            const colors = PRIORITY_COLORS[notif.priority] || PRIORITY_COLORS.low;
            const icon = TYPE_ICONS[notif.type] || '📌';
            return (
              <div
                key={notif.id}
                onClick={() => !notif.read && markAsRead(notif.id)}
                style={{
                  background: '#fff',
                  borderRadius: '16px',
                  padding: '20px',
                  border: notif.read ? '2px solid #f3f4f6' : `2px solid ${colors.border}`,
                  borderLeft: notif.read ? '4px solid #e5e7eb' : `4px solid ${colors.text}`,
                  cursor: notif.read ? 'default' : 'pointer',
                  opacity: notif.read ? 0.7 : 1,
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '24px', lineHeight: 1 }}>{icon}</span>
                    <div>
                      <p style={{ fontWeight: 700, color: '#1a1a1a', fontSize: '15px', margin: '0 0 4px' }}>{notif.title}</p>
                      <p style={{ color: '#6b7280', fontSize: '14px', margin: 0, lineHeight: 1.5 }}>{notif.message}</p>
                      <p style={{ color: '#9ca3af', fontSize: '12px', margin: '8px 0 0' }}>
                        {new Date(notif.created_at).toLocaleString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                  {!notif.read && (
                    <span style={{ background: colors.text, color: '#fff', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '10px', flexShrink: 0 }}>
                      New
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
