-- Trademate AI Full Stack Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CORE TABLES
-- ============================================

-- CUSTOMERS table
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  alt_phone TEXT,
  email TEXT NOT NULL,
  address_line_1 TEXT NOT NULL,
  address_line_2 TEXT,
  city TEXT NOT NULL,
  postcode TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'vip', 'inactive', 'prospect')),
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- JOBS table
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL,
  description TEXT DEFAULT '',
  price DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'booked-in' CHECK (status IN ('booked-in', 'diagnosis', 'awaiting-parts', 'in-repair', 'quality-check', 'ready-for-collection', 'collected')),
  booked_date DATE,
  booked_time TEXT,
  notes TEXT DEFAULT '',
  photos TEXT[] DEFAULT '{}',
  timeline JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- QUOTES table
CREATE TABLE quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL,
  details TEXT DEFAULT '',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'rejected', 'expired')),
  items JSONB DEFAULT '[]',
  subtotal DECIMAL(10,2) DEFAULT 0,
  vat_rate DECIMAL(5,2) DEFAULT 20.00,
  total DECIMAL(10,2) DEFAULT 0,
  valid_until DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- INVOICES table
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  quote_id UUID REFERENCES quotes(id),
  job_id UUID REFERENCES jobs(id),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue')),
  issue_date DATE,
  due_date DATE,
  items JSONB DEFAULT '[]',
  subtotal DECIMAL(10,2) DEFAULT 0,
  vat_rate DECIMAL(5,2) DEFAULT 20.00,
  total DECIMAL(10,2) DEFAULT 0,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CALLS table (AI Phone)
CREATE TABLE calls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id),
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  status TEXT DEFAULT 'completed' CHECK (status IN ('completed', 'missed', 'in-progress', 'transferred')),
  duration_seconds INTEGER DEFAULT 0,
  summary TEXT DEFAULT '',
  transcription TEXT DEFAULT '',
  transferred_to_human BOOLEAN DEFAULT FALSE,
  booked_job_id UUID REFERENCES jobs(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SOCIAL MEDIA TABLES
-- ============================================

-- Social Accounts (connected platforms)
CREATE TABLE social_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform TEXT NOT NULL CHECK (platform IN ('facebook', 'instagram', 'tiktok', 'linkedin', 'twitter', 'google')),
  account_name TEXT NOT NULL,
  account_id TEXT, -- platform-specific ID
  access_token TEXT, -- encrypted
  refresh_token TEXT, -- encrypted
  page_id TEXT, -- for Meta pages
  profile_id TEXT, -- for Meta/Instagram
  is_active BOOLEAN DEFAULT TRUE,
  connected_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- Scheduled Posts
CREATE TABLE social_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES jobs(id), -- optional link to job
  platform TEXT NOT NULL CHECK (platform IN ('facebook', 'instagram', 'tiktok', 'linkedin', 'twitter', 'google')),
  content TEXT NOT NULL,
  media_urls TEXT[] DEFAULT '{}', -- images/videos to post
  media_types TEXT[] DEFAULT '{}', -- 'image' or 'video'
  scheduled_for TIMESTAMPTZ,
  posted_at TIMESTAMPTZ,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'failed')),
  platform_post_id TEXT, -- ID from the platform after posting
  platform_url TEXT, -- URL of the published post
  engagement_likes INTEGER DEFAULT 0,
  engagement_comments INTEGER DEFAULT 0,
  engagement_shares INTEGER DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content Templates (AI-generated captions)
CREATE TABLE content_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform TEXT NOT NULL CHECK (platform IN ('facebook', 'instagram', 'tiktok', 'linkedin', 'twitter', 'google')),
  template_type TEXT NOT NULL CHECK (template_type IN ('job_completion', 'review_request', 'weekly_stats', 'promotional', 'seasonal', 'general')),
  template_text TEXT NOT NULL,
  variables JSONB DEFAULT '[]', -- ['customer_name', 'trade', 'town', etc.]
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Generated Content (AI output before posting)
CREATE TABLE generated_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES jobs(id),
  platform TEXT NOT NULL,
  content TEXT NOT NULL,
  media_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'posted')),
  approved_by TEXT,
  generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- EMAIL/SMS TABLES
-- ============================================

-- Email Templates
CREATE TABLE email_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  trigger TEXT CHECK (trigger IN ('job_completed', 'quote_sent', 'invoice_sent', 'payment_received', 'review_request', 'manual')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sent Emails
CREATE TABLE sent_emails (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id),
  template_id UUID REFERENCES email_templates(id),
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed'))
);

