# Face Tracking Backend

Python backend using MediaPipe Face Mesh for advanced eye and face tracking.

## Features

- **Eye Aspect Ratio (EAR)** calculation for blink detection
- **Gaze direction** estimation
- **Head pose** analysis (yaw, pitch, roll)
- **Drowsiness detection**
- **Real-time focus scoring**

## Setup

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Run the backend:
```bash
python run.py
```

3. Backend will be available at `http://localhost:5000`

## API Endpoints

### POST /analyze_face
Analyzes face image for focus tracking.

**Request:**
```json
{
  "image": "data:image/jpeg;base64,..."
}
```

**Response:**
```json
{
  "face_detected": true,
  "focus_score": 85,
  "alerts": [],
  "eye_data": {
    "left_ear": 0.3,
    "right_ear": 0.32,
    "avg_ear": 0.31,
    "eyes_open": true
  },
  "gaze_data": {
    "x": 0.01,
    "y": -0.02,
    "looking_away": false
  },
  "head_pose": {
    "yaw": 5.2,
    "pitch": -2.1,
    "looking_away": false
  },
  "emotion": "focused"
}
```

### GET /health
Health check endpoint.

## Integration

The React Native app automatically connects to this backend for advanced face tracking. If the backend is unavailable, it falls back to basic expo-face-detector analysis.