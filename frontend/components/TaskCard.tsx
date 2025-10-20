import React, { useState } from "react";
import { View, Text, Switch, Pressable, StyleSheet } from "react-native";
import { WeatherIcon } from "./WeatherIcon";
import AlertModal from "./AlertModal";
import { LinearGradient } from 'expo-linear-gradient';
import { apiFetch } from "@/services/api";

export type TaskCardProps = {
  id: number;
  day: number;
  weather: string;
  kcal: number;
  routine: number;
  title: string;
  temp: number;
  duration: number;
  planner: string;
  hour: string;
  date: string;
  sport: string;
  check: boolean;
};

type DetachedDataProps = {
  children: React.ReactNode;
};

export function DetachedData({ children }: DetachedDataProps) {
  return (
    <View className="bg-gray-200 rounded-full px-2 py-1">
      <Text>{children}</Text>
    </View>
  );
}

export default function TaskCard(props: TaskCardProps) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [warnModalVisible, setWarnModalVisible] = useState(false);

  async function toggleSwitch() {
    setIsEnabled((previous) => !previous);
    const payload = {
      ...props,        // envia todas as props
      check: !isEnabled, // atualiza status no payload
    }
   await apiFetch({
    path: `/workouts/${props.id}`,
    method: "PUT",
    body: payload as any,  // se precisar, tipar corretamente
  });
  }

  const warn_days = ["frosty", "rainy", "thundering"];

  const warn = warn_days.includes(props.weather);

  // Changing Date format to American
  const dateObj = new Date(props.date);

  const formattedDate: string = dateObj.toLocaleDateString("en-US", {
    month: "long",   // April
    day: "numeric",  // 12
    year: "numeric", // 2025
  });

  return (
    <LinearGradient
      colors={warn ? ['#bcc3cd', '#FFFFFF'] : ['#FFFFFF', '#FFFFFF']} // vermelho intenso para amarelo
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      className="p-6 mb-2 w-full max-w-md mt-2 shadow-lg"
      style={styles.componentCard}
    >
      {/* Top row: date/hour + warn */}
      <View className="flex-row justify-between items-center mb-3">
        <View className="flex-row gap-3">
          <DetachedData>{formattedDate}</DetachedData>
        </View>
        {warn && (
          <View className="bg-red-600 rounded-2xl py-1 px-3">
            <Pressable onPress={() => setWarnModalVisible(true)}>

            <Text className="text-white font-bold text-sm">Warn</Text>
            </Pressable>
            <AlertModal
              visible={warnModalVisible}
              onClose={() => setWarnModalVisible(false)}
              title="Warn"
              message="The weather conditions present a certain risk, avoid such activities during this time."
            />
          </View>
        )}
      </View>

      {/* Divider */}
      <View className="border-b border-gray-400 mb-5" />

      {/* Bottom row: WeatherIcon + info + switch */}
      <View className="flex-row items-center justify-between gap-6 my-10">
        <View className="flex-row">
          <View className="flex-row gap-5">
            <View className="bg-gray-300 rounded-full px-4 py-2 justify-center">
              <Text className="text-lg font-bold">{props.temp}°C</Text>
            </View>

            <WeatherIcon weather={props.weather} size={50} />
          </View>

          <View className="px-2">
            <Text className="text-lg font-bold">{props.sport}</Text>
            <Text className="text-sm text-gray-500">{props.hour}</Text>
          </View>
        </View>

        <Switch
          trackColor={{ false: "#767577", true: "#2B526D" }}
          thumbColor={isEnabled ? "#81C5C5" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  componentCard: {
    borderRadius: 16,
  }
})