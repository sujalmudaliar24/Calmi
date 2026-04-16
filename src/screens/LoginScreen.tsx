import { StyleSheet, Text, View , TextInput, Image,TouchableOpacity } from 'react-native'
import React from 'react'
import Login from '../components/auth/Login'

const LoginScreen = ({ navigation }: { navigation: any }) => {
  return (
   <Login navigation={navigation}/>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
   
    
})
