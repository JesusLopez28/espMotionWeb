import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAiiAAHwzkNESwxkLVlf2VTCE00r6xdRjk',
  authDomain: 'deteccion-emociones.firebaseapp.com',
  projectId: 'deteccion-emociones',
  storageBucket: 'deteccion-emociones.firebasestorage.app',
  messagingSenderId: '442731371319',
  appId: '1:442731371319:web:b44dc5d08fe6e2d60098b2',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
