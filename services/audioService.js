// Audio Service for Firebase Realtime Database
// Handles audio metadata storage and retrieval

import { database } from '../config/firebase';
import { ref, set, get, push, update, remove, onValue, query, orderByChild, equalTo } from 'firebase/database';

// ============================================
// AUDIO DATABASE STRUCTURE
// ============================================
// audios/
//   {audioId}/
//     id: string
//     title: string
//     titleSn: string (Shona title)
//     category: string (hymn, sermon, commission, etc.)
//     bookId: string (optional - for commission chapters)
//     chapterNumber: number (optional)
//     hymnNumber: number (optional)
//     duration: number (seconds)
//     storageUrl: string (Firebase Storage URL)
//     downloadUrl: string (public download URL)
//     narrator: string
//     language: string (en, sn)
//     createdAt: timestamp
//     updatedAt: timestamp
//     playCount: number
//     isActive: boolean

// ============================================
// CRUD OPERATIONS
// ============================================

/**
 * Add a new audio entry to the database
 * @param {Object} audioData - Audio metadata
 * @returns {Promise<string>} - The new audio ID
 */
export async function addAudio(audioData) {
    try {
        const audiosRef = ref(database, 'audios');
        const newAudioRef = push(audiosRef);

        const audio = {
            id: newAudioRef.key,
            ...audioData,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            playCount: 0,
            isActive: true,
        };

        await set(newAudioRef, audio);
        return newAudioRef.key;
    } catch (error) {
        console.error('Error adding audio:', error);
        throw error;
    }
}

/**
 * Get a single audio by ID
 * @param {string} audioId - The audio ID
 * @returns {Promise<Object|null>} - Audio data or null
 */
export async function getAudio(audioId) {
    try {
        const audioRef = ref(database, `audios/${audioId}`);
        const snapshot = await get(audioRef);
        return snapshot.exists() ? snapshot.val() : null;
    } catch (error) {
        console.error('Error getting audio:', error);
        throw error;
    }
}

/**
 * Get all audios
 * @returns {Promise<Array>} - Array of audio objects
 */
export async function getAllAudios() {
    try {
        const audiosRef = ref(database, 'audios');
        const snapshot = await get(audiosRef);

        if (!snapshot.exists()) return [];

        const audios = [];
        snapshot.forEach((child) => {
            audios.push(child.val());
        });

        return audios;
    } catch (error) {
        console.error('Error getting all audios:', error);
        throw error;
    }
}

/**
 * Get audios by category
 * @param {string} category - Category to filter by (hymn, sermon, commission)
 * @returns {Promise<Array>} - Array of audio objects
 */
export async function getAudiosByCategory(category) {
    try {
        const audiosRef = ref(database, 'audios');
        const categoryQuery = query(audiosRef, orderByChild('category'), equalTo(category));
        const snapshot = await get(categoryQuery);

        if (!snapshot.exists()) return [];

        const audios = [];
        snapshot.forEach((child) => {
            audios.push(child.val());
        });

        return audios;
    } catch (error) {
        console.error('Error getting audios by category:', error);
        throw error;
    }
}

/**
 * Get audio for a specific hymn
 * @param {number} hymnNumber - The hymn number
 * @returns {Promise<Object|null>} - Audio data or null
 */
export async function getHymnAudio(hymnNumber) {
    try {
        const audiosRef = ref(database, 'audios');
        const hymnQuery = query(audiosRef, orderByChild('hymnNumber'), equalTo(hymnNumber));
        const snapshot = await get(hymnQuery);

        if (!snapshot.exists()) return null;

        let audio = null;
        snapshot.forEach((child) => {
            if (child.val().category === 'hymn') {
                audio = child.val();
            }
        });

        return audio;
    } catch (error) {
        console.error('Error getting hymn audio:', error);
        throw error;
    }
}

// Alias for getHymnAudio
export const getAudioByHymnNumber = getHymnAudio;

