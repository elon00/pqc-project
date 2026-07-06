---
title: 🔐 Hybrid PQC Key Exchange - Complete Web App
description: Production-ready prototype for quantum-safe hybrid key exchange
version: 1.0.0
date: 2026-07-06
---

# 📑 Project Files Index

## 🎯 Getting Started

- **[QUICKSTART.md](QUICKSTART.md)** - Fast setup guide (start here!)
- **[README.md](README.md)** - Complete documentation
- **[API_EXAMPLES.md](API_EXAMPLES.md)** - API usage examples

## 🚀 Startup Scripts

- **[start.bat](start.bat)** - Windows quick start (double-click to run)
- **[start.sh](start.sh)** - Linux/macOS quick start (make executable with `chmod +x start.sh`)

## 🔧 Backend

### Main Application
- **[server.js](server.js)** - Express.js server with middleware setup
- **[routes/api.js](routes/api.js)** - REST API endpoints for key exchange
- **[utils/crypto.js](utils/crypto.js)** - Cryptographic operations (X25519, ML-KEM simulation, HKDF)

### Configuration
- **[package.json](package.json)** - Node.js dependencies and scripts
- **[.env.example](.env.example)** - Environment variables template
- **[.gitignore](.gitignore)** - Git ignore rules

## 🎨 Frontend

### HTML & Assets
- **[public/index.html](public/index.html)** - Main HTML interface
- **[public/css/styles.css](public/css/styles.css)** - Responsive styling with dark theme
- **[public/js/app.js](public/js/app.js)** - Frontend logic and API calls

## 🐳 Docker (Optional)

- **[Dockerfile](Dockerfile)** - Docker image configuration
- **[docker-compose.yml](docker-compose.yml)** - Docker Compose setup

---

## 📁 Complete Project Structure

```
pqc-project/
│
├── 📘 Documentation
│   ├── README.md                 # Full documentation
│   ├── QUICKSTART.md             # Quick setup guide
│   └── API_EXAMPLES.md           # API usage examples
│
├── 🚀 Startup Files
│   ├── start.bat                 # Windows startup script
│   ├── start.sh                  # Linux/macOS startup script
│   └── INDEX.md                  # This file
│
├── 🔧 Backend Configuration
│   ├── server.js                 # Main Express server
│   ├── package.json              # Node.js dependencies
│   ├── .env.example              # Environment template
│   └── .gitignore                # Git ignore rules
│
├── 🛣️ API Routes
│   └── routes/
│       └── api.js                # REST API endpoints
│
├── 🔐 Utilities
│   └── utils/
│       └── crypto.js             # Cryptographic functions
│
├── 🎨 Frontend
│   └── public/
│       ├── index.html            # HTML interface
│       ├── js/
│       │   └── app.js            # Frontend JavaScript
│       └── css/
│           └── styles.css        # Responsive CSS
│
└── 🐳 Docker (Optional)
    ├── Dockerfile                # Docker image
    └── docker-compose.yml        # Docker Compose config
```

---

## 🔑 Key Files Description

### server.js
- Express.js application setup
- CORS and body parser middleware
- Static file serving
- API route mounting
- Health check endpoint
- Error handling

### routes/api.js
- Session management endpoints
- Handshake initialization
- Server encapsulation
- Client decapsulation
- Message encryption/decryption
- Session status and cleanup

### utils/crypto.js
- X25519 key pair generation
- ML-KEM-768 simulation (public key, ciphertext generation)
- ECDH shared secret computation
- HKDF-SHA256 key derivation
- Statistics and constants

### public/index.html
- Responsive web interface
- Bilingual (Hindi + English)
- Step-by-step visualization
- Status indicators
- Message testing area
- Live logging system

### public/js/app.js
- API communication layer
- Handshake orchestration
- Real-time UI updates
- Message encryption/decryption
- Session management
- Error handling

### public/css/styles.css
- Dark theme with gradient accents
- Responsive grid layout
- Animation effects
- Mobile optimization
- Accessibility considerations

---

## 🔌 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/init-handshake` | Initialize session and generate client keys |
| POST | `/api/server-encapsulate` | Server performs ECDH + ML-KEM encapsulation |
| POST | `/api/client-decapsulate` | Client performs ECDH + ML-KEM decapsulation |
| POST | `/api/encrypt-message` | Encrypt a message with session key |
| POST | `/api/decrypt-message` | Decrypt a message with session key |
| GET | `/api/session/:sessionId` | Get session status |
| DELETE | `/api/session/:sessionId` | Delete a session |
| GET | `/health` | Server health check |

---

## 📊 Protocol Overview

