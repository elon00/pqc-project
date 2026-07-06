/**
 * Hybrid PQC Key Exchange - Frontend Application
 * Client-side logic for the key exchange demo
 */

const API_BASE = '/api';
let currentSession = null;
let clientKeyPair = null;

// ==============================================
// Utility Functions
// ==============================================

function log(message, type = 'info') {
    const logArea = document.getElementById('logArea');
    const entry = document.createElement('div');
    entry.className = `log-entry log-${type}`;
    entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    logArea.appendChild(entry);
    logArea.scrollTop = logArea.scrollHeight;
}

function updateStatus(elementId, status) {
    const badge = document.getElementById(elementId);
    badge.className = 'status-badge';
    badge.classList.add(`status-${status}`);
    const textMap = { 
        pending: 'Pending', 
        active: 'Active', 
        secure: '🔒 Secure' 
    };
    badge.textContent = textMap[status] || status;
}

function activateStep(stepId) {
    const step = document.getElementById(stepId);
    step.classList.add('active');
    setTimeout(() => {
        step.classList.remove('active');
        step.classList.add('completed');
    }, 1500);
}

function bytesToHex(bytes) {
    if (!bytes) return '';
    return bytes.split('').slice(0, 32).join('') + '...';
}

// ==============================================
// Chatbot Functions
// ==============================================

function addChatMessage(text, isUser = false) {
    const messagesDiv = document.getElementById('chatbotMessages');
    const messageEl = document.createElement('div');
    messageEl.className = `chat-message ${isUser ? 'user-message' : 'bot-message'}`;
    
    const textEl = document.createElement('div');
    textEl.className = 'message-text';
    textEl.textContent = text;
    
    messageEl.appendChild(textEl);
    messagesDiv.appendChild(messageEl);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function showTypingIndicator() {
    const messagesDiv = document.getElementById('chatbotMessages');
    const messageEl = document.createElement('div');
    messageEl.className = 'chat-message bot-message typing';
    messageEl.id = 'typingIndicator';
    
    const textEl = document.createElement('div');
    textEl.className = 'message-text';
    textEl.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
    
    messageEl.appendChild(textEl);
    messagesDiv.appendChild(messageEl);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.remove();
}

function getProtocolContext() {
    return {
        sessionStatus: currentSession ? 'Active' : 'No Session',
        currentStep: document.querySelector('.step.active')?.textContent || 'Ready',
        keysGenerated: !!clientKeyPair,
        encryptionReady: document.getElementById('messageArea').style.display !== 'none'
    };
}

async function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    input.value = '';
    
    addChatMessage(message, true);
    showTypingIndicator();
    
    try {
        const response = await apiCall('/chat', 'POST', {
            message: message,
            context: getProtocolContext()
        });
        
        removeTypingIndicator();
        addChatMessage(response.response, false);
    } catch (error) {
        removeTypingIndicator();
    addChatMessage(`⚠️ Error: ${error.message}. Make sure your GEMINI_API_KEY is set.`, false);

    }
}

function handleChatKeypress(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

function toggleChatbot() {
    // This could be enhanced to collapse/expand the chatbot
    // For now, it's just a placeholder
    console.log('Chat toggled');
}

// ==============================================
// API Calls
// ==============================================

async function apiCall(endpoint, method = 'POST', data = null) {
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(`${API_BASE}${endpoint}`, options);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || `HTTP ${response.status}`);
        }

        return result;
    } catch (error) {
        log(`API Error: ${error.message}`, 'info');
        throw error;
    }
}

async function initHandshake() {
    log('🔄 Initializing handshake...', 'info');
    const response = await apiCall('/init-handshake');
    return response;
}

async function performServerEncapsulation(clientX25519, clientMLKEM) {
    log('🔧 Waiting for server encapsulation...', 'info');
    const response = await apiCall('/server-encapsulate', 'POST', {
        sessionId: currentSession,
        clientX25519Public: clientX25519,
        clientMLKEMPublic: clientMLKEM
    });
    return response;
}

