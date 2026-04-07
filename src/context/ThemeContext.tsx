import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Font from "expo-font";
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from "@expo-google-fonts/plus-jakarta-sans";
import { DarkTheme, LightTheme, Shadows } from "../constants/theme";

type ThemeMode = "light" | "dark";
export type CurrencyCode = "USD" | "EUR" | "INR" | "GBP";

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  colors: typeof DarkTheme.colors;
  gradients: typeof DarkTheme.gradients;
  shadows: typeof Shadows;
  fontsLoaded: boolean;
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemeMode>(
    (systemColorScheme as ThemeMode) || "dark",
  );
  const [currency, setCurrencyState] = useState<CurrencyCode>("USD");
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Load saved preferences on mount
  useEffect(() => {
    async function loadSettings() {
      try {
        const savedTheme = await AsyncStorage.getItem("user-theme");
        const savedCurrency = await AsyncStorage.getItem("user-currency");

        if (savedTheme === "light" || savedTheme === "dark") {
          setThemeState(savedTheme as ThemeMode);
        }
        if (savedCurrency) {
          setCurrencyState(savedCurrency as CurrencyCode);
        }
      } catch (e) {
        console.error("Failed to load settings", e);
      }
    }
    loadSettings();
  }, []);

  const setTheme = async (mode: ThemeMode) => {
    setThemeState(mode);
    try {
      await AsyncStorage.setItem("user-theme", mode);
    } catch (e) {
      console.error("Failed to save theme", e);
    }
  };

  const setCurrency = async (code: CurrencyCode) => {
    setCurrencyState(code);
    try {
      await AsyncStorage.setItem("user-currency", code);
    } catch (e) {
      console.error("Failed to save currency", e);
    }
  };

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          "PlusJakartaSans-Regular": PlusJakartaSans_400Regular,
          "PlusJakartaSans-Medium": PlusJakartaSans_500Medium,
          "PlusJakartaSans-SemiBold": PlusJakartaSans_600SemiBold,
          "PlusJakartaSans-Bold": PlusJakartaSans_700Bold,
          "PlusJakartaSans-ExtraBold": PlusJakartaSans_800ExtraBold,
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error("Error loading fonts", error);
      }
    }
    loadFonts();
  }, []);

  const isDarkMode = theme === "dark";
  const currentTheme = isDarkMode ? DarkTheme : LightTheme;

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  const value = {
    theme,
    setTheme,
    isDarkMode,
    toggleTheme,
    colors: currentTheme.colors,
    gradients: currentTheme.gradients,
    shadows: Shadows,
    fontsLoaded,
    currency,
    setCurrency,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
