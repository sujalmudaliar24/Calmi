/**
 * Data Consent Service for Calmi
 *
 * Handles user consent for data collection, storage, and usage.
 * Implements GDPR-style privacy controls with clear opt-in/out.
 *
 * Consent Categories:
 * 1. LOCAL_ONLY - All data stays on device (default)
 * 2. ANALYTICS - Anonymous usage analytics to improve app
 * 3. AI_TRAINING - Anonymized data to improve AI models
 * 4. RESEARCH - Participation in mental wellness research
 */

import AsyncStorage from '@react-native-async-storage/async-storage'

export type ConsentCategory =
  | 'LOCAL_ONLY'
  | 'ANALYTICS'
  | 'AI_TRAINING'
  | 'RESEARCH'

export interface ConsentStatus {
  localOnly: boolean
  analytics: boolean
  aiTraining: boolean
  research: boolean
  lastUpdated: number
  version: string
}

export interface ConsentRecord {
  userId: string
  consentVersion: string
  consents: ConsentStatus
  signature?: string // For legal acceptance
}

// Storage keys
const STORAGE_KEYS = {
  CONSENT_STATUS: '@calmi/consent/status',
  CONSENT_HISTORY: '@calmi/consent/history',
  USER_PREFERENCES: '@calmi/user/preferences',
}

// Current consent form version
const CONSENT_VERSION = '1.0.0'

/**
 * Privacy policy and consent details
 */
export const CONSENT_DETAILS: Record<ConsentCategory, {
  title: string
  description: string
  dataUsed: string[]
  benefits: string
  required: boolean
}> = {
  LOCAL_ONLY: {
    title: 'Local Processing',
    description: 'Your journal entries and mood data are processed and stored only on your device. No data is sent to external servers.',
    dataUsed: [
      'Journal entries',
      'Mood check-ins',
      'Chat history',
      'Wellness activities',
    ],
    benefits: 'Maximum privacy - your personal thoughts never leave your device',
    required: true,
  },
  ANALYTICS: {
    title: 'Anonymous Analytics',
    description: 'Help us understand how Calmi is used so we can improve the app. Only anonymous, aggregated data is collected.',
    dataUsed: [
      'Feature usage patterns',
      'Session duration (no content)',
      'Error reports',
      'Device type (no identifiers)',
    ],
    benefits: 'Your data helps us make Calmi better for everyone without compromising your privacy',
    required: false,
  },
  AI_TRAINING: {
    title: 'AI Model Improvement',
    description: 'With your explicit permission, anonymized excerpts from your journal may be used to train AI models that help users like you.',
    dataUsed: [
      'Anonymized journal excerpts',
      'Mood labels (not raw text)',
      'Aggregated patterns',
    ],
    benefits: 'Help future users get better AI support. Your actual journal content is never shared.',
    required: false,
  },
  RESEARCH: {
    title: 'Mental Wellness Research',
    description: 'Contribute to mental health research. Your anonymized, aggregated data may be shared with research institutions studying wellness patterns.',
    dataUsed: [
      'Anonymized mood trends',
      'Aggregated wellness patterns',
      'General demographics (age range only)',
    ],
    benefits: 'Help advance mental wellness science and contribute to greater good',
    required: false,
  },
}

/**
 * Consent Service - manages user consent for data collection
 */
export class ConsentService {
  private static instance: ConsentService
  private cachedConsent: ConsentStatus | null = null

  private constructor() {}

  static getInstance(): ConsentService {
    if (!ConsentService.instance) {
      ConsentService.instance = new ConsentService()
    }
    return ConsentService.instance
  }

  /**
   * Get default consent status (all optional consents default to false)
   */
  private getDefaultConsentStatus(): ConsentStatus {
    return {
      localOnly: true,
      analytics: false,
      aiTraining: false,
      research: false,
      lastUpdated: Date.now(),
      version: CONSENT_VERSION,
    }
  }

