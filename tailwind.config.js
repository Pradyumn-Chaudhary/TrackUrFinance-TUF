/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4F46E5",
          dark: "#4338CA",
          light: "#818CF8",
        },
        secondary: {
          DEFAULT: "#3B82F6",
          dark: "#2563EB",
          light: "#60A5FA",
        },
        accent: "#10B981",
        error: "#F43F5E",
        background: "#0F172A",
        surface: "#1E293B",
        muted: "#64748B",
      },
      fontFamily: {
        jakarta: ["PlusJakartaSans-Regular"],
        "jakarta-bold": ["PlusJakartaSans-Bold"],
        "jakarta-extrabold": ["PlusJakartaSans-ExtraBold"],
        "jakarta-medium": ["PlusJakartaSans-Medium"],
        "jakarta-semibold": ["PlusJakartaSans-SemiBold"],
      },
    },
  },
  plugins: [],
};
