# AI Chatbot Setup Guide

## Overview

Your PQC Key Exchange demo now includes an **AI-powered chatbot** using Claude 3.5 Sonnet. The chatbot serves as an interactive guide to help users understand the hybrid PQC protocol.

## Features

✨ **Chatbot Capabilities:**
- 🎓 **Educational Guide**: Explains cryptographic concepts in simple terms
- 👥 **Interactive Help**: Guides users through each demo step
- 🔐 **Context-Aware**: Understands the current state of the protocol
- 💬 **Real-time Responses**: Provides instant feedback and guidance

## Setup Instructions

### Step 1: Get an Anthropic API Key

1. Visit [https://console.anthropic.com/](https://console.anthropic.com/)
2. Sign up or log in to your Anthropic account
3. Navigate to **API Keys** section
4. Click **"Create Key"** or **"New API Key"**
5. Copy the generated API key (keep it secure!)

### Step 2: Configure Your Project

#### Option A: Using .env File (Recommended)

1. Create a `.env` file in your project root:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your API key:
   ```
   PORT=3000
   NODE_ENV=development
   CORS_ORIGIN=*
   SESSION_TIMEOUT=3600000
   LOG_LEVEL=info
   ANTHROPIC_API_KEY=sk-ant-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   ```

3. **Never commit `.env` to version control** (it's in `.gitignore`)

#### Option B: Using Environment Variables (Windows PowerShell)

```powershell
$env:ANTHROPIC_API_KEY="sk-ant-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
npm start
```

#### Option C: Using Environment Variables (Linux/macOS)

```bash
export ANTHROPIC_API_KEY="sk-ant-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
npm start
```

### Step 3: Verify Installation

1. Start the server:
   ```bash
   npm start
   ```

2. Open http://localhost:3000 in your browser

3. You should see the **"🤖 AI Guide"** sidebar on the right

4. Type a question in the chat and click **Send**

5. If the chatbot responds with helpful information, you're all set! ✅

## Using the Chatbot

### Example Questions:

- **"What is this demo about?"** → Explains the hybrid PQC concept
- **"What should I do first?"** → Guides you through the initial steps
- **"Explain X25519"** → Describes the classical key exchange
- **"How does ML-KEM-768 work?"** → Explains the post-quantum component
- **"What's happening in step 2?"** → Provides context-specific guidance

### Chat Features:

- 📝 **Multi-turn Conversations**: Ask follow-up questions
- 🔄 **Protocol-Aware**: References your current demo state
- ⏱️ **Real-time**: Responses stream as they're generated
- 📱 **Responsive**: Works on desktop and mobile

## Troubleshooting

### ❌ "ANTHROPIC_API_KEY environment variable not set"

**Solution**: Make sure you've created a `.env` file with your API key and restarted the server.

```bash
# Verify the .env file exists
ls -la .env  # Linux/macOS
dir .env     # Windows

# Check that it contains your API key
cat .env | grep ANTHROPIC_API_KEY
```

### ❌ "Received 401 error from Claude API"

**Solution**: Your API key is incorrect or expired.

1. Verify the key is properly copied (no extra spaces)
2. Try generating a new API key from the Anthropic console
3. Restart the server after updating the key

### ❌ Chatbot not responding

**Solution**: Check your API key quota or rate limits:

1. Log in to https://console.anthropic.com/
2. Check your **Usage** and **API Key Status**
3. Ensure you have remaining quota

## Architecture

### Frontend Components

- **Chat Sidebar** (`public/index.html`): Fixed sidebar UI on the right
- **Chat Styles** (`public/css/styles.css`): Gradient styling with animations
- **Chat Logic** (`public/js/app.js`): Message handling and protocol context

### Backend Components

- **Claude Integration** (`utils/claude.js`): Handles API communication
- **Chat Endpoint** (`routes/api.js`): REST API for chat messages
- **System Prompt**: Pre-configured to guide PQC protocol users

### API Endpoint

```
POST /api/chat
Content-Type: application/json

{
  "message": "What should I do first?",
  "context": {
    "sessionStatus": "Active",
    "keysGenerated": true,
    "handshakeComplete": false
  }
}

Response:
{
  "success": true,
  "response": "Start by clicking the 'Start Handshake' button...",
  "timestamp": "2026-07-06T13:30:00.000Z"
}
```

## Security Notes

⚠️ **Important**:

1. **Never commit your `.env` file** with API keys to version control
2. **Never expose your API key** in client-side code
3. **Rotate keys regularly** if you suspect compromise
4. **Monitor API usage** to detect unusual activity
5. The `.env` file is already in `.gitignore` for your safety

## Customizing the Chatbot

### Modify the System Prompt

Edit `utils/claude.js` to change the chatbot's personality and behavior:

```javascript
const SYSTEM_PROMPT = `You are an expert AI guide for a Hybrid Post-Quantum Cryptography demo...`;
```

### Change the AI Model

Update the model in `utils/claude.js`:

```javascript
model: 'claude-3-5-sonnet-20241022',  // Change to different model
```

Available models:
- `claude-3-5-sonnet-20241022` (fastest, default)
- `claude-3-opus-20240229` (most capable)
- `claude-3-haiku-20240307` (most compact)

### Adjust Response Length

Modify the `max_tokens` parameter in `utils/claude.js`:

```javascript
max_tokens: 500,  // Increase for longer responses
```

## Support & Documentation

- **Anthropic Documentation**: https://docs.anthropic.com/
- **Claude API Reference**: https://docs.anthropic.com/claude/reference/getting-started-with-the-api
- **PQC Protocol Guide**: See [QUICKSTART.md](QUICKSTART.md)

## Next Steps

1. ✅ Set up your ANTHROPIC_API_KEY
2. ✅ Start the server and test the chatbot
3. ✅ Ask the AI guide questions about the protocol
4. ✅ Run the handshake and encryption demo
5. ✅ Explore the hybrid PQC concept!

Happy learning! 🚀
