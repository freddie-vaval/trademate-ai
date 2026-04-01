// Supabase Client for Trademate AI
// Replace credentials with your Supabase project details

import { createClient } from '@supabase/supabase-js';

// Get these from your Supabase project: Settings → API
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for our tables
export interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  alt_phone?: string;
  email: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  postcode: string;
  status: 'active' | 'vip' | 'inactive' | 'prospect';
  notes: string;
  created_at: string;
}

export interface Job {
  id: string;
  customer_id: string;
  service_type: string;
  description: string;
  price: number;
  status: 'booked-in' | 'diagnosis' | 'awaiting-parts' | 'in-repair' | 'quality-check' | 'ready-for-collection' | 'collected';
  booked_date: string;
  booked_time: string;
  notes: string;
  photos: string[];
  timeline: any[];
  created_at: string;
}

export interface Quote {
  id: string;
  customer_id: string;
  service_type: string;
  details: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  items: any[];
  subtotal: number;
  vat_rate: number;
  total: number;
  valid_until: string;
  created_at: string;
}

export interface Invoice {
  id: string;
  customer_id: string;
  quote_id?: string;
  job_id?: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  issue_date: string;
  due_date: string;
  items: any[];
  subtotal: number;
  vat_rate: number;
  total: number;
  notes: string;
  created_at: string;
}

export interface Call {
  id: string;
  customer_id?: string;
  customer_name: string;
  phone: string;
  status: 'completed' | 'missed' | 'in-progress' | 'transferred';
  duration_seconds: number;
  summary: string;
  transcription: string;
  transferred_to_human: boolean;
  booked_job_id?: string;
  created_at: string;
}

export interface SocialPost {
  id: string;
  job_id?: string;
  platform: 'facebook' | 'instagram' | 'tiktok' | 'linkedin' | 'twitter' | 'google';
  content: string;
  media_urls: string[];
  scheduled_for?: string;
  posted_at?: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  platform_post_id?: string;
  platform_url?: string;
  error_message?: string;
  created_at: string;
}

// Database helper functions
export const db = {
  // Customers
  async getCustomers() {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async addCustomer(customer: Partial<Customer>) {
    const { data, error } = await supabase
      .from('customers')
      .insert(customer)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Jobs
  async getJobs() {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async addJob(job: Partial<Job>) {
    const { data, error } = await supabase
      .from('jobs')
      .insert(job)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateJob(id: string, updates: Partial<Job>) {
    const { data, error } = await supabase
      .from('jobs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Quotes
  async getQuotes() {
    const { data, error } = await supabase
      .from('quotes')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async addQuote(quote: Partial<Quote>) {
    const { data, error } = await supabase
      .from('quotes')
      .insert(quote)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateQuote(id: string, updates: Partial<Quote>) {
    const { data, error } = await supabase
      .from('quotes')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Invoices
  async getInvoices() {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async addInvoice(invoice: Partial<Invoice>) {
    const { data, error } = await supabase
      .from('invoices')
      .insert(invoice)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateInvoice(id: string, updates: Partial<Invoice>) {
    const { data, error } = await supabase
      .from('invoices')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Calls
  async getCalls() {
    const { data, error } = await supabase
      .from('calls')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async addCall(call: Partial<Call>) {
    const { data, error } = await supabase
      .from('calls')
      .insert(call)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Social Posts
  async getSocialPosts() {
    const { data, error } = await supabase
      .from('social_posts')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async schedulePost(post: Partial<SocialPost>) {
    const { data, error } = await supabase
      .from('social_posts')
      .insert(post)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updatePostStatus(id: string, status: string, platformPostId?: string) {
    const { data, error } = await supabase
      .from('social_posts')
      .update({ 
        status, 
        platform_post_id: platformPostId,
        posted_at: status === 'published' ? new Date().toISOString() : undefined
      })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};
