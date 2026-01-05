// Audio Player Hook for React Native with Expo AV
// Provides audio playback functionality

import { useState, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import { incrementPlayCount } from '../services/audioService';

export function useAudioPlayer() {
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [duration, setDuration] = useState(0);
    const [position, setPosition] = useState(0);
    const [error, setError] = useState(null);
    const [currentAudioId, setCurrentAudioId] = useState(null);

    const soundRef = useRef(null);

    // Configure audio mode on mount
    useEffect(() => {
        configureAudio();

        return () => {
            // Cleanup on unmount
            if (soundRef.current) {
                soundRef.current.unloadAsync();
            }
        };
    }, []);

    const configureAudio = async () => {
        try {
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
                staysActiveInBackground: true,
                playsInSilentModeIOS: true,
                shouldDuckAndroid: true,
                playThroughEarpieceAndroid: false,
            });
        } catch (error) {
            console.error('Error configuring audio:', error);
        }
    };

    // Handle playback status updates
    const onPlaybackStatusUpdate = (status) => {
        if (status.isLoaded) {
            setIsPlaying(status.isPlaying);
            setDuration(status.durationMillis || 0);
            setPosition(status.positionMillis || 0);

            if (status.didJustFinish) {
                setIsPlaying(false);
                setPosition(0);
            }
        } else if (status.error) {
            setError(status.error);
            setIsLoading(false);
        }
    };

    /**
     * Load and optionally play an audio from URL
     * @param {string} url - The audio URL
     * @param {string} audioId - Optional audio ID for tracking
     * @param {boolean} autoPlay - Whether to auto-play after loading
     */
    const loadAudio = async (url, audioId = null, autoPlay = true) => {
        try {
            setIsLoading(true);
            setError(null);

            // Unload previous audio
            if (soundRef.current) {
                await soundRef.current.unloadAsync();
            }

            // Create and load new sound
            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: url },
                { shouldPlay: autoPlay },
                onPlaybackStatusUpdate
            );

            soundRef.current = newSound;
            setSound(newSound);
            setCurrentAudioId(audioId);
            setIsLoading(false);

            // Track play count
            if (audioId && autoPlay) {
                incrementPlayCount(audioId).catch(console.error);
            }

        } catch (error) {
            console.error('Error loading audio:', error);
            setError(error.message);
            setIsLoading(false);
        }
    };

    /**
     * Toggle play/pause
     */
    const togglePlayPause = async () => {
        if (!soundRef.current) return;

        try {
            if (isPlaying) {
                await soundRef.current.pauseAsync();
            } else {
                await soundRef.current.playAsync();
            }
        } catch (error) {
            console.error('Error toggling playback:', error);
            setError(error.message);
        }
    };

    /**
     * Play audio
     */
    const play = async () => {
        if (!soundRef.current) return;

        try {
            await soundRef.current.playAsync();
        } catch (error) {
            console.error('Error playing:', error);
            setError(error.message);
        }
    };

    /**
     * Pause audio
     */
    const pause = async () => {
        if (!soundRef.current) return;

        try {
            await soundRef.current.pauseAsync();
        } catch (error) {
            console.error('Error pausing:', error);
            setError(error.message);
        }
    };

    /**
     * Stop and reset audio
     */
    const stop = async () => {
        if (!soundRef.current) return;

        try {
            await soundRef.current.stopAsync();
            await soundRef.current.setPositionAsync(0);
            setIsPlaying(false);
            setPosition(0);
        } catch (error) {
            console.error('Error stopping:', error);
            setError(error.message);
        }
    };

    /**
     * Seek to a specific position
     * @param {number} positionMillis - Position in milliseconds
     */
    const seekTo = async (positionMillis) => {
        if (!soundRef.current) return;

        try {
            await soundRef.current.setPositionAsync(positionMillis);
        } catch (error) {
            console.error('Error seeking:', error);
            setError(error.message);
        }
    };

    /**
     * Skip forward by seconds
     * @param {number} seconds - Seconds to skip
     */
    const skipForward = async (seconds = 15) => {
        const newPosition = Math.min(position + seconds * 1000, duration);
        await seekTo(newPosition);
    };

    /**
     * Skip backward by seconds
     * @param {number} seconds - Seconds to skip back
     */
    const skipBackward = async (seconds = 15) => {
        const newPosition = Math.max(position - seconds * 1000, 0);
        await seekTo(newPosition);
    };

    /**
     * Set playback rate
     * @param {number} rate - Playback rate (0.5 to 2.0)
     */
    const setPlaybackRate = async (rate) => {
        if (!soundRef.current) return;

        try {
            await soundRef.current.setRateAsync(rate, true);
        } catch (error) {
            console.error('Error setting playback rate:', error);
            setError(error.message);
        }
    };

    /**
     * Unload the current audio
     */
    const unload = async () => {
        if (soundRef.current) {
            try {
                await soundRef.current.unloadAsync();
                soundRef.current = null;
                setSound(null);
                setIsPlaying(false);
                setPosition(0);
                setDuration(0);
                setCurrentAudioId(null);
            } catch (error) {
                console.error('Error unloading:', error);
            }
        }
    };

    // Format time for display
    const formatTime = (millis) => {
        const totalSeconds = Math.floor(millis / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return {
        // State
        isPlaying,
        isLoading,
        duration,
        position,
        error,
        currentAudioId,

        // Computed
        progress: duration > 0 ? position / duration : 0,
        formattedPosition: formatTime(position),
        formattedDuration: formatTime(duration),
        formattedRemaining: formatTime(duration - position),

        // Actions
        loadAudio,
        togglePlayPause,
        play,
        pause,
        stop,
        seekTo,
        skipForward,
        skipBackward,
        setPlaybackRate,
        unload,
    };
}

export default useAudioPlayer;