### Handshake Flow
```
1. Client generates X25519 + ML-KEM-768 key pair
2. Client sends public keys to server
3. Server generates X25519 key pair
4. Server performs ECDH (with client X25519 public key)
5. Server performs ML-KEM encapsulation
6. Server sends X25519 public key + ML-KEM ciphertext to client
7. Client performs ECDH (with server X25519 public key)
8. Client performs ML-KEM decapsulation
9. Both derive final AES-256 key using HKDF-SHA256
10. Keys match ✓ → Secure channel established
```

### Cryptographic Parameters

| Component | Size | Details |
|-----------|------|---------|
| X25519 Public Key | 32 bytes | Classical ECDH |
| ML-KEM-768 Public Key | 1,184 bytes | Post-quantum KEM |
| ML-KEM-768 Ciphertext | 1,088 bytes | Encapsulated secret |
| Shared Secret (combined) | 64 bytes | ECDH (32B) + PQ (32B) |
| Final AES Key | 256 bits | Derived via HKDF-SHA256 |
| AES IV | 96 bits | Random for each message |

---

## 🛠️ Installation Checklist

- [ ] Install Node.js (v16+)
- [ ] Extract/clone project
- [ ] Run `npm install`
- [ ] Configure `.env` (optional)
- [ ] Run `npm start`
- [ ] Open http://localhost:3000
- [ ] Test handshake
- [ ] Test encryption

---

## 🚀 Quick Commands

```bash
# Install dependencies
npm install

# Start development server (with auto-reload)
npm run dev

# Start production server
npm start

# Run health check
curl http://localhost:3000/health
```

---

## 📱 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (responsive)

---

## 🔒 Security Status

### Current (Prototype)
- ✅ X25519 uses Node.js crypto (secure)
- ✅ HKDF-SHA256 properly implemented
- ✅ Session management
- ⚠️ ML-KEM-768 is simulated (for web compatibility)
- ⚠️ Message encryption uses XOR (demo only)

### For Production
- [ ] Integrate real ML-KEM-768 (liboqs-js)
- [ ] Implement proper AES-256-GCM
- [ ] Add HTTPS/TLS
- [ ] Add authentication
- [ ] Implement rate limiting
- [ ] Add CSRF protection
- [ ] Regular security audits

---

## 📚 Learning Resources

- [NIST PQC Standardization](https://csrc.nist.gov/projects/post-quantum-cryptography/)
- [ML-KEM Specification](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.203.pdf)
- [RFC 7748 - X25519](https://tools.ietf.org/html/rfc7748)
- [RFC 5869 - HKDF](https://tools.ietf.org/html/rfc5869)

---

## 🆘 Troubleshooting

### Port Already in Use
```bash
# Use different port
PORT=3001 npm start

# Or kill process on port 3000
lsof -ti:3000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :3000    # Windows
```

### Dependencies Not Installed
```bash
npm install
npm install --no-optional
npm ci                          # Clean install
```

### Server Connection Failed
- Verify server is running: `curl http://localhost:3000/health`
- Check browser console for errors
- Check terminal for server errors
- Ensure CORS is enabled in .env

---

## 📞 Support & Documentation

- **Detailed Setup**: Read [QUICKSTART.md](QUICKSTART.md)
- **Full Documentation**: Read [README.md](README.md)
- **API Examples**: Read [API_EXAMPLES.md](API_EXAMPLES.md)
- **Code Comments**: Review source files for implementation details

---

## 🎓 Next Steps

1. **Start with QUICKSTART.md** to get the server running
2. **Open the web interface** at http://localhost:3000
3. **Click "Start Handshake"** to see protocol visualization
4. **Test encryption** with sample messages
5. **Explore the code** to understand implementation
6. **Review documentation** for detailed information
7. **Try API examples** using curl or Postman

---

## ✨ Features Summary

### User Interface
- Real-time handshake animation
- Step-by-step protocol execution
- Live system logs
- Status indicators
- Message testing area
- Bilingual interface (Hindi/English)

### Backend API
- REST endpoints for all protocol steps
- Session management
- In-memory key storage
- Error handling
- Health checks

### Cryptography
- X25519 ECDH key exchange
- ML-KEM-768 post-quantum KEM (simulated)
- HKDF-SHA256 key derivation
- AES-256-GCM encryption (simulated)

### Developer Experience
- Clean code structure
- Comprehensive documentation
- API examples
- Quick start scripts
- Docker support (optional)
- VS Code friendly

---

## 📄 License

MIT License - See README.md for details

---

## 👥 Contributing

Contributions welcome! See README.md for guidelines.

---

**🚀 Ready to explore quantum-safe cryptography!**

Start with [QUICKSTART.md](QUICKSTART.md) and enjoy! 🔐

---

*Version 1.0.0 | Built for PQC Research & Education | 2026*
