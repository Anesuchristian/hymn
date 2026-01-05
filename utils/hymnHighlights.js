import AsyncStorage from '@react-native-async-storage/async-storage';

const HYMN_HIGHLIGHTS_KEY = 'hymn_highlights';

// Get all highlights for a hymn
export const getHymnHighlights = async (hymnId) => {
    try {
        const jsonValue = await AsyncStorage.getItem(HYMN_HIGHLIGHTS_KEY);
        const allHighlights = jsonValue != null ? JSON.parse(jsonValue) : {};
        return allHighlights[hymnId] || [];
    } catch (e) {
        console.error('Error reading hymn highlights', e);
        return [];
    }
};

// Save highlighted text for a hymn
export const saveHymnHighlight = async (hymnId, highlightData) => {
    try {
        const jsonValue = await AsyncStorage.getItem(HYMN_HIGHLIGHTS_KEY);
        const allHighlights = jsonValue != null ? JSON.parse(jsonValue) : {};
        
        if (!allHighlights[hymnId]) {
            allHighlights[hymnId] = [];
        }
        
        // Check if same text is already highlighted
        const existingIndex = allHighlights[hymnId].findIndex(
            h => h.start === highlightData.start && h.end === highlightData.end
        );
        
        if (existingIndex >= 0) {
            // Remove if already exists
            allHighlights[hymnId].splice(existingIndex, 1);
        } else {
            // Add new highlight
            allHighlights[hymnId].push({
                ...highlightData,
                id: Date.now().toString(),
                color: highlightData.color || '#FFEB3B',
            });
        }
        
        await AsyncStorage.setItem(HYMN_HIGHLIGHTS_KEY, JSON.stringify(allHighlights));
        return allHighlights[hymnId];
    } catch (e) {
        console.error('Error saving hymn highlight', e);
        return [];
    }
};

// Clear all highlights for a hymn
export const clearHymnHighlights = async (hymnId) => {
    try {
        const jsonValue = await AsyncStorage.getItem(HYMN_HIGHLIGHTS_KEY);
        const allHighlights = jsonValue != null ? JSON.parse(jsonValue) : {};
        delete allHighlights[hymnId];
        await AsyncStorage.setItem(HYMN_HIGHLIGHTS_KEY, JSON.stringify(allHighlights));
        return [];
    } catch (e) {
        console.error('Error clearing hymn highlights', e);
        return [];
    }
};
