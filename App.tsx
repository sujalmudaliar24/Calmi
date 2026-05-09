import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from './src/theme';
import { EmotionProvider } from './src/context/EmotionContext';
import AppNavigator, { AuthProvider } from './src/navigation/AppNavigator';

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <EmotionProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </EmotionProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App