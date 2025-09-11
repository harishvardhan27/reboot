import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { getSessionHistory } from '../utils/database';
import LoadingSpinner from '../components/LoadingSpinner';

export default function AnalyticsScreen({ navigation }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalFocusTime: 0,
    avgFocusScore: 0,
    totalDistractions: 0
  });

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const sessionData = await getSessionHistory();
      setSessions(sessionData || []);
      
      if (sessionData && sessionData.length > 0) {
        const totalSessions = sessionData.length;
        const totalFocusTime = sessionData.reduce((sum, s) => sum + (s.completed_time || 0), 0);
        const avgFocusScore = sessionData.reduce((sum, s) => sum + (s.focus_score || 0), 0) / totalSessions;
        const totalDistractions = sessionData.reduce((sum, s) => sum + (s.distractions || 0), 0);

        setStats({
          totalSessions,
          totalFocusTime: Math.round(totalFocusTime / 60),
          avgFocusScore: Math.round(avgFocusScore),
          totalDistractions
        });
      }
    } catch (error) {
      setError('Failed to load analytics data');
      Alert.alert('Error', 'Unable to load analytics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading analytics..." />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadAnalytics}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Analytics Dashboard</Text>
      
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.totalSessions}</Text>
          <Text style={styles.statLabel}>Sessions</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.totalFocusTime}m</Text>
          <Text style={styles.statLabel}>Focus Time</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.avgFocusScore}%</Text>
          <Text style={styles.statLabel}>Avg Focus</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.totalDistractions}</Text>
          <Text style={styles.statLabel}>Distractions</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Recent Sessions</Text>
      
      {sessions.slice(0, 10).map((session, index) => (
        <View key={index} style={styles.sessionCard}>
          <View style={styles.sessionHeader}>
            <Text style={styles.sessionDate}>
              {new Date(session.date).toLocaleDateString()}
            </Text>
            <Text style={styles.sessionScore}>{session.focus_score}%</Text>
          </View>
          <View style={styles.sessionDetails}>
            <Text style={styles.sessionText}>
              Duration: {Math.round(session.completed_time / 60)}m
            </Text>
            <Text style={styles.sessionText}>
              Distractions: {session.distractions}
            </Text>
          </View>
        </View>
      ))}

      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    width: '48%',
    alignItems: 'center',
    marginBottom: 15,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  sessionCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sessionDate: {
    fontSize: 16,
    fontWeight: '600',
  },
  sessionScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#28a745',
  },
  sessionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sessionText: {
    fontSize: 14,
    color: '#666',
  },
  backButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  backText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    fontSize: 18,
    color: '#dc3545',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});