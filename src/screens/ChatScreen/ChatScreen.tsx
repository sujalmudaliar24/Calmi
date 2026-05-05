/**
 * AI Chat Screen for Calmi
 *
 * Conversational interface with the AI wellness companion.
 * Features:
 * - NLP Cloud Chatbot API for AI responses
 * - Sentiment analysis from user messages
 * - Mood detection with visual feedback
 * - Suggested wellness actions
 * - Vector icons (no emojis)
 */

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useTheme } from '../../theme'
import { chatbotService, ChatMessage } from '../../services/api/chatbotService'
import { EmotionCategory } from '../../services/api/sentimentService'

// AI personality
const AI_PERSONA = {
  name: 'Calmi',
  greeting: "Hi there! I'm Calmi, your wellness companion. How are you feeling today?",
}

// Wellness suggestions with vector icons
const WELLNESS_SUGGESTIONS = [
  { icon: 'weather-windy', text: 'Take a breathing break', action: 'breathing' },
  { icon: 'heart-outline', text: 'Gratitude practice', action: 'gratitude' },
  { icon: 'book-outline', text: 'Write in journal', action: 'journaling' },
  { icon: 'walk', text: 'Go for a short walk', action: 'movement' },
]

// Emotion icon mapping
const EMOTION_ICONS: Record<EmotionCategory, string> = {
  happy: 'emoticon-happy-outline',
  calm: 'meditation',
  anxious: 'emoticon-confused-outline',
  sad: 'emoticon-sad-outline',
  stressed: 'lightning-bolt',
  angry: 'emoticon-angry-outline',
  neutral: 'emoticon-neutral-outline',
}

// Emotion color mapping
const EMOTION_COLORS: Record<EmotionCategory, string> = {
  happy: '#FFD166',
  calm: '#7ECFBE',
  anxious: '#FFB5A7',
  sad: '#B8A9E8',
  stressed: '#FF8A7A',
  angry: '#FF7B7B',
  neutral: '#A8A2B8',
}

interface ChatBubbleProps {
  message: ChatMessage
  colors: any
  typography: any
  formatTime: (timestamp: number) => string
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, colors, typography, formatTime }) => {
  const isUser = message.role === 'user'
  const isAI = message.role === 'ai'

  return (
    <View style={[styles.messageRow, isUser ? styles.userMessageRow : styles.aiMessageRow]}>
      {isAI && (
        <View style={[styles.avatar, { backgroundColor: colors.primaryLight }]}>
          <Icon name="leaf" size={20} color={colors.primary} />
        </View>
      )}

      <View
        style={[
          styles.messageBubble,
          isUser
            ? [styles.userBubble, { backgroundColor: colors.primary }]
            : [styles.aiBubble, { backgroundColor: colors.surface, borderColor: colors.border }],
        ]}>
        {message.isTyping ? (
          <View style={styles.typingContainer}>
            <View style={[styles.typingDot, { backgroundColor: colors.textTertiary }]} />
            <View style={[styles.typingDot, { backgroundColor: colors.textTertiary }]} />
            <View style={[styles.typingDot, { backgroundColor: colors.textTertiary }]} />
          </View>
        ) : (
          <>
            <Text style={[typography.body, styles.messageText, { color: isUser ? colors.textInverse : colors.text }]}>
              {message.content}
            </Text>
            <Text style={[typography.caption, styles.timestamp, { color: isUser ? colors.textInverse + '80' : colors.textTertiary }]}>
              {formatTime(message.timestamp)}
            </Text>
          </>
        )}
      </View>

      {isUser && (
        <View style={[styles.avatar, { backgroundColor: colors.secondary }]}>
          <Icon name="account-outline" size={18} color={colors.textInverse} />
        </View>
      )}
    </View>
  )
}

interface SuggestionChipProps {
  icon: string
  text: string
  onPress: () => void
  colors: any
}

const SuggestionChip: React.FC<SuggestionChipProps> = ({ icon, text, onPress, colors }) => (
  <TouchableOpacity
    style={[styles.suggestionChip, { backgroundColor: colors.surfaceSecondary }]}
    onPress={onPress}
    activeOpacity={0.7}>
    <Icon name={icon} size={16} color={colors.primary} />
    <Text style={[styles.suggestionText, { color: colors.text }]}>{text}</Text>
  </TouchableOpacity>
)

interface MoodIndicatorProps {
  emotion: EmotionCategory
  colors: any
}

const MoodIndicator: React.FC<MoodIndicatorProps> = ({ emotion, colors }) => (
  <View style={[styles.moodIndicator, { backgroundColor: colors.surfaceSecondary }]}>
    <Icon name={EMOTION_ICONS[emotion]} size={16} color={EMOTION_COLORS[emotion]} />
    <Text style={[styles.moodText, { color: colors.textSecondary }]}>
      Feeling {emotion}
    </Text>
  </View>
)

interface Props {
  navigation?: any
  initialMessage?: string
}

