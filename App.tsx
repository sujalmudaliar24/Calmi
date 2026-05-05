import React from 'react'
import HomeScreen from './src/screens/HomeScreen'
import LoginScreen from './src/screens/LoginScreen'
import ChatScreen from './src/screens/ChatScreen'
import EmotionLoggerScreen from './src/screens/EmotionLoggerScreen'
import JournalScreen from './src/screens/JournalScreen'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from './src/theme';
import { EmotionProvider } from './src/context/EmotionContext';

const Stack = createNativeStackNavigator();


const StackNavigator = () => {
  return(
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
        <Stack.Screen name="EmotionLoggerScreen" component={EmotionLoggerScreen} />
        <Stack.Screen name="JournalScreen" component={JournalScreen} />
    </Stack.Navigator>
  )
}

const App = () => {
  return (
    <ThemeProvider>
      <EmotionProvider>
        <NavigationContainer>
          <StackNavigator/>
        </NavigationContainer>
      </EmotionProvider>
    </ThemeProvider>
  )
}

export default App