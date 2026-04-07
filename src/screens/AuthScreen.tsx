import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Mail, Lock, User as UserIcon, Eye, EyeOff } from "lucide-react-native";
import { useTheme } from "../context/ThemeContext";
import { useAuthStore } from "../store/useAuthStore";
import { useTransactionStore } from "../store/useTransactionStore";
import { GradientBackground } from "../components/common/GradientBackground";

export default function AuthScreen() {
  const { colors, isDarkMode } = useTheme();
  const { login, signup, user: storedUser } = useAuthStore();
  const { clearAll } = useTransactionStore();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const titleColor = isDarkMode ? "text-white" : "text-slate-800";
  const inputBg = isDarkMode ? "bg-surface/50" : "bg-white";
  const inputBorder = isDarkMode ? "border-white/10" : "border-slate-200";
  const textColor = isDarkMode ? "text-white" : "text-slate-900";

  const validatePassword = (pass: string) => {
    // Min 8 chars, at least 1 letter, 1 number or symbol
    const minLength = pass.length >= 8;
    const hasLetter = /[a-zA-Z]/.test(pass);
    const hasSymbolOrNum = /[^a-zA-Z\s]/.test(pass);
    return minLength && hasLetter && hasSymbolOrNum;
  };

  const validateEmail = (mail: string) => {
    return mail.includes("@") && mail.includes(".");
  };

  const isFormValid = () => {
    if (mode === "signin") {
      return validateEmail(email) && password.length > 0;
    }
    return (
      name.trim().length > 0 &&
      validateEmail(email) &&
      validatePassword(password) &&
      password === confirmPassword
    );
  };
  const isSubmitDisabled = !isFormValid();

  const handleSubmit = () => {
    if (mode === "signin") {
      if (!validateEmail(email)) {
        Alert.alert("Invalid Email", "Please enter a valid email address.");
        return;
      }
      if (!password) {
        Alert.alert("Required", "Please enter your password.");
        return;
      }
      if (!storedUser) {
        Alert.alert(
          "No Account",
          "You don't have an account yet. We've switched you to Sign Up so you can create one!",
        );
        setMode("signup");
        return;
      }

      // Only check password if it was saved (backward compatible with old mock accounts)
      const isPasswordCorrect = storedUser.password
        ? storedUser.password === password
        : true;

      if (storedUser.email === email && isPasswordCorrect) {
        login(storedUser);
      } else {
        Alert.alert("Invalid Credentials", "Incorrect email or password.");
      }
    } else {
      // Signup
      if (!name.trim()) {
        Alert.alert("Required", "Please enter your name.");
        return;
      }
      if (!validateEmail(email)) {
        Alert.alert("Invalid Email", "Please enter a valid email address.");
        return;
      }
      if (!validatePassword(password)) {
        Alert.alert(
          "Weak Password",
          "Password must be at least 8 characters long and contain both letters and symbols/numbers.",
        );
        return;
      }
      if (password !== confirmPassword) {
        Alert.alert("Mismatch", "Passwords do not match.");
        return;
      }

      if (storedUser && storedUser.email !== email) {
        Alert.alert(
          "Warning",
          "You are signing up with a new email. This will overwrite previous user data and delete your transactions.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Confirm & Delete Data",
              style: "destructive",
              onPress: () => {
                clearAll();
                signup({ name, email, password });
              },
            },
          ],
        );
      } else {
        signup({ name, email, password });
      }
    }
  };

  const content = (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent:
          Platform.OS === "android" && mode === "signup"
            ? "flex-start"
            : "center",
        padding: 24,
        paddingBottom: Platform.OS === "android" ? 120 : 24,
      }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      style={{ flex: 1 }}
    >
      {/* Logo area */}
      <View className="items-center mb-8 mt-4">
        <View
          style={{
            width: 80,
            height: 80,
            backgroundColor: isDarkMode ? "#FFFFFF" : "#0F172A",
            borderRadius: 24,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.15,
            shadowRadius: 20,
            elevation: 10,
          }}
        >
          <Text
            style={{
              fontFamily: "PlusJakartaSans-ExtraBold",
              fontSize: 32,
              color: isDarkMode ? "#0F172A" : "#FFFFFF",
            }}
          >
            TUF
          </Text>
        </View>
        <Text
          className={`font-jakarta-extrabold ${titleColor} text-2xl text-center mb-2`}
        >
          Welcome to TrackUrFinance
        </Text>
        <Text className="text-slate-500 font-jakarta-medium text-sm text-center px-4">
          Manage your money like a pro. Sign in or create an account to get
          started.
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          backgroundColor: isDarkMode ? "rgba(30,41,59,0.8)" : "#F1F5F9",
          borderRadius: 18,
          padding: 4,
          marginBottom: 24,
          width: "100%",
          maxWidth: 400,
          alignSelf: "center",
        }}
      >
        {(["signin", "signup"] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => {
              setMode(tab);
            }}
            activeOpacity={0.7}
            style={{
              flex: 1,
              paddingVertical: 14,
              alignItems: "center",
              borderRadius: 14,
              backgroundColor:
                mode === tab
                  ? isDarkMode
                    ? colors.primary
                    : "#FFFFFF"
                  : "transparent",
              shadowColor: mode === tab && !isDarkMode ? "#000" : "transparent",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
              elevation: mode === tab && !isDarkMode ? 2 : 0,
            }}
          >
            <Text
              style={{
                fontFamily: "PlusJakartaSans-Bold",
                fontSize: 15,
                color:
                  mode === tab
                    ? isDarkMode
                      ? "#FFFFFF"
                      : colors.primary
                    : "#64748B",
              }}
            >
              {tab === "signin" ? "Sign In" : "Sign Up"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Form */}
      <View className="w-full max-w-sm self-center gap-4">
        {mode === "signup" && (
          <View
            className={`flex-row items-center border ${inputBorder} ${inputBg} rounded-2xl px-4 py-3`}
          >
            <UserIcon color={colors.textMuted} size={20} />
            <TextInput
              className={`flex-1 ml-3 font-jakarta-medium text-base ${textColor}`}
              placeholder="Full Name"
              placeholderTextColor={colors.textMuted}
              value={name}
              onChangeText={setName}
            />
          </View>
        )}

        <View
          className={`flex-row items-center border ${inputBorder} ${inputBg} rounded-2xl px-4 py-3`}
        >
          <Mail color={colors.textMuted} size={20} />
          <TextInput
            className={`flex-1 ml-3 font-jakarta-medium text-base ${textColor}`}
            placeholder="Email Address"
            placeholderTextColor={colors.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View
          className={`flex-row items-center border ${inputBorder} ${inputBg} rounded-2xl px-4 py-3`}
        >
          <Lock color={colors.textMuted} size={20} />
          <TextInput
            className={`flex-1 mx-3 font-jakarta-medium text-base ${textColor}`}
            placeholder="Password"
            placeholderTextColor={colors.textMuted}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            {showPassword ? (
              <EyeOff color={colors.textMuted} size={20} />
            ) : (
              <Eye color={colors.textMuted} size={20} />
            )}
          </TouchableOpacity>
        </View>

        {mode === "signup" && (
          <View
            className={`flex-row items-center border ${inputBorder} ${inputBg} rounded-2xl px-4 py-3`}
          >
            <Lock color={colors.textMuted} size={20} />
            <TextInput
              className={`flex-1 mx-3 font-jakarta-medium text-base ${textColor}`}
              placeholder="Confirm Password"
              placeholderTextColor={colors.textMuted}
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff color={colors.textMuted} size={20} />
              ) : (
                <Eye color={colors.textMuted} size={20} />
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          activeOpacity={0.85}
          style={{ marginTop: 16 }}
        >
          <View style={{ opacity: isSubmitDisabled ? 0.4 : 1 }}>
            <LinearGradient
              colors={[colors.primary, colors.secondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                paddingVertical: 16,
                borderRadius: 16,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "PlusJakartaSans-ExtraBold",
                  color: "#FFFFFF",
                  fontSize: 18,
                }}
              >
                {mode === "signin" ? "Sign In" : "Create Account"}
              </Text>
            </LinearGradient>
          </View>
        </TouchableOpacity>

        <Text className="text-slate-500 font-jakarta-medium text-xs text-center mt-6">
          * This is a local-first dummy authentication. {"\n"} Your data is
          safely stored on your device using local storage.
        </Text>
      </View>
    </ScrollView>
  );

  return (
    <View
      style={{ flex: 1, backgroundColor: isDarkMode ? "#0F172A" : "#F8FAFC" }}
    >
      <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === "android" ? 40 : 0}
        >
          {content}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
