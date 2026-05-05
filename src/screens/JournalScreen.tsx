/**
 * Journal Screen for Calmi
 *
 * Smart journaling with mood tracking and AI tone detection.
 * Features:
 * - Create journal entries with mood tagging
 * - View past journal entries
 * - Search and filter entries
 * - AI-powered tone analysis
 */

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useTheme } from '../theme'
import { EmotionCategory } from '../services/api/sentimentService'

// Icon mapping for emotions (vector icons, no emojis)
const EMOTION_ICONS: Record<EmotionCategory, string> = {
  happy: 'emoticon-happy-outline',
  calm: 'meditation',
  anxious: 'emoticon-confused-outline',
  sad: 'emoticon-sad-outline',
  stressed: 'lightning-bolt',
  angry: 'emoticon-angry-outline',
  neutral: 'emoticon-neutral-outline',
}

const EMOTION_COLORS: Record<EmotionCategory, string> = {
  happy: '#FFD166',
  calm: '#7ECFBE',
  anxious: '#FFB5A7',
  sad: '#B8A9E8',
  stressed: '#FF8A7A',
  angry: '#FF7B7B',
  neutral: '#A8A2B8',
}

interface JournalEntry {
  id: string
  content: string
  mood: EmotionCategory
  moodLabel: string
  createdAt: Date
  toneHints: string[]
}

// No mock entries - user starts with empty journal
const EMPTY_ENTRIES: JournalEntry[] = []

interface Props {
  navigation?: any
}

