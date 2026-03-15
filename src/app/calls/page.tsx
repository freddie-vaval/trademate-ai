'use client';

import { useState } from 'react';

export default function CallsPage() {
  const [calls, setCalls] = useState([
    { 
      id: 'CALL-001', 
      customer: 'John Smith', 
      phone: '07700 900123', 
      direction: 'inbound',
      status: 'completed', 
      duration: '4:23',
      date: '2026-03-15 14:32',
      summary: 'Booked boiler service for March 20th',
      transcription: 'Customer reported no hot water. Scheduled annual service.',
      recording: null,
      booked: true,
    },
    { 
      id: 'CALL-002', 
      customer: 'Unknown', 
      phone: '07700 900456', 
      direction: 'inbound',
      status: 'completed', 
      duration: '2:15',
      date: '2026-03-15 11:45',
      summary: 'Inquiry about gas safety certificate',
      transcription: 'Asked for quote on gas safety check. Did not book.',
      recording: null,
      booked: false,
    },
    { 
      id: 'CALL-003', 
      customer: 'Sarah Jones', 
      phone: '07700 900789', 
      direction: 'inbound',
      status: 'missed', 
      duration: '0:00',
      date: '2026-03-14 09:15',
      summary: 'Missed call - voicemail left',
      transcription: '',
      recording: null,
      booked: false,
    },
    { 
      id: 'CALL-004', 
      customer: 'Mike Brown', 
      phone: '07700 900111', 
      direction: 'inbound',
      status: 'completed', 
      duration: '5:47',
      date: '2026-03-13 16:20',
      summary: 'Emergency - leaking pipe. Booked urgent callout.',
      transcription: 'Customer reported major leak in kitchen. Dispatched engineer same-day.',
      recording: null,
      booked: true,
    },
  ]);

  const [selectedCall, setSelectedCall] = useState<any>(null);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' 
    ? calls 
    : filter === 'booked' 
      ? calls.filter(c => c.booked)
      : calls.filter(c => c.status === filter);

  const stats = {
    total: calls.length,
    booked: calls.filter(c => c.booked).length,
    missed: calls.filter(c => c.status === 'missed').length,
    avgDuration: '3:28',
  };

  const getStatusColor = (status: string, booked: boolean) => {
    if (booked) return 'bg-green-100 text-green-700';
    switch (status) {
      case 'completed': return 'bg-blue-100 text-blue-700';
      case 'missed': return 'bg-red-100 text-red-700';
      case 'in-progress': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Phone Receptionist</h1>
            <p className="text-gray-600">Live call handling with AI voice</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-medium text-green-600">AI Active</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <p className="text-sm text-gray-500">Total Calls</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <p className="text-sm text-gray-500">Jobs Booked</p>
            <p className="text-2xl font-bold text-green-600">{stats.booked}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <p className="text-sm text-gray-500">Missed</p>
            <p className="text-2xl font-bold text-red-600">{stats.missed}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <p className="text-sm text-gray-500">Avg Duration</p>
            <p className="text-2xl font-bold">{stats.avgDuration}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
          <div className="flex gap-2">
            {[
              { id: 'all', label: 'All Calls' },
              { id: 'booked', label: 'Booked' },
              { id: 'completed', label: 'Completed' },
              { id: 'missed', label: 'Missed' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === f.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Calls List */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Call</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Customer</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Phone</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Duration</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Summary</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((call) => (
                <tr key={call.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{call.id}</p>
                    <p className="text-sm text-gray-500">{call.date}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium">{call.customer}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{call.phone}</td>
                  <td className="px-6 py-4 text-gray-600">{call.duration}</td>
                  <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                    {call.summary}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(call.status, call.booked)}`}>
                      {call.booked ? 'BOOKED' : call.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => setSelectedCall(call)}
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

        {/* Call Details Modal */}
        {selectedCall && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Call Details</h2>
                  <p className="text-gray-500">{selectedCall.id} • {selectedCall.date}</p>
                </div>
                <button onClick={() => setSelectedCall(null)} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Customer</p>
                  <p className="font-medium">{selectedCall.customer}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{selectedCall.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Direction</p>
                  <p className="font-medium capitalize">{selectedCall.direction}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-medium">{selectedCall.duration}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedCall.status, selectedCall.booked)}`}>
                    {selectedCall.booked ? 'BOOKED' : selectedCall.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">AI Summary</p>
                  <p className="font-medium">{selectedCall.summary}</p>
                </div>
                
                {selectedCall.transcription && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Transcription</p>
                    <div className="bg-gray-50 p-3 rounded-lg text-sm">
                      "{selectedCall.transcription}"
                    </div>
                  </div>
                )}

                {selectedCall.recording && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Recording</p>
                    <audio controls className="w-full">
                      <source src={selectedCall.recording} type="audio/mp3" />
                    </audio>
                  </div>
                )}
              </div>

              {selectedCall.booked && (
                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="font-medium text-green-800">✓ Job Created</p>
                  <p className="text-sm text-green-600">This call resulted in a booked job</p>
                </div>
              )}

              <div className="flex gap-2 pt-6 border-t mt-6">
                <button 
                  onClick={() => setSelectedCall(null)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
                >
                  Close
                </button>
                {!selectedCall.booked && (
                  <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    Create Job
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
