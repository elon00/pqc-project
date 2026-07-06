# 🔐 Hybrid PQC Key Exchange

**A prototype web application for a modern, quantum-safe hybrid key exchange protocol.**

An interactive demonstration combining X25519 (classical) and ML-KEM-768 (post-quantum) cryptography with an **AI-powered chatbot guide**.

---

## 🚀 Features

### Protocol Components
- **X25519**: Traditional elliptic curve Diffie-Hellman key exchange (32 bytes)
- **ML-KEM-768**: Post-quantum lattice-based key encapsulation (1184B public key, 1088B ciphertext)
- **HKDF-SHA256**: Key derivation combining both secrets
- **AES-256-GCM**: Authenticated encryption with 256-bit keys

### Web Application
- ✅ Real-time animated handshake visualization
- ✅ Step-by-step protocol execution with logs
- ✅ Secure message encryption/decryption demo
- ✅ Session management with REST API
- ✅ **🤖 AI Chatbot Guide** (powered by Claude 3.5 Sonnet)
- ✅ English-only interface
- ✅ Responsive design for desktop & mobile
- ✅ Live server communication

### AI Chatbot
- 🎓 **Educational**: Explains cryptographic concepts
- 👥 **Interactive**: Guides users through each step
- 🔐 **Context-Aware**: Understands protocol state
- 💬 **Real-time**: Instant feedback and guidance

---

## 📁 Project Structure

```
pqc-project/
├── public/                 # Frontend files
│   ├── index.html         # Main HTML (with chatbot sidebar)
│   ├── js/
│   │   └── app.js         # Frontend logic + chat
│   └── css/
│       └── styles.css     # Styling + chatbot styles
├── routes/
│   └── api.js             # API endpoints (including /chat)
├── utils/
│   ├── crypto.js          # Cryptography utilities
│   └── claude.js          # Claude AI integration
├── server.js              # Express server
├── package.json           # Node dependencies
├── .env.example           # Environment template
├── .gitignore             # Git ignore rules
├── CHATBOT_SETUP.md       # AI Chatbot setup guide
└── README.md              # This file
```

---

## 🛠️ Installation

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Anthropic API Key (for chatbot - optional)

### Setup

1. **Clone/Download the project**
```bash
cd pqc project
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment** (optional - required for chatbot)
```bash
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
# For setup details, see CHATBOT_SETUP.md
```

4. **Start the server**
```bash
# Production
npm start

# Development (with auto-reload)
npm run dev
```

5. **Open in browser**
```
http://localhost:3000
```

---

## 📊 Protocol Flow

```
CLIENT                          SERVER
  │                               │
  ├─ Generate X25519 + ML-KEM ────┤
  │  Public Keys                  │
  │                        ┌──────┤
  │                        │ Receive
  │                        │ Client Keys
  │                        │
  │                  ┌─────┴──────┐
  │                  │ Generate    │
  │                  │ Server Key  │
  │                  │ ECDH + KEM  │
  │                  └─────┬──────┘
  │                        │
  ├─ Receive Server ────────┤
  │  Key + Ciphertext       │
  │                        │
  ├─ ECDH Shared Secret ────┤ (Both compute same)
  ├─ KEM Decapsulation ─────┤
  ├─ HKDF-SHA256 ───────────┤
  │                        │
  ├─ Final AES-256 Key ─────┤ (Keys match ✓)
  │                        │
  └─ AES-256-GCM ──────────→ (Secure messaging)
