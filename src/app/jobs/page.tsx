'use client';

import { useMemo, useState } from 'react';
import AddJobModal from '@/components/AddJobModal';
import { formatMoney, fullName, useCustomerMap, useCustomers, useJobs } from '@/lib/data-store';
import { jobStatusLabels } from '@/lib/seed-data';
import { Job, JobStatus } from '@/lib/types';

const jobColumns: JobStatus[] = [
  'booked-in',
  'diagnosis',
  'awaiting-parts',
  'in-repair',
  'quality-check',
  'ready-for-collection',
  'collected',
];

function statusClass(status: JobStatus): string {
  switch (status) {
    case 'booked-in':
      return 'bg-blue-100 text-blue-700';
    case 'diagnosis':
      return 'bg-indigo-100 text-indigo-700';
    case 'awaiting-parts':
      return 'bg-amber-100 text-amber-700';
    case 'in-repair':
      return 'bg-purple-100 text-purple-700';
    case 'quality-check':
      return 'bg-cyan-100 text-cyan-700';
    case 'ready-for-collection':
      return 'bg-emerald-100 text-emerald-700';
    case 'collected':
      return 'bg-slate-200 text-slate-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

export default function JobsPage() {
  const [jobs, setJobs, jobsHydrated] = useJobs();
  const [customers, setCustomers, customersHydrated] = useCustomers();
  const customerMap = useCustomerMap(customers);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | JobStatus>('all');

  const ready = jobsHydrated && customersHydrated;

  const selectedJob = useMemo(
    () => jobs.find((job) => job.id === selectedJobId) ?? null,
    [jobs, selectedJobId]
  );

  const filteredJobs = useMemo(() => {
    const needle = search.trim().toLowerCase();

    return jobs.filter((job) => {
      const customer = customerMap.get(job.customerId);
      const customerName = customer ? fullName(customer).toLowerCase() : '';
      const matchesSearch =
        needle.length === 0 ||
        customerName.includes(needle) ||
        job.serviceType.toLowerCase().includes(needle) ||
        job.description.toLowerCase().includes(needle);
      const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [customerMap, jobs, search, statusFilter]);

  const addJob = (job: Job) => {
    setJobs([job, ...jobs]);
  };

  const moveJob = (jobId: string, nextStatus: JobStatus) => {
    setJobs(
      jobs.map((job) => {
        if (job.id !== jobId || job.status === nextStatus) return job;
        return {
          ...job,
          status: nextStatus,
          timeline: [
            ...job.timeline,
            {
              id: `timeline_${Date.now()}`,
              status: nextStatus,
              label: `Moved to ${jobStatusLabels[nextStatus]}`,
              at: new Date().toISOString(),
            },
          ],
        };
      })
    );
  };

  const promoteJob = (job: Job) => {
    const currentIndex = jobColumns.indexOf(job.status);
    const nextStatus = jobColumns[Math.min(currentIndex + 1, jobColumns.length - 1)];
    moveJob(job.id, nextStatus);
  };

  if (!ready) {
    return <div className="min-h-screen bg-gray-50 p-8 text-gray-600">Loading jobs...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-[92rem] px-4">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <a href="/" className="mb-2 inline-block text-sm text-blue-600 hover:text-blue-800">← Dashboard</a>
            <h1 className="text-3xl font-bold text-gray-900">Job Board</h1>
            <p className="text-gray-600">Track every repair from booking to collection</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
          >
            + Add Job
          </button>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-3 rounded-xl border bg-white p-4 md:grid-cols-4">
          <input
            type="text"
            placeholder="Search customer, service, description..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-lg border px-4 py-2"
          />
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as 'all' | JobStatus)}
            className="rounded-lg border px-4 py-2"
          >
            <option value="all">All statuses</option>
            {jobColumns.map((status) => (
              <option key={status} value={status}>
                {jobStatusLabels[status]}
              </option>
            ))}
          </select>
          <div className="rounded-lg bg-slate-50 px-4 py-2 text-sm text-slate-700">
            Total jobs: <span className="font-semibold">{jobs.length}</span>
          </div>
          <div className="rounded-lg bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
            Collected: <span className="font-semibold">{jobs.filter((job) => job.status === 'collected').length}</span>
          </div>
        </div>

        <div className="mb-8 overflow-x-auto">
          <div className="grid min-w-[1200px] grid-cols-7 gap-4">
            {jobColumns.map((status) => {
              const columnJobs = filteredJobs.filter((job) => job.status === status);

              return (
                <div
                  key={status}
                  className="rounded-xl bg-gray-100 p-3"
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault();
                    const jobId = event.dataTransfer.getData('jobId');
                    if (jobId) moveJob(jobId, status);
                  }}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-gray-700">{jobStatusLabels[status]}</h2>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${statusClass(status)}`}>
                      {columnJobs.length}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {columnJobs.map((job) => {
                      const customer = customerMap.get(job.customerId);
                      return (
                        <button
                          key={job.id}
                          draggable
                          onDragStart={(event) => event.dataTransfer.setData('jobId', job.id)}
                          onClick={() => setSelectedJobId(job.id)}
                          className="w-full rounded-lg border bg-white p-3 text-left shadow-sm transition hover:shadow-md"
                        >
                          <p className="font-medium text-gray-900">
                            {customer ? fullName(customer) : 'Unknown Customer'}
                          </p>
                          <p className="mt-1 text-sm text-gray-600">{job.serviceType}</p>
                          <p className="mt-2 text-sm font-semibold text-blue-700">{formatMoney(job.price)}</p>
                          <p className="mt-1 text-xs text-gray-500">
                            {job.bookedDate} at {job.bookedTime}
                          </p>
                        </button>
                      );
                    })}
                    {columnJobs.length === 0 && (
                      <p className="rounded-lg border border-dashed border-gray-300 p-3 text-xs text-gray-500">
                        Drop jobs here
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border bg-white">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Service</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">When</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Price</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredJobs.map((job) => {
                const customer = customerMap.get(job.customerId);
                return (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {customer ? fullName(customer) : 'Unknown Customer'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{job.serviceType}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {job.bookedDate} {job.bookedTime}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusClass(job.status)}`}>
                        {jobStatusLabels[job.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">{formatMoney(job.price)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3 text-sm font-medium">
                        <button onClick={() => setSelectedJobId(job.id)} className="text-blue-600 hover:text-blue-800">
                          View
                        </button>
                        <button onClick={() => promoteJob(job)} className="text-emerald-600 hover:text-emerald-800">
                          Move +
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <AddJobModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={addJob}
        customers={customers}
      />

      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Job Details</h2>
                <p className="text-sm text-gray-500">{selectedJob.id}</p>
              </div>
              <button
                onClick={() => setSelectedJobId(null)}
                className="rounded-md px-2 py-1 text-gray-500 hover:bg-gray-100"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Customer</p>
                <p className="font-medium text-gray-900">
                  {selectedJob && customerMap.get(selectedJob.customerId)
                    ? fullName(customerMap.get(selectedJob.customerId)!)
                    : 'Unknown'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Service</p>
                <p className="font-medium text-gray-900">{selectedJob.serviceType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Booked</p>
                <p className="font-medium text-gray-900">
                  {selectedJob.bookedDate} at {selectedJob.bookedTime}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Price</p>
                <p className="font-medium text-blue-700">{formatMoney(selectedJob.price)}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Description</p>
                <p className="font-medium text-gray-900">{selectedJob.description || 'No description'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Notes</p>
                <p className="font-medium text-gray-900">{selectedJob.notes || 'No notes'}</p>
              </div>
            </div>

            <div className="mt-6 border-t pt-5">
              <h3 className="mb-3 font-semibold text-gray-900">Timeline</h3>
              <div className="space-y-2">
                {selectedJob.timeline.map((event) => (
                  <div key={event.id} className="rounded-lg bg-gray-50 p-3">
                    <p className="text-sm font-semibold text-gray-800">{event.label}</p>
                    <p className="text-xs text-gray-500">{new Date(event.at).toLocaleString('en-GB')}</p>
                    {event.note && <p className="mt-1 text-sm text-gray-700">{event.note}</p>}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 border-t pt-5">
              <h3 className="mb-2 font-semibold text-gray-900">Photos</h3>
              {selectedJob.photos.length === 0 ? (
                <p className="rounded-lg bg-gray-50 p-3 text-sm text-gray-500">No photos added yet.</p>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {selectedJob.photos.map((photo, index) => (
                    <img key={`${photo}-${index}`} src={photo} alt={`Job photo ${index + 1}`} className="rounded-lg" />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

