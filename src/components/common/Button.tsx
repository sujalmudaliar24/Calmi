import React from 'react'
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native'
import {useTheme} from '../../theme'

interface ButtonProps {
  title: string
  onPress: () => void
  variant?: 'primary' | 'secondary' | 'ghost'
  disabled?: boolean
  loading?: boolean
  style?: ViewStyle
  textStyle?: TextStyle
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const {colors, borderRadius: radii, isDark} = useTheme()

  const getBackgroundColor = () => {
    if (disabled) return colors.disabled
    switch (variant) {
      case 'primary':
        return colors.primary
      case 'secondary':
        return colors.surfaceSecondary
      case 'ghost':
        return 'transparent'
    }
  }

  const getTextColor = () => {
    if (disabled) return colors.textTertiary
    switch (variant) {
      case 'primary':
        return colors.textInverse
      case 'secondary':
        return colors.text
      case 'ghost':
        return colors.primary
    }
  }

  const getBorderColor = () => {
    if (variant === 'secondary') return colors.border
    return 'transparent'
  }

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === 'secondary' ? 1 : 0,
          borderRadius: radii.lg,
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}>
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text
          style={[
            styles.text,
            {color: getTextColor()},
            textStyle,
          ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {fontSize: 16, fontWeight: '600'},
})

export default Button
