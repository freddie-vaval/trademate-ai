import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// ─── Pricing Rules ─────────────────────────────────────────────────────────────

interface PricingRule {
  trigger: (data: QuotingContext) => boolean;
  plan: 'starter' | 'pro' | 'business';
  reasoning: string;
  price: number;
  monthlyPrice: number;
}

interface QuotingContext {
  trade: string;
  teamSize: '1' | '2-5' | '6-10' | '11+';
  currentTools: string;
  challenge: string;
  location: string;
  avgJobValue?: string;
  jobsPerWeek?: string;
  existingSoftware?: string;
}

const PRICING_RULES: PricingRule[] = [
  // Sole trader — missed calls → Starter
  {
    trigger: (d) => d.teamSize === '1' && d.challenge === 'missed_calls' && d.currentTools === 'none',
    plan: 'starter',
    reasoning: 'For a sole trader, the Starter plan handles everything — AI phone, job tracking, quotes and invoices. At £99 it costs less than one missed job a month.',
    price: 99,
    monthlyPrice: 99,
  },
  // Sole trader — admin overload → Pro
  {
    trigger: (d) => d.teamSize === '1' && d.challenge === 'admin',
    plan: 'pro',
    reasoning: 'With admin taking up your time, the Pro plan gives you AI assistance across quotes, scheduling and follow-ups — freeing you to focus on the work.',
    price: 199,
    monthlyPrice: 199,
  },
  // Sole trader — all problems → Pro
  {
    trigger: (d) => d.teamSize === '1' && d.challenge === 'all',
    plan: 'pro',
    reasoning: 'The Pro plan covers everything you need — AI phone, job management, and invoicing — at a price that pays for itself with even one extra job a month.',
    price: 199,
    monthlyPrice: 199,
  },
  // Small team 2-5 → Pro
  {
    trigger: (d) => d.teamSize === '2-5' && ['none', 'whatsapp', 'spreadsheets'].includes(d.currentTools),
    plan: 'pro',
    reasoning: 'For a team your size, Pro gives you AI phone for every engineer, job scheduling, and quotes that go out in seconds not hours.',
    price: 199,
    monthlyPrice: 199,
  },
  // Small team with existing software → Pro
  {
    trigger: (d) => d.teamSize === '2-5' && ['jobber', 'tradify', 'other'].includes(d.currentTools),
    plan: 'pro',
    reasoning: 'You\'re already paying for software — Pro gives you more features, AI phone included, at a competitive price. We also offer free migration.',
    price: 199,
    monthlyPrice: 199,
  },
  // Team 6-10 → Business
  {
    trigger: (d) => d.teamSize === '6-10',
    plan: 'business',
    reasoning: 'At your team size you need the Business plan — unlimited users, API access, and dedicated support to manage multiple engineers and schedules.',
    price: 499,
    monthlyPrice: 499,
  },
  // Large team 11+ → Business
  {
    trigger: (d) => d.teamSize === '11+',
    plan: 'business',
    reasoning: 'Business is built for trade businesses with multiple teams and complex scheduling. Unlimited users, white-label options, and a dedicated account manager.',
    price: 499,
    monthlyPrice: 499,
  },
  // Switching from Jobber → Pro (price anchor)
  {
    trigger: (d) => d.currentTools === 'jobber',
    plan: 'pro',
    reasoning: 'You\'re already paying £150-200/month on Jobber without AI phone included. Pro gives you more features at a similar price — with a free migration.',
    price: 199,
    monthlyPrice: 199,
  },
  // Late payments → Pro
  {
    trigger: (d) => d.challenge === 'late_payments',
    plan: 'pro',
    reasoning: 'Pro includes automated payment reminders and easier invoice tracking — helping you get paid faster without the awkward follow-up calls.',
    price: 199,
    monthlyPrice: 199,
  },
];

const PLAN_LABELS = {
  starter: { name: 'Starter', price: 99, description: 'For sole traders getting started' },
  pro: { name: 'Pro', price: 199, description: 'For small teams who need more' },
  business: { name: 'Business', price: 499, description: 'For established trade businesses' },
};

const TRADE_LABELS: Record<string, string> = {
  plumber: 'Plumber',
  electrician: 'Electrician',
  builder: 'Builder',
  hvac: 'HVAC / Heating Engineer',
  roofer: 'Roofer',
  carpenter: 'Carpenter',
  painter: 'Painter & Decorator',
  landscaper: 'Landscaper',
  other: 'Other Trade',
};

const TEAM_LABELS: Record<string, string> = {
  '1': 'Just me (sole trader)',
  '2-5': '2 to 5 people',
  '6-10': '6 to 10 people',
  '11+': '11 or more people',
};

const TOOL_LABELS: Record<string, string> = {
  none: 'Nothing formal (phone, WhatsApp, notebooks)',
  whatsapp: 'WhatsApp + phone',
  spreadsheets: 'Spreadsheets (Excel, Google Sheets)',
  jobber: 'Jobber',
  tradify: 'Tradify',
  other: 'Other software',
};

