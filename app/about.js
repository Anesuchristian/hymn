import { StyleSheet, Text, View } from 'react-native';
import { Stack } from 'expo-router';
import Colors from '../constants/Colors';

export default function About() {
    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: 'About' }} />
            <View style={styles.content}>
                <Text style={styles.title}>ACC Hymn Book</Text>
                <Text style={styles.version}>Version 1.0.0</Text>
                <Text style={styles.description}>
                    This app is developed for The African Apostolic Church (VaApostora VeAfrica).
                </Text>
                <Text style={styles.footer}>© 2025 ACC</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.light.primary,
        marginBottom: 8,
    },
    version: {
        fontSize: 16,
        color: '#666',
        marginBottom: 24,
    },
    description: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 48,
        lineHeight: 24,
    },
    footer: {
        fontSize: 14,
        color: '#999',
    },
});
