import React, { useState } from "react";
import { View, Text, Switch } from "react-native";
import { WeatherIcon } from "./WeatherIcon";


export type TaskCardProps = {
  id: number,
  day: number,
  weather: string,
  kcal: number,
  routine: string,
  temp: number,
  duration: number,
  planner: string,
  hour: string,
  date: string,
  sport: string
};

export function DetachedData(props: { data: string }) {
  return (
    <View className="bg-gray-200 rounded-full px-2 py-1">
      <Text>{props.data}</Text>
    </View>
  );
}

export default function TaskCard(props: TaskCardProps) {

  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => setIsEnabled(previous => !previous);

  const warn_days = [
    "frosty",
    "rainy",
    "thundering",
  ]

  const warn = warn_days.includes(props.weather);

  return (
    <View
    className="bg-white rounded-xl p-6 mb-4 w-11/12 max-w-md shadow-lg mt-4"
    style={{
      elevation: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    }}
  >
    {/* Top row: date/hour + warn */}
    <View className="flex-row justify-between items-center mb-3">
      <View className="flex-row gap-3">
        <DetachedData data={props.date} />
        <DetachedData data={props.hour} />
      </View>
      {warn && (
        <View className="bg-red-600 rounded-2xl py-1 px-3">
          <Text className="text-white font-bold text-sm">Warn</Text>
        </View>
      )}
    </View>

    {/* Divider */}
    <View className="border-b border-gray-200 mb-4" />

    {/* Bottom row: WeatherIcon + info + switch */}
    <View className="flex-row items-center justify-between">
      <View className="bg-gray-300 rounded-full px-4 py-2">
        <Text className="text-lg font-bold">{props.temp}°C</Text>
      </View>

      <WeatherIcon weather={props.weather} size={50} />

      <View className="px-2">
        <Text className="text-lg font-bold">{props.sport}</Text>
        <Text className="text-sm text-gray-500">{props.hour}</Text>
      </View>

      <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={isEnabled ? "#81C5C5" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
    </View>
  </View>
  );
}