# Cognitive Study Monitor

## Model Setup

### 1. Add Your TFLite Model
Place your trained FER13 model file here:
```
assets/models/emotion_model.tflite
```

### 2. Model Requirements
- **Input**: 48x48 grayscale image
- **Output**: 7 emotion classes (angry, disgust, fear, happy, sad, surprise, neutral)
- **Format**: TensorFlow Lite (.tflite)

### 3. Labels
The emotion labels are defined in:
```
assets/models/labels.json
```

### 4. Integration Steps
1. Copy your `emotion_model.tflite` to `assets/models/`
2. Update `MLService.js` `loadTFLiteModel()` method with actual TFLite inference
3. For React Native TFLite integration, consider using:
   - `react-native-tflite` 
   - `@tensorflow/tfjs-react-native` with custom ops
   - Native bridge for TFLite interpreter

### 5. Current Status
- ✅ Model loading structure ready
- ✅ Labels configuration
- ⏳ TFLite inference (currently using mock)
- ✅ Built-in eye/yawn/movement detection

### 6. File Structure
```
assets/
  models/
    emotion_model.tflite  <- Your model here
    labels.json          <- Emotion labels
```