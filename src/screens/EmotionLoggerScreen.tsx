/**
 * Emotion Logger Screen for Calmi
 * Sticky emotion tags with koala images and descriptor popups.
 */

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
  Modal,
  Animated,
  FlatList,
} from 'react-native'
import React, { useState } from 'react'
import HapticFeedback from 'react-native-haptic-feedback'
import { useTheme } from '../theme/ThemeContext'
import { useEmotion } from '../context/EmotionContext'
import { EmotionTag, EMOTION_CONFIG } from '../types/emotion'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

const EmotionLoggerScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const { colors, typography: typo } = useTheme()
  const { logEmotion } = useEmotion()
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionTag | null>(null)
  const [descriptorsVisible, setDescriptorsVisible] = useState(false)
  const [scaleAnim] = useState(new Animated.Value(1))

  const handleTagPress = async (emotion: EmotionTag) => {
    HapticFeedback.trigger('impactLight')
    setSelectedEmotion(emotion)
    
    // Animate
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start()

    // Log mood
    await logEmotion(emotion, EMOTION_CONFIG[emotion as EmotionTag].descriptors[0]!)

    // Show descriptors
    setDescriptorsVisible(true)
  }

  const closeDescriptors = () => {
    setDescriptorsVisible(false)
  }

  const renderStickyTag = (emotion: EmotionTag) => {
    const config = EMOTION_CONFIG[emotion as EmotionTag]
    const isSelected = selectedEmotion === emotion

    return (
      <TouchableOpacity
        key={emotion}
        style={[
          styles.stickyTag,
          {
            backgroundColor: config.color + '20',
            borderColor: config.color,
            shadowColor: config.color,
          },
          isSelected && styles.stickyTagSelected,
        ]}
        onPress={() => handleTagPress(emotion)}
        activeOpacity={0.8}>
          <Image source={config.koalaImage} style={styles.koalaImage} />
          <Text style={[styles.tagLabel, { color: config.color }]}>
          {config.label}
        </Text>
      </TouchableOpacity>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation?.goBack()}>
          <Text style={[typo.h3, { color: colors.text }]}>Mood Tags</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={[typo.body, styles.prompt, { color: colors.textSecondary }]}>
          Tap a koala to log your current mood
        </Text>

        {/* Sticky Tags Grid */}
        <View style={styles.tagsGrid}>
          {(['happy', 'sad', 'angry', 'anxious', 'calm'] as EmotionTag[]).map(renderStickyTag)}
        </View>

        {/* Recent Moods */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[typo.h4, { color: colors.text, marginBottom: 16 }]}>Recent</Text>
          <FlatList
            data={[]}
            renderItem={({ item }) => (
              <View style={styles.recentItem}>
                <Text style={styles.recentTime}>2min ago</Text>
                <Text style={styles.recentMood}>Happy • joyful</Text>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
            horizontal
          />
        </View>
      </ScrollView>

      {/* Descriptors Modal */}
      <Modal
        visible={descriptorsVisible}
        transparent
        animationType="fade"
        onRequestClose={closeDescriptors}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={[typo.h4, { color: colors.text, marginBottom: 16 }]}>
              How {selectedEmotion ? EMOTION_CONFIG[selectedEmotion as EmotionTag].label : ''} feels:
            </Text>
            <FlatList
              data={selectedEmotion ? EMOTION_CONFIG[selectedEmotion as EmotionTag].descriptors : []}
              renderItem={({ item }: { item: string }) => (
                <TouchableOpacity style={styles.descriptorChip}>
                  <Text style={[typo.body, { color: colors.textSecondary }]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={item => item}
              numColumns={2}
              columnWrapperStyle={styles.descriptorRow}
            />
            <TouchableOpacity style={[styles.modalButton, { backgroundColor: colors.primary }]} onPress={closeDescriptors}>
              <Text style={[typo.button, { color: colors.textInverse }]}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  prompt: {
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  tagsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 40,
  },
  stickyTag: {
    width: 100,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderRadius: 16,
  },
  stickyTagSelected: {
    borderWidth: 3,
    shadowOpacity: 0.5,
  },
  koalaImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  tagLabel: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  section: {
    padding: 20,
    borderRadius: 16,
    marginTop: 20,
  },
  recentItem: {
    padding: 12,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: '#f8f9fa',
  },
  recentTime: {
    fontSize: 11,
    color: '#6c757d',
  },
  recentMood: {
    fontWeight: '600',
    color: '#212529',
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 20,
    width: '85%',
    maxHeight: '70%',
  },
  descriptorRow: {
    justifyContent: 'space-between',
  },
  descriptorChip: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 12,
    margin: 4,
    alignItems: 'center',
  },
  modalButton: {
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
})

export default EmotionLoggerScreen

