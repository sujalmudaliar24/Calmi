# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Native 0.85.0 project bootstrapped with `@react-native-community/cli`. It supports both Android and iOS.

- **Node**: >= 22.11.0
- **React**: 19.2.3
- **React Native**: 0.85.0
- **Language**: TypeScript (strict)

## Key Commands

```sh
npm start          # Start Metro bundler
npm run android    # Build and run Android app
npm run ios        # Build and run iOS app
npm run lint       # Run ESLint
npm test           # Run Jest tests
```

### Running a Single Test

```sh
npm test -- path/to/test/file.test.tsx
```

### iOS Setup

On first clone or after updating native dependencies:
```sh
bundle install
bundle exec pod install
```

## App Overview

**Calmi** is a mobile-first mental wellness companion. It helps users track emotions, express thoughts, and receive AI-driven support through conversations, journaling, and insights. Focus areas:

- AI companion chat with memory of past interactions
- Mood tracking with visual timeline
- Smart journaling with AI tone detection
- Daily check-ins with push notifications
- AI insights dashboard (weekly/monthly analysis)
- Micro wellness actions (breathing, gratitude, mindfulness)
- Privacy mode (PIN/biometric lock)
- Voice interaction (optional advanced feature)

See `MEMORY.md` (memory directory) for the full app specification.

## Architecture

- `App.tsx` — Root component wrapped in `SafeAreaProvider`
- `index.js` — Metro entry point
- `babel.config.js` / `metro.config.js` / `jest.config.js` — Standard React Native tool configs
- `android/` — Android native project (Kotlin, Gradle)
- `ios/` — iOS native project (Swift, CocoaPods)

The app currently uses `@react-native/new-app-screen` as a template. Replace or extend `App.tsx` and its `AppContent` component to build out app UI.

## Tooling

- **ESLint**: extends `@react-native` preset
- **Prettier**: version 2.8.8
- **Testing**: Jest with `@react-native/jest-preset`
