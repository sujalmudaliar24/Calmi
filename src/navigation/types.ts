import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { ReactNavigationProp } from '@react-navigation/native';

export type AuthStackParamList = {
  Login: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Journal: undefined;
  Insights: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackProp = NativeStackNavigationProp<AuthStackParamList>;
export type MainTabProp = BottomTabNavigationProp<MainTabParamList>;
export type RootStackProp = NativeStackNavigationProp<RootStackParamList>;
