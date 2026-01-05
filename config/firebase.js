// Firebase configuration for Divine Library App
// Project: divine-library-app

import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAciF5j6q8rTuxxjmSMxX-Yi0OOVxP45P0",
    authDomain: "divine-library-app.firebaseapp.com",
    databaseURL: "https://divine-library-app-default-rtdb.firebaseio.com",
    projectId: "divine-library-app",
    storageBucket: "divine-library-app.firebasestorage.app",
    messagingSenderId: "546681200258",
    appId: "1:546681200258:web:218f2f5675ee87deb45e9b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database
export const database = getDatabase(app);

// Initialize Cloud Storage
export const storage = getStorage(app);

export default app;
