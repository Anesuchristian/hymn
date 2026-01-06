import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Pressable } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { commissionChapters } from '../constants/commissionChapters';
import { commissionChaptersPart2 } from '../constants/commissionChaptersPart2';

export default function CommissionChapterScreen() {
  const router = useRouter();
  const { chapterNumber, initialLanguage, bookId } = useLocalSearchParams();
  const [language, setLanguage] = useState(initialLanguage || 'en');

  // Debug log
  console.log('CommissionChapterScreen params:', { chapterNumber, initialLanguage, bookId });

  // Select correct data source based on bookId
  const chaptersData = bookId === '2' ? commissionChaptersPart2 : commissionChapters;
  const chapterData = chaptersData[chapterNumber]?.[language];

  // Debug log
  console.log('chapterData:', chapterData ? 'found' : 'not found', 'content type:', typeof chapterData?.content);

  const bookTitle = bookId === '2' 
    ? 'Divine Commission Part 2'
    : 'Divine Commission Part 1';

  // Function to render text with bold markers
  const renderTextWithBold = (text, index) => {
    // Safety check - ensure text is a string
    if (!text || typeof text !== 'string') return null;
    
    // Split by **text** pattern for bold
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    
    return (
      <Text key={index} style={styles.content}>
        {parts.map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <Text key={i} style={styles.boldText}>
                {part.slice(2, -2)}
              </Text>
            );
          }
          return part;
        })}
      </Text>
    );
  };

  if (!chapterData) {
    return (
      <View style={styles.mainContainer}>
        <Stack.Screen 
          options={{ 
            title: `Chapter ${chapterNumber}`,
            headerStyle: { backgroundColor: '#FFF9F0' },
            headerTintColor: '#A08060',
          }} 
        />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>{bookTitle}</Text>
          <Text style={styles.chapter}>Chapter {chapterNumber}</Text>
          <Text style={styles.content}>Content not available.</Text>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <Stack.Screen 
        options={{ 
          title: chapterData.title,
          headerStyle: { backgroundColor: '#FFF9F0' },
          headerTintColor: '#A08060',
        }} 
      />
      
      {/* Language Toggle - Fixed at top */}
      <View style={styles.toggleWrapper}>
        <View style={styles.toggleContainer}>
          <Pressable
            style={[styles.toggleOption, language === 'sn' && styles.activeToggle]}
            onPress={() => setLanguage('sn')}
          >
            <Text style={[styles.toggleText, language === 'sn' && styles.activeToggleText]}>Shona</Text>
          </Pressable>
          <Pressable
            style={[styles.toggleOption, language === 'en' && styles.activeToggle]}
            onPress={() => setLanguage('en')}
          >
            <Text style={[styles.toggleText, language === 'en' && styles.activeToggleText]}>English</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>{bookTitle}</Text>
        <Text style={styles.chapter}>{chapterData.title}</Text>
        
        {chapterData.subtitle && (
          <Text style={styles.subtitle}>{chapterData.subtitle}</Text>
        )}
        
        {/* Content */}
        {chapterData.content && Array.isArray(chapterData.content) && chapterData.content.map((paragraph, index) => 
          renderTextWithBold(paragraph, index)
        )}
        
        {/* Footnote */}
        {chapterData.footnote && (
          <View style={styles.footnoteContainer}>
            <Text style={styles.footnoteLabel}>Footnote:</Text>
            {renderTextWithBold(chapterData.footnote, 'footnote')}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFF9F0',
  },
  toggleWrapper: {
    backgroundColor: '#FFF9F0',
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EDE5D8',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#EDE5D8',
    borderRadius: 20,
    padding: 4,
  },
  toggleOption: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 16,
  },
  activeToggle: {
    backgroundColor: '#A08060',
  },
  toggleText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeToggleText: {
    color: '#fff',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#A08060',
  },
  chapter: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#4A90D9',
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#666',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  content: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 12,
  },
  boldText: {
    fontWeight: 'bold',
  },
  footnoteContainer: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#F5EEE5',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#A08060',
  },
  footnoteLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#A08060',
    marginBottom: 6,
  },
});
