import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import StudySetupScreen from './src/screens/StudySetupScreen';
import StudySessionScreen from './src/screens/StudySessionScreen';
import BreakScreen from './src/screens/BreakScreen';
import MemoryGameScreen from './src/screens/MemoryGameScreen';
import MathPuzzleScreen from './src/screens/MathPuzzleScreen';
import ColorMatchScreen from './src/screens/ColorMatchScreen';
import { initDatabase } from './src/utils/database';

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    initDatabase();
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="StudySetup" 
          component={StudySetupScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="StudySession" 
          component={StudySessionScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Break" 
          component={BreakScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="MemoryGame" 
          component={MemoryGameScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="MathPuzzle" 
          component={MathPuzzleScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="ColorMatch" 
          component={ColorMatchScreen} 
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}