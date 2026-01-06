import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    SafeAreaView,
    StatusBar,
    ImageBackground,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Colors from '../constants/Colors';
import { hymnsData } from '../constants/hymnsData';

const { width } = Dimensions.get('window');

// Background images that rotate every 5 hours
const BACKGROUND_IMAGES = [
    'https://tse3.mm.bing.net/th/id/OIP.N0g91M98G8xL-HOKXjI0wwHaE8?pid=ImgDet&w=474&h=316&rs=1&o=7&rm=3',
    'https://yt3.ggpht.com/a/AGF-l793C1xMR5hHmsFLnMgi_m5F01vdqzj5AMf8-g=s900-c-k-c0xffffffff-no-rj-mo',
    'https://i.ytimg.com/vi/AvWvQtyYi9I/maxresdefault.jpg',
    'https://tse1.mm.bing.net/th/id/OIP.-hYjY3m7F3uf_0hRYmmmJgHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
    'https://tse2.mm.bing.net/th/id/OIP.ufkq2nNBWm6nF2YtValvwwHaE8?rs=1&pid=ImgDetMain&o=7&rm=3',
    'https://i.ytimg.com/vi/hmBZb-pfdPs/hqdefault.jpg',
    'https://i.ytimg.com/vi/KtzFfUz_Zrs/maxresdefault.jpg',
    'https://i.ytimg.com/vi/lL14FQqTkUU/maxresdefault.jpg',
    'https://tse1.mm.bing.net/th/id/OIP.3JrFdVKMr5S-gN60eUGP7wHaE8?rs=1&pid=ImgDetMain&o=7&rm=3',
    'https://th.bing.com/th?id=OIF.rBR7nac49wQPX%2bNPjknt5A&rs=1&pid=ImgDetMain&o=7&rm=3',
    'https://tse2.mm.bing.net/th/id/OIP.5s5F9ppSeP6jFrw7qUmsaQHaHZ?rs=1&pid=ImgDetMain&o=7&rm=3',
    'https://i.ytimg.com/vi/Ezk3ciwupV0/maxresdefault.jpg',
    'https://iharare.com/wp-content/uploads/2020/02/Paul-Mwazha.jpg',
    'https://i0.wp.com/nehandaradio.com/wp-content/uploads/2018/10/PAUL-MWAZHA-AND-HIS-SONS.jpg?w=680&ssl=1',
];

// Daily Bible verses
const DAILY_VERSES = [
    { reference: '1 Timothy 1:17', text: 'Now unto the King eternal, immortal, invisible...' },
    { reference: 'John 3:16', text: 'For God so loved the world...' },
    { reference: 'Psalm 23:1', text: 'The Lord is my shepherd; I shall not want.' },
    { reference: 'Proverbs 3:5', text: 'Trust in the Lord with all thine heart...' },
    { reference: 'Isaiah 40:31', text: 'But they that wait upon the Lord shall renew their strength...' },
    { reference: 'Romans 8:28', text: 'And we know that all things work together for good...' },
    { reference: 'Philippians 4:13', text: 'I can do all things through Christ...' },
];

const getImageIndex = () => {
    const now = new Date();
    const hours = now.getHours();
    const fiveHourBlock = Math.floor(hours / 5);
    const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    return (dayOfYear * 5 + fiveHourBlock) % BACKGROUND_IMAGES.length;
};

const getVerseIndex = () => {
    const now = new Date();
    const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    return dayOfYear % DAILY_VERSES.length;
};

const getHymnOfDay = () => {
    const now = new Date();
    const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    return hymnsData[dayOfYear % hymnsData.length];
};

