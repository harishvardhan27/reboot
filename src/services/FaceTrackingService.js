import { Camera } from 'expo-camera';

class FaceTrackingService {
  constructor() {
    this.pythonBackendUrl = 'http://localhost:5000';
    this.isAnalyzing = false;
  }

  async captureAndAnalyze(cameraRef) {
    if (this.isAnalyzing || !cameraRef.current) return null;
    
    try {
      this.isAnalyzing = true;
      
      // Capture image from camera
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        base64: true,
        skipProcessing: true,
      });

      // Send to Python backend for analysis
      const response = await fetch(`${this.pythonBackendUrl}/analyze_face`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: `data:image/jpeg;base64,${photo.base64}`
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return this.processAnalysisResult(result);

    } catch (error) {
      console.error('Face tracking analysis failed:', error);
      return {
        face_detected: false,
        focus_score: 50,
        alerts: ['Analysis unavailable'],
        error: error.message
      };
    } finally {
      this.isAnalyzing = false;
    }
  }

  processAnalysisResult(result) {
    return {
      face_detected: result.face_detected,
      focus_score: result.focus_score,
      alerts: result.alerts || [],
      eye_data: result.eye_data || {},
      gaze_data: result.gaze_data || {},
      head_pose: result.head_pose || {},
      emotion: result.emotion || 'unknown',
      timestamp: Date.now()
    };
  }

  async checkBackendHealth() {
    try {
      const response = await fetch(`${this.pythonBackendUrl}/health`);
      return response.ok;
    } catch (error) {
      console.error('Backend health check failed:', error);
      return false;
    }
  }

  // Fallback analysis using expo-face-detector
  async fallbackAnalysis(faces) {
    if (!faces || faces.length === 0) {
      return {
        face_detected: false,
        focus_score: 30,
        alerts: ['No face detected']
      };
    }

    const face = faces[0];
    const { leftEyeOpenProbability, rightEyeOpenProbability, yawAngle, rollAngle } = face;
    
    let focus_score = 100;
    const alerts = [];

    // Eye analysis
    if (leftEyeOpenProbability < 0.3 || rightEyeOpenProbability < 0.3) {
      focus_score -= 40;
      alerts.push('Eyes closed detected');
    } else if (leftEyeOpenProbability < 0.6 || rightEyeOpenProbability < 0.6) {
      focus_score -= 20;
      alerts.push('Drowsiness detected');
    }

    // Head pose analysis
    if (Math.abs(yawAngle) > 15 || Math.abs(rollAngle) > 15) {
      focus_score -= 25;
      alerts.push('Head turned away');
    }

    return {
      face_detected: true,
      focus_score: Math.max(0, focus_score),
      alerts,
      eye_data: {
        left_eye_open: leftEyeOpenProbability,
        right_eye_open: rightEyeOpenProbability,
        eyes_open: leftEyeOpenProbability > 0.5 && rightEyeOpenProbability > 0.5
      },
      head_pose: {
        yaw: yawAngle,
        roll: rollAngle,
        looking_away: Math.abs(yawAngle) > 15 || Math.abs(rollAngle) > 15
      }
    };
  }
}

export default new FaceTrackingService();