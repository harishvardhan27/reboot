import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDemo-replace-with-your-key",
  authDomain: "cognitive-study.firebaseapp.com",
  projectId: "cognitive-study",
  storageBucket: "cognitive-study.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);