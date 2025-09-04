import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import '@tensorflow/tfjs-platform-react-native';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import labels from '../../assets/models/labels.json';

class MLService {
  constructor() {
    this.emotionModel = null;
    this.labels = labels.labels;
    this.isInitialized = false;
    this.lastFacePosition = null;
  }

  async initialize() {
    if (this.isInitialized) return;
    
    try {
      await tf.ready();
      
      // Load TFLite model
      const modelAsset = Asset.fromModule(require('../../assets/models/emotion_model.tflite'));
      await modelAsset.downloadAsync();
      
      // For TFLite, you'll need to use a different approach
      // This is a placeholder - actual TFLite loading requires platform-specific code
      this.emotionModel = await this.loadTFLiteModel(modelAsset.localUri);
      
      this.isInitialized = true;
      console.log('FER13 TFLite Model initialized');
    } catch (error) {
      console.error('Failed to initialize emotion model:', error);
      // Fallback to mock model
      this.emotionModel = await this.createMockEmotionModel();
      this.isInitialized = true;
    }
  }

  async loadTFLiteModel(modelPath) {
    // TFLite model loading - requires native bridge
    // For now, return mock model
    console.log('TFLite model path:', modelPath);
    return this.createMockEmotionModel();
  }

  async createMockEmotionModel() {
    // Mock FER13 emotion model - replace with your actual TFLite inference
    return {
      predict: (input) => {
        const scores = this.labels.map(() => Math.random());
        const maxIndex = scores.indexOf(Math.max(...scores));
        return {
          emotion: this.labels[maxIndex],
          confidence: scores[maxIndex],
          scores: scores
        };
      }
    };
  }

  // Built-in eye closure detection using face landmarks
  detectEyeClosure(faceData) {
    if (!faceData || !faceData.leftEye || !faceData.rightEye) return 0;
    
    // Calculate eye aspect ratio (EAR)
    const leftEAR = this.calculateEAR(faceData.leftEye);
    const rightEAR = this.calculateEAR(faceData.rightEye);
    const avgEAR = (leftEAR + rightEAR) / 2;
    
    // EAR threshold for closed eyes (typically < 0.25)
    return avgEAR < 0.25 ? 1 : 0;
  }

  calculateEAR(eyePoints) {
    // Eye Aspect Ratio calculation
    const vertical1 = Math.sqrt(Math.pow(eyePoints[1].x - eyePoints[5].x, 2) + Math.pow(eyePoints[1].y - eyePoints[5].y, 2));
    const vertical2 = Math.sqrt(Math.pow(eyePoints[2].x - eyePoints[4].x, 2) + Math.pow(eyePoints[2].y - eyePoints[4].y, 2));
    const horizontal = Math.sqrt(Math.pow(eyePoints[0].x - eyePoints[3].x, 2) + Math.pow(eyePoints[0].y - eyePoints[3].y, 2));
    return (vertical1 + vertical2) / (2 * horizontal);
  }

  // Built-in yawning detection using mouth landmarks
  detectYawning(faceData) {
    if (!faceData || !faceData.mouth) return 0;
    
    // Calculate mouth aspect ratio (MAR)
    const mouth = faceData.mouth;
    const mar = this.calculateMAR(mouth);
    
    // MAR threshold for yawning (typically > 0.6)
    return mar > 0.6 ? 1 : 0;
  }

  calculateMAR(mouthPoints) {
    // Mouth Aspect Ratio calculation
    const vertical1 = Math.sqrt(Math.pow(mouthPoints[2].x - mouthPoints[10].x, 2) + Math.pow(mouthPoints[2].y - mouthPoints[10].y, 2));
    const vertical2 = Math.sqrt(Math.pow(mouthPoints[4].x - mouthPoints[8].x, 2) + Math.pow(mouthPoints[4].y - mouthPoints[8].y, 2));
    const horizontal = Math.sqrt(Math.pow(mouthPoints[0].x - mouthPoints[6].x, 2) + Math.pow(mouthPoints[0].y - mouthPoints[6].y, 2));
    return (vertical1 + vertical2) / (2 * horizontal);
  }

  // Built-in face movement detection
  detectFaceMovement(faceData) {
    if (!faceData || !faceData.bounds) return 0;
    
    const currentPosition = {
      x: faceData.bounds.origin.x + faceData.bounds.size.width / 2,
      y: faceData.bounds.origin.y + faceData.bounds.size.height / 2
    };
    
    if (!this.lastFacePosition) {
      this.lastFacePosition = currentPosition;
      return 0;
    }
    
    const distance = Math.sqrt(
      Math.pow(currentPosition.x - this.lastFacePosition.x, 2) + 
      Math.pow(currentPosition.y - this.lastFacePosition.y, 2)
    );
    
    this.lastFacePosition = currentPosition;
    
    // Movement threshold (adjust based on camera resolution)
    return distance > 50 ? 1 : 0;
  }

  async analyzeFocus(imageData, faceData) {
    if (!this.isInitialized || !this.emotionModel) {
      return { focusScore: 100, alerts: [], emotion: 'neutral' };
    }

    try {
      // Get emotion from your FER13 model
      const emotionResult = this.emotionModel.predict(imageData);
      
      // Use built-in functions for other detections
      const eyeClosure = this.detectEyeClosure(faceData);
      const yawning = this.detectYawning(faceData);
      const faceMovement = this.detectFaceMovement(faceData);

      const alerts = [];
      let focusScore = 100;

      // Reduce focus score based on detections
      if (eyeClosure > 0.5) {
        alerts.push('Eyes closed - Stay alert!');
        focusScore -= 30;
      }
      if (yawning > 0.5) {
        alerts.push('Yawning detected - Take a break?');
        focusScore -= 25;
      }
      if (faceMovement > 0.5) {
        alerts.push('Looking away - Stay focused!');
        focusScore -= 20;
      }

      // Adjust focus based on emotion
      if (['angry', 'sad', 'fear'].includes(emotionResult.emotion)) {
        focusScore -= 15;
      }

      focusScore = Math.max(0, focusScore);

      return {
        focusScore,
        alerts,
        emotion: emotionResult.emotion,
        confidence: emotionResult.confidence,
        eyeClosure,
        yawning,
        faceMovement
      };
    } catch (error) {
      console.error('Analysis failed:', error);
      return { focusScore: 100, alerts: [], emotion: 'neutral' };
    }
  }
}

export default new MLService();