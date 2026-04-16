'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bike, Job, ServiceChecklistItem } from '@/lib/types';
import { useBikes, useJobs, useCustomers } from '@/lib/data-store';
import { formatBikeLabel, formatBikeSubtitle, getBikesWithCustomerInfo, BIKE_COLOURS, FRAME_SIZES, WHEEL_SIZES, GROUPSET_BRANDS } from '@/lib/bike-utils';
import { formatMoney, fullName } from '@/lib/data-store';
import AddBikeModal from '@/components/AddBikeModal';

const CHECKLIST_CATEGORIES = [
  { key: 'frame', label: 'Frame & Fork' },
  { key: 'wheels', label: 'Wheels' },
  { key: 'drivetrain', label: 'Drivetrain' },
  { key: 'brakes', label: 'Brakes' },
  { key: 'contact', label: 'Contact Points' },
  { key: 'electrical', label: 'Electrical' },
];

const DEFAULT_CHECKLIST: Omit<ServiceChecklistItem, 'id'>[] = [
  { label: 'Chain wear check (ruler test)', category: 'drivetrain', checked: false },
  { label: 'Chain lubrication', category: 'drivetrain', checked: false },
  { label: 'Derailleur alignment', category: 'drivetrain', checked: false },
  { label: 'Gear indexing', category: 'drivetrain', checked: false },
  { label: 'Brake pad wear', category: 'brakes', checked: false },
  { label: 'Brake calliper alignment', category: 'brakes', checked: false },
  { label: 'Hydraulic disc: fluid level', category: 'brakes', checked: false },
  { label: 'Hydraulic disc: bleed', category: 'brakes', checked: false },
  { label: 'Cable disc: tension + worn', category: 'brakes', checked: false },
  { label: 'Headset play check', category: 'frame', checked: false },
  { label: 'Bottom bracket play', category: 'frame', checked: false },
  { label: 'Frame: cracks or damage', category: 'frame', checked: false },
  { label: 'Fork: damage or play', category: 'frame', checked: false },
  { label: 'Wheel true (lateral run-out)', category: 'wheels', checked: false },
  { label: 'Wheel tension (spoke nipples)', category: 'wheels', checked: false },
  { label: 'Tyre tread + pressure', category: 'wheels', checked: false },
  { label: 'Quick release / thru-axle', category: 'wheels', checked: false },
  { label: ' Saddle height + tilt', category: 'contact', checked: false },
  { label: 'Bar tape / hoods', category: 'contact', checked: false },
  { label: 'Pedal threads', category: 'contact', checked: false },
  { label: 'Tyre sealant (tubeless)', category: 'electrical', checked: false },
  { label: 'Battery charge (e-bike)', category: 'electrical', checked: false },
];

