import React from "react";
import { View, Text, ScrollView, Alert, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Sun,
  Moon,
  CreditCard,
  Bell,
  LogOut,
  Database,
  CheckCircle,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { GradientBackground } from "../components/common/GradientBackground";
import { ProfileCard } from "../components/profile/ProfileCard";
import { SettingsItem } from "../components/profile/SettingsItem";
import { useTheme, CurrencyCode } from "../context/ThemeContext";
import { useTransactionStore } from "../store/useTransactionStore";
import { useAuthStore } from "../store/useAuthStore";
import { MOCK_TRANSACTIONS } from "../constants/mockData";
import { CurrencyPickerModal } from "../components/profile/CurrencyPickerModal";
import { NotificationSettingsModal } from "../components/profile/NotificationSettingsModal";

const ProfileScreen = () => {
  const { isDarkMode, toggleTheme, currency, colors } = useTheme();
  const { loadDemoData, removeDemoData, transactions } = useTransactionStore();
  const { logout, user } = useAuthStore();

  const [showCurrencyModal, setShowCurrencyModal] = React.useState(false);
  const [showNotifModal, setShowNotifModal] = React.useState(false);

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () => logout(),
      },
    ]);
  };

  const alreadyLoaded = MOCK_TRANSACTIONS.every((m) =>
    transactions.some((t) => t.id === m.id),
  );

  const handleLoadDemo = () => {
    if (alreadyLoaded) {
      Alert.alert(
        "Remove Demo Data",
        "Do you want to remove the demo transactions from your history?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Remove",
            style: "destructive",
            onPress: () => {
              removeDemoData();
              Alert.alert("Removed", "Demo data has been removed.");
            },
          },
        ],
      );
      return;
    }
    Alert.alert(
      "📊 Load Demo Data?",
      `This will add ${MOCK_TRANSACTIONS.length} sample transactions to your account, spanning February–April 2026.\n\n` +
        `Included:\n` +
        `• 3 months of salary income\n` +
        `• Grocery & food expenses\n` +
        `• Transport, Bills, Shopping\n` +
        `• Entertainment & Health\n\n` +
        `Your existing data will NOT be deleted.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Import Demo",
          onPress: () => {
            loadDemoData();
            Alert.alert(
              "✅ Done!",
              `${MOCK_TRANSACTIONS.length} demo transactions imported successfully.`,
            );
          },
        },
      ],
    );
  };

  const titleColor = isDarkMode ? "text-white" : "text-slate-800";
  const sectionBg = isDarkMode ? "bg-surface/30" : "bg-white/80";
  const sectionBorder = isDarkMode ? "border-white/5" : "border-slate-200";

  return (
    <GradientBackground className="flex-1">
      <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
        <ScrollView
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          <View className="py-6">
            <Text className={`font-jakarta-extrabold ${titleColor} text-3xl`}>
              Profile
            </Text>
          </View>

          <ProfileCard
            name={user?.name || "Guest"}
            email={user?.email || "guest@tuf.finance"}
          />

          <View className="mb-8">
            <Text className="text-slate-500 font-jakarta-bold text-xs uppercase tracking-widest mb-2 ml-1">
              Preferences
            </Text>
            <View
              className={`${sectionBg} rounded-3xl p-2 border ${sectionBorder} shadow-sm`}
            >
              <SettingsItem
                label="Appearance"
                icon={isDarkMode ? Moon : Sun}
                description={isDarkMode ? "Dark Mode" : "Light Mode"}
                showToggle
                toggleValue={isDarkMode}
                onToggle={toggleTheme}
              />
              <SettingsItem
                label="Currency"
                icon={CreditCard}
                description={currency}
                onPress={() => setShowCurrencyModal(true)}
                isLast
              />
            </View>
          </View>

          <View className="mb-8">
            <Text className="text-slate-500 font-jakarta-bold text-xs uppercase tracking-widest mb-2 ml-1">
              Account & Notifications
            </Text>
            <View
              className={`${sectionBg} rounded-3xl p-2 border ${sectionBorder} shadow-sm`}
            >
              <SettingsItem
                label="Notifications"
                icon={Bell}
                description="Daily reminders"
                onPress={() => setShowNotifModal(true)}
                isLast
              />
            </View>
          </View>

          {/* Demo Data Card */}
          <View className="mb-8">
            <Text className="text-slate-500 font-jakarta-bold text-xs uppercase tracking-widest mb-2 ml-1">
              Developer
            </Text>
            <TouchableOpacity onPress={handleLoadDemo} activeOpacity={0.85}>
              <LinearGradient
                colors={
                  alreadyLoaded
                    ? ["#1E293B", "#1E293B"]
                    : [colors.primary, colors.secondary]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ borderRadius: 24, padding: 20 }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 14,
                      backgroundColor: "rgba(255,255,255,0.15)",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 16,
                    }}
                  >
                    {alreadyLoaded ? (
                      <CheckCircle color="#10B981" size={24} />
                    ) : (
                      <Database color="white" size={24} />
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontFamily: "PlusJakartaSans-ExtraBold",
                        color: "#FFFFFF",
                        fontSize: 16,
                      }}
                    >
                      {alreadyLoaded ? "Remove Demo Data" : "Load Demo Data"}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "PlusJakartaSans-Medium",
                        color: "rgba(255,255,255,0.7)",
                        fontSize: 12,
                        marginTop: 2,
                      }}
                    >
                      {alreadyLoaded
                        ? `Tap to hide ${MOCK_TRANSACTIONS.length} sample transactions`
                        : `Import ${MOCK_TRANSACTIONS.length} sample transactions to explore the app`}
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View className="mb-8">
            <Text className="text-slate-500 font-jakarta-bold text-xs uppercase tracking-widest mb-2 ml-1">
              Session
            </Text>
            <View
              className={`${sectionBg} rounded-3xl p-2 border ${sectionBorder} shadow-sm`}
            >
              <SettingsItem
                label="Sign Out"
                icon={LogOut}
                isDestructive
                isLast
                onPress={handleSignOut}
              />
            </View>
          </View>

          <View className="mt-10 items-center">
            <Text className="text-slate-500 font-jakarta-medium text-[10px] uppercase tracking-tighter">
              Made with ❤️ for TrackUrFinance
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>

      <CurrencyPickerModal
        visible={showCurrencyModal}
        onClose={() => setShowCurrencyModal(false)}
      />
      <NotificationSettingsModal
        visible={showNotifModal}
        onClose={() => setShowNotifModal(false)}
      />
    </GradientBackground>
  );
};

export default ProfileScreen;
