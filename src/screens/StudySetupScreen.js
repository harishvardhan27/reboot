import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function StudySetupScreen({ navigation }) {
  const [duration, setDuration] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [alertsEnabled, setAlertsEnabled] = useState(true);

  const durations = [25, 30, 60];
  const breakTimes = [5, 10];

  const startSession = () => {
    navigation.navigate('StudySession', {
      duration,
      breakTime,
      alertsEnabled
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Setup Study Session</Text>
      
      <Text style={styles.label}>Study Duration (minutes)</Text>
      <View style={styles.optionRow}>
        {durations.map((time) => (
          <TouchableOpacity
            key={time}
            style={[styles.option, duration === time && styles.selectedOption]}
            onPress={() => setDuration(time)}
          >
            <Text style={[styles.optionText, duration === time && styles.selectedText]}>
              {time}m
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Break Time (minutes)</Text>
      <View style={styles.optionRow}>
        {breakTimes.map((time) => (
          <TouchableOpacity
            key={time}
            style={[styles.option, breakTime === time && styles.selectedOption]}
            onPress={() => setBreakTime(time)}
          >
            <Text style={[styles.optionText, breakTime === time && styles.selectedText]}>
              {time}m
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.option, styles.alertOption]}
        onPress={() => setAlertsEnabled(!alertsEnabled)}
      >
        <Text style={styles.optionText}>
          Focus Alerts: {alertsEnabled ? 'ON' : 'OFF'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.startButton} onPress={startSession}>
        <Text style={styles.startButtonText}>Start Study Session</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 50,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    marginTop: 20,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  option: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ddd',
    minWidth: 80,
    alignItems: 'center',
  },
  selectedOption: {
    borderColor: '#007AFF',
    backgroundColor: '#007AFF',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
  },
  selectedText: {
    color: 'white',
  },
  alertOption: {
    alignSelf: 'center',
    marginTop: 20,
  },
  startButton: {
    backgroundColor: '#28a745',
    padding: 18,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 40,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});