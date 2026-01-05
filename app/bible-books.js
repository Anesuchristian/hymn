import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    TextInput,
    ActivityIndicator,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { ArrowLeft, Search, Book, ChevronRight } from 'lucide-react-native';
import Colors from '../constants/Colors';
import { StatusBar } from 'expo-status-bar';

// Import the Bible data
import bibleData from './bible/shona-bible-complete-positioned.json';

export default function BibleBooksScreen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTestament, setActiveTestament] = useState('all');
    const [loading, setLoading] = useState(true);
    const [books, setBooks] = useState([]);

    useEffect(() => {
        // Load books from Bible data
        if (bibleData && bibleData.books) {
            setBooks(bibleData.books);
        }
        setLoading(false);
    }, []);

    const filteredBooks = books.filter(book => {
        const matchesSearch = book.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTestament = activeTestament === 'all' ||
            (activeTestament === 'OT' && book.testament === 'OT') ||
            (activeTestament === 'NT' && book.testament === 'NT');
        return matchesSearch && matchesTestament;
    });

    const otBooks = filteredBooks.filter(b => b.testament === 'OT');
    const ntBooks = filteredBooks.filter(b => b.testament === 'NT');

    const handleBookPress = (book) => {
        router.push({
            pathname: '/bible-chapters',
            params: {
                bookCode: book.code,
                bookName: book.name,
                chapterCount: book.chapterCount
            },
        });
    };

    const renderBookItem = (book, index) => (
        <TouchableOpacity
            key={book.code}
            style={styles.bookItem}
            onPress={() => handleBookPress(book)}
            activeOpacity={0.7}
        >
            <View style={styles.bookIconContainer}>
                <Book size={20} color="#8B4513" />
            </View>
            <View style={styles.bookInfo}>
                <Text style={styles.bookName}>{book.name}</Text>
                <Text style={styles.bookMeta}>
                    {book.chapterCount} {book.chapterCount === 1 ? 'chitsauko' : 'zvitsauko'}
                </Text>
            </View>
            <ChevronRight size={20} color="#C0A080" />
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#8B4513" />
                    <Text style={styles.loadingText}>Loading Bible...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="dark" backgroundColor={Colors.light.creamBackground} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color="#000" />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle}>Bhaibheri Dzvene</Text>
                    <Text style={styles.headerSubtitle}>Shona Union Bible 1949</Text>
                </View>
                <View style={styles.headerRight} />
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <View style={styles.searchInputContainer}>
                    <Search size={18} color="#888" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Tsvaka bhuku..."
                        placeholderTextColor="#999"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            {/* Testament Tabs */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTestament === 'all' && styles.activeTab]}
                    onPress={() => setActiveTestament('all')}
                >
                    <Text style={[styles.tabText, activeTestament === 'all' && styles.activeTabText]}>
                        Ose ({books.length})
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTestament === 'OT' && styles.activeTab]}
                    onPress={() => setActiveTestament('OT')}
                >
                    <Text style={[styles.tabText, activeTestament === 'OT' && styles.activeTabText]}>
                        Testamente Yekare ({books.filter(b => b.testament === 'OT').length})
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTestament === 'NT' && styles.activeTab]}
                    onPress={() => setActiveTestament('NT')}
                >
                    <Text style={[styles.tabText, activeTestament === 'NT' && styles.activeTabText]}>
                        Testamente Itsva ({books.filter(b => b.testament === 'NT').length})
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Books List */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {activeTestament === 'all' ? (
                    <>
                        {/* Old Testament Section */}
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Testamente Yekare</Text>
                            <Text style={styles.sectionCount}>{otBooks.length} mabhuku</Text>
                        </View>
                        {otBooks.map(renderBookItem)}

                        {/* New Testament Section */}
                        <View style={[styles.sectionHeader, { marginTop: 24 }]}>
                            <Text style={styles.sectionTitle}>Testamente Itsva</Text>
                            <Text style={styles.sectionCount}>{ntBooks.length} mabhuku</Text>
                        </View>
                        {ntBooks.map(renderBookItem)}
                    </>
                ) : (
                    filteredBooks.map(renderBookItem)
                )}

                {filteredBooks.length === 0 && (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Hapana bhuku rawanikwa</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.creamBackground,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 50,
        paddingBottom: 16,
        paddingHorizontal: 16,
        backgroundColor: Colors.light.creamBackground,
        borderBottomWidth: 1,
        borderBottomColor: '#E8E0D5',
    },
    backButton: {
        padding: 8,
    },
    headerCenter: {
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
    },
    headerSubtitle: {
        fontSize: 12,
        color: '#888',
        marginTop: 2,
    },
    headerRight: {
        width: 40,
    },
    searchContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: Colors.light.creamBackground,
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: '#E8E0D5',
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: '#333',
        marginLeft: 10,
    },
    tabContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginBottom: 8,
    },
    tab: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginRight: 8,
        borderRadius: 20,
        backgroundColor: '#F5F0EB',
    },
    activeTab: {
        backgroundColor: '#8B4513',
    },
    tabText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#888',
    },
    activeTabText: {
        color: '#FFF',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 100,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#E8E0D5',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#8B4513',
    },
    sectionCount: {
        fontSize: 13,
        color: '#888',
    },
    bookItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 14,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#E8E0D5',
    },
    bookIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#FFF8F0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bookInfo: {
        flex: 1,
        marginLeft: 12,
    },
    bookName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    bookMeta: {
        fontSize: 13,
        color: '#888',
        marginTop: 2,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 16,
        color: '#888',
    },
});
