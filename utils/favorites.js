import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = 'favorites';

export const getFavorites = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem(FAVORITES_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
        console.error('Error reading favorites', e);
        return [];
    }
};

export const toggleFavorite = async (hymnId) => {
    try {
        const favorites = await getFavorites();
        let newFavorites;
        if (favorites.includes(hymnId)) {
            newFavorites = favorites.filter((id) => id !== hymnId);
        } else {
            newFavorites = [...favorites, hymnId];
        }
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
        return newFavorites;
    } catch (e) {
        console.error('Error toggling favorite', e);
        return [];
    }
};

export const isFavorite = async (hymnId) => {
    const favorites = await getFavorites();
    return favorites.includes(hymnId);
};
