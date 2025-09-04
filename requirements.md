# Cognitive Study Monitor - Requirements

## System Requirements

### Development Environment
- Node.js 16+ 
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Android Studio (for Android development)
- Xcode (for iOS development - macOS only)

### Mobile Platforms
- Android 6.0+ (API level 23+)
- iOS 11.0+

## Installation

### 1. Clone Repository
```bash
git clone https://github.com/harishvardhan27/reboot.git
cd reboot
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npx expo start
```

### 4. Run on Device
- Install Expo Go app on your phone
- Scan QR code from terminal
- Or use Android/iOS simulators

## Required Dependencies

### Core React Native
- expo ~49.0.0
- react 18.2.0
- react-native 0.72.6

### Navigation
- @react-navigation/native ^6.1.7
- @react-navigation/stack ^6.3.17
- react-native-screens ~3.22.0
- react-native-safe-area-context 4.6.3

### Camera & ML
- expo-camera ~13.4.4
- expo-face-detector ~12.0.0
- expo-notifications ~0.20.1
- expo-haptics ~12.4.0

### Database & Storage
- expo-sqlite ~11.3.3
- expo-file-system ~15.4.4
- expo-asset ~8.10.1

### UI & Gestures
- react-native-gesture-handler ~2.12.0

## Features Implemented

### ✅ Authentication
- Simple login/signup flow
- User session management

### ✅ Study Sessions
- Customizable duration (25m, 30m, 1h)
- Break time selection (5m, 10m)
- Timer with start/pause/reset

### ✅ Focus Monitoring
- Camera integration
- Face detection
- Mock emotion analysis (ready for FER13 model)
- Built-in eye closure detection
- Yawning detection
- Face movement tracking

### ✅ Break Games
- Memory card matching
- Math puzzles
- Color matching game
- Timed challenges

### ✅ Data Storage
- SQLite database
- Session history
- Distraction logging

## Model Integration

### FER13 Emotion Model
1. Place your `emotion_model.tflite` in `assets/models/`
2. Update `MLService.js` with actual TFLite inference
3. Model expects 48x48 grayscale input
4. Outputs 7 emotions: angry, disgust, fear, happy, sad, surprise, neutral

## Troubleshooting

### Common Issues
1. **Camera permissions**: Grant camera access in device settings
2. **Face detection**: Ensure good lighting and face visibility
3. **Dependencies**: Run `npm install` if modules are missing
4. **Expo version**: Use compatible Expo SDK version

### Performance Tips
- Test on physical device for camera features
- Ensure stable internet for initial setup
- Close other apps during development