
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    ImageBackground,
    Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Book, Library, Music, Info } from 'lucide-react-native';
import Colors from '../../constants/Colors';
import SabbathScreen from '../../components/SabbathScreen';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
    const router = useRouter();
    const [showSabbath, setShowSabbath] = useState(false);

    useEffect(() => {
        const checkSabbath = () => {
            const today = new Date();
            const day = today.getDay(); // 0 is Sunday, 6 is Saturday
            // Check if it's Friday (5) or Saturday (6)
            if (day === 5 || day === 6) {
                setShowSabbath(true);
            }
        };
        checkSabbath();
    }, []);

    if (showSabbath) {
        return <SabbathScreen onDismiss={() => setShowSabbath(false)} />;
    }

    const navigationItems = [
        {
            title: 'Hymns',
            subtitle: 'Nziyo Dzegungano',
            icon: Music,
            route: '/hymns',
            color: '#4A90E2'
        },
        {
            title: 'Commission',
            subtitle: 'The Divine Commission',
            icon: Book,
            route: '/library', // Based on library.js being the Commission Books
            color: '#F5A623'
        }
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" backgroundColor={Colors.light.creamBackground} />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                <View style={styles.header}>
                    <Image
                        source={require('../../assets/icon.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <Text style={styles.headerTitle}>African Apostolic Church</Text>
                    <Text style={styles.headerSubtitle}>Paul Mwazha of Africa</Text>
                </View>

                <View style={styles.grid}>
                    {navigationItems.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.card}
                            onPress={() => router.push(item.route)}
                        >
                            <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
                                <item.icon size={32} color={item.color} />
                            </View>
                            <View style={styles.cardText}>
                                <Text style={styles.cardTitle}>{item.title}</Text>
                                <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.quoteContainer}>
                    <Text style={styles.quoteText}>"Africa is the Springboard of Christianity"</Text>
                    <Text style={styles.quoteRef}>- Ernest Paul Mwazha</Text>
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
    scrollContent: {
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        paddingVertical: 30,
        paddingHorizontal: 20,
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 16,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        fontFamily: 'serif', // Trying to match the "premium" feel
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#666',
        marginTop: 4,
        fontWeight: '500',
    },
    grid: {
        padding: 20,
        gap: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#F0E6D2',
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    cardText: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 14,
        color: '#888',
    },
    quoteContainer: {
        marginTop: 20,
        padding: 20,
        alignItems: 'center',
    },
    quoteText: {
        fontSize: 16,
        fontStyle: 'italic',
        color: '#555',
        textAlign: 'center',
        marginBottom: 8,
    },
    quoteRef: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.light.primary,
    },
});
