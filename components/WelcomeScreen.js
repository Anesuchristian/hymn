import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Dimensions,
    Image,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen({ onDismiss }) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const imageScaleAnim = useRef(new Animated.Value(0.3)).current;
    const imageOpacityAnim = useRef(new Animated.Value(0)).current;
    const titleFadeAnim = useRef(new Animated.Value(0)).current;
    const titleSlideAnim = useRef(new Animated.Value(-30)).current;
    const subtitleFadeAnim = useRef(new Animated.Value(0)).current;
    const subtitleSlideAnim = useRef(new Animated.Value(30)).current;
    const ringScaleAnim = useRef(new Animated.Value(0.5)).current;
    const ringOpacityAnim = useRef(new Animated.Value(0)).current;
    const decorFadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Main container fade in immediately
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
        }).start();

        // Image animations
        Animated.parallel([
            Animated.timing(imageOpacityAnim, {
                toValue: 1,
                duration: 600,
                delay: 200,
                useNativeDriver: true,
            }),
            Animated.spring(imageScaleAnim, {
                toValue: 1,
                tension: 40,
                friction: 6,
                delay: 200,
                useNativeDriver: true,
            }),
        ]).start();

        // Ring animation
        Animated.parallel([
            Animated.timing(ringOpacityAnim, {
                toValue: 1,
                duration: 600,
                delay: 400,
                useNativeDriver: true,
            }),
            Animated.spring(ringScaleAnim, {
                toValue: 1,
                tension: 30,
                friction: 7,
                delay: 400,
                useNativeDriver: true,
            }),
        ]).start();

        // Title animation
        Animated.parallel([
            Animated.timing(titleFadeAnim, {
                toValue: 1,
                duration: 500,
                delay: 600,
                useNativeDriver: true,
            }),
            Animated.timing(titleSlideAnim, {
                toValue: 0,
                duration: 500,
                delay: 600,
                useNativeDriver: true,
            }),
        ]).start();

        // Subtitle animation
        Animated.parallel([
            Animated.timing(subtitleFadeAnim, {
                toValue: 1,
                duration: 500,
                delay: 800,
                useNativeDriver: true,
            }),
            Animated.timing(subtitleSlideAnim, {
                toValue: 0,
                duration: 500,
                delay: 800,
                useNativeDriver: true,
            }),
        ]).start();

        // Decorative elements
        Animated.timing(decorFadeAnim, {
            toValue: 1,
            duration: 600,
            delay: 1000,
            useNativeDriver: true,
        }).start();

        // Auto-dismiss after 4 seconds
        setTimeout(() => {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
            }).start(() => {
                if (onDismiss) onDismiss();
            });
        }, 4000);
    }, []);

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            {/* Title Section - Top */}
            <Animated.View 
                style={[
                    styles.titleContainer, 
                    { 
                        opacity: titleFadeAnim,
                        transform: [{ translateY: titleSlideAnim }]
                    }
                ]}
            >
                <Text style={styles.mainTitle}>The African Apostolic Church</Text>
                <View style={styles.divider} />
            </Animated.View>

            {/* Image Container - Center */}
            <View style={styles.imageSection}>
                {/* Outer decorative ring */}
                <Animated.View 
                    style={[
                        styles.outerRing,
                        {
                            opacity: ringOpacityAnim,
                            transform: [{ scale: ringScaleAnim }]
                        }
                    ]} 
                />
                
                {/* Middle decorative ring */}
                <Animated.View 
                    style={[
                        styles.middleRing,
                        {
                            opacity: ringOpacityAnim,
                            transform: [{ scale: ringScaleAnim }]
                        }
                    ]} 
                />

                {/* Main Image */}
                <Animated.View 
                    style={[
                        styles.imageWrapper,
                        { 
                            opacity: imageOpacityAnim,
                            transform: [{ scale: imageScaleAnim }] 
                        }
                    ]}
                >
                    <Image
                        source={{ uri: 'https://zimbanews.co.zw/wp-content/uploads/2025/11/mwazha--1024x683.jpg' }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                </Animated.View>
            </View>

            {/* Subtitle Section - Bottom */}
            <Animated.View 
                style={[
                    styles.subtitleContainer, 
                    { 
                        opacity: subtitleFadeAnim,
                        transform: [{ translateY: subtitleSlideAnim }]
                    }
                ]}
            >
                <Text style={styles.subTitle}>Vaapostora veAfrica</Text>
            </Animated.View>

            {/* Bottom decorative */}
            <Animated.View style={[styles.bottomDecor, { opacity: decorFadeAnim }]}>
                <View style={styles.bottomLine} />
                <Text style={styles.blessingText}>Welcome</Text>
                <View style={styles.bottomLine} />
            </Animated.View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10000,
        backgroundColor: '#FDF8F2',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    mainTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#5D4037',
        textAlign: 'center',
        letterSpacing: 1,
    },
    divider: {
        width: 60,
        height: 3,
        backgroundColor: '#8B5A2B',
        marginTop: 12,
        borderRadius: 2,
    },
    imageSection: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
    },
    outerRing: {
        position: 'absolute',
        width: 260,
        height: 260,
        borderRadius: 130,
        borderWidth: 2,
        borderColor: 'rgba(139, 90, 43, 0.15)',
    },
    middleRing: {
        position: 'absolute',
        width: 230,
        height: 230,
        borderRadius: 115,
        borderWidth: 1,
        borderColor: 'rgba(139, 90, 43, 0.25)',
    },
    imageWrapper: {
        width: 180,
        height: 180,
        borderRadius: 90,
        overflow: 'hidden',
        borderWidth: 4,
        borderColor: '#8B5A2B',
        shadowColor: '#5D4037',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 12,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    subtitleContainer: {
        alignItems: 'center',
        marginTop: 25,
    },
    subTitle: {
        fontSize: 20,
        fontStyle: 'italic',
        color: '#8B5A2B',
        textAlign: 'center',
        letterSpacing: 2,
    },
    bottomDecor: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 40,
        gap: 15,
    },
    bottomLine: {
        width: 40,
        height: 1,
        backgroundColor: 'rgba(139, 90, 43, 0.3)',
    },
    blessingText: {
        fontSize: 14,
        color: '#8B5A2B',
        fontWeight: '600',
        letterSpacing: 3,
        textTransform: 'uppercase',
    },
});
