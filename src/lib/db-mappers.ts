/**
 * DB Mappers — converts between Supabase snake_case and app camelCase types
 */

import type { Customer, Job, JobTimelineEvent, Quote, Invoice, QuoteItem, InvoiceItem } from '@/lib/types';
import type { Customer as DBCustomer, Job as DBJob, Quote as DBQuote, Invoice as DBInvoice } from '@/lib/supabase';

// ─── Customer Mappers ─────────────────────────────────────────────────────────

/** Supabase row → App Customer */
export function mapDBCustomerToCustomer(row: DBCustomer): Customer {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    phone: row.phone,
    altPhone: row.alt_phone,
    email: row.email,
    addressLine1: row.address_line_1,
    addressLine2: row.address_line_2,
    city: row.city,
    postcode: row.postcode,
    status: row.status,
    notes: row.notes ?? '',
    createdAt: row.created_at,
  };
}

/** App Customer → Supabase insert row */
export function mapCustomerToDB(customer: Customer): Omit<DBCustomer, 'id' | 'created_at'> {
  return {
    first_name: customer.firstName,
    last_name: customer.lastName,
    phone: customer.phone,
    alt_phone: customer.altPhone,
    email: customer.email,
    address_line_1: customer.addressLine1,
    address_line_2: customer.addressLine2,
    city: customer.city,
    postcode: customer.postcode,
    status: customer.status,
    notes: customer.notes ?? '',
  };
}

// ─── Job Mappers ─────────────────────────────────────────────────────────────

/** Supabase row → App Job */
export function mapDBJobToJob(row: DBJob): Job {
  return {
    id: row.id,
    customerId: row.customer_id,
    serviceType: row.service_type,
    description: row.description ?? '',
    price: Number(row.price) || 0,
    status: row.status as Job['status'],
    bookedDate: row.booked_date ?? '',
    bookedTime: row.booked_time ?? '',
    notes: row.notes ?? '',
    photos: row.photos ?? [],
    timeline: (row.timeline as JobTimelineEvent[]) ?? [],
    createdAt: row.created_at,
  };
}

/** App Job → Supabase insert row */
export function mapJobToDB(job: Job): Omit<DBJob, 'id' | 'created_at'> {
  return {
    customer_id: job.customerId,
    service_type: job.serviceType,
    description: job.description,
    price: job.price,
    status: job.status,
    booked_date: job.bookedDate,
    booked_time: job.bookedTime,
    notes: job.notes,
    photos: job.photos,
    timeline: job.timeline,
  };
}

// ─── Quote Mappers ─────────────────────────────────────────────────────────────

/** Supabase row → App Quote */
export function mapDBQuoteToQuote(row: DBQuote): Quote {
  return {
    id: row.id,
    customerId: row.customer_id ?? '',
    serviceType: row.service_type,
    details: row.details ?? '',
    status: row.status as Quote['status'],
    items: (row.items as QuoteItem[]) ?? [],
    subtotal: Number(row.subtotal) || 0,
    vatRate: Number(row.vat_rate) || 20,
    total: Number(row.total) || 0,
    validUntil: row.valid_until ?? '',
    createdAt: row.created_at,
    updatedAt: (row as any).updated_at ?? row.created_at,
  };
}

/** App Quote → Supabase insert row */
export function mapQuoteToDB(quote: Quote): Omit<DBQuote, 'id' | 'created_at' | 'updated_at'> {
  return {
    customer_id: quote.customerId,
    service_type: quote.serviceType,
    details: quote.details,
    status: quote.status,
    items: quote.items,
    subtotal: quote.subtotal,
    vat_rate: quote.vatRate,
    total: quote.total,
    valid_until: quote.validUntil,
  };
}

/** App Quote → Supabase update row (partial) */
export function mapQuoteUpdateToDB(updates: Partial<Quote>): Partial<DBQuote> {
  const result: Partial<DBQuote> = {};
  if (updates.status !== undefined) result.status = updates.status;
  if (updates.items !== undefined) result.items = updates.items;
  if (updates.subtotal !== undefined) result.subtotal = updates.subtotal;
  if (updates.vatRate !== undefined) result.vat_rate = updates.vatRate;
  if (updates.total !== undefined) result.total = updates.total;
  if (updates.validUntil !== undefined) result.valid_until = updates.validUntil;
  if (updates.details !== undefined) result.details = updates.details;
  if (updates.serviceType !== undefined) result.service_type = updates.serviceType;
  return result;
}

// ─── Invoice Mappers ───────────────────────────────────────────────────────────

/** Supabase row → App Invoice */
export function mapDBInvoiceToInvoice(row: DBInvoice): Invoice {
  return {
    id: row.id,
    customerId: row.customer_id ?? '',
    quoteId: row.quote_id ?? undefined,
    jobId: row.job_id ?? undefined,
    status: row.status as Invoice['status'],
    issueDate: row.issue_date ?? '',
    dueDate: row.due_date ?? '',
    items: (row.items as InvoiceItem[]) ?? [],
    subtotal: Number(row.subtotal) || 0,
    vatRate: Number(row.vat_rate) || 20,
    total: Number(row.total) || 0,
    notes: row.notes ?? '',
    createdAt: row.created_at,
    updatedAt: (row as any).updated_at ?? row.created_at,
  };
}

/** App Invoice → Supabase insert row */
export function mapInvoiceToDB(invoice: Invoice): Omit<DBInvoice, 'id' | 'created_at' | 'updated_at'> {
  return {
    customer_id: invoice.customerId,
    quote_id: invoice.quoteId,
    job_id: invoice.jobId,
    status: invoice.status,
    issue_date: invoice.issueDate,
    due_date: invoice.dueDate,
    items: invoice.items,
    subtotal: invoice.subtotal,
    vat_rate: invoice.vatRate,
    total: invoice.total,
    notes: invoice.notes,
  };
}

/** App Invoice → Supabase update row (partial) */
export function mapInvoiceUpdateToDB(updates: Partial<Invoice>): Partial<DBInvoice> {
  const result: Partial<DBInvoice> = {};
  if (updates.status !== undefined) result.status = updates.status;
  if (updates.items !== undefined) result.items = updates.items;
  if (updates.subtotal !== undefined) result.subtotal = updates.subtotal;
  if (updates.vatRate !== undefined) result.vat_rate = updates.vatRate;
  if (updates.total !== undefined) result.total = updates.total;
  if (updates.notes !== undefined) result.notes = updates.notes;
  if (updates.dueDate !== undefined) result.due_date = updates.dueDate;
  return result;
}
