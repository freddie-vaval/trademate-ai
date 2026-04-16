import { NextResponse } from 'next/server';
import { generateTwiml } from '@/lib/twilio';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// POST /api/twilio/gather — handles DTMF key presses from caller
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const digits = formData.get('Digits') as string;
    const callSid = formData.get('CallSid') as string;

    if (!digits || !callSid) {
      const twiml = generateTwiML("Sorry, I didn't understand that. Please call us again.", false);
      return new Response(twiml, { headers: { 'Content-Type': 'text/xml' } });
    }

    const key = digits.trim();

    // Handle main menu options
    switch (key) {
      case '1': {
        // Quote request
        const twiml = generateTwiML(
          "Great. To request a quote, I'll need a few details. " +
          "What's your name?",
          true
        );
        // Save intent to session
        await supabase.from('call_sessions').update({
          current_step: 'collecting_name',
          intent: 'quote_request',
        }).eq('call_sid', callSid);
        return new Response(twiml, { headers: { 'Content-Type': 'text/xml' } });
      }

      case '2': {
        // Book a service
        const twiml = generateTwiML(
          "To book a service, what's your name and the type of work you need?",
          true
        );
        await supabase.from('call_sessions').update({
          current_step: 'collecting_name',
          intent: 'booking',
        }).eq('call_sid', callSid);
        return new Response(twiml, { headers: { 'Content-Type': 'text/xml' } });
      }

      case '3': {
        // Speak to a person / callback
        const twiml = generateTwiML(
          "I'll pass your message to our team. Please leave your name and number after the tone, and we'll call you back within one hour.",
          false
        );
        // Log callback request
        await supabase.from('call_sessions').update({
          current_step: 'waiting_for_callback_info',
          intent: 'callback_request',
        }).eq('call_sid', callSid);
        return new Response(twiml, { headers: { 'Content-Type': 'text/xml' } });
      }

      case '4': {
        // Check job status
        const twiml = generateTwiML(
          "To check your job status, please enter your customer reference number, followed by the hash key.",
          true
        );
        await supabase.from('call_sessions').update({
          current_step: 'collecting_reference',
          intent: 'job_status',
        }).eq('call_sid', callSid);
        return new Response(twiml, { headers: { 'Content-Type': 'text/xml' } });
      }

      case '0': {
        // Repeat menu
        const twiml = generateTwiML(
          "Thank you for calling Trademate AI. " +
          "For a quote, press 1. " +
          "To book a service, press 2. " +
          "To speak to someone, press 3. " +
          "To check a job status, press 4. " +
          "To hear this menu again, press 0.",
          true
        );
        return new Response(twiml, { headers: { 'Content-Type': 'text/xml' } });
      }

      default: {
        const twiml = generateTwiML(
          "Sorry, I didn't understand that choice. Please try again.",
          true
        );
        return new Response(twiml, { headers: { 'Content-Type': 'text/xml' } });
      }
    }
  } catch (error) {
    console.error('Twilio gather error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

function generateTwiML(speech: string, gatherNext: boolean): string {
  if (gatherNext) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather numDigits="10" action="/api/twilio/gather" method="POST" timeout="10">
    <Say voice="Polly.Amy">${speech}</Say>
  </Gather>
  <Redirect method="POST">/api/twilio/gather</Redirect>
</Response>`;
  }
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Amy">${speech}</Say>
  <Hangup/>
</Response>`;
}
