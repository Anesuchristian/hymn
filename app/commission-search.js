import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    Keyboard,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Search, ArrowLeft, X, BookOpen, FileText } from 'lucide-react-native';
import Colors from '../constants/Colors';
import { commissionChapters } from '../constants/commissionChapters';
import { commissionChaptersPart2 } from '../constants/commissionChaptersPart2';
import { StatusBar } from 'expo-status-bar';

export default function CommissionSearch() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchLanguage, setSearchLanguage] = useState('en'); // 'en' or 'sn'

    // Function to highlight matching text
    const highlightText = (text, query) => {
        if (!query.trim()) return text;

        const parts = text.split(new RegExp(`(${query})`, 'gi'));
        return parts.map((part, index) =>
            part.toLowerCase() === query.toLowerCase() ? (
                <Text key={index} style={styles.highlightedText}>{part}</Text>
            ) : (
                <Text key={index}>{part}</Text>
            )
        );
    };

    // Search results
    const searchResults = useMemo(() => {
        if (!searchQuery.trim() || searchQuery.length < 2) return [];

        const results = [];
        const query = searchQuery.toLowerCase();

        const books = [
            { id: '1', data: commissionChapters, name: 'Part 1' },
            { id: '2', data: commissionChaptersPart2, name: 'Part 2' }
        ];

        books.forEach(book => {
            Object.keys(book.data).forEach((chapterNum) => {
                const chapterData = book.data[chapterNum][searchLanguage];
                if (!chapterData) return;

                const contextSuffix = ` (${book.name})`;

                // Search in title
                if (chapterData.title && chapterData.title.toLowerCase().includes(query)) {
                    results.push({
                        chapterNum: parseInt(chapterNum),
                        bookId: book.id,
                        type: 'title',
                        text: chapterData.title,
                        context: (chapterData.subtitle || '') + contextSuffix,
                    });
                }

                // Search in subtitle
                if (chapterData.subtitle && chapterData.subtitle.toLowerCase().includes(query)) {
                    results.push({
                        chapterNum: parseInt(chapterNum),
                        bookId: book.id,
                        type: 'subtitle',
                        text: chapterData.subtitle,
                        context: (chapterData.title || '') + contextSuffix,
                    });
                }

                // Search in content paragraphs
                if (chapterData.content) {
                    chapterData.content.forEach((paragraph, index) => {
                        if (typeof paragraph === 'string' && paragraph.toLowerCase().includes(query)) {
                            // Get a snippet around the match
                            const matchIndex = paragraph.toLowerCase().indexOf(query);
                            const start = Math.max(0, matchIndex - 50);
                            const end = Math.min(paragraph.length, matchIndex + query.length + 100);
                            let snippet = paragraph.substring(start, end);

                            if (start > 0) snippet = '...' + snippet;
                            if (end < paragraph.length) snippet = snippet + '...';

                            results.push({
                                chapterNum: parseInt(chapterNum),
                                bookId: book.id,
                                type: 'content',
                                paragraphIndex: index,
                                text: snippet,
                                context: (chapterData.title || `Chapter ${chapterNum}`) + contextSuffix,
                            });
                        }
                    });
                }

                // Search in footnote
                if (chapterData.footnote && chapterData.footnote.toLowerCase().includes(query)) {
                    results.push({
                        chapterNum: parseInt(chapterNum),
                        bookId: book.id,
                        type: 'footnote',
                        text: chapterData.footnote.substring(0, 150) + '...',
                        context: (chapterData.title || `Chapter ${chapterNum}`) + contextSuffix,
                    });
                }
            });
        });

        return results;
    }, [searchQuery, searchLanguage]);

    const handleResultPress = (result) => {
        Keyboard.dismiss();
        router.push({
            pathname: '/CommissionChapterScreen',
            params: {
                chapterNumber: result.chapterNum,
                initialLanguage: searchLanguage,
                bookId: result.bookId,
            },
        });
    };

    const clearSearch = () => {
        setSearchQuery('');
    };

    const renderResultItem = ({ item, index }) => (
        <TouchableOpacity
            style={styles.resultItem}
            onPress={() => handleResultPress(item)}
            activeOpacity={0.7}
        >
            <View style={styles.resultIconContainer}>
                {item.type === 'content' ? (
                    <FileText size={20} color="#8B4513" />
                ) : (
                    <BookOpen size={20} color="#8B4513" />
                )}
            </View>
            <View style={styles.resultContent}>
                <View style={styles.resultHeader}>
                    <Text style={styles.resultChapter}>
                        {searchLanguage === 'en' ? 'Chapter' : 'Chitsauko'} {item.chapterNum}
                    </Text>
                    <View style={[
                        styles.typeBadge,
                        item.type === 'title' && styles.titleBadge,
                        item.type === 'subtitle' && styles.subtitleBadge,
                        item.type === 'content' && styles.contentBadge,
                        item.type === 'footnote' && styles.footnoteBadge,
                    ]}>
                        <Text style={styles.typeBadgeText}>
                            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                        </Text>
                    </View>
                </View>
                <Text style={styles.resultText} numberOfLines={3}>
                    {highlightText(item.text, searchQuery)}
                </Text>
                {item.context && (
                    <Text style={styles.resultContext} numberOfLines={1}>
                        {item.context}
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="dark" backgroundColor={Colors.light.creamBackground} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>
                    {searchLanguage === 'en' ? 'Search Chapters' : 'Tsvaka Zvitsauko'}
                </Text>
                <View style={styles.placeholder} />
            </View>

            {/* Language Toggle */}
            <View style={styles.languageToggleContainer}>
                <TouchableOpacity
                    style={[styles.langOption, searchLanguage === 'en' && styles.activeLangOption]}
                    onPress={() => setSearchLanguage('en')}
                >
                    <Text style={[styles.langText, searchLanguage === 'en' && styles.activeLangText]}>
                        English
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.langOption, searchLanguage === 'sn' && styles.activeLangOption]}
                    onPress={() => setSearchLanguage('sn')}
                >
                    <Text style={[styles.langText, searchLanguage === 'sn' && styles.activeLangText]}>
                        Shona
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Search Input */}
            <View style={styles.searchContainer}>
                <Search size={20} color="#888" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder={searchLanguage === 'en' ? "Search chapters..." : "Tsvaka..."}
                    placeholderTextColor="#999"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoFocus={true}
                    returnKeyType="search"
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                        <X size={18} color="#888" />
                    </TouchableOpacity>
                )}
            </View>

            {/* Results Count */}
            {searchQuery.length >= 2 && (
                <View style={styles.resultsHeader}>
                    <Text style={styles.resultsCount}>
                        {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} found
                    </Text>
                </View>
            )}

            {/* Results List */}
            <FlatList
                data={searchResults}
                keyExtractor={(item, index) => `${item.chapterNum}-${item.type}-${index}`}
                renderItem={renderResultItem}
                contentContainerStyle={styles.listContent}
                keyboardShouldPersistTaps="handled"
                ListEmptyComponent={
                    searchQuery.length >= 2 ? (
                        <View style={styles.emptyContainer}>
                            <Search size={48} color="#ccc" />
                            <Text style={styles.emptyText}>No results found</Text>
                            <Text style={styles.emptySubtext}>
                                Try different keywords or switch language
                            </Text>
                        </View>
                    ) : searchQuery.length > 0 ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptySubtext}>
                                Type at least 2 characters to search
                            </Text>
                        </View>
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Search size={48} color="#ddd" />
                            <Text style={styles.emptyText}>Search Divine Commission</Text>
                            <Text style={styles.emptySubtext}>
                                Search through chapter titles, subtitles, and content
                            </Text>
                        </View>
                    )
                }
            />
        </SafeAreaView>
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
        justifyContent: 'space-between',
        paddingTop: 50,
        paddingBottom: 12,
        paddingHorizontal: 16,
        backgroundColor: Colors.light.creamBackground,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
    },
    placeholder: {
        width: 40,
    },
    languageToggleContainer: {
        flexDirection: 'row',
        marginHorizontal: 16,
        marginBottom: 12,
        backgroundColor: '#E8E0D5',
        borderRadius: 25,
        padding: 3,
    },
    langOption: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 22,
    },
    activeLangOption: {
        backgroundColor: '#8B4513',
    },
    langText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#888',
    },
    activeLangText: {
        color: '#FFF',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        marginHorizontal: 16,
        marginBottom: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        height: 50,
        borderWidth: 1,
        borderColor: '#E0D5C5',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    searchIcon: {
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        height: '100%',
    },
    clearButton: {
        padding: 8,
    },
    resultsHeader: {
        paddingHorizontal: 20,
        paddingVertical: 8,
    },
    resultsCount: {
        fontSize: 13,
        color: '#888',
        fontWeight: '500',
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    resultItem: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#E8E0D5',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
    },
    resultIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFF5EB',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    resultContent: {
        flex: 1,
    },
    resultHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    resultChapter: {
        fontSize: 14,
        fontWeight: '700',
        color: '#8B4513',
    },
    typeBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        backgroundColor: '#E8E0D5',
    },
    titleBadge: {
        backgroundColor: '#E3F2FD',
    },
    subtitleBadge: {
        backgroundColor: '#FFF3E0',
    },
    contentBadge: {
        backgroundColor: '#E8F5E9',
    },
    footnoteBadge: {
        backgroundColor: '#FCE4EC',
    },
    typeBadgeText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#666',
        textTransform: 'uppercase',
    },
    resultText: {
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
        marginBottom: 4,
    },
    highlightedText: {
        backgroundColor: '#FFEB3B',
        fontWeight: '600',
    },
    resultContext: {
        fontSize: 12,
        color: '#888',
        fontStyle: 'italic',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
        paddingHorizontal: 40,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#666',
        marginTop: 16,
        textAlign: 'center',
    },
    emptySubtext: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
        marginTop: 8,
        lineHeight: 20,
    },
});