-- SMS Templates
CREATE TABLE sms_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  body TEXT NOT NULL,
  trigger TEXT CHECK (trigger IN ('job_completed', 'booking_confirmed', 'reminder', 'review_request', 'manual')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sent SMS
CREATE TABLE sent_sms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id),
  template_id UUID REFERENCES sms_templates(id),
  body TEXT NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'failed'))
);

-- ============================================
-- SETTINGS & CONFIG
-- ============================================

-- Business Settings
CREATE TABLE business_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_name TEXT NOT NULL,
  trade_type TEXT, -- plumber, electrician, etc.
  phone TEXT,
  email TEXT,
  address TEXT,
  postcode TEXT,
  twilio_phone TEXT,
  twilio_account_sid TEXT,
  buffer_access_token TEXT,
  sendgrid_api_key TEXT,
  minimax_api_key TEXT,
  default_vat_rate DECIMAL(5,2) DEFAULT 20.00,
  timezone TEXT DEFAULT 'Europe/London',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SECURITY
-- ============================================

-- Enable RLS on all tables
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE sent_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE sent_sms ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_settings ENABLE ROW LEVEL SECURITY;

-- Public read policies (for demo - tighten in production)
CREATE POLICY "Public read customers" ON customers FOR SELECT USING (true);
CREATE POLICY "Public read jobs" ON jobs FOR SELECT USING (true);
CREATE POLICY "Public read quotes" ON quotes FOR SELECT USING (true);
CREATE POLICY "Public read invoices" ON invoices FOR SELECT USING (true);
CREATE POLICY "Public read calls" ON calls FOR SELECT USING (true);
CREATE POLICY "Public read social_posts" ON social_posts FOR SELECT USING (true);
CREATE POLICY "Public read content_templates" ON content_templates FOR SELECT USING (true);
CREATE POLICY "Public read generated_content" ON generated_content FOR SELECT USING (true);
CREATE POLICY "Public read business_settings" ON business_settings FOR SELECT USING (true);

-- Public insert/update policies (for demo - tighten in production)
CREATE POLICY "Public insert customers" ON customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert jobs" ON jobs FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert quotes" ON quotes FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert invoices" ON invoices FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert calls" ON calls FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert social_posts" ON social_posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert content_templates" ON content_templates FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert generated_content" ON generated_content FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert business_settings" ON business_settings FOR INSERT WITH CHECK (true);

CREATE POLICY "Public update customers" ON customers FOR UPDATE USING (true);
CREATE POLICY "Public update jobs" ON jobs FOR UPDATE USING (true);
CREATE POLICY "Public update quotes" ON quotes FOR UPDATE USING (true);
CREATE POLICY "Public update invoices" ON invoices FOR UPDATE USING (true);
CREATE POLICY "Public update calls" ON calls FOR UPDATE USING (true);
CREATE POLICY "Public update social_posts" ON social_posts FOR UPDATE USING (true);
CREATE POLICY "Public update content_templates" ON content_templates FOR UPDATE USING (true);
CREATE POLICY "Public update generated_content" ON generated_content FOR UPDATE USING (true);
CREATE POLICY "Public update business_settings" ON business_settings FOR UPDATE USING (true);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_jobs_customer ON jobs(customer_id);
CREATE INDEX idx_quotes_customer ON quotes(customer_id);
CREATE INDEX idx_invoices_customer ON invoices(customer_id);
CREATE INDEX idx_calls_customer ON calls(customer_id);
CREATE INDEX idx_social_posts_job ON social_posts(job_id);
CREATE INDEX idx_social_posts_status ON social_posts(status);
CREATE INDEX idx_social_posts_scheduled ON social_posts(scheduled_for);
CREATE INDEX idx_generated_content_job ON generated_content(job_id);
CREATE INDEX idx_sent_emails_customer ON sent_emails(customer_id);
CREATE INDEX idx_sent_sms_customer ON sent_sms(customer_id);

-- ============================================
-- DEFAULT CONTENT TEMPLATES
-- ============================================