/**
 * Get audio for a specific commission chapter
 * @param {string} bookId - The book ID (1 or 2)
 * @param {number} chapterNumber - The chapter number
 * @param {string} language - Language code (en or sn)
 * @returns {Promise<Object|null>} - Audio data or null
 */
export async function getCommissionAudio(bookId, chapterNumber, language = 'en') {
    try {
        const audios = await getAudiosByCategory('commission');

        const matchingAudio = audios.find(audio =>
            audio.bookId === bookId &&
            audio.chapterNumber === chapterNumber &&
            audio.language === language
        );

        return matchingAudio || null;
    } catch (error) {
        console.error('Error getting commission audio:', error);
        throw error;
    }
}

/**
 * Update an audio entry
 * @param {string} audioId - The audio ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<void>}
 */
export async function updateAudio(audioId, updates) {
    try {
        const audioRef = ref(database, `audios/${audioId}`);
        await update(audioRef, {
            ...updates,
            updatedAt: Date.now(),
        });
    } catch (error) {
        console.error('Error updating audio:', error);
        throw error;
    }
}

/**
 * Increment play count for an audio
 * @param {string} audioId - The audio ID
 * @returns {Promise<void>}
 */
export async function incrementPlayCount(audioId) {
    try {
        const audio = await getAudio(audioId);
        if (audio) {
            await updateAudio(audioId, {
                playCount: (audio.playCount || 0) + 1,
            });
        }
    } catch (error) {
        console.error('Error incrementing play count:', error);
        throw error;
    }
}

/**
 * Delete an audio entry
 * @param {string} audioId - The audio ID
 * @returns {Promise<void>}
 */
export async function deleteAudio(audioId) {
    try {
        const audioRef = ref(database, `audios/${audioId}`);
        await remove(audioRef);
    } catch (error) {
        console.error('Error deleting audio:', error);
        throw error;
    }
}

/**
 * Subscribe to real-time audio updates
 * @param {Function} callback - Function to call with updated data
 * @returns {Function} - Unsubscribe function
 */
export function subscribeToAudios(callback) {
    const audiosRef = ref(database, 'audios');

    const unsubscribe = onValue(audiosRef, (snapshot) => {
        if (!snapshot.exists()) {
            callback([]);
            return;
        }

        const audios = [];
        snapshot.forEach((child) => {
            audios.push(child.val());
        });

        callback(audios);
    });

    return unsubscribe;
}

// ============================================
// DATABASE SCHEMA EXAMPLE
// ============================================
// Use this as a reference when adding data manually or via admin panel:
//
// {
//   "audios": {
//     "-NxABC123": {
//       "id": "-NxABC123",
//       "title": "Hymn 1 - Mwari Wedu",
//       "titleSn": "Nziyo 1 - Mwari Wedu",
//       "category": "hymn",
//       "hymnNumber": 1,
//       "duration": 180,
//       "storageUrl": "gs://your-project.appspot.com/audios/hymn-1.mp3",
//       "downloadUrl": "https://firebasestorage.googleapis.com/...",
//       "narrator": "Church Choir",
//       "language": "sn",
//       "createdAt": 1704456000000,
//       "updatedAt": 1704456000000,
//       "playCount": 0,
//       "isActive": true
//     },
//     "-NxDEF456": {
//       "id": "-NxDEF456",
//       "title": "Divine Commission Chapter 1",
//       "titleSn": "Chitsauko 1",
//       "category": "commission",
//       "bookId": "1",
//       "chapterNumber": 1,
//       "duration": 600,
//       "storageUrl": "gs://your-project.appspot.com/audios/commission-1-ch1-en.mp3",
//       "downloadUrl": "https://firebasestorage.googleapis.com/...",
//       "narrator": "Reader Name",
//       "language": "en",
//       "createdAt": 1704456000000,
//       "updatedAt": 1704456000000,
//       "playCount": 0,
//       "isActive": true
//     }
//   }
// }
