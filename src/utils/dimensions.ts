import { Dimensions, PixelRatio } from 'react-native'

const { width, height } = Dimensions.get('window')

const guidelineBaseWidth = 375
const guidelineBaseHeight = 812

export const scale = (size: number) => (width / guidelineBaseWidth) * size

export const verticalScale = (size: number) => (height / guidelineBaseHeight) * size

export const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor

export const screenWidth = width
export const screenHeight = height

export const normalizeFont = (size: number) => {
  const newSize = scale(size)
  return PixelRatio.roundToNearestPixel(newSize)
}
