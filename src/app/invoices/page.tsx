'use client';

import { useMemo, useState } from 'react';
import {
  formatMoney,
  fullName,
  useCustomers,
  useInvoices,
  useJobs,
  useQuotes,
} from '@/lib/data-store';
import { Customer, Invoice, InvoiceStatus } from '@/lib/types';

function statusClass(status: InvoiceStatus): string {
  switch (status) {
    case 'paid':
      return 'bg-green-100 text-green-700';
    case 'sent':
      return 'bg-blue-100 text-blue-700';
    case 'overdue':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

export default function InvoicesPage() {
  const [customers, setCustomers, customersHydrated] = useCustomers();
  const [jobs, setJobs, jobsHydrated] = useJobs();
  const [quotes, setQuotes, quotesHydrated] = useQuotes();
  const [invoices, setInvoices, invoicesHydrated] = useInvoices();
  const [filter, setFilter] = useState<'all' | InvoiceStatus>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [showCustomerEdit, setShowCustomerEdit] = useState(false);

  const ready = customersHydrated && jobsHydrated && quotesHydrated && invoicesHydrated;
  const selectedCustomer = customers.find((customer) => customer.id === selectedCustomerId) ?? null;

  const filteredInvoices = filter === 'all' ? invoices : invoices.filter((invoice) => invoice.status === filter);

  const stats = useMemo(() => {
    const total = invoices.reduce((sum, invoice) => sum + invoice.total, 0);
    const paid = invoices.filter((invoice) => invoice.status === 'paid').reduce((sum, invoice) => sum + invoice.total, 0);
    const outstanding = invoices
      .filter((invoice) => invoice.status === 'sent')
      .reduce((sum, invoice) => sum + invoice.total, 0);
    const overdue = invoices
      .filter((invoice) => invoice.status === 'overdue')
      .reduce((sum, invoice) => sum + invoice.total, 0);
    return { total, paid, outstanding, overdue };
  }, [invoices]);

  const setInvoiceStatus = (invoiceId: string, status: InvoiceStatus) => {
    setInvoices(
      invoices.map((invoice) =>
        invoice.id === invoiceId ? { ...invoice, status, updatedAt: new Date().toISOString() } : invoice
      )
    );
  };

  const saveCustomer = (customer: Customer) => {
    setCustomers(customers.map((entry) => (entry.id === customer.id ? customer : entry)));
    setShowCustomerEdit(false);
  };

  const createInvoice = (invoice: Invoice) => {
    setInvoices([invoice, ...invoices]);
    setShowCreateModal(false);
  };

  if (!ready) {
    return <div className="min-h-screen bg-gray-50 p-8 text-gray-600">Loading invoices...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <a href="/" className="mb-2 inline-block text-sm text-blue-600 hover:text-blue-800">← Dashboard</a>
            <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
            <p className="text-gray-600">Track Draft, Sent, Paid, and Overdue invoices</p>
          </div>
          <div className="flex gap-3">
            <select
              value={selectedCustomerId}
              onChange={(event) => setSelectedCustomerId(event.target.value)}
              className="rounded-lg border px-3 py-2 text-sm"
            >
              <option value="">Select customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {fullName(customer)}
                </option>
              ))}
            </select>
            <button
              disabled={!selectedCustomer}
              onClick={() => setShowCustomerEdit(true)}
              className="rounded-lg border px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 disabled:cursor-not-allowed disabled:text-gray-400"
            >
              Edit Customer
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
            >
              + Create Invoice
            </button>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-xl border bg-white p-4">
            <p className="text-sm text-gray-500">Total Invoiced</p>
            <p className="text-2xl font-bold">{formatMoney(stats.total)}</p>
          </div>
          <div className="rounded-xl border bg-white p-4">
            <p className="text-sm text-gray-500">Paid</p>
            <p className="text-2xl font-bold text-green-600">{formatMoney(stats.paid)}</p>
          </div>
          <div className="rounded-xl border bg-white p-4">
            <p className="text-sm text-gray-500">Outstanding</p>
            <p className="text-2xl font-bold text-blue-600">{formatMoney(stats.outstanding)}</p>
          </div>
          <div className="rounded-xl border bg-white p-4">
            <p className="text-sm text-gray-500">Overdue</p>
            <p className="text-2xl font-bold text-red-600">{formatMoney(stats.overdue)}</p>
          </div>
        </div>

        <div className="mb-6 flex gap-2 rounded-xl border bg-white p-3">
          {['all', 'draft', 'sent', 'paid', 'overdue'].map((value) => (
            <button
              key={value}
              onClick={() => setFilter(value as 'all' | InvoiceStatus)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                filter === value ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </button>
          ))}
        </div>

        <div className="overflow-hidden rounded-xl border bg-white">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Invoice</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Customer</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Source</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Issue</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Due</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredInvoices.map((invoice) => {
                const customer = customers.find((entry) => entry.id === invoice.customerId);
                const sourceLabel = invoice.jobId ? `Job ${invoice.jobId}` : invoice.quoteId ? `Quote ${invoice.quoteId}` : 'Manual';

                return (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{invoice.id}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium">{customer ? fullName(customer) : 'Unknown'}</p>
                      <p className="text-sm text-gray-500">{customer?.email}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{sourceLabel}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">{formatMoney(invoice.total)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{invoice.issueDate}</td>
                    <td className={`px-6 py-4 text-sm ${invoice.status === 'overdue' ? 'font-semibold text-red-600' : 'text-gray-600'}`}>
                      {invoice.dueDate}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusClass(invoice.status)}`}>
                        {invoice.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3 text-xs font-medium">
                        {invoice.status === 'draft' && (
                          <button onClick={() => setInvoiceStatus(invoice.id, 'sent')} className="text-blue-600 hover:text-blue-800">
                            Send
                          </button>
                        )}
                        {invoice.status !== 'paid' && (
                          <button onClick={() => setInvoiceStatus(invoice.id, 'paid')} className="text-green-600 hover:text-green-800">
                            Mark Paid
                          </button>
                        )}
                        {invoice.status !== 'overdue' && invoice.status !== 'paid' && (
                          <button onClick={() => setInvoiceStatus(invoice.id, 'overdue')} className="text-red-600 hover:text-red-800">
                            Mark Overdue
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showCreateModal && (
        <CreateInvoiceModal
          customers={customers}
          jobs={jobs}
          quotes={quotes}
          onClose={() => setShowCreateModal(false)}
          onCreate={createInvoice}
        />
      )}

      {showCustomerEdit && selectedCustomer && (
        <EditCustomerModal customer={selectedCustomer} onClose={() => setShowCustomerEdit(false)} onSave={saveCustomer} />
      )}
    </div>
  );
}

function CreateInvoiceModal({
  customers,
  jobs,
  quotes,
  onClose,
  onCreate,
}: {
  customers: Customer[];
  jobs: ReturnType<typeof useJobs>[0];
  quotes: ReturnType<typeof useQuotes>[0];
  onClose: () => void;
  onCreate: (invoice: Invoice) => void;
}) {
  const [customerId, setCustomerId] = useState(customers[0]?.id ?? '');
  const [sourceType, setSourceType] = useState<'job' | 'quote' | 'manual'>('manual');
  const [sourceId, setSourceId] = useState('');
  const [description, setDescription] = useState('Workshop Service');
  const [amount, setAmount] = useState('95');
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10));
  const issueDate = new Date().toISOString().slice(0, 10);

  const sourceOptions = sourceType === 'job' ? jobs : sourceType === 'quote' ? quotes : [];

  const handleCreate = () => {
    if (!customerId) return;
    const parsed = Number.parseFloat(amount);
    const subtotal = Number.isNaN(parsed) ? 0 : parsed;
    const vatRate = 20;
    const total = subtotal * 1.2;
    const now = new Date().toISOString();

    onCreate({
      id: `INV-${Date.now()}`,
      customerId,
      quoteId: sourceType === 'quote' ? sourceId || undefined : undefined,
      jobId: sourceType === 'job' ? sourceId || undefined : undefined,
      status: 'draft',
      issueDate,
      dueDate,
      items: [{ description, quantity: 1, unitPrice: subtotal }],
      subtotal,
      vatRate,
      total,
      notes: '',
      createdAt: now,
      updatedAt: now,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Create Invoice</h2>
          <button onClick={onClose} className="rounded-md px-2 py-1 text-gray-500 hover:bg-gray-100">
            Close
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Customer</label>
            <select value={customerId} onChange={(event) => setCustomerId(event.target.value)} className="w-full rounded-lg border px-3 py-2">
              <option value="">Select customer...</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {fullName(customer)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Source</label>
            <div className="grid grid-cols-3 gap-2">
              {(['manual', 'job', 'quote'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setSourceType(type);
                    setSourceId('');
                  }}
                  className={`rounded-lg px-3 py-2 text-xs font-medium ${
                    sourceType === type ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {type.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {sourceType !== 'manual' && (
            <select value={sourceId} onChange={(event) => setSourceId(event.target.value)} className="w-full rounded-lg border px-3 py-2">
              <option value="">Select {sourceType}...</option>
              {sourceOptions.map((source) => (
                <option key={source.id} value={source.id}>
                  {source.id}
                </option>
              ))}
            </select>
          )}

          <input
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="w-full rounded-lg border px-3 py-2"
            placeholder="Description"
          />
          <input
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            type="number"
            min="0"
            step="0.01"
            className="w-full rounded-lg border px-3 py-2"
            placeholder="Amount"
          />
          <input value={dueDate} onChange={(event) => setDueDate(event.target.value)} type="date" className="w-full rounded-lg border px-3 py-2" />
        </div>

        <div className="mt-6 flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-lg border px-4 py-2 hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={handleCreate} className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">
            Create Draft
          </button>
        </div>
      </div>
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

