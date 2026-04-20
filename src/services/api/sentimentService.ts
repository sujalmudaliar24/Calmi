/**
 * Sentiment Analysis Service for Calmi
 *
 * Uses transformer.js for on-device inference (privacy-first approach)
 * Falls back to API calls if local processing isn't available
 *
 * Emotion categories aligned with Calmi's mood tracking:
 * - happy, calm, anxious, sad, stressed, angry, neutral
 */

export type EmotionCategory =
  | 'happy'
  | 'calm'
  | 'anxious'
  | 'sad'
  | 'stressed'
  | 'angry'
  | 'neutral'

export interface EmotionScore {
  emotion: EmotionCategory
  score: number
}

export interface SentimentResult {
  dominantEmotion: EmotionCategory
  scores: EmotionScore[]
  intensity: 'low' | 'moderate' | 'high'
  timestamp: number
  processingTime: number
}

export interface JournalAnalysis extends SentimentResult {
  summary: string
  toneHints: string[]
  suggestedActions: WellnessAction[]
}

export interface WellnessAction {
  id: string
  type: 'breathing' | 'gratitude' | 'mindfulness' | 'journaling' | 'movement'
  title: string
  description: string
  durationMinutes: number
}

// Mapping from model emotions to Calmi categories
const EMOTION_MAPPING: Record<string, EmotionCategory> = {
  joy: 'happy',
  happy: 'happy',
  sadness: 'sad',
  sad: 'sad',
  anger: 'angry',
  angry: 'angry',
  fear: 'anxious',
  anxious: 'anxious',
  surprise: 'calm',
  neutral: 'neutral',
  calm: 'calm',
  satisfaction: 'calm',
  relief: 'calm',
}

// Model config - currently using mock for demo
// Replace with actual transformer.js model in production
const MODEL_CONFIG = {
  useLocalModel: true,
  modelName: 'Xenova/transformers', // Will be loaded via transformer.js
  quantize: true, // Reduce memory footprint
  batchSize: 4,
}

// Action suggestions based on emotional state
const WELLNESS_ACTIONS: Record<EmotionCategory, WellnessAction[]> = {
  happy: [
    {
      id: 'capture-moment',
      type: 'journaling',
      title: 'Capture This Moment',
      description: 'Write about what made you happy',
      durationMinutes: 3,
    },
  ],
  calm: [
    {
      id: 'gratitude-practice',
      type: 'gratitude',
      title: 'Gratitude Practice',
      description: 'List three things you appreciate',
      durationMinutes: 2,
    },
  ],
  anxious: [
    {
      id: 'deep-breathing',
      type: 'breathing',
      title: '4-7-8 Breathing',
      description: 'Inhale 4s, hold 7s, exhale 8s',
      durationMinutes: 2,
    },
    {
      id: 'grounding',
      type: 'mindfulness',
      title: '5-4-3-2-1 Grounding',
      description: 'Notice 5 things you see, 4 you hear...',
      durationMinutes: 3,
    },
  ],
  sad: [
    {
      id: 'self-compassion',
      type: 'mindfulness',
      title: 'Self-Compassion Break',
      description: 'Acknowledge pain and offer yourself kindness',
      durationMinutes: 3,
    },
  ],
  stressed: [
    {
      id: 'progressive-relaxation',
      type: 'breathing',
      title: 'Body Scan',
      description: 'Tense and release each muscle group',
      durationMinutes: 4,
    },
    {
      id: 'walk-it-out',
      type: 'movement',
      title: 'Take a Walk',
      description: 'A short walk can reduce cortisol by 30%',
      durationMinutes: 10,
    },
  ],
  angry: [
    {
      id: 'count-to-ten',
      type: 'breathing',
      title: 'Paused Breathing',
      description: 'Slow your breath to cool down',
      durationMinutes: 2,
    },
  ],
  neutral: [
    {
      id: 'mood-check',
      type: 'journaling',
      title: 'Check In',
      description: 'How are you really feeling?',
      durationMinutes: 2,
    },
  ],
}

