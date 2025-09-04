import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function BreakScreen({ route, navigation }) {
  const { breakTime } = route.params;
  const [timeLeft, setTimeLeft] = useState(breakTime * 60);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      navigation.navigate('StudySetup');
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Break Time!</Text>
      <Text style={styles.timer}>{formatTime(timeLeft)}</Text>
      
      <View style={styles.gamesContainer}>
        <TouchableOpacity 
          style={styles.gameButton}
          onPress={() => navigation.navigate('MemoryGame')}
        >
          <Text style={styles.gameText}>Memory Game</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.gameButton}
          onPress={() => navigation.navigate('MathPuzzle')}
        >
          <Text style={styles.gameText}>Math Puzzle</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.gameButton}
          onPress={() => navigation.navigate('ColorMatch')}
        >
          <Text style={styles.gameText}>Color Match</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.skipButton}
        onPress={() => navigation.navigate('StudySetup')}
      >
        <Text style={styles.skipText}>Skip Break</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4a90e2',
    marginBottom: 20,
  },
  timer: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: 40,
  },
  gamesContainer: {
    width: '100%',
    marginBottom: 40,
  },
  gameButton: {
    backgroundColor: '#4a90e2',
    padding: 18,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: 'center',
  },
  gameText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  skipButton: {
    backgroundColor: '#6c757d',
    padding: 12,
    borderRadius: 8,
  },
  skipText: {
    color: 'white',
    fontSize: 16,
  },
});