export type JobStatus =
  | 'booked-in'
  | 'diagnosis'
  | 'awaiting-parts'
  | 'in-repair'
  | 'quality-check'
  | 'ready-for-collection'
  | 'collected';

export type CustomerStatus = 'active' | 'vip' | 'inactive' | 'prospect';
export type QuoteStatus = 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';
export type CallStatus = 'completed' | 'missed' | 'in-progress' | 'transferred';

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  altPhone?: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postcode: string;
  status: CustomerStatus;
  notes: string;
  createdAt: string;
}

export interface JobTimelineEvent {
  id: string;
  status: JobStatus;
  label: string;
  at: string;
  note?: string;
}

export interface Job {
  id: string;
  customerId: string;
  serviceType: string;
  description: string;
  price: number;
  status: JobStatus;
  bookedDate: string;
  bookedTime: string;
  notes: string;
  photos: string[];
  timeline: JobTimelineEvent[];
  createdAt: string;
}

export interface QuoteItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Quote {
  id: string;
  customerId: string;
  serviceType: string;
  details: string;
  status: QuoteStatus;
  items: QuoteItem[];
  subtotal: number;
  vatRate: number;
  total: number;
  validUntil: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Invoice {
  id: string;
  customerId: string;
  quoteId?: string;
  jobId?: string;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  vatRate: number;
  total: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface CallRecord {
  id: string;
  customerId?: string;
  customerName: string;
  phone: string;
  status: CallStatus;
  durationSeconds: number;
  createdAt: string;
  summary: string;
  transcription: string;
  transferredToHuman: boolean;
  bookedJobId?: string;
}

