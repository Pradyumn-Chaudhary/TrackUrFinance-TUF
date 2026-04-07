import React from "react";
import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GradientBackground } from "../components/common/GradientBackground";
import { TransactionCard } from "../components/home/TransactionCard";
import { formatCurrency } from "../utils/format";
import { useTheme } from "../context/ThemeContext";
import { useTransactionStore } from "../store/useTransactionStore";
import { useAuthStore } from "../store/useAuthStore";
import { useModalStore } from "../store/useModalStore";
import { EmptyState } from "../components/common/EmptyState";
import { Wallet } from "lucide-react-native";

const HomeScreen = () => {
  const { currency, isDarkMode } = useTheme();
  const { transactions } = useTransactionStore();
  const { user } = useAuthStore();
  const { openAddTransaction } = useModalStore();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const greeting = getGreeting();

  const sortedTransactions = [...transactions].sort(
    (a, b) => b.date.getTime() - a.date.getTime(),
  );

  const totalBalance = transactions.reduce(
    (sum, t) => (t.type === "income" ? sum + t.amount : sum - t.amount),
    0,
  );
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const titleColor = isDarkMode ? "text-white" : "text-slate-900";
  const cardBg = isDarkMode ? "bg-surface/50" : "bg-white/90";
  const cardBorder = isDarkMode ? "border-white/10" : "border-slate-200";

  return (
    <GradientBackground className="flex-1">
      <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
        <FlatList
          data={sortedTransactions}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <View className="px-6 mb-8">
              <View className="py-6">
                <Text className="font-jakarta-bold text-slate-400 text-sm uppercase tracking-wider">
                  {greeting}
                </Text>
                <Text
                  className={`font-jakarta-extrabold ${titleColor} text-3xl`}
                >
                  {user?.name || "Guest"}
                </Text>
              </View>

              <View
                className={`${cardBg} rounded-3xl p-6 border ${cardBorder} shadow-2xl`}
              >
                <Text className="font-jakarta-medium text-slate-400">
                  Total Balance
                </Text>
                <Text
                  className={`font-jakarta-extrabold ${titleColor} text-4xl my-2`}
                >
                  {formatCurrency(totalBalance, currency)}
                </Text>
                <View className="flex-row justify-between mt-4">
                  <View>
                    <Text className="font-jakarta-medium text-slate-400 text-xs text-center">
                      Income
                    </Text>
                    <Text className="font-jakarta-bold text-accent text-lg">
                      +{formatCurrency(totalIncome, currency).split(".")[0]}
                    </Text>
                  </View>
                  <View>
                    <Text className="font-jakarta-medium text-slate-400 text-xs text-center">
                      Expenses
                    </Text>
                    <Text className="font-jakarta-bold text-error text-lg">
                      -{formatCurrency(totalExpense, currency).split(".")[0]}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="flex-row justify-between items-center mt-10 mb-4">
                <Text className={`font-jakarta-bold ${titleColor} text-xl`}>
                  Recent Transactions
                </Text>
                <Text className="font-jakarta-semibold text-primary text-sm">
                  See All
                </Text>
              </View>
            </View>
          }
          renderItem={({ item }) => (
            <View className="px-6">
              <TransactionCard transaction={item} />
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
          ItemSeparatorComponent={() => <View className="h-0" />}
          ListEmptyComponent={
            <EmptyState
              icon={Wallet}
              title="No Transactions Yet"
              description="Start your financial journey by adding your first income or expense!"
              onAction={openAddTransaction}
              actionLabel="Add Transaction"
            />
          }
        />
      </SafeAreaView>
    </GradientBackground>
  );
};

export default HomeScreen;
