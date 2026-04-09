import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || '');
const FROM_EMAIL = process.env.FROM_EMAIL || 'Trademate AI <noreply@trademate.dev>';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── Email Templates ───────────────────────────────────────────────────────────

interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  text: string;
}

async function sendEmail(template: EmailTemplate): Promise<boolean> {
  if (!process.env.RESEND_API_KEY) {
    console.log('[EMAIL] Resend not configured. Would send:', template.subject, 'to', template.to);
    return false;
  }

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: template.to,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    if (error) {
      console.error('[EMAIL] Send failed:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('[EMAIL] Error:', err);
    return false;
  }
}

// ─── Email Templates ───────────────────────────────────────────────────────────

export async function sendWelcomeEmail(email: string, name: string, plan: string): Promise<boolean> {
  const planLabel = { starter: 'Starter', pro: 'Pro', business: 'Business' }[plan] || plan;

  return sendEmail({
    to: email,
    subject: `Welcome to Trademate AI — your ${planLabel} trial is active`,
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #ff6b35; font-size: 24px;">Welcome${name ? `, ${name.split(' ')[0]}` : ''}!</h1>
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
          Your Trademate AI <strong>${planLabel}</strong> trial is now active. You have 14 days to explore the platform before your first payment of <strong>£${plan === 'starter' ? '99' : plan === 'pro' ? '199' : '499'}/month</strong>.
        </p>
        <div style="background: #f9fafb; border-radius: 12px; padding: 24px; margin: 24px 0;">
          <h2 style="font-size: 18px; margin: 0 0 16px; color: #1a1a1a;">Here's what to do first:</h2>
          <ol style="color: #374151; line-height: 2;">
            <li>Set up your AI phone receptionist in <strong>Settings → AI Phone</strong></li>
            <li>Add your services and pricing in <strong>Settings → Services</strong></li>
            <li>Connect your calendar in <strong>Settings → Calendar</strong></li>
            <li>Forward your business phone number to your Trademate AI number</li>
          </ol>
        </div>
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://trademate.dev'}/app" 
           style="display: inline-block; background: #ff6b35; color: #fff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600;">
          Go to your dashboard →
        </a>
        <p style="color: #9ca3af; font-size: 13px; margin-top: 32px;">
          Questions? Reply to this email or contact us anytime.
        </p>
      </div>
    `,
    text: `Welcome${name ? `, ${name.split(' ')[0]}` : ''}!

Your Trademate AI ${planLabel} trial is active. 14 days free.

Next steps:
1. Set up your AI phone in Settings → AI Phone
2. Add your services in Settings → Services
3. Connect your calendar in Settings → Calendar

Go to your dashboard: ${process.env.NEXT_PUBLIC_APP_URL || 'https://trademate.dev'}/app`,
  });
}

export async function sendNewLeadAlert(
  freddieEmail: string,
  leadName: string,
  leadPhone: string,
  leadSource: string,
  trade: string
): Promise<boolean> {
  return sendEmail({
    to: freddieEmail,
    subject: `📞 New lead: ${leadName} (${trade})`,
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #ff6b35; font-size: 20px;">New Lead</h1>
        <div style="background: #fff5f0; border-left: 4px solid #ff6b35; padding: 16px 20px; margin: 16px 0; border-radius: 4px;">
          <p style="margin: 0 0 8px;"><strong>Name:</strong> ${leadName}</p>
          <p style="margin: 0 0 8px;"><strong>Phone:</strong> <a href="tel:${leadPhone}">${leadPhone}</a></p>
          <p style="margin: 0 0 8px;"><strong>Trade:</strong> ${trade}</p>
          <p style="margin: 0;"><strong>Source:</strong> ${leadSource}</p>
        </div>
        <p style="color: #374151;">Follow up with this lead as soon as possible. Call or text them directly from the number above.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://trademate.dev'}/opportunities" 
           style="display: inline-block; background: #ff6b35; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
          View in Trademate →
        </a>
      </div>
    `,
    text: `New lead from ${leadName}
Phone: ${leadPhone}
Trade: ${trade}
Source: ${leadSource}

Follow up now: ${process.env.NEXT_PUBLIC_APP_URL || 'https://trademate.dev'}/opportunities`,
  });
}

export async function sendQuoteConfirmation(
  customerEmail: string,
  customerName: string,
  quoteRef: string,
  amount: string
): Promise<boolean> {
  return sendEmail({
    to: customerEmail,
    subject: `Your quote from Trademate AI — Ref: ${quoteRef}`,
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1a1a1a; font-size: 20px;">Hi ${customerName.split(' ')[0]}</h1>
        <p style="color: #374151; font-size: 16px;">Please find your quote attached. Here are the details:</p>
        <div style="background: #f9fafb; border-radius: 12px; padding: 24px; margin: 24px 0;">
          <p style="margin: 0 0 8px; font-size: 14px; color: #6b7280;">QUOTE REFERENCE</p>
          <p style="margin: 0 0 16px; font-size: 24px; font-weight: 800; color: #ff6b35;">${quoteRef}</p>
          <p style="margin: 0; font-size: 18px;"><strong>Total: ${amount}</strong></p>
        </div>
        <p style="color: #374151;">This quote is valid for 30 days. To accept and proceed, please reply to this email or call us.</p>
        <p style="color: #9ca3af; font-size: 13px; margin-top: 32px;">Thank you for considering Trademate AI.</p>
      </div>
    `,
    text: `Hi ${customerName.split(' ')[0]}

Your quote (Ref: ${quoteRef}) is attached.

Total: ${amount}

This quote is valid for 30 days. Reply to accept or call us to discuss.

Thank you.`,
  });
}

export async function sendPaymentFailedAlert(
  customerEmail: string,
  customerName: string
): Promise<boolean> {
  return sendEmail({
    to: customerEmail,
    subject: `Action needed — payment failed for Trademate AI`,
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #dc2626; font-size: 20px;">Payment failed</h1>
        <p style="color: #374151; font-size: 16px;">Hi ${customerName.split(' ')[0]},</p>
        <p style="color: #374151; font-size: 16px;">We were unable to process your payment for Trademate AI. Please update your payment details to avoid service interruption.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://trademate.dev'}/app/billing" 
           style="display: inline-block; background: #ff6b35; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
          Update payment details →
        </a>
        <p style="color: #9ca3af; font-size: 13px; margin-top: 32px;">If you need help, reply to this email.</p>
      </div>
    `,
    text: `Hi ${customerName.split(' ')[0]}

Your payment for Trademate AI failed. Please update your payment details to avoid service interruption.

Update here: ${process.env.NEXT_PUBLIC_APP_URL || 'https://trademate.dev'}/app/billing`,
  });
}

// ─── Notification In-App ───────────────────────────────────────────────────────

export async function createInAppNotification(
  type: string,
  title: string,
  message: string,
  priority: 'low' | 'medium' | 'high' = 'medium'
) {
  return supabase.from('notifications').insert([{
    type,
    title,
    message,
    priority,
    read: false,
    created_at: new Date().toISOString(),
  }]);
}
