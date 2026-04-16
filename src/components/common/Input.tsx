import React from 'react'
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextInputProps,
} from 'react-native'
import {useTheme} from '../../theme'

interface InputProps extends TextInputProps {
  label?: string
  error?: string
  containerStyle?: ViewStyle
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  style,
  ...props
}) => {
  const {colors, borderRadius: radii} = useTheme()

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, {color: colors.text}]}>{label}</Text>
      )}
      <TextInput
        style={[
          styles.input,
          error && styles.inputError,
          {
            backgroundColor: colors.surfaceSecondary,
            borderColor: error ? colors.error : colors.border,
            color: colors.text,
            borderRadius: radii.lg,
          },
          style,
        ]}
        placeholderTextColor={colors.placeholder}
        {...props}
      />
      {error && (
        <Text style={[styles.error, {color: colors.error}]}>{error}</Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {marginBottom: 12},
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  inputError: {borderWidth: 2},
  error: {fontSize: 12, marginTop: 4},
})

export default Input
