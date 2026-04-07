import React from "react";
import { View, Text, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../context/ThemeContext";

interface ProfileCardProps {
  name: string;
  email: string;
  avatarUrl?: string;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  email,
  avatarUrl,
}) => {
  const { gradients, isDarkMode } = useTheme();

  return (
    <View className="mb-8 items-center">
      <View
        className={`${isDarkMode ? "bg-surface/50" : "bg-white"} p-6 rounded-[40px] w-full border ${isDarkMode ? "border-white/5" : "border-slate-200"} shadow-2xl relative overflow-hidden`}
      >
        {/* Subtle background glow */}
        <LinearGradient
          colors={
            isDarkMode
              ? ["rgba(99, 102, 241, 0.15)", "transparent"]
              : ["rgba(99, 102, 241, 0.05)", "transparent"]
          }
          className="absolute top-0 left-0 right-0 h-40"
        />

        <View className="flex-row items-center">
          <View
            className={`p-1 rounded-full border-2 ${isDarkMode ? "border-primary/30" : "border-primary/10"}`}
          >
            <View
              className={`h-20 w-20 rounded-full ${isDarkMode ? "bg-slate-800" : "bg-slate-100"} items-center justify-center overflow-hidden border ${isDarkMode ? "border-white/10" : "border-slate-200"}`}
            >
              {avatarUrl ? (
                <Image source={{ uri: avatarUrl }} className="h-full w-full" />
              ) : (
                <Text
                  className={`${isDarkMode ? "text-white" : "text-slate-800"} font-jakarta-extrabold text-2xl`}
                >
                  {name.charAt(0)}
                </Text>
              )}
            </View>
          </View>

          <View className="ml-5">
            <Text
              className={`font-jakarta-extrabold ${isDarkMode ? "text-white" : "text-slate-900"} text-2xl`}
            >
              {name}
            </Text>
            <Text
              className={`font-jakarta-medium ${isDarkMode ? "text-slate-400" : "text-slate-500"} text-sm mt-1`}
            >
              {email}
            </Text>

            <View className="bg-accent/10 px-3 py-1 rounded-full self-start mt-3 border border-accent/20">
              <Text className="text-accent font-jakarta-bold text-[10px] uppercase tracking-widest">
                Premium Member
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
