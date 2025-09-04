import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function ColorMatchScreen({ navigation }) {
  const [targetColor, setTargetColor] = useState('');
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);

  const colors = [
    { name: 'Red', value: '#ff4757' },
    { name: 'Blue', value: '#3742fa' },
    { name: 'Green', value: '#2ed573' },
    { name: 'Yellow', value: '#ffa502' },
    { name: 'Purple', value: '#a55eea' },
    { name: 'Orange', value: '#ff6348' },
    { name: 'Pink', value: '#ff3838' },
    { name: 'Cyan', value: '#7bed9f' },
  ];

  useEffect(() => {
    generateRound();
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          Alert.alert('Time Up!', `Final Score: ${score}`);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const generateRound = () => {
    const target = colors[Math.floor(Math.random() * colors.length)];
    const shuffled = [...colors].sort(() => Math.random() - 0.5).slice(0, 4);
    
    if (!shuffled.find(c => c.name === target.name)) {
      shuffled[0] = target;
    }
    
    setTargetColor(target.name);
    setOptions(shuffled.sort(() => Math.random() - 0.5));
  };

  const handleColorPress = (colorName) => {
    if (colorName === targetColor) {
      setScore(score + 1);
      generateRound();
    } else {
      Alert.alert('Wrong!', `Correct answer was ${targetColor}`);
      generateRound();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Color Match</Text>
      
      <View style={styles.gameInfo}>
        <Text style={styles.score}>Score: {score}</Text>
        <Text style={styles.timer}>Time: {timeLeft}s</Text>
      </View>

      <View style={styles.targetContainer}>
        <Text style={styles.instruction}>Find the color:</Text>
        <Text style={styles.targetText}>{targetColor}</Text>
      </View>

      <View style={styles.optionsContainer}>
        {options.map((color, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.colorOption, { backgroundColor: color.value }]}
            onPress={() => handleColorPress(color.name)}
          />
        ))}
      </View>

      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backText}>Back to Break</Text>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  gameInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 40,
  },
  score: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#28a745',
  },
  timer: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#dc3545',
  },
  targetContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  instruction: {
    fontSize: 18,
    marginBottom: 10,
  },
  targetText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4a90e2',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 40,
  },
  colorOption: {
    width: 80,
    height: 80,
    margin: 10,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#333',
  },
  backButton: {
    backgroundColor: '#6c757d',
    padding: 12,
    borderRadius: 8,
  },
  backText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});