import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../navigation/AppNavigator';

const ProfileScreen = () => {
  const { colors, typography: typo, borderRadius: radii } = useTheme();
  const { user, signOut } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={[styles.avatarPlaceholder, { backgroundColor: colors.secondaryLight }]}>
            <Icon name="account" size={50} color={colors.secondary} />
          </View>
          <Text style={[typo.h2, { color: colors.text }]}>{user.name || 'User'}</Text>
          <Text style={[typo.bodySmall, { color: colors.textSecondary }]}>{user.email || 'email@example.com'}</Text>
        </View>


        <Text style={[typo.h4, styles.sectionTitle, { color: colors.text }]}>Account Settings</Text>
        <View style={[styles.settingsGroup, { backgroundColor: colors.surface, borderRadius: radii.lg }]}>
          <View style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <Icon name="bell-outline" size={20} color={colors.textSecondary} />
              <Text style={[typo.body, { color: colors.text, marginLeft: 12 }]}>Push Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: colors.border, true: colors.primary }}
            />
          </View>
          <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
            <View style={styles.settingTextContainer}>
              <Icon name="eye-off-outline" size={20} color={colors.textSecondary} />
              <Text style={[typo.body, { color: colors.text, marginLeft: 12 }]}>Privacy Mode</Text>
            </View>
            <Switch
              value={true}
              onValueChange={() => {}}
              trackColor={{ false: colors.border, true: colors.primary }}
            />
          </View>
        </View>

        <Text style={[typo.h4, styles.sectionTitle, { color: colors.text }]}>Preferences</Text>
        <View style={[styles.settingsGroup, { backgroundColor: colors.surface, borderRadius: radii.lg }]}>
          <View style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <Icon name="palette-swatch-outline" size={20} color={colors.textSecondary} />
              <Text style={[typo.body, { color: colors.text, marginLeft: 12 }]}>Dark Mode</Text>
            </View>
            <Switch
              value={false}
              onValueChange={() => {}}
              trackColor={{ false: colors.border, true: colors.primary }}
            />
          </View>
          <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
            <View style={styles.settingTextContainer}>
              <Icon name="translate" size={20} color={colors.textSecondary} />
              <Text style={[typo.body, { color: colors.text, marginLeft: 12 }]}>Language</Text>
            </View>
            <Text style={[typo.body, { color: colors.textSecondary, marginLeft: 12 }]}>English</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: colors.surface, borderRadius: radii.lg }]}
          onPress={signOut}
        >
          <View style={styles.logoutTextContainer}>
            <Icon name="logout" size={20} color={colors.error} />
            <Text style={[typo.button, { color: colors.error, marginLeft: 12 }]}>Sign Out</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={[typo.caption, { color: colors.textTertiary }]}>Calmi v1.0.0</Text>
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
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    marginBottom: 12,
    marginTop: 24,
  },
  settingsGroup: {
    padding: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  settingTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutButton: {
    marginTop: 32,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  logoutTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default ProfileScreen;