export default function BikesPage() {
  const [bikes, setBikes, bikesHydrated] = useBikes();
  const [jobs, , jobsHydrated] = useJobs();
  const [customers, , customersHydrated] = useCustomers();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedBikeId, setSelectedBikeId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'list' | 'detail'>('list');

  const ready = bikesHydrated && customersHydrated && jobsHydrated;
  const bikesWithInfo = getBikesWithCustomerInfo(bikes, customers, jobs);

  const filteredBikes = bikesWithInfo.filter((bike: { brand: string; model: string; customerName: string; serialNumber?: string }) => {
    if (!search.trim()) return true;
    const s = search.toLowerCase();
    return (
      bike.brand.toLowerCase().includes(s) ||
      bike.model.toLowerCase().includes(s) ||
      bike.customerName.toLowerCase().includes(s) ||
      bike.serialNumber?.toLowerCase().includes(s)
    );
  });

  const selectedBike = bikes.find(b => b.id === selectedBikeId) ?? null;
  const bikeJobs = selectedBike
    ? jobs.filter(j => j.bikeId === selectedBike.id).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    : [];

  const customer = selectedBike ? customers.find(c => c.id === selectedBike.customerId) : null;

  const addBike = (bike: Bike) => {
    setBikes([bike, ...bikes]);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <style>{`
        .bike-card { background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; cursor: pointer; transition: all 0.15s; }
        .bike-card:hover { border-color: #2563eb; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
        .bike-card.selected { border-color: #2563eb; background: #eff6ff; }
        .job-row { background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px 16px; display: flex; align-items: center; justify-content: space-between; }
        .checklist-item { display: flex; align-items: center; gap: 10px; padding: 8px 12px; border-radius: 8px; transition: background 0.1s; }
        .checklist-item:hover { background: #f3f4f6; }
        .checklist-item input[type="checkbox"] { width: 18px; height: 18px; cursor: pointer; }
        .section-title { font-size: 12px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #9ca3af; margin: 20px 0 12px; }
      `}</style>

      {/* Header */}
      <div style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '16px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <Link href="/app" style={{ fontSize: '13px', color: '#2563eb', textDecoration: 'none', display: 'block', marginBottom: '4px' }}>← App</Link>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>🚲 Bike Profiles</h1>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>{bikes.length} bikes registered</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              style={{ backgroundColor: '#2563eb', color: 'white', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', border: 'none', cursor: 'pointer', fontSize: '14px' }}
            >
              + Register Bike
            </button>
          </div>

          {/* Search */}
          <input
            type="text"
            placeholder="Search by bike, customer, or serial number..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', maxWidth: '500px', padding: '10px 16px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px' }}
          />
        </div>
      </div>

      {!ready ? (
        <div style={{ padding: '80px', textAlign: 'center', color: '#9ca3af' }}>Loading bikes...</div>
      ) : activeTab === 'list' || !selectedBike ? (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
          {filteredBikes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚲</div>
              <p style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>No bikes registered yet</p>
              <p style={{ fontSize: '14px' }}>Register the first bike to start building customer profiles</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
              {filteredBikes.map(bike => (
                <div
                  key={bike.id}
                  className={`bike-card${selectedBikeId === bike.id ? ' selected' : ''}`}
                  onClick={() => { setSelectedBikeId(bike.id); setActiveTab('detail'); }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <p style={{ fontWeight: '700', fontSize: '16px', color: '#111827' }}>
                        {bike.brand || 'Unknown'} {bike.model || 'bike'}
                      </p>
                      <p style={{ fontSize: '13px', color: '#6b7280' }}>
                        {bike.frameColour ? `${bike.frameColour} · ` : ''}{bike.frameSize || ''}
                      </p>
                    </div>
                    <span style={{ fontSize: '12px', background: '#eff6ff', color: '#2563eb', padding: '4px 8px', borderRadius: '6px', fontWeight: '600' }}>
                      {bike.jobCount} job{bike.jobCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>👤 {bike.customerName}</p>
                  {bike.lastServiceDate && (
                    <p style={{ fontSize: '12px', color: '#9ca3af' }}>
                      Last serviced: {new Date(bike.lastServiceDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      {bike.lastServiceType ? ` · ${bike.lastServiceType}` : ''}
                    </p>
                  )}
                  {bike.serialNumber && (
                    <p style={{ fontSize: '11px', color: '#d1d5db', marginTop: '4px', fontFamily: 'monospace' }}>S/N: {bike.serialNumber}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Bike Detail View */
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
          <button
            onClick={() => { setActiveTab('list'); setSelectedBikeId(null); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: '#2563eb', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            ← Back to bikes
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px' }}>
            {/* Main content */}
            <div>
              {/* Bike header */}
              <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#111827', marginBottom: '4px' }}>
                      {selectedBike.brand || 'Unknown'} {selectedBike.model || 'Bike'}
                    </h2>
                    <p style={{ color: '#6b7280', fontSize: '15px' }}>{formatBikeSubtitle(selectedBike)}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '13px', color: '#6b7280' }}>Owner</p>
                    <p style={{ fontWeight: '700', fontSize: '15px' }}>{customer ? fullName(customer) : 'Unknown'}</p>
                    {customer && <p style={{ fontSize: '13px', color: '#6b7280' }}>{customer.phone}</p>}
                  </div>
                </div>
              </div>

              {/* Bike specifications */}
              <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', marginBottom: '16px' }}>Specifications</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {[
                    ['Serial Number', selectedBike.serialNumber],
                    ['Frame Size', selectedBike.frameSize],
                    ['Frame Colour', selectedBike.frameColour],
                    ['Groupset', selectedBike.groupset],
                    ['Wheel Size', selectedBike.wheelSize],
                    ['Tyres', selectedBike.tyres],
                    ['Saddle', selectedBike.saddle],
                    ['Pedals', selectedBike.pedals],
                  ].filter(([, v]) => v).map(([label, value]) => (
                    <div key={label} style={{ background: '#f9fafb', borderRadius: '8px', padding: '12px' }}>
                      <p style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{label}</p>
                      <p style={{ fontWeight: '600', fontSize: '14px', color: '#111827' }}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Service history */}
              <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', marginBottom: '16px' }}>
                  Service History ({bikeJobs.length})
                </h3>
                {bikeJobs.length === 0 ? (
                  <p style={{ color: '#9ca3af', fontSize: '14px', textAlign: 'center', padding: '32px' }}>No service history yet</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {bikeJobs.map(job => (
                      <div key={job.id} className="job-row">
                        <div>
                          <p style={{ fontWeight: '600', fontSize: '14px', color: '#111827' }}>{job.serviceType}</p>
                          <p style={{ fontSize: '13px', color: '#6b7280' }}>
                            {new Date(job.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                            {job.description ? ` · ${job.description}` : ''}
                          </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontWeight: '700', fontSize: '14px', color: '#111827' }}>{formatMoney(job.price)}</p>
                          <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: '#dcfce7', color: '#15803d', fontWeight: '600' }}>
                            {job.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div>
              {/* Quick actions */}
              <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#111827', marginBottom: '12px' }}>Quick Actions</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button style={{ padding: '10px 16px', borderRadius: '8px', background: '#eff6ff', color: '#2563eb', fontWeight: '600', border: 'none', cursor: 'pointer', fontSize: '14px', textAlign: 'left' }}>
                    📋 Book a Service
                  </button>
                  <button style={{ padding: '10px 16px', borderRadius: '8px', background: '#f9fafb', color: '#374151', fontWeight: '600', border: '1px solid #e5e7eb', cursor: 'pointer', fontSize: '14px', textAlign: 'left' }}>
                    📷 Add Photos
                  </button>
                  <button style={{ padding: '10px 16px', borderRadius: '8px', background: '#f9fafb', color: '#374151', fontWeight: '600', border: '1px solid #e5e7eb', cursor: 'pointer', fontSize: '14px', textAlign: 'left' }}>
                    ✏️ Edit Bike Details
                  </button>
                </div>
              </div>

              {/* Notes */}
              {selectedBike.notes && (
                <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#111827', marginBottom: '12px' }}>Notes</h3>
                  <p style={{ fontSize: '14px', color: '#374151', lineHeight: '1.6' }}>{selectedBike.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <AddBikeModal
          customers={customers}
          onAdd={addBike}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}