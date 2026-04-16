import React, {createContext, useContext} from 'react'
import {useColorScheme} from 'react-native'
import {lightColors, darkColors} from './colors'
import {typography, borderRadius} from './typography'

export type ThemeColors = typeof lightColors

interface Theme {
  colors: ThemeColors
  typography: typeof typography
  borderRadius: typeof borderRadius
  isDark: boolean
}

const lightTheme: Theme = {
  colors: lightColors,
  typography,
  borderRadius,
  isDark: false,
}

const darkTheme: Theme = {
  colors: darkColors,
  typography,
  borderRadius,
  isDark: true,
}

const ThemeContext = createContext<Theme>(lightTheme)

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const colorScheme = useColorScheme()
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)

export {lightTheme, darkTheme}
