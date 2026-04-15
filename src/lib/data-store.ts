'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Bike, Customer, Invoice, Job, Quote } from '@/lib/types';
import {
  seedCustomers,
  seedInvoices,
  seedJobs,
  seedQuotes,
  seedBikes,
} from '@/lib/seed-data';
import { db } from '@/lib/supabase';
import {
  mapDBCustomerToCustomer,
  mapDBJobToJob,
  mapDBQuoteToQuote,
  mapDBInvoiceToInvoice,
  mapCustomerToDB,
  mapJobToDB,
  mapQuoteToDB,
  mapQuoteUpdateToDB,
  mapInvoiceToDB,
  mapInvoiceUpdateToDB,
} from '@/lib/db-mappers';

// ─── Storage keys ────────────────────────────────────────────────────────────

const STORAGE_KEYS = {
  customers: 'trademate.customers.v1',
  jobs: 'trademate.jobs.v1',
  quotes: 'trademate.quotes.v1',
  invoices: 'trademate.invoices.v1',
  bikes: 'bikeclinic.bikes.v1',
} as const;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

// ─── useCustomers ────────────────────────────────────────────────────────────

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>(seedCustomers);
  const [hydrated, setHydrated] = useState(false);
  const [supabaseAvailable, setSupabaseAvailable] = useState(false);

  // Initial load: try Supabase first, fall back to localStorage
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const rows = await db.getCustomers();
        if (cancelled) return;
        if (rows && rows.length > 0) {
          setCustomers(rows.map(mapDBCustomerToCustomer));
        } else {
          // Supabase empty — load from localStorage seed
          const stored = safeParse<Customer[]>(
            window.localStorage.getItem(STORAGE_KEYS.customers),
            seedCustomers
          );
          setCustomers(stored);
        }
      } catch {
        // Supabase not available — use localStorage
        if (cancelled) return;
        const stored = safeParse<Customer[]>(
          window.localStorage.getItem(STORAGE_KEYS.customers),
          seedCustomers
        );
        setCustomers(stored);
      }
      if (!cancelled) setHydrated(true);
    }

    load();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist to localStorage on every change (after hydration)
  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEYS.customers, JSON.stringify(customers));
  }, [customers, hydrated]);

  // Sync new customer to Supabase (fire-and-forget)
  const setCustomersWithSync = (updater: Customer[] | ((prev: Customer[]) => Customer[])) => {
    setCustomers((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      // Find the newly added customer (first one in next that's not in prev)
      const prevIds = new Set(prev.map((c) => c.id));
      const newCustomer = next.find((c) => !prevIds.has(c.id));
      if (newCustomer) {
        db.addCustomer(mapCustomerToDB(newCustomer)).catch(console.error);
      }
      return next;
    });
  };

  return [customers, setCustomersWithSync, hydrated] as const;
}

// ─── useJobs ─────────────────────────────────────────────────────────────────

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>(seedJobs);
  const [hydrated, setHydrated] = useState(false);

  // Initial load: try Supabase first, fall back to localStorage
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const rows = await db.getJobs();
        if (cancelled) return;
        if (rows && rows.length > 0) {
          setJobs(rows.map(mapDBJobToJob));
        } else {
          const stored = safeParse<Job[]>(
            window.localStorage.getItem(STORAGE_KEYS.jobs),
            seedJobs
          );
          setJobs(stored);
        }
      } catch {
        if (cancelled) return;
        const stored = safeParse<Job[]>(
          window.localStorage.getItem(STORAGE_KEYS.jobs),
          seedJobs
        );
        setJobs(stored);
      }
      if (!cancelled) setHydrated(true);
    }

    load();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist to localStorage on every change
  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEYS.jobs, JSON.stringify(jobs));
  }, [jobs, hydrated]);

  // Sync new job to Supabase (fire-and-forget)
  const setJobsWithSync = (updater: Job[] | ((prev: Job[]) => Job[])) => {
    setJobs((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      const prevIds = new Set(prev.map((j) => j.id));
      const newJob = next.find((j) => !prevIds.has(j.id));
      if (newJob) {
        db.addJob(mapJobToDB(newJob)).catch(console.error);
      }
      // Also sync status updates (job promotion/movement)
      const updatedJobs = next.filter((j) => {
        const prevJob = prev.find((p) => p.id === j.id);
        return prevJob && prevJob.status !== j.status;
      });
      updatedJobs.forEach((j) => {
        db.updateJob(j.id, { status: j.status, timeline: j.timeline }).catch(console.error);
      });
      return next;
    });
  };

  return [jobs, setJobsWithSync, hydrated] as const;
}

// ─── useQuotes ────────────────────────────────────────────────────────────────

