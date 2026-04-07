import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Switch,
  Platform,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Bell, BellOff, Clock, X } from "lucide-react-native";
import { useTheme } from "../../context/ThemeContext";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

interface NotificationSettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export const NotificationSettingsModal: React.FC<
  NotificationSettingsModalProps
> = ({ visible, onClose }) => {
  const { colors, isDarkMode } = useTheme();
  const [enabled, setEnabled] = useState(false);
  const [time, setTime] = useState(() => {
    const d = new Date();
    d.setHours(20, 0, 0, 0); // default 8 PM
    return d;
  });
  const [showTimePicker, setShowTimePicker] = useState(false);

  const cardBg = isDarkMode ? "#0F172A" : "#FFFFFF";
  const itemBg = isDarkMode ? "rgba(30,41,59,0.6)" : "#F8FAFC";
  const borderColor = isDarkMode ? "rgba(255,255,255,0.08)" : "#E2E8F0";
  const textColor = isDarkMode ? "#FFFFFF" : "#0F172A";
  const mutedColor = isDarkMode ? "#64748B" : "#94A3B8";

  const formatTime = (d: Date) => {
    const h = String(d.getHours()).padStart(2, "0");
    const m = String(d.getMinutes()).padStart(2, "0");
    const ampm = d.getHours() >= 12 ? "PM" : "AM";
    const h12 = d.getHours() % 12 || 12;
    return `${String(h12).padStart(2, "0")}:${m} ${ampm}`;
  };

  const requestPermission = async (): Promise<boolean> => {
    if (!Device.isDevice) {
      Alert.alert("Notice", "Push notifications only work on a real device.");
      return false;
    }
    const { status: existing } = await Notifications.getPermissionsAsync();
    if (existing === "granted") return true;
    const { status } = await Notifications.requestPermissionsAsync();
    return status === "granted";
  };

  const scheduleDailyReminder = async (reminderTime: Date) => {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "💸 Log Your Expenses",
        body: "Don't forget to track today's transactions in TrackUrFinance!",
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: reminderTime.getHours(),
        minute: reminderTime.getMinutes(),
      },
    });
  };

  const cancelReminder = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
  };

  const handleToggle = async (value: boolean) => {
    if (value) {
      const granted = await requestPermission();
      if (!granted) {
        Alert.alert(
          "Permission Required",
          "Please enable notifications in your device settings to use this feature.",
        );
        return;
      }
      await scheduleDailyReminder(time);
      setEnabled(true);
      Alert.alert(
        "✅ Reminder Set",
        `You'll get a daily reminder at ${formatTime(time)} to log your expenses.`,
      );
    } else {
      await cancelReminder();
      setEnabled(false);
    }
  };

  const handleTimeChange = async (_: any, selected?: Date) => {
    setShowTimePicker(Platform.OS === "ios");
    if (selected) {
      setTime(selected);
      if (enabled) {
        await scheduleDailyReminder(selected);
      }
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)" }}
        activeOpacity={1}
        onPress={onClose}
      />

      <View
        style={{
          backgroundColor: cardBg,
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
          paddingBottom: Platform.OS === "ios" ? 40 : 32,
          paddingHorizontal: 24,
        }}
      >
        {/* Handle */}
        <View
          style={{
            width: 48,
            height: 5,
            borderRadius: 3,
            backgroundColor: isDarkMode ? "rgba(255,255,255,0.15)" : "#CBD5E1",
            alignSelf: "center",
            marginVertical: 14,
          }}
        />

        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 28,
          }}
        >
          <View>
            <Text
              style={{
                fontFamily: "PlusJakartaSans-ExtraBold",
                fontSize: 22,
                color: textColor,
              }}
            >
              Daily Reminder
            </Text>
            <Text
              style={{
                fontFamily: "PlusJakartaSans-Medium",
                fontSize: 13,
                color: mutedColor,
                marginTop: 3,
              }}
            >
              Log your expenses every day
            </Text>
          </View>
          <TouchableOpacity
            onPress={onClose}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: isDarkMode
                ? "rgba(255,255,255,0.08)"
                : "#F1F5F9",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X color={mutedColor} size={18} />
          </TouchableOpacity>
        </View>

        {/* Enable Toggle Row */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: itemBg,
            borderRadius: 20,
            borderWidth: 1.5,
            borderColor: enabled ? colors.primary : borderColor,
            padding: 18,
            marginBottom: 14,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                backgroundColor: enabled
                  ? `${colors.primary}25`
                  : isDarkMode
                    ? "rgba(255,255,255,0.06)"
                    : "#F1F5F9",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 14,
              }}
            >
              {enabled ? (
                <Bell color={colors.primary} size={22} />
              ) : (
                <BellOff color={mutedColor} size={22} />
              )}
            </View>
            <View>
              <Text
                style={{
                  fontFamily: "PlusJakartaSans-Bold",
                  fontSize: 15,
                  color: textColor,
                }}
              >
                {enabled ? "Reminder Active" : "Enable Reminder"}
              </Text>
              <Text
                style={{
                  fontFamily: "PlusJakartaSans-Medium",
                  fontSize: 12,
                  color: mutedColor,
                  marginTop: 2,
                }}
              >
                {enabled ? `Daily at ${formatTime(time)}` : "Tap to enable"}
              </Text>
            </View>
          </View>
          <Switch
            value={enabled}
            onValueChange={handleToggle}
            trackColor={{
              false: isDarkMode ? "#334155" : "#E2E8F0",
              true: colors.primary,
            }}
            thumbColor={"#FFFFFF"}
          />
        </View>

        {/* Time Picker Row */}
        <TouchableOpacity
          onPress={() => enabled && setShowTimePicker(true)}
          activeOpacity={enabled ? 0.75 : 1}
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: itemBg,
            borderRadius: 20,
            borderWidth: 1.5,
            borderColor: borderColor,
            padding: 18,
            marginBottom: 8,
            opacity: enabled ? 1 : 0.45,
          }}
        >
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              backgroundColor: isDarkMode
                ? "rgba(255,255,255,0.06)"
                : "#F1F5F9",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 14,
            }}
          >
            <Clock color={enabled ? colors.secondary : mutedColor} size={22} />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: "PlusJakartaSans-Bold",
                fontSize: 15,
                color: textColor,
              }}
            >
              Reminder Time
            </Text>
            <Text
              style={{
                fontFamily: "PlusJakartaSans-Medium",
                fontSize: 12,
                color: mutedColor,
                marginTop: 2,
              }}
            >
              {enabled ? "Tap to change time" : "Enable reminder first"}
            </Text>
          </View>
          <Text
            style={{
              fontFamily: "PlusJakartaSans-ExtraBold",
              fontSize: 18,
              color: enabled ? colors.primary : mutedColor,
            }}
          >
            {formatTime(time)}
          </Text>
        </TouchableOpacity>

        {/* Info text */}
        <Text
          style={{
            fontFamily: "PlusJakartaSans-Medium",
            fontSize: 12,
            color: mutedColor,
            textAlign: "center",
            marginTop: 12,
            lineHeight: 18,
          }}
        >
          You'll receive a push notification every day at the selected time to
          remind you to log your expenses.
        </Text>

        {/* Native Time Picker */}
        {showTimePicker && (
          <DateTimePicker
            value={time}
            mode="time"
            is24Hour={false}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleTimeChange}
          />
        )}
      </View>
    </Modal>
  );
};
