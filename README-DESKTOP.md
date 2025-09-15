# Desktop Version Setup

## Quick Start (Web Version)
```bash
npm run web
```
Opens in browser at `http://localhost:19006`

## Desktop App (Electron Wrapper)
```bash
# Install Electron globally
npm install -g electron

# Create desktop app
npm run build:web
node web-build.js

# Run as desktop app
electron web-build/desktop.html
```

## Features Available on Desktop
- ✅ All mobile features work
- ✅ Camera access for face tracking
- ✅ Python backend integration
- ✅ Study session management
- ✅ Analytics dashboard
- ✅ Break games
- ✅ App monitoring (browser tab switching)

## Platform Detection
The app automatically detects platform and adjusts:
- **Mobile**: Full React Native features
- **Web/Desktop**: Web-compatible alternatives
- **Backend**: Same Python MediaPipe service

## Camera Permissions
Desktop browsers will request camera permission for face tracking.

## Python Backend
Same backend works for all platforms:
```bash
cd python-backend
python run.py
```

## Build for Distribution
```bash
# Web build
npm run build:web

# Package with Electron Builder
npm install -g electron-builder
electron-builder --dir
```

Your mobile app remains unchanged - this adds desktop support!