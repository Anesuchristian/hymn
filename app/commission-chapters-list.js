import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Pressable } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { ArrowLeft, Search } from 'lucide-react-native';
import { commissionChapters } from '../constants/commissionChapters';
import { StatusBar } from 'expo-status-bar';

import { useLocalSearchParams } from 'expo-router';
import { commissionChaptersPart2 } from '../constants/commissionChaptersPart2';

export default function CommissionChaptersList() {
    const router = useRouter();
    const { bookId } = useLocalSearchParams();
    const [language, setLanguage] = useState('en'); // 'en' or 'sn'

    // Select the correct chapters data source
    const chaptersData = bookId === '2' ? commissionChaptersPart2 : commissionChapters;

    const renderChapterItem = (chapterNum) => {
        const chapterData = chaptersData[chapterNum] ? chaptersData[chapterNum][language] : null;

        let titleText = `Chapter ${chapterNum}`;
        let subText = "Read content";

        if (language === 'sn') {
            titleText = `Chitsauko ${chapterNum}`;
        }

        if (chapterData) {
            // User requested: "read content changes to text render on topic passage"
            // We use the subtitle as the topic passage/summary.
            if (chapterData.subtitle) {
                subText = chapterData.subtitle;
            }
        }

        return (
            <TouchableOpacity
                key={chapterNum}
                style={styles.chapterCard}
                onPress={() => {
                    // Pass the selected language context if needed, or let screen handle it (screen has its own toggle, 
                    // ideally we should pass it or rely on persistence, but for now simple param pass is good)
                    // The user didn't explicitly ask to sync, but the screen has a toggle. 
                    // Let's rely on the screen's default or maybe pass param? 
                    // For now, standard nav.
                    router.push({
                        pathname: '/CommissionChapterScreen',
                        params: { chapterNumber: chapterNum, initialLanguage: language, bookId },
                    });
                }}
            >
                <View style={styles.chapterIconContainer}>
                    <Text style={styles.chapterIconText}>{chapterNum}</Text>
                </View>
                <View style={styles.chapterInfo}>
                    <Text style={styles.chapterTitle}>{titleText}</Text>
                    <Text style={styles.subtext} numberOfLines={2}>{subText}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#C0A080" />
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="dark" backgroundColor={Colors.light.creamBackground} />

            {/* Custom Header with Language Switcher */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color="#000" />
                </TouchableOpacity>

                {/* Language Switcher */}
                <View style={styles.toggleContainer}>
                    <Pressable
                        style={[styles.toggleOption, language === 'sn' && styles.activeToggle]}
                        onPress={() => setLanguage('sn')}
                    >
                        <Text style={[styles.toggleText, language === 'sn' && styles.activeToggleText]}>Shona</Text>
                    </Pressable>
                    <Pressable
                        style={[styles.toggleOption, language === 'en' && styles.activeToggle]}
                        onPress={() => setLanguage('en')}
                    >
                        <Text style={[styles.toggleText, language === 'en' && styles.activeToggleText]}>English</Text>
                    </Pressable>
                </View>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.sectionTitle}>
                    {language === 'en' ? 'Select a Chapter' : 'Sarudza Chitsauko'}
                </Text>
                <View style={styles.listContainer}>
                    {/* Assuming chapters 1 to 25 for now, or derive from keys */}
                    {Object.keys(chaptersData).map((key) => renderChapterItem(parseInt(key)))}
                </View>
            </ScrollView>

            {/* Search FAB - Similar to Hymnal */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => router.push('/commission-search')}
                activeOpacity={0.8}
            >
                <Search size={24} color="#fff" />
            </TouchableOpacity>
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
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: '#E8E0D5',
        borderRadius: 20,
        padding: 2,
        borderWidth: 1,
        borderColor: '#D0C0B0',
    },
    toggleOption: {
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 18,
    },
    activeToggle: {
        backgroundColor: '#8B4513',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    toggleText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#888',
    },
    activeToggleText: {
        color: '#FFF',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#333',
        marginBottom: 20,
        marginTop: 10,
    },
    listContainer: {
        gap: 12,
    },
    chapterCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E8E0D5',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    chapterIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F5F0EB',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        borderWidth: 1,
        borderColor: '#E8E0D5',
    },
    chapterIconText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#8B4513',
    },
    chapterInfo: {
        flex: 1,
        marginRight: 10,
    },
    chapterTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    subtext: {
        fontSize: 13,
        color: '#666',
        lineHeight: 18,
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
});
