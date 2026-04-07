import React from "react";
import { View, Text } from "react-native";
import { ArrowUpRight, ArrowDownRight } from "lucide-react-native";
import { Transaction } from "../../constants/mockData";
import { useTheme } from "../../context/ThemeContext";
import { formatDate, formatCurrency } from "../../utils/format";
import { getCategoryIcon } from "../../utils/categories";

interface TransactionCardProps {
  transaction: Transaction;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
}) => {
  const { colors, currency, isDarkMode } = useTheme();
  const isIncome = transaction.type === "income";

  const cardBg = isDarkMode ? "bg-surface/40" : "bg-white/90";
  const cardBorder = isDarkMode ? "border-white/5" : "border-slate-200";
  const titleColor = isDarkMode ? "text-white" : "text-slate-900";

  return (
    <View
      className={`flex-row items-center ${cardBg} p-4 rounded-2xl mb-4 border ${cardBorder} shadow-sm`}
    >
      <View
        className={`h-12 w-12 rounded-xl items-center justify-center ${isIncome ? "bg-accent/10" : "bg-error/10"}`}
      >
        {getCategoryIcon(transaction.category, {
          color: isIncome ? colors.accent : colors.error,
          size: 24,
        })}
      </View>

      <View className="flex-1 ml-4">
        <Text className={`font-jakarta-bold ${titleColor} text-base`}>
          {transaction.title}
        </Text>
        <Text
          className={`font-jakarta-medium ${isDarkMode ? "text-slate-400" : "text-slate-500"} text-xs mt-0.5`}
        >
          {formatDate(transaction.date)}
        </Text>
        {transaction.note ? (
          <Text
            className={`font-jakarta-medium ${isDarkMode ? "text-slate-500" : "text-slate-400"} text-xs mt-0.5`}
            numberOfLines={1}
          >
            {transaction.note}
          </Text>
        ) : null}
      </View>

      <View className="items-end">
        <View className="flex-row items-center">
          {isIncome ? (
            <ArrowUpRight color={colors.accent} size={16} />
          ) : (
            <ArrowDownRight color={colors.error} size={16} />
          )}
          <Text
            className={`font-jakarta-extrabold text-lg ml-1 ${isIncome ? "text-accent" : "text-error"}`}
          >
            {isIncome ? "+" : "-"}
            {formatCurrency(transaction.amount, currency)}
          </Text>
        </View>
      </View>
    </View>
  );
};
