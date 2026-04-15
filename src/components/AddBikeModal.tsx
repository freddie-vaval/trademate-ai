'use client';

import { useState } from 'react';
import { Bike, Customer } from '@/lib/types';
import { fullName } from '@/lib/data-store';
import { BIKE_COLOURS, FRAME_SIZES, WHEEL_SIZES, GROUPSET_BRANDS } from '@/lib/bike-utils';

interface AddBikeModalProps {
  customers: Customer[];
  onAdd: (bike: Bike) => void;
  onClose: () => void;
}

export default function AddBikeModal({ customers, onAdd, onClose }: AddBikeModalProps) {
  const [formData, setFormData] = useState({
    customerId: '',
    brand: '',
    model: '',
    frameSize: '',
    frameColour: '',
    serialNumber: '',
    wheelSize: '',
    groupset: '',
    tyres: '',
    saddle: '',
    pedals: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerId || !formData.brand) return;

    onAdd({
      id: `bike_${Date.now()}`,
      customerId: formData.customerId,
      brand: formData.brand.trim(),
      model: formData.model.trim(),
      frameSize: formData.frameSize || undefined,
      frameColour: formData.frameColour || undefined,
      serialNumber: formData.serialNumber.trim() || undefined,
      wheelSize: formData.wheelSize || undefined,
      groupset: formData.groupset || undefined,
      tyres: formData.tyres || undefined,
      saddle: formData.saddle || undefined,
      pedals: formData.pedals || undefined,
      images: [],
      notes: formData.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    onClose();
  };

  const field = (label: string, key: string, placeholder: string, type = 'text') => (
    <div key={key}>
      <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px' }}>
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={formData[key as keyof typeof formData]}
        onChange={e => setFormData({ ...formData, [key]: e.target.value })}
        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', background: 'white' }}
      />
    </div>
  );

  const select = (label: string, key: string, options: readonly string[]) => (
    <div key={key}>
      <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px' }}>
        {label}
      </label>
      <select
        value={formData[key as keyof typeof formData]}
        onChange={e => setFormData({ ...formData, [key]: e.target.value })}
        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', background: 'white' }}
      >
        <option value="">Select...</option>
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
      <div style={{ background: 'white', borderRadius: '16px', padding: '28px', width: '100%', maxWidth: '540px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#111827' }}>🚲 Register New Bike</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: '24px' }}>×</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Customer */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px' }}>
              Owner *
            </label>
            <select
              value={formData.customerId}
              onChange={e => setFormData({ ...formData, customerId: e.target.value })}
              required
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', background: 'white' }}
            >
              <option value="">Select customer...</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{fullName(c)} — {c.phone}</option>
              ))}
            </select>
          </div>

          {/* Brand + Model */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {field('Brand *', 'brand', 'e.g. Specialized, Brompton, Canyon')}
            {field('Model', 'model', 'e.g. Tarmac SL7, C Line Explore')}
          </div>

          {/* Colour + Frame Size */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {select('Frame Colour', 'frameColour', BIKE_COLOURS)}
            {select('Frame Size', 'frameSize', FRAME_SIZES)}
          </div>

          {/* Serial */}
          {field('Serial Number', 'serialNumber', 'e.g. SPZ-2024-88291')}

          {/* Divider */}
          <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '4px' }}>
            <p style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9ca3af' }}>Technical Details</p>
          </div>

          {/* Technical */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {select('Wheel Size', 'wheelSize', WHEEL_SIZES)}
            {select('Groupset', 'groupset', GROUPSET_BRANDS)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {field('Tyres', 'tyres', 'e.g. Continental GP5000 28mm')}
            {field('Saddle', 'saddle', 'e.g. Specialized Power')}
          </div>
          {field('Pedals', 'pedals', 'e.g. Shimano SPD-SL')}

          {/* Notes */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px' }}>
              Notes
            </label>
            <textarea
              placeholder="Owner preferences, quirks, accessories..."
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', background: 'white', resize: 'vertical', fontFamily: 'inherit' }}
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ flex: 1, padding: '12px', borderRadius: '8px', background: '#f3f4f6', color: '#374151', fontWeight: '600', border: 'none', cursor: 'pointer', fontSize: '14px' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{ flex: 1, padding: '12px', borderRadius: '8px', background: '#2563eb', color: 'white', fontWeight: '700', border: 'none', cursor: 'pointer', fontSize: '14px' }}
            >
              Register Bike
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}