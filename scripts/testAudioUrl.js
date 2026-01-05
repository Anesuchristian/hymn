// Test with a public sample audio URL to verify the player works
// Run with: node scripts/testAudioUrl.js

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

// Public sample audio URL (a short hymn-like audio for testing)
const testAudioUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

async function updateAudioUrl() {
    console.log('🧪 Testing with sample audio URL...\n');

    try {
        const audioRef = ref(database, `audios/${audioId}`);
        
        await update(audioRef, {
            downloadUrl: testAudioUrl,
            updatedAt: Date.now(),
        });

        console.log('✅ Updated with test URL!');
        console.log(`📎 URL: ${testAudioUrl}`);
        console.log('\n🔄 Now restart your app and try playing Hymn 4');
        console.log('   If it plays, the player works and we need to fix storage.');

    } catch (error) {
        console.error('❌ Error:', error.message);
    }

    process.exit(0);
}

updateAudioUrl();
