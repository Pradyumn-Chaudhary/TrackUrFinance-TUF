import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import { X, Tag, FileText, Clock } from "lucide-react-native";
import { useTheme } from "../../context/ThemeContext";
import { useTransactionStore } from "../../store/useTransactionStore";
import { CATEGORIES } from "../../constants/categories";

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  INR: "₹",
  GBP: "£",
};

interface AddTransactionModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  visible,
  onClose,
}) => {
  const { colors, isDarkMode, currency } = useTheme();
  const { addTransaction } = useTransactionStore();

  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Food");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<"date" | "time">("date");

  const currencySymbol = CURRENCY_SYMBOLS[currency] || "$";

  const formatPickerDate = (d: Date) => {
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatPickerTime = (d: Date) => {
    const h = String(d.getHours()).padStart(2, "0");
    const m = String(d.getMinutes()).padStart(2, "0");
    return `${h}:${m}`;
  };

  const isFormValid = () => {
    const parsed = parseFloat(amount);
    return title.trim().length > 0 && !isNaN(parsed) && parsed > 0;
  };
  const isSubmitDisabled = !isFormValid();

  const handleAdd = () => {
    const parsed = parseFloat(amount);
    if (!title.trim()) {
      Alert.alert("Required", "Please enter a title.");
      return;
    }
    if (isNaN(parsed) || parsed <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid amount.");
      return;
    }

    addTransaction({
      title: title.trim(),
      amount: parsed,
      type,
      category: selectedCategory,
      date: selectedDate,
      note: note.trim() || undefined,
    });

    // Reset
    setTitle("");
    setAmount("");
    setNote("");
    setType("expense");
    setSelectedCategory("Food");
    setSelectedDate(new Date());
    onClose();
  };

  const inputBg = isDarkMode ? "#1E293B" : "#F8FAFC";
  const inputBorder = isDarkMode ? "rgba(255,255,255,0.1)" : "#E2E8F0";
  const cardBg = isDarkMode ? "#0F172A" : "#FFFFFF";
  const labelColor = isDarkMode ? "text-slate-400" : "text-slate-500";
  const textColor = isDarkMode ? "text-white" : "text-slate-900";

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.65)" }}
          activeOpacity={1}
          onPress={onClose}
        />

        <View
          style={{
            backgroundColor: cardBg,
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
          }}
        >
          {/* Handle */}
          <View
            style={{
              width: 48,
              height: 5,
              borderRadius: 3,
              backgroundColor: isDarkMode
                ? "rgba(255,255,255,0.18)"
                : "#CBD5E1",
              alignSelf: "center",
              marginTop: 12,
              marginBottom: 6,
            }}
          />

          <ScrollView
            contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <Text className={`font-jakarta-extrabold ${textColor} text-2xl`}>
                Add Transaction
              </Text>
              <TouchableOpacity
                onPress={onClose}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 19,
                  backgroundColor: isDarkMode
                    ? "rgba(255,255,255,0.08)"
                    : "#F1F5F9",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X color={colors.textMuted} size={18} />
              </TouchableOpacity>
            </View>

            {/* Type Toggle */}
            <View
              style={{
                flexDirection: "row",
                backgroundColor: isDarkMode ? "rgba(30,41,59,0.8)" : "#F1F5F9",
                borderRadius: 18,
                padding: 4,
                marginBottom: 20,
              }}
            >
              {(["expense", "income"] as const).map((t) => (
                <TouchableOpacity
                  key={t}
                  onPress={() => setType(t)}
                  style={{
                    flex: 1,
                    paddingVertical: 12,
                    borderRadius: 14,
                    alignItems: "center",
                    backgroundColor:
                      type === t
                        ? t === "income"
                          ? "rgba(16,185,129,0.75)"
                          : "rgba(244,63,94,0.75)"
                        : "transparent",
                  }}
                >
                  <Text
                    className={`font-jakarta-bold capitalize ${type === t ? "text-white" : "text-slate-500"}`}
                  >
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Amount */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderRadius: 18,
                backgroundColor: inputBg,
                borderWidth: 1,
                borderColor: inputBorder,
                paddingHorizontal: 20,
                paddingVertical: 16,
                marginBottom: 12,
              }}
            >
              <Text
                className={`font-jakarta-extrabold text-3xl mr-2 ${type === "income" ? "text-accent" : "text-error"}`}
              >
                {currencySymbol}
              </Text>
              <TextInput
                style={{
                  flex: 1,
                  fontSize: 30,
                  fontFamily: "PlusJakartaSans-ExtraBold",
                  color: isDarkMode ? "#FFFFFF" : "#0F172A",
                }}
                placeholder="0.00"
                placeholderTextColor={colors.textMuted}
                keyboardType="decimal-pad"
                value={amount}
                onChangeText={setAmount}
              />
            </View>

            {/* Title */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderRadius: 18,
                backgroundColor: inputBg,
                borderWidth: 1,
                borderColor: inputBorder,
                paddingHorizontal: 20,
                paddingVertical: 14,
                marginBottom: 12,
              }}
            >
              <Tag color={colors.textMuted} size={18} />
              <TextInput
                style={{
                  flex: 1,
                  marginLeft: 12,
                  fontSize: 15,
                  fontFamily: "PlusJakartaSans-Medium",
                  color: isDarkMode ? "#FFFFFF" : "#0F172A",
                }}
                placeholder="Title (e.g. Grocery Shopping)"
                placeholderTextColor={colors.textMuted}
                value={title}
                onChangeText={setTitle}
              />
            </View>

            {/* Note (optional) */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                borderRadius: 18,
                backgroundColor: inputBg,
                borderWidth: 1,
                borderColor: inputBorder,
                paddingHorizontal: 20,
                paddingVertical: 14,
                marginBottom: 20,
              }}
            >
              <FileText
                color={colors.textMuted}
                size={18}
                style={{ marginTop: 2 }}
              />
              <TextInput
                style={{
                  flex: 1,
                  marginLeft: 12,
                  fontSize: 14,
                  fontFamily: "PlusJakartaSans-Medium",
                  color: isDarkMode ? "#FFFFFF" : "#0F172A",
                  maxHeight: 72,
                }}
                placeholder="Note (optional)"
                placeholderTextColor={colors.textMuted}
                multiline
                value={note}
                onChangeText={setNote}
              />
            </View>

            {/* Date & Time Row */}
            <Text
              className={`font-jakarta-bold ${labelColor} text-xs uppercase tracking-widest mb-3`}
            >
              Date & Time
            </Text>
            <View style={{ flexDirection: "row", gap: 10, marginBottom: 20 }}>
              <TouchableOpacity
                onPress={() => {
                  setPickerMode("date");
                  setShowDatePicker(true);
                }}
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: inputBg,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: inputBorder,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                }}
              >
                <Clock color={colors.primary} size={16} />
                <Text className={`font-jakarta-bold ${textColor} text-sm ml-2`}>
                  {formatPickerDate(selectedDate)}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setPickerMode("time");
                  setShowTimePicker(true);
                }}
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: inputBg,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: inputBorder,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                }}
              >
                <Clock color={colors.secondary} size={16} />
                <Text className={`font-jakarta-bold ${textColor} text-sm ml-2`}>
                  {formatPickerTime(selectedDate)}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Native Date Picker */}
            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(e, date) => {
                  setShowDatePicker(false);
                  if (date) {
                    const merged = new Date(selectedDate);
                    merged.setFullYear(
                      date.getFullYear(),
                      date.getMonth(),
                      date.getDate(),
                    );
                    setSelectedDate(merged);
                  }
                }}
                maximumDate={new Date(2030, 11, 31)}
              />
            )}
            {showTimePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="time"
                is24Hour
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(e, date) => {
                  setShowTimePicker(false);
                  if (date) {
                    const merged = new Date(selectedDate);
                    merged.setHours(date.getHours(), date.getMinutes());
                    setSelectedDate(merged);
                  }
                }}
              />
            )}

            {/* Category */}
            <Text
              className={`font-jakarta-bold ${labelColor} text-xs uppercase tracking-widest mb-3`}
            >
              Category
            </Text>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                marginBottom: 24,
              }}
            >
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setSelectedCategory(cat)}
                  style={{
                    marginRight: 8,
                    marginBottom: 8,
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 50,
                    backgroundColor:
                      selectedCategory === cat
                        ? colors.primary
                        : isDarkMode
                          ? "rgba(30,41,59,0.6)"
                          : "#F1F5F9",
                    borderWidth: 1,
                    borderColor:
                      selectedCategory === cat ? colors.primary : inputBorder,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "PlusJakartaSans-Bold",
                      fontSize: 13,
                      color:
                        selectedCategory === cat ? "#FFFFFF" : colors.textMuted,
                    }}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Submit */}
            <TouchableOpacity
              onPress={handleAdd}
              activeOpacity={0.85}
              disabled={isSubmitDisabled}
            >
              <View style={{ opacity: isSubmitDisabled ? 0.4 : 1 }}>
                <LinearGradient
                  colors={
                    type === "income"
                      ? ["#10B981", "#34D399"]
                      : [colors.primary, colors.secondary]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    paddingVertical: 18,
                    borderRadius: 20,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "PlusJakartaSans-ExtraBold",
                      color: "#FFF",
                      fontSize: 17,
                    }}
                  >
                    Add {type === "income" ? "Income" : "Expense"}
                  </Text>
                </LinearGradient>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
