// Script to add audio metadata to Firebase Database
// This allows you to manually upload the audio file via Firebase Console
// Run with: node scripts/addAudioMetadata.js

const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set, push } = require('firebase/database');

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

// Audio metadata to add (update downloadUrl after uploading to Firebase Console)
const hymnsMetadata = [
    {
        hymnNumber: 4,
        title: 'God is Our Sun',
        titleSn: 'Mwari Uri Zuva Redu',
        language: 'sn',
        narrator: 'AAC Choir',
        duration: 180, // estimated in seconds
        // Replace this URL after uploading the file to Firebase Storage
        downloadUrl: 'REPLACE_WITH_FIREBASE_STORAGE_URL',
        storagePath: 'audios/hymns/hymn-4-sn.m4a',
    },
];

async function addAudioMetadata(hymnData) {
    const { hymnNumber, title, titleSn, language, narrator, duration, downloadUrl, storagePath } = hymnData;

    console.log(`\n📝 Adding metadata for Hymn ${hymnNumber}: ${titleSn || title}...`);

    try {
        const audiosRef = ref(database, 'audios');
        const newAudioRef = push(audiosRef);

        const audioMetadata = {
            id: newAudioRef.key,
            title: title,
            titleSn: titleSn,
            category: 'hymn',
            hymnNumber: hymnNumber,
            duration: duration,
            storagePath: storagePath,
            storageUrl: `gs://divine-library-app.firebasestorage.app/${storagePath}`,
            downloadUrl: downloadUrl,
            narrator: narrator,
            language: language,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            playCount: 0,
            isActive: true,
        };

        await set(newAudioRef, audioMetadata);
        console.log(`   ✅ Metadata saved with ID: ${newAudioRef.key}`);
        console.log(`   📁 Storage path: ${storagePath}`);
        console.log(`\n   ⚠️  Remember to:`);
        console.log(`   1. Go to Firebase Console > Storage`);
        console.log(`   2. Create folder: audios/hymns/`);
        console.log(`   3. Upload: Aac Hymn 4 - Mwari Uri Zuva Redu (Shona).m4a`);
        console.log(`   4. Rename to: hymn-4-sn.m4a`);
        console.log(`   5. Copy the download URL and update the database entry`);

        return { success: true, audioId: newAudioRef.key };

    } catch (error) {
        console.error(`   ❌ Error:`, error.message);
        return { success: false, error: error.message };
    }
}

async function main() {
    console.log('🎵 Divine Library - Audio Metadata Adder');
    console.log('=========================================\n');

    for (const hymn of hymnsMetadata) {
        await addAudioMetadata(hymn);
    }

    console.log('\n🎉 Done!\n');
    process.exit(0);
}

main();
