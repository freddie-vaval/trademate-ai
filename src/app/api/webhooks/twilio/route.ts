import { NextResponse } from 'next/server';
import { generateTwiml, TwilioCallParams } from '@/lib/twilio';
import { processIncomingCall, processCustomerResponse, endSession } from '@/lib/ai-voice';

// Twilio webhook for incoming calls
// POST /api/webhooks/twilio
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // Extract Twilio parameters
    const params: TwilioCallParams = {
      CallSid: formData.get('CallSid') as string || '',
      From: formData.get('From') as string || '',
      To: formData.get('To') as string || '',
      CallStatus: formData.get('CallStatus') as string || '',
      TranscriptionText: formData.get('TranscriptionText') as string || undefined,
      RecordingUrl: formData.get('RecordingUrl') as string || undefined,
    };

    const callSid = params.CallSid;
    const callStatus = params.CallStatus;

    // Handle different call statuses
    switch (callStatus) {
      case 'ringing':
        // New incoming call - start AI reception
        const greeting = await processIncomingCall(callSid, params.From);
        const twiml = generateTwiml(greeting, true);
        return new Response(twiml, {
          headers: { 'Content-Type': 'text/xml' },
        });

      case 'in-progress':
        // Call is active - check for speech/input
        const speechResult = params.TranscriptionText;
        
        if (speechResult) {
          const { response, isComplete } = await processCustomerResponse(callSid, speechResult);
          
          if (isComplete) {
            endSession(callSid);
          }
          
          const responseTwiml = generateTwiml(response, !isComplete);
          return new Response(responseTwiml, {
            headers: { 'Content-Type': 'text/xml' },
          });
        }
        
        // No speech yet, prompt again
        const waitTwiml = generateTwiml("I'm sorry, I didn't catch that. How can I help you?", true);
        return new Response(waitTwiml, {
          headers: { 'Content-Type': 'text/xml' },
        });

      case 'completed':
      case 'busy':
      case 'failed':
      case 'no-answer':
        // Call ended - cleanup
        endSession(callSid);
        break;

      default:
        console.log(`Unhandled call status: ${callStatus}`);
    }

    return NextResponse.json({ success: true, status: callStatus });
  } catch (error) {
    console.error('Twilio webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle GET for Twilio webhook verification
export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    message: 'Twilio webhook endpoint' 
  });
}
