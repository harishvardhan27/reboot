import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Animated, Dimensions } from 'react-native';
import CameraView from '../components/CameraView';
import { saveSession } from '../utils/database';
import AppMonitorService from '../services/AppMonitorService';

export default function StudySessionScreen({ route, navigation }) {
  const { duration, breakTime, alertsEnabled } = route.params;
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [focusData, setFocusData] = useState({ score: 100, alerts: [] });
  const [distractions, setDistractions] = useState(0);
  const [sessionId, setSessionId] = useState(null);
  const [pulseAnim] = useState(new Animated.Value(1));
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    let interval = null;
    if (isActive && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSessionComplete();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPaused, timeLeft]);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      AppMonitorService.stopMonitoring();
    };
  }, []);

  useEffect(() => {
    if (isActive && !isPaused) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [isActive, isPaused]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    if (!isActive) {
      setIsActive(true);
      const newSessionId = Date.now();
      setSessionId(newSessionId);
      AppMonitorService.startMonitoring(newSessionId, handleDistraction);
    } else {
      setIsPaused(!isPaused);
      if (isPaused) {
        AppMonitorService.startMonitoring(sessionId, handleDistraction);
      } else {
        AppMonitorService.stopMonitoring();
      }
    }
  };

  const resetTimer = () => {
    setTimeLeft(duration * 60);
    setIsActive(false);
    setIsPaused(false);
    setDistractions(0);
    AppMonitorService.stopMonitoring();
  };

  const handleDistraction = (type, count) => {
    setDistractions(count);
    if (alertsEnabled) {
      Alert.alert('Distraction Detected', 'You switched apps. Stay focused!');
    }
  };

  const handleFocusUpdate = (data) => {
    setFocusData(data);
  };

  const handleSessionComplete = async () => {
    const finalDistractions = AppMonitorService.stopMonitoring();
    
    try {
      await saveSession({
        duration: duration * 60,
        completedTime: duration * 60,
        focusScore: focusData.score || 100,
        distractions: finalDistractions || distractions
      });
      
      Alert.alert('Session Complete!', `Great job! Distractions: ${finalDistractions || distractions}`, [
        { text: 'Take Break', onPress: () => navigation.navigate('Break', { breakTime }) },
        { text: 'New Session', onPress: () => navigation.navigate('StudySetup') }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save session data. Your progress may not be recorded.');
      navigation.navigate('StudySetup');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Focus Session</Text>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{Math.round(focusData.score)}%</Text>
            <Text style={styles.statLabel}>Focus</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{distractions}</Text>
            <Text style={styles.statLabel}>Distractions</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.timerSection}>
        <Animated.View style={[styles.timerContainer, { transform: [{ scale: pulseAnim }] }]}>
          <Text style={styles.timer}>{formatTime(timeLeft)}</Text>
          <View style={styles.progressBar}>
            <View 
              style={[styles.progressFill, { 
                width: `${((duration * 60 - timeLeft) / (duration * 60)) * 100}%` 
              }]} 
            />
          </View>
        </Animated.View>
        <Text style={styles.subtitle}>
          {!isActive ? 'Ready to focus?' : isPaused ? 'Paused' : 'Stay focused!'}
        </Text>
      </View>

      <View style={styles.controlsSection}>
        <TouchableOpacity 
          style={[styles.primaryButton, isActive && !isPaused && styles.pauseButton]} 
          onPress={toggleTimer}
        >
          <Text style={styles.primaryButtonText}>
            {!isActive ? 'Start' : isPaused ? 'Resume' : 'Pause'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.secondaryButton} onPress={resetTimer}>
          <Text style={styles.secondaryButtonText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cameraSection}>
        <View style={styles.cameraContainer}>
          {isActive && !isPaused ? (
            <CameraView 
              alertsEnabled={alertsEnabled}
              onFocusUpdate={handleFocusUpdate}
            />
          ) : (
            <View style={styles.cameraPlaceholder}>
              <Text style={styles.cameraIcon}>CAM</Text>
              <Text style={styles.cameraText}>Camera Ready</Text>
              <Text style={styles.cameraSubtext}>Start session to begin monitoring</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#667eea',
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statCard: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    minWidth: 80,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  timerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  timerContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: 30,
    borderRadius: 25,
    marginBottom: 20,
  },
  timer: {
    fontSize: 64,
    fontWeight: '900',
    color: 'white',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  progressBar: {
    width: 200,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
    marginTop: 15,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    fontWeight: '600',
  },
  controlsSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  pauseButton: {
    backgroundColor: '#FF9800',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  secondaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cameraSection: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  cameraContainer: {
    height: 180,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  cameraPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  cameraIcon: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  cameraText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  cameraSubtext: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
});