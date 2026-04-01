'use client';

import { useState } from 'react';

// Placeholder for when Supabase is connected
const mockScheduledPosts = [
  {
    id: '1',
    platform: 'facebook',
    content: 'Plumbing job complete in Birmingham! 🔧 New boiler installation. Free quotes available — DM us! #plumber #birmingham #uktrades',
    scheduled_for: '2025-07-20T10:00:00Z',
    status: 'scheduled',
  },
  {
    id: '2',
    platform: 'instagram',
    content: 'Boiler service done! ✅ Gas Safe certified. DM for your free quote. #plumber #gasengineer #birmingham',
    scheduled_for: '2025-07-21T14:00:00Z',
    status: 'scheduled',
  },
  {
    id: '3',
    platform: 'linkedin',
    content: 'Another successful plumbing job in Birmingham. Full boiler replacement completed. #UKTrades #SmallBusiness #Plumbing',
    scheduled_for: '2025-07-19T09:00:00Z',
    status: 'published',
  },
];

const platforms = [
  { id: 'facebook', name: 'Facebook', icon: '📘' },
  { id: 'instagram', name: 'Instagram', icon: '📸' },
  { id: 'tiktok', name: 'TikTok', icon: '🎵' },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼' },
  { id: 'twitter', name: 'Twitter', icon: '🐦' },
];

export default function SocialPage() {
  const [posts] = useState(mockScheduledPosts);
  const [newPost, setNewPost] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [scheduleDate, setScheduleDate] = useState('');

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <a href="/" style={{ display: 'inline-block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#2563eb' }}>← Dashboard</a>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          📱 Social Media Scheduler
        </h1>
        <p style={{ color: '#6b7280' }}>
          Auto-post to Facebook, Instagram, TikTok & LinkedIn — powered by Buffer
        </p>
      </div>

      {/* Create Post */}
      <div style={{ 
        background: 'white', 
        padding: '1.5rem', 
        borderRadius: '12px',
        marginBottom: '2rem',
        border: '1px solid #e5e7eb'
      }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>
          Create New Post
        </h2>
        
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="What do you want to share? AI will generate captions from your completed jobs..."
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            minHeight: '100px',
            fontFamily: 'inherit',
            marginBottom: '1rem'
          }}
        />

        <div style={{ marginBottom: '1rem' }}>
          <p style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
            Select Platforms:
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {platforms.map(platform => (
              <button
                key={platform.id}
                onClick={() => togglePlatform(platform.id)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  border: selectedPlatforms.includes(platform.id) 
                    ? '2px solid #FF6B2B' 
                    : '1px solid #e5e7eb',
                  background: selectedPlatforms.includes(platform.id) 
                    ? '#fff7ed' 
                    : 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <span>{platform.icon}</span>
                <span style={{ fontSize: '0.875rem' }}>{platform.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: '500', marginRight: '1rem' }}>
            Schedule for:
          </label>
          <input
            type="datetime-local"
            value={scheduleDate}
            onChange={(e) => setScheduleDate(e.target.value)}
            style={{
              padding: '0.5rem',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            disabled={!newPost || selectedPlatforms.length === 0}
            style={{
              padding: '0.75rem 1.5rem',
              background: newPost && selectedPlatforms.length > 0 ? '#FF6B2B' : '#d1d5db',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: newPost && selectedPlatforms.length > 0 ? 'pointer' : 'not-allowed',
              fontWeight: '500',
            }}
          >
            📅 Schedule Post
          </button>
          <button
            disabled={!newPost || selectedPlatforms.length === 0}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'transparent',
              color: '#6b7280',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              cursor: newPost && selectedPlatforms.length > 0 ? 'pointer' : 'not-allowed',
              fontWeight: '500',
            }}
          >
            ✨ Generate with AI
          </button>
        </div>
      </div>

      {/* Scheduled Posts */}
      <div style={{ 
        background: 'white', 
        padding: '1.5rem', 
        borderRadius: '12px',
        border: '1px solid #e5e7eb'
      }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>
          Scheduled Posts
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {posts.map(post => (
            <div
              key={post.id}
              style={{
                padding: '1rem',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '1.25rem' }}>
                    {platforms.find(p => p.id === post.platform)?.icon}
                  </span>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    fontWeight: '500',
                    color: post.status === 'published' ? '#16a34a' : '#f97316',
                    background: post.status === 'published' ? '#dcfce7' : '#fff7ed',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                  }}>
                    {post.status}
                  </span>
                </div>
                <p style={{ fontSize: '0.9rem', color: '#374151' }}>{post.content}</p>
                <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.5rem' }}>
                  📅 {new Date(post.scheduled_for).toLocaleString()}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button style={{
                  padding: '0.5rem',
                  background: 'transparent',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}>
                  ✏️
                </button>
                <button style={{
                  padding: '0.5rem',
                  background: 'transparent',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}>
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Connected Accounts */}
      <div style={{ 
        marginTop: '2rem',
        padding: '1.5rem', 
        background: '#f9fafb', 
        borderRadius: '12px',
      }}>
        <h2 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>
          ⚙️ Connected Accounts
        </h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {platforms.map(platform => (
            <div
              key={platform.id}
              style={{
                padding: '0.75rem 1rem',
                background: 'white',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <span>{platform.icon}</span>
              <span style={{ fontSize: '0.875rem' }}>{platform.name}</span>
              <span style={{ color: '#16a34a', fontSize: '0.75rem' }}>✓ Connected</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '1rem' }}>
          Connect more accounts via Buffer • Powered by Buffer API
        </p>
      </div>
    </div>
  );
}
