import React, { useState, useEffect } from 'react';
import HomeScreen from '../../components/HomeScreen';
import SabbathScreen from '../../components/SabbathScreen';

function isSabbathTime() {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 5 = Friday, 6 = Saturday
    const hour = now.getHours();

    // Friday after 3pm (15:00)
    if (day === 5 && hour >= 15) {
        return true;
    }
    // All day Saturday until 6pm (18:00)
    if (day === 6 && hour < 18) {
        return true;
    }
    return false;
}

export default function IndexScreen() {
    const [showSabbath, setShowSabbath] = useState(false);

    useEffect(() => {
        setShowSabbath(isSabbathTime());
    }, []);

    if (showSabbath) {
        return <SabbathScreen onDismiss={() => setShowSabbath(false)} />;
    }

    return <HomeScreen />;
}
