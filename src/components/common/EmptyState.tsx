import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { LucideIcon, Plus } from "lucide-react-native";
import { useTheme } from "../../context/ThemeContext";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onAction?: () => void;
  actionLabel?: string;
}

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  onAction,
  actionLabel,
}: EmptyStateProps) => {
  const { isDarkMode, colors } = useTheme();

  return (
    <View className="items-center justify-center py-20 px-8">
      <View
        className={`${isDarkMode ? "bg-surface" : "bg-slate-100"} p-8 rounded-full mb-6`}
      >
        <Icon size={48} color={colors.primary} strokeWidth={1.5} />
      </View>
      <Text
        className={`font-jakarta-bold ${isDarkMode ? "text-white" : "text-slate-900"} text-xl text-center mb-2`}
      >
        {title}
      </Text>
      <Text className="font-jakarta-medium text-slate-500 text-center mb-10 leading-6 max-w-[280px]">
        {description}
      </Text>
      {onAction && (
        <TouchableOpacity
          onPress={onAction}
          className="bg-primary px-8 py-4 rounded-2xl flex-row items-center shadow-lg"
          activeOpacity={0.8}
        >
          <Plus size={20} color="white" className="mr-2" />
          <Text className="text-white font-jakarta-bold text-base">
            {actionLabel || "Get Started"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
