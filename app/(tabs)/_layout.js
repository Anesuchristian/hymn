import { Tabs } from 'expo-router';
import { Home, Book, Library } from 'lucide-react-native';
import Colors from '../../constants/Colors';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: Colors.light.primary,
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: {
                    backgroundColor: Colors.light.creamBackground,
                    borderTopColor: '#E8E0D5',
                },
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <Home size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="hymns"
                options={{
                    title: 'Hymnals',
                    tabBarIcon: ({ color }) => <Book size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="library"
                options={{
                    title: 'Library',
                    tabBarIcon: ({ color }) => <Library size={24} color={color} />,
                }}
            />
        </Tabs>
    );
}
