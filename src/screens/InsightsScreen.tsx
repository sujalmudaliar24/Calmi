import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme';

const { width } = Dimensions.get('window');

const InsightsScreen = () => {
  const { colors, typography: typo, borderRadius: radii } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[typo.h1, styles.title, { color: colors.text }]}>Wellness Insights</Text>
        <Text style={[typo.body, styles.subtitle, { color: colors.textSecondary }]}>
          Your emotional trends over the last 7 days
        </Text>

        {/* Mood Trend Chart Placeholder */}
        <View style={[styles.chartPlaceholder, { backgroundColor: colors.surface, borderRadius: radii.lg }]}>
          <View style={styles.chartGrid}>
            {[...Array(7)].map((_, i) => (
              <View key={i} style={[styles.bar, { backgroundColor: colors.primaryLight, height: Math.random() * 100 + 20 }]} />
            ))}
          </View>
          <Text style={[typo.caption, styles.placeholderText, { color: colors.textTertiary }]}>
            Mood Trend Analysis
          </Text>
        </View>

        <Text style={[typo.h4, styles.sectionTitle, { color: colors.text }]}>Quick Stats</Text>
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: colors.surface, borderRadius: radii.md }]}>
            <Text style={[typo.label, styles.statLabel, { color: colors.textSecondary }]}>Mood Stability</Text>
            <Text style={[typo.h4, styles.statValue, { color: colors.primary }]}>High</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface, borderRadius: radii.md }]}>
            <Text style={[typo.label, styles.statLabel, { color: colors.textSecondary }]}>Journaling Streak</Text>
            <Text style={[typo.h4, styles.statValue, { color: colors.secondary }]}>5 Days</Text>
          </View>
        </View>

        <Text style={[typo.h4, styles.sectionTitle, { color: colors.text }]}>Common Triggers</Text>
        <View style={styles.triggerList}>
          {['Work Stress', 'Lack of Sleep', 'Social Anxiety'].map((trigger, i) => (
            <View key={i} style={[styles.triggerItem, { backgroundColor: colors.surface, borderRadius: radii.sm, borderLeftColor: colors.primary }]}>
              <Text style={[typo.body, { color: colors.text }]}>{trigger}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 24,
  },
  chartPlaceholder: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  chartGrid: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
    height: 120,
    marginBottom: 12,
  },
  bar: {
    width: 20,
    borderRadius: 4,
  },
  placeholderText: {
    textAlign: 'center',
  },
  sectionTitle: {
    marginBottom: 16,
    marginTop: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  statLabel: {
    marginBottom: 4,
  },
  statValue: {
    fontWeight: 'bold',
  },
  triggerList: {
    gap: 10,
  },
  triggerItem: {
    padding: 16,
    borderLeftWidth: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
});

export default InsightsScreen;
