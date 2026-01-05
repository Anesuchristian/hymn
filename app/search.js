import { StyleSheet, FlatList, TouchableOpacity, Text, View, TextInput } from 'react-native';
import { Link, Stack, useRouter } from 'expo-router';
import { useState, useMemo } from 'react';
import { hymnsData } from '../constants/hymnsData';
import Colors from '../constants/Colors';
import { Search, ArrowLeft, Heart, X } from 'lucide-react-native';
import { isFavorite, toggleFavorite, getFavorites } from '../utils/favorites';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

export default function SearchScreen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [favorites, setFavorites] = useState([]);

    useFocusEffect(
        useCallback(() => {
            loadFavorites();
        }, [])
    );

    const loadFavorites = async () => {
        const favIds = await getFavorites();
        setFavorites(favIds);
    };

    const handleToggleFavorite = async (id) => {
        await toggleFavorite(id);
        loadFavorites();
    };

    const filteredHymns = useMemo(() => {
        if (!searchQuery) return [];
        const lowerQuery = searchQuery.toLowerCase();
        return hymnsData.filter((hymn) =>
            hymn.title.toLowerCase().includes(lowerQuery) ||
            hymn.id.toString().includes(lowerQuery) ||
            hymn.lyrics.toLowerCase().includes(lowerQuery)
        );
    }, [searchQuery]);

    const renderHymnItem = ({ item }) => {
        const isFav = favorites.includes(item.id.toString());
        return (
            <Link href={`/hymns/${item.id}`} asChild>
                <TouchableOpacity style={styles.item}>
                    <Text style={styles.number}>{item.id}</Text>
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>{item.title.toUpperCase()}</Text>
                        <Text style={styles.subtitle}>Hymn</Text>
                    </View>
                    <TouchableOpacity onPress={(e) => {
                        e.preventDefault();
                        handleToggleFavorite(item.id.toString());
                    }}>
                        <Heart
                            size={24}
                            color={isFav ? 'red' : '#000'}
                            fill={isFav ? 'red' : 'none'}
                        />
                    </TouchableOpacity>
                </TouchableOpacity>
            </Link>
        );
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color="#000" />
                </TouchableOpacity>
                <View style={styles.searchBar}>
                    <Search size={20} color="#666" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search by text or number"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoFocus
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <X size={20} color="#666" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <FlatList
                data={filteredHymns}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderHymnItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateTitle}>No results found</Text>
                        <Text style={styles.emptyStateSubtitle}>There are no hymns that you are looking for</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.creamBackground,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 50,
        paddingBottom: 16,
        paddingHorizontal: 16,
        backgroundColor: Colors.light.creamBackground,
    },
    backButton: {
        marginRight: 16,
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchIcon: {
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 18,
        color: '#000',
    },
    listContent: {
        paddingBottom: 24,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    number: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        width: 40,
    },
    textContainer: {
        flex: 1,
        marginHorizontal: 16,
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 12,
        color: Colors.light.greenSubtitle,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 200,
        paddingHorizontal: 32,
    },
    emptyStateTitle: {
        fontSize: 16,
        color: '#333',
        marginBottom: 8,
    },
    emptyStateSubtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        lineHeight: 20,
    },
});