const HomeScreen = () => {
    const router = useRouter();
    const [currentImageIndex, setCurrentImageIndex] = useState(getImageIndex());
    const [verseOfDay, setVerseOfDay] = useState(DAILY_VERSES[getVerseIndex()]);
    const [hymnOfDay, setHymnOfDay] = useState(getHymnOfDay());

    useEffect(() => {
        // Update images every 5 hours
        const interval = setInterval(() => {
            setCurrentImageIndex(getImageIndex());
            setVerseOfDay(DAILY_VERSES[getVerseIndex()]);
            setHymnOfDay(getHymnOfDay());
        }, 1000 * 60 * 60); // Check every hour

        return () => clearInterval(interval);
    }, []);

    // Get current date
    const today = new Date();
    const dayName = today.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
    const dateNum = today.getDate();
    const monthName = today.toLocaleDateString('en-US', { month: 'long' }).toUpperCase();

    // Get two different images for verse and hymn cards
    const verseImageIndex = currentImageIndex;
    const hymnImageIndex = (currentImageIndex + 7) % BACKGROUND_IMAGES.length;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#faf9f6" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.headerButton}>
                    <Ionicons name="menu" size={28} color="#333" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>ACC Church</Text>

                <View style={styles.headerRight}>
                    <TouchableOpacity style={styles.plusButton}>
                        <Text style={styles.plusButtonText}>Plus</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.headerButton}>
                        <Ionicons name="notifications-outline" size={24} color="#333" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Colored Line Under Header */}
            <View style={styles.coloredLine}>
                <View style={[styles.colorSegment, { backgroundColor: '#ef4444', flex: 1 }]} />
                <View style={[styles.colorSegment, { backgroundColor: '#22c55e', flex: 1 }]} />
                <View style={[styles.colorSegment, { backgroundColor: '#3b82f6', flex: 1 }]} />
                <View style={[styles.colorSegment, { backgroundColor: '#eab308', flex: 1 }]} />
            </View>

            {/* Scrollable Content */}
            <ScrollView
                style={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Verse of the Day Card */}
                <View style={styles.cardContainer}>
                    <ImageBackground
                        source={{ uri: BACKGROUND_IMAGES[verseImageIndex] }}
                        style={styles.cardBackground}
                        imageStyle={styles.cardBackgroundImage}
                    >
                        <View style={styles.cardOverlay}>
                            {/* Bell Icon */}
                            <TouchableOpacity style={styles.bellIcon}>
                                <Ionicons name="notifications-off-outline" size={22} color="#fff" />
                            </TouchableOpacity>

                            {/* Card Title */}
                            <View style={styles.cardTitleContainer}>
                                <Text style={styles.cardMainTitle}>VERSE</Text>
                                <Text style={styles.cardMainTitle}>OF THE</Text>
                                <Text style={styles.cardMainTitle}>DAY</Text>
                            </View>
                        </View>
                    </ImageBackground>

                    {/* Card Footer */}
                    <View style={styles.cardFooter}>
                        <View style={styles.cardFooterLeft}>
                            <Text style={styles.cardDate}>{dayName}, {dateNum} {monthName}</Text>
                            <Text style={styles.cardReference}>{verseOfDay.reference}</Text>
                            <View style={styles.colorIndicator}>
                                <View style={[styles.colorDot, { backgroundColor: '#ef4444' }]} />
                                <View style={[styles.colorDot, { backgroundColor: '#f97316' }]} />
                            </View>
                        </View>
                        <TouchableOpacity 
                            style={styles.readButton}
                            onPress={() => router.push('/bible-books')}
                        >
                            <Text style={styles.readButtonText}>Read</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Hymn of the Day Card */}
                <View style={styles.cardContainer}>
                    <ImageBackground
                        source={{ uri: BACKGROUND_IMAGES[hymnImageIndex] }}
                        style={styles.cardBackground}
                        imageStyle={styles.cardBackgroundImage}
                    >
                        <View style={styles.cardOverlay}>
                            {/* Bell Icon */}
                            <TouchableOpacity style={styles.bellIcon}>
                                <Ionicons name="notifications-off-outline" size={22} color="#fff" />
                            </TouchableOpacity>

                            {/* Card Title */}
                            <View style={styles.cardTitleContainer}>
                                <Text style={styles.cardMainTitle}>HYMN</Text>
                                <Text style={styles.cardMainTitle}>OF THE</Text>
                                <Text style={styles.cardMainTitle}>DAY</Text>
                            </View>
                        </View>
                    </ImageBackground>

                    {/* Card Footer */}
                    <View style={styles.cardFooter}>
                        <View style={styles.cardFooterLeft}>
                            <Text style={styles.cardDate}>{dayName}, {dateNum} {monthName}</Text>
                            <Text style={styles.cardReference}>{hymnOfDay?.title || 'We Gather Together'}</Text>
                            <View style={styles.colorIndicator}>
                                <View style={[styles.colorDot, { backgroundColor: '#3b82f6' }]} />
                                <View style={[styles.colorDot, { backgroundColor: '#8b5cf6' }]} />
                            </View>
                        </View>
                        <TouchableOpacity 
                            style={styles.readButton}
                            onPress={() => router.push(`/hymns/${hymnOfDay?.id || 1}`)}
                        >
                            <Text style={styles.readButtonText}>Read</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* My Plans Section */}
                <View style={styles.myPlansSection}>
                    <Text style={styles.sectionTitle}>My Plans</Text>
                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.plansScroll}
                    >
                        <TouchableOpacity 
                            style={styles.planCard}
                            onPress={() => router.push('/commission-books')}
                        >
                            <Image 
                                source={{ uri: 'https://th.bing.com/th/id/OIP.4ifDnOM0tnIXN4sZUV3mBwHaHY?w=172&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3' }}
                                style={styles.planImage}
                            />
                            <Text style={styles.planTitle}>Divine Commission</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.planCard}
                            onPress={() => router.push('/bible-books')}
                        >
                            <Image 
                                source={require('../assets/images/bible.jpg')}
                                style={styles.planImage}
                            />
                            <Text style={styles.planTitle}>Holy Bible</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.planCard}>
                            <Image 
                                source={{ uri: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/f5/7b/8a/f57b8a2b-977b-9bb6-0c60-e96158c88d67/artwork.jpg/1200x1200bf-60.jpg' }}
                                style={styles.planImage}
                            />
                            <Text style={styles.planTitle}>EPM Sayings</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#faf9f6',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        paddingTop: 48,
        backgroundColor: '#faf9f6',
    },
    headerButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    plusButton: {
        backgroundColor: '#333',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    plusButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    coloredLine: {
        flexDirection: 'row',
        height: 4,
    },
    colorSegment: {
        height: '100%',
    },
    scrollContainer: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 100,
    },
    cardContainer: {
        marginBottom: 20,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    cardBackground: {
        height: 280,
    },
    cardBackgroundImage: {
        resizeMode: 'cover',
    },
    cardOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.35)',
        padding: 20,
    },
    bellIcon: {
        alignSelf: 'flex-end',
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    cardTitleContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingBottom: 10,
    },
    cardMainTitle: {
        fontSize: 36,
        fontWeight: '900',
        color: '#fff',
        textShadowColor: 'rgba(0, 0, 0, 0.6)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 6,
        letterSpacing: 1,
        lineHeight: 40,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
    },
    cardFooterLeft: {
        flex: 1,
    },
    cardDate: {
        fontSize: 11,
        fontWeight: '600',
        color: '#666',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    cardReference: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginBottom: 8,
    },
    colorIndicator: {
        flexDirection: 'row',
        gap: 4,
    },
    colorDot: {
        width: 20,
        height: 4,
        borderRadius: 2,
    },
    readButton: {
        borderWidth: 1.5,
        borderColor: '#333',
        paddingHorizontal: 28,
        paddingVertical: 12,
        borderRadius: 25,
    },
    readButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
    },
    myPlansSection: {
        marginTop: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
        marginBottom: 16,
    },
    plansScroll: {
        gap: 12,
    },
    planCard: {
        width: 140,
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    planImage: {
        width: '100%',
        height: 100,
        resizeMode: 'cover',
    },
    planTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#333',
        padding: 10,
        textAlign: 'center',
    },
});

export default HomeScreen;
