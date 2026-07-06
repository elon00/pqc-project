# API Examples

## Overview

This document provides practical examples for using the Hybrid PQC Key Exchange API.

---

## Health Check

**Endpoint:** `GET /health`

### cURL
```bash
curl http://localhost:3000/health
```

### Response
```json
{
  "status": "ok",
  "timestamp": "2026-07-06T10:30:45.123Z",
  "service": "Hybrid PQC Key Exchange API"
}
```

---

## Initialize Handshake

**Endpoint:** `POST /api/init-handshake`

Creates a new session and generates client key pair.

### cURL
```bash
curl -X POST http://localhost:3000/api/init-handshake \
  -H "Content-Type: application/json"
```

### Response
```json
{
  "success": true,
  "sessionId": "session_1720259445123_a1b2c3d4e",
  "clientPublicKey": {
    "x25519": "3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a",
    "mlkem": "4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f...",
    "sizes": {
      "x25519": 32,
      "mlkem": 1184
    }
  },
  "message": "Client key pair generated successfully"
}
```

---

## Server Encapsulation

**Endpoint:** `POST /api/server-encapsulate`

Server performs ECDH and ML-KEM encapsulation.

### cURL
```bash
curl -X POST http://localhost:3000/api/server-encapsulate \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "session_1720259445123_a1b2c3d4e",
    "clientX25519Public": "3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a",
    "clientMLKEMPublic": "4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f..."
  }'
```

### Response
```json
{
  "success": true,
  "sessionId": "session_1720259445123_a1b2c3d4e",
  "serverPublicKey": {
    "x25519": "5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a",
    "size": 32
  },
  "ciphertext": {
    "mlkem": "6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b...",
    "size": 1088
  },
  "message": "Server encapsulation completed"
}
```

---

## Client Decapsulation

**Endpoint:** `POST /api/client-decapsulate`

Client performs decapsulation and derives final AES key.

### cURL
```bash
curl -X POST http://localhost:3000/api/client-decapsulate \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "session_1720259445123_a1b2c3d4e",
    "serverX25519Public": "5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a",
    "ciphertext": "6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b..."
  }'
```

### Response
```json
{
  "success": true,
  "sessionId": "session_1720259445123_a1b2c3d4e",
  "keysMatch": true,
  "finalKeyHash": "8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d...",
  "keySize": 256,
  "message": "Handshake successful! Keys established.",
  "protocol": {
    "keyExchange": "X25519 (ECDH)",
    "postQuantum": "ML-KEM-768",
    "kdf": "HKDF-SHA256",
    "encryption": "AES-256-GCM"
  }
}
```

---

## Encrypt Message

**Endpoint:** `POST /api/encrypt-message`

Encrypt a message using established session key.

### cURL
```bash
curl -X POST http://localhost:3000/api/encrypt-message \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "session_1720259445123_a1b2c3d4e",
    "message": "Hello, Quantum-Safe World!",
    "sender": "client"
  }'
```

### Response
```json
{
  "success": true,
  "encrypted": "9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b==",
  "sender": "client",
  "timestamp": "2026-07-06T10:30:50.456Z"
}
```

---

## Decrypt Message

**Endpoint:** `POST /api/decrypt-message`

Decrypt a message using established session key.

### cURL
```bash
curl -X POST http://localhost:3000/api/decrypt-message \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "session_1720259445123_a1b2c3d4e",
    "encryptedMessage": "9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b=="
  }'
```

### Response
```json
{
  "success": true,
  "message": "Hello, Quantum-Safe World!",
  "timestamp": "2026-07-06T10:30:51.234Z"
}
```

---

## Get Session Status

**Endpoint:** `GET /api/session/:sessionId`

Get information about an active session.

### cURL
```bash
curl http://localhost:3000/api/session/session_1720259445123_a1b2c3d4e
```

### Response
```json
{
  "success": true,
  "sessionId": "session_1720259445123_a1b2c3d4e",
  "status": "established",
  "createdAt": 1720259445123,
  "ageSeconds": 35
}
```

---

## Delete Session

**Endpoint:** `DELETE /api/session/:sessionId`

Clear a session and remove associated keys.

### cURL
```bash
curl -X DELETE http://localhost:3000/api/session/session_1720259445123_a1b2c3d4e
```

### Response
```json
{
  "success": true,
  "message": "Session cleared"
}
```

---

## Complete Workflow Example

Here's a complete example flow using curl:

