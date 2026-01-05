import { StyleSheet, ScrollView, Text, View, TouchableOpacity, Modal, Animated, Vibration } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useState, useEffect, useMemo, useRef } from 'react';
import { hymnsData } from '../../constants/hymnsData';
import Colors from '../../constants/Colors';
import { Heart, Star, Gift, BookOpen, Eye, Book, Trash2, Check } from 'lucide-react-native';
import { isFavorite, toggleFavorite } from '../../utils/favorites';
import { getHymnHighlights, saveHymnHighlight } from '../../utils/hymnHighlights';
import { HIGHLIGHT_PRESETS } from '../../utils/highlightManager';

// Category icons mapping
const CATEGORY_ICONS = {
    'star': Star,
    'gift': Gift,
    'book-open': BookOpen,
    'heart': Heart,
    'eye': Eye,
    'book': Book,
};

export default function HymnDetail() {
    const { id } = useLocalSearchParams();
    const hymn = hymnsData.find((h) => h.id.toString() === id.toString());
    const [favorite, setFavorite] = useState(false);
    const [highlights, setHighlights] = useState([]);
    const [selectedLine, setSelectedLine] = useState(null);
    const [showActionModal, setShowActionModal] = useState(false);
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const getCategoryIcon = (iconName) => {
        return CATEGORY_ICONS[iconName] || Star;
    };

    // Split lyrics into lines for individual selection
    const lines = useMemo(() => {
        if (!hymn?.lyrics) return [];
        return hymn.lyrics.split('\n').map((text, index) => ({
            index,
            text,
            start: index,
            end: index,
        }));
    }, [hymn]);

    useEffect(() => {
        checkFavorite();
        loadHighlights();
    }, [id]);

    const checkFavorite = async () => {
        const status = await isFavorite(id);
        setFavorite(status);
    };

    const loadHighlights = async () => {
        const h = await getHymnHighlights(id);
        setHighlights(h);
    };

    const handleToggleFavorite = async () => {
        await toggleFavorite(id);
        setFavorite(!favorite);
    };

    const handleLineLongPress = (line) => {
        Vibration.vibrate(50);
        Animated.sequence([
            Animated.timing(scaleAnim, { toValue: 0.97, duration: 100, useNativeDriver: true }),
            Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
        ]).start();
        setSelectedLine(line);
        setShowActionModal(true);
    };

    const handleHighlight = async (category) => {
        if (!selectedLine) return;
        const highlightData = {
            start: selectedLine.index,
            end: selectedLine.index,
            text: selectedLine.text,
            color: category.color,
            categoryId: category.id,
            textColor: category.textColor,
        };
        const newHighlights = await saveHymnHighlight(id, highlightData);
        setHighlights(newHighlights);
        setShowActionModal(false);
        setSelectedLine(null);
    };

    const getLineHighlight = (lineIndex) => {
        return highlights.find(h => h.start === lineIndex);
    };

    const removeHighlight = async () => {
        if (!selectedLine) return;
        const existing = getLineHighlight(selectedLine.index);
        if (existing) {
            const highlightData = { start: existing.start, end: existing.end };
            const newHighlights = await saveHymnHighlight(id, highlightData);
            setHighlights(newHighlights);
        }
        setShowActionModal(false);
        setSelectedLine(null);
    };

    if (!hymn) {
        return (
            <View style={styles.container}>
                <Text>Hymn not found</Text>
            </View>
        );
    }

    return (
        <View style={styles.mainContainer}>
            <ScrollView style={styles.container}>
                <Stack.Screen
                    options={{
                        title: `Hymn ${hymn.id}`,
                        headerRight: () => (
                            <TouchableOpacity onPress={handleToggleFavorite} style={{ marginRight: 16 }}>
                                <Heart
                                    color={favorite ? 'red' : Colors.light.primary}
                                    fill={favorite ? 'red' : 'none'}
                                />
                            </TouchableOpacity>
                        )
                    }}
                />
                <View style={styles.header}>
                    <Text style={styles.title}>{hymn.title}</Text>
                    <Text style={styles.category}>{hymn.subtitle}</Text>
                    <Text style={styles.hint}>Long press a line to highlight</Text>
                </View>
                <View style={styles.content}>
                    {lines.map((line, index) => {
                        const highlight = getLineHighlight(index);
                        return (
                            <Animated.View
                                key={index}
                                style={{ transform: [{ scale: selectedLine?.index === index ? scaleAnim : 1 }] }}
                            >
                                <TouchableOpacity
                                    onLongPress={() => handleLineLongPress(line)}
                                    activeOpacity={0.7}
                                    delayLongPress={300}
                                    style={[
                                        styles.lineContainer,
                                        highlight && {
                                            backgroundColor: highlight.color,
                                            borderLeftWidth: 3,
                                            borderLeftColor: highlight.textColor || '#5D4037',
                                        }
                                    ]}
                                >
                                    <Text style={styles.lyrics}>{line.text || ' '}</Text>
                                    {highlight?.categoryId && (
                                        <View style={[styles.lineCategoryDot, { backgroundColor: highlight.textColor }]} />
                                    )}
                                </TouchableOpacity>
                            </Animated.View>
                        );
                    })}
                </View>
            </ScrollView>

            {/* Action Modal */}
            <Modal
                visible={showActionModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowActionModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <TouchableOpacity
                        style={styles.modalDismissArea}
                        activeOpacity={1}
                        onPress={() => setShowActionModal(false)}
                    />
                    <View style={styles.modalContent}>
                        {/* Modal Handle */}
                        <View style={styles.modalHandle} />

                        {/* Selected Line Preview */}
                        {selectedLine && (
                            <View style={styles.linePreview}>
                                <Text style={styles.linePreviewText} numberOfLines={2}>
                                    "{selectedLine.text}"
                                </Text>
                            </View>
                        )}

                        {/* Highlight Categories */}
                        <Text style={styles.modalSectionTitle}>Highlight As</Text>
                        <View style={styles.categoriesGrid}>
                            {HIGHLIGHT_PRESETS.map((cat) => {
                                const IconComponent = getCategoryIcon(cat.icon);
                                const existingHighlight = selectedLine && getLineHighlight(selectedLine.index);
                                const isActive = existingHighlight?.categoryId === cat.id;

                                return (
                                    <TouchableOpacity
                                        key={cat.id}
                                        style={[
                                            styles.categoryCard,
                                            { backgroundColor: cat.color },
                                            isActive && styles.categoryCardActive,
                                        ]}
                                        onPress={() => handleHighlight(cat)}
                                    >
                                        <View style={[styles.categoryIconContainer, { backgroundColor: cat.textColor + '20' }]}>
                                            <IconComponent size={18} color={cat.textColor} />
                                        </View>
                                        <Text style={[styles.categoryCardName, { color: cat.textColor }]}>
                                            {cat.name}
                                        </Text>
                                        {isActive && (
                                            <View style={[styles.activeCheck, { backgroundColor: cat.textColor }]}>
                                                <Check size={10} color="#fff" />
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        {/* Remove Highlight Button */}
                        {selectedLine && getLineHighlight(selectedLine.index) && (
                            <TouchableOpacity style={styles.removeButton} onPress={removeHighlight}>
                                <Trash2 size={18} color="#EF5350" />
                                <Text style={styles.removeButtonText}>Remove Highlight</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    header: {
        padding: 24,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
        color: Colors.light.primary,
    },
    category: {
        fontSize: 16,
        color: '#666',
    },
    hint: {
        fontSize: 12,
        color: '#999',
        marginTop: 8,
    },
    content: {
        padding: 20,
    },
    lineContainer: {
        paddingVertical: 4,
        paddingHorizontal: 12,
        marginHorizontal: -8,
        marginVertical: 1,
        borderRadius: 6,
        flexDirection: 'row',
        alignItems: 'center',
    },
    lyrics: {
        flex: 1,
        fontSize: 18,
        lineHeight: 28,
        color: '#333',
        textAlign: 'center',
    },
    lineCategoryDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginLeft: 8,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    modalDismissArea: {
        flex: 1,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 20,
        paddingBottom: 36,
    },
    modalHandle: {
        width: 40,
        height: 4,
        backgroundColor: '#E0E0E0',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 16,
    },
    linePreview: {
        backgroundColor: '#F8F8F8',
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
    },
    linePreviewText: {
        fontSize: 15,
        fontStyle: 'italic',
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
    },
    modalSectionTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#333',
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    categoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 20,
    },
    categoryCard: {
        width: '31%',
        padding: 12,
        borderRadius: 12,
        alignItems: 'center',
        position: 'relative',
    },
    categoryCardActive: {
        borderWidth: 2,
        borderColor: '#333',
    },
    categoryIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 6,
    },
    categoryCardName: {
        fontSize: 11,
        fontWeight: '600',
        textAlign: 'center',
    },
    activeCheck: {
        position: 'absolute',
        top: 6,
        right: 6,
        width: 16,
        height: 16,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    removeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        backgroundColor: '#FFEBEE',
        borderRadius: 12,
        gap: 8,
    },
    removeButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#EF5350',
    },
});
