// AI Voice Processing with MiniMax
// Uses MiniMax TTS for natural voice responses

import { receptionistScripts } from './twilio';

// MiniMax API configuration
const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY || '';
const MINIMAX_API_URL = 'https://api.minimax.chat/v1/t2a_v2';

// Call session state
export interface CallSession {
  id: string;
  phone: string;
  customerName: string;
  issue: string;
  address: string;
  preferredDate: string;
  currentStep: 'greeting' | 'name' | 'phone' | 'issue' | 'address' | 'date' | 'confirmation' | 'closing';
  createdAt: Date;
}

export const activeSessions = new Map<string, CallSession>();

// Process incoming call and return AI response
export async function processIncomingCall(callSid: string, from: string): Promise<string> {
  // Create new session
  const session: CallSession = {
    id: callSid,
    phone: from,
    customerName: '',
    issue: '',
    address: '',
    preferredDate: '',
    currentStep: 'greeting',
    createdAt: new Date(),
  };
  
  activeSessions.set(callSid, session);
  
  return receptionistScripts.greeting;
}

// Process customer response and determine next step
export async function processCustomerResponse(
  callSid: string, 
  speechResult: string
): Promise<{ response: string; isComplete: boolean }> {
  const session = activeSessions.get(callSid);
  
  if (!session) {
    return { 
      response: receptionistScripts.greeting, 
      isComplete: false 
    };
  }

  // Determine next step based on current state
  switch (session.currentStep) {
    case 'greeting':
      // Customer described their issue in first response
      session.issue = speechResult;
      session.currentStep = 'name';
      return { 
        response: receptionistScripts.captureName, 
        isComplete: false 
      };
    
    case 'name':
      session.customerName = speechResult;
      session.currentStep = 'phone';
      return { 
        response: receptionistScripts.capturePhone, 
        isComplete: false 
      };
    
    case 'phone':
      session.currentStep = 'address';
      return { 
        response: receptionistScripts.captureAddress, 
        isComplete: false 
      };
    
    case 'address':
      session.currentStep = 'date';
      return { 
        response: receptionistScripts.availability, 
        isComplete: false 
      };
    
    case 'date':
      session.preferredDate = speechResult;
      session.currentStep = 'confirmation';
      return { 
        response: receptionistScripts.confirmation(
          session.customerName, 
          session.preferredDate, 
          session.issue || 'service'
        ), 
        isComplete: false 
      };
    
    case 'confirmation':
      session.currentStep = 'closing';
      return { 
        response: receptionistScripts.closing, 
        isComplete: true 
      };
    
    case 'closing':
      return { 
        response: receptionistScripts.closing, 
        isComplete: true 
      };
    
    default:
      return { 
        response: receptionistScripts.greeting, 
        isComplete: false 
      };
  }
}

// Generate TTS audio using MiniMax
export async function generateTTS(text: string): Promise<Buffer | null> {
  if (!MINIMAX_API_KEY) {
    console.log('MiniMax API key not configured, returning text only');
    return null;
  }

  try {
    const response = await fetch(`${MINIMAX_API_URL}?Token=${MINIMAX_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text,
        voice_setting: {
          voice_id: 'male-qn-qingse',
          speed: 1.0,
          vol: 1.0,
          pitch: 0,
        },
        audio_setting: {
          sample_rate: 32000,
          bitrate: 128000,
          format: 'mp3',
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`MiniMax API error: ${response.status}`);
    }

    const audioBuffer = await response.arrayBuffer();
    return Buffer.from(audioBuffer);
  } catch (error) {
    console.error('TTS generation failed:', error);
    return null;
  }
}

// Get session details
export function getSession(callSid: string): CallSession | undefined {
  return activeSessions.get(callSid);
}

// End session
export function endSession(callSid: string): CallSession | undefined {
  const session = activeSessions.get(callSid);
  activeSessions.delete(callSid);
  return session;
}

// Create job from completed call
export function createJobFromSession(session: CallSession): object {
  return {
    customer: session.customerName,
    phone: session.phone,
    service: session.issue,
    address: session.address,
    date: session.preferredDate,
    status: 'booked',
    source: 'ai-call',
    callId: session.id,
  };
}
