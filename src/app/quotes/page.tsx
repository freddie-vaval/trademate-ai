'use client';

import { useState } from 'react';

export default function QuotesPage() {
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    service: 'Boiler Service',
    details: '',
  });
  const [generatedQuote, setGeneratedQuote] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const services = [
    'Boiler Service',
    'Boiler Repair',
    'Plumbing Repair',
    'Gas Safety Check',
    'New Radiator',
    'Central Heating',
    'Bathroom Installation',
    'Electrical Inspection',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setGeneratedQuote(data.quote);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quote Generator</h1>
        <p className="text-gray-600 mb-8">Create professional quotes in seconds with AI assistance</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4">New Quote</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
                <select
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                >
                  {services.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Details</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Any specific requirements or notes..."
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
              >
                {loading ? 'Generating...' : 'Generate Quote'}
              </button>
            </form>
          </div>

          {/* Preview */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4">Quote Preview</h2>
            {generatedQuote ? (
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-blue-600">TradeMate AI</h3>
                      <p className="text-sm text-gray-500">Professional Trade Services</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Quote #{generatedQuote.id}</p>
                      <p className="text-sm text-gray-500">{new Date(generatedQuote.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Quote for:</p>
                    <p className="font-semibold">{generatedQuote.customer}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Items</h4>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Description</th>
                        <th className="text-right py-2">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {generatedQuote.items.map((item: any, i: number) => (
                        <tr key={i} className="border-b">
                          <td className="py-2">{item.description}</td>
                          <td className="text-right">£{item.price}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td className="py-2 font-semibold">Total</td>
                        <td className="text-right font-bold text-blue-600">£{generatedQuote.total}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>Valid until:</strong> {new Date(generatedQuote.validUntil).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Includes 12-month guarantee on all work</p>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition">
                    Send to Customer
                  </button>
                  <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition">
                    Download PDF
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p>Fill in the form to generate a quote</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
