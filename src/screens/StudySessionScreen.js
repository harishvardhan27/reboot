import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import CameraView from '../components/CameraView';

export default function StudySessionScreen({ route, navigation }) {
  const { duration, breakTime, alertsEnabled } = route.params;
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [focusData, setFocusData] = useState({ score: 100, alerts: [] });

  useEffect(() => {
    let interval = null;
    if (isActive && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      Alert.alert('Session Complete!', 'Great job! Time for a break?', [
        { text: 'Take Break', onPress: () => navigation.navigate('Break', { breakTime }) },
        { text: 'New Session', onPress: () => navigation.navigate('StudySetup') }
      ]);
    }
    return () => clearInterval(interval);
  }, [isActive, isPaused, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    if (!isActive) {
      setIsActive(true);
    } else {
      setIsPaused(!isPaused);
    }
  };

  const resetTimer = () => {
    setTimeLeft(duration * 60);
    setIsActive(false);
    setIsPaused(false);
  };

  const handleFocusUpdate = (data) => {
    setFocusData(data);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Focus Session</Text>
      
      <View style={styles.timerContainer}>
        <Text style={styles.timer}>{formatTime(timeLeft)}</Text>
        <Text style={styles.subtitle}>
          {!isActive ? 'Ready to focus?' : isPaused ? 'Paused' : 'Stay focused!'}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleTimer}>
          <Text style={styles.buttonText}>
            {!isActive ? 'Start' : isPaused ? 'Resume' : 'Pause'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={resetTimer}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cameraContainer}>
        {isActive && !isPaused ? (
          <CameraView 
            alertsEnabled={alertsEnabled}
            onFocusUpdate={handleFocusUpdate}
          />
        ) : (
          <View style={styles.cameraPlaceholder}>
            <Text style={styles.cameraText}>Camera Ready</Text>
            <Text style={styles.cameraSubtext}>Start session to begin monitoring</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  timer: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cameraContainer: {
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
  },
  cameraPlaceholder: {
    backgroundColor: '#ddd',
    height: 200,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
  cameraSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
});