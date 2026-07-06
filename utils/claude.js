/**
 * Deprecated Claude integration.
 *
 * This project now uses Gemini (utils/gemini.js) for chatbot responses.
 * This file remains only to avoid breaking legacy imports.
 */

export async function chat() {
  throw new Error('Claude integration has been removed. Use GEMINI_API_KEY + utils/gemini.js instead.');
}

export async function getGreeting() {
  return chat();
}

export async function getStepHelp() {
  return chat();
}

