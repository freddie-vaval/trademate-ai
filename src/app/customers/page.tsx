'use client';

import { useState } from 'react';
import AddCustomerModal from '@/components/AddCustomerModal';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([
    { id: 1, name: 'John Smith', phone: '07700 900123', email: 'john@email.com', address: '42 Oak Street', jobs: 3, spent: '£420', lastJob: '2026-03-14', status: 'active', notes: 'Regular customer, prefers morning appointments' },
    { id: 2, name: 'Sarah Jones', phone: '07700 900456', email: 'sarah@email.com', address: '15 Maple Ave', jobs: 1, spent: '£85', lastJob: '2026-03-10', status: 'active', notes: '' },
    { id: 3, name: 'Mike Brown', phone: '07700 900789', email: 'mike@email.com', address: '8 Pine Road', jobs: 5, spent: '£890', lastJob: '2026-03-12', status: 'vip', notes: 'Landlord with multiple properties' },
    { id: 4, name: 'Emma Wilson', phone: '07700 900111', email: 'emma@email.com', address: '23 Cedar Lane', jobs: 2, spent: '£350', lastJob: '2026-03-08', status: 'active', notes: '' },
    { id: 5, name: 'David Lee', phone: '07700 900222', email: 'david@email.com', address: '67 Birch Way', jobs: 8, spent: '£1,240', lastJob: '2026-03-13', status: 'vip', notes: 'Very satisfied customer, refers friends' },
  ]);

  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  // Mock job history for detail view
  const jobHistory = [
    { id: 1, date: '2026-03-14', service: 'Boiler Service', price: '£120', status: 'completed' },
    { id: 2, date: '2025-11-20', service: 'Plumbing Repair', price: '£85', status: 'completed' },
    { id: 3, date: '2025-06-15', service: 'Gas Safety Check', price: '£150', status: 'completed' },
  ];

  const filtered = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    c.address.toLowerCase().includes(search.toLowerCase())
  );

  const addCustomer = (customer: any) => {
    setCustomers([...customers, customer]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Customer CRM</h1>
            <p className="text-gray-600">Manage your customer database</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            + Add Customer
          </button>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search by name, phone, or address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg"
            />
            <select className="px-4 py-2 border rounded-lg">
              <option>All Customers</option>
              <option>Active</option>
              <option>VIP</option>
              <option>New This Month</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <p className="text-sm text-gray-500">Total Customers</p>
            <p className="text-2xl font-bold">{customers.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <p className="text-sm text-gray-500">New This Month</p>
            <p className="text-2xl font-bold text-green-600">+2</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <p className="text-sm text-gray-500">VIP Customers</p>
            <p className="text-2xl font-bold text-purple-600">{customers.filter(c => c.status === 'vip').length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <p className="text-sm text-gray-500">Avg. Job Value</p>
            <p className="text-2xl font-bold">£185</p>
          </div>
        </div>

        {/* Customer Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Customer</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Contact</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Address</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Jobs</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Total Spent</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{customer.name}</p>
                    <p className="text-sm text-gray-500">Last: {customer.lastJob}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm">📞 {customer.phone}</p>
                    <p className="text-sm text-gray-500">{customer.email}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{customer.address}</td>
                  <td className="px-6 py-4 font-medium">{customer.jobs}</td>
                  <td className="px-6 py-4 font-medium text-green-600">{customer.spent}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      customer.status === 'vip' ? 'bg-purple-100 text-purple-700' :
                      customer.status === 'active' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {customer.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => setSelectedCustomer(customer)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Customer Modal */}
        <AddCustomerModal 
          isOpen={showAddModal} 
          onClose={() => setShowAddModal(false)} 
          onAdd={addCustomer}
        />

        {/* Customer Details Modal */}
        {selectedCustomer && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{selectedCustomer.name}</h2>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium mt-1 inline-block ${
                    selectedCustomer.status === 'vip' ? 'bg-purple-100 text-purple-700' :
                    selectedCustomer.status === 'active' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {selectedCustomer.status.toUpperCase()}
                  </span>
                </div>
                <button onClick={() => setSelectedCustomer(null)} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{selectedCustomer.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{selectedCustomer.email}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium">{selectedCustomer.address}</p>
                </div>
                {selectedCustomer.notes && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Notes</p>
                    <p className="font-medium">{selectedCustomer.notes}</p>
                  </div>
                )}
              </div>

              {/* Job History */}
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Job History</h3>
                <div className="space-y-3">
                  {jobHistory.map((job) => (
                    <div key={job.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{job.service}</p>
                        <p className="text-sm text-gray-500">{job.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-600">{job.price}</p>
                        <span className="text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                          {job.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex justify-between">
                    <span className="font-medium">Total Spent</span>
                    <span className="font-bold text-blue-600">{selectedCustomer.spent}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-6 border-t mt-6">
                <button 
                  onClick={() => setSelectedCustomer(null)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
                >
                  Close
                </button>
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  Edit Customer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
