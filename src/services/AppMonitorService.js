import { AppState } from 'react-native';
import { saveDistraction } from '../utils/database';

class AppMonitorService {
  constructor() {
    this.isMonitoring = false;
    this.sessionId = null;
    this.appStateSubscription = null;
    this.distractionCount = 0;
    this.onDistractionCallback = null;
  }

  startMonitoring(sessionId, onDistraction) {
    if (this.isMonitoring) return;

    this.sessionId = sessionId;
    this.onDistractionCallback = onDistraction;
    this.isMonitoring = true;
    this.distractionCount = 0;

    this.appStateSubscription = AppState.addEventListener('change', this.handleAppStateChange);
    console.log('App monitoring started');
  }

  stopMonitoring() {
    if (!this.isMonitoring) return;

    this.isMonitoring = false;
    this.sessionId = null;
    this.onDistractionCallback = null;

    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
      this.appStateSubscription = null;
    }

    console.log('App monitoring stopped');
    return this.distractionCount;
  }

  handleAppStateChange = (nextAppState) => {
    if (!this.isMonitoring) return;

    if (nextAppState === 'background' || nextAppState === 'inactive') {
      this.logDistraction('app_switch');
    }
  };

  logDistraction = async (type) => {
    this.distractionCount++;
    
    try {
      if (this.sessionId) {
        await saveDistraction(this.sessionId, type);
      }
      
      if (this.onDistractionCallback) {
        this.onDistractionCallback(type, this.distractionCount);
      }
      
      console.log(`Distraction logged: ${type} (Total: ${this.distractionCount})`);
    } catch (error) {
      console.error('Failed to log distraction:', error);
    }
  };

  getDistractionCount() {
    return this.distractionCount;
  }
}

export default new AppMonitorService();