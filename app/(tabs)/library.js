import { StyleSheet, TouchableOpacity, Text, View, Image, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import Colors from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

// My Resources - main library items
const myResources = [
    {
        id: '1',
        title: 'Divine Commission Book',
        image: 'https://th.bing.com/th/id/OIP.4ifDnOM0tnIXN4sZUV3mBwHaHY?w=172&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
        currentDay: 0,
        totalDays: 30,
        color: '#4A90D9',
        route: '/commission-books',
    },
    {
        id: '3',
        title: 'Holy Bible',
        image: require('../../assets/images/bible.jpg'),
        currentDay: 0,
        totalDays: 365,
        color: '#C9A227',
        route: '/bible-books',
        isLocalImage: true,
    },
    {
        id: '2',
        title: 'EPM Sayings',
        image: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/f5/7b/8a/f57b8a2b-977b-9bb6-0c60-e96158c88d67/artwork.jpg/1200x1200bf-60.jpg',
        currentDay: 0,
        totalDays: 365,
        color: '#FF6B6B',
        route: null,
    },
    {
        id: '4',
        title: 'Divine Songs',
        image: 'https://th.bing.com/th/id/OIP.PAru_Vw-MlkykC_yf0FMJAHaHa?w=175&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
        currentDay: 0,
        totalDays: 100,
        color: '#FFB347',
        route: null,
    },
    {
        id: '5',
        title: 'Divine Sermons',
        image: 'https://th.bing.com/th/id/R.607662efde7f2c89e82fcd73f6814acd?rik=QYQZzJ63FoaNQA&riu=http%3a%2f%2fwww.theafricanapostolicchurch.com%2fwp-content%2fuploads%2f2015%2f03%2fIMG_1441.jpg&ehk=ZDVnG8upZH%2bQdDbs7yy3Njn3OvyWDUkDpqFjBuh6C9Y%3d&risl=&pid=ImgRaw&r=0',
        currentDay: 0,
        totalDays: 52,
        color: '#9B59B6',
        route: null,
    },
];

const discoverResources = [
    {
        id: '6',
        title: 'Mubatsiri - AI Spiritual Guide',
        image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400',
        currentDay: 0,
        totalDays: 0,
        color: '#5CB3A8',
        route: '/chatbot',
        isChatbot: true,
        description: 'Learn the Word of God',
    },
    {
        id: '8',
        title: 'Prayer Guide',
        image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400',
        currentDay: 0,
        totalDays: 14,
        color: '#E74C3C',
        route: null,
    },
    {
        id: '9',
        title: 'Church History',
        image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
        currentDay: 0,
        totalDays: 45,
        color: '#2ECC71',
        route: null,
    },
];

export default function LibraryScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('myResources');

    const currentResources = activeTab === 'myResources' ? myResources : discoverResources;

    const handleItemPress = (item) => {
        if (item.route) {
            router.push(item.route);
        }
    };

    const renderResourceCard = (item) => {
        const progress = item.totalDays > 0 ? (item.currentDay / item.totalDays) : 0;
        const isChatbot = item.isChatbot;

        return (
            <TouchableOpacity
                key={item.id}
                style={[styles.planCard, isChatbot && styles.chatbotCard]}
                onPress={() => handleItemPress(item)}
            >
                {/* Thumbnail */}
                <View style={[styles.thumbnailContainer, isChatbot && styles.chatbotThumbnail]}>
                    <Image
                        source={item.isLocalImage ? item.image : { uri: item.image }}
                        style={styles.thumbnail}
                        resizeMode="cover"
                    />
                    {isChatbot && (
                        <View style={styles.chatbotIconOverlay}>
                            <Ionicons name="chatbubbles" size={28} color="#fff" />
                        </View>
                    )}
                </View>

                {/* Resource Info */}
                <View style={styles.planInfo}>
                    <View>
                        <Text style={[styles.planTitle, isChatbot && styles.chatbotTitle]} numberOfLines={2}>
                            {item.title}
                        </Text>
                        {isChatbot && item.description && (
                            <Text style={styles.chatbotDescription}>{item.description}</Text>
                        )}
                    </View>

                    <View>
                        <View style={styles.progressRow}>
                            {!isChatbot && item.id !== '1' && (
                                <View style={styles.dayInfo}>
                                    <Ionicons name="checkbox-outline" size={18} color="#888" />
                                    <Text style={styles.dayText}>Day {item.currentDay} of {item.totalDays}</Text>
                                </View>
                            )}
                            {(item.id === '1' || isChatbot) && <View style={styles.dayInfo} />}
                            <Text style={[styles.readButtonText, isChatbot && styles.chatbotButtonText]}>
                                {isChatbot ? 'Chat Now' : 'Read'}
                            </Text>
                        </View>

                        {/* Progress Bar - Hidden for Divine Commission Book and Chatbot */}
                        {!isChatbot && item.id !== '1' && (
                            <View style={styles.progressBarContainer}>
                                <View
                                    style={[
                                        styles.progressBar,
                                        { width: `${Math.max(progress * 100, 2)}%`, backgroundColor: item.color }
                                    ]}
                                />
                            </View>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };


    return (
        <SafeAreaView style={styles.safeContainer}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.light.creamBackground} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.menuButton}>
                    <Ionicons name="menu" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>ACC Library</Text>
                <TouchableOpacity style={styles.notificationButton}>
                    <Ionicons name="notifications-outline" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            {/* Tabs */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'myResources' && styles.activeTab]}
                    onPress={() => setActiveTab('myResources')}
                >
                    <Text style={[styles.tabText, activeTab === 'myResources' && styles.activeTabText]}>
                        My Resources
                    </Text>
                    {activeTab === 'myResources' && <View style={styles.tabIndicator} />}
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'discover' && styles.activeTab]}
                    onPress={() => setActiveTab('discover')}
                >
                    <Text style={[styles.tabText, activeTab === 'discover' && styles.activeTabText]}>
                        Discover
                    </Text>
                    {activeTab === 'discover' && <View style={styles.tabIndicator} />}
                </TouchableOpacity>
            </View>

            {/* Resources List */}
            <ScrollView
                style={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {currentResources.map(renderResourceCard)}
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 48,
        paddingBottom: 12,
        backgroundColor: Colors.light.creamBackground,
    },
    menuButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    notificationButton: {
        padding: 8,
    },
    tabContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        backgroundColor: Colors.light.creamBackground,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 12,
        position: 'relative',
    },
    activeTab: {
        // Active tab styling handled by indicator
    },
    tabText: {
        fontSize: 15,
        fontWeight: '500',
        color: '#999',
    },
    activeTabText: {
        color: '#333',
        fontWeight: '600',
    },
    tabIndicator: {
        position: 'absolute',
        bottom: 0,
        left: '25%',
        right: '25%',
        height: 2,
        backgroundColor: '#5CB3A8',
        borderRadius: 1,
    },
    scrollContainer: {
        flex: 1,
        backgroundColor: Colors.light.creamBackground,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 100,
    },
    planCard: {
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
    planInfo: {
        flex: 1,
        marginLeft: 14,
        justifyContent: 'space-between',
        paddingVertical: 2,
    },
    planTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
        lineHeight: 20,
    },
    progressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    dayInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dayText: {
        fontSize: 13,
        color: '#888',
        marginLeft: 6,
    },
    readButton: {
        // Plain text, no button styling
    },
    readButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#A08060',
    },
    progressBarContainer: {
        height: 4,
        backgroundColor: '#E5E5E5',
        borderRadius: 2,
        overflow: 'hidden',
        marginTop: 8,
    },
    progressBar: {
        height: '100%',
        borderRadius: 2,
    },
    // Chatbot specific styles
    chatbotCard: {
        borderColor: '#5CB3A8',
        borderWidth: 2,
        backgroundColor: 'rgba(92, 179, 168, 0.05)',
    },
    chatbotThumbnail: {
        position: 'relative',
    },
    chatbotIconOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(92, 179, 168, 0.85)',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    chatbotTitle: {
        color: '#2D5A52',
        fontWeight: '700',
    },
    chatbotDescription: {
        fontSize: 12,
        color: '#5CB3A8',
        marginTop: 2,
    },
    chatbotButtonText: {
        color: '#5CB3A8',
        fontWeight: '600',
    },
});