```

---

## 🔌 API Endpoints

### `POST /api/chat`
Send a message to the AI chatbot.

**Request:**
```json
{
  "message": "What should I do first?",
  "context": {
    "sessionStatus": "Active",
    "keysGenerated": true,
    "handshakeComplete": false
  }
}
```

**Response:**
```json
{
  "success": true,
  "response": "Great question! Start by clicking the 'Start Handshake' button...",
  "timestamp": "2026-07-06T13:30:00.000Z"
}
```

### `POST /api/init-handshake`
Initialize a new key exchange session and generate client key pair.

### `POST /api/server-encapsulate`
Server performs ECDH and ML-KEM encapsulation.

### `POST /api/client-decapsulate`
Client performs decapsulation to derive final AES key.

### `POST /api/encrypt-message`
Encrypt a message using the session key.

### `POST /api/decrypt-message`
Decrypt a message using the session key.

### `GET /api/session/:sessionId`
Get session status.

### `DELETE /api/session/:sessionId`
Clear a session.

---

## 🤖 Using the AI Chatbot

### Getting Started

1. Open http://localhost:3000
2. Set up your ANTHROPIC_API_KEY (see [CHATBOT_SETUP.md](CHATBOT_SETUP.md))
3. Look for **"🤖 AI Guide"** sidebar on the right
4. Ask questions in the chat box!

### Example Questions

- "What is this demo about?"
- "What should I do first?"
- "Explain X25519"
- "How does ML-KEM-768 work?"
- "What's happening in step 2?"
- "How does HKDF combine the secrets?"

### Chatbot Features

- 📝 **Multi-turn Conversations**: Ask follow-up questions
- 🔄 **Protocol-Aware**: References your current demo state  
- ⏱️ **Real-time Responses**: Instant guidance
- 📱 **Responsive**: Works on desktop and mobile

**For detailed setup instructions, see [CHATBOT_SETUP.md](CHATBOT_SETUP.md)**

---

## 🔐 Security Notes

### Current Status (Prototype)
⚠️ **Not for production use**

- ML-KEM-768 is **simulated** for demonstration
- Uses Node.js crypto for X25519 (secure)
- HKDF-SHA256 properly implemented
- Message encryption uses XOR (demo only)

### For Production

1. **Replace ML-KEM-768 simulation:**
   - Use `liboqs-js` library (JavaScript bindings for liboqs)
   - Or integrate with server-side implementations
   - Ensure compliance with NIST standards

2. **Implement real AES-256-GCM:**
   - Use `crypto-js` or `tweetnacl.js`
   - Proper IV handling for each message
   - Authentication tag verification

3. **Add security features:**
   - Perfect Forward Secrecy (PFS)
   - Session key rotation
   - Replay attack protection
   - Rate limiting on API endpoints
   - HTTPS/TLS enforcement

---

## 📈 Key Sizes

| Component | Size | Purpose |
|-----------|------|---------|
| X25519 Public Key | 32 bytes | Classical ECDH |
| ML-KEM-768 Public Key | 1,184 bytes | Post-Quantum KEM |
| ML-KEM-768 Ciphertext | 1,088 bytes | Encapsulated secret |
| ECDH Shared Secret | 32 bytes | Key material |
| ML-KEM Shared Secret | 32 bytes | Key material |
| Final AES Key (HKDF) | 32 bytes (256-bit) | Encryption |

**Total Public Key Exchange Size: 1,216 bytes**

---

## 🧪 Testing

### Manual Testing

1. **Open UI**: http://localhost:3000
2. **Click "🔄 हैंडशेक शुरू करें" (Start Handshake)**
3. Watch the handshake execute with logs
4. Click "🔒 टेस्ट एन्क्रिप्शन" (Test Encryption)
5. Type a message and send
6. Verify encryption/decryption works

### API Testing with cURL

```bash
# Initialize handshake
curl -X POST http://localhost:3000/api/init-handshake

# Server encapsulation
curl -X POST http://localhost:3000/api/server-encapsulate \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"xxx","clientX25519Public":"...","clientMLKEMPublic":"..."}'

# Check session
curl http://localhost:3000/api/session/session_xxx

# Health check
curl http://localhost:3000/health
```

---

## 📚 Learning Resources

### Quantum-Safe Cryptography
- [NIST PQC Standardization](https://csrc.nist.gov/projects/post-quantum-cryptography/)
- [ML-KEM Specification](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.203.pdf)
- [Hybrid Key Exchange](https://www.ietf.org/archive/id/draft-ietf-tls-hybrid-design-00.html)

### X25519 & ECDH
- [RFC 7748 - Elliptic Curves for Security](https://tools.ietf.org/html/rfc7748)
- [X25519 Implementation](https://cr.yp.to/ecdh.html)

### HKDF
- [RFC 5869 - HKDF](https://tools.ietf.org/html/rfc5869)

---

## 🛠️ Troubleshooting

### Port already in use
```bash
# Change port
PORT=3001 npm start

# Or kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Server connection failed
- Ensure server is running: `npm start`
- Check http://localhost:3000/health
- Check browser console for errors
- Verify CORS settings

### ML-KEM library error
- ML-KEM is simulated for web compatibility
- For production, integrate liboqs

---

## 📝 License

MIT License - See LICENSE file for details

---

## 👥 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing documentation
- Review the code comments

---

## 🎯 Future Enhancements

- [ ] Real ML-KEM-768 implementation
- [ ] Database for session persistence
- [ ] WebSocket support for real-time communication
- [ ] Key rotation and refresh tokens
- [ ] Advanced metrics and monitoring
- [ ] Docker containerization
- [ ] Load balancing support
- [ ] Unit and integration tests

---

**Built with ❤️ for quantum-safe cryptography research**

🚀 **Version:** 1.0.0  
📅 **Last Updated:** 2026-07-06
