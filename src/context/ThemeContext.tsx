import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import * as Font from "expo-font";
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from "@expo-google-fonts/plus-jakarta-sans";
import { Colors, Gradients, Shadows } from "../constants/theme";

type ThemeMode = "light" | "dark";

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  colors: typeof Colors;
  gradients: typeof Gradients;
  shadows: typeof Shadows;
  fontsLoaded: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<ThemeMode>(
    (systemColorScheme as ThemeMode) || "dark",
  );
  const [fontsLoaded, setFontsLoaded] = useState(false);

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
        // Fallback or handle error
      }
    }
    loadFonts();
  }, []);

  const value = {
    theme,
    setTheme,
    colors: Colors,
    gradients: Gradients,
    shadows: Shadows,
    fontsLoaded,
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
