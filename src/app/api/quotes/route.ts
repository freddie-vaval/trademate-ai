import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { customerName, service, details, email } = body;

  // Simulate AI generating a quote
  const quote = {
    id: 'QT-' + Date.now(),
    customer: customerName,
    service: service,
    items: [
      { description: service, price: getBasePrice(service) },
      { description: 'Labour (2 hours)', price: 90 },
      { description: 'Call-out fee', price: 50 },
    ],
    total: getBasePrice(service) + 90 + 50,
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
  };

  return NextResponse.json({ success: true, quote });
}

function getBasePrice(service: string): number {
  const prices: Record<string, number> = {
    'Boiler Service': 120,
    'Boiler Repair': 150,
    'Plumbing Repair': 85,
    'Gas Safety Check': 150,
    'New Radiator': 350,
    'Central Heating': 2500,
    'Bathroom Installation': 3500,
    'Electrical Inspection': 150,
    'Rewire': 4000,
  };
  return prices[service] || 100;
}
