import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import WelcomeScreen from '../components/WelcomeScreen';

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [showWelcome, setShowWelcome] = useState(true);

    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="hymns/[id]" options={{ title: 'Hymn Detail' }} />
                <Stack.Screen name="about" options={{ title: 'About' }} />
                <Stack.Screen name="CommissionChapterScreen" options={{ title: 'Commission Chapter' }} />
            </Stack>
            <StatusBar style="auto" />

            {/* Welcome Screen Overlay */}
            {showWelcome && <WelcomeScreen onDismiss={() => setShowWelcome(false)} />}
        </ThemeProvider>
    );
}
