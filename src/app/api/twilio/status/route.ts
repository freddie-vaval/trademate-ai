import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// POST /api/twilio/status — Twilio call status callbacks
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const callSid = formData.get('CallSid') as string;
    const callStatus = formData.get('CallStatus') as string;
    const callDuration = formData.get('CallDuration') as string;

    if (!callSid) {
      return NextResponse.json({ error: 'Missing CallSid' }, { status: 400 });
    }

    const duration = callDuration ? parseInt(callDuration, 10) : 0;

    switch (callStatus) {
      case 'completed': {
        // Call completed successfully — log the conversation
        await supabase.from('call_logs').insert([{
          call_sid: callSid,
          status: 'completed',
          duration_seconds: duration,
          ended_at: new Date().toISOString(),
        }]);

        // Update session
        await supabase
          .from('call_sessions')
          .update({ status: 'completed', ended_at: new Date().toISOString() })
          .eq('call_sid', callSid);
        break;
      }

      case 'busy': {
        await supabase.from('call_logs').insert([{
          call_sid: callSid,
          status: 'busy',
          duration_seconds: 0,
        }]);
        break;
      }

      case 'no-answer': {
        await supabase.from('call_logs').insert([{
          call_sid: callSid,
          status: 'no_answer',
          duration_seconds: 0,
        }]);

        // If they requested a callback, flag it
        const { data: session } = await supabase
          .from('call_sessions')
          .select('intent, customer_phone')
          .eq('call_sid', callSid)
          .single();

        if (session?.intent === 'callback_request' && session?.customer_phone) {
          await supabase.from('notifications').insert([{
            type: 'callback_requested',
            title: 'Callback requested',
            message: `Customer called but hung up. Callback requested for ${session.customer_phone}`,
            priority: 'medium',
          }]);
        }
        break;
      }

      case 'failed': {
        await supabase.from('call_logs').insert([{
          call_sid: callSid,
          status: 'failed',
          duration_seconds: 0,
        }]);

        await supabase.from('notifications').insert([{
          type: 'call_failed',
          title: 'Call failed',
          message: `Inbound call failed for ${callSid}`,
          priority: 'high',
        }]);
        break;
      }

      case 'in-progress': {
        // Call is ringing/answered
        await supabase
          .from('call_sessions')
          .update({ status: 'in_progress', started_at: new Date().toISOString() })
          .eq('call_sid', callSid);
        break;
      }

      default:
        console.log(`Unhandled Twilio status: ${callStatus}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Twilio status error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
