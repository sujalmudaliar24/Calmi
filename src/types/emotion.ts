export interface LoggedEmotion {
  emotion: EmotionTag;
  subEmotion: string;
  timestamp: number;
}

export type EmotionTag = 'happy' | 'sad' | 'angry' | 'anxious' | 'calm';

export const EMOTION_CONFIG: Record<EmotionTag, {
  label: string;
  koalaImage: any;
  color: string;
  descriptors: string[];
}> = {
  happy: {
    label: 'Happy',
  koalaImage: require('../assets/images/happykoala.jpg'), // fixed case
    color: '#FFD166',
    descriptors: ['joyful', 'grateful', 'excited', 'peaceful', 'content'],
  },
  sad: {
    label: 'Sad',
  koalaImage: require('../assets/images/sadKoala.jpg'),
    color: '#B8A9E8',
    descriptors: ['down', 'lonely', 'disappointed', 'hurt', 'hopeless'],
  },
  angry: {
    label: 'Angry',
  koalaImage: require('../assets/images/angryKoala.jpg'),
    color: '#FF7B7B',
    descriptors: ['frustrated', 'annoyed', 'irritated', 'furious', 'resentful'],
  },
  anxious: {
    label: 'Anxious',
  koalaImage: require('../assets/images/anxiousKoala.jpg'),
    color: '#FFB5A7',
    descriptors: ['worried', 'nervous', 'overwhelmed', 'restless', 'uneasy'],
  },
  calm: {
    label: 'Calm',
  koalaImage: require('../assets/images/annoyedKoala.jpg'),
    color: '#7ECFBE',
    descriptors: ['peaceful', 'relaxed', 'serene', 'centered', 'tranquil'],
  },
} as const;

