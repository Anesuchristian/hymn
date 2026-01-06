import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Dimensions,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react-native';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';
import Colors from '../constants/Colors';

const { width, height } = Dimensions.get('window');

export default function DivineSongsScreen({ visible, onClose }) {
    const [mode, setMode] = useState('offline'); // 'offline' or 'online'
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [sound, setSound] = useState(null);
    const [duration, setDuration] = useState(0);
    const [position, setPosition] = useState(0);
    const [volume, setVolume] = useState(1.0);
    const [bass, setBass] = useState(0.5);
    const [treble, setTreble] = useState(0.5);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(height)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.spring(slideAnim, {
                    toValue: 0,
                    tension: 65,
                    friction: 11,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: height,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    useEffect(() => {
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [sound]);

    const onPlaybackStatusUpdate = (status) => {
        if (status.isLoaded) {
            setIsPlaying(status.isPlaying);
            setDuration(status.durationMillis || 0);
            setPosition(status.positionMillis || 0);
            if (status.didJustFinish) {
                setIsPlaying(false);
                setPosition(0);
            }
        }
    };

    const togglePlayPause = async () => {
        if (!sound) {
            // Load a sample audio for demo
            setIsLoading(true);
            try {
                const { sound: newSound } = await Audio.Sound.createAsync(
                    { uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
                    { shouldPlay: true },
                    onPlaybackStatusUpdate
                );
                setSound(newSound);
                setIsLoading(false);
            } catch (error) {
                console.error('Error loading audio:', error);
                setIsLoading(false);
            }
        } else {
            if (isPlaying) {
                await sound.pauseAsync();
            } else {
                await sound.playAsync();
            }
        }
    };

    const seekTo = async (value) => {
        if (sound) {
            await sound.setPositionAsync(value);
        }
    };

    const handleVolumeChange = async (value) => {
        setVolume(value);
        if (sound) {
            await sound.setVolumeAsync(value);
        }
    };

    const formatTime = (millis) => {
        const totalSeconds = Math.floor(millis / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleClose = async () => {
        if (sound) {
            await sound.stopAsync();
            await sound.unloadAsync();
            setSound(null);
        }
        setIsPlaying(false);
        setPosition(0);
        onClose();
    };

    if (!visible) return null;

    return (
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
            <Animated.View style={[styles.container, { transform: [{ translateY: slideAnim }] }]}>
                <SafeAreaView style={styles.safeArea}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Divine Songs ♪</Text>
                        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                            <X size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                        {/* Mode Toggle */}
                        <View style={styles.modeContainer}>
                            <View style={styles.modeToggle}>
                                <TouchableOpacity
                                    style={[
                                        styles.modeButton,
                                        mode === 'offline' && styles.modeButtonActive,
                                    ]}
                                    onPress={() => setMode('offline')}
                                >
                                    <View style={[
                                        styles.modeIcon,
                                        mode === 'offline' && styles.modeIconActive,
                                    ]}>
                                        <View style={styles.diamondIcon} />
                                    </View>
                                    <Text style={[
                                        styles.modeText,
                                        mode === 'offline' && styles.modeTextActive,
                                    ]}>
                                        offline
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.modeButton,
                                        mode === 'online' && styles.modeButtonActive,
                                    ]}
                                    onPress={() => setMode('online')}
                                >
                                    <View style={[
                                        styles.modeIcon,
                                        mode === 'online' && styles.modeIconOnline,
                                    ]}>
                                        <View style={styles.circleIcon} />
                                    </View>
                                    <Text style={[
                                        styles.modeText,
                                        mode === 'online' && styles.modeTextActive,
                                    ]}>
                                        online
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Player Controls */}
                        <View style={styles.playerSection}>
                            {/* Play/Pause Button */}
                            <View style={styles.mainControls}>
                                <TouchableOpacity style={styles.skipButton}>
                                    <SkipBack size={28} color="#666" />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.playButton}
                                    onPress={togglePlayPause}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <ActivityIndicator size="large" color="#333" />
                                    ) : isPlaying ? (
                                        <Pause size={32} color="#333" />
                                    ) : (
                                        <Play size={32} color="#333" style={{ marginLeft: 4 }} />
                                    )}
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.skipButton}>
                                    <SkipForward size={28} color="#666" />
                                </TouchableOpacity>
                            </View>

                            {/* Progress Slider */}
                            <View style={styles.progressContainer}>
                                <Text style={styles.timeText}>{formatTime(position)}</Text>
                                <Slider
                                    style={styles.slider}
                                    minimumValue={0}
                                    maximumValue={duration || 1}
                                    value={position}
                                    onSlidingComplete={seekTo}
                                    minimumTrackTintColor="#2196F3"
                                    maximumTrackTintColor="#E0E0E0"
                                    thumbTintColor="#2196F3"
                                />
                                <Text style={styles.timeText}>{formatTime(duration)}</Text>
                            </View>
                        </View>

                        {/* Volume Control */}
                        <View style={styles.sliderSection}>
                            <View style={styles.sliderRow}>
                                <Volume2 size={20} color="#666" />
                                <Slider
                                    style={styles.controlSlider}
                                    minimumValue={0}
                                    maximumValue={1}
                                    value={volume}
                                    onValueChange={handleVolumeChange}
                                    minimumTrackTintColor="#2196F3"
                                    maximumTrackTintColor="#E0E0E0"
                                    thumbTintColor="#2196F3"
                                />
                            </View>
                        </View>

                        {/* Bass Control */}
                        <View style={styles.sliderSection}>
                            <View style={styles.sliderRow}>
                                <Text style={styles.sliderLabel}>Bass</Text>
                                <Slider
                                    style={styles.controlSlider}
                                    minimumValue={0}
                                    maximumValue={1}
                                    value={bass}
                                    onValueChange={setBass}
                                    minimumTrackTintColor="#2196F3"
                                    maximumTrackTintColor="#E0E0E0"
                                    thumbTintColor="#2196F3"
                                />
                            </View>
                        </View>

                        {/* Treble Control */}
                        <View style={styles.sliderSection}>
                            <View style={styles.sliderRow}>
                                <Text style={styles.sliderLabel}>Treble</Text>
                                <Slider
                                    style={styles.controlSlider}
                                    minimumValue={0}
                                    maximumValue={1}
                                    value={treble}
                                    onValueChange={setTreble}
                                    minimumTrackTintColor="#2196F3"
                                    maximumTrackTintColor="#E0E0E0"
                                    thumbTintColor="#2196F3"
                                />
                            </View>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </Animated.View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1000,
    },
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        marginTop: 40,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        overflow: 'hidden',
    },
    safeArea: {
        flex: 1,
    },
    header: {
        backgroundColor: '#6B5B95',
        paddingVertical: 20,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
    },
    closeButton: {
        position: 'absolute',
        right: 16,
        top: 16,
        padding: 4,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    modeContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    modeToggle: {
        flexDirection: 'row',
        backgroundColor: '#E8E8E8',
        borderRadius: 30,
        padding: 4,
    },
    modeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
    },
    modeButtonActive: {
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    modeIcon: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 6,
    },
    modeIconActive: {
        // For offline active state
    },
    modeIconOnline: {
        // For online state
    },
    diamondIcon: {
        width: 16,
        height: 16,
        backgroundColor: '#2196F3',
        transform: [{ rotate: '45deg' }],
    },
    circleIcon: {
        width: 16,
        height: 16,
        backgroundColor: '#333',
        borderRadius: 8,
    },
    modeText: {
        fontSize: 14,
        color: '#999',
        fontWeight: '500',
    },
    modeTextActive: {
        color: '#333',
        fontWeight: '600',
    },
    playerSection: {
        alignItems: 'center',
        marginBottom: 30,
    },
    mainControls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    playButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
        borderWidth: 2,
        borderColor: '#E0E0E0',
    },
    skipButton: {
        padding: 10,
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 10,
    },
    slider: {
        flex: 1,
        marginHorizontal: 10,
        height: 40,
    },
    timeText: {
        fontSize: 12,
        color: '#666',
        minWidth: 40,
        textAlign: 'center',
    },
    sliderSection: {
        marginBottom: 20,
    },
    sliderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    sliderLabel: {
        fontSize: 14,
        color: '#666',
        width: 50,
        fontWeight: '500',
    },
    controlSlider: {
        flex: 1,
        height: 40,
        marginLeft: 10,
    },
});
