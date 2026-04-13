import React from 'react'
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native'

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
  const buttonStyles = [
    styles.button,
    variant === 'primary' && styles.primary,
    variant === 'secondary' && styles.secondary,
    variant === 'ghost' && styles.ghost,
    disabled && styles.disabled,
    style,
  ]

  const textStyles = [
    styles.text,
    variant === 'primary' && styles.primaryText,
    variant === 'secondary' && styles.secondaryText,
    variant === 'ghost' && styles.ghostText,
    textStyle,
  ]

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}>
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? '#fff' : '#6B7280'}
        />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {backgroundColor: '#8B9DFE'},
  secondary: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  ghost: {backgroundColor: 'transparent'},
  disabled: {opacity: 0.5},
  text: {fontSize: 16, fontWeight: '600'},
  primaryText: {color: '#FFFFFF'},
  secondaryText: {color: '#374151'},
  ghostText: {color: '#8B9DFE'},
})

export default Button