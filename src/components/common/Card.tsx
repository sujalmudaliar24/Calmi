import React from 'react'
import {View, StyleSheet, ViewStyle} from 'react-native'
import {useTheme} from '../../theme'

interface CardProps {
  children: React.ReactNode
  style?: ViewStyle
}

const Card: React.FC<CardProps> = ({children, style}) => {
  const {colors, borderRadius: radii, shadow} = useTheme()

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderRadius: radii.xl,
          shadowColor: shadow,
        },
        style,
      ]}>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
})

export default Card
