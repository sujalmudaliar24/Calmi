import {StyleSheet, Text, View, TouchableOpacity, ScrollView, Image} from 'react-native'
import React from 'react'
import {useTheme} from '../../theme'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'



interface QuickAction {
  id: string
  icon: string
  title: string
  subtitle: string
  color: string
  onPress: () => void
}

interface MoodEntry {
  icon: string
  label: string
  color: string
}

const QuickActions: React.FC<{actions: QuickAction[]; colors: any}> = ({
  actions,
  colors,
}) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.quickActionsContent}>
    {actions.map(action => (
      <TouchableOpacity
        key={action.id}
        style={[styles.quickActionCard, {backgroundColor: colors.surface}]}
        onPress={action.onPress}
        activeOpacity={0.7}>
        <Text style={[styles.quickActionTitle, {color: colors.text}]}>
          {action.title}
        </Text>
        <Text style={[styles.quickActionSubtitle, {color: colors.textSecondary}]}>
          {action.subtitle}
        </Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
)

const MoodCheckIn: React.FC<{mood: MoodEntry; colors: any; navigation?: any}> = ({mood, colors, navigation}) => (
  <TouchableOpacity
    style={[styles.moodCard, {backgroundColor: colors.surface}]}
    onPress={() => navigation?.navigate('Log')}
    activeOpacity={0.8}>
    <View style={styles.moodHeader}>
      <Text style={[styles.moodLabel, {color: colors.textSecondary}]}>
        How are you feeling?
      </Text>
      <Icon name="chevron-right" size={20} color={colors.textSecondary} />
    </View>
    <View style={styles.moodContent}>
      <Text style={[styles.moodText, {color: colors.text}]}>{mood.label}</Text>
    </View>
    <Text style={[styles.moodHint, {color: colors.textTertiary}]}>
      Tap to log your mood
    </Text>
  </TouchableOpacity>
)

const WellnessTip: React.FC<{tip: string; colors: any}> = ({tip, colors}) => (
  <View style={[styles.tipCard, {backgroundColor: colors.secondaryLight + '40'}]}>
    <Text style={[styles.tipText, {color: colors.text}]}>{tip}</Text>
  </View>
)

interface Props {
  navigation?: any
  userName?: string
  currentMood?: MoodEntry
  streak?: number
  onQuickAction?: (action: string) => void
}

const Hero: React.FC<Props> = ({
  navigation,
  userName = 'Friend',
  currentMood = { icon: 'meditation', label: 'Calm', color: '#7ECFBE' },
  streak = 0,
  onQuickAction,
}) => {
  const {colors, typography: typo} = useTheme()

  const quickActions: QuickAction[] = [
    {
      id: 'breathing',
      icon: 'weather-windy',
      title: 'Breathe',
      subtitle: '2 min',
      color: colors.accent,
      onPress: () => onQuickAction?.('breathing'),
    },
    {
      id: 'gratitude',
      icon: 'heart-outline',
      title: 'Gratitude',
      subtitle: '1 min',
      color: colors.primary,
      onPress: () => onQuickAction?.('gratitude'),
    },
    {
      id: 'mindfulness',
      icon: 'meditation',
      title: 'Mindful',
      subtitle: '3 min',
      color: colors.secondary,
      onPress: () => onQuickAction?.('mindfulness'),
    },
  ]

  const wellnessTip =
    'Taking short breaks throughout the day can reduce stress by up to 40%.'

  const handleChatPress = () => {
    navigation?.navigate('Chat')
  }

  return (
    <ScrollView
      style={[styles.container, {backgroundColor: colors.background}]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[typo.body, {color: colors.textSecondary}]}>
            Good morning
          </Text>
          <Text style={[typo.h2, {color: colors.text}]}>{userName}</Text>
        </View>
        <TouchableOpacity
          style={[styles.profileButton, {backgroundColor: colors.surface}]}
          onPress={() => navigation?.navigate('Profile')}>
          <Icon name="account-circle" size={28} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Mood Check-In */}
      <MoodCheckIn mood={currentMood} colors={colors} navigation={navigation} />

      {/* AI Companion */}
      <TouchableOpacity
        style={[styles.chatCard, {backgroundColor: colors.primaryLight + '30'}]}
        onPress={handleChatPress}
        activeOpacity={0.8}>
        <View style={styles.chatContent}>
          <View style={[styles.chatAvatar, {backgroundColor: colors.primary}]}>
            {/* <Image source={require('./assets/images/happykoala.jpg')} style={styles.chatAvatarImage} /> */}
          </View>
          <View style={styles.chatTextContainer}>
            <Text style={[styles.chatTitle, {color: colors.text}]}>
              Talk to Calmi AI
            </Text>
            <Text style={[styles.chatSubtitle, {color: colors.textSecondary}]}>
              Your AI wellness companion
            </Text>
          </View>
        </View>
        <Icon name="arrow-right-circle" size={28} color={colors.primary} />
      </TouchableOpacity>

      {/* Wellness Tip */}
  <WellnessTip tip={wellnessTip} colors={colors} />

      {/* Quick Actions */}
      <View style={styles.sectionHeader}>
        <Text style={[typo.h4, {color: colors.text}]}>Quick Wellness</Text>
        <TouchableOpacity>
          <Text style={[typo.bodySmall, {color: colors.primary}]}>See all</Text>
        </TouchableOpacity>
      </View>
      <QuickActions actions={quickActions} colors={colors} />

      {/* Journal Preview */}
      <TouchableOpacity
        style={[styles.journalCard, {backgroundColor: colors.surface}]}
        onPress={() => navigation?.navigate('Journal')}
        activeOpacity={0.8}>
        <View style={styles.journalHeader}>
          <Text style={[typo.h4, {color: colors.text}]}>Recent Journal</Text>
          <Icon name="book-outline" size={24} color={colors.secondary} />
        </View>
        <Text
          style={[styles.journalPreview, {color: colors.textSecondary}]}
          numberOfLines={2}>
          Today I felt grateful for the small moments - a warm cup of tea and a
          quiet morning...
        </Text>
        <View style={styles.journalFooter}>
          <Text style={[typo.label, {color: colors.primary}]}>
            Continue reading
          </Text>
          <Icon name="chevron-right" size={18} color={colors.primary} />
        </View>
      </TouchableOpacity>

      {/* Stats Preview */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, {backgroundColor: colors.surface}]}>
        <Text style={[styles.statValue, {color: colors.text}]}>{streak}</Text>
          <Text style={[styles.statLabel, {color: colors.textSecondary}]}>
            Day streak
          </Text>
        </View>
        <View style={[styles.statCard, {backgroundColor: colors.surface}]}>
        <Text style={[styles.statValue, {color: colors.text}]}>Good</Text>
          <Text style={[styles.statLabel, {color: colors.textSecondary}]}>
            This week
          </Text>
        </View>
        <View style={[styles.statCard, {backgroundColor: colors.surface}]}>
        <Text style={[styles.statValue, {color: colors.text}]}>12</Text>
          <Text style={[styles.statLabel, {color: colors.textSecondary}]}>
            Entries
          </Text>
        </View>
      </View>
    </ScrollView>
  )
}

export default Hero

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moodCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  moodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  moodLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  moodContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  moodIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moodText: {
    fontSize: 20,
    fontWeight: '600',
  },
  moodHint: {
    fontSize: 12,
  },
  chatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  chatContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  chatAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  chatAvatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  chatTextContainer: {
    gap: 2,
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  chatSubtitle: {
    fontSize: 14,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  quickActionsContent: {
    gap: 12,
    paddingRight: 20,
  },
  quickActionCard: {
    width: 100,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  quickActionSubtitle: {
    fontSize: 12,
  },
  journalCard: {
    padding: 16,
    borderRadius: 16,
    marginTop: 24,
    marginBottom: 16,
  },
  journalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  journalPreview: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  journalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
  },
})
