import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia',
});

const PRICE_MAP: Record<string, string> = {
  starter: process.env.STRIPE_PRICE_STARTER || '',
  pro: process.env.STRIPE_PRICE_PRO || '',
  business: process.env.STRIPE_PRICE_BUSINESS || '',
};

// POST /api/stripe/subscription — create a new subscription
export async function POST(request: Request) {
  try {
    const { customerId, email, name, plan } = await request.json();

    if (!email || !plan) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const priceId = PRICE_MAP[plan];
    if (!priceId) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    // Create or retrieve Stripe customer
    let stripeCustomerId: string;

    // Check if customer already exists in Stripe
    const existingCustomers = await stripe.customers.list({ email, limit: 1 });
    if (existingCustomers.data.length > 0) {
      stripeCustomerId = existingCustomers.data[0].id;
    } else {
      const customer = await stripe.customers.create({
        email,
        name,
        metadata: { customerId },
      });
      stripeCustomerId = customer.id;
    }

    // Create the subscription
    const subscription = await stripe.subscriptions.create({
      customer: stripeCustomerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });

    const invoice = subscription.latest_invoice as Stripe.Invoice;
    const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

    return NextResponse.json({
      subscriptionId: subscription.id,
      clientSecret: paymentIntent?.client_secret,
      status: subscription.status,
    });
  } catch (error: any) {
    console.error('Stripe subscription error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET /api/stripe/subscription — retrieve subscription status
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const subscriptionId = searchParams.get('subscriptionId');

    if (!subscriptionId) {
      return NextResponse.json({ error: 'Missing subscriptionId' }, { status: 400 });
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return NextResponse.json({ subscription });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/stripe/subscription — cancel subscription
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const subscriptionId = searchParams.get('subscriptionId');

    if (!subscriptionId) {
      return NextResponse.json({ error: 'Missing subscriptionId' }, { status: 400 });
    }

    await stripe.subscriptions.cancel(subscriptionId);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
