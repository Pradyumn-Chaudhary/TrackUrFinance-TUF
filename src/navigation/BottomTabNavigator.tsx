import React, { useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home, BarChart2, User } from "lucide-react-native";
import HomeScreen from "../screens/HomeScreen";
import AnalysisScreen from "../screens/AnalysisScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { useTheme } from "../context/ThemeContext";
import { AddButton } from "../components/common/AddButton";
import { AddTransactionModal } from "../components/common/AddTransactionModal";
import { View, PanResponder, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useModalStore } from "../store/useModalStore";
import { useNavigation } from "@react-navigation/native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const Tab = createBottomTabNavigator();
const TAB_ORDER = ["Home", "Analysis", "Profile"];

export const BottomTabNavigator = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { isAddTransactionVisible, openAddTransaction, closeAddTransaction } =
    useModalStore();
  const navigation = useNavigation<any>();
  const translateX = useSharedValue(0);

  const navigateToTab = (direction: "next" | "prev") => {
    const state = navigation.getState();
    if (!state) return;

    // We look for the main-tabs navigator in the state
    const tabState =
      state.routes.find((r) => r.name === "Home" || r.state)?.state || state;
    const currentRoute = tabState.routes[tabState.index || 0]?.name || "Home";
    const currentIndex = TAB_ORDER.indexOf(currentRoute);

    if (direction === "next" && currentIndex < TAB_ORDER.length - 1) {
      navigation.navigate(TAB_ORDER[currentIndex + 1]);
    } else if (direction === "prev" && currentIndex > 0) {
      navigation.navigate(TAB_ORDER[currentIndex - 1]);
    }
  };

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Trigger global tab swipe only if significant horizontal move AND it's a clear horizontal gesture
        // and only if a child hasn't captured it yet
        return (
          Math.abs(gestureState.dx) > 60 &&
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 2
        );
      },
      onPanResponderMove: (_, gestureState) => {
        translateX.value = gestureState.dx;
      },
      onPanResponderRelease: (_, gestureState) => {
        const threshold = Dimensions.get("window").width * 0.2;
        if (Math.abs(gestureState.dx) > threshold) {
          if (gestureState.dx > 0) {
            navigateToTab("prev");
          } else {
            navigateToTab("next");
          }
        }
        translateX.value = withTiming(0, { duration: 200 });
      },
      onPanResponderTerminate: () => {
        translateX.value = withTiming(0, { duration: 200 });
      },
    }),
  ).current;

  const swipeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View
      style={[{ flex: 1 }, swipeStyle]}
      {...panResponder.panHandlers}
    >
      <Tab.Navigator
        id="main-tabs"
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.background,
            borderTopColor: "rgba(255, 255, 255, 0.1)",
            paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
            paddingTop: 10,
            height: 70 + (insets.bottom > 0 ? insets.bottom - 10 : 0),
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarLabelStyle: {
            fontFamily: "PlusJakartaSans-Medium",
            fontSize: 12,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          }}
        />
        <Tab.Screen
          name="Analysis"
          component={AnalysisScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <BarChart2 color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
          }}
        />
      </Tab.Navigator>

      <AddButton onPress={openAddTransaction} />
      <AddTransactionModal
        visible={isAddTransactionVisible}
        onClose={closeAddTransaction}
      />
    </Animated.View>
  );
};