const CHALLENGE_LABELS: Record<string, string> = {
  missed_calls: 'Missed calls (losing jobs while on another job)',
  admin: 'Too much admin (quotes, invoicing, paperwork)',
  late_payments: 'Late payments (cash flow from unpaid invoices)',
  all: 'All of the above — everything needs sorting',
};

// ─── Core Functions ─────────────────────────────────────────────────────────────

export function generateQuote(context: QuotingContext) {
  // Find the first matching rule
  const matchedRule = PRICING_RULES.find(rule => rule.trigger(context));

  if (!matchedRule) {
    // Default to Pro if no rule matches
    return {
      plan: 'pro' as const,
      planLabel: PLAN_LABELS.pro,
      reasoning: 'Based on your profile, the Pro plan gives you the best balance of features and value.',
      price: 199,
      monthlyPrice: 199,
    };
  }

  return {
    plan: matchedRule.plan,
    planLabel: PLAN_LABELS[matchedRule.plan],
    reasoning: matchedRule.reasoning,
    price: matchedRule.price,
    monthlyPrice: matchedRule.monthlyPrice,
  };
}

export function buildQuoteDocument(
  customer: {
    name: string;
    email: string;
    phone: string;
    business?: string;
  },
  context: QuotingContext,
  quote: ReturnType<typeof generateQuote>
) {
  const today = new Date();
  const validUntil = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
  const quoteRef = `TM-${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

  const document = {
    quoteRef,
    createdAt: today.toISOString(),
    validUntil: validUntil.toISOString(),
    customer: {
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      business: customer.business || '',
    },
    businessProfile: {
      trade: TRADE_LABELS[context.trade] || context.trade,
      teamSize: TEAM_LABELS[context.teamSize] || context.teamSize,
      currentTools: TOOL_LABELS[context.currentTools] || context.currentTools,
      challenge: CHALLENGE_LABELS[context.challenge] || context.challenge,
    },
    plan: {
      name: quote.planLabel.name,
      description: quote.planLabel.description,
      monthlyPrice: quote.monthlyPrice,
      yearlyPrice: quote.monthlyPrice * 12 * 0.8, // 20% annual discount
    },
    items: [
      {
        description: `${quote.planLabel.name} Plan — Monthly`,
        quantity: 1,
        unitPrice: quote.monthlyPrice,
        total: quote.monthlyPrice,
      },
      {
        description: 'AI Phone Receptionist (unlimited calls)',
        quantity: 1,
        unitPrice: 0,
        total: 0,
      },
      {
        description: 'Job Management & CRM',
        quantity: 1,
        unitPrice: 0,
        total: 0,
      },
      {
        description: 'Quote & Invoice Generation',
        quantity: 1,
        unitPrice: 0,
        total: 0,
      },
      {
        description: '14-Day Free Trial',
        quantity: 1,
        unitPrice: 0,
        total: 0,
      },
    ],
    subtotal: quote.monthlyPrice,
    vat: quote.monthlyPrice * 0.20,
    total: quote.monthlyPrice * 1.20,
    salesPitch: quote.reasoning,
    nextSteps: [
      'Accept this quote by replying to the confirmation email',
      'We\'ll send your login details within 24 hours',
      'Your 14-day trial starts when you first log in',
      'No payment taken until your trial ends',
    ],
  };

  return document;
}

export async function saveQuoteToDatabase(
  document: ReturnType<typeof buildQuoteDocument>,
  customerId: string,
  onboardingProfileId: string
) {
  const { data, error } = await supabase.from('quotes').insert([{
    customer_id: customerId,
    quote_ref: document.quoteRef,
    service_type: document.businessProfile.trade,
    details: JSON.stringify(document),
    status: 'sent',
    items: document.items,
    subtotal: document.subtotal,
    vat: document.vat,
    total: document.total,
    valid_until: document.validUntil,
    created_at: document.createdAt,
  }]).select('id').single();

  if (error) throw error;

  // Update onboarding profile with quote reference
  await supabase
    .from('onboarding_profiles')
    .update({ last_quote_ref: document.quoteRef })
    .eq('id', onboardingProfileId);

  return data;
}

export async function convertQuoteToJob(quoteId: string) {
  // Retrieve the quote
  const { data: quote, error: quoteError } = await supabase
    .from('quotes')
    .select('*')
    .eq('id', quoteId)
    .single();

  if (quoteError || !quote) throw new Error('Quote not found');

  // Retrieve the customer
  const { data: customer, error: customerError } = await supabase
    .from('customers')
    .select('*')
    .eq('id', quote.customer_id)
    .single();

  if (customerError || !customer) throw new Error('Customer not found');

  // Create the job
  const { data: job, error: jobError } = await supabase.from('jobs').insert([{
    customer_id: quote.customer_id,
    service_type: quote.service_type,
    description: `Quote accepted: ${quote.quote_ref}`,
    price: quote.total,
    status: 'booked-in',
    booked_date: new Date().toISOString().split('T')[0],
    notes: `Converted from quote ${quote.quote_ref}. ${JSON.parse(quote.details || '{}').salesPitch || ''}`,
  }]).select('id').single();

  if (jobError) throw jobError;

  // Update quote status
  await supabase
    .from('quotes')
    .update({ status: 'accepted' })
    .eq('id', quoteId);

  return job;
}
