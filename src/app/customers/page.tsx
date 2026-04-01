'use client';

import { useMemo, useState } from 'react';
import AddCustomerModal from '@/components/AddCustomerModal';
import { formatMoney, fullName, useCustomers, useInvoices, useJobs } from '@/lib/data-store';
import { Customer, CustomerStatus } from '@/lib/types';

function statusClass(status: CustomerStatus): string {
  switch (status) {
    case 'vip':
      return 'bg-purple-100 text-purple-700';
    case 'active':
      return 'bg-green-100 text-green-700';
    case 'prospect':
      return 'bg-blue-100 text-blue-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

export default function CustomersPage() {
  const [customers, setCustomers, customersHydrated] = useCustomers();
  const [jobs, setJobs, jobsHydrated] = useJobs();
  const [invoices, setInvoices, invoicesHydrated] = useInvoices();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | CustomerStatus>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  const ready = customersHydrated && jobsHydrated && invoicesHydrated;
  const selectedCustomer = customers.find((customer) => customer.id === selectedCustomerId) ?? null;

  const filteredCustomers = useMemo(() => {
    const needle = search.trim().toLowerCase();

    return customers.filter((customer) => {
      const name = fullName(customer).toLowerCase();
      const matchesSearch =
        needle.length === 0 ||
        name.includes(needle) ||
        customer.phone.includes(search) ||
        customer.email.toLowerCase().includes(needle) ||
        customer.postcode.toLowerCase().includes(needle);
      const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [customers, search, statusFilter]);

  const customerStats = useMemo(() => {
    const jobsByCustomer = new Map<string, number>();
    const spendByCustomer = new Map<string, number>();

    for (const job of jobs) {
      jobsByCustomer.set(job.customerId, (jobsByCustomer.get(job.customerId) ?? 0) + 1);
    }

    for (const invoice of invoices) {
      if (invoice.status !== 'paid') continue;
      spendByCustomer.set(
        invoice.customerId,
        (spendByCustomer.get(invoice.customerId) ?? 0) + invoice.total
      );
    }

    return { jobsByCustomer, spendByCustomer };
  }, [invoices, jobs]);

  const addCustomer = (customer: Customer) => {
    setCustomers([customer, ...customers]);
  };

  const markVip = (customerId: string) => {
    setCustomers(
      customers.map((customer) =>
        customer.id === customerId ? { ...customer, status: 'vip' } : customer
      )
    );
  };

  if (!ready) {
    return <div className="min-h-screen bg-gray-50 p-8 text-gray-600">Loading customers...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <a href="/" className="mb-2 inline-block text-sm text-blue-600 hover:text-blue-800">← Dashboard</a>
            <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
            <p className="text-gray-600">CRM with full history, contact details, and spend tracking</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
          >
            + Add Customer
          </button>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 rounded-xl border bg-white p-4 md:grid-cols-3">
          <input
            type="text"
            placeholder="Search name, phone, email, postcode..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-lg border px-4 py-2"
          />
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as 'all' | CustomerStatus)}
            className="rounded-lg border px-4 py-2"
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="vip">VIP</option>
            <option value="prospect">Prospect</option>
            <option value="inactive">Inactive</option>
          </select>
          <div className="rounded-lg bg-slate-50 px-4 py-2 text-sm text-slate-700">
            Total customers: <span className="font-semibold">{customers.length}</span>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-xl border bg-white p-4">
            <p className="text-sm text-gray-500">Active</p>
            <p className="text-2xl font-bold text-green-600">
              {customers.filter((customer) => customer.status === 'active').length}
            </p>
          </div>
          <div className="rounded-xl border bg-white p-4">
            <p className="text-sm text-gray-500">VIP</p>
            <p className="text-2xl font-bold text-purple-600">
              {customers.filter((customer) => customer.status === 'vip').length}
            </p>
          </div>
          <div className="rounded-xl border bg-white p-4">
            <p className="text-sm text-gray-500">Prospects</p>
            <p className="text-2xl font-bold text-blue-600">
              {customers.filter((customer) => customer.status === 'prospect').length}
            </p>
          </div>
          <div className="rounded-xl border bg-white p-4">
            <p className="text-sm text-gray-500">Revenue (Paid)</p>
            <p className="text-2xl font-bold text-emerald-600">
              {formatMoney(invoices.filter((invoice) => invoice.status === 'paid').reduce((sum, invoice) => sum + invoice.total, 0))}
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border bg-white">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Customer</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Contact</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Address</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Jobs</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Total Spent</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredCustomers.map((customer) => {
                const jobCount = customerStats.jobsByCustomer.get(customer.id) ?? 0;
                const totalSpent = customerStats.spendByCustomer.get(customer.id) ?? 0;

                return (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{fullName(customer)}</p>
                      <p className="text-sm text-gray-500">{customer.email}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <p>{customer.phone}</p>
                      {customer.altPhone && <p>{customer.altPhone}</p>}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <p>{customer.addressLine1}</p>
                      <p>
                        {customer.city} {customer.postcode}
                      </p>
                    </td>
                    <td className="px-6 py-4 font-medium">{jobCount}</td>
                    <td className="px-6 py-4 font-medium text-emerald-700">{formatMoney(totalSpent)}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusClass(customer.status)}`}>
                        {customer.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        <button
                          onClick={() => setSelectedCustomerId(customer.id)}
                          className="text-sm font-medium text-blue-600 hover:text-blue-800"
                        >
                          View
                        </button>
                        {customer.status !== 'vip' && (
                          <button
                            onClick={() => markVip(customer.id)}
                            className="text-sm font-medium text-purple-600 hover:text-purple-800"
                          >
                            Mark VIP
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

      <AddCustomerModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onAdd={addCustomer} />

      {selectedCustomer && (
        <CustomerDetailsModal
          customer={selectedCustomer}
          jobs={jobs.filter((job) => job.customerId === selectedCustomer.id)}
          spent={customerStats.spendByCustomer.get(selectedCustomer.id) ?? 0}
          onClose={() => setSelectedCustomerId(null)}
        />
      )}
    </div>
  );
}

function CustomerDetailsModal({
  customer,
  jobs,
  spent,
  onClose,
}: {
  customer: Customer;
  jobs: ReturnType<typeof useJobs>[0];
  spent: number;
  onClose: () => void;
}) {
  const sortedJobs = [...jobs].sort((a, b) => b.bookedDate.localeCompare(a.bookedDate));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-6">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{fullName(customer)}</h2>
            <span className={`mt-2 inline-block rounded-full px-2 py-1 text-xs font-semibold ${statusClass(customer.status)}`}>
              {customer.status.toUpperCase()}
            </span>
          </div>
          <button onClick={onClose} className="rounded-md px-2 py-1 text-gray-500 hover:bg-gray-100">
            Close
          </button>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="font-medium">{customer.phone}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{customer.email}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-gray-500">Address</p>
            <p className="font-medium">
              {customer.addressLine1}
              {customer.addressLine2 ? `, ${customer.addressLine2}` : ''}, {customer.city} {customer.postcode}
            </p>
          </div>
          {customer.notes && (
            <div className="col-span-2">
              <p className="text-sm text-gray-500">Notes</p>
              <p className="font-medium">{customer.notes}</p>
            </div>
          )}
        </div>

        <div className="border-t pt-6">
          <h3 className="mb-4 font-semibold text-gray-900">Job History</h3>
          <div className="space-y-3">
            {sortedJobs.length === 0 && (
              <p className="rounded-lg bg-gray-50 p-3 text-sm text-gray-500">No jobs yet for this customer.</p>
            )}
            {sortedJobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <div>
                  <p className="font-medium text-gray-900">{job.serviceType}</p>
                  <p className="text-sm text-gray-500">
                    {job.bookedDate} at {job.bookedTime}
                  </p>
                </div>
                <p className="font-semibold text-emerald-700">{formatMoney(job.price)}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-lg bg-blue-50 p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-blue-900">Total Spent (Paid Invoices)</span>
              <span className="text-xl font-bold text-blue-700">{formatMoney(spent)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

