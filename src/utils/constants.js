// App Constants
export const APP_NAME = 'Cognitive Study Monitor';
export const VERSION = '1.0.0';

// Timer Constants
export const DEFAULT_STUDY_DURATION = 25; // minutes
export const DEFAULT_BREAK_DURATION = 5; // minutes
export const MIN_STUDY_DURATION = 5; // minutes
export const MAX_STUDY_DURATION = 120; // minutes

// Focus Detection Constants
export const FOCUS_UPDATE_INTERVAL = 3000; // milliseconds
export const MIN_FOCUS_SCORE = 0;
export const MAX_FOCUS_SCORE = 100;

// Database Constants
export const MAX_SESSION_HISTORY = 100;
export const SESSION_CLEANUP_DAYS = 30;

// UI Constants
export const COLORS = {
  primary: '#007AFF',
  success: '#28a745',
  danger: '#dc3545',
  warning: '#ffc107',
  info: '#17a2b8',
  light: '#f8f9fa',
  dark: '#343a40',
  background: '#f5f5f5',
  text: '#333333',
  textSecondary: '#666666',
};

// Error Messages
export const ERROR_MESSAGES = {
  CAMERA_PERMISSION: 'Camera permission is required for focus monitoring',
  DATABASE_ERROR: 'Failed to save data. Please try again.',
  NETWORK_ERROR: 'Network connection required',
  INVALID_INPUT: 'Please check your input and try again',
  SESSION_SAVE_ERROR: 'Failed to save session data',
  ANALYTICS_LOAD_ERROR: 'Unable to load analytics data',
};