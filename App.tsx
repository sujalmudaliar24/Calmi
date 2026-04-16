import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import HomeScreen from '../Calmi/src/screens/HomeScreen'
import LoginScreen from '../Calmi/src/screens/LoginScreen'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from './src/theme';

const Stack = createNativeStackNavigator();


const StackNavigator = () => {
  return(
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />

    </Stack.Navigator>
  )
}

const App = () => {
  return (
    <ThemeProvider>
    <NavigationContainer>
      <StackNavigator/>
    </NavigationContainer>
    </ThemeProvider>
  )
}

export default App

const styles = StyleSheet.create({})