/**
 * Calculate intensity level based on score distribution
 */
function calculateIntensity(scores: EmotionScore[]): 'low' | 'moderate' | 'high' {
  const topScore = Math.max(...scores.map(s => s.score))
  if (topScore < 0.4) return 'low'
  if (topScore < 0.7) return 'moderate'
  return 'high'
}

/**
 * Generate tone hints based on emotion analysis
 */
function generateToneHints(scores: EmotionScore[]): string[] {
  const hints: string[] = []
  const topEmotions = scores
    .filter(s => s.score > 0.2)
    .sort((a, b) => b.score - a.score)

  if (topEmotions.length > 1) {
    hints.push(`Mixed feelings detected - ${topEmotions[0].emotion} and ${topEmotions[1].emotion}`)
  }

  if (topEmotions[0]?.emotion === 'anxious' || topEmotions[0]?.emotion === 'stressed') {
    hints.push('Your text shows signs of stress - consider taking a break')
  }

  if (topEmotions[0]?.emotion === 'sad') {
    hints.push('I hear you. It\'s okay to feel this way.')
  }

  return hints
}

/**
 * Mock analyzer for demo - simulates sentiment analysis
 * Replace with actual transformer.js inference in production
 */
async function mockAnalyze(text: string): Promise<SentimentResult> {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 100))

  const startTime = Date.now()

  // Simple keyword-based mock analysis
  const lowerText = text.toLowerCase()
  const emotionKeywords: Record<EmotionCategory, string[]> = {
    happy: ['happy', 'joy', 'great', 'wonderful', 'excited', 'love', 'grateful', 'amazing', 'good'],
    calm: ['peaceful', 'relaxed', 'quiet', 'serene', 'tranquil', 'content', 'okay', 'fine', 'stable'],
    anxious: ['anxious', 'worried', 'nervous', 'stressed', 'panic', 'afraid', 'fear', 'scared', 'overwhelmed'],
    sad: ['sad', 'unhappy', 'depressed', 'down', 'lonely', 'hopeless', 'disappointed', 'hurt', 'upset'],
    stressed: ['stressed', 'tense', 'pressure', 'burden', 'exhausted', 'tired', 'burnout', 'frustrated'],
    angry: ['angry', 'mad', 'furious', 'annoyed', 'irritated', 'frustrated', 'rage'],
    neutral: ['okay', 'fine', 'normal', 'usual', 'average'],
  }

  const scores: EmotionScore[] = []
  let totalMatches = 0

  for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
    const matches = keywords.filter(k => lowerText.includes(k)).length
    totalMatches += matches
    scores.push({
      emotion: emotion as EmotionCategory,
      score: matches,
    })
  }

  // Normalize scores
  if (totalMatches > 0) {
    scores.forEach(s => {
      s.score = s.score / totalMatches
    })
  } else {
    // Default to neutral
    scores.find(s => s.emotion === 'neutral')!.score = 0.8
  }

  // Sort by score descending
  scores.sort((a, b) => b.score - a.score)

  return {
    dominantEmotion: scores[0].emotion,
    scores,
    intensity: calculateIntensity(scores),
    timestamp: Date.now(),
    processingTime: Date.now() - startTime,
  }
}

/**
 * Sentiment Analysis Service
 */
export class SentimentAnalysisService {
  private static instance: SentimentAnalysisService
  private model: any = null
  private isInitialized: boolean = false
  private useLocalModel: boolean = MODEL_CONFIG.useLocalModel

  private constructor() {}

  static getInstance(): SentimentAnalysisService {
    if (!SentimentAnalysisService.instance) {
      SentimentAnalysisService.instance = new SentimentAnalysisService()
    }
    return SentimentAnalysisService.instance
  }

