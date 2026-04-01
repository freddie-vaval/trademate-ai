'use client';

import { useMemo, useState } from 'react';
import { formatMoney, fullName, useCustomers, useQuotes } from '@/lib/data-store';
import { serviceTypes } from '@/lib/seed-data';
import { Customer, Quote, QuoteStatus } from '@/lib/types';

const basePriceByService: Record<string, number> = {
  'Bike Service': 95,
  'Puncture Repair': 35,
  'Brake Adjustment': 45,
  'Gear Tune-Up': 55,
  'Wheel Truing': 65,
  'Full Overhaul': 190,
  'E-Bike Diagnostics': 120,
};

function quoteStatusClass(status: QuoteStatus): string {
  switch (status) {
    case 'accepted':
      return 'bg-green-100 text-green-700';
    case 'sent':
      return 'bg-blue-100 text-blue-700';
    case 'rejected':
      return 'bg-red-100 text-red-700';
    case 'expired':
      return 'bg-amber-100 text-amber-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

export default function QuotesPage() {
  const [customers, setCustomers, customersHydrated] = useCustomers();
  const [quotes, setQuotes, quotesHydrated] = useQuotes();
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id ?? '');
  const [serviceType, setServiceType] = useState(serviceTypes[0]);
  const [details, setDetails] = useState('');
  const [showCustomerEdit, setShowCustomerEdit] = useState(false);
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(quotes[0]?.id ?? null);

  const ready = customersHydrated && quotesHydrated;
  const selectedCustomer = customers.find((customer) => customer.id === selectedCustomerId) ?? null;
  const selectedQuote = quotes.find((quote) => quote.id === selectedQuoteId) ?? null;

  const sortedQuotes = useMemo(
    () => [...quotes].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [quotes]
  );

  const createQuote = () => {
    if (!selectedCustomerId) return;

    const serviceBase = basePriceByService[serviceType] ?? 75;
    const subtotal = serviceBase + 20;
    const vatRate = 20;
    const total = subtotal * (1 + vatRate / 100);
    const now = new Date();
    const validUntil = new Date(now);
    validUntil.setDate(validUntil.getDate() + 30);

    const quote: Quote = {
      id: `QT-${Date.now()}`,
      customerId: selectedCustomerId,
      serviceType,
      details,
      status: 'draft',
      items: [
        { description: `${serviceType} labour`, quantity: 1, unitPrice: serviceBase },
        { description: 'Workshop consumables', quantity: 1, unitPrice: 20 },
      ],
      subtotal,
      vatRate,
      total,
      validUntil: validUntil.toISOString().slice(0, 10),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    setQuotes([quote, ...quotes]);
    setSelectedQuoteId(quote.id);
    setDetails('');
  };

  const setQuoteStatus = (quoteId: string, status: QuoteStatus) => {
    setQuotes(
      quotes.map((quote) =>
        quote.id === quoteId ? { ...quote, status, updatedAt: new Date().toISOString() } : quote
      )
    );
  };

  const saveCustomer = (next: Customer) => {
    setCustomers(customers.map((customer) => (customer.id === next.id ? next : customer)));
    setShowCustomerEdit(false);
  };

  if (!ready) {
    return <div className="min-h-screen bg-gray-50 p-8 text-gray-600">Loading quotes...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 lg:grid-cols-[380px_1fr]">
        <div className="rounded-xl border bg-white p-6">
          <a href="/" className="mb-2 inline-block text-sm text-blue-600 hover:text-blue-800">← Dashboard</a>
          <h1 className="text-2xl font-bold text-gray-900">Quotes</h1>
          <p className="mt-1 text-sm text-gray-600">Create quote drafts and manage customer-ready pricing</p>

          <div className="mt-5 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Customer</label>
              <select
                value={selectedCustomerId}
                onChange={(event) => setSelectedCustomerId(event.target.value)}
                className="w-full rounded-lg border px-3 py-2"
              >
                <option value="">Select customer...</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {fullName(customer)}
                  </option>
                ))}
              </select>
              <button
                disabled={!selectedCustomer}
                onClick={() => setShowCustomerEdit(true)}
                className="mt-2 text-sm font-medium text-blue-600 disabled:cursor-not-allowed disabled:text-gray-400"
              >
                Edit selected customer
              </button>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Service Type</label>
              <select
                value={serviceType}
                onChange={(event) => setServiceType(event.target.value)}
                className="w-full rounded-lg border px-3 py-2"
              >
                {serviceTypes.map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Details</label>
              <textarea
                rows={4}
                className="w-full rounded-lg border px-3 py-2"
                placeholder="Parts needed, service constraints, requested turnaround..."
                value={details}
                onChange={(event) => setDetails(event.target.value)}
              />
            </div>

            <button
              onClick={createQuote}
              disabled={!selectedCustomerId}
              className="w-full rounded-lg bg-blue-600 py-2 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              Create Quote Draft
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="overflow-hidden rounded-xl border bg-white">
            <table className="w-full">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Quote</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Service</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {sortedQuotes.map((quote) => {
                  const customer = customers.find((entry) => entry.id === quote.customerId);
                  return (
                    <tr
                      key={quote.id}
                      className={`hover:bg-gray-50 ${selectedQuoteId === quote.id ? 'bg-blue-50/60' : ''}`}
                    >
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{quote.id}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {customer ? fullName(customer) : 'Unknown'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{quote.serviceType}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">{formatMoney(quote.total)}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${quoteStatusClass(quote.status)}`}>
                          {quote.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2 text-xs font-medium">
                          <button onClick={() => setSelectedQuoteId(quote.id)} className="text-blue-600 hover:text-blue-800">
                            View
                          </button>
                          <button onClick={() => setQuoteStatus(quote.id, 'sent')} className="text-indigo-600 hover:text-indigo-800">
                            Send
                          </button>
                          <button onClick={() => setQuoteStatus(quote.id, 'accepted')} className="text-emerald-600 hover:text-emerald-800">
                            Accept
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="rounded-xl border bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900">Quote Preview</h2>
            {!selectedQuote && <p className="mt-3 text-sm text-gray-500">Select a quote to preview.</p>}
            {selectedQuote && (
              <div className="mt-4 space-y-4">
                <div className="flex items-start justify-between border-b pb-3">
                  <div>
                    <p className="text-sm text-gray-500">Quote #{selectedQuote.id}</p>
                    <p className="font-semibold text-gray-900">{selectedQuote.serviceType}</p>
                  </div>
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${quoteStatusClass(selectedQuote.status)}`}>
                    {selectedQuote.status.toUpperCase()}
                  </span>
                </div>

                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-gray-500">
                      <th className="py-2 text-left">Description</th>
                      <th className="py-2 text-right">Qty</th>
                      <th className="py-2 text-right">Unit</th>
                      <th className="py-2 text-right">Line Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedQuote.items.map((item, index) => (
                      <tr key={`${item.description}-${index}`} className="border-b">
                        <td className="py-2">{item.description}</td>
                        <td className="py-2 text-right">{item.quantity}</td>
                        <td className="py-2 text-right">{formatMoney(item.unitPrice)}</td>
                        <td className="py-2 text-right">{formatMoney(item.unitPrice * item.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatMoney(selectedQuote.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">VAT ({selectedQuote.vatRate}%)</span>
                    <span className="font-medium">
                      {formatMoney(selectedQuote.total - selectedQuote.subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-2 text-base font-bold">
                    <span>Total</span>
                    <span className="text-blue-700">{formatMoney(selectedQuote.total)}</span>
                  </div>
                </div>

                {selectedQuote.details && (
                  <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-700">{selectedQuote.details}</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showCustomerEdit && selectedCustomer && (
        <EditCustomerModal
          customer={selectedCustomer}
          onClose={() => setShowCustomerEdit(false)}
          onSave={saveCustomer}
        />
      )}
    </div>
  );
}

function EditCustomerModal({
  customer,
  onClose,
  onSave,
}: {
  customer: Customer;
  onClose: () => void;
  onSave: (customer: Customer) => void;
}) {
  const [form, setForm] = useState(customer);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-xl rounded-xl bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Edit Customer</h2>
          <button onClick={onClose} className="rounded-md px-2 py-1 text-gray-500 hover:bg-gray-100">
            Close
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input
            className="rounded-lg border px-3 py-2"
            value={form.firstName}
            onChange={(event) => setForm({ ...form, firstName: event.target.value })}
            placeholder="First name"
          />
          <input
            className="rounded-lg border px-3 py-2"
            value={form.lastName}
            onChange={(event) => setForm({ ...form, lastName: event.target.value })}
            placeholder="Last name"
          />
          <input
            className="rounded-lg border px-3 py-2"
            value={form.phone}
            onChange={(event) => setForm({ ...form, phone: event.target.value })}
            placeholder="Phone"
          />
          <input
            className="rounded-lg border px-3 py-2"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            placeholder="Email"
          />
          <input
            className="col-span-2 rounded-lg border px-3 py-2"
            value={form.addressLine1}
            onChange={(event) => setForm({ ...form, addressLine1: event.target.value })}
            placeholder="Address line 1"
          />
          <input
            className="rounded-lg border px-3 py-2"
            value={form.city}
            onChange={(event) => setForm({ ...form, city: event.target.value })}
            placeholder="City"
          />
          <input
            className="rounded-lg border px-3 py-2"
            value={form.postcode}
            onChange={(event) => setForm({ ...form, postcode: event.target.value })}
            placeholder="Postcode"
          />
        </div>

        <div className="mt-5 flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-lg border px-4 py-2 hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          >
            Save Customer
          </button>
        </div>
      </div>
    </div>
  );
}