const JournalScreen: React.FC<Props> = ({ navigation }) => {
  const { colors, typography: typo, borderRadius: radii } = useTheme()
  const [entries, setEntries] = useState<JournalEntry[]>(EMPTY_ENTRIES)
  const [journalText, setJournalText] = useState('')
  const [selectedMood, setSelectedMood] = useState<EmotionCategory | null>(null)
  const [showNewEntry, setShowNewEntry] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const textInputRef = useRef<TextInput>(null)

  const formatDate = (date: Date): string => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  }

  const handleSaveEntry = () => {
    if (!journalText.trim() || !selectedMood) return

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      content: journalText.trim(),
      mood: selectedMood,
      moodLabel: selectedMood.charAt(0).toUpperCase() + selectedMood.slice(1),
      createdAt: new Date(),
      toneHints: ['Thoughtful reflection'],
    }

    setEntries(prev => [newEntry, ...prev])
    setJournalText('')
    setSelectedMood(null)
    setShowNewEntry(false)
  }

  const filteredEntries = entries.filter(entry =>
    entry.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const renderMoodSelector = () => (
    <View style={styles.moodSelectorContainer}>
      <Text style={[styles.moodSelectorLabel, { color: colors.textSecondary }]}>
        How are you feeling?
      </Text>
      <View style={styles.moodOptionsRow}>
        {(Object.keys(EMOTION_ICONS) as EmotionCategory[]).map(emotion => (
          <TouchableOpacity
            key={emotion}
            style={[
              styles.moodOption,
              {
                backgroundColor: selectedMood === emotion ? EMOTION_COLORS[emotion] : colors.surfaceSecondary,
                borderRadius: radii.md,
              },
            ]}
            onPress={() => setSelectedMood(emotion)}
            activeOpacity={0.7}>
            <Icon
              name={EMOTION_ICONS[emotion]}
              size={24}
              color={selectedMood === emotion ? colors.textInverse : EMOTION_COLORS[emotion]}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )

  const renderNewEntryForm = () => (
    <View style={[styles.newEntryCard, { backgroundColor: colors.surface, borderRadius: radii.xl }]}>
      <View style={styles.newEntryHeader}>
        <View style={styles.newEntryTitleRow}>
          <Icon name="book-edit-outline" size={24} color={colors.primary} />
          <Text style={[styles.newEntryTitle, { color: colors.text }]}>New Entry</Text>
        </View>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => {
            setShowNewEntry(false)
            setJournalText('')
            setSelectedMood(null)
          }}>
          <Icon name="close" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {renderMoodSelector()}

      <TextInput
        ref={textInputRef}
        style={[
          styles.journalTextInput,
          {
            backgroundColor: colors.surfaceSecondary,
            color: colors.text,
            borderRadius: radii.lg,
          },
        ]}
        placeholder="What's on your mind today? Write freely..."
        placeholderTextColor={colors.placeholder}
        multiline
        value={journalText}
        onChangeText={setJournalText}
        textAlignVertical="top"
      />

      <View style={styles.newEntryFooter}>
        <TouchableOpacity
          style={[
            styles.saveButton,
            {
              backgroundColor: journalText.trim() && selectedMood ? colors.primary : colors.disabled,
              borderRadius: radii.lg,
            },
          ]}
          onPress={handleSaveEntry}
          disabled={!journalText.trim() || !selectedMood}>
          <Icon name="content-save-outline" size={20} color={colors.textInverse} />
          <Text style={[styles.saveButtonText, { color: colors.textInverse }]}>Save Entry</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  const renderJournalEntry = ({ item }: { item: JournalEntry }) => (
    <TouchableOpacity
      style={[styles.entryCard, { backgroundColor: colors.surface, borderRadius: radii.xl }]}
      activeOpacity={0.7}>
      <View style={styles.entryHeader}>
        <View style={styles.entryDateContainer}>
          <Icon name="calendar-today" size={14} color={colors.textTertiary} />
          <Text style={[styles.entryDate, { color: colors.textSecondary }]}>
            {formatDate(item.createdAt)}
          </Text>
          <Text style={[styles.entryTime, { color: colors.textTertiary }]}>
            {formatTime(item.createdAt)}
          </Text>
        </View>
        <View style={[styles.moodBadge, { backgroundColor: EMOTION_COLORS[item.mood] + '20' }]}>
          <Icon name={EMOTION_ICONS[item.mood]} size={16} color={EMOTION_COLORS[item.mood]} />
          <Text style={[styles.moodBadgeText, { color: EMOTION_COLORS[item.mood] }]}>
            {item.moodLabel}
          </Text>
        </View>
      </View>

      <Text
        style={[styles.entryContent, { color: colors.text }]}
        numberOfLines={4}>
        {item.content}
      </Text>

      {item.toneHints.length > 0 && (
        <View style={styles.toneHintsContainer}>
          {item.toneHints.map((hint, index) => (
            <View key={index} style={[styles.toneHintBadge, { backgroundColor: colors.surfaceSecondary }]}>
              <Icon name="lightbulb-outline" size={12} color={colors.textTertiary} />
              <Text style={[styles.toneHintText, { color: colors.textTertiary }]}>{hint}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.entryFooter}>
        <TouchableOpacity style={styles.entryAction}>
          <Icon name="pencil-outline" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.entryAction}>
          <Icon name="share-variant-outline" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.entryAction}>
          <Icon name="delete-outline" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation?.goBack()}>
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[typo.h3, { color: colors.text }]}>Journal</Text>
          <Text style={[styles.entryCount, { color: colors.textSecondary }]}>
            {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => {}}>
          <Icon name="dots-vertical" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: colors.surfaceSecondary, borderRadius: radii.lg }]}>
          <Icon name="magnify" size={20} color={colors.textTertiary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search your journal..."
            placeholderTextColor={colors.placeholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="close-circle" size={18} color={colors.textTertiary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Content */}
      {showNewEntry ? (
        renderNewEntryForm()
      ) : (
        <FlatList
          data={filteredEntries}
          renderItem={renderJournalEntry}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.entriesList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Icon name="book-outline" size={64} color={colors.textTertiary} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No entries yet</Text>
              <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                Start writing to track your thoughts
              </Text>
            </View>
          }
        />
      )}

      {/* Floating Action Button */}
      {!showNewEntry && (
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: colors.primary }]}
          onPress={() => setShowNewEntry(true)}
          activeOpacity={0.8}>
          <Icon name="plus" size={28} color={colors.textInverse} />
        </TouchableOpacity>
      )}
    </KeyboardAvoidingView>
  )
}

export default JournalScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerCenter: {
    alignItems: 'center',
  },
  entryCount: {
    fontSize: 12,
    marginTop: 2,
  },
  menuButton: {
    padding: 8,
    marginRight: -8,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  entriesList: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  entryCard: {
    padding: 16,
    marginBottom: 12,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  entryDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  entryDate: {
    fontSize: 13,
    fontWeight: '500',
  },
  entryTime: {
    fontSize: 12,
  },
  moodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  moodBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  entryContent: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  toneHintsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  toneHintBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  toneHintText: {
    fontSize: 11,
  },
  entryFooter: {
    flexDirection: 'row',
    gap: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  entryAction: {
    padding: 4,
  },
  newEntryCard: {
    margin: 16,
    padding: 20,
  },
  newEntryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  newEntryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  newEntryTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  moodSelectorContainer: {
    marginBottom: 16,
  },
  moodSelectorLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
  },
  moodOptionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  moodOption: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  journalTextInput: {
    minHeight: 180,
    padding: 16,
    fontSize: 16,
    lineHeight: 24,
  },
  newEntryFooter: {
    marginTop: 16,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 32,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
    gap: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  emptySubtitle: {
    fontSize: 14,
  },
})
