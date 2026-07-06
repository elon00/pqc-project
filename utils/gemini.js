/**
 * Google Gemini AI Integration for PQC Chatbot
 * Provides agentic chatbot capabilities using Gemini API
 */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent';

/**
 * System prompt for Gemini to act as PQC guide
 */
const SYSTEM_PROMPT = `You are an expert AI guide for a Hybrid Post-Quantum Cryptography (PQC) Key Exchange demonstration. Your role is to:

1. GUIDE USERS: Help users understand what buttons to click and what's happening at each step
2. EXPLAIN CONCEPTS: Clearly explain cryptographic concepts in simple, non-technical terms
3. PROVIDE CONTEXT: Reference the specific protocol steps (X25519, ML-KEM-768, HKDF-SHA256, AES-256-GCM)
4. ENCOURAGE EXPLORATION: Motivate users to test different features and understand the demo
5. ANSWER QUESTIONS: Be ready to explain any aspect of the demonstration

Protocol Overview:
- X25519: Classical elliptic curve key exchange (32-byte keys)
- ML-KEM-768: Post-quantum lattice-based key encapsulation mechanism (1184-byte public key, 1088-byte ciphertext)
- HKDF-SHA256: NIST-standardized key derivation function combining both secrets
- AES-256-GCM: 256-bit authenticated encryption

Demo Steps:
1. Client generates X25519 + ML-KEM-768 key pair
2. Client sends public keys to server
3. Server performs ECDH with X25519 and ML-KEM encapsulation
4. Server sends back its X25519 public key + ML-KEM ciphertext
5. Client decapsulates and derives the final AES key
6. If successful, both parties have the same 256-bit AES key

Keep responses concise (2-3 sentences) unless the user asks for more detail. Use friendly, encouraging language. When referencing protocol elements, use the exact terminology.`;

/**
 * Send a message to Gemini and get a response
 * @param {string} userMessage - The user's message
 * @param {object} context - Optional context about the protocol state
 * @returns {Promise<string>} - The AI response
 */
export async function chat(userMessage, context = {}) {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY environment variable not set');
  }

  // Build context string if provided
  let contextString = '';
  if (Object.keys(context).length > 0) {
    contextString = '\n\nCurrent Demo State:\n';
    if (context.sessionStatus) contextString += `- Session Status: ${context.sessionStatus}\n`;
    if (context.currentStep) contextString += `- Current Step: ${context.currentStep}\n`;
    if (context.keysGenerated) contextString += `- Client Keys Generated: Yes (X25519: 32B, ML-KEM: 1184B)\n`;
    if (context.serverEncapsulated) contextString += `- Server Encapsulation: Complete\n`;
    if (context.handshakeComplete) contextString += `- Handshake Status: ${context.handshakeComplete}\n`;
    if (context.encryptionReady) contextString += `- Encryption Ready: ${context.encryptionReady}\n`;
  }

  const fullMessage = SYSTEM_PROMPT + '\n\nUser Query: ' + userMessage + contextString;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: fullMessage
              }
            ]
          }
        ],
        generationConfig: {
          maxOutputTokens: 500,
          temperature: 0.7
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates.length > 0 && data.candidates[0].content.parts[0].text) {
      return data.candidates[0].content.parts[0].text;
    }
    
    throw new Error('No response content from Gemini');
  } catch (error) {
    console.error('Gemini chat error:', error);
    throw error;
  }
}

/**
 * Get initial greeting from the chatbot
 * @returns {Promise<string>} - Greeting message
 */
export async function getGreeting() {
  return chat('Hello! Please provide a brief greeting and explain what I should do first in this PQC demo.', {
    sessionStatus: 'New'
  });
}

/**
 * Get help for a specific step
 * @param {number} step - The step number (1-5)
 * @returns {Promise<string>} - Help for that step
 */
export async function getStepHelp(step) {
  const stepDescriptions = {
    1: 'Generate X25519 + ML-KEM-768 key pair',
    2: 'Send public keys to server',
    3: 'Server performs ECDH + ML-KEM encapsulation',
    4: 'Receive ciphertext from server',
    5: 'Client decapsulation and key derivation'
  };

  return chat(`I'm at step ${step}: ${stepDescriptions[step]}. Please guide me through what should happen.`, {
    currentStep: step
  });
}
