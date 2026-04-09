import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// POST /api/stripe/webhook — handle Stripe webhook events
export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature') || '';

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerId = session.metadata?.customerId;
        const plan = session.metadata?.plan;

        if (customerId && plan) {
          // Update customer status to active
          await supabase
            .from('onboarding_profiles')
            .update({ status: 'active', plan })
            .eq('customer_id', customerId);

          // Create welcome notification
          await supabase.from('notifications').insert([{
            type: 'subscription_activated',
            title: 'New paying customer!',
            message: `Customer ${session.customer_details?.email} subscribed to ${plan} plan`,
            priority: 'high',
          }]);
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        // Update last payment date
        await supabase
          .from('customers')
          .update({ last_payment: new Date(invoice.created * 1000).toISOString() })
          .eq('stripe_customer_id', customerId);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerEmail = invoice.customer_email;

        if (customerEmail) {
          // Alert customer about failed payment
          await supabase.from('notifications').insert([{
            type: 'payment_failed',
            title: 'Payment failed',
            message: `Payment failed for ${customerEmail}. Please update payment details.`,
            priority: 'high',
            customer_id: invoice.customer as string,
          }]);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Mark customer as cancelled
        await supabase
          .from('onboarding_profiles')
          .update({ status: 'cancelled' })
          .eq('stripe_customer_id', customerId);

        await supabase.from('notifications').insert([{
          type: 'subscription_cancelled',
          title: 'Customer cancelled',
          message: `Subscription cancelled for customer ${customerId}`,
          priority: 'medium',
        }]);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const plan = subscription.items.data[0]?.price?.id;

        // Update plan if changed
        if (plan) {
          await supabase
            .from('onboarding_profiles')
            .update({
              plan,
              status: subscription.status === 'active' ? 'active' : 'trial',
            })
            .eq('stripe_customer_id', subscription.customer);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