INSERT INTO content_templates (platform, template_type, template_text, variables) VALUES
('facebook', 'job_completion', '{trade} job complete in {town}! 🔧 {job_description}. | Free quotes available — call us or DM. #{trade} #{town} #UKtrades', '["trade", "town", "job_description"]'),
('instagram', 'job_completion', '{trade} job done! ✨ {job_description} | DM for free quote | #{trade}#{town} #uktrades #professional', '["trade", "town", "job_description"]'),
('linkedin', 'job_completion', '{business_name} completed a {trade} job in {town}. {job_description}. #UKTrades #Construction #SmallBusiness', '["business_name", "trade", "town", "job_description"]'),
('tiktok', 'job_completion', 'Just finished this {trade} job in {town}! 🔥 {job_description} #tradeslife #{trade}', '["trade", "town", "job_description"]');

INSERT INTO sms_templates (name, body, trigger) VALUES
('review_request', 'Hi {customer_name}, thanks for choosing {business_name}! We''d love a quick Google review — it helps other homeowners find us: {review_link}. Thanks, {tradesman_name}', 'review_request'),
('job_reminder', 'Hi {customer_name}, this is a reminder about your {service_type} appointment tomorrow at {time}. Reply YES to confirm or call us on {phone} to reschedule.', 'reminder'),
('booking_confirmed', 'Hi {customer_name}, your {service_type} job is confirmed for {date} at {time}. We''ll see you then! — {business_name}', 'booking_confirmed');

INSERT INTO email_templates (name, subject, body, trigger) VALUES
('job_completed', 'Thanks for choosing {business_name}!', 'Hi {customer_name},\n\nThank you for letting us handle your {service_type} job. We hope you''re happy with the work!\n\nIf you have any feedback, we''d love to hear from you. And if you could leave us a quick review, it really helps other homeowners find us:\n\n{review_link}\n\nThanks again!\n\n{business_name}\n{phone}', 'job_completed'),
('invoice_sent', 'Your invoice from {business_name}', 'Hi {customer_name},\n\nPlease find your invoice #{invoice_number} attached.\n\nTotal: £{total}\nDue by: {due_date}\n\nYou can pay via bank transfer or card — reply to this email to pay.\n\nThanks,\n\n{business_name}', 'invoice_sent');

INSERT INTO business_settings (business_name, trade_type, default_vat_rate) VALUES 
('Your Business Name', 'trades', 20.00);

-- ============================================
-- DONE!
-- ============================================

SELECT 'Trademate AI Database Schema - Complete!' as status;

-- Onboarding profile: stores onboarding answers separately from CRM customer record
CREATE TABLE IF NOT EXISTS onboarding_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  trade TEXT,
  team_size TEXT,
  current_tools TEXT,
  challenge TEXT,
  plan TEXT DEFAULT 'starter',
  trial_ends TIMESTAMPTZ,
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- NEW TABLES ADDED 2026-04-09
-- ============================================================================

-- Call sessions: tracks active AI phone conversations
CREATE TABLE IF NOT EXISTS call_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  call_sid TEXT UNIQUE NOT NULL,
  customer_phone TEXT,
  customer_name TEXT,
  customer_email TEXT,
  intent TEXT DEFAULT 'unknown',
  current_step TEXT DEFAULT 'initial',
  data JSONB DEFAULT '{}',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned', 'callback_requested')),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ
);

-- Call logs: history of all calls
CREATE TABLE IF NOT EXISTS call_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  call_sid TEXT UNIQUE NOT NULL,
  from_number TEXT,
  to_number TEXT,
  status TEXT CHECK (status IN ('completed', 'busy', 'no_answer', 'failed', 'in_progress')),
  duration_seconds INTEGER DEFAULT 0,
  recording_url TEXT,
  recording_transcription TEXT,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications: in-app alerts for Freddie
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT DEFAULT '',
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  read BOOLEAN DEFAULT false,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  opportunity_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add onboarding-specific columns to existing tables
ALTER TABLE onboarding_profiles
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
  ADD COLUMN IF NOT EXISTS last_quote_ref TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'trial' CHECK (status IN ('trial', 'active', 'cancelled', 'past_due')),
  ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMPTZ;

-- Add last_payment column to customers
ALTER TABLE customers
  ADD COLUMN IF NOT EXISTS last_payment TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_call_sessions_status ON call_sessions(status);
CREATE INDEX IF NOT EXISTS idx_call_sessions_phone ON call_sessions(customer_phone);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read) WHERE read = false;
CREATE INDEX IF NOT EXISTS idx_notifications_priority ON notifications(priority);
CREATE INDEX IF NOT EXISTS idx_onboarding_status ON onboarding_profiles(status);
