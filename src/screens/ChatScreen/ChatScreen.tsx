/**
 * AI Chat Screen for Calmi
 *
 * Conversational interface with the AI wellness companion.
 * Features:
 * - Real-time chat with AI
 * - Sentiment-aware responses
 * - Mood detection from messages
 * - Suggested wellness actions
 * - Memory of past interactions
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
  Image,
} from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useTheme } from '../../theme'
import { sentimentService, JournalAnalysis, EmotionCategory } from '../../services/api/sentimentService'

// Message types
export type MessageRole = 'user' | 'ai' | 'system'

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  timestamp: number
  sentiment?: EmotionCategory
  analysis?: JournalAnalysis
  isTyping?: boolean
}

// AI personality prompts
const AI_PERSONA = {
  name: 'Calmi AI',
  greeting: "Hi there! I'm Calmi, your wellness companion. How are you feeling today?",
  style: 'warm, empathetic, supportive, non-judgmental',
  boundaries: 'Not a medical professional, offers general wellness support',
}

// Mock AI responses based on sentiment
const AI_RESPONSES: Record<string, string[]> = {
  happy: [
    "That's wonderful to hear! What's making you feel so good today?",
    "I love that energy! Feel free to share what's bringing you joy.",
    "Your happiness is contagious! What's going well?",
  ],
  calm: [
    "That sense of peace is precious. Savor these calm moments.",
    "I appreciate you sharing this peaceful state with me.",
    "There's something special about inner calm. What's contributing to this?",
  ],
  anxious: [
    "I hear you. Anxiety can feel overwhelming, but you're not alone.",
    "Take a slow breath. Let's talk through what's worrying you.",
    "It's okay to feel anxious. I'm here to listen and support you.",
  ],
  sad: [
    "I'm sorry you're feeling this way. I'm here with you.",
    "Sadness is a valid emotion. Take your time - I'm not going anywhere.",
    "Thank you for sharing this with me. What's on your mind?",
  ],
  stressed: [
    "Stress can really pile up. Let's take a moment to breathe together.",
    "I understand things feel overwhelming. You're handling more than you realize.",
    "Stress is tough, but you're stronger than it feels. What's weighing on you?",
  ],
  angry: [
    "I can hear that frustration. It's okay to feel angry.",
    "Your feelings are valid. Let's work through this together.",
    "Anger is natural. What's causing these feelings?",
  ],
  neutral: [
    "Thanks for checking in. How's your day going?",
    "I'm here and ready to listen. What's on your mind?",
    "Every moment is a chance to connect. How are you really?",
  ],
}

const WELLNESS_SUGGESTIONS = [
  { icon: 'weather-windy', text: 'Take a 2-minute breathing break', action: 'breathing' },
  { icon: 'heart-outline', text: 'List 3 things you\'re grateful for', action: 'gratitude' },
  { icon: 'book-outline', text: 'Write in your journal', action: 'journaling' },
  { icon: 'walk', text: 'Go for a short walk', action: 'movement' },
]

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
    <View
      style={[
        styles.messageRow,
        isUser ? styles.userMessageRow : styles.aiMessageRow,
      ]}>
      {/* AI Avatar */}
      {isAI && (
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Image
            source={require('../../assets/images/happykoala.jpg')}
            style={styles.avatarImage}
          />
        </View>
      )}

      {/* Message Bubble */}
      <View
        style={[
          styles.messageBubble,
          isUser
            ? [styles.userBubble, { backgroundColor: colors.primary }]
            : [styles.aiBubble, { backgroundColor: colors.surface }],
          isAI && { borderTopLeftRadius: 4 },
          isUser && { borderTopRightRadius: 4 },
        ]}>
        {message.isTyping ? (
          <View style={styles.typingContainer}>
            <View style={[styles.typingDot, { backgroundColor: colors.textTertiary }]} />
            <View style={[styles.typingDot, { backgroundColor: colors.textTertiary }]} />
            <View style={[styles.typingDot, { backgroundColor: colors.textTertiary }]} />
          </View>
        ) : (
          <Text
            style={[
              typography.body,
              styles.messageText,
              { color: isUser ? colors.textInverse : colors.text },
            ]}>
            {message.content}
          </Text>
        )}

        {/* Timestamp */}
        <Text
          style={[
            typography.caption,
            styles.timestamp,
            { color: isUser ? colors.textInverse + '80' : colors.textTertiary },
          ]}>
          {formatTime(message.timestamp)}
        </Text>
      </View>

      {/* User Indicator */}
      {isUser && (
        <View style={[styles.avatar, { backgroundColor: colors.secondary }]}>
          <Image
            source={require('../../assets/images/happykoala.jpg')}
            style={styles.avatarImage}
          />
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

interface Props {
  navigation?: any
  initialMessage?: string
}

const ChatScreen: React.FC<Props> = ({ navigation, initialMessage }) => {
  const { colors, borderRadius: radii, typography: typo } = useTheme()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const flatListRef = useRef<FlatList>(null)

  // Initialize chat
  useEffect(() => {
    initializeChat()
  }, [])

  // Handle initial message from navigation
  useEffect(() => {
    if (initialMessage) {
      handleSendMessage(initialMessage)
    }
  }, [initialMessage])

  const initializeChat = async () => {
    await sentimentService.initialize()
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

  const getRandomResponse = (sentiment: EmotionCategory | 'neutral'): string => {
    const responses = AI_RESPONSES[sentiment] || AI_RESPONSES.neutral
    return responses[Math.floor(Math.random() * responses.length)]
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

    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true })
    }, 100)

    try {
      // Analyze sentiment
      const analysis = await sentimentService.analyzeJournalEntry(messageText)

      // Add typing indicator
      const typingMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: '',
        timestamp: Date.now(),
        isTyping: true,
      }
      setMessages(prev => [...prev, typingMessage])

      // Simulate AI thinking
      await new Promise<void>(resolve => setTimeout(resolve, 800 + Math.random() * 800))

      // Remove typing indicator
      setMessages(prev => prev.filter(m => !m.isTyping))

      // Get contextual response based on sentiment
      const aiResponse = getRandomResponse(analysis.dominantEmotion)

      const aiMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        role: 'ai',
        content: aiResponse,
        timestamp: Date.now(),
        sentiment: analysis.dominantEmotion,
        analysis,
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('[ChatScreen] Error:', error)

      // Remove typing indicator and add error message
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
            <Image
              source={require('../../assets/images/happykoala.jpg')}
              style={styles.headerAvatarImage}
            />
          </View>
          <View>
            <Text style={[typo.h4, { color: colors.text }]}>{AI_PERSONA.name}</Text>
            <Text style={[typo.caption, { color: colors.textSecondary }]}>Online</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation?.navigate('Settings')}>
          <Icon name="dots-vertical" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

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
            style={[styles.textInput, { color: colors.text }]}
            placeholder="Message Calmi..."
            placeholderTextColor={colors.placeholder}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, { backgroundColor: inputText.trim() ? colors.primary : colors.disabled }]}
            onPress={() => handleSendMessage()}
            disabled={!inputText.trim() || isLoading}>
            <Icon name="send" size={20} color={colors.textInverse} />
          </TouchableOpacity>
        </View>
        <Text style={[typo.caption, styles.disclaimer, { color: colors.textTertiary }]}>
          Not a medical professional • AI companion
        </Text>
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
    overflow: 'hidden',
  },
  headerAvatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  menuButton: {
    padding: 8,
    marginRight: -8,
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
    overflow: 'hidden',
  },
  avatarImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
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
    borderColor: 'transparent',
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
  disclaimer: {
    textAlign: 'center',
    marginTop: 8,
  },
})
