import { StatusBar } from "expo-status-bar";
import { Text, View, SafeAreaView } from "react-native";
import "./global.css";
import { ThemeProvider, useTheme } from "./src/context/ThemeContext";
import { GradientBackground } from "./src/components/common/GradientBackground";

function AppContent() {
  const { fontsLoaded, colors } = useTheme();

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GradientBackground style={{ flex: 1 }}>
      <SafeAreaView className="flex-1">
        <View className="flex-1 items-center justify-center px-6">
          <View className="bg-surface/50 rounded-3xl p-8 border border-white/10 shadow-2xl w-full">
            <Text className="font-jakarta-extrabold text-white text-4xl mb-2">
              TrackUrFinance
            </Text>
            <Text className="font-jakarta-medium text-slate-400 text-lg mb-8">
              Premium Fintech Expense Tracker
            </Text>

            <View className="bg-primary p-4 rounded-2xl mb-4 shadow-lg">
              <Text className="font-jakarta-bold text-white text-center">
                Get Started
              </Text>
            </View>

            <View className="bg-white/5 border border-white/10 p-4 rounded-2xl">
              <Text className="font-jakarta-semibold text-accent text-center">
                System consistent • High Performance
              </Text>
            </View>
          </View>
        </View>
        <StatusBar style="light" />
      </SafeAreaView>
    </GradientBackground>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
