import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    TouchableOpacity,
    Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function SabbathScreen({ onDismiss }) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;

    // Switch state animations (0 = on/light blue, 1 = off/dark gray)
    const switch1Anim = useRef(new Animated.Value(0)).current;
    const switch2Anim = useRef(new Animated.Value(0)).current;
    const switch3Anim = useRef(new Animated.Value(0)).current;
    const switch4Anim = useRef(new Animated.Value(0)).current;
    const switch5Anim = useRef(new Animated.Value(0)).current;

    // Text opacity animations (start hidden)
    const text1Anim = useRef(new Animated.Value(0)).current;
    const text2Anim = useRef(new Animated.Value(0)).current;
    const text3Anim = useRef(new Animated.Value(0)).current;
    const text4Anim = useRef(new Animated.Value(0)).current;
    const text5Anim = useRef(new Animated.Value(0)).current;

    const switchAnims = [switch1Anim, switch2Anim, switch3Anim, switch4Anim, switch5Anim];
    const textAnims = [text1Anim, text2Anim, text3Anim, text4Anim, text5Anim];

    useEffect(() => {
        // Main fade in
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
        ]).start();

        // Animate switches one by one every 4 seconds
        const animateSwitch = (index) => {
            if (index >= 5) return;

            // Animate switch from on to off state
            Animated.timing(switchAnims[index], {
                toValue: 1,
                duration: 600,
                useNativeDriver: false,
            }).start();

            // Fade in text after switch animation
            setTimeout(() => {
                Animated.timing(textAnims[index], {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }).start();
            }, 400);

            // Schedule next switch
            setTimeout(() => animateSwitch(index + 1), 1500);
        };

        // Start animating first switch after initial screen animation
        setTimeout(() => animateSwitch(0), 1500);

        // Auto-dismiss after 3 seconds from last switch animation
        // Total time: 1500ms initial + (5 switches * 1500ms) + 3000ms = 12000ms
        const totalAnimationTime = 1500 + (5 * 1500) + 3000;
        setTimeout(() => {
            if (onDismiss) onDismiss();
        }, totalAnimationTime);
    }, []);

    const AnimatedSwitch = ({ switchAnim, textAnim, text }) => {
        // Interpolate background color (light blue -> dark gray)
        const backgroundColor = switchAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['#A8D4E6', '#5A6270'],
        });

        // Interpolate knob position (right -> left)
        const knobTranslateX = switchAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -220], // Start on right, move to left
        });

        // Interpolate knob color (yellow -> gray)
        const knobColor = switchAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['#F9C74F', '#9CA3AF'],
        });

        // Dot opacity (hidden when on, visible when off)
        const dotOpacity = switchAnim.interpolate({
            inputRange: [0, 0.7, 1],
            outputRange: [0, 0, 1],
        });

        return (
            <Animated.View style={styles.switchRow}>
                <Animated.View style={[styles.switchTrack, { backgroundColor }]}>
                    {/* Knob - animated from right to left */}
                    <Animated.View
                        style={[
                            styles.switchKnob,
                            {
                                backgroundColor: knobColor,
                                transform: [{ translateX: knobTranslateX }],
                            },
                        ]}
                    >
                        <Animated.View style={[styles.dotsContainer, { opacity: dotOpacity }]}>
                            <View style={styles.dot} />
                            <View style={styles.dot} />
                            <View style={styles.dot} />
                        </Animated.View>
                    </Animated.View>

                    {/* Text inside switch - fades in after animation */}
                    <Animated.Text
                        style={[
                            styles.switchTextInside,
                            { opacity: textAnim },
                        ]}
                        numberOfLines={3}
                    >
                        {text}
                    </Animated.Text>
                </Animated.View>
            </Animated.View>
        );
    };

    const switchData = [
        { text: "This Sabbath,\nswitch off." },
        { text: "Switch off the\ncell phones." },
        { text: "Switch off the\ntelevision." },
        { text: "Switch off the\ncomputer." },
        { text: "Switch off the\nwork, Stress,\nand anxiety." },
    ];

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    opacity: fadeAnim,
                    transform: [{ scale: scaleAnim }],
                },
            ]}
        >
            <View style={styles.content}>
                {/* Happy Sabbath Title */}
                <Text style={styles.happyText}>Happy</Text>
                <Text style={styles.sabbathText}>Sabbath!</Text>

                {/* Animated Switches */}
                <View style={styles.switchesContainer}>
                    {switchData.map((item, index) => (
                        <AnimatedSwitch
                            key={index}
                            switchAnim={switchAnims[index]}
                            textAnim={textAnims[index]}
                            text={item.text}
                        />
                    ))}
                </View>


            </View>
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
        backgroundColor: '#FDF8F2',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    },
    content: {
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 20,
    },
    happyText: {
        fontSize: 28,
        fontStyle: 'italic',
        color: '#4A5568',
        marginBottom: 0,
    },
    sabbathText: {
        fontSize: 42,
        fontWeight: '900',
        color: '#2D3748',
        marginBottom: 30,
    },
    switchesContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 30,
    },
    switchRow: {
        marginBottom: 8,
        width: '80%',
    },
    switchTrack: {
        width: '100%',
        height: 75,
        borderRadius: 38,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        overflow: 'hidden',
    },
    switchKnob: {
        width: 63,
        height: 63,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        right: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#6B7280',
    },
    switchTextInside: {
        flex: 1,
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
        textAlign: 'center',
        paddingLeft: 70,
        paddingRight: 8,
        lineHeight: 20,
    },
    verseContainer: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 24,
        paddingVertical: 20,
        borderRadius: 20,
        marginTop: -10,
        width: '92%',
        shadowColor: '#8B5A2B',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 10,
        borderWidth: 1,
        borderColor: 'rgba(139, 90, 43, 0.1)',
    },
    verseText: {
        fontSize: 17,
        fontStyle: 'italic',
        color: '#4A3728',
        textAlign: 'center',
        lineHeight: 26,
        letterSpacing: 0.3,
    },
    verseReference: {
        fontSize: 15,
        fontWeight: '700',
        color: '#8B5A2B',
        textAlign: 'center',
        marginTop: 12,
        letterSpacing: 1,
    },
    eternalMessage: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        paddingHorizontal: 25,
        marginTop: 20,
        lineHeight: 22,
    },
    eternalReference: {
        fontSize: 13,
        fontWeight: '600',
        color: '#8B5A2B',
        textAlign: 'center',
        marginTop: 5,
    },
});
