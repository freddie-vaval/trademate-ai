// Twilio helper functions
// Docs: https://www.twilio.com/docs/voice/twiml

export interface TwilioCallParams {
  CallSid: string;
  From: string;
  To: string;
  CallStatus: string;
  TranscriptionText?: string;
  RecordingUrl?: string;
}

// Generate TwiML for AI voice response
export function generateTwiml(response: string, gather = false): string {
  const gatherTag = gather 
    ? '<Gather numDigits="1" action="/api/webhooks/twilio/gather" method="POST"><Say voice="Polly.Amy">${response}</Say></Gather>'
    : `<Response><Say voice="Polly.Amy">${response}</Say></Response>`;
  
  return `<?xml version="1.0" encoding="UTF-8"?>
${gatherTag}`;
}

// AI Receptionist Script Templates
export const receptionistScripts = {
  greeting: "Hello, thank you for calling TradeMate AI. This is your AI receptionist. How can I help you today?",
  
  captureName: "Great, and may I ask your name?",
  
  capturePhone: "Thank you. And what's the best phone number to reach you on?",
  
  captureIssue: "I understand. Could you briefly describe the issue you're experiencing?",
  
  captureAddress: "And what's the address where the work needs to be done?",
  
  availability: "What date and time would work best for our engineer to visit?",
  
  confirmation: (name: string, date: string, service: string) => 
    `Perfect, ${name}. I've booked your ${service} for ${date}. You'll receive a confirmation SMS shortly. Is there anything else I can help you with?`,
  
  closing: "Thank you for calling TradeMate AI. We look forward to helping you soon. Goodbye!",
  
  fallback: "I'm sorry, I didn't catch that. Could you please repeat that?",
  
  transfer: "Let me transfer you to speak with our team directly. Please hold on.",
};

// Parse call form data (from gather)
export function parseGatherInput(formData: TwilioCallParams): {
  digits: string;
  speechResult?: string;
} {
  return {
    digits: formData.CallSid, // Twilio passes digits via different params
    speechResult: formData.TranscriptionText,
  };
}

// Call status mapping
export const callStatusMap: Record<string, string> = {
  'queued': 'Queued',
  'ringing': 'Ringing',
  'in-progress': 'In Progress',
  'completed': 'Completed',
  'busy': 'Busy',
  'failed': 'Failed',
  'no-answer': 'No Answer',
  'canceled': 'Canceled',
};

// Format call duration
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Validate UK phone number
export function isValidUkPhone(phone: string): boolean {
  const ukPhoneRegex = /^(\+44|0)\d{10}$/;
  return ukPhoneRegex.test(phone.replace(/\s/g, ''));
}

// Format UK phone number
export function formatUkPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('44')) {
    return '+44 ' + cleaned.slice(2, 5) + ' ' + cleaned.slice(5, 10);
  }
  if (cleaned.startsWith('0')) {
    return '0' + cleaned.slice(1, 4) + ' ' + cleaned.slice(4, 10);
  }
  return phone;
}
