export const BaseColors = {
  primary: "#4F46E5",
  primaryDark: "#4338CA",
  primaryLight: "#818CF8",
  secondary: "#3B82F6",
  secondaryDark: "#2563EB",
  secondaryLight: "#60A5FA",
  accent: "#10B981",
  error: "#F43F5E",
  white: "#FFFFFF",
  black: "#000000",
};

export const DarkTheme = {
  colors: {
    ...BaseColors,
    background: "#0F172A",
    surface: "#1E293B",
    text: "#FFFFFF",
    textMuted: "#94A3B8",
    border: "rgba(255, 255, 255, 0.1)",
    muted: "#1E293B",
  },
  gradients: {
    background: ["#0F172A", "#1E293B"],
    surface: ["#1E293B", "#0F172A"],
    primary: [BaseColors.primary, BaseColors.secondary],
  },
};

export const LightTheme = {
  colors: {
    ...BaseColors,
    background: "#F8FAFC",
    surface: "#FFFFFF",
    text: "#0F172A",
    textMuted: "#64748B",
    border: "rgba(0, 0, 0, 0.05)",
    muted: "#F1F5F9",
  },
  gradients: {
    background: ["#F8FAFC", "#E2E8F0"],
    surface: ["#FFFFFF", "#F8FAFC"],
    primary: [BaseColors.primary, BaseColors.secondary],
  },
};

// For backward compatibility and shared tokens
export const Colors = DarkTheme.colors;
export const Gradients = DarkTheme.gradients;

export const Shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
  },
};
