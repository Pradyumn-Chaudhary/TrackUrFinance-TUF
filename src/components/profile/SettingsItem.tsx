import React from "react";
import { View, Text, TouchableOpacity, Switch } from "react-native";
import { ChevronRight, LucideIcon } from "lucide-react-native";
import { useTheme } from "../../context/ThemeContext";

interface SettingsItemProps {
  label: string;
  icon: LucideIcon;
  iconColor?: string;
  onPress?: () => void;
  showToggle?: boolean;
  toggleValue?: boolean;
  onToggle?: (value: boolean) => void;
  description?: string;
  isLast?: boolean;
  isDestructive?: boolean;
}

export const SettingsItem: React.FC<SettingsItemProps> = ({
  label,
  icon: Icon,
  iconColor,
  onPress,
  showToggle,
  toggleValue,
  onToggle,
  description,
  isLast,
  isDestructive,
}) => {
  const { colors, isDarkMode } = useTheme();

  const Content = (
    <View
      className={`flex-row items-center py-4 ${isLast ? "" : isDarkMode ? "border-b border-white/5" : "border-b border-slate-100"}`}
    >
      <View
        className={`h-10 w-10 rounded-xl items-center justify-center ${isDestructive ? "bg-error/10" : isDarkMode ? "bg-surface/60" : "bg-slate-100"}`}
      >
        <Icon
          size={22}
          color={isDestructive ? colors.error : iconColor || colors.primary}
        />
      </View>

      <View className="flex-1 ml-4">
        <Text
          className={`font-jakarta-bold text-base ${isDestructive ? "text-error" : isDarkMode ? "text-white" : "text-slate-900"}`}
        >
          {label}
        </Text>
        {description && (
          <Text
            className={`font-jakarta-medium ${isDarkMode ? "text-slate-500" : "text-slate-500"} text-xs mt-0.5`}
            numberOfLines={1}
          >
            {description}
          </Text>
        )}
      </View>

      {showToggle ? (
        <Switch
          value={toggleValue}
          onValueChange={onToggle}
          trackColor={{ false: "#1e293b", true: colors.primary }}
          thumbColor={toggleValue ? "white" : "#cbd5e1"}
        />
      ) : (
        !isDestructive && <ChevronRight size={20} color={colors.muted} />
      )}
    </View>
  );

  if (showToggle) {
    return <View className="px-1">{Content}</View>;
  }

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress} className="px-1">
      {Content}
    </TouchableOpacity>
  );
};
