import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useTheme } from '../../theme'

type AuthMode = 'login' | 'signup'

interface FormErrors {
  email?: string
  password?: string
  confirmPassword?: string
  name?: string
}

const Login: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors, borderRadius: radii, typography: typo } = useTheme()

  const [mode, setMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [acceptTerms, setAcceptTerms] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (mode === 'signup') {
      if (!name.trim()) {
        newErrors.name = 'Name is required'
      }

      if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
      }

      if (!acceptTerms) {
        newErrors.confirmPassword = 'Please accept the terms to continue'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})

    try {
      // Simulate API call - replace with actual auth logic
      await new Promise<void>(resolve => setTimeout(resolve, 1500))

      // Navigate to Home on success
      navigation.navigate('HomeScreen')
    } catch (error) {
      setErrors({ email: 'Invalid credentials. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleModeSwitch = () => {
    setMode(mode === 'login' ? 'signup' : 'login')
    setErrors({})
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setName('')
    setAcceptTerms(false)
  }

  const renderTextInput = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    options: {
      placeholder?: string
      secureTextEntry?: boolean
      error?: string
      keyboardType?: 'default' | 'email-address'
      autoCapitalize?: 'none' | 'words'
    } = {}
  ) => {
    const { placeholder, secureTextEntry, error, keyboardType, autoCapitalize } = options
    const hasError = !!error

    return (
      <View style={styles.inputContainer}>
        <Text style={[typo.label, styles.label, { color: colors.textSecondary }]}>
          {label}
        </Text>
        <View
          style={[
            styles.inputWrapper,
            {
              backgroundColor: colors.surfaceSecondary,
              borderColor: hasError ? colors.error : colors.border,
            },
          ]}>
          <TextInput
            placeholder={placeholder}
            placeholderTextColor={colors.placeholder}
            style={[styles.input, { color: colors.text }]}
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry && !showPassword}
            keyboardType={keyboardType || 'default'}
            autoCapitalize={autoCapitalize || 'none'}
          />
          {secureTextEntry && (
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}>
              <Icon
                name={showPassword ? 'eye-off' : 'eye'}
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>
        {hasError && (
          <Text style={[typo.caption, styles.errorText, { color: colors.error }]}>
            {error}
          </Text>
        )}
      </View>
    )
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {/* Header with Koala */}
        <View style={styles.headerContainer}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/images/happykoala.jpg')}
              style={styles.logoImage}
            />
          </View>
          <Text style={[typo.h1, styles.headerText, { color: colors.primary }]}>
            Welcome to Calmi
          </Text>
          <Text
            style={[
              typo.body,
              styles.subtitle,
              { color: colors.textSecondary },
            ]}>
            Your mental wellness companion
          </Text>
        </View>

        {/* Koala Mood Strip */}
        <View style={styles.koalaStrip}>
          <Image
            source={require('../../assets/images/sadKoala.jpg')}
            style={styles.stripImage}
          />
          <Image
            source={require('../../assets/images/happykoala.jpg')}
            style={[styles.stripImage, styles.mainStripImage]}
          />
          <Image
            source={require('../../assets/images/anxiousKoala.jpg')}
            style={styles.stripImage}
          />
          <Image
            source={require('../../assets/images/angryKoala.jpg')}
            style={styles.stripImage}
          />
          <Image
            source={require('../../assets/images/annoyedKoala.jpg')}
            style={styles.stripImage}
          />
        </View>

        {/* Mode Toggle */}
        <View style={[styles.modeToggle, { backgroundColor: colors.surfaceSecondary }]}>
          <TouchableOpacity
            style={[
              styles.modeButton,
              mode === 'login' && { backgroundColor: colors.surface },
            ]}
            onPress={() => mode !== 'login' && handleModeSwitch()}
            activeOpacity={0.8}>
            <Text
              style={[
                typo.button,
                styles.modeText,
                { color: mode === 'login' ? colors.text : colors.textSecondary },
              ]}>
              Login
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.modeButton,
              mode === 'signup' && { backgroundColor: colors.surface },
            ]}
            onPress={() => mode !== 'signup' && handleModeSwitch()}
            activeOpacity={0.8}>
            <Text
              style={[
                typo.button,
                styles.modeText,
                { color: mode === 'signup' ? colors.text : colors.textSecondary },
              ]}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          {mode === 'signup' && renderTextInput('Full Name', name, setName, {
            placeholder: 'Enter your name',
            autoCapitalize: 'words',
            error: errors.name,
          })}

          {renderTextInput('Email', email, setEmail, {
            placeholder: 'Enter your email',
            keyboardType: 'email-address',
            error: errors.email,
          })}

          {renderTextInput('Password', password, setPassword, {
            placeholder: 'Enter your password',
            secureTextEntry: true,
            error: errors.password,
          })}

          {mode === 'signup' && renderTextInput(
            'Confirm Password',
            confirmPassword,
            setConfirmPassword,
            {
              placeholder: 'Confirm your password',
              secureTextEntry: true,
              error: errors.confirmPassword,
            }
          )}

          {mode === 'signup' && (
            <TouchableOpacity
              style={styles.termsContainer}
              onPress={() => setAcceptTerms(!acceptTerms)}>
              <Icon
                name={acceptTerms ? 'checkbox-marked' : 'checkbox-blank-outline'}
                size={20}
                color={acceptTerms ? colors.primary : colors.textSecondary}
              />
              <Text style={[typo.bodySmall, styles.termsText, { color: colors.textSecondary }]}>
                I agree to the{' '}
                <Text style={{ color: colors.primary }}>Terms of Service</Text>
                {' '}and{' '}
                <Text style={{ color: colors.primary }}>Privacy Policy</Text>
              </Text>
            </TouchableOpacity>
          )}

          {mode === 'login' && (
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={[typo.bodySmall, { color: colors.primary }]}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          )}

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              {
                backgroundColor: isLoading ? colors.disabled : colors.primary,
                borderRadius: radii.lg,
              },
            ]}
            onPress={handleSubmit}
            disabled={isLoading}
            activeOpacity={0.8}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <Icon name="loading" size={20} color={colors.textInverse} />
                <Text style={[typo.button, { color: colors.textInverse, marginLeft: 8 }]}>
                  Please wait...
                </Text>
              </View>
            ) : (
              <Text style={[typo.button, { color: colors.textInverse }]}>
                {mode === 'login' ? 'Login' : 'Create Account'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Text style={[typo.bodySmall, styles.dividerText, { color: colors.textTertiary }]}>
            or continue with
          </Text>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
        </View>

        {/* Social Login */}
        <View style={styles.socialContainer}>
          <TouchableOpacity
            style={[styles.socialButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            activeOpacity={0.7}>
            <Icon name="google" size={24} color={colors.error} />
            <Text style={[typo.button, { color: colors.text, marginLeft: 8 }]}>
              Google
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.socialButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            activeOpacity={0.7}>
            <Icon name="apple" size={24} color={colors.text} />
            <Text style={[typo.button, { color: colors.text, marginLeft: 8 }]}>
              Apple
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[typo.body, { color: colors.textSecondary }]}>
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
          </Text>
          <TouchableOpacity onPress={handleModeSwitch}>
            <Text style={[typo.button, { color: colors.primary, marginLeft: 4 }]}>
              {mode === 'login' ? 'Sign Up' : 'Login'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default Login

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoContainer: {
    marginBottom: 16,
  },
  logoImage: {
    width: 100,
    height: 120,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderBottomLeftRadius: 48,
    borderBottomRightRadius: 48,
  },
  headerText: {
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
  koalaStrip: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: 12,
    marginBottom: 32,
  },
  stripImage: {
    width: 48,
    height: 58,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  mainStripImage: {
    width: 60,
    height: 72,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  modeToggle: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  modeText: {
    fontSize: 15,
  },
  formContainer: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    height: 52,
    fontSize: 16,
  },
  eyeButton: {
    padding: 8,
  },
  errorText: {
    marginTop: 4,
    marginLeft: 4,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 20,
  },
  termsText: {
    flex: 1,
    lineHeight: 20,
  },
  forgotPassword: {
    alignItems: 'flex-end',
    marginBottom: 24,
    marginTop: -8,
  },
  submitButton: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
  },
  socialContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderWidth: 1,
    borderRadius: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
