// Script to upload hymn audio files to Firebase Storage and Database
// Run with: node scripts/uploadHymnAudio.js

const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set, push } = require('firebase/database');
const { getStorage, ref: storageRef, uploadBytes, getDownloadURL } = require('firebase/storage');
const fs = require('fs');
const path = require('path');

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAciF5j6q8rTuxxjmSMxX-Yi0OOVxP45P0",
    authDomain: "divine-library-app.firebaseapp.com",
    databaseURL: "https://divine-library-app-default-rtdb.firebaseio.com",
    projectId: "divine-library-app",
    storageBucket: "divine-library-app.appspot.com",
    messagingSenderId: "546681200258",
    appId: "1:546681200258:web:218f2f5675ee87deb45e9b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const storage = getStorage(app);

// Audio files to upload
const hymnsToUpload = [
    {
        filePath: './audios/Aac Hymn 4 - Mwari Uri Zuva Redu (Shona).m4a',
        hymnNumber: 4,
        title: 'God is Our Sun',
        titleSn: 'Mwari Uri Zuva Redu',
        language: 'sn',
        narrator: 'AAC Choir',
        duration: 0, // Will be updated if known
    },
];

async function uploadHymnAudio(hymnData) {
    const { filePath, hymnNumber, title, titleSn, language, narrator, duration } = hymnData;

    console.log(`\n📤 Uploading Hymn ${hymnNumber}: ${titleSn || title}...`);

    try {
        // Read the audio file
        const absolutePath = path.resolve(__dirname, '..', filePath);
        console.log(`   Reading file: ${absolutePath}`);
        
        if (!fs.existsSync(absolutePath)) {
            throw new Error(`File not found: ${absolutePath}`);
        }

        const fileBuffer = fs.readFileSync(absolutePath);
        const fileName = path.basename(filePath);
        const fileExtension = path.extname(fileName).toLowerCase();
        
        // Determine content type
        const contentType = fileExtension === '.m4a' ? 'audio/mp4' : 
                           fileExtension === '.mp3' ? 'audio/mpeg' : 'audio/mpeg';

        // Create storage reference
        const storagePath = `audios/hymns/hymn-${hymnNumber}-${language}${fileExtension}`;
        const audioStorageRef = storageRef(storage, storagePath);

        console.log(`   Uploading to: ${storagePath}`);

        // Upload file
        const metadata = {
            contentType: contentType,
            customMetadata: {
                hymnNumber: String(hymnNumber),
                language: language,
                uploadedAt: new Date().toISOString(),
            }
        };

        const snapshot = await uploadBytes(audioStorageRef, fileBuffer, metadata).catch(err => {
            console.log('   ⚠️ Full error:', JSON.stringify(err, null, 2));
            throw err;
        });
        console.log(`   ✅ File uploaded successfully!`);

        // Get download URL
        const downloadUrl = await getDownloadURL(snapshot.ref);
        console.log(`   📎 Download URL: ${downloadUrl}`);

        // Save metadata to database
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
            storageUrl: `gs://${snapshot.ref.bucket}/${snapshot.ref.fullPath}`,
            downloadUrl: downloadUrl,
            narrator: narrator,
            language: language,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            playCount: 0,
            isActive: true,
        };

        await set(newAudioRef, audioMetadata);
        console.log(`   💾 Metadata saved to database with ID: ${newAudioRef.key}`);

        return { success: true, audioId: newAudioRef.key, downloadUrl };

    } catch (error) {
        console.error(`   ❌ Error uploading hymn ${hymnNumber}:`, error.message);
        return { success: false, error: error.message };
    }
}

async function main() {
    console.log('🎵 Divine Library - Hymn Audio Uploader');
    console.log('========================================\n');

    const results = [];

    for (const hymn of hymnsToUpload) {
        const result = await uploadHymnAudio(hymn);
        results.push({ hymnNumber: hymn.hymnNumber, ...result });
    }

    console.log('\n========================================');
    console.log('📊 Upload Summary:');
    console.log('========================================');
    
    results.forEach(r => {
        if (r.success) {
            console.log(`✅ Hymn ${r.hymnNumber}: Uploaded successfully`);
        } else {
            console.log(`❌ Hymn ${r.hymnNumber}: Failed - ${r.error}`);
        }
    });

    console.log('\n🎉 Done!\n');
    process.exit(0);
}

main();
