import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import "./global.css";
import { ThemeProvider, useTheme } from "./src/context/ThemeContext";
import { BottomTabNavigator } from "./src/navigation/BottomTabNavigator";
import { useAuthStore } from "./src/store/useAuthStore";
import AuthScreen from "./src/screens/AuthScreen";

function AppContent() {
  const { fontsLoaded, isDarkMode } = useTheme();
  const { isAuthenticated } = useAuthStore();

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      {isAuthenticated ? <BottomTabNavigator /> : <AuthScreen />}
      <StatusBar style={isDarkMode ? "light" : "dark"} />
    </>
  );
}

const AppShell = React.memo(() => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AppContent />
      </NavigationContainer>
    </SafeAreaProvider>
  );
});

export default function App() {
  return (
    <ThemeProvider>
      <AppShell />
    </ThemeProvider>
  );
}