  /**
   * Load consent status from storage
   */
  async loadConsentStatus(): Promise<ConsentStatus> {
    if (this.cachedConsent) {
      return this.cachedConsent
    }

    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.CONSENT_STATUS)
      if (stored) {
        const parsed = JSON.parse(stored) as ConsentStatus
        this.cachedConsent = parsed
        return parsed
      }
    } catch (error) {
      console.error('[ConsentService] Failed to load consent status:', error)
    }

    return this.getDefaultConsentStatus()
  }

  /**
   * Save consent status to storage
   */
  async saveConsentStatus(status: ConsentStatus): Promise<void> {
    try {
      const updated = {
        ...status,
        lastUpdated: Date.now(),
        version: CONSENT_VERSION,
      }
      await AsyncStorage.setItem(STORAGE_KEYS.CONSENT_STATUS, JSON.stringify(updated))
      this.cachedConsent = updated

      // Record consent history for audit trail
      await this.recordConsentChange(updated)
    } catch (error) {
      console.error('[ConsentService] Failed to save consent status:', error)
      throw error
    }
  }

  /**
   * Update specific consent categories
   */
  async updateConsent(categories: Partial<Omit<ConsentStatus, 'lastUpdated' | 'version'>>): Promise<ConsentStatus> {
    const current = await this.loadConsentStatus()
    const updated: ConsentStatus = {
      ...current,
      ...categories,
      lastUpdated: Date.now(),
      version: CONSENT_VERSION,
    }

    // Ensure LOCAL_ONLY is always true if explicitly set
    if (categories.localOnly === false) {
      updated.localOnly = true
    }

    await this.saveConsentStatus(updated)
    return updated
  }

  /**
   * Grant full consent (for testing or power users)
   */
  async grantFullConsent(): Promise<ConsentStatus> {
    return this.updateConsent({
      localOnly: true,
      analytics: true,
      aiTraining: true,
      research: true,
    })
  }

  /**
   * Revoke all optional consents
   */
  async revokeAllOptionalConsent(): Promise<ConsentStatus> {
    return this.updateConsent({
      analytics: false,
      aiTraining: false,
      research: false,
    })
  }

  /**
   * Check if user has given specific consent
   */
  async hasConsent(category: keyof Omit<ConsentStatus, 'lastUpdated' | 'version'>): Promise<boolean> {
    const status = await this.loadConsentStatus()
    return status[category] as boolean
  }

  /**
   * Check if analytics consent is given
   */
  async canCollectAnalytics(): Promise<boolean> {
    return this.hasConsent('analytics')
  }

  /**
   * Check if AI training consent is given
   */
  async canUseForTraining(): Promise<boolean> {
    return this.hasConsent('aiTraining')
  }

  /**
   * Check if research consent is given
   */
  async canShareForResearch(): Promise<boolean> {
    return this.hasConsent('research')
  }

  /**
   * Record consent change for audit trail
   */
  private async recordConsentChange(status: ConsentStatus): Promise<void> {
    try {
      const history = await AsyncStorage.getItem(STORAGE_KEYS.CONSENT_HISTORY)
      const records: ConsentStatus[] = history ? JSON.parse(history) : []

      records.push(status)

      // Keep last 10 records
      const trimmed = records.slice(-10)
      await AsyncStorage.setItem(STORAGE_KEYS.CONSENT_HISTORY, JSON.stringify(trimmed))
    } catch (error) {
      console.error('[ConsentService] Failed to record consent history:', error)
    }
  }

  /**
   * Export consent records for user review (GDPR right to access)
   */
  async exportConsentRecords(): Promise<{
    current: ConsentStatus
    history: ConsentStatus[]
  }> {
    const current = await this.loadConsentStatus()
    const historyRaw = await AsyncStorage.getItem(STORAGE_KEYS.CONSENT_HISTORY)
    const history: ConsentStatus[] = historyRaw ? JSON.parse(historyRaw) : []

    return { current, history }
  }

  /**
   * Delete all consent data (GDPR right to erasure)
   */
  async deleteAllConsentData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.CONSENT_STATUS,
        STORAGE_KEYS.CONSENT_HISTORY,
      ])
      this.cachedConsent = null
    } catch (error) {
      console.error('[ConsentService] Failed to delete consent data:', error)
      throw error
    }
  }

  /**
   * Get consent form details for UI display
   */
  getConsentFormDetails(): Array<{
    category: ConsentCategory
    title: string
    description: string
    dataUsed: string[]
    benefits: string
    required: boolean
    currentValue: boolean
  }> {
    return Object.entries(CONSENT_DETAILS).map(([category, details]) => ({
      category: category as ConsentCategory,
      ...details,
      currentValue: false, // Will be populated by caller
    }))
  }

  /**
   * Validate if user has completed required consents
   */
  async hasCompletedRequiredConsents(): Promise<boolean> {
    const status = await this.loadConsentStatus()
    // LOCAL_ONLY is required
    return status.localOnly === true
  }

  /**
   * Get time since last consent update
   */
  async getTimeSinceLastConsentUpdate(): Promise<string> {
    const status = await this.loadConsentStatus()
    const elapsed = Date.now() - status.lastUpdated
    const days = Math.floor(elapsed / (1000 * 60 * 60 * 24))

    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 30) return `${days} days ago`
    if (days < 365) return `${Math.floor(days / 30)} months ago`
    return `${Math.floor(days / 365)} years ago`
  }
}

// Export singleton
export const consentService = ConsentService.getInstance()

// Export for testing
export { ConsentService }
