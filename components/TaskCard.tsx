import React from "react";
import { View, Text } from "react-native";
import { WeatherIcon } from "./WeatherIcon";


type TaskCardProps = {
    id: number,
    day: number,
    weather: string,
    kcal: number,
    routine: string,
    temp: number,
    duration: number,
    planner: string,
    hora: string,
    date: string,
    sport: string
};

export default function TaskCard(props: TaskCardProps) {

  return (
    <View className="border-4 border-black rounded-lg p-4 mb-2">
        <Text className="text-lg font-bold">{props.day}</Text>
        <WeatherIcon weather={props.weather} />
        <Text className="text-lg font-bold">{props.kcal}</Text>
        <Text className="text-lg font-bold">{props.temp}</Text>
        <Text className="text-lg font-bold">{props.duration}</Text>
        <Text className="text-lg font-bold">{props.planner}</Text>
        <Text className="text-lg font-bold">{props.hora}</Text>
        <Text className="text-lg font-bold">{props.date}</Text>
        <Text className="text-lg font-bold">{props.sport}</Text>
    </View>
  );
}

