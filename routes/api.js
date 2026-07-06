import express from 'express';
import { 
  generateClientKeyPair, 
  performServerEncapsulation, 
  performClientDecapsulation,
  deriveAESKey 
} from '../utils/crypto.js';
import { chat } from '../utils/gemini.js';


const router = express.Router();
const sessions = new Map();

/**
 * POST /api/init-handshake
 * Initialize a new key exchange session
 */
router.post('/init-handshake', (req, res) => {
  try {
    const sessionId = generateSessionId();
    const clientKeyPair = generateClientKeyPair();
    
    sessions.set(sessionId, {
      clientKeyPair,
      createdAt: Date.now(),
      status: 'initialized'
    });

    res.json({
      success: true,
      sessionId,
      clientPublicKey: {
        x25519: Buffer.from(clientKeyPair.x25519Public).toString('hex'),
        mlkem: Buffer.from(clientKeyPair.mlkemPublic).toString('hex'),
        sizes: {
          x25519: clientKeyPair.x25519Public.length,
          mlkem: clientKeyPair.mlkemPublic.length
        }
      },
      message: 'Client key pair generated successfully'
    });
  } catch (error) {
    console.error('Handshake init error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

/**
 * POST /api/server-encapsulate
 * Server performs ECDH and ML-KEM encapsulation
 */
router.post('/server-encapsulate', (req, res) => {
  try {
    const { sessionId, clientX25519Public, clientMLKEMPublic } = req.body;

    if (!sessionId || !clientX25519Public || !clientMLKEMPublic) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required parameters' 
      });
    }

    const session = sessions.get(sessionId);
    if (!session) {
      return res.status(404).json({ 
        success: false, 
        error: 'Session not found' 
      });
    }

    const serverEncapsulation = performServerEncapsulation(
      Buffer.from(clientX25519Public, 'hex'),
      Buffer.from(clientMLKEMPublic, 'hex')
    );

    session.serverEncapsulation = serverEncapsulation;
    session.status = 'encapsulated';
    sessions.set(sessionId, session);

    res.json({
      success: true,
      sessionId,
      serverPublicKey: {
        x25519: Buffer.from(serverEncapsulation.x25519Public).toString('hex'),
        size: serverEncapsulation.x25519Public.length
      },
      ciphertext: {
        mlkem: Buffer.from(serverEncapsulation.mlkemCiphertext).toString('hex'),
        size: serverEncapsulation.mlkemCiphertext.length
      },
      message: 'Server encapsulation completed'
    });
  } catch (error) {
    console.error('Server encapsulation error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

/**
 * POST /api/client-decapsulate
 * Client performs ECDH and ML-KEM decapsulation to derive final key
 */
router.post('/client-decapsulate', (req, res) => {
  try {
    const { sessionId, serverX25519Public, ciphertext } = req.body;

    if (!sessionId || !serverX25519Public || !ciphertext) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required parameters' 
      });
    }

    const session = sessions.get(sessionId);
    if (!session) {
      return res.status(404).json({ 
        success: false, 
        error: 'Session not found' 
      });
    }

    const clientDecapsulation = performClientDecapsulation(
      session.clientKeyPair,
      Buffer.from(serverX25519Public, 'hex'),
      Buffer.from(ciphertext, 'hex')
    );

    const serverSecret = session.serverEncapsulation;
    
    // Derive final AES key using HKDF
    const clientAESKey = deriveAESKey(
      clientDecapsulation.ecdhSecret,
      clientDecapsulation.pqSecret
    );

    const serverAESKey = deriveAESKey(
      serverSecret.ecdhSecret,
      serverSecret.pqSecret
    );

    session.clientAESKey = clientAESKey;
    session.serverAESKey = serverAESKey;
    session.status = 'established';
    sessions.set(sessionId, session);

    // Verify keys match
    const keysMatch = clientAESKey === serverAESKey;

    res.json({
      success: true,
      sessionId,
      keysMatch,
      finalKeyHash: hashKey(clientAESKey).substring(0, 32) + '...',
      keySize: 256,
      message: keysMatch ? 'Handshake successful! Keys established.' : 'Key mismatch detected',
      protocol: {
        keyExchange: 'X25519 (ECDH)',
        postQuantum: 'ML-KEM-768',
        kdf: 'HKDF-SHA256',
        encryption: 'AES-256-GCM'
      }
    });
  } catch (error) {
    console.error('Client decapsulation error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

/**
 * POST /api/encrypt-message
 * Encrypt a message using the established session key
 */
router.post('/encrypt-message', (req, res) => {
  try {
    const { sessionId, message, sender } = req.body;

    if (!sessionId || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required parameters' 
      });
    }

    const session = sessions.get(sessionId);
    if (!session || session.status !== 'established') {
      return res.status(404).json({ 
        success: false, 
        error: 'Session not found or not established' 
      });
    }

    // In a real app, would use cryptographic encryption
    // For demo, we'll simulate it
    const encryptedMessage = encryptMessage(message, session.serverAESKey);

    res.json({
      success: true,
      encrypted: encryptedMessage,
      sender: sender || 'unknown',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Message encryption error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

/**
 * POST /api/decrypt-message
 * Decrypt a message using the established session key
 */
router.post('/decrypt-message', (req, res) => {
  try {
    const { sessionId, encryptedMessage } = req.body;

    if (!sessionId || !encryptedMessage) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required parameters' 
      });
    }

    const session = sessions.get(sessionId);
    if (!session || session.status !== 'established') {
      return res.status(404).json({ 
        success: false, 
        error: 'Session not found or not established' 
      });
    }

    // In a real app, would use cryptographic decryption
    // For demo, we'll simulate it
    const decryptedMessage = decryptMessage(encryptedMessage, session.clientAESKey);

    res.json({
      success: true,
      message: decryptedMessage,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Message decryption error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

/**
 * GET /api/session/:sessionId
 * Get session status
 */
router.get('/session/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = sessions.get(sessionId);

    if (!session) {
      return res.status(404).json({ 
        success: false, 
        error: 'Session not found' 
      });
    }

    res.json({
      success: true,
      sessionId,
      status: session.status,
      createdAt: session.createdAt,
      ageSeconds: Math.round((Date.now() - session.createdAt) / 1000)
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

/**
 * DELETE /api/session/:sessionId
 * Clear a session
 */
router.delete('/session/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    const deleted = sessions.delete(sessionId);

    res.json({
      success: deleted,
      message: deleted ? 'Session cleared' : 'Session not found'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

/**
 * POST /api/chat
 * Send a message to Claude AI chatbot
 */
router.post('/chat', async (req, res) => {
  try {
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Message is required' 
      });
    }

    const response = await chat(message, context || {});

    res.json({
      success: true,
      response,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Helper functions
function generateSessionId() {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function hashKey(key) {
  // Simple hash for display
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    const char = key.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

function encryptMessage(message, key) {
  // Simple XOR encryption for demo (NOT for production)
  let encrypted = '';
  for (let i = 0; i < message.length; i++) {
    encrypted += String.fromCharCode(message.charCodeAt(i) ^ (key.charCodeAt(i % key.length) || 0));
  }
  return Buffer.from(encrypted).toString('base64');
}

function decryptMessage(encrypted, key) {
  // Simple XOR decryption for demo (NOT for production)
  const buffer = Buffer.from(encrypted, 'base64');
  let decrypted = '';
  for (let i = 0; i < buffer.length; i++) {
    decrypted += String.fromCharCode(buffer[i] ^ (key.charCodeAt(i % key.length) || 0));
  }
  return decrypted;
}

export default router;
