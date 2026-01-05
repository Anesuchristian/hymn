import React, { useState, useCallback, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Dimensions,
    Vibration,
    Platform,
} from 'react-native';
import { Highlighter, Copy, Heart, Trash2, Share2 } from 'lucide-react-native';

const HIGHLIGHT_COLORS = [
    { id: 'yellow', color: '#FFE082', name: 'Yellow' },
    { id: 'green', color: '#A5D6A7', name: 'Green' },
    { id: 'blue', color: '#90CAF9', name: 'Blue' },
    { id: 'pink', color: '#F8BBD9', name: 'Pink' },
    { id: 'orange', color: '#FFCC80', name: 'Orange' },
    { id: 'purple', color: '#CE93D8', name: 'Purple' },
];

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * SelectableText - PDF-style text selection and highlighting
 * Allows users to select text ranges and apply highlights
 */
export default function SelectableText({
    text,
    verseNumber,
    verseKey,
    highlights = [],
    onHighlight,
    onRemoveHighlight,
    onCopy,
    onShare,
    onFavorite,
    isFavorite,
    fontSize = 18,
    style,
}) {
    const [selection, setSelection] = useState(null);
    const [showToolbar, setShowToolbar] = useState(false);
    const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [selectionStart, setSelectionStart] = useState(null);
    const [selectionEnd, setSelectionEnd] = useState(null);
    const [isSelecting, setIsSelecting] = useState(false);

    // Parse text into characters for selection
    const characters = useMemo(() => {
        return text.split('').map((char, index) => ({
            char,
            index,
        }));
    }, [text]);

    // Get highlight color for a character position
    const getHighlightAt = useCallback((index) => {
        for (const highlight of highlights) {
            if (index >= highlight.start && index < highlight.end) {
                return highlight.color;
            }
        }
        return null;
    }, [highlights]);

    // Group consecutive characters with same highlight
    const textSegments = useMemo(() => {
        if (!text) return [];
        
        const segments = [];
        let currentSegment = { text: '', start: 0, color: getHighlightAt(0) };
        
        for (let i = 0; i < text.length; i++) {
            const color = getHighlightAt(i);
            
            if (color === currentSegment.color) {
                currentSegment.text += text[i];
            } else {
                if (currentSegment.text) {
                    segments.push({ ...currentSegment, end: i });
                }
                currentSegment = { text: text[i], start: i, color };
            }
        }
        
        if (currentSegment.text) {
            segments.push({ ...currentSegment, end: text.length });
        }
        
        return segments;
    }, [text, getHighlightAt]);

    // Handle word tap - select the word
    const handleWordPress = useCallback((wordStart, wordEnd) => {
        Vibration.vibrate(30);
        setSelectionStart(wordStart);
        setSelectionEnd(wordEnd);
        setSelection({ start: wordStart, end: wordEnd, text: text.substring(wordStart, wordEnd) });
        setShowToolbar(true);
    }, [text]);

    // Handle long press to start selection mode
    const handleLongPress = useCallback((index) => {
        Vibration.vibrate(50);
        // Find word boundaries
        let start = index;
        let end = index;
        
        // Find start of word
        while (start > 0 && !/\s/.test(text[start - 1])) {
            start--;
        }
        
        // Find end of word
        while (end < text.length && !/\s/.test(text[end])) {
            end++;
        }
        
        setSelectionStart(start);
        setSelectionEnd(end);
        setSelection({ start, end, text: text.substring(start, end) });
        setIsSelecting(true);
        setShowToolbar(true);
    }, [text]);

    // Extend selection
    const handleSelectionExtend = useCallback((index) => {
        if (!isSelecting || selectionStart === null) return;
        
        // Find word end at this position
        let end = index;
        while (end < text.length && !/\s/.test(text[end])) {
            end++;
        }
        
        const newStart = Math.min(selectionStart, index);
        const newEnd = Math.max(selectionEnd, end);
        
        setSelectionEnd(newEnd);
        if (index < selectionStart) {
            setSelectionStart(newStart);
        }
        
        setSelection({ 
            start: newStart, 
            end: newEnd, 
            text: text.substring(newStart, newEnd) 
        });
    }, [isSelecting, selectionStart, selectionEnd, text]);

    // Handle highlight color selection
    const handleHighlight = useCallback((color) => {
        if (selection && onHighlight) {
            onHighlight({
                start: selection.start,
                end: selection.end,
                text: selection.text,
                color: color.color,
                colorId: color.id,
            });
        }
        closeToolbar();
    }, [selection, onHighlight]);

    // Remove highlight from selection
    const handleRemoveHighlight = useCallback(() => {
        if (selection && onRemoveHighlight) {
            onRemoveHighlight({
                start: selection.start,
                end: selection.end,
            });
        }
        closeToolbar();
    }, [selection, onRemoveHighlight]);

    // Copy selection
    const handleCopy = useCallback(() => {
        if (selection && onCopy) {
            onCopy(selection.text);
        }
        closeToolbar();
    }, [selection, onCopy]);

    // Share selection
    const handleShare = useCallback(() => {
        if (selection && onShare) {
            onShare(selection.text);
        }
        closeToolbar();
    }, [selection, onShare]);

    // Close toolbar
    const closeToolbar = () => {
        setShowToolbar(false);
        setShowColorPicker(false);
        setSelection(null);
        setSelectionStart(null);
        setSelectionEnd(null);
        setIsSelecting(false);
    };

    // Check if position is in current selection
    const isSelected = (index) => {
        if (!selection) return false;
        return index >= selection.start && index < selection.end;
    };

    // Check if selection overlaps with existing highlight
    const selectionHasHighlight = useMemo(() => {
        if (!selection) return false;
        return highlights.some(h => 
            (selection.start >= h.start && selection.start < h.end) ||
            (selection.end > h.start && selection.end <= h.end) ||
            (selection.start <= h.start && selection.end >= h.end)
        );
    }, [selection, highlights]);

    // Render text with selections and highlights
    const renderText = () => {
        const words = [];
        let currentWord = { text: '', start: 0 };
        
        for (let i = 0; i <= text.length; i++) {
            if (i === text.length || /\s/.test(text[i])) {
                if (currentWord.text) {
                    words.push({
                        ...currentWord,
                        end: i,
                    });
                }
                if (i < text.length) {
                    // Add whitespace
                    words.push({
                        text: text[i],
                        start: i,
                        end: i + 1,
                        isSpace: true,
                    });
                }
                currentWord = { text: '', start: i + 1 };
            } else {
                currentWord.text += text[i];
            }
        }
        
        return words.map((word, idx) => {
            if (word.isSpace) {
                return <Text key={idx}> </Text>;
            }
            
            // Check highlights for each character in word
            const wordChars = [];
            for (let i = word.start; i < word.end; i++) {
                const highlightColor = getHighlightAt(i);
                const selected = isSelected(i);
                
                wordChars.push({
                    char: text[i],
                    index: i,
                    highlightColor,
                    selected,
                });
            }
            
            // Group by same style
            const groups = [];
            let currentGroup = null;
            
            for (const char of wordChars) {
                const key = `${char.highlightColor || 'none'}-${char.selected}`;
                if (!currentGroup || currentGroup.key !== key) {
                    if (currentGroup) groups.push(currentGroup);
                    currentGroup = {
                        key,
                        text: char.char,
                        highlightColor: char.highlightColor,
                        selected: char.selected,
                        start: char.index,
                    };
                } else {
                    currentGroup.text += char.char;
                }
            }
            if (currentGroup) groups.push(currentGroup);
            
            return (
                <Text key={idx}>
                    {groups.map((group, gIdx) => (
                        <Text
                            key={gIdx}
                            onPress={() => handleWordPress(word.start, word.end)}
                            onLongPress={() => handleLongPress(word.start)}
                            onPressIn={() => isSelecting && handleSelectionExtend(word.start)}
                            style={[
                                { fontSize },
                                group.highlightColor && { 
                                    backgroundColor: group.highlightColor,
                                    borderRadius: 2,
                                },
                                group.selected && styles.selectedText,
                            ]}
                        >
                            {group.text}
                        </Text>
                    ))}
                </Text>
            );
        });
    };

    return (
        <View style={[styles.container, style]}>
            <Text style={[styles.text, { fontSize, lineHeight: fontSize * 1.6 }]}>
                <Text style={[styles.verseNumber, { fontSize: fontSize - 4 }]}>{verseNumber} </Text>
                {renderText()}
            </Text>
            
            {/* Selection Toolbar */}
            <Modal
                visible={showToolbar}
                transparent
                animationType="fade"
                onRequestClose={closeToolbar}
            >
                <TouchableOpacity 
                    style={styles.toolbarOverlay}
                    activeOpacity={1}
                    onPress={closeToolbar}
                >
                    <View style={styles.toolbarContainer}>
                        {/* Selection Preview */}
                        {selection && (
                            <View style={styles.selectionPreview}>
                                <Text style={styles.selectionPreviewText} numberOfLines={2}>
                                    "{selection.text}"
                                </Text>
                            </View>
                        )}
                        
                        {showColorPicker ? (
                            /* Color Picker */
                            <View style={styles.colorPickerContainer}>
                                <Text style={styles.colorPickerTitle}>Choose highlight color</Text>
                                <View style={styles.colorRow}>
                                    {HIGHLIGHT_COLORS.map((color) => (
                                        <TouchableOpacity
                                            key={color.id}
                                            style={[styles.colorButton, { backgroundColor: color.color }]}
                                            onPress={() => handleHighlight(color)}
                                        >
                                            <View style={styles.colorButtonInner} />
                                        </TouchableOpacity>
                                    ))}
                                </View>
                                <TouchableOpacity 
                                    style={styles.backButton}
                                    onPress={() => setShowColorPicker(false)}
                                >
                                    <Text style={styles.backButtonText}>Back</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            /* Main Toolbar */
                            <View style={styles.toolbar}>
                                <TouchableOpacity 
                                    style={styles.toolbarButton}
                                    onPress={() => setShowColorPicker(true)}
                                >
                                    <Highlighter size={20} color="#333" />
                                    <Text style={styles.toolbarButtonText}>Highlight</Text>
                                </TouchableOpacity>
                                
                                {selectionHasHighlight && (
                                    <TouchableOpacity 
                                        style={styles.toolbarButton}
                                        onPress={handleRemoveHighlight}
                                    >
                                        <Trash2 size={20} color="#EF5350" />
                                        <Text style={[styles.toolbarButtonText, { color: '#EF5350' }]}>Remove</Text>
                                    </TouchableOpacity>
                                )}
                                
                                <TouchableOpacity 
                                    style={styles.toolbarButton}
                                    onPress={handleCopy}
                                >
                                    <Copy size={20} color="#333" />
                                    <Text style={styles.toolbarButtonText}>Copy</Text>
                                </TouchableOpacity>
                                
                                {onShare && (
                                    <TouchableOpacity 
                                        style={styles.toolbarButton}
                                        onPress={handleShare}
                                    >
                                        <Share2 size={20} color="#333" />
                                        <Text style={styles.toolbarButtonText}>Share</Text>
                                    </TouchableOpacity>
                                )}
                                
                                {onFavorite && (
                                    <TouchableOpacity 
                                        style={styles.toolbarButton}
                                        onPress={onFavorite}
                                    >
                                        <Heart 
                                            size={20} 
                                            color={isFavorite ? '#E91E63' : '#333'} 
                                            fill={isFavorite ? '#E91E63' : 'none'}
                                        />
                                        <Text style={styles.toolbarButtonText}>
                                            {isFavorite ? 'Saved' : 'Save'}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 8,
        paddingHorizontal: 4,
    },
    text: {
        color: '#333',
        textAlign: 'justify',
    },
    verseNumber: {
        fontWeight: '800',
        color: '#8B4513',
    },
    selectedText: {
        backgroundColor: '#B3E5FC',
        borderRadius: 2,
    },
    toolbarOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    toolbarContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        width: SCREEN_WIDTH - 48,
        maxWidth: 360,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
    },
    selectionPreview: {
        backgroundColor: '#F5F5F5',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    selectionPreviewText: {
        fontSize: 14,
        color: '#666',
        fontStyle: 'italic',
        textAlign: 'center',
    },
    toolbar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        gap: 8,
    },
    toolbarButton: {
        alignItems: 'center',
        padding: 12,
        minWidth: 70,
    },
    toolbarButtonText: {
        fontSize: 11,
        color: '#333',
        marginTop: 4,
        fontWeight: '500',
    },
    colorPickerContainer: {
        alignItems: 'center',
    },
    colorPickerTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 16,
    },
    colorRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
        marginBottom: 16,
    },
    colorButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
    },
    colorButtonInner: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: 'rgba(255,255,255,0.5)',
    },
    backButton: {
        paddingVertical: 8,
        paddingHorizontal: 24,
    },
    backButtonText: {
        fontSize: 14,
        color: '#666',
    },
});
