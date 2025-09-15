import { registerRootComponent } from 'expo';
import { Platform } from 'react-native';
import App from './App';

// Fix for web platform
if (Platform.OS === 'web') {
  const rootTag = document.getElementById('root') || document.getElementById('main');
  if (rootTag) {
    registerRootComponent(App);
  }
} else {
  registerRootComponent(App);
}