import React from 'react'
import { useEmotion } from '../context/EmotionContext'
import Hero from '../components/home/Hero'


const HomeScreen = ({ navigation }: { navigation: any }) => {
  const { streak } = useEmotion()
  return (
   <Hero navigation={navigation} streak={streak} />
  )
}

export default HomeScreen
