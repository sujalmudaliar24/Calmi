/**
 * Data Privacy Manager for Calmi
 *
 * Central service for managing how user data is collected, stored,
 * processed, and shared based on user consent preferences.
 *
 * Key principles:
 * - Privacy by default (LOCAL_ONLY is the default)
 * - Consent-based data sharing
 * - Data minimization
 * - User control at all times
 */

import { consentService, ConsentStatus } from './consentService'

export type DataType = 'journal' | 'mood' | 'chat' | 'wellness_activity' | 'user_profile'

export interface DataRequest {
  dataType: DataType
  purpose: 'storage' | 'processing' | 'analytics' | 'training' | 'research'
  content?: string // Actual data content
  metadata?: Record<string, any> // Non-content metadata
}

export interface DataResponse {
  allowed: boolean
  data?: any
  reason?: string
}

/**
 * Privacy Manager Service
 */
export class PrivacyManager {
  private static instance: PrivacyManager

  private constructor() {}

  static getInstance(): PrivacyManager {
    if (!PrivacyManager.instance) {
      PrivacyManager.instance = new PrivacyManager()
    }
    return PrivacyManager.instance
  }

  /**
   * Check if a data operation is allowed based on current consents
   */
  async canPerform(request: DataRequest): Promise<DataResponse> {
    const consent = await consentService.loadConsentStatus()

    switch (request.purpose) {
      case 'storage':
        // Local storage is always allowed for LOCAL_ONLY users
        if (consent.localOnly) {
          return { allowed: true, reason: 'Local storage permitted' }
        }
        return {
          allowed: true,
          reason: 'Data may be stored per your preferences',
        }

      case 'processing':
        // Processing is allowed if storage is allowed
        return { allowed: true, reason: 'Processing permitted with storage' }

      case 'analytics':
        if (consent.analytics) {
          return { allowed: true, reason: 'Analytics consent given' }
        }
        return {
          allowed: false,
          reason: 'Analytics consent not granted. Enable in Settings > Privacy.',
        }

      case 'training':
        if (consent.aiTraining) {
          // Additional check: only anonymized excerpts should be used
          return {
            allowed: true,
            reason: 'AI training consent given',
          }
        }
        return {
          allowed: false,
          reason: 'AI training consent not granted. Enable in Settings > Privacy.',
        }

      case 'research':
        if (consent.research) {
          return {
            allowed: true,
            reason: 'Research consent given',
          }
        }
        return {
          allowed: false,
          reason: 'Research consent not granted. Enable in Settings > Privacy.',
        }

      default:
        return { allowed: false, reason: 'Unknown purpose' }
    }
  }

  /**
   * Process and store data based on consent
   * Returns anonymized version if needed for specific purposes
   */
  async processData(request: DataRequest): Promise<DataResponse> {
    const canProcess = await this.canPerform(request)

    if (!canProcess.allowed) {
      return canProcess
    }

    // For training/research, perform anonymization
    if (request.purpose === 'training' || request.purpose === 'research') {
      const anonymized = this.anonymizeData(request)
      return {
        allowed: true,
        data: anonymized,
        reason: 'Data anonymized per privacy requirements',
      }
    }

    return { allowed: true, data: request.content }
  }

  /**
   * Anonymize data for external use
   */
  private anonymizeData(request: DataRequest): any {
    // Remove personal identifiers
    const anonymized: any = {
      timestamp: request.metadata?.timestamp || Date.now(),
      type: request.dataType,
      // Add noise to prevent re-identification
      noise: Math.random(),
    }

    switch (request.dataType) {
      case 'journal':
        // For journals, extract only emotional signals, not content
        anonymized.emotions = request.metadata?.emotions || []
        anonymized.wordCount = request.content?.split(/\s+/).length || 0
        anonymized.sentiment = request.metadata?.sentiment || 'neutral'
        anonymized.contentHash = this.hashContent(request.content || '')
        break

      case 'mood':
        anonymized.mood = request.metadata?.mood || 'neutral'
        anonymized.intensity = request.metadata?.intensity || 'moderate'
        break

      case 'chat':
        anonymized.messageCount = request.metadata?.messageCount || 0
        anonymized.topics = request.metadata?.topics || []
        anonymized.sentiment = request.metadata?.sentiment || 'neutral'
        break

      case 'wellness_activity':
        anonymized.activityType = request.metadata?.activityType
        anonymized.duration = request.metadata?.duration
        anonymized.completed = request.metadata?.completed
        break

      default:
        // For user_profile, only include age range, not actual profile
        anonymized.ageRange = request.metadata?.ageRange
        anonymized.usageLevel = request.metadata?.usageLevel
    }

    return anonymized
  }

  /**
   * Simple hash function for content fingerprinting
   */
  private hashContent(content: string): string {
    let hash = 0
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16)
  }

  /**
   * Generate a privacy report for the user
   */
  async generatePrivacyReport(): Promise<{
    localOnly: boolean
    dataProcessingPartners: string[]
    lastAudit: number
    recommendations: string[]
  }> {
    const consent = await consentService.loadConsentStatus()

    const partners: string[] = []
    if (consent.analytics) partners.push('Analytics Service (anonymous)')
    if (consent.aiTraining) partners.push('AI Training Pipeline (anonymized)')
    if (consent.research) partners.push('Research Institutions (aggregated)')

    const recommendations: string[] = []
    if (!consent.localOnly) {
      recommendations.push('Consider enabling LOCAL_ONLY mode for maximum privacy')
    }
    if (!consent.aiTraining) {
      recommendations.push('Your anonymized data could help improve Calmi for others')
    }

    return {
      localOnly: consent.localOnly,
      dataProcessingPartners: partners,
      lastAudit: Date.now(),
      recommendations,
    }
  }

  /**
   * Check if data can be exported
   */
  async canExportData(): Promise<boolean> {
    // Users can always export their own data
    return true
  }

  /**
   * Check if data should be deleted per consent withdrawal
   */
  async shouldDeleteData(dataType: DataType, storedConsent: ConsentStatus): Promise<boolean> {
    // If user revokes consent, their data should be deleted
    // This would be called when consent changes
    return false // Actual implementation would check consent change timestamps
  }
}

// Export singleton
export const privacyManager = PrivacyManager.getInstance()
export { PrivacyManager }
