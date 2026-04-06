import React from "react";
import { StyleSheet, ViewProps } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../context/ThemeContext";

interface GradientBackgroundProps extends ViewProps {
  colors?: string[];
  children: React.ReactNode;
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  colors,
  children,
  style,
  ...props
}) => {
  const { gradients } = useTheme();

  return (
    <LinearGradient
      colors={(colors as any) || gradients.dark}
      style={[styles.container, style]}
      {...props}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