  /**
   * Initialize the sentiment analysis model
   * In production, this loads the transformer.js model
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return

    if (this.useLocalModel) {
      try {
        // TODO: Load with transformer.js
        // const { pipeline } = await import('@huggingface/transformers')
        // this.model = await pipeline('sentiment-analysis', MODEL_CONFIG.modelName)
        console.log('[SentimentService] Using local model (mock for demo)')
      } catch (error) {
        console.warn('[SentimentService] Failed to load local model, using fallback')
        this.useLocalModel = false
      }
    }

    this.isInitialized = true
  }

  /**
   * Analyze text sentiment
   */
  async analyze(text: string): Promise<SentimentResult> {
    if (!this.isInitialized) {
      await this.initialize()
    }

    if (this.useLocalModel && this.model) {
      // TODO: Use actual model inference
      // const result = await this.model(text)
      // return this.mapModelResult(result)
      return mockAnalyze(text)
    }

    return mockAnalyze(text)
  }

  /**
   * Analyze journal entry with additional Calmi-specific insights
   */
  async analyzeJournalEntry(text: string): Promise<JournalAnalysis> {
    const sentiment = await this.analyze(text)
    const suggestedActions = WELLNESS_ACTIONS[sentiment.dominantEmotion] || WELLNESS_ACTIONS.neutral

    return {
      ...sentiment,
      summary: this.generateSummary(sentiment),
      toneHints: generateToneHints(sentiment.scores),
      suggestedActions,
    }
  }

  /**
   * Generate a human-readable summary
   */
  private generateSummary(sentiment: SentimentResult): string {
    const topEmotion = sentiment.dominantEmotion
    const intensity = sentiment.intensity
    const confidence = Math.round(sentiment.scores[0].score * 100)

    const summaryTemplates: Record<EmotionCategory, Record<string, string>> = {
      happy: {
        low: 'You\'re feeling a subtle positive mood today.',
        moderate: 'You seem to be in a good mood!',
        high: 'You\'re radiating happiness!',
      },
      calm: {
        low: 'You\'re feeling a bit relaxed.',
        moderate: 'You seem peaceful today.',
        high: 'Deep calm is evident in your words.',
      },
      anxious: {
        low: 'There\'s a hint of worry in your text.',
        moderate: 'Some anxiety is showing through.',
        high: 'Your text reveals significant anxiety.',
      },
      sad: {
        low: 'A hint of sadness is present.',
        moderate: 'You seem to be feeling down.',
        high: 'I hear deep sadness in your words.',
      },
      stressed: {
        low: 'Minor stress signals detected.',
        moderate: 'Stress seems present in your life.',
        high: 'High stress levels are showing.',
      },
      angry: {
        low: 'A hint of frustration.',
        moderate: 'Some anger is present.',
        high: 'Strong anger detected.',
      },
      neutral: {
        low: 'Your mood appears balanced.',
        moderate: 'You\'re in a neutral state.',
        high: 'Your tone is very neutral.',
      },
    }

    const template = summaryTemplates[topEmotion]?.[intensity] || summaryTemplates.neutral[intensity]
    return `${template} (${confidence}% confidence)`
  }

  /**
   * Batch analyze multiple texts
   */
  async batchAnalyze(texts: string[]): Promise<SentimentResult[]> {
    const results: SentimentResult[] = []
    for (const text of texts) {
      results.push(await this.analyze(text))
    }
    return results
  }

  /**
   * Get available wellness actions for an emotion
   */
  getActionsForEmotion(emotion: EmotionCategory): WellnessAction[] {
    return WELLNESS_ACTIONS[emotion] || WELLNESS_ACTIONS.neutral
  }

  /**
   * Check if model is ready
   */
  isReady(): boolean {
    return this.isInitialized
  }
}

// Export singleton instance
export const sentimentService = SentimentAnalysisService.getInstance()

// Export service class for testing
export { SentimentAnalysisService }
