// Update audio URL with GitHub raw link
// Run with: node scripts/updateGitHubUrl.js

const { initializeApp } = require('firebase/app');
const { getDatabase, ref, update } = require('firebase/database');

const firebaseConfig = {
    apiKey: "AIzaSyAciF5j6q8rTuxxjmSMxX-Yi0OOVxP45P0",
    authDomain: "divine-library-app.firebaseapp.com",
    databaseURL: "https://divine-library-app-default-rtdb.firebaseio.com",
    projectId: "divine-library-app",
    storageBucket: "divine-library-app.firebasestorage.app",
    messagingSenderId: "546681200258",
    appId: "1:546681200258:web:218f2f5675ee87deb45e9b"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const audioId = '-OiEVsL0NdqCCf3NZbW1';

// GitHub raw URL for the audio file
const githubRawUrl = 'https://raw.githubusercontent.com/Anesuchristian/devine-library-audios/main/hymn-4.m4a';

async function updateAudioUrl() {
    console.log('🎵 Updating Hymn 4 with GitHub URL...\n');

    try {
        const audioRef = ref(database, `audios/${audioId}`);
        
        await update(audioRef, {
            downloadUrl: githubRawUrl,
            storageProvider: 'github',
            updatedAt: Date.now(),
        });

        console.log('✅ Database updated!');
        console.log(`📎 URL: ${githubRawUrl}`);
        console.log('\n🎉 Hymn 4 is ready! Reload your app and test it.');

    } catch (error) {
        console.error('❌ Error:', error.message);
    }

    process.exit(0);
}

updateAudioUrl();
