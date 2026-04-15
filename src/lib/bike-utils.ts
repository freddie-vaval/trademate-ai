import { Job, JobStatus, Bike, Customer } from '../types';

export const BIKE_COLOURS = [
  'Black', 'White', 'Red', 'Blue', 'Green', 'Orange', 'Yellow', 
  'Silver/Grey', 'Navy', 'Purple', 'Teal', 'Raw metal'
] as const;

export const FRAME_SIZES = [
  'XXXS (44cm)', 'XXS (46cm)', 'XS (48cm)', 'S (50cm)', 
  'M (52cm)', 'L (54cm)', 'XL (56cm)', 'XXL (58cm)', 'XXXL (60cm+)', 
  "Kids 12\"", "Kids 16\"", "Kids 20\"", "Kids 24\""
] as const;

export const WHEEL_SIZES = ['700c', '650b', '26"', '27.5"', '29"', '24"', '20"', '16"'] as const;

export const GROUPSET_BRANDS = [
  'Shimano', 'SRAM', 'Campagnolo', 'FSA', 'RaceFace', 'SRAM Force', 
  'Shimano 105', 'Shimano Ultegra', 'Shimano Dura-Ace', 'SRAM Rival', 
  'SRAM Force eTap', 'SRAM Red', 'Campy Chorus', 'Campy Record',
  'Single speed', 'belt drive', 'Other'
] as const;

export interface BikeWithCustomer extends Bike {
  customerName: string;
  customerId: string;
  jobCount: number;
  lastServiceDate: string | null;
  lastServiceType: string | null;
}

export function getBikesWithCustomerInfo(
  bikes: Bike[],
  customers: Customer[],
  jobs: Job[]
): BikeWithCustomer[] {
  const customerMap = new Map(customers.map(c => [c.id, c]));
  
  return bikes.map(bike => {
    const customer = customerMap.get(bike.customerId);
    const bikeJobs = jobs.filter(j => j.bikeId === bike.id).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    const lastJob = bikeJobs[0];
    
    return {
      ...bike,
      customerName: customer ? `${customer.firstName} ${customer.lastName}` : 'Unknown',
      customerId: bike.customerId,
      jobCount: bikeJobs.length,
      lastServiceDate: lastJob?.createdAt ?? null,
      lastServiceType: lastJob?.serviceType ?? null,
    };
  }).sort((a, b) => {
    // Sort by last service date, most recent first
    const aDate = a.lastServiceDate ? new Date(a.lastServiceDate).getTime() : 0;
    const bDate = b.lastServiceDate ? new Date(b.lastServiceDate).getTime() : 0;
    return bDate - aDate;
  });
}

export function formatBikeLabel(bike: Bike): string {
  const parts = [bike.brand, bike.model].filter(Boolean);
  if (parts.length === 0) return 'Unnamed bike';
  let label = parts.join(' ');
  if (bike.frameColour) label += ` (${bike.frameColour})`;
  return label;
}

export function formatBikeSubtitle(bike: Bike): string {
  const parts: string[] = [];
  if (bike.frameSize) parts.push(bike.frameSize);
  if (bike.groupset) parts.push(bike.groupset);
  if (bike.wheelSize) parts.push(bike.wheelSize);
  return parts.join(' · ') || 'No details';
}