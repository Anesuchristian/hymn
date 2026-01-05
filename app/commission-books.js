import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    SafeAreaView,
    StatusBar,
    ScrollView,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, ChevronRight } from 'lucide-react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { commissionBooksData } from '../constants/commissionBooksData';

export default function CommissionBooksScreen() {
    const router = useRouter();

    const renderBookCard = (book) => {
        return (
            <TouchableOpacity 
                key={book.id} 
                style={styles.bookCard}
                onPress={() => {
                    router.push({
                        pathname: '/commission-chapters-list',
                        params: { bookId: book.id },
                    });
                }}
                activeOpacity={0.7}
            >
                {/* Thumbnail */}
                <View style={styles.thumbnailContainer}>
                    <Image
                        source={{ uri: book.image }}
                        style={styles.thumbnail}
                        resizeMode="cover"
                    />
                </View>

                {/* Book Info */}
                <View style={styles.bookInfo}>
                    <Text style={styles.bookTitle} numberOfLines={2}>{book.title}</Text>
                    <Text style={styles.bookDescription} numberOfLines={1}>{book.description}</Text>

                    <View style={styles.infoRow}>
                        <View style={styles.categoryInfo}>
                            <Ionicons name="book-outline" size={18} color="#888" />
                            <Text style={styles.categoryText}>Commission Book</Text>
                        </View>
                        <View style={styles.readButton}>
                            <Text style={styles.readButtonText}>Read</Text>
                            <ChevronRight size={16} color="#A08060" />
                        </View>
                    </View>

                    {/* Color Bar */}
                    <View style={styles.colorBarContainer}>
                        <View
                            style={[
                                styles.colorBar,
                                { backgroundColor: book.color }
                            ]}
                        />
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.safeContainer}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.light.creamBackground} />
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Commission Books</Text>
                <View style={styles.headerRight} />
            </View>

            {/* Scrollable Content */}
            <ScrollView
                style={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContentContainer}
            >
                {commissionBooksData.map(renderBookCard)}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeContainer: {
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
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000',
    },
    headerRight: {
        width: 40,
    },
    scrollContainer: {
        flex: 1,
        backgroundColor: Colors.light.creamBackground,
    },
    scrollContentContainer: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 100,
    },
    bookCard: {
        flexDirection: 'row',
        backgroundColor: Colors.light.creamBackground,
        borderRadius: 12,
        marginBottom: 16,
        padding: 14,
        borderWidth: 1,
        borderColor: '#D8D0C8',
    },
    thumbnailContainer: {
        width: 90,
        height: 90,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#f5f5f5',
    },
    thumbnail: {
        width: '100%',
        height: '100%',
    },
    bookInfo: {
        flex: 1,
        marginLeft: 14,
        justifyContent: 'space-between',
        paddingVertical: 2,
    },
    bookTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
        lineHeight: 20,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    categoryInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    categoryText: {
        fontSize: 13,
        color: '#888',
        marginLeft: 6,
    },
    readButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    readButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#A08060',
    },
    bookDescription: {
        fontSize: 13,
        color: '#666',
        marginTop: 4,
    },
    colorBarContainer: {
        height: 4,
        backgroundColor: '#E5E5E5',
        borderRadius: 2,
        overflow: 'hidden',
        marginTop: 8,
    },
    colorBar: {
        height: '100%',
        width: '100%',
        borderRadius: 2,
    },
});