export function useQuotes() {
  const [quotes, setQuotes] = useState<Quote[]>(seedQuotes);
  const [hydrated, setHydrated] = useState(false);

  // Initial load: try Supabase first, fall back to localStorage
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const rows = await db.getQuotes();
        if (cancelled) return;
        if (rows && rows.length > 0) {
          setQuotes(rows.map(mapDBQuoteToQuote));
        } else {
          const stored = safeParse<Quote[]>(
            window.localStorage.getItem(STORAGE_KEYS.quotes),
            seedQuotes
          );
          setQuotes(stored);
        }
      } catch {
        if (cancelled) return;
        const stored = safeParse<Quote[]>(
          window.localStorage.getItem(STORAGE_KEYS.quotes),
          seedQuotes
        );
        setQuotes(stored);
      }
      if (!cancelled) setHydrated(true);
    }

    load();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist to localStorage on every change
  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEYS.quotes, JSON.stringify(quotes));
  }, [quotes, hydrated]);

  // Sync new quote / status update to Supabase (fire-and-forget)
  const setQuotesWithSync = (updater: Quote[] | ((prev: Quote[]) => Quote[])) => {
    setQuotes((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;

      // Find newly added quote
      const prevIds = new Set(prev.map((q) => q.id));
      const newQuote = next.find((q) => !prevIds.has(q.id));
      if (newQuote) {
        db.addQuote(mapQuoteToDB(newQuote)).catch(console.error);
      }

      // Sync status and data changes
      next.forEach((quote) => {
        const prevQuote = prev.find((p) => p.id === quote.id);
        if (prevQuote) {
          const changedFields = Object.keys(quote).filter(
            (key) => JSON.stringify(quote[key as keyof Quote]) !== JSON.stringify(prevQuote[key as keyof Quote])
          );
          if (changedFields.length > 0) {
            db.updateQuote(quote.id, mapQuoteUpdateToDB(quote)).catch(console.error);
          }
        }
      });

      return next;
    });
  };

  return [quotes, setQuotesWithSync, hydrated] as const;
}

// ─── useInvoices ─────────────────────────────────────────────────────────────

export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>(seedInvoices);
  const [hydrated, setHydrated] = useState(false);

  // Initial load: try Supabase first, fall back to localStorage
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const rows = await db.getInvoices();
        if (cancelled) return;
        if (rows && rows.length > 0) {
          setInvoices(rows.map(mapDBInvoiceToInvoice));
        } else {
          const stored = safeParse<Invoice[]>(
            window.localStorage.getItem(STORAGE_KEYS.invoices),
            seedInvoices
          );
          setInvoices(stored);
        }
      } catch {
        if (cancelled) return;
        const stored = safeParse<Invoice[]>(
          window.localStorage.getItem(STORAGE_KEYS.invoices),
          seedInvoices
        );
        setInvoices(stored);
      }
      if (!cancelled) setHydrated(true);
    }

    load();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist to localStorage on every change
  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEYS.invoices, JSON.stringify(invoices));
  }, [invoices, hydrated]);

  // Sync new invoice / status update to Supabase (fire-and-forget)
  const setInvoicesWithSync = (updater: Invoice[] | ((prev: Invoice[]) => Invoice[])) => {
    setInvoices((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;

      // Find newly added invoice
      const prevIds = new Set(prev.map((i) => i.id));
      const newInvoice = next.find((i) => !prevIds.has(i.id));
      if (newInvoice) {
        db.addInvoice(mapInvoiceToDB(newInvoice)).catch(console.error);
      }

      // Sync status and data changes
      next.forEach((invoice) => {
        const prevInvoice = prev.find((p) => p.id === invoice.id);
        if (prevInvoice) {
          const changedFields = Object.keys(invoice).filter(
            (key) => JSON.stringify(invoice[key as keyof Invoice]) !== JSON.stringify(prevInvoice[key as keyof Invoice])
          );
          if (changedFields.length > 0) {
            db.updateInvoice(invoice.id, mapInvoiceUpdateToDB(invoice)).catch(console.error);
          }
        }
      });

      return next;
    });
  };

  return [invoices, setInvoicesWithSync, hydrated] as const;
}

// ─── Generic persisted state (for quotes/invoices — localStorage only for now)

function usePersistedState<T>(storageKey: string, fallback: T) {
  const [state, setState] = useState<T>(fallback);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = safeParse<T>(window.localStorage.getItem(storageKey), fallback);
    setState(stored);
    setHydrated(true);
  }, [storageKey, fallback]);

  useEffect(() => {
    if (!hydrated || typeof window === 'undefined') return;
    window.localStorage.setItem(storageKey, JSON.stringify(state));
  }, [hydrated, state, storageKey]);

  return [state, setState, hydrated] as const;
}

// ─── useBikes ──────────────────────────────────────────────────────────────

export function useBikes() {
  const [bikes, setBikes] = useState<Bike[]>(seedBikes);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = safeParse<Bike[]>(
      window.localStorage.getItem(STORAGE_KEYS.bikes),
      seedBikes
    );
    setBikes(stored);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEYS.bikes, JSON.stringify(bikes));
  }, [bikes, hydrated]);

  return [bikes, setBikes, hydrated] as const;
}

// ─── Utility helpers ─────────────────────────────────────────────────────────

export function fullName(customer: Customer): string {
  return `${customer.firstName} ${customer.lastName}`.trim();
}

export function formatMoney(value: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 2,
  }).format(value);
}

export function parseMoney(value: string): number {
  const normalized = value.replace(/[^\d.]/g, '');
  const asNumber = Number.parseFloat(normalized);
  return Number.isNaN(asNumber) ? 0 : asNumber;
}

export function buildCustomerMap(customers: Customer[]) {
  return new Map(customers.map((customer) => [customer.id, customer]));
}

export function useCustomerMap(customers: Customer[]) {
  return useMemo(() => buildCustomerMap(customers), [customers]);
}
