import React, { useMemo, useEffect } from "react";
import { View, Text } from "react-native";
import Svg, { Circle, G } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
  SharedValue,
} from "react-native-reanimated";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface PieData {
  value: number;
  color: string;
  label: string;
  text?: string;
}

interface SweepPieChartProps {
  data: PieData[];
  radius?: number;
  innerRadius?: number;
  isReady: boolean;
  isDarkMode: boolean;
}

const PieSegment = ({
  segment,
  progress,
  circumference,
  adjustedRadius,
  strokeWidth,
}: {
  segment: any;
  progress: SharedValue<number>;
  circumference: number;
  adjustedRadius: number;
  strokeWidth: number;
}) => {
  const animatedProps = useAnimatedProps(() => {
    const totalDrawn = progress.value * circumference;
    const visibleLength = Math.max(
      0,
      Math.min(segment.length, totalDrawn - segment.offset),
    );

    return {
      strokeDashoffset: circumference - visibleLength,
    };
  });

  return (
    <AnimatedCircle
      cx="0"
      cy="0"
      r={adjustedRadius}
      fill="none"
      stroke={segment.color}
      strokeWidth={strokeWidth}
      strokeDasharray={`${circumference} ${circumference}`}
      animatedProps={animatedProps}
      transform={`rotate(${(segment.offset / circumference) * 360})`}
      strokeLinecap="butt"
    />
  );
};

export const SweepPieChart = ({
  data,
  radius = 100,
  innerRadius = 70,
  isReady,
  isDarkMode,
}: SweepPieChartProps) => {
  const progress = useSharedValue(0);
  const strokeWidth = radius - innerRadius;
  const adjustedRadius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * adjustedRadius;

  useEffect(() => {
    if (isReady) {
      progress.value = 0;
      progress.value = withTiming(1, {
        duration: 1500,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      });
    } else {
      progress.value = 0;
    }
  }, [isReady, data]);

  const total = useMemo(
    () => data.reduce((sum, item) => sum + item.value, 0),
    [data],
  );

  const segments = useMemo(() => {
    let currentOffset = 0;
    return data.map((item) => {
      const percentage = total > 0 ? item.value / total : 0;
      const length = percentage * circumference;
      const offset = currentOffset;
      currentOffset += length;
      return { ...item, length, offset };
    });
  }, [data, total, circumference]);

  return (
    <View
      style={{
        width: radius * 2,
        height: radius * 2,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View style={{ transform: [{ rotate: "-90deg" }] }}>
        <Svg
          width={radius * 2}
          height={radius * 2}
          viewBox={`0 0 ${radius * 2} ${radius * 2}`}
        >
          <G x={radius} y={radius}>
            {segments.map((segment, index) => (
              <PieSegment
                key={`${index}-${segment.label}`}
                segment={segment}
                progress={progress}
                circumference={circumference}
                adjustedRadius={adjustedRadius}
                strokeWidth={strokeWidth}
              />
            ))}
          </G>
        </Svg>
      </View>

      {/* Center Label */}
      <View style={{ position: "absolute" }} className="items-center">
        <Text
          className={`font-jakarta-bold ${isDarkMode ? "text-white" : "text-slate-900"} text-2xl`}
        >
          {data.length}
        </Text>
        <Text className="text-slate-500 font-jakarta-medium text-[10px]">
          categories
        </Text>
      </View>
    </View>
  );
};
