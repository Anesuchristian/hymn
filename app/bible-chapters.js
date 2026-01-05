import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { ArrowLeft, BookOpen } from 'lucide-react-native';
import Colors from '../constants/Colors';
import { StatusBar } from 'expo-status-bar';

export default function BibleChaptersScreen() {
    const router = useRouter();
    const { bookCode, bookName, chapterCount } = useLocalSearchParams();

    const chapters = Array.from({ length: parseInt(chapterCount) }, (_, i) => i + 1);

    const handleChapterPress = (chapterNum) => {
        router.push({
            pathname: '/bible-reader',
            params: {
                bookCode,
                bookName,
                chapter: chapterNum
            },
        });
    };

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
                    <Text style={styles.headerSubtitle}>
                        {chapterCount} {parseInt(chapterCount) === 1 ? 'chitsauko' : 'zvitsauko'}
                    </Text>
                </View>
                <View style={styles.headerRight} />
            </View>

            {/* Book Icon Banner */}
            <View style={styles.bannerContainer}>
                <View style={styles.bannerIcon}>
                    <BookOpen size={32} color="#8B4513" />
                </View>
                <Text style={styles.bannerTitle}>{bookName}</Text>
                <Text style={styles.bannerSubtitle}>Sarudza chitsauko kuti uverenge</Text>
            </View>

            {/* Chapters Grid */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.chaptersGrid}>
                    {chapters.map((chapter) => (
                        <TouchableOpacity
                            key={chapter}
                            style={styles.chapterButton}
                            onPress={() => handleChapterPress(chapter)}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.chapterNumber}>{chapter}</Text>
                        </TouchableOpacity>
                    ))}
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
    bannerContainer: {
        alignItems: 'center',
        paddingVertical: 24,
        backgroundColor: '#FFF8F0',
        borderBottomWidth: 1,
        borderBottomColor: '#E8E0D5',
    },
    bannerIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    bannerTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#8B4513',
        marginBottom: 4,
    },
    bannerSubtitle: {
        fontSize: 14,
        color: '#888',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 100,
    },
    chaptersGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    chapterButton: {
        width: '18%',
        aspectRatio: 1,
        backgroundColor: '#FFF',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        margin: '1%',
        borderWidth: 1,
        borderColor: '#E8E0D5',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    chapterNumber: {
        fontSize: 18,
        fontWeight: '600',
        color: '#8B4513',
    },
});
