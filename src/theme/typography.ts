import {TextStyle, ViewStyle} from 'react-native'

type Typography = Record<string, TextStyle>
type Spacing = Record<string, ViewStyle>

export const typography: Typography = {
  // Headings
  h1: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
    lineHeight: 40,
  },
  h2: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.3,
    lineHeight: 34,
  },
  h3: {
    fontSize: 22,
    fontWeight: '600',
    letterSpacing: -0.2,
    lineHeight: 30,
  },
  h4: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 26,
  },

  // Body
  bodyLarge: {
    fontSize: 18,
    fontWeight: '400',
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },

  // Labels
  label: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  labelSmall: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },

  // Captions
  caption: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },

  // Buttons
  button: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  buttonSmall: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
}

export const spacing: Spacing = {
  xxs: {marginTop: 2},
  xs: {marginTop: 4},
  sm: {marginTop: 8},
  md: {marginTop: 12},
  lg: {marginTop: 16},
  xl: {marginTop: 24},
  xxl: {marginTop: 32},
  xxxl: {marginTop: 48},

  // Padding variants
  paddingXs: {padding: 8},
  paddingSm: {padding: 12},
  paddingMd: {padding: 16},
  paddingLg: {padding: 20},
  paddingXl: {padding: 24},

  // Gap helpers
  gapXs: {gap: 4},
  gapSm: {gap: 8},
  gapMd: {gap: 12},
  gapLg: {gap: 16},
  gapXl: {gap: 24},
}

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
}