async function performClientDecapsulation(serverX25519, ciphertext) {
    log('🔓 Performing client decapsulation...', 'info');
    const response = await apiCall('/client-decapsulate', 'POST', {
        sessionId: currentSession,
        serverX25519Public: serverX25519,
        ciphertext: ciphertext
    });
    return response;
}

// ==============================================
// Handshake Process
// ==============================================

async function startHandshake() {
    const btnStart = document.getElementById('btnStart');
    const btnEncrypt = document.getElementById('btnEncrypt');
    
    btnStart.disabled = true;
    btnStart.textContent = '⏳ Handshake in progress...';

    try {
        log('🔄 Starting Hybrid PQC Handshake...', 'info');

        // ============ Step 1: Client Key Generation ============
        log('🔑 Client: Generating X25519 + ML-KEM-768 key pair...', 'client');
        updateStatus('clientStatus', 'active');
        activateStep('client-step1');

        let initResponse = await initHandshake();
        currentSession = initResponse.sessionId;
        
        clientKeyPair = {
            x25519: initResponse.clientPublicKey.x25519,
            mlkem: initResponse.clientPublicKey.mlkem
        };

        const clientKeysDiv = document.getElementById('clientKeys');
        clientKeysDiv.style.display = 'block';
        clientKeysDiv.innerHTML = `
            <span class="key-label">X25519 Public Key (32 bytes):</span>
            <div>${initResponse.clientPublicKey.x25519.substring(0, 64)}...</div>
            <span class="key-label">ML-KEM-768 Public Key (1184 bytes):</span>
            <div>${initResponse.clientPublicKey.mlkem.substring(0, 64)}...</div>
        `;

        log(`✅ Client keys ready: X25519 (32B) + ML-KEM-768 (1184B)`, 'success');
        updateStatus('clientStatus', 'secure');

        // ============ Step 2: Client → Server (Public Keys) ============
        log('📤 Client → Server: Sending public keys (total 1216 bytes)...', 'client');
        activateStep('client-step2');
        activateStep('server-step1');
        updateStatus('serverStatus', 'active');

        await sleep(800);

        // ============ Step 3: Server Processing ============
        log('🔧 Server: Performing X25519 ECDH + ML-KEM encapsulation...', 'server');
        activateStep('server-step2');

        const serverEncapResponse = await performServerEncapsulation(
            clientKeyPair.x25519,
            clientKeyPair.mlkem
        );

        log(`✅ Server secrets ready: ECDH (32B) + PQ (32B)`, 'success');
        log(`📦 Ciphertext size: ${serverEncapResponse.ciphertext.size} bytes (ML-KEM-768)`, 'info');
        updateStatus('serverStatus', 'secure');

        // ============ Step 4: Server → Client (Ciphertext + Public Key) ============
        log('📤 Server → Client: Sending X25519 public key (32B) + ciphertext (1088B)...', 'server');
        activateStep('server-step3');
        activateStep('client-step3');

        await sleep(800);

        // ============ Step 5: Client Decapsulation ============
        log('🔓 Client: Deriving ECDH + ML-KEM decapsulation...', 'client');
        activateStep('client-step4');
        activateStep('server-step4');

        const clientDecapResponse = await performClientDecapsulation(
            serverEncapResponse.serverPublicKey.x25519,
            serverEncapResponse.ciphertext.mlkem
        );

        // ============ Verification ============
        if (clientDecapResponse.keysMatch) {
            log('✅✅✅ Handshake successful! Both parties have the same AES key.', 'success');
            log(`🔑 Final key: ${clientDecapResponse.finalKeyHash}`, 'success');
            log('💡 Quantum-safe: Even if X25519 is compromised, the key remains secure due to HKDF.', 'info');
            
            updateStatus('clientStatus', 'secure');
            updateStatus('serverStatus', 'secure');
            
            btnEncrypt.disabled = false;
            document.getElementById('messageArea').style.display = 'block';
        } else {
            log('❌ Error: Keys do not match!', 'info');
        }

    } catch (error) {
        log(`❌ Error: ${error.message}`, 'info');
        console.error('Handshake error:', error);
    } finally {
        btnStart.disabled = false;
        btnStart.textContent = '🔄 Start Handshake';
    }
}

