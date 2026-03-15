'use client';

import { useState } from 'react';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([
    { id: 'INV-001', customer: 'John Smith', email: 'john@email.com', job: 'Boiler Service', amount: '£120', status: 'paid', date: '2026-03-14', dueDate: '2026-03-28' },
    { id: 'INV-002', customer: 'Sarah Jones', email: 'sarah@email.com', job: 'Plumbing Repair', amount: '£85', status: 'sent', date: '2026-03-10', dueDate: '2026-03-24' },
    { id: 'INV-003', customer: 'Mike Brown', email: 'mike@email.com', job: 'Gas Safety Check', amount: '£150', status: 'overdue', date: '2026-02-28', dueDate: '2026-03-14' },
    { id: 'INV-004', customer: 'Emma Wilson', email: 'emma@email.com', job: 'New Radiator', amount: '£350', status: 'draft', date: '2026-03-15', dueDate: '2026-03-29' },
    { id: 'INV-005', customer: 'David Lee', email: 'david@email.com', job: 'Boiler Repair', amount: '£200', status: 'paid', date: '2026-03-13', dueDate: '2026-03-27' },
  ]);

  const [filter, setFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filtered = filter === 'all' ? invoices : invoices.filter(i => i.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-700';
      case 'sent': return 'bg-blue-100 text-blue-700';
      case 'overdue': return 'bg-red-100 text-red-700';
      case 'draft': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const markAsPaid = (id: string) => {
    setInvoices(invoices.map(inv => 
      inv.id === id ? { ...inv, status: 'paid' } : inv
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
            <p className="text-gray-600">Manage quotes and invoices</p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            + Create Invoice
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <p className="text-sm text-gray-500">Total Invoiced</p>
            <p className="text-2xl font-bold">£{invoices.reduce((sum, inv) => sum + parseFloat(inv.amount.replace('£', '')), 0).toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <p className="text-sm text-gray-500">Paid</p>
            <p className="text-2xl font-bold text-green-600">£{invoices.filter(i => i.status === 'paid').reduce((sum, inv) => sum + parseFloat(inv.amount.replace('£', '')), 0).toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <p className="text-sm text-gray-500">Outstanding</p>
            <p className="text-2xl font-bold text-yellow-600">£{invoices.filter(i => i.status === 'sent').reduce((sum, inv) => sum + parseFloat(inv.amount.replace('£', '')), 0).toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <p className="text-sm text-gray-500">Overdue</p>
            <p className="text-2xl font-bold text-red-600">£{invoices.filter(i => i.status === 'overdue').reduce((sum, inv) => sum + parseFloat(inv.amount.replace('£', '')), 0).toLocaleString()}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
          <div className="flex gap-2">
            {['all', 'draft', 'sent', 'paid', 'overdue'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === f 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Invoices Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Invoice</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Customer</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Job</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Amount</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Date</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Due</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{invoice.id}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium">{invoice.customer}</p>
                    <p className="text-sm text-gray-500">{invoice.email}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{invoice.job}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">{invoice.amount}</td>
                  <td className="px-6 py-4 text-gray-600">{invoice.date}</td>
                  <td className="px-6 py-4">
                    <span className={invoice.status === 'overdue' ? 'text-red-600 font-medium' : 'text-gray-600'}>
                      {invoice.dueDate}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                      {invoice.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        View
                      </button>
                      {invoice.status !== 'paid' && (
                        <button 
                          onClick={() => markAsPaid(invoice.id)}
                          className="text-green-600 hover:text-green-800 text-sm font-medium"
                        >
                          Mark Paid
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Create Invoice Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Create Invoice</h2>
                <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                  <select className="w-full px-4 py-2 border rounded-lg">
                    <option>Select customer...</option>
                    {invoices.map((inv) => (
                      <option key={inv.id} value={inv.customer}>{inv.customer}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job/Service</label>
                  <select className="w-full px-4 py-2 border rounded-lg">
                    <option>Select job...</option>
                    {invoices.map((inv) => (
                      <option key={inv.id} value={inv.job}>{inv.job}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount (£)</label>
                  <input type="number" className="w-full px-4 py-2 border rounded-lg" placeholder="0.00" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input type="date" className="w-full px-4 py-2 border rounded-lg" />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    Create Invoice
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
