import React, { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PieChart, BarChart } from "react-native-gifted-charts";
import { ChevronLeft, ChevronRight, BarChart3 } from "lucide-react-native";
import { GradientBackground } from "../components/common/GradientBackground";
import { useTheme } from "../context/ThemeContext";
import { useTransactionStore } from "../store/useTransactionStore";
import { useModalStore } from "../store/useModalStore";
import { TransactionCard } from "../components/home/TransactionCard";
import { formatCurrency } from "../utils/format";
import { CATEGORIES } from "../constants/categories";
import { EmptyState } from "../components/common/EmptyState";
import { SweepPieChart } from "../components/analysis/SweepPieChart";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const CHART_COLORS = [
  "#4F46E5",
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EC4899",
  "#8B5CF6",
  "#06B6D4",
  "#F43F5E",
  "#473d3dff",
];

const AnalysisScreen = () => {
  const { colors, isDarkMode, currency } = useTheme();
  const { transactions } = useTransactionStore();
  const { openAddTransaction } = useModalStore();
  const [activeTab, setActiveTab] = useState<"Category" | "Monthly">(
    "Category",
  );
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedCategory, setSelectedCategory] = useState("All");

  const navigation = useNavigation();
  const [isFocused, setIsFocused] = useState(true);
  const [isReady, setIsReady] = useState(false);

  React.useEffect(() => {
    const unsubFocus = navigation.addListener("focus", () =>
      setIsFocused(true),
    );
    const unsubBlur = navigation.addListener("blur", () => setIsFocused(false));
    return () => {
      unsubFocus();
      unsubBlur();
    };
  }, [navigation]);

  // Delay for library to prepare the charts
  React.useEffect(() => {
    setIsReady(false);
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, [activeTab, selectedMonth, selectedCategory]);
  // FREEZE THEME PROPS WHEN UNFOCUSED
  // Gifted-charts throws fatal context errors if re-rendering BarChart with new colors while in the background.
  const themeRef = React.useRef({ isDarkMode, colors });
  if (isFocused) {
    themeRef.current = { isDarkMode, colors };
  }
  const safeIsDarkMode = isFocused ? isDarkMode : themeRef.current.isDarkMode;
  const safeColors = isFocused ? colors : themeRef.current.colors;

  // Transactions filtered by month (for Category view) or all (for Monthly view)
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => {
        const monthMatch =
          activeTab === "Category" ? t.date.getMonth() === selectedMonth : true;
        const catMatch =
          selectedCategory === "All" || t.category === selectedCategory;
        return monthMatch && catMatch;
      })
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [transactions, activeTab, selectedMonth, selectedCategory]);

  // Summary
  const summary = useMemo(() => {
    const income = filteredTransactions
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + t.amount, 0);
    const expense = filteredTransactions
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);
    return { income, expense, balance: income - expense };
  }, [filteredTransactions]);

  // Pie chart data (expenses by category for selected month)
  const pieData = useMemo(() => {
    const monthTx = transactions.filter(
      (t) => t.type === "expense" && t.date.getMonth() === selectedMonth,
    );
    const totals: Record<string, number> = {};
    monthTx.forEach((t) => {
      totals[t.category] = (totals[t.category] || 0) + t.amount;
    });
    const total = Object.values(totals).reduce((a, b) => a + b, 0);
    return Object.entries(totals).map(([label, value], i) => ({
      value,
      color: CHART_COLORS[i % CHART_COLORS.length],
      text: total > 0 ? `${Math.round((value / total) * 100)}%` : "0%",
      label,
    }));
  }, [transactions, selectedMonth]);

  // Bar chart (monthly expenses for current year)
  const barData = useMemo(() => {
    return MONTHS.map((month, index) => {
      const val = transactions
        .filter((t) => t.type === "expense" && t.date.getMonth() === index)
        .reduce((s, t) => s + t.amount, 0);
      return {
        value: val,
        label: month,
        frontColor:
          index === selectedMonth
            ? safeColors.primary
            : safeIsDarkMode
              ? "#475569"
              : "#94A3B8",
      };
    });
  }, [transactions, selectedMonth, safeColors, safeIsDarkMode]);

  // Categories dynamic from central constants
  const categories = useMemo(() => ["All", ...CATEGORIES], []);

  const titleColor = isDarkMode ? "text-white" : "text-slate-900";
  const cardBgStyle = isDarkMode
    ? "rgba(30, 41, 59, 0.5)"
    : "rgba(255, 255, 255, 0.9)";
  const cardBorderStyle = isDarkMode ? "rgba(255, 255, 255, 0.1)" : "#E2E8F0";

  return (
    <GradientBackground className="flex-1">
      <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
          nestedScrollEnabled={false}
        >
          {/* Header */}
          <View className="px-6 pt-6 pb-2">
            <Text className="font-jakarta-bold text-slate-400 text-sm uppercase tracking-wider">
              Insights
            </Text>
            <Text className={`font-jakarta-extrabold ${titleColor} text-3xl`}>
              Analysis
            </Text>
          </View>

          <View className="px-6">
            {/* Tab Switcher */}
            <View
              className={`${isDarkMode ? "bg-surface/40" : "bg-slate-100"} p-1 rounded-2xl flex-row my-6`}
            >
              {(["Category", "Monthly"] as const).map((tab) => (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  className={`flex-1 py-3 rounded-xl items-center ${
                    activeTab === tab
                      ? isDarkMode
                        ? "bg-primary"
                        : "bg-white shadow-sm"
                      : ""
                  }`}
                >
                  <Text
                    className={`font-jakarta-bold ${
                      activeTab === tab
                        ? isDarkMode
                          ? "text-white"
                          : "text-primary"
                        : "text-slate-500"
                    }`}
                  >
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Month Selector */}
            <View className="flex-row justify-between items-center mb-6">
              <TouchableOpacity
                onPress={() => setSelectedMonth((p) => (p > 0 ? p - 1 : 11))}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <ChevronLeft color={colors.primary} size={28} />
              </TouchableOpacity>
              <Text className={`font-jakarta-extrabold ${titleColor} text-xl`}>
                {MONTHS[selectedMonth]} 2026
              </Text>
              <TouchableOpacity
                onPress={() => setSelectedMonth((p) => (p < 11 ? p + 1 : 0))}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <ChevronRight color={colors.primary} size={28} />
              </TouchableOpacity>
            </View>

            {/* Chart Card (No swipe, just buttons) */}
            <View
              style={{
                backgroundColor: cardBgStyle,
                borderColor: cardBorderStyle,
                borderWidth: 1,
                borderRadius: 40,
                padding: 24,
                alignItems: "center",
                marginBottom: 24,
                elevation: 8,
                shadowColor: "#000",
                shadowOpacity: 0.1,
                shadowRadius: 15,
                shadowOffset: { width: 0, height: 6 },
                minHeight: 320,
                justifyContent: "center",
              }}
            >
              {!isReady ? null : activeTab === "Category" ? (
                pieData.length > 0 ? (
                  <View className="items-center py-2 w-full">
                    <SweepPieChart
                      data={pieData}
                      radius={100}
                      innerRadius={70}
                      isReady={isReady}
                      isDarkMode={safeIsDarkMode}
                    />
                    <View className="flex-row flex-wrap justify-center mt-5">
                      {pieData.map((item, i) => (
                        <View key={i} className="flex-row items-center m-1.5">
                          <View
                            style={{
                              width: 10,
                              height: 10,
                              borderRadius: 5,
                              backgroundColor: item.color,
                            }}
                          />
                          <Text
                            className={`ml-1.5 font-jakarta-medium ${
                              isDarkMode ? "text-slate-300" : "text-slate-600"
                            } text-xs`}
                          >
                            {item.label} ({item.text})
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                ) : (
                  <EmptyState
                    icon={BarChart3}
                    title="No Data for Category"
                    description={`No expenses tracked for ${MONTHS[selectedMonth]} yet.`}
                    onAction={openAddTransaction}
                    actionLabel="Add Transaction"
                  />
                )
              ) : barData.some((d) => d.value > 0) ? (
                <View className="w-full py-2">
                  <BarChart
                    data={barData}
                    barWidth={20}
                    spacing={10}
                    roundedTop
                    roundedBottom
                    hideRules
                    hideYAxisText
                    yAxisThickness={0}
                    xAxisThickness={safeIsDarkMode ? 0 : 1}
                    xAxisColor={isDarkMode ? "transparent" : "#E2E8F0"}
                    xAxisLabelTextStyle={{
                      color: safeColors.textMuted,
                      fontSize: 9,
                      fontFamily: "PlusJakartaSans-Medium",
                    }}
                    noOfSections={3}
                    isAnimated
                    animationDuration={1000}
                    showGradient
                    gradientColor={
                      safeColors.primary + (safeIsDarkMode ? "33" : "66")
                    }
                  />
                </View>
              ) : (
                <EmptyState
                  icon={BarChart3}
                  title="No Monthly Data"
                  description="Start tracking your expenses to see your monthly spending trends!"
                  onAction={openAddTransaction}
                  actionLabel="Add Expense"
                />
              )}
            </View>

            {/* Summary Row */}
            <View className="bg-primary/10 rounded-3xl p-5 border border-primary/20 flex-row justify-between mb-6">
              <View>
                <Text className="text-slate-500 font-jakarta-bold text-[10px] uppercase tracking-wider mb-1">
                  Income
                </Text>
                <Text className="text-accent font-jakarta-extrabold text-xl">
                  {formatCurrency(summary.income, currency).split(".")[0]}
                </Text>
              </View>
              <View className="items-center">
                <Text className="text-slate-500 font-jakarta-bold text-[10px] uppercase tracking-wider mb-1">
                  Expenses
                </Text>
                <Text className="text-error font-jakarta-extrabold text-xl">
                  {formatCurrency(summary.expense, currency).split(".")[0]}
                </Text>
              </View>
              <View className="items-end">
                <Text className="text-slate-500 font-jakarta-bold text-[10px] uppercase tracking-wider mb-1">
                  Balance
                </Text>
                <Text
                  className={`${
                    summary.balance >= 0 ? "text-accent" : "text-error"
                  } font-jakarta-extrabold text-xl`}
                >
                  {
                    formatCurrency(Math.abs(summary.balance), currency).split(
                      ".",
                    )[0]
                  }
                </Text>
              </View>
            </View>

            {/* Transactions Section */}
            <View className="flex-row justify-between items-center mb-4">
              <Text className={`font-jakarta-bold ${titleColor} text-lg`}>
                Transactions
              </Text>
              <Text className="font-jakarta-medium text-slate-500 text-xs">
                {filteredTransactions.length} records
              </Text>
            </View>

            {/* Category Filter Chips */}
            <View className="flex-row flex-wrap mb-5">
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setSelectedCategory(cat)}
                  style={{ marginRight: 8, marginBottom: 8 }}
                  className={`px-4 py-2 rounded-full border ${
                    selectedCategory === cat
                      ? "bg-primary border-primary"
                      : isDarkMode
                        ? "bg-surface/40 border-white/5"
                        : "bg-white border-slate-200"
                  }`}
                >
                  <Text
                    className={`font-jakarta-bold text-xs ${
                      selectedCategory === cat ? "text-white" : "text-slate-500"
                    }`}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Transaction List */}
            {filteredTransactions.length === 0 ? (
              <View className="items-center py-16">
                <Text className="text-slate-500 font-jakarta-medium text-center">
                  No transactions found for this filter.
                </Text>
              </View>
            ) : (
              filteredTransactions.map((item) => (
                <TransactionCard key={item.id} transaction={item} />
              ))
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default AnalysisScreen;
