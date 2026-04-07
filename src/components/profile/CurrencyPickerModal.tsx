import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { Check, X } from "lucide-react-native";
import { useTheme, CurrencyCode } from "../../context/ThemeContext";

const CURRENCIES: {
  code: CurrencyCode;
  name: string;
  symbol: string;
  flag: string;
}[] = [
  { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
  { code: "INR", name: "Indian Rupee", symbol: "₹", flag: "🇮🇳" },
  { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧" },
];

interface CurrencyPickerModalProps {
  visible: boolean;
  onClose: () => void;
}

export const CurrencyPickerModal: React.FC<CurrencyPickerModalProps> = ({
  visible,
  onClose,
}) => {
  const { colors, isDarkMode, currency, setCurrency } = useTheme();

  const cardBg = isDarkMode ? "#0F172A" : "#FFFFFF";
  const itemBg = isDarkMode ? "rgba(30,41,59,0.6)" : "#F8FAFC";
  const borderColor = isDarkMode ? "rgba(255,255,255,0.08)" : "#E2E8F0";
  const textColor = isDarkMode ? "#FFFFFF" : "#0F172A";
  const mutedColor = isDarkMode ? "#64748B" : "#94A3B8";

  const handleSelect = (code: CurrencyCode) => {
    setCurrency(code);
    setTimeout(onClose, 150);
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
            paddingHorizontal: 24,
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              fontFamily: "PlusJakartaSans-ExtraBold",
              fontSize: 22,
              color: textColor,
            }}
          >
            Select Currency
          </Text>
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

        {/* Currency List */}
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 24 }}
          showsVerticalScrollIndicator={false}
        >
          {CURRENCIES.map((c, idx) => {
            const isSelected = currency === c.code;
            return (
              <TouchableOpacity
                key={c.code}
                onPress={() => handleSelect(c.code)}
                activeOpacity={0.75}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: isSelected ? `${colors.primary}20` : itemBg,
                  borderRadius: 20,
                  borderWidth: 1.5,
                  borderColor: isSelected ? colors.primary : borderColor,
                  padding: 18,
                  marginBottom: idx < CURRENCIES.length - 1 ? 10 : 0,
                }}
              >
                {/* Flag */}
                <Text style={{ fontSize: 32, marginRight: 16 }}>{c.flag}</Text>

                {/* Text */}
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontFamily: "PlusJakartaSans-Bold",
                      fontSize: 16,
                      color: textColor,
                    }}
                  >
                    {c.symbol} — {c.code}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "PlusJakartaSans-Medium",
                      fontSize: 12,
                      color: mutedColor,
                      marginTop: 2,
                    }}
                  >
                    {c.name}
                  </Text>
                </View>

                {/* Check */}
                {isSelected && (
                  <View
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                      backgroundColor: colors.primary,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Check color="#FFF" size={16} strokeWidth={3} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </Modal>
  );
};