const ChatScreen: React.FC<Props> = ({ navigation, initialMessage }) => {
  const { colors, borderRadius: radii, typography: typo } = useTheme()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentEmotion, setCurrentEmotion] = useState<EmotionCategory | null>(null)
  const flatListRef = useRef<FlatList>(null)
  const inputRef = useRef<TextInput>(null)

  useEffect(() => {
    initializeChat()
  }, [])

  useEffect(() => {
    if (initialMessage) {
      handleSendMessage(initialMessage)
    }
  }, [initialMessage])

  const initializeChat = async () => {
    await chatbotService.initialize()
    setMessages([
      {
        id: '1',
        role: 'ai',
        content: AI_PERSONA.greeting,
        timestamp: Date.now(),
      },
    ])
  }

  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputText.trim()
    if (!messageText) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: Date.now(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsLoading(true)

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true })
    }, 100)

    try {
      // Add typing indicator
      const typingMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: '',
        timestamp: Date.now(),
        isTyping: true,
      }
      setMessages(prev => [...prev, typingMessage])

      // Get AI response using NLP Cloud
      const response = await chatbotService.sendMessage(
        messageText,
        (emotion) => setCurrentEmotion(emotion)
      )

      // Remove typing indicator
      setMessages(prev => prev.filter(m => !m.isTyping))

      const aiMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        role: 'ai',
        content: response,
        timestamp: Date.now(),
        sentiment: currentEmotion || undefined,
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('[ChatScreen] Error:', error)
      setMessages(prev => prev.filter(m => !m.isTyping))
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 3).toString(),
          role: 'ai',
          content: "I'm sorry, I'm having trouble responding right now. Let's try again.",
          timestamp: Date.now(),
        },
      ])
    } finally {
      setIsLoading(false)
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true })
      }, 100)
    }
  }

  const handleQuickAction = (action: string) => {
    const actionMap: Record<string, string> = {
      breathing: "Let's take a moment together. Close your eyes and take 4 deep breaths.",
      gratitude: "That's great! As you think about gratitude, what's one thing that made you smile recently?",
      journaling: "Journaling can help process feelings. What's something you'd like to reflect on?",
      movement: "A short walk can do wonders! Even just 5 minutes outside can boost your mood.",
    }
    handleSendMessage(actionMap[action] || "That's a wonderful idea!")
  }

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <ChatBubble message={item} colors={colors} typography={typo} formatTime={formatTime} />
  )

  const renderSuggestions = () => (
    <View style={styles.suggestionsContainer}>
      {WELLNESS_SUGGESTIONS.map((suggestion, index) => (
        <SuggestionChip
          key={index}
          icon={suggestion.icon}
          text={suggestion.text}
          onPress={() => handleQuickAction(suggestion.action)}
          colors={colors}
        />
      ))}
    </View>
  )

  const renderMoodIndicator = () => {
    if (!currentEmotion) return null
    return <MoodIndicator emotion={currentEmotion} colors={colors} />
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation?.goBack()}>
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View style={[styles.headerAvatar, { backgroundColor: colors.primaryLight }]}>
            <Icon name="leaf" size={24} color={colors.primary} />
          </View>
          <View>
            <Text style={[typo.h4, { color: colors.text }]}>{AI_PERSONA.name}</Text>
            <View style={styles.statusRow}>
              <View style={[styles.statusDot, { backgroundColor: colors.success }]} />
              <Text style={[typo.caption, { color: colors.textSecondary }]}>Online</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => {}}>
          <Icon name="dots-vertical" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Mood Indicator */}
      {renderMoodIndicator()}

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        ListFooterComponent={renderSuggestions}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {/* Input */}
      <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <View style={[styles.inputWrapper, { backgroundColor: colors.surfaceSecondary, borderRadius: radii.xl }]}>
          <TextInput
            ref={inputRef}
            style={[styles.textInput, { color: colors.text }]}
            placeholder="Share what's on your mind..."
            placeholderTextColor={colors.placeholder}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              { backgroundColor: inputText.trim() ? colors.primary : colors.disabled },
            ]}
            onPress={() => handleSendMessage()}
            disabled={!inputText.trim() || isLoading}>
            <Icon name="send" size={20} color={colors.textInverse} />
          </TouchableOpacity>
        </View>
        <View style={styles.disclaimerRow}>
          <Icon name="shield-outline" size={12} color={colors.textTertiary} />
          <Text style={[typo.caption, styles.disclaimer, { color: colors.textTertiary }]}>
            Not a medical professional
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

export default ChatScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  menuButton: {
    padding: 8,
    marginRight: -8,
  },
  moodIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  moodText: {
    fontSize: 13,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 16,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  userMessageRow: {
    flexDirection: 'row-reverse',
  },
  aiMessageRow: {
    flexDirection: 'row',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 24,
    position: 'relative',
  },
  userBubble: {
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderTopLeftRadius: 20,
  },
  aiBubble: {
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
  },
  messageText: {
    lineHeight: 22,
  },
  timestamp: {
    position: 'absolute',
    bottom: 8,
    right: 12,
  },
  typingContainer: {
    flexDirection: 'row',
    gap: 4,
    paddingVertical: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    opacity: 0.5,
  },
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
    paddingBottom: 16,
  },
  suggestionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  suggestionText: {
    fontSize: 13,
    fontWeight: '500',
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    borderTopWidth: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 48,
    maxHeight: 120,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    paddingVertical: 8,
    maxHeight: 100,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  disclaimerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 8,
  },
  disclaimer: {
    textAlign: 'center',
  },
})