import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../context/ThemeContext";
import { formatCurrency } from "../../utils/format";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react-native";

interface BalanceCardProps {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  className?: string;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  totalBalance,
  totalIncome,
  totalExpense,
  className,
}) => {
  const { colors, currency, isDarkMode } = useTheme();

  return (
    <LinearGradient
      colors={[colors.primary, colors.secondary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
      className={className}
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Wallet color="white" size={20} />
        </View>
        <Text style={styles.label}>Total Balance</Text>
      </View>

      <Text style={styles.balanceText}>
        {formatCurrency(totalBalance, currency)}
      </Text>

      <View style={styles.footer}>
        <View style={styles.statsContainer}>
          <View style={styles.statsIconContainer}>
            <TrendingUp color="#10B981" size={12} />
          </View>
          <View>
            <Text style={styles.statsLabel}>Income</Text>
            <Text style={styles.statsValue}>
              {formatCurrency(totalIncome, currency).split(".")[0]}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.statsContainer}>
          <View
            style={[
              styles.statsIconContainer,
              { backgroundColor: "rgba(244, 63, 94, 0.2)" },
            ]}
          >
            <TrendingDown color="#F43F5E" size={12} />
          </View>
          <View>
            <Text style={styles.statsLabel}>Expenses</Text>
            <Text style={styles.statsValue}>
              {formatCurrency(totalExpense, currency).split(".")[0]}
            </Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 32,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  label: {
    fontFamily: "PlusJakartaSans-Medium",
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    letterSpacing: 0.5,
  },
  balanceText: {
    fontFamily: "PlusJakartaSans-ExtraBold",
    color: "#FFFFFF",
    fontSize: 36,
    marginBottom: 24,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.15)",
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  statsContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  statsIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: "rgba(16, 185, 129, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  statsLabel: {
    fontFamily: "PlusJakartaSans-Medium",
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 10,
    textTransform: "uppercase",
  },
  statsValue: {
    fontFamily: "PlusJakartaSans-Bold",
    color: "#FFFFFF",
    fontSize: 14,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginHorizontal: 16,
  },
});
