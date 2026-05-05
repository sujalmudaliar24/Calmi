/**
 * AI Chatbot Service for Calmi
 *
 * Uses NLP Cloud Chatbot API for conversational AI.
 * Falls back to local responses when API is unavailable.
 */

import { nlpCloudService } from './nlpCloudService'
import { config } from '../../config'
import { sentimentService, EmotionCategory } from './sentimentService'

export interface ChatMessage {
  id: string
  role: 'user' | 'ai' | 'system'
  content: string
  timestamp: number
  sentiment?: EmotionCategory
  isTyping?: boolean
}

// Fallback AI responses based on detected sentiment
const FALLBACK_RESPONSES: Record<string, string[]> = {
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
    "Anger is natural. What's causing these feeling?",
  ],
  neutral: [
    "Thanks for checking in. How's your day going?",
    "I'm here and ready to listen. What's on your mind?",
    "Every moment is a chance to connect. How are you really?",
  ],
}

const GREETING = "Hi there! I'm Calmi, your wellness companion. How are you feeling today?"

const CONTEXT = `You are Calmi, a warm and empathetic mental wellness companion.
You are supportive, non-judgmental, and help users process their emotions.
You offer gentle guidance and suggest wellness activities when appropriate.
Never claim to be a medical professional. Keep responses concise and caring.`

/**
 * Chatbot Service using NLP Cloud
 */
class ChatbotService {
  private static instance: ChatbotService
  private conversationHistory: Array<{ role: string; content: string }> = []
  private isInitialized: boolean = false

  private constructor() {
    this.conversationHistory = [{ role: 'system', content: CONTEXT }]
  }

  static getInstance(): ChatbotService {
    if (!ChatbotService.instance) {
      ChatbotService.instance = new ChatbotService()
    }
    return ChatbotService.instance
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return

    if (config.features.chatbotEnabled && config.nlpCloudApiKey) {
      nlpCloudService.initialize(config.nlpCloudApiKey)
    }

    this.isInitialized = true
  }

  /**
   * Send a message and get AI response
   */
  async sendMessage(
    userMessage: string,
    onSentimentDetected?: (emotion: EmotionCategory) => void
  ): Promise<string> {
    if (!this.isInitialized) {
      await this.initialize()
    }

    // Add to conversation history
    this.conversationHistory.push({ role: 'user', content: userMessage })

    // Detect sentiment from user message
    if (onSentimentDetected) {
      const sentiment = await sentimentService.analyze(userMessage)
      onSentimentDetected(sentiment.dominantEmotion)
    }

    // Use NLP Cloud if configured
    if (config.features.chatbotEnabled && nlpCloudService.isConfigured()) {
      try {
        const context = this.conversationHistory
          .slice(-10)
          .map(m => `${m.role}: ${m.content}`)
          .join('\n')

        const response = await nlpCloudService.chatbot(userMessage, context)
        this.conversationHistory.push({ role: 'assistant', content: response.response })
        return response.response
      } catch (error) {
        console.warn('[ChatbotService] NLP Cloud error, using fallback:', error)
      }
    }

    // Fallback to local responses
    const sentiment = await sentimentService.analyze(userMessage)
    const response = this.getFallbackResponse(sentiment.dominantEmotion)
    this.conversationHistory.push({ role: 'assistant', content: response })
    return response
  }

  /**
   * Get fallback response based on sentiment
   */
  private getFallbackResponse(sentiment: EmotionCategory): string {
    const responses = FALLBACK_RESPONSES[sentiment] || FALLBACK_RESPONSES.neutral
    return responses[Math.floor(Math.random() * responses.length)]
  }

  /**
   * Get the greeting message
   */
  getGreeting(): string {
    return GREETING
  }

  /**
   * Clear conversation history
   */
  reset(): void {
    this.conversationHistory = [{ role: 'system', content: CONTEXT }]
  }

  /**
   * Check if service is ready
   */
  isReady(): boolean {
    return this.isInitialized
  }
}

export const chatbotService = ChatbotService.getInstance()
export { ChatbotService }