import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import SabbathScreen from '../components/SabbathScreen';
import WelcomeScreen from '../components/WelcomeScreen';

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [showWelcome, setShowWelcome] = useState(true);
    const [showSabbath, setShowSabbath] = useState(false);

    useEffect(() => {
        // Always show Sabbath screen for testing
        setShowSabbath(true);
    }, []);

    const handleDismissWelcome = () => {
        setShowWelcome(false);
    };

    const handleDismissSabbath = () => {
        setShowSabbath(false);
    };

    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="hymns/[id]" options={{ title: 'Hymn Detail' }} />
                <Stack.Screen name="about" options={{ title: 'About' }} />
                <Stack.Screen name="CommissionChapterScreen" options={{ title: 'Commission Chapter' }} />
            </Stack>
            <StatusBar style="auto" />

            {/* Welcome Screen Overlay - Shows first */}
            {showWelcome && <WelcomeScreen onDismiss={handleDismissWelcome} />}

            {/* Sabbath Screen Overlay - Shows on Friday and Saturday after welcome */}
            {!showWelcome && showSabbath && <SabbathScreen onDismiss={handleDismissSabbath} />}
        </ThemeProvider>
    );
}
