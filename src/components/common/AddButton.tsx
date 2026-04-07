import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Plus } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../context/ThemeContext";

interface AddButtonProps {
  onPress?: () => void;
}

export const AddButton: React.FC<AddButtonProps> = ({ onPress }) => {
  const { gradients } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className="absolute bottom-[100px] right-6 w-16 h-16 rounded-full shadow-lg z-50"
    >
      <LinearGradient
        colors={gradients.primary as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="w-full h-full rounded-full items-center justify-center"
      >
        <Plus color="white" size={32} strokeWidth={2.5} />
      </LinearGradient>
    </TouchableOpacity>
  );
};
