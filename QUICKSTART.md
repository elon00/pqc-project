# 🚀 Quick Start Guide

## ⚠️ Prerequisites

Before you can run this application, you need to install **Node.js** (which includes npm).

### Step 1: Install Node.js

1. Go to [nodejs.org](https://nodejs.org/)
2. Download the LTS (Long Term Support) version
3. Run the installer and follow the instructions
4. **Restart your terminal/PowerShell after installation**

To verify installation, run:
```powershell
node --version
npm --version
```

---

## 📦 Setup the Project

### Option 1: Using Command Line

```powershell
# Navigate to project directory
cd "c:\Users\marti\Downloads\pqc project"

# Install dependencies
npm install

# Start the server (development)
npm run dev

# OR start the server (production)
npm start
```

### Option 2: Using the Start Script

1. Double-click `start.bat` in the project folder
2. It will automatically install dependencies and start the server

---

## 🌐 Access the Application

Once the server is running, open your browser and go to:

```
http://localhost:3000
```

You should see the Hybrid PQC Key Exchange web interface.

---

## 📝 Verify Everything Works

1. **Check Server Health:**
   ```
   http://localhost:3000/health
   ```
   Should return: `{"status":"ok","timestamp":"...","service":"Hybrid PQC Key Exchange API"}`

2. **Start a Handshake:**
   - Click **"🔄 हैंडशेक शुरू करें"** button
   - Watch the protocol steps execute in real-time

3. **Test Encryption:**
   - After handshake completes
   - Click **"🔒 टेस्ट एन्क्रिप्शन"** button
   - Type a message and send

---

## 🔧 Troubleshooting

### Issue: "npm is not recognized"
**Solution:** Node.js is not installed or not in PATH. Restart terminal after installing Node.js.

### Issue: "Port 3000 already in use"
**Solution:** Change the port:
```powershell
$env:PORT=3001
npm start
# Access at http://localhost:3001
```

### Issue: Server won't start
**Solution:** Check for errors in console, ensure all dependencies installed:
```powershell
npm install
npm start
```

### Issue: "CORS error" or "Connection refused"
**Solution:** Ensure server is running and accessible:
```powershell
curl http://localhost:3000/health
```

---

## 📚 Project Structure

```
pqc-project/
├── server.js                 # Main Express server
├── routes/api.js             # REST API endpoints
├── utils/crypto.js           # Cryptography logic
├── public/
│   ├── index.html           # Web interface
│   ├── js/app.js            # Frontend logic
│   └── css/styles.css       # Styling
├── package.json             # Dependencies
├── README.md                # Full documentation
└── QUICKSTART.md            # This file
```

---

## 🎯 Next Steps

1. **Understand the Protocol:**
   - Read [README.md](README.md) for detailed documentation
   - Watch the handshake visualization in the UI

2. **Explore the Code:**
   - [server.js](server.js) - Main application logic
   - [utils/crypto.js](utils/crypto.js) - Cryptography implementation
   - [public/js/app.js](public/js/app.js) - Frontend logic

3. **API Integration:**
   - Test endpoints with curl or Postman
   - See [API Endpoints](README.md#-api-endpoints) in README.md

4. **Customization:**
   - Modify port in `.env` file
   - Change UI styling in `public/css/styles.css`
   - Add more features to `routes/api.js`

---

## 📞 Support

- Check the full [README.md](README.md) for comprehensive documentation
- Review code comments for implementation details
- Check browser console for JavaScript errors
- Check terminal for server errors

---

## ✅ You're Ready!

Your Hybrid PQC Key Exchange prototype is now set up and ready to explore quantum-safe cryptography! 🔐

**Questions?** Read the [README.md](README.md) or explore the code!
