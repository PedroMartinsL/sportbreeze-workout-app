import { View, FlatList } from "react-native";
import { useLocalSearchParams } from "expo-router";
import TaskCard from "@/components/TaskCard";

export default function DayScreen() {
  const { day } = useLocalSearchParams(); // "Monday", "Tuesday", etc.

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <FlatList data={require("@/data/tasks.json")} renderItem={({ item }) => <TaskCard
                  id={item.id}
                  day={item.day}
                  weather={item.weather}
                  kcal={item.kcal}
                  routine={item.routine}
                  temp={item.temp}
                  duration={item.duration}
                  planner={item.planner}
                  hora={item.hora}
                  date={item.date}
                  sport={item.sport}
                />}></FlatList>
    </View>
  );
}