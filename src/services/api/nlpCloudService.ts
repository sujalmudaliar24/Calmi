/**
 * NLP Cloud Service for Calmi
 *
 * Provides AI-powered chatbot and sentiment analysis using NLP Cloud APIs.
 * - Chatbot API for conversational AI companion
 * - Sentiment API for emotion detection
 */

import { config } from '../../config'

const NLP_CLOUD_BASE_URL = 'https://api.nlpcloud.io/v1'

export type SentimentLabel =
  | 'positive'
  | 'negative'
  | 'neutral'
  | 'mixed'

export interface SentimentResult {
  label: SentimentLabel
  score: number
  timestamp: number
}

export interface ChatResponse {
  response: string
  confidence: number
}

/**
 * NLP Cloud API wrapper
 */
class NLPCloudService {
  private static instance: NLPCloudService
  private apiKey: string = ''
  private model: string = 'chatbot'

  private constructor() {}

  static getInstance(): NLPCloudService {
    if (!NLPCloudService.instance) {
      NLPCloudService.instance = new NLPCloudService()
    }
    return NLPCloudService.instance
  }

  /**
   * Initialize with API key from config
   */
  initialize(apiKey: string): void {
    this.apiKey = apiKey
  }

  /**
   * Check if service is configured
   */
  isConfigured(): boolean {
    return Boolean(this.apiKey)
  }

  /**
   * Get headers for NLP Cloud API requests
   */
  private getHeaders(): Record<string, string> {
    return {
      'Authorization': `Token ${this.apiKey}`,
      'Content-Type': 'application/json',
    }
  }

  /**
   * Call chatbot API
   * Uses the async endpoint for better UX
   */
  async chatbot(
    message: string,
    context?: string
  ): Promise<ChatResponse> {
    if (!this.isConfigured()) {
      throw new Error('NLP Cloud not configured. Please add your API key.')
    }

    const response = await fetch(`${NLP_CLOUD_BASE_URL}/chatbot`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        text: message,
        context: context || 'You are Calmi, a warm and empathetic mental wellness companion. You are supportive, non-judgmental, and help users process their emotions. You offer gentle guidance and suggest wellness activities when appropriate. You are NOT a medical professional.',
        async: true,
      }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.detail || `NLP Cloud error: ${response.status}`)
    }

    const data = await response.json()
    return {
      response: data.response,
      confidence: data.confidence || 0.8,
    }
  }

  /**
   * Call sentiment analysis API
   */
  async analyzeSentiment(text: string): Promise<SentimentResult> {
    if (!this.isConfigured()) {
      throw new Error('NLP Cloud not configured. Please add your API key.')
    }

    const response = await fetch(`${NLP_CLOUD_BASE_URL}/sentiment`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        text,
      }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.detail || `NLP Cloud error: ${response.status}`)
    }

    const data = await response.json()
    return {
      label: data.label as SentimentLabel,
      score: data.score || 0,
      timestamp: Date.now(),
    }
  }

  /**
   * Map sentiment label to Calmi emotion categories
   */
  mapToEmotionCategory(label: SentimentLabel): string {
    const mapping: Record<SentimentLabel, string> = {
      positive: 'happy',
      negative: 'sad',
      neutral: 'calm',
      mixed: 'anxious',
    }
    return mapping[label] || 'neutral'
  }
}

export const nlpCloudService = NLPCloudService.getInstance()
export { NLPCloudService }