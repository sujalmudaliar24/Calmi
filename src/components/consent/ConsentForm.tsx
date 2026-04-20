/**
 * Consent Form Component
 *
 * Displays privacy consent options with clear explanations.
 * Used during onboarding or when user accesses Settings > Privacy.
 */

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Switch,
  ScrollView,
  Linking,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useTheme } from '../../theme'
import {
  ConsentService,
  consentService,
  ConsentCategory,
  CONSENT_DETAILS,
  ConsentStatus,
} from '../../services/api/consentService'

interface ConsentItemProps {
  category: ConsentCategory
  title: string
  description: string
  dataUsed: string[]
  benefits: string
  required: boolean
  value: boolean
  onValueChange: (value: boolean) => void
  colors: any
  borderRadius: any
  typography: any
}

const ConsentItem: React.FC<ConsentItemProps> = ({
  category,
  title,
  description,
  dataUsed,
  benefits,
  required,
  value,
  onValueChange,
  colors,
  borderRadius,
  typography,
}) => (
  <View
    style={[
      styles.consentItem,
      { backgroundColor: colors.surface, borderRadius: borderRadius.lg },
    ]}>
    <View style={styles.consentHeader}>
      <View style={styles.consentTitleRow}>
        <Text style={[typography.h4, { color: colors.text }]}>{title}</Text>
        {required && (
          <View style={[styles.requiredBadge, { backgroundColor: colors.primaryLight + '40' }]}>
            <Text style={[styles.requiredText, { color: colors.primary }]}>Required</Text>
          </View>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={required}
        trackColor={{ false: colors.disabled, true: colors.primary + '60' }}
        thumbColor={value ? colors.primary : colors.surfaceSecondary}
      />
    </View>

    <Text style={[typography.body, styles.description, { color: colors.textSecondary }]}>
      {description}
    </Text>

    <View style={[styles.benefitsCard, { backgroundColor: colors.background }]}>
      <Icon name="shield-check" size={16} color={colors.accent} />
      <Text style={[typography.bodySmall, { color: colors.accent }]}>{benefits}</Text>
    </View>

    <View style={styles.dataSection}>
      <Text style={[typography.labelSmall, { color: colors.textTertiary }]}>
        DATA USED
      </Text>
      <View style={styles.dataTags}>
        {dataUsed.map((item, index) => (
          <View
            key={index}
            style={[
              styles.dataTag,
              { backgroundColor: colors.surfaceSecondary, borderRadius: borderRadius.sm },
            ]}>
            <Text style={[typography.caption, { color: colors.textSecondary }]}>
              {item}
            </Text>
          </View>
        ))}
      </View>
    </View>
  </View>
)

interface Props {
  onComplete?: (consents: ConsentStatus) => void
  onSkip?: () => void
  initialStatus?: ConsentStatus
}

const ConsentForm: React.FC<Props> = ({
  onComplete,
  onSkip,
  initialStatus,
}) => {
  const { colors, borderRadius: radii, typography: typo } = useTheme()
  const [consents, setConsents] = useState<ConsentStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadConsents()
  }, [])

  const loadConsents = async () => {
    try {
      const status = initialStatus
        ? initialStatus
        : await consentService.loadConsentStatus()
      setConsents(status)
    } catch (error) {
      console.error('[ConsentForm] Failed to load consents:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleConsentChange = async (
    category: keyof Omit<ConsentStatus, 'lastUpdated' | 'version'>,
    value: boolean
  ) => {
    if (!consents) return

    const updated = await consentService.updateConsent({
      [category]: value,
    })
    setConsents(updated)
  }

  const handleComplete = () => {
    if (consents && onComplete) {
      onComplete(consents)
    }
  }

  const openPrivacyPolicy = () => {
    Linking.openURL('https://calmi.app/privacy')
  }

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[typo.body, { color: colors.textSecondary }]}>
          Loading privacy settings...
        </Text>
      </View>
    )
  }

  if (!consents) {
    return null
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: colors.secondaryLight + '40' }]}>
          <Icon name="shield-lock" size={32} color={colors.secondary} />
        </View>
        <Text style={[typo.h2, styles.title, { color: colors.text }]}>
          Privacy Settings
        </Text>
        <Text style={[typo.body, styles.subtitle, { color: colors.textSecondary }]}>
          Your data stays private. Choose how Calmi can use your information.
        </Text>
      </View>

      {/* Consent Items */}
      {(['LOCAL_ONLY', 'ANALYTICS', 'AI_TRAINING', 'RESEARCH'] as ConsentCategory[]).map(
        category => {
          const details = CONSENT_DETAILS[category]
          return (
            <ConsentItem
              key={category}
              category={category}
              title={details.title}
              description={details.description}
              dataUsed={details.dataUsed}
              benefits={details.benefits}
              required={details.required}
              value={consents[category.toLowerCase() as keyof Omit<ConsentStatus, 'lastUpdated' | 'version'>] as boolean}
              onValueChange={value => handleConsentChange(
                category.toLowerCase() as keyof Omit<ConsentStatus, 'lastUpdated' | 'version'>,
                value
              )}
              colors={colors}
              borderRadius={radii}
              typography={typo}
            />
          )
        }
      )}

      {/* Privacy Links */}
      <View style={styles.linksContainer}>
        <TouchableOpacity style={styles.linkButton} onPress={openPrivacyPolicy}>
          <Icon name="file-document-outline" size={18} color={colors.primary} />
          <Text style={[typo.bodySmall, { color: colors.primary }]}>
            Read Full Privacy Policy
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkButton}>
          <Icon name="download-outline" size={18} color={colors.primary} />
          <Text style={[typo.bodySmall, { color: colors.primary }]}>
            Export My Data
          </Text>
        </TouchableOpacity>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        {onSkip && (
          <TouchableOpacity
            style={[styles.skipButton, { borderColor: colors.border }]}
            onPress={onSkip}>
            <Text style={[typo.button, { color: colors.textSecondary }]}>
              Skip for Now
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.continueButton, { backgroundColor: colors.primary, borderRadius: radii.lg }]}
          onPress={handleComplete}>
          <Text style={[typo.button, { color: colors.textInverse }]}>
            Continue with Selected Options
          </Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <Text style={[typo.caption, styles.footer, { color: colors.textTertiary }]}>
        You can update these settings anytime in Settings {'>'} Privacy.
        Your choices are stored locally on your device.
      </Text>
    </ScrollView>
  )
}

export default ConsentForm

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
  },
  consentItem: {
    padding: 16,
    marginBottom: 16,
  },
  consentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  consentTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  requiredBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  requiredText: {
    fontSize: 10,
    fontWeight: '600',
  },
  description: {
    marginBottom: 12,
  },
  benefitsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  dataSection: {
    gap: 8,
  },
  dataTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  dataTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginTop: 16,
    marginBottom: 32,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actions: {
    gap: 12,
    marginBottom: 24,
  },
  skipButton: {
    height: 52,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButton: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    textAlign: 'center',
  },
})
