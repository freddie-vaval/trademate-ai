'use client';

import { useState } from 'react';
import AddJobModal from '@/components/AddJobModal';

export default function JobsPage() {
  const [jobs, setJobs] = useState([
    { id: 1, customer: 'John Smith', phone: '07700 900123', service: 'Boiler Service', price: '£120', status: 'booked', date: '2026-03-15', time: '10:00', description: 'Annual boiler service', notes: 'Regular customer' },
    { id: 2, customer: 'Sarah Jones', phone: '07700 900456', service: 'Plumbing Repair', price: '£85', status: 'booked', date: '2026-03-16', time: '14:00', description: 'Leaking pipe under sink', notes: '' },
    { id: 3, customer: 'Mike Brown', phone: '07700 900789', service: 'Gas Safety Check', price: '£150', status: 'in-progress', date: '2026-03-14', time: '09:00', description: 'Landlord gas safety certificate', notes: 'Urgent' },
    { id: 4, customer: 'Emma Wilson', phone: '07700 900111', service: 'New Radiator', price: '£350', status: 'in-progress', date: '2026-03-14', time: '11:00', description: 'Install new towel radiator', notes: 'Parts ordered' },
    { id: 5, customer: 'David Lee', phone: '07700 900222', service: 'Boiler Repair', price: '£200', status: 'completed', date: '2026-03-13', time: '10:00', description: 'No hot water', notes: 'Replaced thermostat' },
    { id: 6, customer: 'Lisa Taylor', phone: '07700 900333', service: 'Plumbing Repair', price: '£95', status: 'completed', date: '2026-03-12', time: '15:00', description: 'Blocked drain', notes: '' },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);

  const columns = [
    { id: 'booked', title: 'Booked', color: 'blue' },
    { id: 'in-progress', title: 'In Progress', color: 'yellow' },
    { id: 'completed', title: 'Completed', color: 'green' },
  ];

  const customers = [
    { id: 1, name: 'John Smith' },
    { id: 2, name: 'Sarah Jones' },
    { id: 3, name: 'Mike Brown' },
    { id: 4, name: 'Emma Wilson' },
    { id: 5, name: 'David Lee' },
    { id: 6, name: 'Lisa Taylor' },
  ];

  const moveJob = (jobId: number, newStatus: string) => {
    setJobs(jobs.map(job => 
      job.id === jobId ? { ...job, status: newStatus } : job
    ));
  };

  const addJob = (job: any) => {
    setJobs([...jobs, job]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Job Management</h1>
            <p className="text-gray-600">Drag and drop jobs between stages</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            + Add Job
          </button>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((column) => (
            <div key={column.id} className="bg-gray-100 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-700 capitalize">{column.title}</h2>
                <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${column.color}-200 text-${column.color}-700`}>
                  {jobs.filter(j => j.status === column.id).length}
                </span>
              </div>
              <div className="space-y-3">
                {jobs.filter(job => job.status === column.id).map((job) => (
                  <div
                    key={job.id}
                    draggable
                    className="bg-white rounded-lg shadow-sm border p-4 cursor-move hover:shadow-md transition"
                    onDragStart={(e) => e.dataTransfer.setData('jobId', job.id.toString())}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      moveJob(job.id, column.id);
                    }}
                    onClick={() => setSelectedJob(job)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900">{job.customer}</h3>
                      <span className="font-semibold text-blue-600">{job.price}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{job.service}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">📞 {job.phone}</span>
                      <span className="text-gray-500">📅 {job.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Add Job Modal */}
        <AddJobModal 
          isOpen={showAddModal} 
          onClose={() => setShowAddModal(false)} 
          onAdd={addJob}
          customers={customers}
        />

        {/* Job Details Modal */}
        {selectedJob && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-lg">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">Job Details</h2>
                <button onClick={() => setSelectedJob(null)} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Customer</p>
                    <p className="font-medium">{selectedJob.customer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{selectedJob.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Service</p>
                    <p className="font-medium">{selectedJob.service}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="font-medium text-blue-600">{selectedJob.price}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">{selectedJob.date} at {selectedJob.time}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      selectedJob.status === 'booked' ? 'bg-blue-100 text-blue-700' :
                      selectedJob.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {selectedJob.status}
                    </span>
                  </div>
                </div>
                
                {selectedJob.description && (
                  <div>
                    <p className="text-sm text-gray-500">Description</p>
                    <p className="font-medium">{selectedJob.description}</p>
                  </div>
                )}
                
                {selectedJob.notes && (
                  <div>
                    <p className="text-sm text-gray-500">Notes</p>
                    <p className="font-medium">{selectedJob.notes}</p>
                  </div>
                )}

                <div className="flex gap-2 pt-4 border-t">
                  <button 
                    onClick={() => setSelectedJob(null)}
                    className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
                  >
                    Close
                  </button>
                  <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    Edit Job
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