// ==============================================
// Encryption Test
// ==============================================

async function testEncryption() {
    if (!currentSession) {
        alert('Please complete the handshake first!');
        return;
    }

    const message = document.getElementById('messageInput').value || 'Hello, Quantum-Safe World! 🛡️';
    
    try {
        log(`📝 Test message: "${message}"`, 'info');

        // Encrypt
        const encryptResponse = await apiCall('/encrypt-message', 'POST', {
            sessionId: currentSession,
            message: message,
            sender: 'client'
        });

        log(`🔐 Encrypted: ${encryptResponse.encrypted.substring(0, 40)}...`, 'server');

        document.getElementById('encryptedBox').style.display = 'block';
        document.getElementById('encryptedData').textContent = encryptResponse.encrypted;

        // Decrypt
        const decryptResponse = await apiCall('/decrypt-message', 'POST', {
            sessionId: currentSession,
            encryptedMessage: encryptResponse.encrypted
        });

        log(`🔓 Decrypted: "${decryptResponse.message}"`, 'client');

        document.getElementById('decryptedBox').style.display = 'block';
        document.getElementById('decryptedData').textContent = `"${decryptResponse.message}"`;

        if (decryptResponse.message === message) {
            log('✅✅ Encryption/Decryption successful! Hybrid PQC system is fully operational.', 'success');
        }

    } catch (error) {
        log(`❌ Encryption error: ${error.message}`, 'info');
    }
}

async function sendMessage() {
    await testEncryption();
}

// ==============================================
// Reset & Helpers
// ==============================================

function resetUI() {
    if (currentSession) {
        apiCall(`/session/${currentSession}`, 'DELETE').catch(() => {});
    }

    currentSession = null;
    clientKeyPair = null;

    document.getElementById('clientKeys').style.display = 'none';
    document.getElementById('clientAesKey').style.display = 'none';
    document.getElementById('serverAesKey').style.display = 'none';
    document.getElementById('encryptedBox').style.display = 'none';
    document.getElementById('decryptedBox').style.display = 'none';
    document.getElementById('messageArea').style.display = 'none';
    document.getElementById('btnEncrypt').disabled = true;
    document.getElementById('btnStart').disabled = false;
    document.getElementById('btnStart').textContent = '🔄 Start Handshake';
    document.getElementById('messageInput').value = '';

    updateStatus('clientStatus', 'pending');
    updateStatus('serverStatus', 'pending');

    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active', 'completed');
    });

    document.getElementById('logArea').innerHTML = 
        '<div class="log-entry log-info">📋 System reset. Ready for new handshake.</div>';

    log('🔄 System reset.', 'info');
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ==============================================
// Initialize on Page Load
// ==============================================

window.addEventListener('load', async () => {
    log('🚀 Hybrid PQC Key Exchange system ready.', 'info');
    log('📊 Protocol: X25519 + ML-KEM-768 + HKDF-SHA256 + AES-256-GCM', 'info');
    
    // Check server health
    try {
        const health = await apiCall('/health', 'GET');
        if (health.status === 'ok') {
            document.getElementById('navStatus').textContent = '✅ Connected to server';
            log('✅ Successfully connected to server', 'success');
        }
    } catch (error) {
        document.getElementById('navStatus').textContent = '❌ Server disconnected';
        log('❌ Could not connect to server', 'info');
    }
});

// Expose functions globally
window.startHandshake = startHandshake;
window.testEncryption = testEncryption;
window.sendMessage = sendMessage;
window.resetUI = resetUI;
