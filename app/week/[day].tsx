import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function DayScreen() {
  const { day } = useLocalSearchParams(); // "Monday", "Tuesday", etc.

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold">Day: {day}</Text>
    </View>
  );
}