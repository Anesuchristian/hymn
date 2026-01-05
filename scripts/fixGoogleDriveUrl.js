// Script to update audio with working Google Drive URL format
// Run with: node scripts/fixGoogleDriveUrl.js

const { initializeApp } = require('firebase/app');
const { getDatabase, ref, update } = require('firebase/database');

// Firebase configuration
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
const database = getDatabase(app);

// The audio entry ID
const audioId = '-OiEVsL0NdqCCf3NZbW1';

// Google Drive File ID
const googleDriveFileId = '1jcRGP5PE5oMag4EctwM7OtuIrPf9cXBX';

// Working format for public Google Drive files - uses lh3.googleusercontent.com redirect
const downloadUrl = `https://drive.usercontent.google.com/download?id=${googleDriveFileId}&export=download`;

async function updateAudioUrl() {
    console.log('🎵 Updating Hymn 4 with new Google Drive URL format...\n');

    try {
        const audioRef = ref(database, `audios/${audioId}`);
        
        await update(audioRef, {
            downloadUrl: downloadUrl,
            updatedAt: Date.now(),
        });

        console.log('✅ Database updated!');
        console.log(`📎 New URL: ${downloadUrl}`);

    } catch (error) {
        console.error('❌ Error:', error.message);
    }

    process.exit(0);
}

updateAudioUrl();
