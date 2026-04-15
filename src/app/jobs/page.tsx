'use client';

import { useMemo, useState } from 'react';
import AddJobModal from '@/components/AddJobModal';
import { formatMoney, fullName, useCustomerMap, useCustomers, useJobs } from '@/lib/data-store';
import { jobStatusLabels } from '@/lib/seed-data';
import { Job, JobStatus } from '@/lib/types';

const jobColumns: JobStatus[] = [
  'quoted',
  'booked-in',
  'in-repair',
  'ready-for-collection',
];

function statusBadge(status: JobStatus, count: number) {
  let bg = '#f3f4f6';
  let color = '#6b7280';
  if (status === 'quoted') { bg = '#dbeafe'; color = '#1d4ed8'; }
  else if (status === 'booked-in') { bg = '#bfdbfe'; color = '#1e40af'; }
  else if (status === 'in-repair') { bg = '#e9d5ff'; color = '#6b21a8'; }
  else if (status === 'ready-for-collection') { bg = '#dcfce7'; color = '#15803d'; }

  return { bg, color };
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
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#6b7280' }}>Loading jobs...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '92rem', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
          <div>
            <a href='/app' style={{ display: 'inline-block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#2563eb', textDecoration: 'none' }}>← App</a>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827' }}>Job Board</h1>
            <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>Track every repair from booking to collection</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            style={{ backgroundColor: '#2563eb', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: '500', border: 'none', cursor: 'pointer', fontSize: '0.875rem' }}
          >
            + Add Job
          </button>
        </div>

        {/* Filters row */}
        <div style={{ marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', backgroundColor: 'white', borderRadius: '0.75rem', padding: '1rem', border: '1px solid #e5e7eb' }}>
          <input
            type='text'
            placeholder='Search customer, service...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | JobStatus)}
            style={{ padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
          >
            <option value='all'>All statuses</option>
            {jobColumns.map((status) => (
              <option key={status} value={status}>{jobStatusLabels[status]}</option>
            ))}
          </select>
          <div style={{ padding: '0.5rem 0.75rem', borderRadius: '0.5rem', backgroundColor: '#f8fafc', fontSize: '0.875rem', color: '#64748b', display: 'flex', alignItems: 'center' }}>
            Total: <strong style={{ marginLeft: '0.25rem', color: '#1e293b' }}>{jobs.length}</strong>
          </div>
          <div style={{ padding: '0.5rem 0.75rem', borderRadius: '0.5rem', backgroundColor: '#f0fdf4', fontSize: '0.875rem', color: '#15803d', display: 'flex', alignItems: 'center' }}>
            Collected: <strong style={{ marginLeft: '0.25rem' }}>{jobs.filter(j => j.status === 'collected').length}</strong>
          </div>
        </div>

        {/* Kanban board */}
        <div style={{ marginBottom: '2rem', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', minWidth: '700px' }}>
          {jobColumns.map((status) => {
            const columnJobs = filteredJobs.filter((job) => job.status === status);
            const badge = statusBadge(status, columnJobs.length);

            return (
              <div
                key={status}
                style={{ borderRadius: '0.75rem', backgroundColor: '#f3f4f6', padding: '0.75rem' }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const jobId = e.dataTransfer.getData('jobId');
                  if (jobId) moveJob(jobId, status);
                }}
              >
                <div style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h2 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>{jobStatusLabels[status]}</h2>
                  <span style={{ borderRadius: '9999px', padding: '0.125rem 0.5rem', fontSize: '0.75rem', fontWeight: '600', backgroundColor: badge.bg, color: badge.color }}>
                    {columnJobs.length}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {columnJobs.map((job) => {
                    const customer = customerMap.get(job.customerId);
                    return (
                      <button
                        key={job.id}
                        draggable
                        onDragStart={(e) => e.dataTransfer.setData('jobId', job.id)}
                        onClick={() => setSelectedJobId(job.id)}
                        style={{ width: '100%', borderRadius: '0.5rem', border: '1px solid #e5e7eb', backgroundColor: 'white', padding: '0.75rem', textAlign: 'left', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', cursor: 'grab', fontSize: '0.875rem' }}
                      >
                        <p style={{ fontWeight: '500', color: '#111827' }}>
                          {customer ? fullName(customer) : 'Unknown Customer'}
                        </p>
                        <p style={{ marginTop: '0.25rem', color: '#6b7280' }}>{job.serviceType}</p>
                        <p style={{ marginTop: '0.5rem', fontWeight: '600', color: '#2563eb' }}>{formatMoney(job.price)}</p>
                        <p style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: '#9ca3af' }}>
                          {job.bookedDate} at {job.bookedTime}
                        </p>
                      </button>
                    );
                  })}
                  {columnJobs.length === 0 && (
                    <p style={{ borderRadius: '0.5rem', border: '1px dashed #d1d5db', padding: '0.75rem', fontSize: '0.75rem', color: '#9ca3af', textAlign: 'center' }}>
                      Drop jobs here
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Table view */}
        <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              <tr>
                {['Customer', 'Service', 'When', 'Status', 'Price', 'Action'].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody style={{ borderBottom: '1px solid #f3f4f6' }}>
              {filteredJobs.map((job) => {
                const customer = customerMap.get(job.customerId);
                return (
                  <tr key={job.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>
                      {customer ? fullName(customer) : 'Unknown Customer'}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6b7280' }}>{job.serviceType}</td>
                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6b7280' }}>{job.bookedDate} {job.bookedTime}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span style={{ borderRadius: '9999px', padding: '0.25rem 0.75rem', fontSize: '0.75rem', fontWeight: '500', backgroundColor: '#f3f4f6', color: '#6b7280' }}>
                        {jobStatusLabels[job.status]}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>{formatMoney(job.price)}</td>
                    <td style={{ padding: '0.75rem 1rem', display: 'flex', gap: '1rem' }}>
                      <button onClick={() => setSelectedJobId(job.id)} style={{ fontSize: '0.875rem', fontWeight: '500', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer' }}>View</button>
                      <button onClick={() => promoteJob(job)} style={{ fontSize: '0.875rem', fontWeight: '500', color: '#16a34a', background: 'none', border: 'none', cursor: 'pointer' }}>Move →</button>
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
        <div style={{ position: 'fixed', inset: '0', zIndex: '50', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', padding: '1rem' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', maxWidth: '42rem', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827' }}>Job Details</h2>
                <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{selectedJob.id}</p>
              </div>
              <button onClick={() => setSelectedJobId(null)} style={{ borderRadius: '0.375rem', padding: '0.25rem 0.5rem', color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[
                ['Customer', selectedJob && customerMap.get(selectedJob.customerId) ? fullName(customerMap.get(selectedJob.customerId)!) : 'Unknown'],
                ['Service', selectedJob.serviceType],
                ['Booked', `${selectedJob.bookedDate} at ${selectedJob.bookedTime}`],
                ['Price', formatMoney(selectedJob.price)],
              ].map(([label, value]) => (
                <div key={label as string}>
                  <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem' }}>{label}</p>
                  <p style={{ fontWeight: '500', color: '#374151', fontSize: '0.875rem' }}>{value}</p>
                </div>
              ))}
              {['Description', 'Notes'].map(field => (
                <div key={field} style={{ gridColumn: '1 / -1' }}>
                  <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem' }}>{field}</p>
                  <p style={{ fontWeight: '500', color: '#374151', fontSize: '0.875rem' }}>{selectedJob[field.toLowerCase() as 'description' | 'notes'] || 'None'}</p>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '1.5rem', borderTop: '1px solid #e5e7eb', paddingTop: '1.25rem' }}>
              <h3 style={{ fontWeight: '600', color: '#111827', marginBottom: '0.75rem', fontSize: '0.875rem' }}>Timeline</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {selectedJob.timeline.map((event) => (
                  <div key={event.id} style={{ borderRadius: '0.5rem', backgroundColor: '#f9fafb', padding: '0.75rem' }}>
                    <p style={{ fontWeight: '500', color: '#374151', fontSize: '0.875rem' }}>{event.label}</p>
                    <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{new Date(event.at).toLocaleString('en-GB')}</p>
                    {event.note && <p style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: '#6b7280' }}>{event.note}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
