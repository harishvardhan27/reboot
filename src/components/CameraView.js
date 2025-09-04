import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';
import * as Notifications from 'expo-notifications';
import * as Haptics from 'expo-haptics';

export default function CameraView({ alertsEnabled, onFocusUpdate }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [focusData, setFocusData] = useState({ score: 100, alerts: [], emotion: 'neutral' });
  const [faceData, setFaceData] = useState(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    requestPermissions();
    
    const interval = setInterval(analyzeFocus, 3000);
    return () => clearInterval(interval);
  }, []);

  const requestPermissions = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
    
    await Notifications.requestPermissionsAsync();
  };

  const analyzeFocus = async () => {
    try {
      // Mock focus analysis
      const result = {
        focusScore: Math.floor(Math.random() * 40) + 60,
        alerts: Math.random() > 0.7 ? ['Stay focused!'] : [],
        emotion: 'neutral'
      };
      
      setFocusData(result);
      onFocusUpdate?.(result);

      if (alertsEnabled && result.alerts.length > 0) {
        showAlert(result.alerts[0]);
      }
    } catch (error) {
      console.error('Focus analysis failed:', error);
    }
  };

  const handleFacesDetected = ({ faces }) => {
    if (faces.length > 0) {
      setFaceData(faces[0]);
    } else {
      setFaceData(null);
    }
  };

  const showAlert = async (message) => {
    // Haptic feedback
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    
    // Local notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Focus Alert',
        body: message,
      },
      trigger: null,
    });
  };

  if (hasPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        type={Camera.Constants.Type.front}
        ratio="16:9"
        onFacesDetected={handleFacesDetected}
        faceDetectorSettings={{
          mode: FaceDetector.FaceDetectorMode.fast,
          detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
          runClassifications: FaceDetector.FaceDetectorClassifications.none,
        }}
      />
      
      <View style={styles.overlay}>
        <View style={styles.focusIndicator}>
          <Text style={styles.scoreText}>
            Focus: {Math.round(focusData.score)}%
          </Text>
          <Text style={styles.emotionText}>
            Emotion: {focusData.emotion}
          </Text>
          {focusData.alerts.length > 0 && (
            <Text style={styles.alertText}>{focusData.alerts[0]}</Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 20,
  },
  focusIndicator: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  scoreText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emotionText: {
    color: '#90EE90',
    fontSize: 14,
    marginTop: 2,
  },
  alertText: {
    color: '#ff6b6b',
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
  },
});