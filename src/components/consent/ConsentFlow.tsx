/**
 * Consent Flow - Onboarding integration
 *
 * Shows consent form during first app launch,
 * with option to configure privacy settings.
 */

import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useTheme } from '../../theme'
import ConsentForm from './ConsentForm'

const ONBOARDING_KEY = '@calmi/onboarding/completed'

interface Props {
  onComplete: () => void
  children: React.ReactNode
}

const ConsentFlow: React.FC<Props> = ({ onComplete, children }) => {
  const { colors, borderRadius: radii, typography: typo } = useTheme()
  const [showConsent, setShowConsent] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkOnboardingStatus()
  }, [])

  const checkOnboardingStatus = async () => {
    try {
      const completed = await AsyncStorage.getItem(ONBOARDING_KEY)
      setShowConsent(completed !== 'true')
    } catch (error) {
      console.error('[ConsentFlow] Failed to check onboarding status:', error)
      setShowConsent(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleConsentComplete = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true')
      setShowConsent(false)
      onComplete()
    } catch (error) {
      console.error('[ConsentFlow] Failed to complete onboarding:', error)
    }
  }

  const handleSkip = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true')
      setShowConsent(false)
      onComplete()
    } catch (error) {
      console.error('[ConsentFlow] Failed to skip onboarding:', error)
    }
  }

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[typo.body, { color: colors.textSecondary }]}>Loading...</Text>
      </View>
    )
  }

  if (showConsent) {
    return (
      <ConsentForm
        onComplete={handleConsentComplete}
        onSkip={handleSkip}
      />
    )
  }

  return <>{children}</>
}

export default ConsentFlow
