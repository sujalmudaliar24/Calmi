/**
 * App Configuration for Calmi
 *
 * Uses .env file via react-native-dotenv
 * API keys and feature flags are loaded from environment
 */

import { API_KEY } from '@env'

export const config = {
  nlpCloudApiKey: API_KEY || '',

  features: {
    chatbotEnabled: Boolean(API_KEY),
    sentimentEnabled: Boolean(API_KEY),
    biometricsEnabled: false,
  },
}