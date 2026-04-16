import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
} from 'react-native'
import React from 'react'
import {useTheme} from '../../theme'

const Login = ({navigation}) => {
  const {colors, borderRadius: radii, typography: typo} = useTheme()

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: colors.background, paddingHorizontal: 20},
      ]}>
      <View style={styles.headerContainer}>
        <Text style={[typo.h1, styles.headerText, {color: colors.primary}]}>
          Welcome to Calmi
        </Text>
        <Text
          style={[
            typo.body,
            styles.subtitle,
            {color: colors.textSecondary},
          ]}>
          Your mental wellness companion
        </Text>
      </View>

      <View style={styles.imgContainer}>
        <Image
          source={require('../../assets/images/sadKoala.jpg')}
          style={styles.img}
        />
        <Image
          source={require('../../assets/images/happykoala.jpg')}
          style={[styles.img, styles.mainImg]}
        />
        <Image
          source={require('../../assets/images/annoyedKoala.jpg')}
          style={styles.img}
        />
      </View>

      <View style={styles.textInputContainer}>
        <TextInput
          placeholder="Username"
          placeholderTextColor={colors.placeholder}
          style={[
            styles.input,
            {
              backgroundColor: colors.surfaceSecondary,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          placeholderTextColor={colors.placeholder}
          style={[
            styles.input,
            {
              backgroundColor: colors.surfaceSecondary,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
        />
      </View>

      <TouchableOpacity
        style={[
          styles.loginButton,
          {
            backgroundColor: colors.primary,
            borderRadius: radii.lg,
            marginBottom: 50
          },
        ]}
        onPress={() => navigation.navigate('HomeScreen')}>
        <Text style={[typo.button, {color: colors.textInverse}]}>Login</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Login

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
  },
  headerContainer: {
    alignItems: 'center',
  },
  headerText: {
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
  },
  imgContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 20,
    marginBottom: 50,
  },
  img: {
    width: 80,
    height: 96,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderBottomLeftRadius: 48,
    borderBottomRightRadius: 48,
  },
  mainImg: {
    width: 100,
    height: 120,
  },
  textInputContainer: {
    width: '90%',
    gap: 16,
  },
  input: {
    height: 52,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  loginButton: {
    width: '100%',
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
