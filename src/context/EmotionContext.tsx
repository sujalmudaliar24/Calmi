import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HapticFeedback from 'react-native-haptic-feedback';

interface LoggedEmotion {
  emotion: string;
  subEmotion: string;
  timestamp: number;
}

interface EmotionContextType {
  currentMood: LoggedEmotion | null;
  streak: number;
  logEmotion: (emotion: string, subEmotion: string) => Promise<void>;
  recentMoods: LoggedEmotion[];
  loading: boolean;
}

const EmotionContext = createContext<EmotionContextType | undefined>(undefined);

export const useEmotion = () => {
  const context = useContext(EmotionContext);
  if (!context) {
    throw new Error('useEmotion must be used within EmotionProvider');
  }
  return context;
};

export const EmotionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentMood, setCurrentMood] = useState<LoggedEmotion | null>(null);
  const [recentMoods, setRecentMoods] = useState<LoggedEmotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecentMoods();
  }, []);

  const loadRecentMoods = async () => {
    try {
      const stored = await AsyncStorage.getItem('calmi_emotions');
      if (stored) {
        const moods: LoggedEmotion[] = JSON.parse(stored);
        setRecentMoods(moods.slice(-5)); // Last 5
        setCurrentMood(moods[moods.length - 1] || null);
      }
    } catch (error) {
      console.error('Load moods error:', error);
    } finally {
      setLoading(false);
    }
  };

  const logEmotion = async (emotion: string, subEmotion: string) => {
    HapticFeedback.trigger('selection')
    const newMood: LoggedEmotion = {
      emotion,
      subEmotion,
      timestamp: Date.now(),
    };

    try {
      const stored = await AsyncStorage.getItem('calmi_emotions');
      const moods: LoggedEmotion[] = stored ? JSON.parse(stored) : [];
      moods.push(newMood);
      await AsyncStorage.setItem('calmi_emotions', JSON.stringify(moods));

      setCurrentMood(newMood);
      setRecentMoods(moods.slice(-5));
    } catch (error) {
      console.error('Log mood error:', error);
    }
  };

  const streak = useMemo(() => {
    const today = new Date().toDateString();
    const recent = recentMoods.filter(mood => new Date(mood.timestamp).toDateString() === today);
    return recent.length;
  }, [recentMoods]);

  const value = useMemo(() => ({
    currentMood,
    streak,
    logEmotion,
    recentMoods,
    loading
  }), [currentMood, streak, recentMoods, loading]);

  return (
    <EmotionContext.Provider value={value}>
      {children}
    </EmotionContext.Provider>
  );
};