```bash
#!/bin/bash

# 1. Initialize handshake
echo "=== Step 1: Initialize Handshake ==="
INIT=$(curl -s -X POST http://localhost:3000/api/init-handshake)
SESSION=$(echo $INIT | grep -o '"sessionId":"[^"]*' | cut -d'"' -f4)
CLIENT_X25519=$(echo $INIT | grep -o '"x25519":"[^"]*' | head -1 | cut -d'"' -f4)
CLIENT_MLKEM=$(echo $INIT | grep -o '"mlkem":"[^"]*' | head -1 | cut -d'"' -f4)
echo "Session ID: $SESSION"

# 2. Server encapsulation
echo -e "\n=== Step 2: Server Encapsulation ==="
SERVER=$(curl -s -X POST http://localhost:3000/api/server-encapsulate \
  -H "Content-Type: application/json" \
  -d "{\"sessionId\":\"$SESSION\",\"clientX25519Public\":\"$CLIENT_X25519\",\"clientMLKEMPublic\":\"$CLIENT_MLKEM\"}")
SERVER_X25519=$(echo $SERVER | grep -o '"x25519":"[^"]*' | cut -d'"' -f4)
CIPHERTEXT=$(echo $SERVER | grep -o '"mlkem":"[^"]*' | cut -d'"' -f4)

# 3. Client decapsulation
echo -e "\n=== Step 3: Client Decapsulation ==="
CLIENT=$(curl -s -X POST http://localhost:3000/api/client-decapsulate \
  -H "Content-Type: application/json" \
  -d "{\"sessionId\":\"$SESSION\",\"serverX25519Public\":\"$SERVER_X25519\",\"ciphertext\":\"$CIPHERTEXT\"}")
KEYS_MATCH=$(echo $CLIENT | grep -o '"keysMatch":[^,]*' | cut -d':' -f2)
echo "Keys Match: $KEYS_MATCH"

# 4. Encrypt message
echo -e "\n=== Step 4: Encrypt Message ==="
ENCRYPTED=$(curl -s -X POST http://localhost:3000/api/encrypt-message \
  -H "Content-Type: application/json" \
  -d "{\"sessionId\":\"$SESSION\",\"message\":\"Hello, PQC!\",\"sender\":\"client\"}")
echo $ENCRYPTED | grep -o '"encrypted":"[^"]*'

# 5. Decrypt message
echo -e "\n=== Step 5: Decrypt Message ==="
ENC_MSG=$(echo $ENCRYPTED | grep -o '"encrypted":"[^"]*' | cut -d'"' -f4)
DECRYPTED=$(curl -s -X POST http://localhost:3000/api/decrypt-message \
  -H "Content-Type: application/json" \
  -d "{\"sessionId\":\"$SESSION\",\"encryptedMessage\":\"$ENC_MSG\"}")
echo $DECRYPTED | grep -o '"message":"[^"]*'

# 6. Clean up
echo -e "\n=== Step 6: Delete Session ==="
curl -s -X DELETE http://localhost:3000/api/session/$SESSION | grep -o '"message":"[^"]*'

echo -e "\n✅ Workflow Complete!"
```

---

## Using JavaScript/Fetch

```javascript
// Initialize handshake
const initResponse = await fetch('http://localhost:3000/api/init-handshake', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
});

const initData = await initResponse.json();
const sessionId = initData.sessionId;

// Server encapsulation
const serverResponse = await fetch('http://localhost:3000/api/server-encapsulate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sessionId,
    clientX25519Public: initData.clientPublicKey.x25519,
    clientMLKEMPublic: initData.clientPublicKey.mlkem
  })
});

const serverData = await serverResponse.json();

// Client decapsulation
const clientResponse = await fetch('http://localhost:3000/api/client-decapsulate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sessionId,
    serverX25519Public: serverData.serverPublicKey.x25519,
    ciphertext: serverData.ciphertext.mlkem
  })
});

const clientData = await clientResponse.json();
console.log('Handshake successful:', clientData.keysMatch);
```

---

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `Missing required parameters` | Request missing fields | Check all required fields in request body |
| `Session not found` | Invalid or expired session ID | Initialize a new handshake |
| `Session not established` | Trying to use session before handshake complete | Complete encapsulation/decapsulation first |
| `HTTP 500` | Server error | Check server logs for details |

---

## Rate Limiting

Currently, there is no rate limiting. For production, consider implementing:
- Per-IP rate limits
- Per-session rate limits
- Throttling for encryption operations

---

## Testing with Postman

1. Open Postman
2. Create a new Collection: "Hybrid PQC"
3. Add requests for each endpoint
4. Use variables for sessionId and public keys
5. Export collection for sharing

Example:
```
POST {{base_url}}/api/init-handshake
Authorization: Bearer {{auth_token}}
Content-Type: application/json
```

---

## Testing with cURL

All examples in this document use cURL for simplicity. For production, use:
- Python `requests` library
- JavaScript `fetch` or `axios`
- Go `net/http`
- Java `HttpClient`
- Your preferred HTTP client

---

**Need help?** Check [README.md](README.md) for full documentation.
