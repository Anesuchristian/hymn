import { StyleSheet, FlatList, TouchableOpacity, Text, View, ScrollView } from 'react-native';
import { Link, Stack, useRouter } from 'expo-router';
import { useState, useCallback } from 'react';
import { hymnsData } from '../../constants/hymnsData';
import Colors from '../../constants/Colors';
import { Search, Heart, Music, CircleDot, Wine } from 'lucide-react-native';
import { toggleFavorite, getFavorites } from '../../utils/favorites';
import { useFocusEffect } from 'expo-router';

const CATEGORIES = [
    { id: 'favorites', name: 'Favorites', Icon: Heart, color: '#F44336', bgColor: '#FFEBEE' },
    { id: 'hymns', name: 'Hymns', Icon: Music, color: '#2196F3', bgColor: '#E3F2FD' },
    { id: 'chorus', name: 'Chorus', Icon: CircleDot, color: '#FF9800', bgColor: '#FFF3E0' },
    { id: 'holyCommunion', name: 'Communion', Icon: Wine, color: '#9C27B0', bgColor: '#F3E5F5' },
];

export default function HymnList() {
    const router = useRouter();
    const [favorites, setFavorites] = useState([]);
    const [activeCategory, setActiveCategory] = useState('hymns');

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

    // Filter hymns based on active category
    const filteredHymns = activeCategory === 'favorites'
        ? hymnsData.filter(hymn => favorites.includes(hymn.id.toString()))
        : hymnsData;

    const renderHymnItem = ({ item }) => {
        const isFav = favorites.includes(item.id.toString());
        return (
            <Link href={`/hymns/${item.id}`} asChild>
                <TouchableOpacity style={styles.item}>
                    <View style={styles.numberContainer}>
                        <Text style={styles.number}>{item.id}</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.title} numberOfLines={1}>{item.title.toUpperCase()}</Text>
                        <Text style={styles.subtitle}>{item.subtitle || 'Hymn'}</Text>
                    </View>
                    <TouchableOpacity 
                        style={styles.heartButton}
                        onPress={(e) => {
                            e.preventDefault();
                            handleToggleFavorite(item.id.toString());
                        }}
                    >
                        <Heart
                            size={22}
                            color={isFav ? '#E53935' : '#999'}
                            fill={isFav ? '#E53935' : 'none'}
                        />
                    </TouchableOpacity>
                </TouchableOpacity>
            </Link>
        );
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Custom Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Hymnal</Text>
            </View>

            <View style={styles.categoriesContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContent}>
                    {CATEGORIES.map((cat) => (
                        <View key={cat.id} style={styles.categoryWrapper}>
                            <TouchableOpacity 
                                style={[styles.categoryItem, activeCategory === cat.id && styles.activeCategoryItem]}
                                onPress={() => setActiveCategory(cat.id)}
                            >
                                <View style={[styles.categoryIcon, { backgroundColor: cat.bgColor }]}>
                                    <cat.Icon size={24} color={cat.color} fill={cat.id === 'favorites' ? cat.color : 'none'} />
                                </View>
                                <Text style={styles.categoryName}>{cat.name}</Text>
                            </TouchableOpacity>
                            {activeCategory === cat.id && <View style={styles.activeIndicator} />}
                        </View>
                    ))}
                </ScrollView>
            </View>

            <FlatList
                data={filteredHymns}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderHymnItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Heart size={48} color="#ccc" />
                        <Text style={styles.emptyText}>No favorites yet</Text>
                        <Text style={styles.emptySubtext}>Tap the heart icon on any hymn to add it to favorites</Text>
                    </View>
                }
            />

            <TouchableOpacity
                style={styles.fab}
                onPress={() => router.push('/search')}
            >
                <Search size={24} color="#fff" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.creamBackground,
    },
    header: {
        paddingTop: 50,
        paddingBottom: 16,
        alignItems: 'center',
        backgroundColor: Colors.light.creamBackground,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    categoriesContainer: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    categoriesContent: {
        paddingHorizontal: 16,
    },
    categoryWrapper: {
        alignItems: 'center',
        marginRight: 24,
    },
    categoryItem: {
        alignItems: 'center',
        padding: 4,
    },
    activeCategoryItem: {},
    categoryIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        overflow: 'hidden',
    },
    categoryName: {
        fontSize: 12,
        color: '#000',
    },
    activeIndicator: {
        height: 3,
        width: '100%',
        backgroundColor: Colors.light.redHighlight,
        marginTop: 4,
    },
    listContent: {
        paddingBottom: 80,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        marginHorizontal: 12,
        marginBottom: 8,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
    },
    numberContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: `${Colors.light.primary}15`,
        justifyContent: 'center',
        alignItems: 'center',
    },
    number: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.light.primary,
    },
    textContainer: {
        flex: 1,
        marginHorizontal: 14,
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 12,
        color: Colors.light.greenSubtitle,
    },
    heartButton: {
        padding: 8,
    },
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: Colors.light.redHighlight,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        paddingHorizontal: 24,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#666',
        marginTop: 16,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
        marginTop: 8,
    },
});
