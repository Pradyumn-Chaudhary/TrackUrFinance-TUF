import React from "react";
import { ViewProps } from "react-native";
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
  className,
  ...props
}) => {
  const { gradients } = useTheme();

  return (
    <LinearGradient
      colors={(colors as any) || gradients.background}
      style={style}
      className={`flex-1 ${className}`}
      {...props}
    >
      {children}
    </LinearGradient>
  );
};
