// Script to update audio download URL in Firebase Database
// Run with: node scripts/updateAudioUrl.js

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

// The audio entry ID we created earlier
const audioId = '-OiEVsL0NdqCCf3NZbW1';

// Google Drive direct download URL
const googleDriveFileId = '1jcRGP5PE5oMag4EctwM7OtuIrPf9cXBX';
const downloadUrl = `https://drive.google.com/uc?export=download&id=${googleDriveFileId}`;

async function updateAudioUrl() {
    console.log('🎵 Updating Hymn 4 Audio URL...\n');

    try {
        const audioRef = ref(database, `audios/${audioId}`);
        
        await update(audioRef, {
            downloadUrl: downloadUrl,
            storageProvider: 'google-drive',
            googleDriveFileId: googleDriveFileId,
            updatedAt: Date.now(),
        });

        console.log('✅ Database updated successfully!');
        console.log(`📎 Download URL: ${downloadUrl}`);
        console.log(`🆔 Audio ID: ${audioId}`);
        console.log('\n🎉 Hymn 4 is now ready to play in the app!');

    } catch (error) {
        console.error('❌ Error updating URL:', error.message);
    }

    process.exit(0);
}

updateAudioUrl();
