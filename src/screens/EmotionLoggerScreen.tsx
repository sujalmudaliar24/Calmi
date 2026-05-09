import React, { useState } from 'react'
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
import HapticFeedback from 'react-native-haptic-feedback'
import { useTheme } from '../theme'
import { useEmotion } from '../context/EmotionContext'
import { EmotionTag, EMOTION_CONFIG } from '../types/emotion'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

const EmotionLoggerScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const { colors, typography: typo, borderRadius: radii } = useTheme()
  const { logEmotion, recentMoods } = useEmotion()
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionTag | null>(null)
  const [selectedSubEmotion, setSelectedSubEmotion] = useState<string | null>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [scaleAnim] = useState(new Animated.Value(1))

  const handleTagPress = (emotion: EmotionTag) => {
    HapticFeedback.trigger('impactLight')
    setSelectedEmotion(emotion)

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

    setModalVisible(true)
  }

  const handleSubEmotionPress = async (subEmotion: string) => {
    HapticFeedback.trigger('impactMedium')
    setSelectedSubEmotion(subEmotion)

    // Log the final combined mood
    await logEmotion(selectedEmotion!, subEmotion)

    // Close modal with a slight delay for feedback
    setTimeout(() => {
      setModalVisible(false)
      setSelectedEmotion(null)
      setSelectedSubEmotion(null)
    }, 300)
  }

  const renderStickyTag = (emotion: EmotionTag) => {
    const config = EMOTION_CONFIG[emotion]
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
            borderRadius: radii.lg,
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
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation?.goBack()}>
          <Text style={[typo.h3, { color: colors.text }]}>Mood Log</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={[typo.body, styles.prompt, { color: colors.textSecondary }]}>
          How are you feeling right now?
        </Text>

        <View style={styles.tagsGrid}>
          {(['happy', 'sad', 'angry', 'anxious', 'calm'] as EmotionTag[]).map(renderStickyTag)}
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface, borderRadius: radii.lg }]}>
          <Text style={[typo.h4, { color: colors.text, marginBottom: 16 }]}>Recent Moods</Text>
          <FlatList
            data={recentMoods}
            renderItem={({ item }) => (
              <View style={[styles.recentItem, { backgroundColor: colors.surfaceSecondary, borderRadius: radii.sm }]}>
                <Text style={[styles.recentTime, { color: colors.textTertiary }]}>
                  {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
                <Text style={[styles.recentMood, { color: colors.text }]}>
                  {item.emotion} • {item.subEmotion}
                </Text>
              </View>
            )}
            keyExtractor={(item) => item.timestamp.toString()}
            showsHorizontalScrollIndicator={false}
            horizontal
          />
        </View>
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface, borderRadius: radii.xl }]}>
            <Text style={[typo.h4, { color: colors.text, marginBottom: 16 }]}>
              Which one describes it best?
            </Text>
            <View style={styles.descriptorGrid}>
              {selectedEmotion ? EMOTION_CONFIG[selectedEmotion].descriptors.map((desc) => (
                <TouchableOpacity
                  key={desc}
                  style={[
                    styles.descriptorChip,
                    {
                      backgroundColor: selectedSubEmotion === desc ? colors.primaryLight : colors.surfaceSecondary,
                      borderColor: selectedSubHEmotion === desc ? colors.primary : 'transparent',
                      borderRadius: radii.md,
                    }
                  ]}
                  onPress={() => handleSubEmotionPress(desc)}>
                  <Text style={[typo.body, { color: selectedSubEmotion === desc ? colors.primaryDark : colors.text }]}>
                    {desc}
                  </Text>
                </TouchableOpacity>
              )) : []}
            </View>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.primary, borderRadius: radii.md }]}
              onPress={() => setModalVisible(false)}>
              <Text style={[typo.button, { color: colors.textInverse }]}>Cancel</Text>
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
  },
  stickyTagSelected: {
    borderWidth: 4,
    transform: [{ scale: 1.05 }],
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
    marginTop: 20,
    width: '100%',
  },
  recentItem: {
    padding: 12,
    marginRight: 12,
  },
  recentTime: {
    fontSize: 11,
  },
  recentMood: {
    fontWeight: '600',
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    padding: 24,
    width: '100%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '60%',
  },
  descriptorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  descriptorChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    alignItems: 'center',
    minWidth: '30%',
  },
  modalButton: {
    padding: 16,
    alignItems: 'center',
  },
})

export default EmotionLoggerScreen
