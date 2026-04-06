export const Colors = {
  primary: "#4F46E5",
  primaryDark: "#4338CA",
  primaryLight: "#818CF8",
  secondary: "#3B82F6",
  secondaryDark: "#2563EB",
  secondaryLight: "#60A5FA",
  accent: "#10B981",
  error: "#F43F5E",
  background: "#0F172A",
  surface: "#1E293B",
  muted: "#64748B",
  white: "#FFFFFF",
  black: "#000000",
  slate: {
    50: "#F8FAFC",
    100: "#F1F5F9",
    200: "#E2E8F0",
    300: "#CBD5E1",
    400: "#94A3B8",
    500: "#64748B",
    600: "#475569",
    700: "#334155",
    800: "#1E293B",
    900: "#0F172A",
  },
};

export const Gradients = {
  primary: [Colors.primary, Colors.secondary],
  dark: [Colors.background, Colors.surface],
  emerald: ["#10B981", "#34D399"],
  rose: ["#F43F5E", "#FB7185"],
};

export const Shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
};
