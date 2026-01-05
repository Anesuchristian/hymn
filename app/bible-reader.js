import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    Animated,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { ArrowLeft, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react-native';
import Colors from '../constants/Colors';
import { StatusBar } from 'expo-status-bar';

// Import the Bible data
import bibleData from './bible/shona-bible-complete-positioned.json';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function BibleReaderScreen() {
    const router = useRouter();
    const { bookCode, bookName, chapter } = useLocalSearchParams();
    const [scrollProgress, setScrollProgress] = useState(0);
    const [loading, setLoading] = useState(true);
    const [chapterData, setChapterData] = useState(null);
    const [bookData, setBookData] = useState(null);
    const scrollViewRef = useRef(null);
    const progressAnim = useRef(new Animated.Value(0)).current;

    const currentChapter = parseInt(chapter);

    useEffect(() => {
        loadChapterData();
    }, [bookCode, chapter]);

    const loadChapterData = () => {
        setLoading(true);
        try {
            const book = bibleData.books.find(b => b.code === bookCode);
            if (book && book.chapters && book.chapters[chapter]) {
                setBookData(book);
                setChapterData(book.chapters[chapter]);
            }
        } catch (error) {
            console.error('Error loading chapter:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        Animated.timing(progressAnim, {
            toValue: scrollProgress,
            duration: 150,
            useNativeDriver: false,
        }).start();
    }, [scrollProgress]);

    const handleScroll = useCallback((event) => {
        const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
        const scrollableHeight = contentSize.height - layoutMeasurement.height;
        if (scrollableHeight > 0) {
            const progress = Math.min(1, Math.max(0, contentOffset.y / scrollableHeight));
            setScrollProgress(progress);
        }
    }, []);

    const navigateToChapter = (newChapter) => {
        if (bookData && newChapter >= 1 && newChapter <= bookData.chapterCount) {
            router.replace({
                pathname: '/bible-reader',
                params: { bookCode, bookName, chapter: newChapter },
            });
        }
    };

    // Parse verses from chapter data
    const verses = useMemo(() => {
        if (!chapterData || !chapterData.verses) return [];

        const versesArray = [];
        const verseNumbers = Object.keys(chapterData.verses).sort((a, b) => parseInt(a) - parseInt(b));

        for (const verseNum of verseNumbers) {
            const verseData = chapterData.verses[verseNum];
            let heading = null;
            let text = '';

            if (typeof verseData === 'object' && verseData.text) {
                heading = verseData.heading || null;
                text = verseData.text;
            } else {
                text = verseData;
            }

            versesArray.push({
                number: parseInt(verseNum),
                heading,
                text,
            });
        }

        return versesArray;
    }, [chapterData]);

    const progressWidth = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <Stack.Screen options={{ headerShown: false }} />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#8B4513" />
                    <Text style={styles.loadingText}>Kuverenga...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!chapterData) {
        return (
            <SafeAreaView style={styles.container}>
                <Stack.Screen options={{ headerShown: false }} />
                <StatusBar style="dark" backgroundColor={Colors.light.creamBackground} />
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <ArrowLeft size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{bookName} {chapter}</Text>
                    <View style={styles.placeholder} />
                </View>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Chitsauko hachina kuwanikwa</Text>
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
                    <Text style={styles.headerTitle}>{bookName}</Text>
                    <Text style={styles.headerSubtitle}>Chitsauko {chapter}</Text>
                </View>
                <TouchableOpacity
                    onPress={() => router.push({
                        pathname: '/bible-chapters',
                        params: { bookCode, bookName, chapterCount: bookData?.chapterCount }
                    })}
                    style={styles.chaptersButton}
                >
                    <BookOpen size={20} color="#8B4513" />
                </TouchableOpacity>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
                <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
            </View>

            {/* Content */}
            <ScrollView
                ref={scrollViewRef}
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
            >
                {/* Chapter Title */}
                <View style={styles.chapterHeader}>
                    <Text style={styles.chapterLabel}>{bookName}</Text>
                    <Text style={styles.chapterNumber}>Chitsauko {chapter}</Text>
                </View>

                {/* Verses */}
                <View style={styles.versesContainer}>
                    {verses.map((verse, index) => (
                        <View key={verse.number}>
                            {/* Section Heading */}
                            {verse.heading && (
                                <Text style={styles.sectionHeading}>{verse.heading}</Text>
                            )}
                            {/* Verse */}
                            <Text style={styles.verseText}>
                                <Text style={styles.verseNumber}>{verse.number} </Text>
                                {verse.text}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Chapter Navigation */}
                <View style={styles.chapterNavigation}>
                    <TouchableOpacity
                        style={[styles.navButton, currentChapter <= 1 && styles.navButtonDisabled]}
                        onPress={() => navigateToChapter(currentChapter - 1)}
                        disabled={currentChapter <= 1}
                    >
                        <ChevronLeft size={20} color={currentChapter <= 1 ? '#ccc' : '#8B4513'} />
                        <Text style={[styles.navButtonText, currentChapter <= 1 && styles.navButtonTextDisabled]}>
                            Chapera
                        </Text>
                    </TouchableOpacity>

                    <Text style={styles.chapterIndicator}>
                        {currentChapter} / {bookData?.chapterCount || '?'}
                    </Text>

                    <TouchableOpacity
                        style={[styles.navButton, currentChapter >= (bookData?.chapterCount || 1) && styles.navButtonDisabled]}
                        onPress={() => navigateToChapter(currentChapter + 1)}
                        disabled={currentChapter >= (bookData?.chapterCount || 1)}
                    >
                        <Text style={[styles.navButtonText, currentChapter >= (bookData?.chapterCount || 1) && styles.navButtonTextDisabled]}>
                            Chinotevera
                        </Text>
                        <ChevronRight size={20} color={currentChapter >= (bookData?.chapterCount || 1) ? '#ccc' : '#8B4513'} />
                    </TouchableOpacity>
                </View>
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
        paddingBottom: 12,
        paddingHorizontal: 16,
        backgroundColor: Colors.light.creamBackground,
    },
    backButton: {
        padding: 8,
    },
    headerCenter: {
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    headerSubtitle: {
        fontSize: 12,
        color: '#888',
        marginTop: 2,
    },
    placeholder: {
        width: 40,
    },
    chaptersButton: {
        padding: 8,
        backgroundColor: '#FFF8F0',
        borderRadius: 8,
    },
    progressContainer: {
        height: 3,
        backgroundColor: '#E8E0D5',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#8B4513',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100,
    },
    chapterHeader: {
        alignItems: 'center',
        marginBottom: 28,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E8E0D5',
    },
    chapterLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#8B4513',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    chapterNumber: {
        fontSize: 28,
        fontWeight: '700',
        color: '#333',
        marginTop: 6,
    },
    versesContainer: {
        marginBottom: 24,
    },
    sectionHeading: {
        fontSize: 16,
        fontWeight: '700',
        color: '#8B4513',
        marginTop: 20,
        marginBottom: 12,
        fontStyle: 'italic',
        textAlign: 'center',
    },
    verseText: {
        fontSize: 18,
        lineHeight: 30,
        color: '#333',
        marginBottom: 6,
        textAlign: 'justify',
    },
    verseNumber: {
        fontSize: 14,
        fontWeight: '700',
        color: '#8B4513',
    },
    chapterNavigation: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 32,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#E8E0D5',
    },
    navButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        backgroundColor: '#FFF',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E8E0D5',
    },
    navButtonDisabled: {
        backgroundColor: '#F5F5F5',
        borderColor: '#E0E0E0',
    },
    navButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#8B4513',
        marginHorizontal: 4,
    },
    navButtonTextDisabled: {
        color: '#ccc',
    },
    chapterIndicator: {
        fontSize: 14,
        fontWeight: '500',
        color: '#888',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    errorText: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
    },
});
