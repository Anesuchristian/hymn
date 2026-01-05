// Audio Storage Service for Firebase Cloud Storage
// Handles audio file uploads and downloads

import { storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject, listAll } from 'firebase/storage';

// ============================================
// STORAGE STRUCTURE
// ============================================
// audios/
//   hymns/
//     hymn-1.mp3
//     hymn-2.mp3
//   commission/
//     part1/
//       chapter-1-en.mp3
//       chapter-1-sn.mp3
//     part2/
//       chapter-1-en.mp3
//   sermons/
//     sermon-2024-01-01.mp3

/**
 * Upload an audio file to Firebase Storage
 * @param {Blob|File} file - The audio file to upload
 * @param {string} path - The storage path (e.g., 'hymns/hymn-1.mp3')
 * @param {Function} onProgress - Optional progress callback
 * @returns {Promise<Object>} - Object containing storageUrl and downloadUrl
 */
export async function uploadAudio(file, path, onProgress = null) {
    try {
        const storageRef = ref(storage, `audios/${path}`);

        const metadata = {
            contentType: 'audio/mpeg',
            customMetadata: {
                uploadedAt: new Date().toISOString(),
            }
        };

        // Upload the file
        const snapshot = await uploadBytes(storageRef, file, metadata);

        // Get the download URL
        const downloadUrl = await getDownloadURL(snapshot.ref);

        return {
            storageUrl: `gs://${snapshot.ref.bucket}/${snapshot.ref.fullPath}`,
            downloadUrl,
            path: snapshot.ref.fullPath,
        };
    } catch (error) {
        console.error('Error uploading audio:', error);
        throw error;
    }
}

/**
 * Get the download URL for an audio file
 * @param {string} path - The storage path
 * @returns {Promise<string>} - The download URL
 */
export async function getAudioUrl(path) {
    try {
        const storageRef = ref(storage, `audios/${path}`);
        return await getDownloadURL(storageRef);
    } catch (error) {
        console.error('Error getting audio URL:', error);
        throw error;
    }
}

/**
 * Delete an audio file from storage
 * @param {string} path - The storage path
 * @returns {Promise<void>}
 */
export async function deleteAudioFile(path) {
    try {
        const storageRef = ref(storage, `audios/${path}`);
        await deleteObject(storageRef);
    } catch (error) {
        console.error('Error deleting audio file:', error);
        throw error;
    }
}

/**
 * List all audio files in a folder
 * @param {string} folder - The folder path (e.g., 'hymns')
 * @returns {Promise<Array>} - Array of file references
 */
export async function listAudioFiles(folder) {
    try {
        const folderRef = ref(storage, `audios/${folder}`);
        const result = await listAll(folderRef);

        const files = await Promise.all(
            result.items.map(async (itemRef) => ({
                name: itemRef.name,
                path: itemRef.fullPath,
                downloadUrl: await getDownloadURL(itemRef),
            }))
        );

        return files;
    } catch (error) {
        console.error('Error listing audio files:', error);
        throw error;
    }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Generate storage path for a hymn audio
 * @param {number} hymnNumber - The hymn number
 * @returns {string} - Storage path
 */
export function getHymnAudioPath(hymnNumber) {
    return `hymns/hymn-${hymnNumber}.mp3`;
}

/**
 * Generate storage path for a commission chapter audio
 * @param {string} bookId - Book ID (1 or 2)
 * @param {number} chapterNumber - Chapter number
 * @param {string} language - Language code (en or sn)
 * @returns {string} - Storage path
 */
export function getCommissionAudioPath(bookId, chapterNumber, language) {
    return `commission/part${bookId}/chapter-${chapterNumber}-${language}.mp3`;
}

/**
 * Generate storage path for a sermon audio
 * @param {string} date - Date string (YYYY-MM-DD)
 * @param {string} title - Sermon title (sanitized)
 * @returns {string} - Storage path
 */
export function getSermonAudioPath(date, title) {
    const sanitizedTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '-');
    return `sermons/${date}-${sanitizedTitle}.mp3`;
}
